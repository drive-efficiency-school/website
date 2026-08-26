import { test, expect } from '@playwright/test'

/**
 * One pricing statement across every surface — finishing D1a.
 *
 * Pricing.vue was corrected earlier in this branch, but Help, the FAQ and the
 * exit popup were left saying something different. Help contradicted ITSELF:
 * "All features are free, with no in-app purchases" sits on the same page as
 * three "part of Efficiver Pro (coming soon)" notes.
 *
 * What is actually true, from both apps:
 *   Pro gates are REAL and already shipped. isSubscriptionActive defaults false
 *   and the free tier sees SubscriptionUnlockCard instead of the feature. Its
 *   copy (engine/SubscriptionUnlockCopy.kt, verbatim) is:
 *     "Score forecasts, driving patterns, idle-time insights, and your annual
 *      savings projection are part of the upcoming Efficiver subscription."
 *     CTA "Get Efficiver Pro" -> alert "Coming Soon / pricing is being finalized"
 *   So BILLING does not exist, but the GATES do. "All features are free" is
 *   false; "you cannot buy anything yet" is true.
 */

test.describe('No surface claims every feature is free', () => {
  test('Help does not contradict its own Pro notes', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
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
    const text = (await answer.textContent()) ?? ''
    expect(text).not.toMatch(/all features included/i)
    expect(text).toMatch(/nothing to buy|not on sale|cannot buy|coming/i)
  })

  test('no surface implies a purchase is possible today', async ({ page }) => {
    for (const hash of ['', '#help']) {
      await page.goto(`/${hash}`)
      await page.waitForLoadState('load')
      const body = (await page.locator('body').textContent()) ?? ''
      expect(body, `on /${hash}`).not.toMatch(/buy now|subscribe now|start free trial/i)
    }
  })
})
