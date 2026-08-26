import { test, expect } from '@playwright/test'

/**
 * Numeric fuel-savings claims — review finding 1.
 *
 * The 8–22% range appeared in FOUR product-level metadata slots (meta
 * description, og:description, twitter:description, JSON-LD description) phrased
 * as an Efficiver outcome: "helps you save 8-22% on fuel", "Save 8–22% on fuel
 * with Efficiver". That is an app performance claim, and no Efficiver-specific
 * validation supports it. FuelModelConstants marks every model value
 * "PROVISIONAL pending field validation"; there is no ground truth anywhere.
 *
 * The FAQ's ANSWER was already in the correct form — attributed to industry
 * research and explicitly declining to claim Efficiver delivers it. Two residual
 * defects: the question header "How much fuel can I save WITH EFFICIVER?"
 * re-attributed what the answer disclaimed, and no source was named.
 *
 * No citation exists in the repo and inventing one is not an option, so the
 * number goes for now. It can return the moment a real source is supplied — the
 * attributed FORM was never the problem.
 */

test.describe('No product-level savings percentage in metadata', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  for (const [label, sel, attr] of [
    ['meta description', 'meta[name="description"]', 'content'],
    ['og:description', 'meta[property="og:description"]', 'content'],
    ['twitter:description', 'meta[name="twitter:description"]', 'content']
  ] as const) {
    test(`${label} quotes no savings percentage`, async ({ page }) => {
      const v = (await page.locator(sel).getAttribute(attr)) ?? ''
      expect(v, label).not.toMatch(/\d+\s*[-–]\s*\d+\s*%/)
      expect(v, label).not.toMatch(/save \d+/i)
    })
  }

  test('JSON-LD description quotes no savings percentage', async ({ page }) => {
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent()
    const parsed = JSON.parse(raw!)
    expect(parsed.description).not.toMatch(/\d+\s*[-–]\s*\d+\s*%/)
    expect(parsed.description).not.toMatch(/save \d+/i)
  })
})

test.describe('The FAQ no longer attributes a figure to Efficiver', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('section#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('section#faq')).toBeVisible()
  })

  test('the question does not ask what Efficiver saves', async ({ page }) => {
    const faq = (await page.locator('section#faq').textContent()) ?? ''
    expect(faq).not.toMatch(/How much fuel can I save with Efficiver/i)
  })

  test('answers honestly, with no uncited percentage', async ({ page }) => {
    // The accordion mounts its answer ONLY when expanded (radix-vue), so an
    // assertion against the collapsed section passes for the wrong reason.
    // Expand first, then assert - on the reframed question, which does not
    // exist pre-fix, so the click itself is part of the red.
    await page.getByRole('button', { name: /How much fuel can efficient driving save/i }).click()
    const answer = page.getByText(/efficient-driving techniques/i).first()
    await expect(answer).toBeVisible()
    const text = (await answer.textContent()) ?? ''
    expect(text).not.toMatch(/\d+\s*[-–]\s*\d+\s*%/)
    expect(text).toMatch(/depends on|varies|vary/i)
  })
})
