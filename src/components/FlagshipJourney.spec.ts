import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import DriveStory from './DriveStory.vue'
import EverydayValue from './EverydayValue.vue'
import Compatibility from './Compatibility.vue'
import FleetPage from './FleetPage.vue'

describe('Flagship journey', () => {
  it.each(['light', 'dark'])(
    'switches actual screenshots and explanations in %s mode',
    async (mode) => {
      localStorage.setItem('vueuse-color-scheme', mode)
      const wrapper = mount(DriveStory)
      const steps = wrapper.findAll('button')
      expect(steps).toHaveLength(3)
      for (let index = 0; index < steps.length; index++) {
        await steps[index].trigger('click')
        expect(steps[index].attributes('aria-pressed')).toBe('true')
        expect(wrapper.get('img').attributes('src')).toContain(`screen-${mode}_`)
      }
      expect(wrapper.get('figcaption').text()).toContain('not measured savings')
      await steps[0].trigger('click')
      expect(wrapper.get('figcaption').text()).toContain('not a safety rating')
    }
  )
  it.each(['light', 'dark'])(
    'separates estimates and upcoming Pro insights from core benefits in %s mode',
    (mode) => {
      localStorage.setItem('vueuse-color-scheme', mode)
      const wrapper = mount(EverydayValue)
      expect(wrapper.text()).toContain('planned for Pro')
      expect(wrapper.text()).toContain('not a fuel-meter reading')
    }
  )
  it('provides a platform comparison with clear requirements', () => {
    const wrapper = mount(Compatibility)
    expect(wrapper.get('table').text()).toContain('Android 12')
    expect(wrapper.get('table').text()).toContain('iOS 26')
  })
  it('names the live Wear OS companion, never "Planned" (W13 — live since 2026-09-12)', () => {
    const table = mount(Compatibility).get('table').text()
    expect(table).toContain('Wear OS (Android)')
    expect(table).not.toContain('Planned')
  })
  it('gives fleets an enquiry path and explains the employer duty policy', () => {
    const wrapper = shallowMount(FleetPage)
    expect(wrapper.find('fleet-callout-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('keep members on duty by policy')
    expect(wrapper.get('a').attributes('href')).toBe('#')
  })

  // v1.6 WP3 truth sheet (docs/Efficiver_v1.6_Release_Tracker.md), owner-approved 2026-09-29.
  it('says finished drives keep the price and baseline set when they ended (W1, ADR-198)', () => {
    const text = mount(EverydayValue).text()
    expect(text).toContain(
      'Each finished drive keeps the price and baseline that were set when it ended'
    )
    expect(text).toContain('After a currency change, older drives use today’s price.')
    // The pre-1.6 claim: a price edit re-priced every past drive. No longer true.
    expect(text).not.toContain('A changed price or baseline changes the estimate')
  })
  it('tells managers the on-duty rule, Partial drives and per-leg drives (W6, ADR-199)', () => {
    const text = shallowMount(FleetPage).text()
    expect(text).toContain('Only drives that are on duty from start to end are shared')
    expect(text).toContain('arrives marked Partial')
    expect(text).toContain('“Recording stopped”')
    expect(text).toContain('a short stop starts a new drive')
  })
})
