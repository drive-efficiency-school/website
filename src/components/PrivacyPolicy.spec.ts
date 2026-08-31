import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrivacyPolicy from './PrivacyPolicy.vue'
import { config } from '@/lib/config'

describe('PrivacyPolicy', () => {
  it('shows the content-change date from the shared config', () => {
    const wrapper = mount(PrivacyPolicy)
    expect(wrapper.text()).toContain(`Last updated: ${config.lastUpdated.privacy}`)
  })

  it('renders all eleven sections (Summary + 1-10) in order', () => {
    const wrapper = mount(PrivacyPolicy)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    expect(headings).toEqual([
      'Summary',
      '1. The Efficiver iOS app',
      '2. The Efficiver Android app',
      '3. Fleet mode (opt-in, both apps)',
      '4. The Efficiver website (efficiver.com)',
      '5. How we share data',
      '6. Data retention',
      '7. Your rights',
      "8. Children's privacy",
      '9. Changes to this policy',
      '10. Contact'
    ])
  })

  // Google Play rejected the app 2026-08-30/31 for "Data retention policy
  // not specified" - the privacy policy had retention info scattered
  // (Fleet-uploaded drives, contact form) but no explicit statement for the
  // primary on-device case, which is most of what the app actually stores.
  // Verified against email-fullstack/face-backend source before writing this:
  // ContactSubmission and Subscriber both use Fluent soft-delete with no
  // automatic purge job anywhere in the codebase, and unsubscribing only
  // flips `isActive` - it does not delete the Subscriber row. So the
  // previous "retained for the time needed to fulfill your request and
  // respond" claim in section 4 was inaccurate and is now corrected too,
  // not just supplemented.
  describe('Data retention (Google Play rejection, 2026-08-31)', () => {
    it('states retention for on-device data as user-controlled, no server-side period', () => {
      const wrapper = mount(PrivacyPolicy)
      const text = wrapper.text()
      expect(text).toMatch(/kept on your device for as long as you keep the app installed/i)
      expect(text).toMatch(/we don't set a retention period for it/i)
    })

    it('states iCloud/Android backup retention is governed by the platform, not Efficiver', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toMatch(
        /governed by your own Apple\s*or Google account, not by Efficiver/i
      )
    })

    it('states Fleet-uploaded drives are purged per the employer-set period', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toMatch(
        /kept for the retention period your employer\s*sets.*permanently purged/i
      )
    })

    it('states contact/newsletter data is kept until deletion is requested, not auto-purged', () => {
      const wrapper = mount(PrivacyPolicy)
      const text = wrapper.text()
      expect(text).not.toMatch(/retained for the time needed to fulfill your request and respond/i)
      expect(text).toMatch(/kept in our systems until\s*you ask us to delete them/i)
      expect(text).toMatch(/does not by\s*itself delete your subscriber record/i)
    })
  })

  describe('iCloud (N1, D6)', () => {
    it('states the real default - syncs automatically while signed in, no separate switch', () => {
      // D6: a per-user sync toggle was cancelled by owner decision (sync/
      // migration risk). The copy must describe the ACTUAL default, not an
      // invented control.
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('Efficiver does not have a separate sync switch')
      expect(wrapper.text()).toContain('While your iPhone is signed in to iCloud')
    })

    it('does not invent a claim Apple itself does not document', () => {
      // N1's earlier draft asserted what happens to already-synced data after
      // the toggle-off. Apple documents only the forward effect; the previous
      // text had invented an answer for the rest. The corrected copy says so.
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('does not document what happens to data already stored')
      expect(wrapper.text()).toContain('we will not claim it either')
    })

    it('names the real iOS control path, not an in-app toggle', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('Settings → [your name] → iCloud')
      expect(wrapper.text()).toContain('See All')
    })
  })

  describe('what actually leaves the device (the AP1/AP2 boundary)', () => {
    it('names OpenWeather and Google Maps as receiving only location, on Android', () => {
      const wrapper = mount(PrivacyPolicy)
      const openWeather = wrapper.get('a[href="https://openweather.co.uk/privacy-policy"]')
      expect(openWeather.text()).toContain("OpenWeather's privacy policy")
      const google = wrapper.get('a[href="https://policies.google.com/privacy"]')
      expect(google.text()).toContain("Google's privacy policy")
      expect(wrapper.text()).toContain('We do not store these requests on our servers')
    })

    it('states no advertising identifiers, analytics or ad tracking, for both platforms', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain(
        'No advertising identifiers, no third-party analytics, no ad tracking'
      )
      expect(wrapper.text()).toContain('No advertising identifiers (IDFA, IDFV)')
      expect(wrapper.text()).toContain('No advertising identifiers') // Android's own list
    })

    it('never sells, rents or trades personal information', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('We never sell, rent, or trade your personal information')
      expect(wrapper.text()).toContain("We don't sell, rent, or trade your personal information")
    })
  })

  describe('fleet mode (§3) - the one real exception', () => {
    it('requires an invite code - no open sign-up', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('invite code')
      expect(wrapper.text()).toContain('there is no open sign-up')
    })

    it('requires an explicit consent screen before joining', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('consent screen')
      expect(wrapper.text()).toContain('You must accept it to continue')
    })

    it('shares only on-duty drives, never off-duty ones', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('Nothing is uploaded while you are off duty')
      expect(wrapper.text()).toContain('Drives recorded while you are off duty')
    })

    it('never shares the Smart Detection model with the fleet', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain(
        'Your Smart Detection model, which is never shared with your fleet'
      )
    })
  })

  describe('the website forms (§4)', () => {
    it('interpolates the real API base URL the forms submit to', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.get('code').text()).toBe(config.api.baseUrl)
    })

    it('scopes newsletter and contact-form collection to what is actually typed in', () => {
      const wrapper = mount(PrivacyPolicy)
      expect(wrapper.text()).toContain('your email address, optionally your name')
      expect(wrapper.text()).toContain('You are not added to any list')
    })
  })

  it('carries a working contact mailto link in every section that offers one', () => {
    const wrapper = mount(PrivacyPolicy)
    const links = wrapper.findAll('a[href="mailto:contact@efficiver.com"]')
    expect(links.length).toBeGreaterThanOrEqual(3) // §3, §6, §9
  })

  it('states the 17+ store rating separately from the under-13 collection statement', () => {
    const wrapper = mount(PrivacyPolicy)
    expect(wrapper.text()).toContain('17+ age rating')
    expect(wrapper.text()).toContain(
      'do not knowingly collect personal information from children under 13'
    )
  })
})
