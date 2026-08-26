import { test, expect } from '@playwright/test'

/**
 * Pricing truth — the tier-naming SOT and the offers that do not exist.
 *
 * SOURCE OF TRUTH (read directly, not via any summary):
 *   docs/Pricing/Efficiver_Product_Plan_Feature_Matrix_Country_Gross_Pricing_Brief_v2.0.md
 *     §2    4-tier naming SOT, owner-locked 2026-07-09:
 *           Efficiver (Basic) · Efficiver Pro · Efficiver Fleet
 *           "Basic" and "Full App" are code-level terms only, NEVER customer-facing.
 *     §2.2  names this exact website change:
 *           Smart Driver -> Efficiver · Eco Master -> Efficiver Pro · Enterprise -> Efficiver Fleet
 *     §2    Tier 3/4 billing is RazorPay — "no IAP anywhere in this tier" — so a
 *           per-seat "/user/year" price misrepresents the channel.
 *   docs/Pricing/Efficiver_Pricing_Matrix_v3.0.csv
 *           trial_enabled=false on all 175 rows (approved_on 2026-07-14).
 *
 * DELIBERATELY NOT ASSERTED HERE (Brief §10 step 8 — "deploy prod only after both
 * v1.5 store approvals"): the launch-offer flip to "In-App Purchase". No purchase
 * flow exists on any surface yet — both apps show a "Coming Soon" alert — so
 * flipping that copy now would substitute one false claim for another. That is a
 * separate change that ships WITH billing.
 */

test.describe('Pricing tier naming (Brief §2 / §2.2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    await expect(page.locator('section#pricing')).toBeVisible()
  })

  test('uses the locked tier names', async ({ page }) => {
    const pricing = (await page.locator('section#pricing').textContent()) ?? ''
    expect(pricing).toMatch(/Efficiver Pro/)
    expect(pricing).toMatch(/Efficiver Fleet/)
  })

  test('retires the legacy 2025 tier names', async ({ page }) => {
    // Superseded in full by the Brief; docs/InApp-Purchase-Plan.md is history.
    const pricing = (await page.locator('section#pricing').textContent()) ?? ''
    expect(pricing).not.toMatch(/Smart Driver/i)
    expect(pricing).not.toMatch(/Eco Master/i)
    expect(pricing).not.toMatch(/Enterprise/i)
  })

  test('never surfaces "Basic" as a customer-facing tier name (§2.1)', async ({ page }) => {
    // NOTE: textContent concatenates without separators ("Free ForeverBasic
    // Features"), so a \b-anchored pattern silently never matches. Plain
    // substring — the assertion this test was written to make.
    const pricing = (await page.locator('section#pricing').textContent()) ?? ''
    expect(pricing).not.toMatch(/Basic/)
    expect(pricing).not.toMatch(/Full Access/)
  })
})

test.describe('Offers that do not exist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    await expect(page.locator('section#pricing')).toBeVisible()
  })

  test('advertises no free trial — trial_enabled=false on all 175 storefronts', async ({
    page
  }) => {
    const pricing = (await page.locator('section#pricing').textContent()) ?? ''
    expect(pricing).not.toMatch(/free trial/i)
    expect(pricing).not.toMatch(/\d+-day/i)
  })

  test('quotes no per-seat price — Fleet is RazorPay, not IAP (§2)', async ({ page }) => {
    const pricing = (await page.locator('section#pricing').textContent()) ?? ''
    expect(pricing).not.toMatch(/\/user\/year/i)
    expect(pricing).not.toMatch(/per user/i)
  })

  test('does not sell currently-free features as paid', async ({ page }) => {
    // Idle detection (DrivingPreferences.enableIdleMonitoring) and Auto-Start
    // (DrivingDetector) are free in both apps; neither is in the Brief §5 Pro set.
    const pricing = (await page.locator('section#pricing').textContent()) ?? ''
    expect(pricing).not.toMatch(/Idle detection/i)
    expect(pricing).not.toMatch(/Auto-Start Mode/i)
  })
})
