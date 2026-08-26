import { test, expect } from '@playwright/test'

/**
 * The last three N-series items, each verified against app source.
 *
 *  N3  Help attributes auto-start/stop to Motion & Fitness in three places. The
 *      app's OWN permission string disagrees:
 *        INFOPLIST_KEY_NSMotionUsageDescription =
 *          "Efficiver uses motion sensors to detect when your engine is running
 *           and track idle time."
 *      Auto-start/stop is CoreLocation - DrivingDetector works off GPS speed
 *      thresholds. This is a PERMISSION RATIONALE, so being wrong about it
 *      degrades the quality of the consent the user gives.
 *
 *  N6  "Harsh braking detection is more sensitive than acceleration."
 *      MistakeConfig defaults:
 *        city     accel 3.0  brake 3.5   -> braking needs a LARGER delta
 *        highway  accel 4.0  brake 3.0   -> it inverts
 *      So the blanket claim is false in town, which is the dominant case. The
 *      same sentence also carried a "safer driving" benefit claim that the D9
 *      sweep missed because that sweep was scoped to the home page.
 *
 *  N11 "full support across every screen" (x3).
 *      The Accessibility page itself lists Known limitations - a brand-font Bold
 *      Text gap, Differentiate Without Color not yet on Android, no Android
 *      Voice Control - and two audit failures are deferred to v1.6. "Full" and
 *      "every" cannot stand next to a limitations list.
 */

test.describe('Motion permission rationale matches the app (N3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
  })

  test('does not attribute auto-start/stop to Motion & Fitness', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Motion & Fitness[^.]{0,40}auto-start/i)
    expect(body).not.toMatch(/Motion & Fitness access for auto-start/i)
  })

  test('still explains what Motion & Fitness IS for', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Motion & Fitness/)
    expect(body).toMatch(/engine (is running|detection)/i)
  })

  test('attributes auto-start/stop to location', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    // Both spellings occur in Help ("auto-start/stop" and "Automatic start/stop").
    expect(body).toMatch(/(auto-start|automatic start)[^.]{0,80}location/i)
  })
})

test.describe('Braking sensitivity (N6)', () => {
  test('makes no blanket sensitivity comparison', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/more sensitive than\s+acceleration/i)
  })

  test('the note carries no safety-benefit claim either', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/smoother, safer driving/i)
  })
})

test.describe('Accessibility claims sit alongside their limitations (N11)', () => {
  test('the Accessibility page claims no total coverage', async ({ page }) => {
    await page.goto('/#accessibility')
    await expect(page.getByText('Accessibility at Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/full support across every screen/i)
    // The limitations list must remain - it is what makes the page honest.
    expect(body).toMatch(/Known limitations/i)
  })

  test('Help makes no total-coverage claim either', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/full support across every screen/i)
    expect(body).not.toMatch(/Full screen-reader support/i)
  })
})
