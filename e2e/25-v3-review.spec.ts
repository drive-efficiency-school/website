import { test, expect } from '@playwright/test'

/**
 * Third-round review (Efficiver_Website_Content_Review_Feedback_v3.0.md),
 * items not already covered by an existing spec's own pin. Every claim below
 * was re-derived from source before fixing, per house rule — not taken on the
 * doc's word. Two items from the doc are not covered here: §2.5 required no
 * code change (Pro is already gated correctly; the owner confirmed the
 * intended framing) and optional §3 (hero "offline" label) was left
 * unconfirmed by the owner.
 */

test.describe('§2.1 Privacy Policy — off-duty and Fleet-boundary framing', () => {
  test('off-duty drives are described as never uploaded, not as never leaving the phone', async ({
    page
  }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/[Oo]ff-duty drives never leave your phone/)
    expect(body).toMatch(/never uploaded to or shared with your\s*fleet/i)
    // The qualifier must survive in both places it now appears (§1 summary
    // bullet and the Fleet section's "never shared" list).
    expect(body.match(/synchronize or back up through/gi)?.length).toBeGreaterThanOrEqual(2)
  })

  test('Android vehicle settings are scoped to Android backup, not called untransmitted', async ({
    page
  }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy for Efficiver').first()).toBeVisible()
    // Scope to "2. The Efficiver Android app" - the iOS section carries its
    // own, unrelated "Vehicle settings... never transmitted" bullet that the
    // v3 review did not flag and this fix does not touch.
    const androidSection =
      (await page
        .locator('h2', { hasText: '2. The Efficiver Android app' })
        .locator('xpath=following-sibling::*[1]')
        .textContent()) ?? ''
    expect(androidSection).not.toMatch(/Vehicle settings[^.]*never transmitted/i)
    expect(androidSection).toMatch(/Android backup is enabled.*included in the backup/i)
  })

  test('the Fleet section scopes "only situation" to completed drive records, not all data', async ({
    page
  }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(
      /only situation in which your driving data\s*leaves your phone and becomes visible/i
    )
    expect(body).toMatch(/completed drive\s*records are uploaded to Efficiver Fleet/i)
  })
})

test.describe('§2.2 Help — outcome language scoped to estimates', () => {
  test('the "How Efficiver Works" paragraph no longer promises fuel savings outright', async ({
    page
  }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help & Support for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/feedback to save fuel/i)
    expect(body).toMatch(/support smoother, more efficient driving/i)
  })

  test('Wallet Watch, Fuel Impact and Analytics wording all say "estimated", not "savings"', async ({
    page
  }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help & Support for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Fuel Savings:/)
    expect(body).not.toMatch(/CO₂ emissions avoided/i)
    expect(body).not.toMatch(/your real savings so far this year/i)
    expect(body).toMatch(/Fuel Impact:\s*Estimated fuel or energy impact/i)
    expect(body).toMatch(/Estimated CO₂ impact/i)
    expect(body).toMatch(/estimated fuel, cost and CO₂ impact so far this\s*year/i)
  })

  test('Data Deletion points at real iOS/iCloud controls instead of an in-app toggle', async ({
    page
  }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help & Support for Efficiver').first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/disable iCloud sync to stop adding new cloud-stored sessions/i)
    expect(body).toMatch(/manage Efficiver's iCloud access through iOS Settings/i)
  })
})

test.describe('§2.3 Releases — Pro-gating and outcome language', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#releases')
    await expect(page.getByText('Release notes', { exact: false }).first()).toBeVisible()
    // Expand every <details> so nothing is asserted against unrendered content.
    await page.evaluate(() =>
      document.querySelectorAll('details').forEach((d) => d.setAttribute('open', ''))
    )
  })

  test('v1.5 states Trends/forecast/Year Recap/Patterns are Pro-gated and not yet rolled out', async ({
    page
  }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/part of Efficiver Pro, which\s*is coming.*hasn't rolled out yet/i)
    expect(body).toMatch(/Year Recap and Your Patterns are part of Efficiver\s*Pro, coming soon/i)
  })

  test('v1.4 no longer claims "more accurate savings"', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/[Mm]ore accurate savings/)
    expect(body).toMatch(/[Rr]efined fuel and CO₂ estimates/)
  })

  test('v1.3 Insights entry says "estimated impact", not "real savings", and Pro-gates the forecast', async ({
    page
  }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/your real savings so far this year/i)
    expect(body).toMatch(/estimated fuel, cost and CO₂ impact so far this\s*year/i)
    expect(body).toMatch(/year-end forecast is coming with Efficiver Pro/i)
  })

  test('v1.2 carries a "Current behaviour" addendum about automatic iCloud sync', async ({
    page
  }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Current behaviour:\s*iCloud synchronization now occurs automatically/i)
  })

  test('v1.0 closing paragraph says "estimated", not "save fuel and CO₂"', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/save fuel and CO₂ with personalised coaching/i)
    expect(body).toMatch(/get estimated fuel and CO₂ impact with personalised coaching/i)
  })
})

test.describe('§2.6 Fleet form — a visible response to an empty required field', () => {
  test('submitting with an empty work-email shows an on-brand hint, not silent native validation', async ({
    page
  }) => {
    await page.goto('/#fleet')
    const form = page.locator('section#fleet form')
    await expect(form).toBeVisible()
    await form.locator('button[type="submit"]').click()
    await expect(page.getByRole('alert')).toHaveText('Enter a work email to continue.')
  })

  test('the hint clears once the reader starts typing, and no request was ever sent', async ({
    page
  }) => {
    await page.goto('/#fleet')
    const form = page.locator('section#fleet form')
    await form.locator('button[type="submit"]').click()
    await expect(page.getByRole('alert')).toBeVisible()

    await form.locator('input[name="email"]').fill('ops@example.com')
    await expect(page.getByRole('alert')).toHaveCount(0)
    // Thank-you state never appeared - no submission happened off the empty click.
    await expect(page.getByText('we have your details')).toHaveCount(0)
  })
})
