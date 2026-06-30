import { test, expect } from '@playwright/test'

/**
 * Content truth — verifies the FAQ + WhatsNew + Releases + Features +
 * HowItWorks closures from WEBSITE_AUDIT_V12.
 *
 * Closures covered:
 *   - C3: FAQ item-5 honest about iCloud sync (not "no cloud sync").
 *   - H1: WhatsNew + Releases describe v1.2 features.
 *   - H2: "Eco Route" renamed to "Efficient Route" (historical
 *         mentions of the rename are allowed).
 *   - H4: Features.vue doesn't promise Business Solutions or Gamified
 *         badges that don't ship.
 *   - H6: HowItWorks step 1 reflects Smart Detection auto-calibration.
 *   - M3: Fuel-savings claim softened in FAQ.
 *   - M4: Android timeline honest (not "coming soon").
 *   - I11: No Enterprise references in FAQ / Contact (Pricing is
 *          DEFERRED per user 2026-05-25 and is explicitly skipped).
 */

test.describe('FAQ (C3, M3, M4, I11)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page
      .locator('section#faq')
      .scrollIntoViewIfNeeded()
      .catch(() => undefined)
  })

  test('FAQ data-safety question honest about iCloud sync (C3)', async ({ page }) => {
    // Radix-vue Accordion only mounts the answer DOM once the
    // trigger is expanded. Click into the data-safety question
    // (which is C3's target — old "item-5" by audit numbering).
    await page.getByRole('button', { name: 'Is my data safe with Efficiver?' }).click()
    const answer = page.getByText(/Your driving data stays on your iPhone/i)
    await expect(answer).toBeVisible()
    const answerText = (await answer.textContent()) ?? ''
    expect(answerText).toMatch(/iCloud|CloudKit/)
    expect(answerText).not.toMatch(/no cloud sync or internet sharing/i)
  })

  test('FAQ does NOT make unbacked specific savings claims (M3)', async ({ page }) => {
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/beta users (have )?reported/i)
  })

  test('FAQ honest about Android (M4)', async ({ page }) => {
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/Android version is coming soon/i)
  })

  test('FAQ + Footer mention Android is in active development (not "coming soon")', async ({
    page
  }) => {
    // Android port kickoff 2026-06-08 — copy on the site must now
    // surface Android as in-progress (was "iOS-only; no Android
    // timeline" through v1.2). The phrase "coming soon" stays banned
    // by the M4 test above; this test locks the new contract.
    //
    // FAQ uses an accordion — the device-compatibility answer is not
    // in the DOM until its question is clicked. Match the existing
    // pattern below (the GPS-precondition test does the same).
    await page.getByRole('button', { name: 'Which devices are compatible with Efficiver?' }).click()
    const answer = page.getByText(/An Android port is in active development/i)
    await expect(answer).toBeVisible()

    const footerTxt = (await page.locator('footer').textContent()) ?? ''
    expect(footerTxt).toMatch(/Android/i)
    expect(footerTxt).toMatch(/development|underway|in progress|being built/i)
  })

  test('FAQ does NOT promise unshipped Enterprise plan (I11)', async ({ page }) => {
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/Enterprise plan is coming soon/i)
  })

  test('FAQ discloses GPS accuracy as scoring precondition (release/v1.2)', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Does Efficiver need a clear GPS signal to work?' })
      .click()
    const answer = page.getByText(/Speed, distance, route, and scoring all come from/i)
    await expect(answer).toBeVisible()
    const answerText = (await answer.textContent()) ?? ''
    expect(answerText).toMatch(/accuracy/i)
    expect(answerText).toMatch(/Efficiency Score/)
  })
})

