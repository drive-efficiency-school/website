import { test, expect } from '@playwright/test'

/**
 * Route + status checks for every fake hash-route in the SPA.
 * Per src/App.vue, the routes are: '' (main), investors, terms,
 * privacy, accessibility, help, coming-soon, releases.
 */

const routes: Array<{ hash: string; identifier: string }> = [
  { hash: '', identifier: 'Efficiver' }, // Navbar wordmark always present
  // #investors intentionally absent — the route was removed (D2, findings 10/11).
  // e2e/11-traction-claims.spec.ts asserts it no longer resolves.
  { hash: '#terms', identifier: 'Terms of Use' },
  { hash: '#privacy', identifier: 'Privacy Policy' },
  { hash: '#accessibility', identifier: 'Accessibility at Efficiver' },
  { hash: '#help', identifier: 'Help & Support' },
  { hash: '#coming-soon', identifier: 'Coming Soon' },
  { hash: '#releases', identifier: 'Release' }
]

test.describe('SPA hash routes', () => {
  for (const route of routes) {
    test(`route "${route.hash || '/'}" renders ${route.identifier}`, async ({ page }) => {
      const response = await page.goto(`/${route.hash}`)
      expect(response?.status()).toBeLessThan(400)
      await expect(page.getByText(route.identifier, { exact: false }).first()).toBeVisible({
        timeout: 10_000
      })
    })
  }
})

test.describe('HTML semantic correctness', () => {
  test('no duplicate element IDs on the home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load') // NOT networkidle: the Turnstile widget keeps the network busy indefinitely
    const duplicates = await page.evaluate(() => {
      const seen = new Map<string, number>()
      document.querySelectorAll('[id]').forEach((el) => {
        const id = el.getAttribute('id')!
        seen.set(id, (seen.get(id) ?? 0) + 1)
      })
      return [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`)
    })
    expect(duplicates).toEqual([])
  })
})

test.describe('Static asset endpoints', () => {
  test('sitemap.xml returns XML with lastmod >= 2026-05-25', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<urlset')
    expect(body).toMatch(/<lastmod>2026-(0[5-9]|1[0-2])-\d{2}<\/lastmod>/)
  })

  test('robots.txt allows all crawlers + advertises sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('User-agent: *')
    expect(body).toContain('Allow: /')
    expect(body).toContain('Sitemap: https://www.efficiver.com/sitemap.xml')
  })

  test('Logo (Subline mark) loads', async ({ request }) => {
    const res = await request.get('/Logo-v1_Transparent.webp')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toMatch(/image\/webp/)
  })
})
