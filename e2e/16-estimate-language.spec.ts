import { test, expect } from '@playwright/test'

/**
 * Fuel / cost / CO₂ wording — review finding 2.
 *
 * "Quantify fuel savings and CO₂ reductions" claims measurement. The model does
 * not measure; it estimates, and says so in its own source. FuelModelConstants:
 *
 *   - a VT-CPFM physics model over mass, drag area, rolling resistance and grade
 *   - constants drawn from LIGHT-DUTY tables, with per-segment defaults, not from
 *     the user's actual vehicle
 *   - a per-user coefficient solved against a SYNTHETIC WLTC-class reference
 *     cycle, not against measured fuel use
 *   - a display-time plausibility guard clamping the result to 0.5–2.0x the
 *     baseline, which only exists because the estimate can be that far out
 *   - and, in the file's own words, every value is "PROVISIONAL pending
 *     Phase-B field validation"
 *
 * There is no ground truth anywhere in the product. Pricing and Help already
 * said "estimate"; Features and HowItWorks were the outliers.
 */

/**
 * NO \b ANCHORS. textContent concatenates adjacent element text with NO
 * separator, so a card renders as "Fuel & CO₂ SavingsQuantify fuel savings..."
 * and /\bquantify\b/ never matches - the assertion then passes for the wrong
 * reason. This bit three separate specs in this workstream. Plain substrings.
 *
 * "measure" is deliberately absent: the apps' own honest framing is a screen
 * called "What we measure", which this site should eventually adopt.
 */
const MEASUREMENT_WORDS = [/quantify/i, /exact fuel|exact savings|exact CO/i, /precisely/i]

test.describe('Savings are described as estimates', () => {
  for (const sel of ['section#features', 'section#how-it-works']) {
    test(`${sel} claims no measurement of fuel or CO₂`, async ({ page }) => {
      await page.goto('/')
      await page.locator(sel).scrollIntoViewIfNeeded()
      await expect(page.locator(sel)).toBeVisible()
      const text = (await page.locator(sel).textContent()) ?? ''
      for (const w of MEASUREMENT_WORDS) {
        expect(text, `${sel} implies measurement: ${w}`).not.toMatch(w)
      }
    })
  }

  test('Features says estimate and names the variability', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    await expect(page.locator('section#features')).toBeVisible()
    const f = (await page.locator('section#features').textContent()) ?? ''
    expect(f).toMatch(/estimate/i)
    expect(f).toMatch(/vehicle|road|traffic|route|conditions/i)
  })

  test('How It Works says estimate', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#how-it-works').scrollIntoViewIfNeeded()
    await expect(page.locator('section#how-it-works')).toBeVisible()
    const h = (await page.locator('section#how-it-works').textContent()) ?? ''
    expect(h).toMatch(/estimate/i)
  })
})
