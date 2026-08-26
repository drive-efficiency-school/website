import { test, expect } from '@playwright/test'

/**
 * Remaining N-series. Two of these are LEGAL text and are corrected only to
 * remove a self-contradiction — neither expands nor narrows any obligation.
 *
 *  N4  Terms §2 licenses the app "for personal, non-commercial purposes" and
 *      forbids "commercial fleet ... operations without a separate written
 *      agreement", while Privacy §3 and the Fleet callout document fleet use as
 *      a shipping feature OF THAT SAME APP. A driver reading the Terms sees the
 *      product they are using prohibited. The fleet subscription IS the separate
 *      agreement; the Terms simply never said so.
 *
 *  N12 Privacy §7 sets two thresholds in one paragraph — "intended for users
 *      aged 17 and over" and "do not knowingly collect ... from children under
 *      13". They are different things (a store age rating vs a COPPA
 *      obligation) and reading as a contradiction. Both are kept, distinguished.
 *
 *  N14 The default share text is a first-person OUTCOME claim: "I'm saving fuel
 *      with Efficiver". The site puts words in the sharer's mouth about a result
 *      the product does not measure.
 *
 *  N15 The exit popup's dismiss label — "No thanks, I'll pay more for fuel" —
 *      implies declining costs the visitor money, i.e. a guaranteed saving.
 */

test.describe('Terms cover the fleet product they ship (N4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#terms')
    await expect(page.getByText('Terms of Use', { exact: false }).first()).toBeVisible()
  })

  test('does not forbid the fleet feature the app ships', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/for personal, non-commercial purposes/i)
    expect(body).toMatch(/Efficiver Fleet/i)
  })

  test('still restricts resale and reverse engineering', async ({ page }) => {
    // The licence must not be loosened by this correction.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/reverse-engineer/i)
    expect(body).toMatch(/non-transferable/i)
  })
})

test.describe("Children's privacy states one rule per threshold (N12)", () => {
  test('distinguishes the age rating from the collection rule', async ({ page }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/intended for users aged 17 and over\. We do not knowingly/i)
    expect(body).toMatch(/age rating|rated 17/i)
  })
})

test.describe('No outcome claim in share or exit copy (N14, N15)', () => {
  test('the share text makes no first-person savings claim', async ({ page }) => {
    // The default share text is a JS prop and NEVER enters the DOM, so checking
    // page.content() passes for the wrong reason. Intercept window.open and read
    // the URL the share button actually builds.
    await page.goto('/')
    await page.evaluate(() => {
      ;(window as unknown as { __openedUrl?: string }).__openedUrl = ''
      window.open = (url?: string | URL) => {
        ;(window as unknown as { __openedUrl?: string }).__openedUrl = String(url ?? '')
        return null
      }
    })
    await page
      .getByRole('button', { name: /Share on X/i })
      .first()
      .click()
    const opened = await page.evaluate(
      () => (window as unknown as { __openedUrl?: string }).__openedUrl ?? ''
    )
    expect(opened).toContain('twitter.com')
    expect(decodeURIComponent(opened)).not.toMatch(/I'?m saving fuel/i)
  })

  test('the exit popup does not imply declining costs money', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await expect(async () => {
      await page.evaluate(() =>
        document.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      )
      await expect(page.getByText('Save. Drive. Live.', { exact: false }).first()).toBeVisible({
        timeout: 1_000
      })
    }).toPass({ timeout: 15_000 })
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/pay more for fuel/i)
  })
})
