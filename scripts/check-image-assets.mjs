import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const directory = process.argv[2] || 'dist'
const files = (await readdir(path.join(directory, 'assets'))).filter((file) => /\.(avif|webp)$/.test(file))
assert(files.length > 0, 'Build images before checking the artifact')
let bytes = 0
for (const file of files) {
  const input = await readFile(path.join(directory, 'assets', file))
  assert(input.length > 32, `Empty or truncated image: ${file}`)
  const metadata = await sharp(input).metadata()
  const variant = file.match(/^([a-f0-9]{24})-(\d+)-.*\.(avif|webp)$/)
  assert(variant, `Unexpected generated filename: ${file}`)
  const source = JSON.parse(await readFile(`.cache/images/${variant[1]}.json`, 'utf8'))
  assert.equal(metadata.width, Number(variant[2]), file)
  assert(metadata.width <= source.width, `Upscaled image: ${file}`)
  assert(metadata.width <= 1920 && metadata.height > 0, file)
  bytes += input.length
}
console.log(`${files.length} valid responsive images; ${bytes} bytes; no empty files or upscaling`)
