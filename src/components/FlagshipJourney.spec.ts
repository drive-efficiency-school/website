import { describe, it, expect, vi, afterEach } from 'vitest'
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
  // Testers on older phones could not install: the phone app is arm64-only, so the
  // requirement is a 64-bit version of ANDROID, not just a 64-bit chip (2026-10-17).
  it('states the Android requirement as a 64-bit version of Android', () => {
    const table = mount(Compatibility).get('table').text()
    expect(table).toContain('Android 12 or later, 64-bit version of Android')
  })
  // "#fleet" (Pricing's "Talk to us") is routed by App.vue to FleetPage, which then scrolled
  // to the TOP — the enquiry form sits at the bottom, so the button landed nowhere useful
  // (e2e 24-v2 "Fleet's button scrolls…"). Port of the 1.6 fix (4126b12) to the live site.
  describe('the #fleet enquiry-form alias', () => {
    // jsdom has no scrollIntoView; each test assigns a spy, so put back whatever was there
    // (vi.restoreAllMocks does not undo a direct prototype assignment).
    const originalScrollIntoView = Element.prototype.scrollIntoView
    afterEach(() => {
      window.location.hash = ''
      Element.prototype.scrollIntoView = originalScrollIntoView
    })

    it('scrolls to the enquiry form when opened via #fleet', () => {
      window.location.hash = '#fleet'
      const scroll = vi.fn()
      Element.prototype.scrollIntoView = scroll
      const wrapper = mount(FleetPage, { attachTo: document.body })
      expect(scroll).toHaveBeenCalledTimes(1)
      expect(scroll.mock.contexts[0]).toBe(document.getElementById('fleet'))
      wrapper.unmount()
    })

    it('stays at the page top when opened via #fleet-guide', () => {
      window.location.hash = '#fleet-guide'
      const scroll = vi.fn()
      Element.prototype.scrollIntoView = scroll
      const wrapper = mount(FleetPage, { attachTo: document.body })
      expect(scroll).not.toHaveBeenCalled()
      wrapper.unmount()
    })

    it('does nothing if the form is not in the document', () => {
      window.location.hash = '#fleet'
      const scroll = vi.fn()
      Element.prototype.scrollIntoView = scroll
      shallowMount(FleetPage) // FleetCallout stubbed and not attached: no #fleet element
      expect(scroll).not.toHaveBeenCalled()
    })
  })
  // Wear OS has been live on Play since 2026-09-12 — the watch row must not say Planned.
  it('lists Wear OS as the Android watch companion, not as planned', () => {
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
})
