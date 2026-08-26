import { test, expect } from '@playwright/test'

/**
 * Absolute privacy wording — review finding 4, re-derived from source.
 *
 * An earlier pass narrowed this to two items. That was under-derived: reading
 * every occurrence turns up SIX over-broad claims, and two of them are not
 * merely broad but FALSE BY DEFAULT.
 *
 *   Hero "No Data Collection"  — the website itself collects newsletter and
 *     contact-form data (NewsletterSignup / Contact POST to the email API, and
 *     Privacy Policy §4 documents it).
 *   og: + twitter: "100% private: nothing leaves your device" — unqualified.
 *   Help "By default, all your driving data stays on your phone" and
 *   Help "Local Only by default"  — FALSE BY DEFAULT on BOTH platforms:
 *     iOS AppMain.makeSharedModelContainer attempts CloudKit .private FIRST, so
 *     sync is on for anyone signed into iCloud; Android's exclude-only
 *     data_extraction_rules.xml leaves databases/ in Auto Backup, which is on by
 *     default.
 *   Help "Optional iCloud sync … If enabled" — same false default.
 *   Help "No third-party servers" — false on Android (Google Maps/Routes/Places,
 *     OpenWeather) though its three sub-items are all verified true.
 *
 * WHAT STAYS, because it is verified:
 *   Features "No tracking, ever"  — no analytics, no ad IDs, no telemetry.
 *   The AidOps-scoped "nothing leaves your device" in Help / Releases /
 *     WhatsNew — scoped to insight GENERATION, which does run on-device.
 *     Pinned below so this correction cannot over-swing and delete it.
 */

test.describe('No absolute data claim on the marketing surface', () => {
  test('Hero claims no blanket absence of data collection', async ({ page }) => {
    await page.goto('/')
    const hero = (await page.locator('section').first().textContent()) ?? ''
    expect(hero).not.toMatch(/No Data Collection/i)
  })

  for (const [label, sel] of [
    ['og:description', 'meta[property="og:description"]'],
    ['twitter:description', 'meta[name="twitter:description"]']
  ] as const) {
    test(`${label} makes no unqualified privacy absolute`, async ({ page }) => {
      await page.goto('/')
      const v = (await page.locator(sel).getAttribute('content')) ?? ''
      expect(v, label).not.toMatch(/nothing leaves your device/i)
      expect(v, label).not.toMatch(/100% priv/i)
    })
  }
})

test.describe('Help states the real default, not a false one', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
  })

  test('does not claim data stays on the phone by default', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/all your driving data\s+stays on your phone/i)
    expect(body).not.toMatch(/Local Only by default/i)
  })

  test('does not call iCloud sync optional or off by default', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Optional iCloud sync/i)
    expect(body).not.toMatch(/iCloud sync.{0,40}off by default/i)
  })

  test('does not claim there are no third-party servers', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/No third-party servers/i)
  })

  test('says instead that drives never reach Efficiver servers', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/never.{0,40}Efficiver'?s? servers/i)
  })
})

test.describe('Verified privacy claims are preserved', () => {
  test('Features keeps "No tracking, ever"', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    const f = (await page.locator('section#features').textContent()) ?? ''
    expect(f).toMatch(/No tracking, ever/i)
  })

  test('the AidOps-scoped on-device claim survives', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#whats-new').scrollIntoViewIfNeeded()
    const w = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(w).toMatch(/nothing leaves your device/i)
  })
})
