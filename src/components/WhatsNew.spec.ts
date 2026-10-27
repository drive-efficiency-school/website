import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, app: { ...actual.config.app } } }
})

import WhatsNew from './WhatsNew.vue'
import { config } from '@/lib/config'
import { Gauge, CircleStop, Banknote } from 'lucide-vue-next'

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

  // v1.6.1 (ADR-200, D7): the score leads; the two v1.6 flagships stay; the fleet card moved
  // into the disclosure with its text unchanged. The v1.5 cards live on the Releases page.
  it('announces v1.6.1 in the badge and heading', () => {
    const wrapper = mount(WhatsNew)
    expect(wrapper.text()).toContain('NEW — v1.6.1')
    expect(wrapper.text()).toContain("What's New in Efficiver 1.6.1")
  })

  it('renders the three flagship cards with distinct icons, the score first', () => {
    const wrapper = mount(WhatsNew)
    const titles = wrapper.findAll('h3').map((h) => h.text())
    expect(titles).toContain('A fairer Efficiency Score')
    expect(titles).toContain('Every drive tells the truth')
    expect(titles).toContain('Savings that stay put')
    expect(titles.indexOf('A fairer Efficiency Score')).toBeLessThan(
      titles.indexOf('Every drive tells the truth')
    )
    expect(wrapper.findComponent(Gauge).exists()).toBe(true)
    expect(wrapper.findComponent(CircleStop).exists()).toBe(true)
    expect(wrapper.findComponent(Banknote).exists()).toBe(true)
  })

  it('states the v1.6.1 score in its card (ADR-200)', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain('Your score is now the fuel your driving mistakes waste')
    expect(text).toContain('judged by your car, and the same at every proficiency level')
    expect(text).toContain('Driving on cleanly brings it back up.')
  })

  it('keeps the fleet duty rule, now inside the disclosure', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain('A drive reaches your fleet only if it was on duty from start to end')
    expect(text).toContain('marked Partial')
  })

  it('says plainly that per-gallon savings were too high before (D3)', () => {
    expect(mount(WhatsNew).text()).toContain(
      'Savings in per-gallon regions, such as the US, were shown too high before this release; they are now correct.'
    )
  })

  // D4's "iPhone scores were too generous before 1.6" line is superseded on the home page by
  // the 1.6.1 score (it stays on the Releases page's v1.6 entry, as history). The AC/tyre line
  // stays: ADR-200 R10 keeps both as zero-value inputs.
  it('drops the superseded D4 line and keeps the AC/tyre line', () => {
    const text = mount(WhatsNew).text()
    expect(text).not.toContain('iPhone scores were too generous before 1.6')
    expect(text).toContain('Past drives keep their saved score.')
    expect(text).toContain('That change alone moves a score by under one point.')
    expect(text).not.toContain('saved scores are unchanged')
  })

  // Truth sheet line 7 (owner-approved 2026-10-17).
  it('states the in-car iPhone changes — audio returns, no flicker, no Stop on the card', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain(
      "your music or podcast returns to full volume after Efficiver's last voice prompt"
    )
    expect(text).toContain('the CarPlay start screen no longer flickers')
    expect(text).toContain(
      "it has no Stop button, because Live Activity buttons don't work in CarPlay"
    )
  })

  it('lists the additional v1.6 improvements inside the disclosure', () => {
    const wrapper = mount(WhatsNew)
    // Native <details> keeps its content in textContent even while collapsed.
    expect(wrapper.text()).toContain('More improvements in 1.6 and 1.6.1')
    expect(wrapper.text()).toContain('Route maps draw only trusted GPS positions')
    expect(wrapper.text()).toContain('The live idle count now adds up every 30-second idle period')
    expect(wrapper.text()).toContain(
      'On Android, the screen stays on for the whole drive, and tablets and foldables rotate freely.'
    )
  })
})
