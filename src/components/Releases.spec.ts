import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, app: { ...actual.config.app } } }
})

import Releases from './Releases.vue'
import { config } from '@/lib/config'

describe('Releases', () => {
  it('lists every version, current one first, each dated', () => {
    const wrapper = mount(Releases)
    const titles = wrapper.findAll('h4, .text-2xl, .text-xl').map((el) => el.text())
    expect(wrapper.text()).toContain('v1.6 — Trustworthy trips and savings')
    expect(wrapper.text()).toContain('v1.5 — Converged Trends, AidOps Edge')
    expect(wrapper.text().indexOf('v1.6 — ')).toBeLessThan(wrapper.text().indexOf('v1.5 — '))
    expect(wrapper.text()).toContain('v1.4 (iPhone)')
    expect(wrapper.text()).toContain('v1.3 (iPhone)')
    expect(wrapper.text()).toContain('v1.2 (iPhone)')
    expect(wrapper.text()).toContain('v1.1 (iPhone)')
    expect(wrapper.text()).toContain('v1.0.1 (iPhone)')
    expect(wrapper.text()).toContain('v1.0 (iPhone) — Initial release')
    expect(titles.length).toBeGreaterThan(0)
  })

  it('badges v1.6 as CURRENT, always expanded (no <details> wrapper)', () => {
    const wrapper = mount(Releases)
    expect(wrapper.text()).toContain('CURRENT — v1.6')
    // v1.6's own card content must not sit inside a <details>: it should be
    // visible without any interaction, unlike every older version.
    const v16 = wrapper
      .findAll('.container > *')
      .find((el) => el.text().includes('Trustworthy trips and savings'))
    expect(v16?.element.tagName).not.toBe('DETAILS')
  })

  it('collapses every older version by default', () => {
    const wrapper = mount(Releases)
    const detailsEls = wrapper.findAll('details')
    expect(detailsEls).toHaveLength(7) // v1.5, v1.4, v1.3, v1.2, v1.1, v1.0.1, v1.0
    detailsEls.forEach((d) => expect(d.attributes('open')).toBeUndefined())
  })

  it('expands a version when its summary is tapped, native <details> behaviour', async () => {
    const wrapper = mount(Releases)
    const first = wrapper.get('details')
    expect(first.attributes('open')).toBeUndefined()

    await first.get('summary').trigger('click')

    expect(first.attributes('open')).toBeDefined()
  })

  describe('claims that must stay accurate', () => {
    it('states the v1.6 truths — interrupted drives, savings history, gallon fix, fleet rule', () => {
      const text = mount(Releases).text()
      expect(text).toContain('marked Interrupted')
      expect(text).toContain('Session Details now shows Start Reason and Stop Reason')
      expect(text).toContain(
        'Each finished drive keeps the fuel price and typical consumption that were set when it ended'
      )
      expect(text).toContain(
        'Savings in per-gallon regions, such as the US, were shown too high before this release; they are now correct.'
      )
      expect(text).toContain('A drive reaches your fleet only if it was on duty from start to end')
      expect(text).toContain('The effect is under one point, and saved scores are unchanged.')
    })

    it('states AidOps Edge computation happens on-device (v1.5)', () => {
      const wrapper = mount(Releases)
      expect(wrapper.text()).toContain('Nothing leaves your device')
      expect(wrapper.text()).toContain('The numbers are always computed by Efficiver')
    })

    it('states Smart Detection runs entirely on-device (v1.1)', () => {
      const wrapper = mount(Releases)
      expect(wrapper.text()).toContain('Everything runs on your iPhone; nothing leaves your device')
    })

    it('marks the Year Recap forecast lever as part of Pro, not shipped free (v1.3)', () => {
      const wrapper = mount(Releases)
      expect(wrapper.text()).toContain('are part of Efficiver Pro — coming soon')
    })

    it('notes that v1.2 and earlier predate the Android app', () => {
      const wrapper = mount(Releases)
      expect(wrapper.text()).toContain('This release predates the Android app')
    })
  })

  describe('store buttons', () => {
    it('links the App Store button to the configured iOS URL', () => {
      config.app.ios = 'https://apps.apple.com/test-app'
      const wrapper = mount(Releases)
      expect(wrapper.get('a[href="https://apps.apple.com/test-app"]').text()).toContain(
        'Download on the App Store'
      )
    })

    it('shows the Play Store button only when an Android link is configured', () => {
      config.app.android = 'https://play.google.com/test-app'
      const wrapper = mount(Releases)
      expect(wrapper.text()).toContain('Get it on Google Play')
    })

    it('hides the Play Store button with no Android link', () => {
      config.app.android = ''
      const wrapper = mount(Releases)
      expect(wrapper.text()).not.toContain('Google Play')
    })
  })
})