test.describe('WhatsNew section (H1, H2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page
      .locator('section#whats-new')
      .scrollIntoViewIfNeeded()
      .catch(() => undefined)
  })

  test('lists v1.3 CarPlay support', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/CarPlay/i)
  })

  test('lists v1.3 observed-savings messaging (savings so far this year)', async ({ page }) => {
    // The shipped WhatsNew copy advertises real observed savings ("your real
    // savings so far this year"), not a forward "savings projection" — that
    // forecast lives under Efficiver Pro. Assert the actual shipped wording.
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/real savings so far this year/i)
  })

  test('lists v1.3 Year Recap', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Year Recap/i)
  })

  test('lists v1.3 Smart Forecast / Idle Lever in the polish list', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Smart Forecast|cut idle by/i)
  })

  test('lists v1.3 redesigned Insights tab', async ({ page }) => {
    // The shipped copy surfaces the Insights-tab redesign rather than a
    // standalone "Pattern Insights" feature; Anomaly Detection (the pattern
    // signal) is asserted separately below.
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/redesigned Insights tab/i)
  })

  test('lists v1.3 Anomaly Detection in the polish list', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Anomaly Detection/i)
  })

  test('WhatsNew has no stale "Eco Route" copy (H2 closure)', async ({ page }) => {
    // The v1.2 WhatsNew carried a polish bullet `"Eco Route" is now
    // "Efficient Route" everywhere in the app.` That bullet was tied
    // to the v1.1→v1.2 rename and was dropped from the v1.3 WhatsNew
    // (the polish list was re-curated for v1.3 features). What still
    // matters: the v1.3 WhatsNew section MUST NOT carry any stale
    // bare "Eco Route" copy from earlier drafts. The full "Eco Route
    // is now Efficient Route" rename note no longer appears here —
    // it now lives only on the Releases page's collapsed v1.2 entry.
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).not.toMatch(/Eco Route/i)
  })
})

test.describe('Releases page (H1, H2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#releases')
    await expect(page.getByText('Release', { exact: false }).first()).toBeVisible()
  })

  test('lists v1.3 release entry', async ({ page }) => {
    const txt = (await page.locator('body').textContent()) ?? ''
    expect(txt).toMatch(/v?1\.3/)
  })

  test('keeps v1.2 release entry in history (collapsed)', async ({ page }) => {
    const txt = (await page.locator('body').textContent()) ?? ''
    expect(txt).toMatch(/v?1\.2/)
  })

  test('uses Efficient Route somewhere on Releases (carried into v1.2 history)', async ({
    page
  }) => {
    const txt = (await page.locator('body').textContent()) ?? ''
    expect(txt).toMatch(/Efficient Route/i)
  })

  test('mentions v1.3 flagship features (CarPlay + Savings + Year Recap)', async ({ page }) => {
    const txt = (await page.locator('body').textContent()) ?? ''
    expect(txt).toMatch(/CarPlay/i)
    expect(txt).toMatch(/savings projection|Year Recap/i)
  })
})

test.describe('Features grid (H4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Features.vue is lazy-loaded via defineAsyncComponent; force
    // mount by scrolling it into view + waiting for it to render.
    await page.locator('section#features').scrollIntoViewIfNeeded()
    await expect(page.locator('section#features')).toBeVisible()
    await expect(page.locator('section#features')).toContainText(
      /Live drive map|Accessibility-first/i
    )
  })

  test('does NOT promise unshipped Business Solutions (H4)', async ({ page }) => {
    // Scope to Features section ONLY — the deferred Pricing
    // Enterprise tier is allowed to retain Multi-user-support copy
    // per H3/H5 user direction 2026-05-25.
    const features = (await page.locator('section#features').textContent()) ?? ''
    expect(features).not.toMatch(/Business Solutions/i)
    expect(features).not.toMatch(/Multi-user support/i)
  })

  test('does NOT advertise Gamified badges feature (H4)', async ({ page }) => {
    const features = (await page.locator('section#features').textContent()) ?? ''
    expect(features).not.toMatch(/Gamified Experience/i)
    expect(features).not.toMatch(/Earn badges/i)
  })
})

test.describe('Accessibility page (iOS scope)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#accessibility')
    await expect(page.getByText('Accessibility at Efficiver')).toBeVisible()
  })

  test('lists the Apple-verified iPhone support features', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    for (const feature of [
      'VoiceOver',
      'Voice Control',
      'Dynamic Type',
      'Reduced Motion',
      'Differentiate Without Color',
      'Dark Interface'
    ]) {
      expect(body).toContain(feature)
    }
  })

  test('honestly discloses the Bold Text brand-font limitation', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Known limitations/i)
    expect(body).toMatch(/brand title font does not bold/i)
  })

  test('does NOT claim Android support yet (iOS-only scope)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/TalkBack/i)
    expect(body).not.toMatch(/Android Settings/i)
  })
})

test.describe('HowItWorks (H6)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('step 1 describes Smart Detection auto-calibration, not manual', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Smart Detection|auto[- ]?calibrat|automatic/i)
    expect(body).not.toMatch(/select your engine type \(Petrol, Diesel and EV\)/i)
  })
})
