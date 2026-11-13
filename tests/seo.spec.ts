import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const pages = [
  ['/', 'Tien Huynh | Software Developer'],
  ['/projects/', 'Software Projects | Tien Huynh'],
  ['/certifications/', 'Certifications & Credentials | Tien Huynh'],
  ['/activities/', 'Community & Activities | Tien Huynh'],
]

for (const [path, title] of pages) {
  test(`static content and hydration: ${path}`, async ({ page, browser }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(new RegExp(title.replace(/[|]/g, '\\|')))
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `https://tienhuynh-tn.com${path}`)
    await expect(page.locator('head meta[name="description"]')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveCount(1)
    await page.screenshot({ path: test.info().outputPath('light.png') })
    await page.getByRole('button', { name: 'Toggle theme' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.screenshot({ path: test.info().outputPath('dark.png') })
    expect(errors).toEqual([])

    const context = await browser.newContext({ javaScriptEnabled: false })
    const staticPage = await context.newPage()
    await staticPage.goto(new URL(path, page.url()).href)
    await expect(staticPage.locator('h1')).toBeVisible()
    await expect(staticPage.locator('main')).not.toBeEmpty()
    expect(await staticPage.locator('main img:not([src])').count()).toBe(0)
    await context.close()
  })
}

test('navigation replaces metadata, including after back and forward', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'View all projects', exact: true }).click()
  await expect(page).toHaveTitle('Software Projects | Tien Huynh')
  await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1)
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://tienhuynh-tn.com/projects/')
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0)
  await page.goBack()
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', 'https://tienhuynh-tn.com/')
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1)
  await page.goForward()
  await expect(page).toHaveTitle('Software Projects | Tien Huynh')
})

test('redirects, anchors, and not-found metadata', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/credentials/')
  await expect(page).toHaveURL(/\/certifications\/$/)
  await page.goto('/#projects')
  await expect(page.locator('#projects')).toBeInViewport()
  await page.goto('/missing-seo-test')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('build artifacts expose metadata, discovery files and local images', async ({ request }) => {
  for (const [path] of pages) {
    const html = await readFile(`dist${path}index.html`, 'utf8')
    const head = html.split('</head>')[0]
    expect(head.match(/<title>/g)).toHaveLength(1)
    expect(head.match(/rel="canonical"/g)).toHaveLength(1)
    expect(head).toContain('name="twitter:card"')
    expect(html).toContain('<h1')
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) {
      expect((await request.get(match[1])).ok(), match[1]).toBe(true)
    }
  }
  const home = await readFile('dist/index.html', 'utf8')
  const json = home.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
  expect(JSON.parse(json!).mainEntity.name).toBe('Tien Huynh')
  const sitemap = await request.get('/sitemap.xml')
  const xml = await sitemap.text()
  expect(xml.match(/<loc>/g)).toHaveLength(4)
  expect(xml).not.toContain('/credentials')
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://tienhuynh-tn.com/sitemap.xml')
  expect((await request.get('/social-card.png')).headers()['content-type']).toContain('image/png')
  const missing = await readFile('dist/404.html', 'utf8')
  expect(missing).toContain('noindex, follow')
  expect(missing).not.toContain('rel="canonical"')
})


test('project search still works after hydration', async ({ page }) => {
  await page.goto('/projects/')
  const count = await page.locator('.projectCard').count()
  expect(count).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Search projects' }).click()
  await page.getByPlaceholder('Search title, organization, role, or tech').fill('no-such-project-seo-test')
  await expect(page.getByText('No matching projects found.')).toBeVisible()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await expect(page.locator('.projectCard')).toHaveCount(count)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://tienhuynh-tn.com/projects/')
})
