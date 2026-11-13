import { expect, test, type Page } from '@playwright/test'

async function openGallery(page: Page) {
  await page.goto('activities')
  await page.locator('.activityCardButton').filter({ hasText: 'Sea x OpenAI Codex Hackathon' }).click()
  const first = page.locator('.activityModalGalleryItem').first()
  await first.scrollIntoViewIfNeeded()
  return first.locator('img')
}

test('responsive images defer offscreen downloads and load only the selected original', async ({ page }) => {
  const originals: string[] = []
  page.on('request', (request) => {
    if (request.resourceType() === 'image' && /\/assets\/.*\.(jpe?g|png)$/.test(request.url())) {
      originals.push(request.url())
    }
  })
  await page.goto('activities')
  const lazyImages = page.locator('img.activityCardImage[loading="lazy"]')
  await expect.poll(() => lazyImages.count()).toBeGreaterThan(0)
  // Native lazy loading keeps URLs crawlable while deferring distant images.
  await expect.poll(() => lazyImages.evaluateAll((images) =>
    images.filter((image) => !(image as HTMLImageElement).complete).length
  )).toBeGreaterThan(0)
  const image = await openGallery(page)
  await expect(image).toHaveAttribute('data-image-state', 'loaded')
  expect(await image.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.avif$/)
  expect(originals).toHaveLength(0)
  const slotCount = await page.locator('.activityModalGalleryItem').count()
  await image.click()
  const original = page.locator('.imageLightboxImage')
  await expect(original).toHaveAttribute('data-image-state', 'loaded')
  expect(await original.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.jpg$/)
  expect(originals).toHaveLength(1)
  await page.getByRole('button', { name: 'Show next image', exact: true }).click()
  await expect(page.locator('.imageLightboxImage')).toHaveAttribute('data-image-state', 'loaded')
  expect(originals).toHaveLength(2)
  await page.getByRole('button', { name: 'Close image preview' }).click()
  await expect(page.locator('.activityModalGalleryItem')).toHaveCount(slotCount)
})

test('temporary errors retry with backoff and recover', async ({ page }) => {
  const times = new Map<string, number[]>()
  const attempts = new Map<string, number>()
  await page.route('**/*.avif', async (route) => {
    const url = route.request().url()
    const count = (attempts.get(url) ?? 0) + 1
    attempts.set(url, count)
    const history = times.get(url) ?? []
    history.push(Date.now())
    times.set(url, history)
    if (count <= 2) {
      await route.abort('failed')
    } else await route.continue()
  })
  await openGallery(page)
  // The cover is also on the listing card; use a gallery-only photo so two
  // independent components cannot contribute attempts to the same URL.
  const image = page.locator('.activityModalGalleryItem').nth(1).locator('img')
  await image.scrollIntoViewIfNeeded()
  await expect(image).toHaveAttribute('data-image-state', 'loaded')
  const currentSrc = await image.evaluate((img: HTMLImageElement) => img.currentSrc)
  expect(currentSrc).toMatch(/\.avif$/)
  expect(attempts.get(currentSrc)).toBe(3)
  const history = times.get(currentSrc)!
  expect(history[1] - history[0]).toBeGreaterThanOrEqual(450)
  expect(history[2] - history[1]).toBeGreaterThanOrEqual(1400)
})

test('missing AVIF falls back to WebP', async ({ page }) => {
  await page.route('**/*.avif', (route) => route.abort('failed'))
  const image = await openGallery(page)
  await expect(image).toHaveAttribute('data-image-state', 'loaded')
  expect(await image.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.webp$/)
})

test('missing optimized assets fall back to the original', async ({ page }) => {
  await page.route(/\.(avif|webp)$/, (route) => route.abort('failed'))
  const image = await openGallery(page)
  await expect(image).toHaveAttribute('data-image-state', 'loaded')
  expect(await image.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.jpg$/)
})

test('permanent errors keep gallery slots and stop retrying after close', async ({ page }) => {
  let requests = 0
  await page.route(/\.(avif|webp|jpg)$/, (route) => {
    requests++
    return route.abort('failed')
  })
  const image = await openGallery(page)
  const count = await page.locator('.activityModalGalleryItem').count()
  const before = await image.boundingBox()
  await expect(image).toHaveAttribute('data-image-state', 'error')
  await expect(page.locator('.activityModalGalleryItem')).toHaveCount(count)
  expect(await image.boundingBox()).toEqual(before)
  await page.getByRole('button', { name: 'Close activity details' }).click()
  await page.waitForTimeout(250)
  const afterClose = requests
  await page.waitForTimeout(2200)
  expect(requests).toBe(afterClose)
})

