import { test, expect } from '@playwright/test'

/**
 * Brand surface + page chrome — verifies Hero / Navbar / Footer /
 * ExitIntent / removed-component closures from WEBSITE_AUDIT_V12.
 *
 * Closures covered:
 *   - H7:  Footer reads version dynamically (no hardcoded v1.1.0).
 *   - H9:  Navbar does NOT force dark mode on every load.
 *   - H10: Navbar feature dropdown updated (no Engine Calibration).
 *   - M9:  Hero no unsubstantiated 10K+ Drivers claim.
 *   - M10: Hero FaceID Secured retained (verified accurate).
 *   - M11: ExitIntent no $300,000 claim — replaced by Subline brand.
 *   - M12: Footer copyright drops "(formerly Efficient Driver)".
 *   - I3:  No 10K+ claim anywhere user-facing.
 *   - I8:  Testimonials section removed from rendered App.
 *   - I9:  Sponsors section removed from rendered App.
 *   - I10: Team section removed from rendered App pending handle migration.
 */

test.describe('Hero (M9, M10, I3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Hero descriptor present (locked brand positioning)', async ({ page }) => {
    await expect(
      page.getByText('The Offline Eco-Driving Assistant.', { exact: false }).first()
    ).toBeVisible()
  })

  test('Hero does NOT claim 10K+ drivers (M9, I3)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/10K\+|10,000\+ (drivers|users)/i)
  })

  test('Hero retains FaceID Secured (M10 — verified accurate)', async ({ page }) => {
    await expect(page.getByText('FaceID Secured', { exact: false }).first()).toBeVisible()
  })
})

test.describe('Navbar (H9, H10)', () => {
  test('first load does not force-add .dark class without user signal (H9)', async ({
    page,
    context
  }) => {
    // Clear any prior color-mode persistence so this is a "first visit".
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => {
      window.localStorage.clear()
      window.sessionStorage.clear()
    })
    await page.reload()
    // Wait for Vue to mount + Navbar onMounted to run.
    await page.waitForLoadState('load') // NOT networkidle: the Turnstile widget keeps the network busy indefinitely
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )
    // useColorMode default is "auto" — under Playwright's default
    // light color-scheme emulation, .dark must NOT be applied if H9
    // is closed (no hard-coded `mode.value = 'dark'` override).
    expect(hasDarkClass).toBe(false)
  })

  test('feature dropdown does not list obsolete Engine Calibration (H10)', async ({ page }) => {
    await page.goto('/')
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Engine Calibration: Petrol, Diesel/i)
  })
})

test.describe('Footer (H7, M5, M12)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('footer').scrollIntoViewIfNeeded()
  })

  test('version label references v1.3 (H7 — dynamic, not hardcoded v1.1.0)', async ({ page }) => {
    const footer = (await page.locator('footer').textContent()) ?? ''
    expect(footer).toMatch(/v1\.3/)
    expect(footer).not.toMatch(/v1\.1\.0\s*\(26052227\)/)
  })

  test('copyright does NOT carry "(formerly Efficient Driver)" tag (M12)', async ({ page }) => {
    const footer = (await page.locator('footer').textContent()) ?? ''
    expect(footer).not.toMatch(/\(formerly Efficient Driver\)/i)
  })

  test('does NOT label Apple Watch as "Soon" (M5)', async ({ page }) => {
    const footer = (await page.locator('footer').textContent()) ?? ''
    expect(footer).not.toMatch(/Apple Watch[^.]{0,40}Soon/i)
  })
})

test.describe('ExitIntent popup (M11)', () => {
  test('triggered popup uses Subline brand line, not $300,000 claim', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load') // NOT networkidle: the Turnstile widget keeps the network busy indefinitely
    // Mouseleave on `document` is what ExitIntentPopup listens for.
    await page.evaluate(() => {
      const event = new MouseEvent('mouseleave', { bubbles: true })
      document.dispatchEvent(event)
    })
    // Subline replacement (M11) — give the popup time to mount.
    const subline = page.getByText('Save. Drive. Live.', { exact: false }).first()
    await expect(subline).toBeVisible({ timeout: 5_000 })
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/\$300,000|\$300K/i)
    expect(body).not.toMatch(/10K\+ drivers/i)
  })
})

test.describe('Removed components (I8, I9, I10)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load') // NOT networkidle: the Turnstile widget keeps the network busy indefinitely
  })

  test('Testimonials section is NOT rendered (I8)', async ({ page }) => {
    // The Testimonials component is intentionally not imported in
    // App.vue. The stock shadcn placeholder testimonials (with
    // shadcn.png avatars + fabricated savings claims) must not
    // appear to users.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Driving School Owner/i)
    expect(body).not.toMatch(/Fleet Manager/i)
    expect(body).not.toMatch(/Eco Enthusiast/i)
  })

  test('Sponsors / Eco Partners section is NOT rendered (I9)', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Tata Motors/i)
    expect(body).not.toMatch(/Mahindra Electric/i)
    expect(body).not.toMatch(/BluSmart/i)
  })

  test('Team section is NOT rendered (I10 — pending handle migration)', async ({ page }) => {
    // Assert the Team component itself is absent via its section id + real
    // heading — NOT a loose "Our Team" substring, which collided with the
    // Contact form's legitimate "reach out to our team" copy once the form
    // was enabled (Team.vue's actual heading is "Meet the Team Behind Efficiver").
    await expect(page.locator('section#team')).toHaveCount(0)
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/Meet the Team Behind Efficiver/i)
  })
})
