import { build } from 'vite'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

// Compile the same components and image manifest used by the browser build.
await build({
  build: {
    ssr: 'src/entry-server.ts',
    outDir: '.cache/seo',
    emptyOutDir: true,
    copyPublicDir: false,
    ssrEmitAssets: true,
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
})
const { render, pages, SITE_URL } = await import(pathToFileURL(resolve('.cache/seo/entry-server.mjs')).href)
const template = await readFile('dist/index.html', 'utf8')
function documentFor(path) {
  let content = render(path)
  const head = []
  // React 19 hoists title/meta/link nodes in its server output. Place these in
  // the document head so non-JavaScript crawlers see the same route metadata.
  content = content.replace(/<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*\/>|<link\b[^>]*\/>/g, (tag) => {
    head.push(tag)
    return ''
  })
  return template.replace('<!--seo-head-->', head.join('\n    '))
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true" data-render-path="${path}">${content}</div>`)
}
for (const path of Object.keys(pages)) {
  const directory = `dist${path}`
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}index.html`, documentFor(path))
}
await writeFile('dist/404.html', documentFor('/404'))
await mkdir('dist/credentials', { recursive: true })
await writeFile('dist/credentials/index.html', `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/certifications/"><link rel="canonical" href="${SITE_URL}/certifications/"><title>Certifications | Tien Huynh</title></head><body><a href="/certifications/">View certifications</a></body></html>`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map((path) => `\n  <url><loc>${SITE_URL}${path}</loc></url>`).join('')}\n</urlset>\n`)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
// A reproducible typography-based card using the portfolio's existing palette.
const logo = (await readFile('public/logo-dark.png')).toString('base64')
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#0a0a0a"/><rect x="72" y="76" width="7" height="478" rx="3" fill="#60a5fa"/>
<image href="data:image/png;base64,${logo}" x="970" y="80" width="140" height="140"/>
<g font-family="Arial, sans-serif"><text x="120" y="205" fill="#93c5fd" font-size="26">PORTFOLIO</text>
<text x="115" y="303" fill="#ffffff" font-size="78" font-weight="bold">Tien Huynh</text>
<text x="120" y="368" fill="#e5e7eb" font-size="36">Software Developer</text>
<text x="120" y="440" fill="#a3a3a3" font-size="25">Projects · Certifications · Community</text>
<text x="120" y="538" fill="#93c5fd" font-size="24">tienhuynh-tn.com</text></g></svg>`)).png().toFile('dist/social-card.png')
console.log('[seo] Generated four static pages, redirect, 404, sitemap, robots and sharing image')
