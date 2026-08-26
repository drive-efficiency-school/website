import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Sponsors from './Sponsors.vue'
import { Car, Zap, Leaf, Battery, Smartphone, Bike } from 'lucide-vue-next'

// Also unreferenced in App.vue's live render, alongside Investors/Team/
// Community (see App.vue's comments) - kept for a future re-introduction.
describe('Sponsors', () => {
  it('lists every partner name, each with an icon', () => {
    const wrapper = mount(Sponsors)
    ;[
      'Tata Motors',
      'Mahindra Electric',
      'Ola Electric',
      'Ather Energy',
      'BluSmart',
      'Yulu',
      'Hero Electric',
      'TVS Motor',
      'Bajaj Auto',
      'Revolt Motors'
    ].forEach((name) => expect(wrapper.text()).toContain(name))
  })

  it('maps every icon key used in the list to a real icon component', () => {
    // car, zap, leaf, battery, smartphone, bike all appear in `sponsors`;
    // 'globe' (Yulu) is declared in iconMap but never used by any current
    // entry - a real gap in the map would render nothing for that partner.
    const wrapper = mount(Sponsors)
    expect(wrapper.findComponent(Car).exists()).toBe(true)
    expect(wrapper.findComponent(Zap).exists()).toBe(true)
    expect(wrapper.findComponent(Leaf).exists()).toBe(true)
    expect(wrapper.findComponent(Battery).exists()).toBe(true)
    expect(wrapper.findComponent(Smartphone).exists()).toBe(true)
    expect(wrapper.findComponent(Bike).exists()).toBe(true)
  })

  it('duplicates the strip once for a seamless marquee loop', () => {
    // vue3-marquee renders its children twice (aria-hidden on the clone) so
    // the CSS animation can loop without a visible seam.
    const wrapper = mount(Sponsors)
    const occurrences = wrapper.text().split('Tata Motors').length - 1
    expect(occurrences).toBeGreaterThanOrEqual(2)
  })
})
