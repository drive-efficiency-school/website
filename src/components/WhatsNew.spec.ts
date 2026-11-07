import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, app: { ...actual.config.app } } }
})

import WhatsNew from './WhatsNew.vue'
import { config } from '@/lib/config'
import { Crown, Settings, Users } from 'lucide-vue-next'

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

  // v1.7 (truth sheet T1–T8, owner-approved 2026-11-07). The 1.6 and 1.6.1 content moved to
  // the Releases page, where Releases.spec pins every one of its claims.
  it('announces v1.7 in the badge and heading, and no older version', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain('NEW — v1.7')
    expect(text).toContain("What's New in Efficiver 1.7")
    expect(text).not.toMatch(/1\.6/)
  })

  it('renders the three v1.7 cards with distinct icons, Pro first', () => {
    const wrapper = mount(WhatsNew)
    const titles = wrapper.findAll('h3').map((h) => h.text())
    const cards = [
      'Efficiver Pro (optional)',
      'Efficiver Pro in Settings',
      'Joining a fleet, made clear'
    ]
    for (const title of cards) expect(titles).toContain(title)
    const positions = cards.map((t) => titles.indexOf(t))
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    expect(wrapper.findComponent(Crown).exists()).toBe(true)
    expect(wrapper.findComponent(Settings).exists()).toBe(true)
    expect(wrapper.findComponent(Users).exists()).toBe(true)
  })

  it('states Pro as optional, its five features, and what stays free (T1, T4)', () => {
    expect(mount(WhatsNew).text()).toContain(
      'Optional Efficiver Pro adds score forecasts, driving patterns, idle-time insights, an annual savings projection and your full Year in Driving. Choose a monthly or annual subscription in the app. Drives, scores and voice coaching stay free.'
    )
  })

  it('names what Settings → Efficiver Pro offers on both platforms (T2, T3)', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain(
      'Settings → Efficiver Pro shows your subscription and lets you manage it, request a refund or restore your purchases.'
    )
    expect(text).toContain('If a renewal payment fails, it tells you there too.')
    // A renewal date is iPhone-only (Play's client gives none) — never claimed here.
    expect(text).not.toMatch(/when it renews/)
  })

  it('states the fleet start-to-end rule and Partial, as in the consent (T5)', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain('Only drives on duty from start to end are shared with your fleet.')
    expect(text).toContain('Change duty part-way and that drive stays on your phone.')
    expect(text).toContain('marked Partial')
  })

  // 1.7.0 free-first sweep (plan item H, owner-approved 2026-11-07).
  it('states what is free first, then Pro as optional and in the app', () => {
    const text = mount(WhatsNew).text()
    expect(text).toContain(
      'Availability: drives, scores, voice coaching and fuel, cost and CO₂ estimates are free. Optional Efficiver Pro adds forecasts, patterns and savings projections in the app.'
    )
    expect(text).not.toMatch(/coming soon|planned for Efficiver Pro|future Pro features/i)
  })

  it('lists the v1.7 improvements inside the disclosure, the Android ones labelled (T6–T8)', () => {
    const wrapper = mount(WhatsNew)
    // Native <details> keeps its content in textContent even while collapsed.
    const items = wrapper.findAll('details li').map((li) => li.text())
    expect(wrapper.text()).toContain('More improvements in 1.7')
    expect(items).toEqual([
      'Changes you make in Settings → Savings → Trends now apply when you go back to Trends, with no Refresh needed.',
      'On Android, Minimum drive distance now applies to Trends and the savings projection.',
      'On Android, Trends settings are now part of Efficiver Pro, as on iPhone.'
    ])
  })
})
