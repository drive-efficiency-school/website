import { test, expect } from '@playwright/test'

/**
 * One pricing statement across every surface — finishing D1a.
 *
 * Pricing.vue was corrected earlier in this branch, but Help, the FAQ and the
 * exit popup were left saying something different. Help contradicted ITSELF:
 * "All features are free, with no in-app purchases" sits on the same page as
 * three "part of Efficiver Pro (coming soon)" notes.
 *
 * What is actually true, from both apps (since 1.7.0):
 *   Pro gates are REAL, and Pro is now on sale in both apps (StoreKit 2 / Play
 *   Billing; the paywall's five features are ProStoreCopy's). So "All features
 *   are free" is still false, and "nothing to buy" is now false too.
 *
 * Free-first sweep (plan item H, owner-approved 2026-11-07): every surface says
 * what is free FIRST and names Pro as "optional" — never "coming", "planned" or
 * "being finalised".
 */

test.describe('No surface claims every feature is free', () => {
  test('Help does not contradict its own Pro notes', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByRole('heading', { name: 'Help & Support for Efficiver' })).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/All features are free/i)
    expect(body).not.toMatch(/no in-app purchases/i)
    // And it must still name the Pro tier it gates features behind.
    expect(body).toMatch(/Efficiver Pro/)
  })

  test('the FAQ says the same thing', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('section#faq')).toBeVisible()
    await page.getByRole('button', { name: /pricing/i }).click()
    // SCOPED to the FAQ. An unscoped getByText(/Efficiver Pro/) matches the
    // Pricing card higher up the same page, so the assertion would run against
    // the wrong element entirely.
    const answer = page
      .locator('section#faq')
      .getByText(/Efficiver Pro/i)
      .first()
    await expect(answer).toBeVisible()
    const text = ((await answer.textContent()) ?? '').trim()
    expect(text).not.toMatch(/all features included/i)
    // Free first, then Pro as optional — the same answer as Help's "Is Efficiver free?".
    expect(text).toMatch(/^Efficiver is free to download and use, with no ads/)
    expect(text).toMatch(/optional Efficiver Pro adds/)
    expect(text).toMatch(/monthly or annual subscription in the app/)
    expect(text).not.toMatch(/nothing to buy|still being finalised|which is coming/i)
  })

  // Pro is on sale since 1.7.0, but the site never hard-sells it, and there is no trial
  // (trial_enabled=false on all 175 storefronts).
  test('no surface hard-sells Pro or offers a free trial', async ({ page }) => {
    for (const hash of ['', '#help']) {
      await page.goto(`/${hash}`)
      await page.waitForLoadState('load')
      const body = (await page.locator('body').textContent()) ?? ''
      expect(body, `on /${hash}`).not.toMatch(/buy now|subscribe now|start free trial/i)
    }
  })
})

test.describe('Free first, Pro optional (1.7 free-first sweep)', () => {
  // Fleet's operator card legitimately says "Coming soon" (Fleet sign-up, not Pro), so the
  // home page is checked for Pro-specific wording only.
  const PRO_NOT_YET =
    /Pro[^.]{0,60}coming soon|coming with Efficiver Pro|planned for (Efficiver )?Pro|future Pro features|which is coming/i

  test('the home page never says Pro is still coming', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Fleet enquiries and joining information', { exact: true }).click()
    await page.locator('section#whats-new').scrollIntoViewIfNeeded()
    await expect(page.locator('section#whats-new')).toBeVisible()
    await page.locator('section#progress').scrollIntoViewIfNeeded()
    await expect(page.locator('section#progress')).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(PRO_NOT_YET)
    expect(body).toMatch(/Optional Efficiver Pro adds deeper insights/)
    expect(body).toMatch(/Optional Efficiver Pro adds driving patterns and score forecasts/)
    expect(body).toMatch(/Optional Efficiver Pro adds forecasts, patterns and savings projections/)
  })

  test('Help never says "coming soon" and has no Pro roadmap', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByRole('heading', { name: 'Help & Support for Efficiver' })).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/coming soon/i)
    expect(body).not.toMatch(/On the Roadmap/)
    expect(body).toMatch(/Yes\. Efficiver is free to download and use, with no ads/)
  })
})
