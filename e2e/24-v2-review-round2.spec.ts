import { test, expect } from '@playwright/test'

/**
 * Second-round review (Efficiver_Website_Content_Review_Feedback_v2.0.md),
 * items not already covered by an existing spec's own pin. Every claim below
 * was re-derived from source before fixing, per house rule — not taken on the
 * doc's word.
 */

test.describe('§3.1 Privacy wording', () => {
  test('FAQ answer on data safety mentions Fleet', async ({ page }) => {
    await page.goto('/')
    const trigger = page.locator('section#faq button', { hasText: 'Is my data safe' })
    await trigger.click()
    const answer = (await page.locator('section#faq').textContent()) ?? ''
    expect(answer).toMatch(/Efficiver Fleet/i)
    expect(answer).not.toMatch(/iCloud sync is optional/i)
  })

  test('Privacy Policy Summary drops the unverified Fleet-usage minimisation', async ({ page }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/which almost nobody does/i)
  })

  test('Privacy Policy Summary reconciles "except your own fleet" with the weather/maps disclosure two bullets earlier', async ({
    page
  }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/weather and maps providers above/i)
  })
})

test.describe('§3.2 iCloud consolidation', () => {
  test('Help never says iCloud sync is "off by default", in either of its two mentions', async ({
    page
  }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help & Support for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/[Oo]ff by default/)
    expect(body).not.toMatch(/[Oo]ptional and off/)
  })

  test('Help states the real default consistently: no separate switch, syncs while signed in', async ({
    page
  }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help & Support for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/no separate switch/i)
    expect(body).toMatch(/managed by iOS/i)
  })
})

test.describe('§3.3 Fuel/emissions and §3.5 offline wording', () => {
  test('Hero no longer states fuel/emissions as a present-tense capability', async ({ page }) => {
    await page.goto('/')
    const hero = (await page.locator('section').first().textContent()) ?? ''
    expect(hero).not.toMatch(/designed to reduce emissions/i)
    // "smoother" - the D9 replacement for a safety claim - must survive the rewrite.
    expect(hero).toMatch(/smoother/i)
  })

  test('Hero screenshot alt text says "estimated", not "savings"', async ({ page }) => {
    await page.goto('/')
    const alts = await page
      .locator('img[src^="screen-"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('alt')))
    expect(alts.join(' ')).toMatch(/estimated fuel and CO2 metrics/i)
    expect(alts.join(' ')).not.toMatch(/fuel savings metrics/i)
  })

  test('Features intro scopes offline to core recording/scoring, not "all without needing internet or hardware"', async ({
    page
  }) => {
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    const f = (await page.locator('section#features').textContent()) ?? ''
    expect(f).not.toMatch(/all without needing internet or hardware/i)
    expect(f).toMatch(/no internet connection or extra vehicle hardware/i)
  })
})

test.describe('§3.4 Residual safety positioning', () => {
  test('Hero logo alt text drops "safe driving"', async ({ page }) => {
    await page.goto('/')
    const alt = await page.locator('img[src*="Logo-v1"]').getAttribute('alt')
    expect(alt).not.toMatch(/safe driving/i)
    expect(alt).toMatch(/phone-based driving efficiency coach/i)
  })

  test('meta keywords drop "safe driving"', async ({ page }) => {
    await page.goto('/')
    const keywords = await page.locator('meta[name="keywords"]').getAttribute('content')
    expect(keywords).not.toMatch(/safe driving/i)
  })
})

test.describe('§3.6 Pricing and hero reconciliation', () => {
  test('Hero badges match Pricing\'s own "free forever" framing, no false urgency', async ({
    page
  }) => {
    await page.goto('/')
    const hero = (await page.locator('section').first().textContent()) ?? ''
    expect(hero).not.toMatch(/Limited Time Offer/i)
    expect(hero).toMatch(/Free Forever/i)
    expect(hero).toMatch(/Free for personal use/i)
  })

  test('Pricing tagline no longer implies Pro is already deeper, only that it will be', async ({
    page
  }) => {
    await page.goto('/')
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    const p = (await page.locator('section#pricing').textContent()) ?? ''
    expect(p).not.toMatch(/Efficiver Pro adds depth/i)
    expect(p).toMatch(/Efficiver Pro will add deeper insights and history/i)
  })

  test("Efficiver's button is a real store link, not dead", async ({ page }) => {
    await page.goto('/')
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    const link = page.locator('section#pricing a', { hasText: 'Get Started' }).first()
    const href = await link.getAttribute('href')
    expect(href).toMatch(/apps\.apple\.com|play\.google\.com/)
  })

  test('Pro\'s button is disabled, not a live "Get Started" next to a Coming-soon price', async ({
    page
  }) => {
    await page.goto('/')
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    const cards = page.locator('section#pricing .grid > *')
    const pro = cards.nth(1)
    await expect(pro).toContainText('Efficiver Pro')
    const button = pro.locator('button')
    await expect(button).toBeDisabled()
    expect(await pro.locator('a').count()).toBe(0)
  })

  test("Fleet's button scrolls to the real enquiry form, not a dead button", async ({ page }) => {
    await page.goto('/')
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    const link = page.locator('section#pricing a', { hasText: 'Talk to us' })
    await expect(link).toHaveAttribute('href', '#fleet')
    await link.click()
    await expect(page.locator('section#fleet')).toBeInViewport()
  })
})
