import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Features from './Features.vue'
import {
  TabletSmartphone,
  BadgeCheck,
  Goal,
  Mic,
  Activity,
  BrainCircuit,
  Fingerprint,
  Map,
  Cloud,
  Accessibility,
  Car,
  Watch,
  BatteryCharging
} from 'lucide-vue-next'

describe('Features', () => {
  it('renders all thirteen feature cards', () => {
    const wrapper = mount(Features)
    // Not a bare 'h3' - the section's own intro paragraph ("Discover the
    // features...") is ALSO an h3, so that selector over-counts by one.
    const titles = wrapper.findAll('.grid h3').map((h) => h.text())
    expect(titles).toHaveLength(13)
    expect(titles).toContain('CarPlay support (iPhone)')
    expect(titles).toContain('Respects Low Power Mode')
  })

  it('resolves every icon key used in featureList to a real icon', () => {
    const wrapper = mount(Features)
    ;[
      TabletSmartphone,
      BadgeCheck,
      Goal,
      Mic,
      Activity,
      BrainCircuit,
      Fingerprint,
      Map,
      Cloud,
      Accessibility,
      Car,
      Watch,
      BatteryCharging
    ].forEach((icon) => expect(wrapper.findComponent(icon).exists()).toBe(true))
  })

  it('labels platform-specific capabilities rather than stating them as universal', () => {
    const wrapper = mount(Features)
    expect(wrapper.text()).toContain('CarPlay support (iPhone)')
    expect(wrapper.text()).toContain('iCloud sync (iPhone)')
    expect(wrapper.text()).toContain('Apple Watch on iPhone, Wear OS on Android')
    expect(wrapper.text()).not.toMatch(/\bAndroid Auto\b/)
    expect(wrapper.text()).not.toMatch(/\bcornering\b/i)
  })

  it('states Low Power Mode as a behaviour, never a battery quantity', () => {
    const wrapper = mount(Features)
    expect(wrapper.text()).toContain('Prioritise Low Power is on by default')
    expect(wrapper.text()).not.toMatch(/\d+%/)
  })

  it('states the safety boundary next to the feature list, mirroring the Terms', () => {
    const wrapper = mount(Features)
    expect(wrapper.text()).toContain(
      'not a navigation, collision-avoidance or safety-critical system'
    )
  })

  it('scopes fuel/CO2 figures as estimates that vary, not a fixed number', () => {
    const wrapper = mount(Features)
    expect(wrapper.text()).toContain('Estimated fuel, cost and CO₂ impact')
    expect(wrapper.text()).toContain('Results vary with')
  })
})
