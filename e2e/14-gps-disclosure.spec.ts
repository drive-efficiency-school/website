import { test, expect } from '@playwright/test'

/**
 * GPS disclosure — review finding 7.
 *
 * The review asked for GPS states to be confirmed before publishing anything
 * more specific. They now are, by reading BOTH implementations rather than a
 * summary — and the result runs the other way: the site was warning users about
 * two glitches the engine explicitly defends against.
 *
 *  IDLE TIMER IN A TUNNEL — guarded on both platforms.
 *    iOS DriveEngine.idleTimerTick(): `gpsFresh = gpsStaleSeconds <= 5.0`, and
 *    idle accrues only when `lastSpeed == 0 && isEngineOn == .on && gpsFresh`.
 *    Its own comment: "likely tunnel / underground / garage where GPS is gone
 *    but the vehicle may still be moving. Freeze the idle counter."
 *    Android IdleMonitor.tick() is the same gate, GPS_STALL_THRESHOLD_SECONDS = 5.0,
 *    with a GPS stall "neither reset nor accrued".
 *
 *  STRAY HARSH EVENT ON RECOVERY — guarded three ways (read in DriveEngineCore
 *  + MistakeDetection):
 *    1. a delivery gap flushes the peak-valley buffer AND re-anchors
 *       previousSpeed, so the fast brake check sees a zero delta;
 *    2. the ADR-188 snap gate runs neither mistake path on an untrusted tick and
 *       flushes the window;
 *    3. analyzeSpeedPattern clears its queue when the sample cadence deviates
 *       from 1.0s by more than 0.05s.
 *
 * What STAYS: GPS accuracy genuinely affects the score, the warm-up and Low GPS
 * labels are real, and scoring continues on a weak fix. Those are all verified.
 * Only the two "it might glitch" warnings go.
 */

test.describe('GPS answer describes real behaviour, not defended-against glitches', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('section#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('section#faq')).toBeVisible()
    await page
      .getByRole('button', { name: 'Does Efficiver need a clear GPS signal to work?' })
      .click()
  })

  test('drops the tunnel idle-timer warning', async ({ page }) => {
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/idle timer triggering/i)
  })

  test('drops the stray harsh-event warning', async ({ page }) => {
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/stray harsh-event/i)
  })

  test('states instead what the app does on an unreliable fix', async ({ page }) => {
    const answer = page.getByText(/Speed, distance, route, and scoring all come from/i)
    await expect(answer).toBeVisible()
    const text = (await answer.textContent()) ?? ''
    expect(text).toMatch(/pauses the idle timer|holds the idle timer|freezes the idle timer/i)
  })

  test('keeps the verified GPS facts', async ({ page }) => {
    const answer = page.getByText(/Speed, distance, route, and scoring all come from/i)
    const text = (await answer.textContent()) ?? ''
    expect(text).toMatch(/GPS Warming Up/)
    expect(text).toMatch(/Low GPS/)
    expect(text).toMatch(/Efficiency Score/)
    // Scoring continues on a weak fix — verified: .lowAccuracy warns, it does
    // not stop recording.
    expect(text).toMatch(/scoring continues/i)
  })
})
