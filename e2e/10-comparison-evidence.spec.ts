import { test, expect } from '@playwright/test'

/**
 * Comparison-table evidence + the relocated battery claim.
 *
 * The line drawn here, and why it is drawable:
 *
 *  KEEPABLE — follows from the category definition, not from surveying products.
 *    "An OBD app requires an OBD dongle" is what the category name means. Same
 *    for EV support without that port. No test data needed to say it.
 *
 *  NOT KEEPABLE — asserts price, speed, battery or data practices of unnamed
 *    third-party products. The review's finding 9 asks for "the products
 *    reviewed, market, date, sources and comparison conditions". None exist,
 *    and for battery none CAN: there is no battery instrumentation in either
 *    Efficiver app, so even our own half of that row was unmeasured.
 *
 *  RELOCATED — the real battery story is a capability of Efficiver alone, so it
 *    belongs in Features, not in a two-column comparison. Verified in source:
 *    iOS PowerManager observes NSProcessInfoPowerStateDidChange; Android
 *    registers a receiver on PowerManager.ACTION_POWER_SAVE_MODE_CHANGED; the
 *    "Prioritise Low Power" setting is ON BY DEFAULT on both
 *    (AppPrefsLogic.DEFAULT_IS_PRIORITISE_LOW_POWER_ENABLED = true).
 */

test.describe('Comparison table carries no unsourced competitor claims', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('section#comparison').scrollIntoViewIfNeeded()
    await expect(page.locator('section#comparison')).toBeVisible()
  })

  test('quotes no dongle price', async ({ page }) => {
    // The WORD "dongle" is fine and accurate — the category needs one. What
    // cannot stand is a PRICE for it: "$50-150" was a claim about products
    // never surveyed. Only the price is banned.
    const c = (await page.locator('section#comparison').textContent()) ?? ''
    expect(c).not.toMatch(/\$\d/)
    expect(c).not.toMatch(/\d+\s*[-–]\s*\d+/)
  })

  test('quotes no competitor setup time', async ({ page }) => {
    const c = (await page.locator('section#comparison').textContent()) ?? ''
    expect(c).not.toMatch(/\d+\+?\s*minutes/i)
    expect(c).not.toMatch(/Setup Time/i)
  })

  test('makes no battery claim — unmeasured on both sides', async ({ page }) => {
    const c = (await page.locator('section#comparison').textContent()) ?? ''
    expect(c).not.toMatch(/Battery Drain/i)
    expect(c).not.toMatch(/\bMinimal\b/)
  })

  test('asserts nothing about competitor privacy practices', async ({ page }) => {
    const c = (await page.locator('section#comparison').textContent()) ?? ''
    expect(c).not.toMatch(/Privacy First/i)
  })

  test('does not present cost as a comparison row (Brief §10 step 3)', async ({ page }) => {
    // "Free Forever" must read as the free TIER, not as the price of Efficiver
    // full stop — the naming SOT has three tiers.
    const c = (await page.locator('section#comparison').textContent()) ?? ''
    expect(c).not.toMatch(/Free Forever/i)
  })

  test('states the basis of comparison', async ({ page }) => {
    const c = (await page.locator('section#comparison').textContent()) ?? ''
    expect(c).toMatch(/vary|varies/i)
  })
})

test.describe('Low Power behaviour is stated where it belongs (D8)', () => {
  test('Features names the verified Low Power behaviour', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    await expect(page.locator('section#features')).toBeVisible()
    const f = (await page.locator('section#features').textContent()) ?? ''
    expect(f).toMatch(/Low Power/i)
    expect(f).toMatch(/on by default/i)
  })

  test('states behaviour, never a quantity of battery saved', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    const f = (await page.locator('section#features').textContent()) ?? ''
    expect(f).not.toMatch(/\d+%\s*(less|more|longer)/i)
    expect(f).not.toMatch(/saves? .{0,20}battery/i)
  })
})
