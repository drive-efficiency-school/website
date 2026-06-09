import { test, expect } from '@playwright/test'

/**
 * SEO / structured-data — verifies OG / Twitter / JSON-LD updated for
 * v1.3 messaging (no stale v1.2 / v1.1 / "Eco Route") and the M7 closure
 * (no fabricated aggregateRating).
 */

test.describe('index.html meta + structured data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('og:title references v1.3 (not earlier versions)', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
    expect(ogTitle).toMatch(/v1\.3/)
    expect(ogTitle).not.toMatch(/v1\.[12]\b/)
  })

  test('og:title does NOT reference "Eco Route" (H2)', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).not.toMatch(/Eco Route/i)
  })

  test('og:description mentions v1.3 flagship features', async ({ page }) => {
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content')
    expect(ogDesc).toBeTruthy()
    expect(ogDesc).toMatch(/CarPlay/i)
    expect(ogDesc).toMatch(/savings projection|Year Recap/i)
  })

  test('twitter:title references v1.3', async ({ page }) => {
    const twTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    expect(twTitle).toBeTruthy()
    expect(twTitle).toMatch(/v1\.3/)
    expect(twTitle).not.toMatch(/v1\.[12]\b/)
  })

  test('canonical URL points to https://www.efficiver.com', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe('https://www.efficiver.com')
  })

  test('robots meta = "index, follow"', async ({ page }) => {
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toBe('index, follow')
  })

  test('JSON-LD softwareVersion is "1.3"', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(jsonLd).toBeTruthy()
    const parsed = JSON.parse(jsonLd!)
    expect(parsed['@type']).toBe('MobileApplication')
    expect(parsed.softwareVersion).toBe('1.3')
  })

  test('JSON-LD does NOT contain aggregateRating block (M7)', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(jsonLd).toBeTruthy()
    const parsed = JSON.parse(jsonLd!)
    expect(parsed.aggregateRating).toBeUndefined()
  })

  test('JSON-LD declares the free offer (price 0)', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    const parsed = JSON.parse(jsonLd!)
    expect(parsed.offers?.price).toBe('0')
  })

  test('og:image points to /og-image.png', async ({ page }) => {
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toMatch(/og-image\.png$/)
  })
})
