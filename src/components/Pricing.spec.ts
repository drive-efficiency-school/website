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

  it('shows Pro as an in-app purchase once the launch-offer flag is off', () => {
    config.pricing.launchOffer = false
    const wrapper = mount(Pricing)
    const pro = cards(wrapper)[1]
    expect(pro.text()).toContain('In-App Purchase')
    expect(pro.text()).not.toContain('Coming soon')
  })

  it('never sells idle detection or Auto-Start as a Pro-only benefit', () => {
    // Both are free in both apps (DrivingPreferences.enableIdleMonitoring /
    // DrivingDetector) - the previous card's real defect was selling them.
    const wrapper = mount(Pricing)
    const pro = cards(wrapper)[1]
    expect(pro.text()).not.toMatch(/idle detection/i)
    expect(pro.text()).not.toMatch(/auto-start/i)
  })

  it('visually marks exactly the Pro card as the popular choice', () => {
    const wrapper = mount(Pricing)
    const [free, pro, fleet] = cards(wrapper)
    expect(pro.classes().join(' ')).toContain('border-primary')
    expect(free.classes().join(' ')).toContain('opacity-75')
    expect(fleet.classes().join(' ')).toContain('opacity-75')
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

    it("disables Pro's button - it must never claim to be purchasable today", () => {
      // "Get Started" sitting under a "Coming soon" price was the exact
      // contradiction the review flagged. The button now echoes the SAME
      // price-label function the card's price line uses, so the two can
      // never say different things.
      config.pricing.launchOffer = true
      const wrapper = mount(Pricing)
      const pro = cards(wrapper)[1]
      const button = pro.get('button')
      expect(button.text()).toBe('Coming soon')
      expect(button.attributes('disabled')).toBeDefined()
      expect(pro.find('a').exists()).toBe(false)
    })

    it("keeps Pro's button in lockstep with its own price label when the launch flag flips", () => {
      config.pricing.launchOffer = false
      const wrapper = mount(Pricing)
      const pro = cards(wrapper)[1]
      expect(pro.get('button').text()).toBe('In-App Purchase')
    })

    it('sends Fleet to the enquiry form on the same page, not a dead button', () => {
      const wrapper = mount(Pricing)
      const fleet = cards(wrapper)[2]
      const link = fleet.get('a[href="#fleet"]')
      expect(link.text()).toBe('Talk to us')
    })
  })
})
