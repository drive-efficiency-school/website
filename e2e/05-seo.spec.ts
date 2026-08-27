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

  // Titles are deliberately VERSION-FREE from v1.5 (owner call 2026-07-27).
  // A version baked into the share title goes stale the moment the next
  // release ships and is cached by every social scraper — version news
  // belongs in the description and on the Releases page. This test replaces
  // the old "og:title references v1.3" pin, which had already gone stale
  // through v1.4 and would go stale again every release.
  test('og:title carries NO version number', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).toBeTruthy()
    expect(ogTitle).not.toMatch(/v?\d+\.\d+/)
    expect(ogTitle).toMatch(/Efficiver/i)
  })

  test('og:title does NOT reference "Eco Route" (H2)', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    expect(ogTitle).not.toMatch(/Eco Route/i)
  })

  test('og:description carries the evergreen product pitch', async ({ page }) => {
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute('content')
    expect(ogDesc).toBeTruthy()
    expect(ogDesc).toMatch(/CarPlay/i)
    expect(ogDesc).toMatch(/AI insights|forecast/i)
    // SECOND CONTRACT FLIP (v2 review §3.7 + §3.1). The first flip required
    // "never reach Efficiver's servers" as an unqualified absolute - correct
    // against the earlier "nothing leaves your device" claim, but itself still
    // false once Fleet is accounted for: on-duty drives ARE uploaded to a
    // fleet a driver has chosen to join. Scoped again, banned in both
    // directions once more so neither phrasing can drift back silently.
    expect(ogDesc).not.toMatch(/nothing leaves your device/i)
    expect(ogDesc).not.toMatch(/never reach Efficiver's servers/i)
    expect(ogDesc).toMatch(/no data leaves your phone unless you join a fleet/i)
    expect(ogDesc).toMatch(/no ads, no analytics/i)
    // §3.7: Year Recap and the full forecast are Pro-gated ("coming soon") -
    // the metadata must not present them as unconditionally available today.
    expect(ogDesc).not.toMatch(/\bYear Recap\b/i)
  })

  test('twitter:title carries NO version number', async ({ page }) => {
    const twTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    expect(twTitle).toBeTruthy()
    expect(twTitle).not.toMatch(/v?\d+\.\d+/)
    expect(twTitle).toMatch(/Efficiver/i)
  })

  test('canonical URL points to https://www.efficiver.com', async ({ page }) => {
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe('https://www.efficiver.com')
  })

  test('robots meta = "index, follow"', async ({ page }) => {
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    expect(robots).toBe('index, follow')
  })

  test('JSON-LD softwareVersion is "1.5"', async ({ page }) => {
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(jsonLd).toBeTruthy()
    const parsed = JSON.parse(jsonLd!)
    expect(parsed['@type']).toBe('MobileApplication')
    expect(parsed.softwareVersion).toBe('1.5')
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
