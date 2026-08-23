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

/**
 * iOS-exclusive technology → the Android counterpart that balances it.
 *
 * Every counterpart here was read out of the Android source, not assumed. The
 * one that would have been wrong on instinct is SwiftData: Android does NOT use
 * Room. gradle/libs.versions.toml pins androidx.sqlite with the comment
 * "persistence WITHOUT KSP/Room", so the honest counterpart is SQLite.
 */
const IOS_EXCLUSIVE: Array<{ ios: RegExp; counterpart: RegExp; label: string }> = [
  { ios: /\bVoiceOver\b/i, counterpart: /\bTalkBack\b/i, label: 'VoiceOver → TalkBack' },
  { ios: /\bApple Watch\b/i, counterpart: /\bWear OS\b/i, label: 'Apple Watch → Wear OS' },
  { ios: /\bwatchOS\b/i, counterpart: /\bWear OS\b/i, label: 'watchOS → Wear OS' },
  { ios: /\bApple Maps\b/i, counterpart: /\bGoogle Maps\b/i, label: 'Apple Maps → Google Maps' },
  { ios: /\bApp Store\b/i, counterpart: /\bGoogle Play\b/i, label: 'App Store → Google Play' },
  // androidx.sqlite (SupportSQLiteOpenHelper), verified in libs.versions.toml.
  { ios: /\bSwiftData\b/i, counterpart: /\bSQLite\b/i, label: 'SwiftData → SQLite' },
  // androidx.biometric BiometricPrompt, verified in MainActivity.kt.
  {
    ios: /\b(Face ID|Touch ID)\b/i,
    counterpart: /\b(fingerprint|face unlock|biometric)\b/i,
    label: 'Face ID / Touch ID → biometric unlock'
  },
  // Android shows a foreground-service notification (DriveForegroundService).
  {
    ios: /\bLive Activity\b/i,
    counterpart: /\bnotification\b/i,
    label: 'Live Activity → ongoing notification'
  },
  {
    ios: /\bDynamic Type\b/i,
    counterpart: /\b(larger text|font size|font scale|text size)\b/i,
    label: 'Dynamic Type → larger text'
  },
  // Android fetches weather from OpenWeather, verified in WeatherCard.kt.
  { ios: /\bWeatherKit\b/i, counterpart: /\bOpenWeather\b/i, label: 'WeatherKit → OpenWeather' }
]

/**
 * iOS technology with NO Android counterpart at all.
 *
 * These can only ever be QUALIFIED — there is nothing to balance them against,
 * so the "or balanced" half of the rule must not apply. Folding them into
 * IOS_EXCLUSIVE with a never-matching counterpart would work but would read as
 * an oversight; the asymmetry is real and worth naming. The Android app has no
 * Assistant integration and no cloud sync, both confirmed in its source.
 */
const IPHONE_ONLY: Array<{ ios: RegExp; label: string }> = [
  { ios: /\bSiri\b/i, label: 'Siri (iPhone only)' },
  { ios: /\biCloud\b/i, label: 'iCloud (iPhone only)' },
  { ios: /\bCarPlay\b/i, label: 'CarPlay (iPhone only)' }
]

/**
 * A qualifier that scopes an iOS-exclusive claim to iPhone.
 *
 * Evaluated PER STATEMENT — never page-wide. The first version of this spec
 * tested the whole page, so a single "On iPhone" heading anywhere exempted
 * every unqualified claim on it: Help.vue passed while still saying
 * "Full-screen Apple Maps view" and "uses your iPhone's built-in sensors". A
 * page-level escape hatch turns an invariant back into a symptom check, which
 * is the exact failure mode this file exists to end.
 */
