import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Comparison from './Comparison.vue'
import { Check, X } from 'lucide-vue-next'

describe('Comparison', () => {
  it('states the definitional claim, not a product survey', () => {
    const wrapper = mount(Comparison)
    expect(wrapper.text()).toContain('No OBD Dongle Needed')
    expect(wrapper.text()).toContain('by definition')
  })

  it('lists exactly the two definitional rows, in order', () => {
    const wrapper = mount(Comparison)
    const rows = wrapper.findAll('div.p-4')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('OBD dongle required')
    expect(rows[1].text()).toContain('Works on vehicles with no usable OBD port')
  })

  it('alternates row background by index', () => {
    const wrapper = mount(Comparison)
    const rows = wrapper.findAll('div.p-4')
    expect(rows[0].classes()).toContain('bg-background')
    expect(rows[1].classes()).toContain('bg-muted/30')
  })

  it('marks the OBD-dongle row: X for Efficiver, check for OBD apps', () => {
    const wrapper = mount(Comparison)
    const row = wrapper.findAll('div.p-4')[0]
    expect(row.findComponent(X).exists()).toBe(true)
    expect(row.findComponent(Check).exists()).toBe(true)
  })

  it('marks the no-usable-port row: check for Efficiver, X for OBD apps', () => {
    const wrapper = mount(Comparison)
    const row = wrapper.findAll('div.p-4')[1]
    expect(row.findComponent(Check).exists()).toBe(true)
    expect(row.findComponent(X).exists()).toBe(true)
  })
})
