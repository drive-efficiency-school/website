import { test, expect } from '@playwright/test'

/**
 * Legal pages truth — verifies the Privacy Policy + Terms of Use
 * closures from WEBSITE_AUDIT_V12 (C1, C2, I4, I5).
 *
 * Closures covered:
 *   - C1: Privacy Policy now matches the iOS app's actual data model
 *         (on-device + private iCloud sync, no third-party telemetry).
 *   - C2: Terms of Use adds Driving Safety section + India governing law.
 *   - I4: contact@efficiver.com standardized (no stale support@... addresses).
 *   - I5: No "123 Eco Lane / Green City" fictional address.
 */

test.describe('Privacy Policy (C1, I4, I5)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#privacy')
    // The H1, not the footer link. `getByText('Privacy Policy')` also matches the
    // footer entry present on EVERY page, so it can be satisfied while the lazy
    // route view is still unmounted - the body read then finds nothing.
    await expect(page.getByText('Privacy Policy for Efficiver').first()).toBeVisible()
  })

  test('mentions iCloud / CloudKit private-database sync', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/iCloud|CloudKit/)
    expect(body).toMatch(/private/i)
  })

  test('describes on-device / local-first storage', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/on[- ]device|local|SwiftData/i)
  })

  test('no third-party analytics / advertising IDs claim', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/no third[- ]party|no advertising|no telemetry/i)
  })

  test('canonical contact email is contact@efficiver.com', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toContain('contact@efficiver.com')
  })

  test('no fictional "123 Eco Lane" address (I5)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/123 Eco Lane/i)
    expect(body).not.toMatch(/Green City/i)
  })

  test('no stale support@efficiver.com as primary contact (I4)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toContain('support@efficiver.com')
  })
})

test.describe('Terms of Use (C2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#terms')
    // The H1, not the footer link - see the note in the Privacy block above.
    await expect(page.getByText('Terms of Use for Efficiver').first()).toBeVisible()
  })

  test('contains dedicated Driving Safety section', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Driving Safety/i)
    expect(body).toMatch(/responsib(le|ility)/i)
  })

  test('governing law is India (C2 resolution)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/India/)
  })

  test('does NOT cite California as governing law (stale)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/State of California/i)
  })

  test('discloses GPS accuracy as a precondition (release/v1.2 polish)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/GPS/i)
    expect(body).toMatch(/accuracy/i)
  })

  test('canonical contact email is contact@efficiver.com', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toContain('contact@efficiver.com')
  })

  test('no fictional Green City address (I5)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/123 Eco Lane/i)
    expect(body).not.toMatch(/Green City/i)
  })
})
