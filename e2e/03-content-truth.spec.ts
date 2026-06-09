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

  test('lists v1.3 annual savings projection', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/annual savings projection|savings projection/i)
  })

  test('lists v1.3 Year Recap', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Year Recap/i)
  })

  test('lists v1.3 Smart Forecast / Idle Lever in the polish list', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Smart Forecast|cut idle by/i)
  })

  test('lists v1.3 Pattern Insights in the polish list', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Pattern Insights/i)
  })

  test('lists v1.3 Anomaly Detection in the polish list', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Anomaly Detection/i)
  })

  test('uses Efficient Route (H2) — Eco Route appears only in rename note', async ({ page }) => {
    const txt = (await page.locator('section#whats-new').textContent()) ?? ''
    expect(txt).toMatch(/Efficient Route/i)
    // "Eco Route" may appear inside the rename-explanation phrase
    // ('"Eco Route" is now "Efficient Route" everywhere in the app.').
    // Any other occurrence would mean a stale v1.1 reference survived.
    const ecoRouteMatches = txt.match(/Eco Route/gi) ?? []
    const renameMatches = txt.match(/"Eco Route" is now "Efficient Route"/gi) ?? []
    expect(ecoRouteMatches.length).toBe(renameMatches.length)
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
