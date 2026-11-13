import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

// Use the same production preview, settings and script for before/after runs.
// Local measurements exclude CDN latency. Incomplete downloads stay incomplete.
const base = (process.env.IMAGE_TEST_URL || 'http://127.0.0.1:4173').replace(/\/$/, '')
const repeats = Number(process.env.IMAGE_TEST_REPEATS || 5)
const widths = (process.env.IMAGE_TEST_WIDTHS || '390,1440').split(',').map(Number)
const scenarios = (process.env.IMAGE_TEST_SCENARIOS || 'home,projects,certifications,activities,scroll,gallery,project-preview,certificate-preview,original').split(',')
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROME_PATH || undefined })
const results = []
const report = process.env.IMAGE_TEST_REPORT || path.join(tmpdir(), 'image-measurements.json')
const routes = { home: '/', projects: '/projects/', certifications: '/certifications/', activities: '/activities/', scroll: '/', gallery: '/activities/', 'project-preview': '/projects/', 'certificate-preview': '/certifications/', original: '/activities/' }
async function visit(page, scenario) {
  await page.goto(`${base}${routes[scenario]}`, { waitUntil: 'domcontentloaded' })
  await page.locator('h1').first().waitFor()
  let selector = 'img'
  if (scenario === 'scroll') {
    await page.locator('#activities').scrollIntoViewIfNeeded()
  } else if (scenario === 'gallery' || scenario === 'original') {
    await page.locator('.activityCardButton').filter({ hasText: 'Sea x OpenAI Codex Hackathon' }).click()
    await page.locator('.activityModalGallery').scrollIntoViewIfNeeded()
    selector = '.activityModalGallery img'
    if (scenario === 'original') {
      await page.locator('.activityModalGalleryItem').first().click()
      selector = '.imageLightboxImage'
    }
  } else if (scenario === 'project-preview') {
    await page.locator('.projectCard button').first().click()
    selector = '.projectModalImage'
  } else if (scenario === 'certificate-preview') {
    await page.locator('.certificationBadgeTile').filter({ hasText: 'Google AI' }).first().click()
    selector = '.certificationPreviewImage'
  }
  const start = await page.evaluate(() => performance.now())
  const completed = await page.waitForFunction((selector) => {
    const visible = [...document.querySelectorAll(selector)].filter(i => {
      const rect = i.getBoundingClientRect()
      return rect.width > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth
    })
    return visible.length > 0 && visible.every(i => i.complete && i.naturalWidth > 0)
  }, selector, { timeout: 10_000 }).then(() => true, () => false)
  return { selector, start, completed }
}
try {
  for (const width of widths) {
    for (const scenario of scenarios) {
      for (let repeat = 0; repeat < repeats; repeat++) {
        const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: width === 390 ? 2 : 1 })
        const page = await context.newPage()
        const cdp = await context.newCDPSession(page)
        await cdp.send('Network.enable')
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 100_000 })
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
        let bytes = 0
        const imageIds = new Set()
        cdp.on('Network.requestWillBeSent', e => { if (e.type === 'Image') imageIds.add(e.requestId) })
        cdp.on('Network.dataReceived', e => { if (imageIds.has(e.requestId)) bytes += e.encodedDataLength })
        await page.addInitScript(() => {
          window.imageMetrics = { lcp: 0, cls: 0, loaded: {} }
          document.addEventListener('load', event => {
            if (event.target instanceof HTMLImageElement) window.imageMetrics.loaded[event.target.currentSrc] = performance.now()
          }, true)
          new PerformanceObserver(list => { for (const e of list.getEntries()) window.imageMetrics.lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
          new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.imageMetrics.cls += e.value }).observe({ type: 'layout-shift', buffered: true })
        })
        for (const cache of ['cold', 'warm']) {
          // Warm is the same context revisiting the same scenario, with caching enabled.
          bytes = 0
          imageIds.clear()
          const { selector, start, completed } = await visit(page, scenario)
          await page.waitForTimeout(200)
          const metrics = await page.evaluate(({ selector, start }) => {
            const images = [...document.querySelectorAll(selector)].map(i => {
              const r = i.getBoundingClientRect()
              return { src: i.currentSrc, complete: i.complete && i.naturalWidth > 0, visible: r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth, width: r.width, naturalWidth: i.naturalWidth, loadedAt: window.imageMetrics.loaded[i.currentSrc] ?? null }
            })
            const visible = images.filter(i => i.visible)
            const allLoaded = visible.length > 0 && visible.every(i => i.complete && i.loadedAt !== null)
            const lastLoad = allLoaded ? Math.max(...visible.map(i => i.loadedAt)) : null
            return { lcp: window.imageMetrics.lcp, cls: window.imageMetrics.cls, visibleCompleteMs: lastLoad, actionWaitMs: lastLoad === null ? null : Math.max(0, lastLoad - start), images }
          }, { selector, start })
          results.push({ width, scenario, repeat, cache, completed, receivedImageBytes: bytes, ...metrics })
        }
        await context.close()
      }
      console.log(JSON.stringify({ width, scenario, runs: repeats, completed: results.filter(r => r.width === width && r.scenario === scenario && r.completed).length }))
      await writeFile(report, JSON.stringify(results, null, 2))
    }
  }
  console.log(`Saved ${results.length} samples to ${report}`)
} finally { await browser.close() }
