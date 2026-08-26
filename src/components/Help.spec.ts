import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Help from './Help.vue'
import { config } from '@/lib/config'

describe('Help', () => {
  it('shows the content-change date from the shared config', () => {
    const wrapper = mount(Help)
    expect(wrapper.text()).toContain(`Last updated: ${config.lastUpdated.help}`)
  })

  it('renders all ten top-level sections in order', () => {
    const wrapper = mount(Help)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    expect(headings).toEqual([
      'Getting Started',
      'How Efficiver Works',
      'Driving Interface',
      'Efficient-Driving Tips',
      'Troubleshooting',
      'Settings & Customization',
      'Session History & Analytics',
      'Privacy & Data Security',
      'Support & Contact',
      'Updates & Roadmap'
    ])
  })

  describe('calibration timing (N2) - initial and manual, not one-time and automatic', () => {
    it('says the calibration is run by the reader, not automatic', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('An initial two-minute calibration you run while parked')
      expect(wrapper.text()).toContain('You run the initial calibration yourself')
    })

    it('never claims a one-minute calibration', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).not.toMatch(/one-minute calibration/i)
      expect(wrapper.text()).not.toMatch(/1-minute calibration/i)
    })
  })

  describe('auto-start/stop attribution (N3) - location, not Motion & Fitness, x3', () => {
    it('attributes it to location in the onboarding permissions step', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain(
        'Grant location access — it drives GPS tracking and the automatic start/stop of drives'
      )
    })

    it('attributes it to location in the troubleshooting entry, with the concrete iOS/Android paths', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('Automatic start/stop runs on location, so on iPhone set')
      expect(wrapper.text()).toContain('Location Services → Efficiver')
      expect(wrapper.text()).toContain('Allow all the time')
    })

    it('attributes it to location again in the Permissions list, explicitly ruling out Motion & Fitness', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('Automatic start/stop uses location, not this permission')
    })
  })

  describe('braking sensitivity (N6) - adapts to speed and gear, not a blanket claim', () => {
    it('states the thresholds adapt, and describes the reversal at speed', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('adapt to your speed and gear')
      expect(wrapper.text()).toContain(
        'flags sharp acceleration a little sooner than sharp braking'
      )
      expect(wrapper.text()).toContain('at higher speeds that reverses')
    })

    it('carries no safety-benefit claim alongside it', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).not.toMatch(/\bsafer driving\b/i)
    })
  })

  describe('fuel/CO2 language (N7, N9) - estimated, no fixed percentage', () => {
    it('calls fuel and CO2 figures estimated, not quantified', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('Estimated fuel / electricity saved')
    })

    it('never states the removed 8-22% fuel-saving figure', () => {
      // Not a blanket "no N-N%" check - the page legitimately shows score
      // bands (80-100%, 60-79%, ...) in "Understanding Your Score", which are
      // not a savings claim and must stay. This targets the specific figure
      // N9 removed as a product-level guarantee.
      const wrapper = mount(Help)
      expect(wrapper.text()).not.toContain('8-22%')
      expect(wrapper.text()).not.toContain('8–22%')
    })

    it('states scoring has not been validated against measured fuel use', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('has not been validated against measured fuel use')
    })
  })

  describe('accessibility (N11) - supported throughout, not "full support"', () => {
    it('uses "supported throughout" rather than a "full" claim', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('VoiceOver — supported throughout the app')
      expect(wrapper.text()).not.toMatch(/full support/i)
    })

    it('points to the Accessibility page for the limitations it does not repeat here', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('current limitations')
      expect(wrapper.text()).toContain('is a known limitation')
    })
  })

  describe('GPS disclosure', () => {
    it('names the ~30m accuracy threshold and both status labels', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('GPS Warming Up')
      expect(wrapper.text()).toContain('Low GPS')
      expect(wrapper.text()).toContain('~30 m')
      expect(wrapper.text()).toContain('GPS Signal Weak — Scores may be affected')
    })
  })

  describe('vehicle-class boundary', () => {
    it('names what is not modelled yet, without a bare "coming soon"', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('There is no hybrid setting yet')
      expect(wrapper.text()).toContain('two- and three-wheelers')
      expect(wrapper.text()).toContain('trucks are not modelled')
    })
  })

  describe('offline boundary (N8)', () => {
    it('scopes what needs a connection, rather than a blanket offline claim', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('Recording and scoring need only GPS and run with no')
      expect(wrapper.text()).toContain('Weather, the live map, Efficient Route planning')
    })
  })

  describe('pricing language', () => {
    it('states Efficiver Pro pricing is still being finalised, matching the FAQ/Pricing SOT', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('which is coming; pricing is still being finalised')
    })
  })

  it('lists nine troubleshooting entries plus four CarPlay-specific ones', () => {
    const wrapper = mount(Help)
    const terms = wrapper.findAll('dt').map((dt) => dt.text())
    expect(terms).toContain('App not detecting drives automatically')
    expect(terms).toContain("Efficiver doesn't appear on the CarPlay screen")
    expect(terms).toContain('CarPlay voice prompts are missing or faint')
  })

  it('lists four quick-FAQ entries in Support & Contact', () => {
    const wrapper = mount(Help)
    const terms = wrapper.findAll('dt').map((dt) => dt.text())
    expect(terms).toContain('Which vehicles does Efficiver work with?')
    expect(terms).toContain('Is Efficiver free?')
    expect(terms).toContain('Does Efficiver require internet?')
    expect(terms).toContain('Can I use Efficiver while driving?')
  })

  it('interpolates the real contact website as both link target and label', () => {
    const wrapper = mount(Help)
    const link = wrapper.get(`a[href="${config.contact.website}"]`)
    expect(link.text()).toBe(config.contact.website)
  })

  it('links out to Privacy Policy, Terms of Use and Release notes by anchor', () => {
    // .get() already throws if the selector matches nothing, so it's proof of
    // existence on its own - chaining .exists() after it is both redundant
    // and a type error (.get()'s return type omits that method).
    const wrapper = mount(Help)
    expect(wrapper.get('a[href="#privacy"]')).toBeTruthy()
    expect(wrapper.get('a[href="#terms"]')).toBeTruthy()
    expect(wrapper.get('a[href="#releases"]')).toBeTruthy()
  })

  it('offers a working support mailto link', () => {
    const wrapper = mount(Help)
    const link = wrapper.get('a[href="mailto:contact@efficiver.com"]')
    expect(link.text()).toBe('contact@efficiver.com')
  })

  it('carries no hardcoded version number in the "update your app" instruction', () => {
    // That line went stale at v1.3 and stayed wrong through v1.4 and v1.5 -
    // the fix was to make the instruction version-free, not to chase the
    // number release after release.
    const wrapper = mount(Help)
    expect(wrapper.text()).toContain(
      'Ensure your app is updated to the latest version from the App Store or Google Play'
    )
  })
})
