import { createHash, randomUUID } from 'node:crypto'
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import type { Plugin, ResolvedConfig } from 'vite'

const WIDTHS = [320, 640, 960, 1440, 1920]
const SETTINGS = { widths: WIDTHS, avif: 75, webp: 85, version: sharp.versions }
const RASTER = /\.(jpe?g|png|webp|avif)$/i
const MODULE_ID = 'virtual:image-manifest'
type Variant = { width: number; file: string; format: 'avif' | 'webp' }
type ImageInfo = { width: number; height: number; variants: Variant[] }

// Dev and production builds may run together. Readers must never observe a
// truncated file while another process updates a shared cache entry.
async function writeAtomic(file: string, data: string | Buffer) {
  const temporary = `${file}.${randomUUID()}.tmp`
  await writeFile(temporary, data)
  await rename(temporary, file)
}

async function readVariant(file: string) {
  // Also tolerate a briefly truncated cache left by a pre-upgrade dev process.
  for (let attempt = 0; ; attempt++) {
    try {
      const buffer = await readFile(file)
      if (buffer.length < 32) throw new Error(`Incomplete generated image: ${file}`)
      await sharp(buffer).metadata()
      return buffer
    } catch (error) {
      if (attempt === 3) throw error
      await new Promise((resolve) => setTimeout(resolve, 50 * 2 ** attempt))
    }
  }
}

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  }))
  return files.flat().sort()
}

// Original imports remain authoritative. This manifest adds optional derivatives
// without requiring a content-data migration or changing existing URLs.
export default function imagePipeline(): Plugin {
  let config: ResolvedConfig
  let images: { file: string; info: ImageInfo }[] = []
  let cacheDirectory: string
  const emitted = new Map<string, string>()

  async function generate() {
    sharp.concurrency(1)
    sharp.cache({ memory: 32, files: 0, items: 32 })
    cacheDirectory = path.join(config.root, '.cache/images')
    await mkdir(cacheDirectory, { recursive: true })
    const files = (await Promise.all([
      walk(path.join(config.root, 'src/assets')),
      walk(config.publicDir),
    ])).flat().filter((file) => RASTER.test(file))
    const records: typeof images = new Array(files.length)
    let next = 0
    let finished = 0
    const byContent = new Map<string, Promise<ImageInfo>>()
    async function optimize(file: string, input: Buffer, hash: string): Promise<ImageInfo> {
      const metadataFile = path.join(cacheDirectory, `${hash}.json`)
      try {
        const cached = JSON.parse(await readFile(metadataFile, 'utf8')) as ImageInfo
        await Promise.all(cached.variants.map(async (variant) => {
          const bytes = await readFile(path.join(cacheDirectory, variant.file))
          if (bytes.length < 32) throw new Error('Incomplete image cache')
        }))
        return cached
      } catch { /* New source/settings or incomplete cache: regenerate. */ }
      const metadata = await sharp(input).metadata()
      if (!metadata.width || !metadata.height) throw new Error(`Missing dimensions: ${file}`)
      const rotated = [5, 6, 7, 8].includes(metadata.orientation ?? 1)
      const width = rotated ? metadata.height : metadata.width
      const height = rotated ? metadata.width : metadata.height
      const info: ImageInfo = { width, height, variants: [] }
      // Animated images keep their original playback and are not flattened.
      if ((metadata.pages ?? 1) <= 1) {
        const widths = [...new Set(WIDTHS.map((candidate) => Math.min(candidate, width)))]
        for (const targetWidth of widths) {
          for (const format of ['avif', 'webp'] as const) {
            const pipeline = sharp(input).autoOrient().resize({ width: targetWidth, withoutEnlargement: true })
            const output = await (format === 'avif'
              ? pipeline.avif({ quality: SETTINGS.avif, effort: 4 })
              : pipeline.webp({ quality: SETTINGS.webp, effort: 4 })).toBuffer()
            if (output.length >= input.length) continue
            const name = `${hash}-${targetWidth}.${format}`
            await writeAtomic(path.join(cacheDirectory, name), output)
            info.variants.push({ width: targetWidth, file: name, format })
          }
        }
      }
      await writeAtomic(metadataFile, JSON.stringify(info))
      return info
    }
    async function worker() {
      while (next < files.length) {
        const index = next++
        const file = files[index]
        const input = await readFile(file)
        const hash = createHash('sha256').update(input).update(JSON.stringify(SETTINGS)).digest('hex').slice(0, 24)
        let pending = byContent.get(hash)
        if (!pending) {
          pending = optimize(file, input, hash)
          byContent.set(hash, pending)
        }
        records[index] = { file, info: await pending }
        if (++finished % 20 === 0) config.logger.info(`[images] ${finished}/${files.length} ready`)
      }
    }
    await Promise.all([worker(), worker()])
    images = records
    config.logger.info(`[images] ${files.length} originals preserved; responsive variants ready`)
  }

  return {
    name: 'responsive-images',
    configResolved(resolved) { config = resolved },
    async buildStart() {
      await generate()
      emitted.clear()
      if (config.command !== 'build') return
      for (const { info } of images) {
        for (const variant of info.variants) {
          if (!emitted.has(variant.file)) {
            const reference = this.emitFile({
              type: 'asset', name: variant.file,
              source: await readVariant(path.join(cacheDirectory, variant.file)),
            })
            emitted.set(variant.file, reference)
          }
        }
      }
    },
    resolveId(id) { if (id === MODULE_ID) return `\0${MODULE_ID}` },
    load(id) {
      if (id !== `\0${MODULE_ID}`) return
      const imports: string[] = []
      const records = images.map(({ file, info }, index) => {
        const publicFile = file.startsWith(`${config.publicDir}${path.sep}`)
        let key: string
        if (publicFile) {
          key = `import.meta.env.BASE_URL + ${JSON.stringify(path.relative(config.publicDir, file).split(path.sep).join('/'))}`
        } else {
          imports.push(`import image${index} from ${JSON.stringify(`/${path.relative(config.root, file).split(path.sep).join('/')}`)}`)
          key = `image${index}`
        }
        const variants = info.variants.map((variant) => {
          const url = config.command === 'build'
            ? `import.meta.ROLLUP_FILE_URL_${emitted.get(variant.file)}`
            : `import.meta.env.BASE_URL + ${JSON.stringify(`__images/${variant.file}`)}`
          return `{width:${variant.width},format:${JSON.stringify(variant.format)},src:${url}}`
        })
        return `[${key}]:{width:${info.width},height:${info.height},variants:[${variants.join(',')}]}`
      })
      return `${imports.join('\n')}\nexport default {${records.join(',')}}`
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = request.url?.split('?')[0] ?? ''
        const localPath = config.base !== '/' && pathname.startsWith(config.base)
          ? `/${pathname.slice(config.base.length)}` : pathname
        const filename = localPath.match(/^\/__images\/([a-f0-9]{24}-\d+\.(?:avif|webp))$/)?.[1]
        if (!filename) return next()
        void readVariant(path.join(cacheDirectory, filename)).then((buffer) => {
          response.setHeader('Content-Type', filename.endsWith('.avif') ? 'image/avif' : 'image/webp')
          response.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          response.end(buffer)
        }).catch(() => { response.statusCode = 404; response.end() })
      })
    },
    async handleHotUpdate(context) {
      if (!RASTER.test(context.file)) return
      await generate()
      const module = context.server.moduleGraph.getModuleById(`\0${MODULE_ID}`)
      if (module) context.server.moduleGraph.invalidateModule(module)
      context.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
