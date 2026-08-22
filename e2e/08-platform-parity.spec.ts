import { test, expect } from '@playwright/test'

/**
 * PLATFORM PARITY — a systematic invariant, not a list of symptoms.
 *
 * Efficiver shipped on Google Play 2026-08-23. Every page written while iOS was
 * the only platform is now a potential lie by omission, and the failures do not
 * cluster: they were found in the hero, the exit popup, the release notes, the
 * feature grid, the nav dropdown, the FAQ, the footer and the accessibility page.
 *
 * Chasing them one at a time is how you miss the ninth. This spec instead crawls
 * EVERY route and asserts parity invariants, so the whole class is visible in one
 * run and a regression anywhere fails immediately.
 *
 * The rule is NOT "never mention iOS". Platform-specific facts are fine and often
 * required — CarPlay really is iPhone-only. The rule is that an iOS-exclusive
 * technology must be either QUALIFIED (named as an iPhone feature) or BALANCED
 * (its Android counterpart named on the same page). Silence is what misleads.
 */

/**
 * `identifier` is REQUIRED, not decoration. Route views are lazy-loaded
 * (`defineAsyncComponent` in App.vue), so reading document text straight after
 * `goto` captures the page BEFORE the view mounts — every assertion then passes
 * against an empty body. That false pass is exactly how a page with six
 * "iOS Settings →" instructions reported clean. Each route now blocks on its own
 * identifier before any text is read.
 */
const ROUTES = [
  { hash: '', name: 'home', identifier: 'Why Choose Efficiver?' },
  { hash: '#investors', name: 'investors', identifier: 'Save Earth, Wealth, and Health' },
  { hash: '#terms', name: 'terms', identifier: 'Terms of Use' },
  { hash: '#privacy', name: 'privacy', identifier: 'Privacy Policy' },
  { hash: '#accessibility', name: 'accessibility', identifier: 'Accessibility at Efficiver' },
  { hash: '#help', name: 'help', identifier: 'Help & Support' },
  { hash: '#coming-soon', name: 'coming-soon', identifier: 'Coming Soon' },
  { hash: '#releases', name: 'releases', identifier: 'Release notes' }
] as const

/** iOS-exclusive technology → the Android counterpart that balances it. */
const IOS_EXCLUSIVE: Array<{ ios: RegExp; counterpart: RegExp; label: string }> = [
  { ios: /\bVoiceOver\b/i, counterpart: /\bTalkBack\b/i, label: 'VoiceOver → TalkBack' },
  { ios: /\bApple Watch\b/i, counterpart: /\bWear OS\b/i, label: 'Apple Watch → Wear OS' },
  { ios: /\bApple Maps\b/i, counterpart: /\bGoogle Maps\b/i, label: 'Apple Maps → Google Maps' },
  { ios: /\bApp Store\b/i, counterpart: /\bGoogle Play\b/i, label: 'App Store → Google Play' }
]

/** Pages that legitimately describe ONE platform in a labelled section. */
const PLATFORM_SECTIONED =
  /Supported on (iPhone|Android)|The Efficiver (iOS|Android) app|on iPhone|\(iPhone\)|on Android/i

async function textOf(
  page: import('@playwright/test').Page,
  route: { hash: string; identifier: string }
): Promise<string> {
  await page.goto(`/${route.hash}`)
  // NOT networkidle: the home page runs a looping CSS animation and lazy-loads
  // below-the-fold sections, so the network never goes idle and the wait times
  // out — masking real assertions behind a harness failure.
  await page.waitForLoadState('domcontentloaded')
  // Block until the lazy-loaded view is actually on screen, or every assertion
  // below is checked against an empty page and passes for the wrong reason.
  await expect(page.getByText(route.identifier, { exact: false }).first()).toBeVisible({
    timeout: 15000
  })
  return (await page.locator('body').textContent()) ?? ''
}

test.describe('Platform parity across every route', () => {
  for (const route of ROUTES) {
    test(`${route.name}: iOS-exclusive tech is qualified or balanced`, async ({ page }) => {
      const body = await textOf(page, route)
      const unbalanced: string[] = []

      for (const { ios, counterpart, label } of IOS_EXCLUSIVE) {
        if (!ios.test(body)) continue
        const balanced = counterpart.test(body)
        const qualified = PLATFORM_SECTIONED.test(body)
        if (!balanced && !qualified) unbalanced.push(label)
      }

      expect(
        unbalanced,
        `${route.name} names iOS-only technology with no Android counterpart and no platform label: ${unbalanced.join(', ')}`
      ).toEqual([])
    })

    test(`${route.name}: never claims Android Auto`, async ({ page }) => {
      // Google rejected the Car App Library category; the surface was removed in
      // vCode 48 and an appeal has not been filed. Not available, not "coming".
      const body = await textOf(page, route)
      expect(body).not.toMatch(/Android Auto/i)
    })

    test(`${route.name}: no shipped platform is labelled "(soon)"`, async ({ page }) => {
      // iOS, Android and both watch companions all ship. A "(soon)" chip on any of
      // them is the bug that left "Wear OS (soon)" on the site after launch.
      const body = await textOf(page, route)
      for (const shipped of ['iOS', 'Android', 'Apple Watch', 'Wear OS', 'CarPlay']) {
        expect(
          body,
          `${route.name} labels shipped platform "${shipped}" as coming soon`
        ).not.toMatch(new RegExp(`${shipped}\\s*\\(soon\\)`, 'i'))
      }
    })
  }

  test('every store CTA offers BOTH stores, on every route', async ({ page }) => {
    // The failure this catches: ExitIntentPopup and Releases each had a lone
    // App Store button, so an Android visitor was sent to a store they cannot
    // install from. Asserted per-route because CTAs are scattered.
    const offenders: string[] = []
    for (const route of ROUTES) {
      // Reuse textOf purely for its mount barrier — counting store links before the
      // lazy view renders would report 0/0 and pass on an empty page.
      await textOf(page, route)
      const appStore = await page.locator('a[href*="apps.apple.com"]').count()
      const play = await page.locator('a[href*="play.google.com"]').count()
      if (appStore > 0 && play === 0)
        offenders.push(`${route.name} (${appStore} App Store, 0 Play)`)
    }
    expect(offenders, `routes linking only to the App Store: ${offenders.join('; ')}`).toEqual([])
  })

  test('no page instructs an Android user to open iOS Settings', async ({ page }) => {
    // Help and Accessibility give step-by-step settings paths. An "iOS Settings →"
    // instruction with no Android equivalent is a dead end for half the userbase.
    const offenders: string[] = []
    for (const route of ROUTES) {
      const body = await textOf(page, route)
      const iosPath = /iOS Settings\s*→/i.test(body)
      const androidPath = /Android Settings\s*→/i.test(body)
      if (iosPath && !androidPath) offenders.push(route.name)
    }
    expect(
      offenders,
      `routes with iOS-only settings instructions and no Android path: ${offenders.join(', ')}`
    ).toEqual([])
  })
})