test('mobile/desktop image bounds, themes, projects, certificates and legacy redirect', async ({ page }) => {
  const image = await openGallery(page)
  await expect(image).toHaveAttribute('data-image-state', 'loaded')
  for (const theme of ['light', 'dark']) {
    await page.evaluate((value) => { document.documentElement.dataset.theme = value }, theme)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const bounds = await image.boundingBox()
    expect(bounds!.width).toBeGreaterThan(100)
    expect(bounds!.width / bounds!.height).toBeCloseTo(4 / 3, 1)
  }
  await page.goto('projects')
  await page.locator('.projectCard button').first().click()
  await expect(page.locator('.projectModalImage')).toHaveAttribute('data-image-state', 'loaded')
  await expect(page.locator('.projectModalImage')).toHaveAttribute('fetchpriority', 'high')
  await page.goto('credentials')
  await expect(page).toHaveURL(/\/certifications\/$/)
  await page.locator('.certificationBadgeTile').first().click()
  await expect(page.locator('.certificationPreviewPdf')).toBeVisible()
  await page.goto('certifications')
  await page.locator('.certificationBadgeTile').filter({ hasText: 'Google AI' }).first().click()
  await expect(page.locator('.certificationPreviewImage')).toHaveAttribute('data-image-state', 'loaded')
  await expect(page.locator('.certificationPreviewImage')).toHaveAttribute('fetchpriority', 'high')
})

test('listing images prioritize the first row and preserve lazy homepage sections', async ({ page }) => {
  for (const width of [390, 587, 601, 768, 892, 901, 1024, 1079, 1196, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const [route, selector] of [
      ['projects', '.projectCard img'],
      ['activities', '.activityCardImage'],
      ['certifications', '.certificationIssuerLogo'],
    ]) {
      await page.goto(route)
      await expect(page.locator(selector).first()).toHaveAttribute('fetchpriority', 'high')
      await expect.poll(() => page.locator(selector).evaluateAll(images => {
        const firstTop = images[0].getBoundingClientRect().top
        return images.every(image => {
          const img = image as HTMLImageElement
          const inFirstRow = Math.abs(img.getBoundingClientRect().top - firstTop) < 5
          return img.loading === (inFirstRow ? 'eager' : 'lazy')
        })
      })).toBe(true)
      expect(await page.locator(`${selector}[fetchpriority="high"]`).count()).toBe(1)
    }
  }
  await page.goto('/')
  await expect(page.locator('.projectCard img').first()).toHaveAttribute('loading', 'lazy')
  await expect(page.locator('.projectCard img').first()).toHaveAttribute('fetchpriority', 'auto')
})

test('small logos and mobile activity photos use fitting responsive variants', async ({ page }, testInfo) => {
  await page.goto('certifications')
  const logo = page.locator('.certificationIssuerLogo').first()
  await expect(logo).toHaveAttribute('data-image-state', 'loaded')
  expect(await logo.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/-80-[^/]+\.avif$/)
  await page.goto('activities')
  const photo = page.locator('.activityCardImage').nth(1)
  await expect(photo).toHaveAttribute('data-image-state', 'loaded')
  const expected = testInfo.project.name === 'mobile' ? 768 : 320
  expect(await photo.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(new RegExp(`-${expected}-[^/]+\\.avif$`))
})

test('full-resolution viewer reports loading and failure without replacing the original', async ({ page }) => {
  const image = await openGallery(page)
  let release!: () => void
  const pending = new Promise<void>(resolve => { release = resolve })
  await page.route('**/*.jpg', async route => {
    await pending
    await route.continue()
  })
  await image.click()
  await expect(page.getByRole('status')).toHaveText('Loading full-resolution photo…')
  const original = page.locator('.imageLightboxImage')
  await expect(original).toHaveAttribute('fetchpriority', 'high')
  expect(await original.getAttribute('src')).toMatch(/\.jpg$/)
  expect(await original.getAttribute('srcset')).toBeNull()
  release()
  await expect(original).toHaveAttribute('data-image-state', 'loaded')
  await expect(page.getByRole('status')).toHaveCount(0)
  await page.unroute('**/*.jpg')
  await page.route('**/*.jpg', route => route.abort('failed'))
  await page.getByRole('button', { name: 'Show next image', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('Loading full-resolution photo…')
  await expect(page.getByRole('status')).toHaveText('This photo could not load. Please try opening it again.')
  await expect(original).toBeHidden()
  await expect(page.locator('.imageLightboxImageWrap')).toHaveAttribute('aria-busy', 'false')
  await page.getByRole('button', { name: 'Close image preview' }).click()
  await expect(page.locator('.imageLightboxOverlay')).toHaveCount(0)
})
