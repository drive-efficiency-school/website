import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, app: { ...actual.config.app } } }
})

import WhatsNew from './WhatsNew.vue'
import { config } from '@/lib/config'
import { BarChart3, Sparkles, Compass } from 'lucide-vue-next'

describe('WhatsNew', () => {
  it('links the App Store button to the configured iOS URL', () => {
    config.app.ios = 'https://apps.apple.com/test-app'
    const wrapper = mount(WhatsNew)
    const link = wrapper.get('a[href="https://apps.apple.com/test-app"]')
    expect(link.text()).toContain('Download on the App Store')
  })

  it('shows the Play Store button when an Android link is configured', () => {
    config.app.android = 'https://play.google.com/test-app'
    const wrapper = mount(WhatsNew)
    expect(wrapper.get('a[href="https://play.google.com/test-app"]').text()).toContain(
      'Get it on Google Play'
    )
  })

  it('hides the Play Store button entirely with no Android link', () => {
    config.app.android = ''
    const wrapper = mount(WhatsNew)
    expect(wrapper.text()).not.toContain('Google Play')
  })

  it('emits navigate("releases") from its own CTA', async () => {
    const wrapper = mount(WhatsNew)
    const buttons = wrapper.findAll('button')
    const releaseNotes = buttons.find((b) => b.text().includes('Read full release notes'))!
    await releaseNotes.trigger('click')
    expect(wrapper.emitted('navigate')).toEqual([['releases']])
  })

  it('renders all three flagship cards with distinct icons', () => {
    const wrapper = mount(WhatsNew)
    expect(wrapper.text()).toContain('One chart, your whole story')
    expect(wrapper.text()).toContain('AidOps Edge, on your phone')
    expect(wrapper.text()).toContain('Insights that say where they go')
    expect(wrapper.findComponent(BarChart3).exists()).toBe(true)
    expect(wrapper.findComponent(Sparkles).exists()).toBe(true)
    expect(wrapper.findComponent(Compass).exists()).toBe(true)
  })

  it('never claims the on-device model computes the numbers itself', () => {
    // AidOps Edge phrases numbers Efficiver already computed; it does not
    // derive them. And nothing about it leaves the device.
    const wrapper = mount(WhatsNew)
    expect(wrapper.text()).toContain('nothing leaves your device')
    expect(wrapper.text()).toContain('the model only phrases them')
  })

  it('lists the additional v1.5 improvements inside the disclosure', () => {
    const wrapper = mount(WhatsNew)
    // Native <details> keeps its content in textContent even while collapsed.
    expect(wrapper.text()).toContain('Refreshing your forecast keeps the chart on screen')
    expect(wrapper.text()).toContain("Your Patterns tells you when it's being rewritten")
    expect(wrapper.text()).toContain('blocking you')
  })
})
