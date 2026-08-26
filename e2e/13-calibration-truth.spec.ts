import { test, expect } from '@playwright/test'

/**
 * Calibration wording — review finding 8.
 *
 * Verified by reading BOTH apps, not a summary:
 *
 *  MANUAL, not automatic. iOS SmartCalibrationView and Android
 *  SmartCalibrationScreen are user-initiated: tap Start, park, record. Android's
 *  start dialog says so explicitly ("This records about 2 minutes of motion —
 *  1 minute with the engine running, then 1 minute with it off — followed by
 *  ~10 seconds of training. Keep the device still throughout.").
 *
 *  ~2 MINUTES, not one. iOS's explainer: "Calibration takes about 2 minutes: 1
 *  minute with the engine running, a short pause, 1 minute with the engine off,
 *  a few seconds to finish learning."
 *
 *  NOT ONE-TIME. Both platforms ship a Reset Calibration path (iOS
 *  VehicleSettingsView; Android since release/v1.5.3). "One-time" sets the wrong
 *  expectation for a model that is tied to phone placement.
 *
 *  NO AUTOMATIC RECALIBRATION TRIGGER EXISTS. The detector exposes a live
 *  predictionConfidence, but nothing acts on it — so the site may say when to
 *  recalibrate, and must NOT imply the app will prompt.
 */

const HOME_SECTIONS = ['section#features', 'section#how-it-works', 'section#faq']

test.describe('Calibration is described as initial and manual', () => {
  test('the home page never calls it one-time', async ({ page }) => {
    await page.goto('/')
    for (const sel of HOME_SECTIONS) {
      await page.locator(sel).scrollIntoViewIfNeeded()
      await expect(page.locator(sel)).toBeVisible()
      const text = (await page.locator(sel).textContent()) ?? ''
      expect(text, `${sel} still says one-time`).not.toMatch(/one[- ]time/i)
      expect(text, `${sel} still says once`).not.toMatch(/calibration once|calibrate once/i)
    }
  })

  test('the home page never calls it automatic', async ({ page }) => {
    await page.goto('/')
    for (const sel of HOME_SECTIONS) {
      await page.locator(sel).scrollIntoViewIfNeeded()
      const text = (await page.locator(sel).textContent()) ?? ''
      expect(text, `${sel} implies auto-calibration`).not.toMatch(/auto[- ]calibrat/i)
    }
  })

  test('Help never calls it automatic or one-minute', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/auto[- ]calibrat/i)
    expect(body).not.toMatch(/one[- ]minute auto/i)
    // The apps both say ~2 minutes; "one-minute" was the site's own outlier.
    expect(body).not.toMatch(/one[- ]minute calibration/i)
  })
})

test.describe('When to recalibrate is stated, without promising a prompt', () => {
  test('the FAQ names the recalibration condition', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('section#faq')).toBeVisible()
    await page.getByRole('button', { name: 'What cars are supported?' }).click()
    const answer = page.getByText(/recalibrat/i).first()
    await expect(answer).toBeVisible()
    const text = (await answer.textContent()) ?? ''
    expect(text).toMatch(/placement|mounting|position/i)
  })

  test('never implies the app detects the need to recalibrate', async ({ page }) => {
    // No automatic trigger exists in either app.
    await page.goto('/')
    await page.locator('section#faq').scrollIntoViewIfNeeded()
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/prompts? you to recalibrat/i)
    expect(faq).not.toMatch(/reminds? you to recalibrat/i)
    expect(faq).not.toMatch(/automatically recalibrat/i)
  })
})
