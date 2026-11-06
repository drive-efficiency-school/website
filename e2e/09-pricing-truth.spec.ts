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
 * THE FLIP (1.7.0, plan item H, owner-approved 2026-11-06): both apps now sell Pro
 * in-app (StoreKit 2 / Play Billing), so the built site defaults to the post-billing
 * card — "In-App Purchase", "monthly or annual", links to both stores (Brief §10
 * steps 2 and 4) and no price. Prod still deploys only after both store approvals
 * (Brief §10 step 8, plan K step 6).
 */

test.describe('Pricing tier naming (Brief §2 / §2.2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Fleet enquiries and joining information', { exact: true }).click()
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

test.describe('Efficiver Pro is on sale in the apps (1.7, Brief §10 steps 2 and 4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Fleet enquiries and joining information', { exact: true }).click()
    await page.locator('section#pricing').scrollIntoViewIfNeeded()
    await expect(page.locator('section#pricing')).toBeVisible()
  })

  test('the built site shows the post-billing Pro card by default', async ({ page }) => {
    const pro = page.locator('section#pricing .grid > *').nth(1)
    await expect(pro).toContainText('Efficiver Pro')
    await expect(pro).toContainText('In-App Purchase')
    await expect(pro).toContainText('monthly or annual')
    await expect(pro).not.toContainText('Coming soon')
    await expect(pro).not.toContainText('pricing being finalised')
  })

  test('Pro links to both stores and has no dead button', async ({ page }) => {
    const pro = page.locator('section#pricing .grid > *').nth(1)
    const appStore = pro.getByRole('link', { name: 'Get Pro — App Store' })
    const play = pro.getByRole('link', { name: 'Get Pro — Google Play' })
    await expect(appStore).toHaveAttribute('href', /^https:\/\/apps\.apple\.com\//)
    await expect(play).toHaveAttribute('href', /^https:\/\/play\.google\.com\/store\/apps\//)
    await expect(pro.locator('button')).toHaveCount(0)
  })

  test('Pro quotes no price — 175 storefronts price it in the stores', async ({ page }) => {
    const pro = (await page.locator('section#pricing .grid > *').nth(1).textContent()) ?? ''
    expect(pro).not.toMatch(/[$£€₹¥]\s?\d/)
    expect(pro).not.toMatch(/\d+[.,]\d{2}/)
    expect(pro).not.toMatch(/\/mo\b|\/month|\/year|per month|per year/i)
  })
})

test.describe('Offers that do not exist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Fleet enquiries and joining information', { exact: true }).click()
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
