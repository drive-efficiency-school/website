import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, features: { ...actual.config.features } } }
})

import Accessibility from './Accessibility.vue'
import { config } from '@/lib/config'

describe('Accessibility', () => {
  it('shows the content-change date from the shared config', () => {
    const wrapper = mount(Accessibility)
    expect(wrapper.text()).toContain(`Last updated: ${config.lastUpdated.accessibility}`)
  })

  it('never claims full VoiceOver coverage next to its own limitations list', () => {
    // The whole page exists because "full support across every screen" was
    // published beside a Known-limitations list (N11). Pin both halves.
    const wrapper = mount(Accessibility)
    expect(wrapper.text()).not.toMatch(/full (support|coverage)/i)
    expect(wrapper.text()).toContain('Known limitations')
    expect(wrapper.text()).toContain('does not bold')
    expect(wrapper.text()).toContain('not yet on Android')
    expect(wrapper.text()).toContain('no equivalent full app-control mode')
  })

  it('lists iPhone and Android support separately, without cross-claiming', () => {
    const wrapper = mount(Accessibility)
    expect(wrapper.text()).toContain('VoiceOver')
    expect(wrapper.text()).toContain('TalkBack')
    // Voice Control is iPhone-only per the Known-limitations section - it must
    // not also appear in the Android list as something supported.
    const androidSection = wrapper.findAll('section')[2]
    expect(androidSection.text()).not.toContain('Voice Control')
  })

  it('offers the support email as a working mailto link', () => {
    const wrapper = mount(Accessibility)
    const link = wrapper.get('a[href^="mailto:"]')
    expect(link.attributes('href')).toBe(`mailto:${config.contact.email}`)
  })

  describe('the Contact-form pointer', () => {
    it('offers the in-app Contact form and forwards a navigate event when enabled', async () => {
      config.features.contact = true
      const wrapper = mount(Accessibility)
      expect(wrapper.text()).toContain('Accessibility Feedback')

      await wrapper.get('a[href="#contact"]').trigger('click')
      expect(wrapper.emitted('navigate')).toEqual([['main']])
    })

    it('omits the Contact-form pointer entirely when the feature is off', () => {
      config.features.contact = false
      const wrapper = mount(Accessibility)
      expect(wrapper.text()).not.toContain('Accessibility Feedback')
      expect(wrapper.find('a[href="#contact"]').exists()).toBe(false)
      // The surrounding sentence still reads correctly without the clause.
      expect(wrapper.text()).toContain('we read every report')
    })
  })
})
