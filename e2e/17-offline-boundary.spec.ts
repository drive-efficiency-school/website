import { test, expect } from '@playwright/test'

/**
 * Offline claim — review finding 5.
 *
 * "Completely offline / no internet connection needed" is broader than the
 * product. Verified in source, the boundary is:
 *
 *   WITHOUT a connection — recording a drive, the Efficiency Score, Smart
 *     Detection engine on/off, session storage (SwiftData / SQLite), voice
 *     guidance, and the on-device insights (Apple Intelligence / Bonsai).
 *
 *   NEEDS a connection — weather (WeatherKit on iPhone, OpenWeather on
 *     Android), the live drive map (Apple / Google Maps), Efficient Route
 *     planning (MapKit / Google Routes + Places), iCloud sync on iPhone,
 *     Android's own Google-account backup, and fleet upload once joined.
 *
 * BRAND LOCK: the Hero descriptor "The Offline Eco-Driving Assistant." is
 * immutable per Docs/BRAND.md and the WEBSITE_AUDIT_V12 immutables list, and is
 * already pinned by 04-brand-and-chrome.spec.ts. It is POSITIONING, not a
 * capability statement, and this change must not touch it — asserted below so a
 * later sweep cannot remove it while chasing the word "offline".
 */

test.describe('Offline capability is scoped, not absolute', () => {
  test('the FAQ does not claim completely offline', async ({ page }) => {
    await page.goto('/')
    await page.locator('section#faq').scrollIntoViewIfNeeded()
    await expect(page.locator('section#faq')).toBeVisible()
    await page.getByRole('button', { name: 'Does Efficiver require internet or hardware?' }).click()
    const answer = page.getByText(/Recording a drive|works without an internet connection/i).first()
    await expect(answer).toBeVisible()
    const text = (await answer.textContent()) ?? ''
    expect(text).not.toMatch(/completely offline/i)
    expect(text).not.toMatch(/no internet connection.{0,20}(is )?needed/i)
    // Names at least one connected feature so the boundary is visible.
    expect(text).toMatch(/weather|map|route|sync|backup|fleet/i)
  })

  test('Help does not claim completely offline', async ({ page }) => {
    await page.goto('/#help')
    await expect(page.getByText('Help', { exact: false }).first()).toBeVisible()
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/completely offline/i)
  })

  test('Features scopes its offline card', async ({ page }) => {
    // SECTION-level assertion would pass for the wrong reason: sibling cards
    // ("Live drive map", "iCloud sync") already contain map/sync words. The
    // claim lives in ONE card, so assert on that card's own copy.
    await page.goto('/')
    await page.locator('section#features').scrollIntoViewIfNeeded()
    await expect(page.locator('section#features')).toBeVisible()
    const card = page.getByText(/Records and scores your drive on your phone/i).first()
    await expect(card).toBeVisible()
    const text = (await card.textContent()) ?? ''
    expect(text).not.toMatch(/no internet/i)
    expect(text).toMatch(/weather|map|route|sync/i)
  })
})

test.describe('The brand descriptor is untouched (BRAND.md immutable)', () => {
  test('Hero still reads "The Offline Eco-Driving Assistant."', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByText('The Offline Eco-Driving Assistant.', { exact: false }).first()
    ).toBeVisible()
  })
})