const IPHONE_QUALIFIER = /\b(on iPhone|iPhone'?s?\b|iOS\b|Supported on iPhone)/i

interface Statement {
  /** Text of the block element (li / p / td / heading) that makes the claim. */
  text: string
  /**
   * The full heading trail that scopes this claim — "Privacy Policy › 1. The
   * Efficiver iOS app › Apple-provided services", not just the last heading.
   */
  scope: string
}

/**
 * Read the page as a list of block-level STATEMENTS, each tagged with the
 * section that owns it.
 *
 * Scope is a document-structure property, not a character-distance one, and it
 * is not uniform across the two checks:
 *
 *  - QUALIFICATION is judged on the statement PLUS its heading trail. The trail
 *    must be the full ancestor stack, not the nearest heading: the Privacy
 *    Policy scopes "Apple Maps (MapKit) powers the live drive map" with the h2
 *    "1. The Efficiver iOS app", two levels above the h3 it sits under. Reading
 *    only the nearest heading called that correctly-scoped sentence a lie.
 *  - BALANCE is judged on the statement alone. Widening it to the section is
 *    the same escape hatch one size down: Help's "Key Features" list says
 *    "Full-screen Apple Maps view" in one bullet and "open it in Apple or
 *    Google Maps" — a different feature entirely — four bullets later, and
 *    section-wide balance let the first bullet pass on the second's wording.
 *
 * Bolded label paragraphs ("On iPhone:", "On Android:") count as headings.
 * They are how Help actually scopes its two accessibility lists, and ignoring
 * them would flag correctly-labelled copy.
 *
 * KNOWN LIMIT, measured rather than assumed. A negative-control injection
 * proved this catches unqualified VoiceOver / Apple Maps / SwiftData / Siri in
 * a fresh paragraph — but the SAME injection appended to an existing paragraph
 * that already contained the word "iPhone" was NOT caught, because the block is
 * the qualification unit. So a long paragraph mentioning iPhone once can still
 * shelter an unrelated iOS-only claim later in that same paragraph. Keeping
 * claims to one block each is what makes this check honest; if a page grows
 * long multi-claim paragraphs, tighten this to sentence granularity.
 *
 * It also cannot judge a statement that qualifies itself CORRECTLY but answers
 * incompletely — FAQ's "your data stays on your iPhone" was a true sentence and
 * a misleading answer once Android shipped. Only reading catches that.
 */
async function statementsOf(page: import('@playwright/test').Page): Promise<Statement[]> {
  return page.evaluate(() => {
    const BLOCKS = 'li,p,td,th,dd,dt,figcaption,blockquote,h1,h2,h3,h4,h5,h6'
    const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

    // Leaf blocks only: a <p> nested in an <li> would otherwise be counted
    // twice, and the outer copy would carry text the inner claim does not own.
    const blocks = Array.from(document.querySelectorAll(BLOCKS)).filter(
      (el) => !el.querySelector(BLOCKS)
    )

    /** Heading level, or 0 for body copy. A short bold "Label:" acts as one. */
    const levelOf = (el: Element, text: string): number => {
      const m = /^H([1-6])$/.exec(el.tagName)
      if (m) return Number(m[1])
      const bold = el.querySelector('strong,b')
      if (!bold || text.length > 40 || !text.endsWith(':')) return 0
      // The colon may sit inside the <strong> ("<strong>On iPhone:</strong>")
      // or outside it ("<strong>On iPhone</strong>:"). Help uses the former,
      // and requiring the latter flagged its correctly-labelled lists.
      const boldText = norm(bold.textContent)
      return boldText === text || boldText === text.slice(0, -1) ? 7 : 0
    }

    const out: Statement[] = []
    const stack: string[] = []

    for (const el of blocks) {
      const text = norm(el.textContent)
      if (!text) continue
      const level = levelOf(el, text)
      if (level > 0) {
        while (stack.length >= level) stack.pop()
        while (stack.length < level - 1) stack.push('')
        stack.push(text)
      }
      out.push({ text, scope: stack.filter(Boolean).join(' › ') })
    }

    return out
  })
}

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
      await textOf(page, route)
      const statements = await statementsOf(page)
      const unbalanced: string[] = []

      for (const { ios, counterpart, label } of IOS_EXCLUSIVE) {
        for (const s of statements) {
          if (!ios.test(s.text)) continue
          // Qualified by its own wording, or by the heading trail that scopes it.
          if (IPHONE_QUALIFIER.test(s.text) || IPHONE_QUALIFIER.test(s.scope)) continue
          // Balanced by naming the Android counterpart in the same breath.
          if (counterpart.test(s.text)) continue
          unbalanced.push(
            `${label} — under "${s.scope || '(top level)'}": "${s.text.slice(0, 120)}"`
          )
        }
      }

      for (const { ios, label } of IPHONE_ONLY) {
        for (const s of statements) {
          if (!ios.test(s.text)) continue
          if (IPHONE_QUALIFIER.test(s.text) || IPHONE_QUALIFIER.test(s.scope)) continue
          unbalanced.push(
            `${label} — under "${s.scope || '(top level)'}": "${s.text.slice(0, 120)}"`
          )
        }
      }

      expect(
        unbalanced,
        `${route.name} states iOS-only technology with neither an Android counterpart nor an iPhone qualifier nearby:\n  ${unbalanced.join('\n  ')}`
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
