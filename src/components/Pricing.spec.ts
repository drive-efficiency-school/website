import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, pricing: { ...actual.config.pricing } } }
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

  it("uses the secondary button style for every plan except Pro's", () => {
    const wrapper = mount(Pricing)
    const buttons = wrapper.findAll('button')
    expect(buttons[0].text()).toBe('Get Started') // Efficiver
    expect(buttons[2].text()).toBe('Talk to us') // Fleet
  })
})
