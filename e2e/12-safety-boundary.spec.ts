import { test, expect } from '@playwright/test'

/**
 * Safety claim boundary — review finding 3 (D9).
 *
 * The site claimed a SAFETY BENEFIT in seven places ("promote safer driving",
 * "drive safer", "Stay safe with…", "Safer Driving Tips") while its own Terms §3
 * say Efficiver is "NOT a navigation system, a collision-avoidance system, or a
 * safety-critical aid". That contradiction is a fact; whether safety benefit is
 * an allowed claim is a Problem Framing decision, resolved as: it is not.
 *
 * Replacement per the review §5.3 — feedback that supports SMOOTHER and MORE
 * EFFICIENT driving — plus the boundary placed next to live-coaching content
 * rather than only in the Terms.
 *
 * NOT banned: the word "safe" in operational safety instructions ("Park safely",
 * "pull over safely", "do not operate while driving"). Those are the opposite of
 * a benefit claim and must stay.
 */

const BENEFIT_CLAIMS = [
  /promote safer driving/i,
  /drive safer/i,
  /driving habits and safety/i,
  /stay safe with/i,
  /safer driving tips/i,
  /improve.{0,20}safety/i
]

test.describe('No safety-benefit claim on the conversion path', () => {
  // NOTE: `section:first-of-type` is NOT the Hero — it resolves to two elements
  // (the Hero and a section inside the Footer), which is a strict-mode
  // violation. The Hero is simply the first section in document order, which is
  // how the other specs here address it.
  const SECTIONS: Array<
    [string, (p: import('@playwright/test').Page) => ReturnType<typeof p.locator>]
  > = [
    ['hero', (p) => p.locator('section').first()],
    ['features', (p) => p.locator('section#features')],
    ['how-it-works', (p) => p.locator('section#how-it-works')]
  ]

  for (const [name, locate] of SECTIONS) {
    test(`${name} makes no safety-benefit claim`, async ({ page }) => {
      await page.goto('/')
      const section = locate(page)
      await section.scrollIntoViewIfNeeded()
      await expect(section).toBeVisible()
      const text = (await section.textContent()) ?? ''
      for (const claim of BENEFIT_CLAIMS) {
        expect(text, `${name} still claims safety benefit: ${claim}`).not.toMatch(claim)
      }
    })
  }
})

test.describe('The boundary sits near live-coaching content (§5.3)', () => {
  test('Features states the boundary, not only the Terms', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    await expect(page.locator('section#features')).toBeVisible()
    const f = (await page.locator('section#features').textContent()) ?? ''
    expect(f).toMatch(/not a navigation, collision-avoidance or safety-critical system/i)
  })
})

test.describe('Operational safety instructions are untouched', () => {
  test('Terms keeps its safety section and driving instructions', async ({ page }) => {
    await page.goto('/#terms')
    await expect(page.getByText('Terms of Use', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Driving Safety/i)
    expect(body).toMatch(/NOT a navigation system/i)
    expect(body).toMatch(/pull over safely/i)
  })
})
