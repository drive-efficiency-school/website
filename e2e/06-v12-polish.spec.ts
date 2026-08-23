import { test, expect } from '@playwright/test'

/**
 * release/v1.2 polish — verifies the 10 commits on release/v1.2 that
 * are not yet on main, beyond the audit closures already covered.
 *
 *   - Commit 01dee8e — GPS accuracy surfaced as scoring precondition
 *     in Help / FAQ / Terms.
 *   - Commit bfca4aa — Auto-Start / Auto-Stop / Auto-Track hyphenated
 *     to match in-app convention.
 *   - Commit 4c51c27 — Help.vue Settings → Wallet Watch heading rename
 *     to "Savings" with "Wallet Watch" as a sub-section.
 *   - Commit 7341afa — Help Settings page-name pointers match v1.2
 *     iOS rename.
 */

test.describe('GPS accuracy disclosure (commit 01dee8e)', () => {
  test('FAQ has dedicated GPS-accuracy Q&A', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('button', { name: 'Does Efficiver need a clear GPS signal to work?' })
      .click()
    const answer = page.getByText(/Speed, distance, route, and scoring all come from/i)
    await expect(answer).toBeVisible()
    const answerText = (await answer.textContent()) ?? ''
    expect(answerText).toMatch(/GPS/)
    expect(answerText).toMatch(/accuracy/i)
    expect(answerText).toMatch(/Efficiency Score/)
  })

  test('Help page discloses GPS as required + low-signal labels', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/GPS Required/i)
    expect(body).toMatch(/GPS Warming Up|Low GPS/)
  })

  test('Terms of Use carries GPS-accuracy liability framing', async ({ page }) => {
    await page.goto('/#terms')
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/GPS/)
    expect(body).toMatch(/Core Location|Apple's/)
  })
})

test.describe('Auto-Start / Auto-Stop / Auto-Track hyphenation (commit bfca4aa)', () => {
  test('Help page uses hyphenated forms', async ({ page }) => {
    await page.goto('/#help')
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Auto-Start/)
    expect(body).toMatch(/Auto-Stop/)
    expect(body).toMatch(/Auto-Track/)
  })

  test('Releases page uses hyphenated Auto-Track', async ({ page }) => {
    await page.goto('/#releases')
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Auto-Track/)
  })
})

test.describe('Settings rename to Savings (commits 4c51c27, 7341afa)', () => {
  test('Help page shows Savings parent heading with Wallet Watch sub-section', async ({ page }) => {
    await page.goto('/#help')
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/\bSavings\b/)
    expect(body).toMatch(/Wallet Watch/)
  })
})
