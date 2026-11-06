import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return {
    config: {
      ...actual.config,
      pricing: { ...actual.config.pricing },
      app: { ...actual.config.app }
    }
  }
})

import Pricing from './Pricing.vue'
import { config } from '@/lib/config'

function cards(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.grid > *')
}

describe('Pricing', () => {
  it('names all three tiers by the naming SOT - never "Basic" or "Full App"', () => {
    const wrapper = mount(Pricing)
    expect(wrapper.text()).toContain('Efficiver Pro')
    expect(wrapper.text()).toContain('Efficiver Fleet')
    expect(wrapper.text()).not.toMatch(/\bBasic\b/)
    expect(wrapper.text()).not.toMatch(/Full App/)
  })

  it('prices Efficiver itself as free, forever', () => {
    const wrapper = mount(Pricing)
    const free = cards(wrapper)[0]
    expect(free.text()).toContain('Free')
    expect(free.text()).toContain('forever')
  })

  it('never shows a per-seat price for Fleet - it bills through RazorPay, not IAP', () => {
    const wrapper = mount(Pricing)
    const fleet = cards(wrapper)[2]
    expect(fleet.text()).toContain('Talk to us')
    expect(fleet.text()).toContain('for teams of any size')
    expect(fleet.text()).not.toMatch(/\$|₹|\/mo|\/month|\/user/)
  })

  it('shows Pro as "Coming soon" while the launch-offer flag is on', () => {
    config.pricing.launchOffer = true
    const wrapper = mount(Pricing)
    const pro = cards(wrapper)[1]
    expect(pro.text()).toContain('Coming soon')
    expect(pro.text()).toContain('pricing being finalised')
  })

  it('shows Pro as an in-app purchase, monthly or annual, once the launch-offer flag is off', () => {
    config.pricing.launchOffer = false
    const wrapper = mount(Pricing)
    const pro = cards(wrapper)[1]
    expect(pro.text()).toContain('In-App Purchase')
    expect(pro.text()).toContain('monthly or annual')
    expect(pro.text()).not.toContain('Coming soon')
    expect(pro.text()).not.toContain('pricing being finalised')
  })

  it('never quotes a Pro price - the stores price 175 storefronts (Brief §10 step 2)', () => {
    for (const launchOffer of [true, false]) {
      config.pricing.launchOffer = launchOffer
      const pro = cards(mount(Pricing))[1]
      expect(pro.text(), `launchOffer=${launchOffer}`).not.toMatch(/[$£€₹¥]\s?\d|\d+[.,]\d{2}/)
    }
  })

  it('says Pro is available now in the intro, not "will add"', () => {
    const wrapper = mount(Pricing)
    const intro = wrapper.get('h3').text()
    expect(intro).toContain('Efficiver is free to use. Efficiver Pro adds deeper insights')
    expect(intro).not.toMatch(/will add|today/)
  })

  it('never sells idle detection or Auto-Start as a Pro-only benefit', () => {
    // Both are free in both apps (DrivingPreferences.enableIdleMonitoring /
    // DrivingDetector) - the previous card's real defect was selling them.
    const wrapper = mount(Pricing)
    const pro = cards(wrapper)[1]
    expect(pro.text()).not.toMatch(/idle detection/i)
    expect(pro.text()).not.toMatch(/auto-start/i)
  })

  it('emphasises the available free app over the upcoming Pro plan', () => {
    const wrapper = mount(Pricing)
    const [free, pro, fleet] = cards(wrapper)
    expect(free.classes().join(' ')).toContain('border-primary')
    expect(pro.classes().join(' ')).not.toContain('border-primary')
    expect(fleet.classes().join(' ')).not.toContain('border-primary')
  })

  describe('what each button actually does', () => {
    it('links Efficiver to the App Store', () => {
      config.app.ios = 'https://apps.apple.com/test-app'
      config.app.android = ''
      const wrapper = mount(Pricing)
      const free = cards(wrapper)[0]
      const link = free.get('a[href="https://apps.apple.com/test-app"]')
      expect(link.text()).toContain('Get Started')
    })

    it('adds a Google Play link for Efficiver once Android is configured', () => {
      config.app.ios = 'https://apps.apple.com/test-app'
      config.app.android = 'https://play.google.com/test-app'
      const wrapper = mount(Pricing)
      const free = cards(wrapper)[0]
      expect(free.get('a[href="https://play.google.com/test-app"]').text()).toContain('Get Started')
    })

    it('omits the Play link for Efficiver with no Android link configured', () => {
      config.app.ios = 'https://apps.apple.com/test-app'
      config.app.android = ''
      const wrapper = mount(Pricing)
      const free = cards(wrapper)[0]
      expect(free.text()).not.toContain('Google Play')
    })

    it("disables Pro's button before billing - it must never claim to be purchasable", () => {
      // "Get Started" sitting under a "Coming soon" price was the exact
      // contradiction the review flagged. Pre-billing, the button echoes the
      // SAME price-label function the card's price line uses, so the two can
      // never say different things.
      config.pricing.launchOffer = true
      config.app.ios = 'https://apps.apple.com/test-app'
      config.app.android = 'https://play.google.com/test-app'
      const wrapper = mount(Pricing)
      const pro = cards(wrapper)[1]
      const button = pro.get('button')
      expect(button.text()).toBe('Coming soon')
      expect(button.attributes('disabled')).toBeDefined()
      expect(pro.find('a').exists()).toBe(false)
    })

    it('links Pro to both stores once billing is live (Brief §10 step 4)', () => {
      // Pro is bought inside the app, so its buttons lead to the download.
      config.pricing.launchOffer = false
      config.app.ios = 'https://apps.apple.com/test-app'
      config.app.android = 'https://play.google.com/test-app'
      const pro = cards(mount(Pricing))[1]
      expect(pro.get('a[href="https://apps.apple.com/test-app"]').text()).toBe(
        'Get Pro — App Store'
      )
      expect(pro.get('a[href="https://play.google.com/test-app"]').text()).toBe(
        'Get Pro — Google Play'
      )
      expect(pro.findAll('a')).toHaveLength(2)
      // No dead "In-App Purchase" button left behind.
      expect(pro.find('button').exists()).toBe(false)
    })

    it("omits Pro's Play link with no Android link configured", () => {
      config.pricing.launchOffer = false
      config.app.ios = 'https://apps.apple.com/test-app'
      config.app.android = ''
      const pro = cards(mount(Pricing))[1]
      expect(pro.findAll('a')).toHaveLength(1)
      expect(pro.text()).not.toContain('Google Play')
    })

    it('sends Fleet to the enquiry form on the same page, not a dead button', () => {
      const wrapper = mount(Pricing)
      const fleet = cards(wrapper)[2]
      const link = fleet.get('a[href="#fleet"]')
      expect(link.text()).toBe('Talk to us')
    })
  })
})
