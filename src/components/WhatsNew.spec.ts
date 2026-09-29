import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, app: { ...actual.config.app } } }
})

import WhatsNew from './WhatsNew.vue'
import { config } from '@/lib/config'
import { CircleStop, Banknote, Users } from 'lucide-vue-next'

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

  // v1.6 WP3 (W11) — the truth sheet in docs/Efficiver_v1.6_Release_Tracker.md, owner-approved
  // 2026-09-29. The v1.5 cards moved to the Releases page.
  it('announces v1.6 in the badge and heading', () => {
    const wrapper = mount(WhatsNew)
    expect(wrapper.text()).toContain('NEW — v1.6')
    expect(wrapper.text()).toContain("What's New in Efficiver 1.6")
  })

  it('renders all three v1.6 flagship cards with distinct icons', () => {
    const wrapper = mount(WhatsNew)
    expect(wrapper.text()).toContain('Every drive tells the truth')
    expect(wrapper.text()).toContain('Savings that stay put')
    expect(wrapper.text()).toContain('Fleet: on duty from start to end')
    expect(wrapper.findComponent(CircleStop).exists()).toBe(true)
    expect(wrapper.findComponent(Banknote).exists()).toBe(true)
    expect(wrapper.findComponent(Users).exists()).toBe(true)
  })

  it('says plainly that per-gallon savings were too high before (D3)', () => {
    expect(mount(WhatsNew).text()).toContain(
      'Savings in per-gallon regions, such as the US, were shown too high before this release; they are now correct.'
    )
  })

  it('states the score change as under one point, with saved scores unchanged (ADR-195)', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain('The effect is under one point, and saved scores are unchanged.')
  })

  it('lists the additional v1.6 improvements inside the disclosure', () => {
    const wrapper = mount(WhatsNew)
    // Native <details> keeps its content in textContent even while collapsed.
    expect(wrapper.text()).toContain('More improvements in v1.6')
    expect(wrapper.text()).toContain('Route maps draw only trusted GPS positions')
    expect(wrapper.text()).toContain('The live idle count now adds up every 30-second idle period')
  })
})
