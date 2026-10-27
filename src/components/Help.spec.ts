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

  // v1.6.1 (ADR-200 R8, R9): the hard-brake and hard-acceleration lines follow the car, and
  // the rings and the score read one detector. The N6 sentence (thresholds adapting to speed
  // and gear, acceleration flagged sooner in town) described the retired 2-second check.
  describe('hard-event lines (N6, ADR-200) - follow the car, not speed, gear or level', () => {
    it('states the lines follow the car and the level sets only the rings and voice', () => {
      const text = mount(Help).text()
      expect(text).toContain('what counts as a hard brake or a hard acceleration follows your car')
      expect(text).toContain('never your speed, gear or proficiency level')
      expect(text).toContain('at the lowest level they count exactly the moments the score counts')
      expect(text).toContain('A false jump in GPS speed counts as neither')
    })

    it('no longer says the thresholds adapt to speed and gear', () => {
      const text = mount(Help).text()
      expect(text).not.toContain('adapt to your speed and gear')
      expect(text).not.toContain('flags sharp acceleration a little sooner than sharp braking')
    })

    it('carries no safety-benefit claim alongside it', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).not.toMatch(/\bsafer driving\b/i)
    })
  })

  describe('fuel/CO2 language (N7, N9) - estimated, no fixed percentage', () => {
    it('calls fuel and CO2 figures estimated, not quantified', () => {
      const wrapper = mount(Help)
      expect(wrapper.text()).toContain('Estimated fuel or energy impact')
    })

    it('never states the removed 8-22% fuel-saving figure', () => {
      // Not a blanket "no N-N%" check - "Understanding Your Score" legitimately
      // states a percentage (a score of 97 = mistakes wasted 3% of the fuel),
      // which is not a savings claim. This targets the specific figure N9
      // removed as a product-level guarantee.
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

  // v1.6 WP3 truth sheet (docs/Efficiver_v1.6_Release_Tracker.md), owner-approved 2026-09-29.
  describe('v1.6 truths', () => {
    it('explains Start Reason / Stop Reason and the Interrupted value (W7, ADR-196)', () => {
      const text = mount(Help).text()
      expect(text).toContain('Start Reason / Stop Reason:')
      expect(text).toContain('Interrupted means the app was closed before the drive ended')
      expect(text).toContain('Drives recorded before v1.6 show N/A')
      expect(text).toContain('Interrupted drives are marked in the list')
    })

    it('explains a gap on the Route card as untrusted GPS (W7, ADR-197)', () => {
      expect(mount(Help).text()).toContain(
        "Every dot is a trusted GPS position; a gap between dots means GPS couldn't be trusted there"
      )
    })

    it('says finished drives keep their price and baseline, with the exceptions (W8, ADR-198)', () => {
      const text = mount(Help).text()
      expect(text).toContain(
        'Each finished drive keeps the price and baseline that were set when it ended'
      )
      expect(text).toContain('After a currency change, older drives use today')
      expect(text).toContain('Interrupted drives and drives from before v1.6 use today')
    })

    it('has a troubleshooting entry for an Interrupted drive (W9, ADR-196)', () => {
      const wrapper = mount(Help)
      const terms = wrapper.findAll('dt').map((dt) => dt.text())
      expect(terms).toContain('A drive shows "Interrupted"')
      expect(wrapper.text()).toContain('Efficiver saves a running drive every 10 seconds')
      expect(wrapper.text()).toContain('your next drive starts fresh')
    })

    it('never claims Live Activity Stop saves a force-quit drive (W10, StopDriveIntent.swift:66-93)', () => {
      const text = mount(Help).text()
      expect(text).not.toContain('This works even if the app was force-quit')
      expect(text).toContain('Stop only closes the Live Activity')
    })

    it('lists v1.6 under Recently Shipped, with the plain gallon wording (W11, D3)', () => {
      const text = mount(Help).text()
      // Dated at the prod deploy (October 2026), the same "vX (Month YYYY):" form as v1.5.
      expect(text).toContain('v1.6 (October 2026):')
      expect(text).toContain(
        'savings in per-gallon regions were shown too high and are now correct'
      )
      // History stays: the v1.6 line keeps the D4 iPhone-score wording.
      expect(text).toContain('iPhone scores react properly to mistakes and idling')
      expect(text.indexOf('v1.6 (October 2026):')).toBeLessThan(text.indexOf('v1.5 (July 2026)'))
    })

    // Truth sheet line 7 (owner-approved 2026-10-17; iOS 745fbf9).
    it('has a CarPlay troubleshooting entry for audio that stayed quiet after a prompt', () => {
      const wrapper = mount(Help)
      const terms = wrapper.findAll('dt').map((dt) => dt.text())
      expect(terms).toContain('Music or a podcast stays quiet after a voice prompt')
      expect(wrapper.text()).toContain(
        "your audio returns to full volume once Efficiver's last voice prompt ends"
      )
    })
  })

  // v1.6.1 truth sheet (ADR-200 revision 6; draft approved for step 1, 2026-10-27).
  describe('v1.6.1 truths — the score is the fuel wasted by mistakes', () => {
    it('explains what the score means, with a worked example instead of bands (D6)', () => {
      const text = mount(Help).text()
      expect(text).toContain(
        'a score of 97 means your mistakes wasted fuel equal to 3% of what the drive needed'
      )
      expect(text).not.toContain('80-100%')
      expect(text).not.toContain('Excellent driving')
    })

    it('explains how the score works, replacing the v1.6 iPhone paragraph', () => {
      const text = mount(Help).text()
      expect(text).toContain('How your score works (v1.6.1):')
      expect(text).toContain('goes down only when a mistake wastes fuel')
      expect(text).toContain('driving on cleanly brings it back up')
      expect(text).toContain(
        '70 km/h below 1,000 cc, 80 below 1,400 cc, 90 below 1,800 cc, otherwise 105'
      )
      expect(text).toContain("Hills don't count against you")
      expect(text).toContain(
        'On an electric car, only hard braking and driving above a moderate speed count'
      )
      expect(text).toContain('Past drives keep their saved score, so Trends may show a step')
      expect(text).not.toContain('Scores from v1.6 (iPhone):')
    })

    it('states the score inputs where the page lists features, tips and settings', () => {
      const text = mount(Help).text()
      expect(text).toContain('Live score of the fuel your driving mistakes waste')
      expect(text).toContain('the score also counts driving above a moderate speed')
      expect(text).toContain('Keep to a moderate speed and avoid rapid acceleration')
      expect(text).not.toContain('Maintain steady speeds and avoid rapid acceleration')
      expect(text).toContain('sets how strict the mistake rings and voice are')
      expect(text).toContain('turn on Turbocharged for a turbo petrol car')
    })

    it('answers the accuracy question with the fuel model, keeping the validation caveat', () => {
      const text = mount(Help).text()
      expect(text).toContain('The score estimates the fuel your mistakes waste')
      expect(text).not.toContain('how steadily you hold a speed')
    })

    // The apps' level runs 0-5 (Settings → Driving: "0 = Beginner, 5 = Expert"), never 1-5.
    it('states the proficiency range as the apps do, 0 to 5', () => {
      const text = mount(Help).text()
      expect(text).toContain('Set your proficiency level (0-5) for personalized')
      expect(text).toContain('0-5 scale (0 = Beginner, 5 = Expert)')
      expect(text).not.toContain('1-5')
      expect(text).not.toContain('1=Beginner')
    })

    it('lists v1.6.1 first under Recently Shipped', () => {
      const text = mount(Help).text()
      expect(text).toContain('v1.6.1 (October 2026):')
      expect(text.indexOf('v1.6.1 (October 2026):')).toBeLessThan(
        text.indexOf('v1.6 (October 2026):')
      )
    })
  })

  // Testers on older phones could not install: the phone app is arm64-only (2026-10-17).
  it('explains a Google Play "not compatible" message: 32-bit Android', () => {
    const wrapper = mount(Help)
    const terms = wrapper.findAll('dt').map((dt) => dt.text())
    expect(terms[0]).toBe("Google Play says the app isn't compatible with my phone")
    expect(wrapper.text()).toContain(
      'Efficiver for Android needs Android 12 or later, running a 64-bit version of Android'
    )
    expect(wrapper.text()).toContain(
      'Many older phones run a 32-bit version of Android, even when the chip is 64-bit'
    )
  })

  it('states the Android requirement as a 64-bit version of Android, not a 64-bit device', () => {
    const text = mount(Help).text()
    expect(text).toContain(
      'Android requires Android 12 or later, running a 64-bit version of Android'
    )
    expect(text).not.toContain('on a 64-bit device')
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
