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
 *   - M4: Android timeline honest (not "coming soon"). Since 2026-08-23
 *         Android is LAUNCHED — the contract flipped from "not yet
 *         available" to "available, with its device requirement stated".
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
    // Matches "stays on your phone" — the answer was iPhone-only prose until the
    // Android launch; the platform word is incidental to what C3 asserts below.
    const answer = page.getByText(/Your driving data stays on your phone/i)
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

  test('FAQ + Footer present Android as AVAILABLE (Play production access 2026-08-23)', async ({
    page
  }) => {
    // CONTRACT FLIP. Until 2026-08-23 this test asserted the opposite — that
    // Android was listed but NOT presented as available, enforced via the
    // footer's "(soon)" chip. Google Play granted production access on that
    // date, so the hedge became the inaccuracy this suite exists to prevent.
    //
    // The ban on "coming soon" (M4 above) is unchanged and still applies: the
    // site may never use that phrase in either direction.
    //
    // FAQ uses an accordion — the device-compatibility answer is not in the
    // DOM until its question is clicked. Match the existing pattern below
    // (the GPS-precondition test does the same).
    await page.getByRole('button', { name: 'Which devices are compatible with Efficiver?' }).click()
    const answer = page.getByText(/available on Google Play/i)
    await expect(answer).toBeVisible()

    // The device requirement is a real gate (minSdk 31 + arm64-v8a only, which
    // is why 5 of 36 closed testers could not install). Stating it here keeps
    // the FAQ from implying every Android phone qualifies.
    const answerText = (await answer.textContent()) ?? ''
    expect(answerText).toMatch(/Android 12/i)
    expect(answerText).toMatch(/64-bit/i)

    // The hedge must be gone from the footer's Platforms column, and Android
    // must be a real link rather than a disabled span.
    const footerTxt = (await page.locator('footer').textContent()) ?? ''
    expect(footerTxt).not.toMatch(/Android\s*\(soon\)/i)
    await expect(page.locator('footer a[href*="play.google.com"]').first()).toBeVisible()
  })

  test('Hero offers both store CTAs, neither generic (dual-platform launch)', async ({ page }) => {
    // With two stores live, "Download Now" no longer tells a visitor which one
    // they are getting. Both CTAs must name their store.
    const hero = page.locator('section').first()
    await expect(hero.getByRole('link', { name: /Download on the App Store/i })).toBeVisible()
    await expect(hero.getByRole('link', { name: /Get it on Google Play/i })).toBeVisible()
  })

  test('Hero biometric claim is platform-neutral (Face ID is iOS-only)', async ({ page }) => {
    const hero = (await page.locator('section').first().textContent()) ?? ''
    expect(hero).toMatch(/Biometric Secured/i)
    expect(hero).not.toMatch(/FaceID Secured/i)
  })

  test('site NEVER claims Android Auto — Google rejected the category', async ({ page }) => {
    // Google Play ruled a phone-sensor driving dashboard outside the Car App
    // Library's permitted categories; the Android Auto surface was removed in
    // vCode 48 (2026-07-27) and the car code ships dormant. An appeal may be
    // filed later, but until it SUCCEEDS the site must not advertise it — not as
    // available, and not as "coming soon" either.
    //
    // This guard exists because the dual-platform launch is exactly when someone
    // would reasonably pattern-match "CarPlay → Android Auto" and add it back.
    // CarPlay (iOS) is unaffected and legitimately shipped.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Android Auto/i)
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

  // WhatsNew always advertises the CURRENT release. These assertions moved
  // from v1.3 → v1.5 (2026-07-27); they had already gone stale through v1.4,
  // so the block now pins the badge/heading version alongside the features to
  // make the next drift fail loudly instead of silently.
  test('badge and heading announce v1.5', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/NEW\s*—\s*v1\.5/i)
    expect(txt).toMatch(/What's New in Efficiver 1\.5/i)
    // Never advertise a version that isn't the current one.
    expect(txt).not.toMatch(/v1\.[0-4]\b/)
  })

  test('lists the v1.5 converged Trends chart', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/one chart/i)
    expect(txt).toMatch(/forecast/i)
  })

  test('lists v1.5 AidOps Edge on-device insights', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/AidOps Edge/i)
    expect(txt).toMatch(/Year Recap/i)
    // The privacy promise must ride along with any AI claim (M-series intent).
    expect(txt).toMatch(/nothing leaves your device/i)
  })

  test('lists v1.5 Insights destination labels', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Savings and Efficiency cards/i)
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

  test('covers Android accessibility, scoped to what actually ships', async ({ page }) => {
    // CONTRACT FLIP (2026-08-23). This previously asserted the page must NOT
    // mention Android — correct while the Android app was unreleased, since
    // claiming support for an unshipped app would have been the over-claim.
    // Android is now live, and an accessibility page that reads "Supported on
    // iPhone" tells an Android user with access needs that they are unsupported.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Supported on Android/i)
    expect(body).toMatch(/TalkBack/i)

    // Only VERIFIED capabilities may be claimed. Voice Control, Reduce
    // Transparency and Bold Text are iOS platform features with no Android
    // equivalent in the app, and Differentiate Without Color ships on iPhone
    // only — all three are disclosed as limitations rather than claimed.
    expect(body).toMatch(/Known limitations/i)
    expect(body).toMatch(/Differentiate Without Color.{0,80}not yet on\s*Android/is)
  })
})

test.describe('HowItWorks (H6)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('step 1 names Smart Detection and describes the real calibration', async ({ page }) => {
    // Renamed 2026-08-23. The old name — "auto-calibration, not manual" — encoded
    // a belief the app never matched (playbook A2): calibration is a ONE-TIME,
    // MANUAL step you run while parked (~2 min: engine on, then off, then ~10s of
    // training), not something that happens automatically over the first few
    // drives. The assertion below is unchanged and still passes on "Smart
    // Detection"; only the name and this note were wrong.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Smart Detection/i)
    expect(body).not.toMatch(/select your engine type \(Petrol, Diesel and EV\)/i)
    // The old "calibrates during the first few drives" claim must not return.
    expect(body).not.toMatch(/calibrates.{0,40}first few drives/i)
  })
})

test.describe('Fleet callout (v1.5)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('tells drivers fleet joining is invite-only', async ({ page }) => {
    const section = page.locator('#fleet')
    await section.scrollIntoViewIfNeeded()
    const text = (await section.textContent()) ?? ''
    expect(text).toMatch(/invite/i)
    expect(text).toMatch(/Join a fleet/i)
    // The honest driver action is "ask your employer" — we must not imply
    // a driver can obtain access from us.
    expect(text).toMatch(/ask your employer/i)
  })

  test('operator card is marked Coming soon and offers no purchase path', async ({ page }) => {
    const section = page.locator('#fleet')
    await section.scrollIntoViewIfNeeded()
    await expect(section.getByTestId('fleet-coming-soon')).toBeVisible()
    const text = (await section.textContent()) ?? ''
    // Production still runs TEST-mode payment keys: no pricing or checkout
    // may be advertised here until the live-key cutover.
    expect(text).not.toMatch(/buy now|subscribe now|start free trial|per month|\$\d|₹\d/i)
  })

  test('states the on-duty boundary, matching the privacy policy', async ({ page }) => {
    const section = page.locator('#fleet')
    await section.scrollIntoViewIfNeeded()
    const text = (await section.textContent()) ?? ''
    expect(text).toMatch(/on duty/i)
    expect(text).toMatch(/off-duty drives stay on your phone/i)
  })
})
