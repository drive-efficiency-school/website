import { test, expect } from '@playwright/test'

/**
 * Anti-spam honeypot presence — guards against the decoy field ever
 * becoming visible (which would let real users fill it and get silently
 * dropped). The Turnstile widget itself loads from Cloudflare's CDN and is
 * hostname-bound, so it's verified live in dev/prod rather than here.
 */
test.describe('Anti-spam honeypot fields', () => {
  test('contact form carries a hidden honeypot input', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#contact').scrollIntoViewIfNeeded()
    await expect(page.locator('section#contact')).toBeVisible()

    const honeypot = page.locator('section#contact input#website')
    await expect(honeypot).toHaveCount(1)
    await expect(honeypot).toBeHidden()
  })

  test('newsletter form carries a hidden honeypot input', async ({ page }) => {
    await page.goto('/')
    await page
      .locator('section#newsletter')
      .scrollIntoViewIfNeeded()
      .catch(() => undefined)

    const honeypot = page.locator('section#newsletter input#newsletter-website')
    await expect(honeypot).toHaveCount(1)
    await expect(honeypot).toBeHidden()
  })
})
