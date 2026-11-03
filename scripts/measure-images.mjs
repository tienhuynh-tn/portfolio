import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

// Run against an already running production preview. Keep settings identical
// before/after; local results do not include internet/CDN latency.
const base = process.env.IMAGE_TEST_URL || 'http://127.0.0.1:4173'
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROME_PATH || undefined,
})
const results = []
try {
  for (const width of [390, 1440]) {
    for (const scenario of (process.env.IMAGE_TEST_SCENARIOS || 'home,activities,gallery').split(',')) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 })
      const page = await context.newPage()
      const cdp = await context.newCDPSession(page)
      await cdp.send('Network.enable')
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 100_000,
      })
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
      const requests = new Map()
      cdp.on('Network.requestWillBeSent', ({ requestId, type, request }) => {
        if (type === 'Image') requests.set(requestId, { url: request.url, status: null, bytes: 0 })
      })
      cdp.on('Network.responseReceived', ({ requestId, type, response }) => {
        if (type === 'Image') {
          const request = requests.get(requestId)
          requests.set(requestId, { url: response.url, status: response.status, bytes: request?.bytes ?? 0 })
        }
      })
      cdp.on('Network.dataReceived', ({ requestId, encodedDataLength }) => {
        const request = requests.get(requestId)
        if (request) request.bytes += encodedDataLength
      })
      await page.addInitScript(() => {
        window.imageMetrics = { lcp: 0, cls: 0 }
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.imageMetrics.lcp = entry.startTime
        }).observe({ type: 'largest-contentful-paint', buffered: true })
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.imageMetrics.cls += entry.value
          }
        }).observe({ type: 'layout-shift', buffered: true })
      })
      await page.goto(`${base}${scenario === 'home' ? '/' : '/activities'}`, { waitUntil: 'domcontentloaded' })
      await page.locator(scenario === 'home' ? 'h1' : '.activityCardButton').first().waitFor()
      if (scenario === 'gallery') {
        await page.locator('.activityCardButton').filter({ hasText: 'Sea x OpenAI Codex Hackathon' }).click()
        await page.locator('.activityModalGallery').scrollIntoViewIfNeeded()
      }
      await page.waitForTimeout(10_000)
      const metrics = await page.evaluate(() => ({
        ...window.imageMetrics,
        images: [...document.images].map((img) => ({
          src: img.currentSrc, complete: img.complete && img.naturalWidth > 0,
          width: img.naturalWidth, height: img.naturalHeight,
          visible: img.getBoundingClientRect().bottom > 0 && img.getBoundingClientRect().top < innerHeight,
        })),
        resources: performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'img')
          .map((r) => ({ url: r.name, duration: r.duration, bytes: r.transferSize })),
      }))
      const imageRequests = [...requests.values()]
      results.push({ width, scenario, ...metrics, imageRequests,
        receivedImageBytes: imageRequests.reduce((total, r) => total + r.bytes, 0) })
      console.log(JSON.stringify({ width, scenario, bytes: results.at(-1).receivedImageBytes,
        requests: imageRequests.length, lcp: metrics.lcp, cls: metrics.cls,
        visibleComplete: metrics.images.filter((i) => i.visible && i.complete).length }))
      await page.screenshot({ path: path.join(process.env.IMAGE_TEST_SCREENSHOTS || tmpdir(), `images-${process.env.IMAGE_TEST_LABEL || 'run'}-${scenario}-${width}.png`) })
      await context.close()
    }
  }
  await writeFile(process.env.IMAGE_TEST_REPORT || path.join(tmpdir(), 'image-measurements.json'), JSON.stringify(results, null, 2))
} finally {
  await browser.close()
}
