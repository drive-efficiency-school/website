import { test, expect } from '@playwright/test'

/**
 * Traction claims — review findings 10 and 11.
 *
 * Finding 10: the Investor page presents a $5B market, 1,000+ users, "rapid
 * organic growth" and 100,000 active users "by year-end" — with no date, metric
 * definition, source or method, and no year named for "year-end". It also still
 * describes an iPhone-only product while §5 of the same page says both platforms.
 *
 * Finding 11: the homepage says "Join thousands" while that page says "1,000+".
 * Both cannot describe the same metric on the same date.
 *
 * DECISION (D2): gate rather than evidence. The figures need dated definitions
 * only the owner holds, and an unsourced Series-A page is the highest-liability
 * surface on the site. Gating closes 10, 11 and N13 in one move at no cost.
 *
 * The component file stays on disk unrendered — the established pattern here for
 * Testimonials / Team / Community / Sponsors. Re-introduce with dated, defined
 * figures.
 */

test.describe('Investor figures are not publicly reachable (D2)', () => {
  /**
   * POSITIVE barrier, not waitForLoadState. An absence assertion against a lazy
   * view that has not mounted yet passes for the wrong reason — the same trap
   * 06-v12-polish had. Waiting for the Hero descriptor proves the app mounted
   * AND that the unknown hash fell through to the main page, which is the
   * behaviour being asserted. Pre-fix this times out, because #investors renders
   * the investor view instead — so the red is real.
   */
  const HERO = 'The Offline Eco-Driving Assistant.'

  test('the #investors route renders no investor content', async ({ page }) => {
    await page.goto('/#investors')
    await expect(page.getByText(HERO, { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Save Earth, Wealth, and Health/i)
    expect(body).not.toMatch(/Investor Contact/i)
  })

  test('no unsourced market or traction figure survives anywhere', async ({ page }) => {
    for (const hash of ['', '#investors']) {
      await page.goto(`/${hash}`)
      await expect(page.getByText(HERO, { exact: false }).first()).toBeVisible()
      const body = (await page.locator('body').textContent()) ?? ''
      expect(body, `on /${hash}`).not.toMatch(/\$5B/i)
      expect(body, `on /${hash}`).not.toMatch(/1,000\+/)
      expect(body, `on /${hash}`).not.toMatch(/100,000 active users/i)
      expect(body, `on /${hash}`).not.toMatch(/Series A/i)
    }
  })

  test('the footer offers no Investors entry point', async ({ page }) => {
    await page.goto('/')
    await page.locator('footer').scrollIntoViewIfNeeded()
    const footer = (await page.locator('footer').textContent()) ?? ''
    expect(footer).not.toMatch(/Investors/i)
  })
})

test.describe('Homepage social proof (finding 11)', () => {
  test('claims no unsourced user count', async ({ page }) => {
    await page.goto('/')
    const hero = (await page.locator('section').first().textContent()) ?? ''
    // "Join thousands" is a social-proof claim with no cited figure, and it
    // contradicted the investor page's "1,000+" on the same site.
    expect(hero).not.toMatch(/join thousands/i)
    expect(hero).not.toMatch(/thousands of/i)
  })
})
