import { test, expect } from '@playwright/test'

/**
 * N-series accuracy items, EACH RE-DERIVED FROM SOURCE.
 *
 * These were inherited from a 2026-08-12 audit document. Five of that
 * document's interpretive claims collapsed when read against code earlier in
 * this workstream, so none of these is published on its authority. Every item
 * below names what was actually read.
 *
 *  N2  "No location history beyond the active drive session"
 *      ios Waypoint.swift is a persisted @Model carrying latitude, longitude,
 *      altitude, horizontalAccuracy, speed and heading, related to a Session.
 *      Every past drive's route IS stored. The intended meaning - we do not
 *      track you outside a drive - is true and worth saying; the sentence as
 *      written is not.
 *
 *  N5  Releases v1.0 claims cornering detection.
 *      ios MistakeEvent.swift: `enum MistakeKind { case acceleration, braking }`.
 *      Android MistakeDetection.kt: `enum class MistakeKind { ACCELERATION, BRAKING }`.
 *      No cornering on either platform. Features.vue already dropped it; the
 *      release history was never swept.
 *
 *  N7  "petrol, diesel, hybrid, and electric vehicles of all makes and models"
 *      Both pickers offer Petrol / Diesel / Electric only. A hybrid owner has
 *      no correct setting, and FuelModelConstants.segment(forVehicleType:)
 *      silently falls back to Petrol for anything it does not know.
 *
 *  N8  "Speech Recognition: Optional, for voice commands (future feature)"
 *      There is NO NSSpeechRecognitionUsageDescription and no microphone usage
 *      description in the iOS build settings. The app never requests it. Siri
 *      App Intents are the actual hands-free path.
 *
 *  N9  "The scoring is ... calibrated for accuracy"
 *      There is no ground truth anywhere in the product. FuelModelConstants
 *      marks every value "PROVISIONAL pending Phase-B field validation".
 *
 *  N17 "turn off the engine when stopped for more than ~10 seconds"
 *      IdleMonitor accrues one mistake and fires one prompt per completed 30s
 *      window (`currentIdleDuration >= 30.0`); iOS idleTimerTick is identical.
 */

test.describe('Privacy Policy: location history (N2)', () => {
  test('does not deny storing route history', async ({ page }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/No location history beyond the active drive session/i)
    // The true version of the claim must survive.
    expect(body).toMatch(/outside an active drive|not.{0,30}track you.{0,30}between drives/i)
  })
})

test.describe('Releases: no cornering (N5)', () => {
  test('the v1.0 entry claims no cornering detection', async ({ page }) => {
    await page.goto('/#releases')
    await expect(page.getByText('Release notes', { exact: false }).first()).toBeVisible()
    // The v1.0 entry is collapsed; expand every <details> before asserting,
    // or an absence assertion passes against unrendered content.
    await page.evaluate(() =>
      document.querySelectorAll('details').forEach((d) => d.setAttribute('open', ''))
    )
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/cornering/i)
  })
})

test.describe('Help: claims matched to the apps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
  })

  test('no hybrid support and no "all makes and models" (N7)', async ({ page }) => {
    // Ban the CLAIM OF SUPPORT, not the word. Saying plainly that there is no
    // hybrid setting yet is better than silence - a hybrid owner arriving with
    // that exact question gets an answer instead of a gap.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/diesel,?\s*(and\s*)?hybrid/i)
    expect(body).not.toMatch(/hybrid[^.]{0,30}(supported|works with)/i)
    expect(body).not.toMatch(/all makes and models/i)
    // And it must actually say hybrids are not covered.
    expect(body).toMatch(/no hybrid setting/i)
  })

  test('no speech-recognition permission is claimed (N8)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Speech Recognition/i)
  })

  test('scoring is not claimed to be calibrated for accuracy (N9)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/calibrated for accuracy/i)
  })

  test('the idle tip matches the app threshold (N17)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/more than ~?10 seconds/i)
    expect(body).toMatch(/30 seconds/i)
  })
})
