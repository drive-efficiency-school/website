import { test, expect } from '@playwright/test'

/**
 * The iCloud sync default — N1, the most serious item in this workstream.
 *
 * The Privacy Policy stated a FALSE DEFAULT and pointed at a control that does
 * not exist. Verified in source:
 *
 *   ios-frontend AppMain.makeSharedModelContainer() builds the container with a
 *   four-rung cascade whose FIRST rung is
 *     ModelConfiguration(..., cloudKitDatabase: .private("iCloud.school.efficiency.drive.efficiver.v2"))
 *   and only falls back to local-only if that THROWS. So for anyone signed into
 *   iCloud, sync is ON by default.
 *
 *   There is no in-app toggle. The entire Settings tree was read - SettingsView
 *   and AppPreferencesView - and General holds exactly three switches:
 *   Prioritise Low Power, Apple Maps, Temperature in Gauge. The app's own delete
 *   alert even says "The deletion syncs to iCloud".
 *
 * The always-on design is deliberate (D6): CloudKit's Production schema already
 * blocked an Int->Double field change once, forcing the container to be
 * abandoned for a .v2; a user toggle would mean two persistent-store topologies
 * plus bidirectional migration on a schema that could not absorb one field
 * change.
 *
 * CONTROL PATH - researched, not asserted from memory. Apple documents
 * Settings > [your name] > iCloud > See All > [app], and states only the
 * forward behaviour: "the app no longer connects with iCloud, so your data
 * exists only on your device". Apple does NOT document what happens to data
 * ALREADY in iCloud, so the site must not claim it either.
 */

test.describe('Privacy Policy states the real iCloud default', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#privacy')
    await expect(page.getByText('Privacy Policy', { exact: false }).first()).toBeVisible()
  })

  test('never calls sync optional or off by default', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/off by default/i)
    expect(body).not.toMatch(/iCloud sync is optional/i)
    expect(body).not.toMatch(/If you turn on iCloud sync/i)
    expect(body).not.toMatch(/if you switch on iCloud/i)
  })

  test('never points at an in-app iCloud control', async ({ page }) => {
    // No such toggle exists anywhere in the app's Settings tree.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/the app'?s preferences/i)
  })

  test('names the real OS control path', async ({ page }) => {
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/See All/i)
    expect(body).toMatch(/signed in to iCloud|signed into iCloud/i)
  })

  test('claims nothing about data already in iCloud after switching off', async ({ page }) => {
    // Apple documents only the forward behaviour. Anything more would be invented.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/previously-synced sessions remain/i)
  })

  test('makes no end-to-end encryption claim', async ({ page }) => {
    // "end-to-end" is an encryption term. A CloudKit private database is E2EE
    // only under Advanced Data Protection, which is the user's setting and not
    // something Efficiver can promise.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).not.toMatch(/end-to-end/i)
  })

  test('keeps the claim that is verified', async ({ page }) => {
    // Intent, not exact phrasing: Efficiver cannot read the private database,
    // and the data is not on Efficiver's servers. Both are verified - the app
    // holds no CloudKit credentials beyond the user's own account.
    const body = (await page.locator('body').textContent()) ?? ''
    expect(body).toMatch(/Efficiver has no access/i)
    expect(body).toMatch(/not on our servers|never our servers/i)
  })
})
