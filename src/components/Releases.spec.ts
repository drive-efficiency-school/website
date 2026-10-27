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
    expect(wrapper.text()).toContain('v1.6.1 — A fairer Efficiency Score')
    expect(wrapper.text()).toContain('v1.6 — Trustworthy trips and savings')
    expect(wrapper.text()).toContain('v1.5 — Converged Trends, AidOps Edge')
    expect(wrapper.text().indexOf('v1.6.1 — ')).toBeLessThan(wrapper.text().indexOf('v1.6 — '))
    expect(wrapper.text().indexOf('v1.6 — ')).toBeLessThan(wrapper.text().indexOf('v1.5 — '))
    expect(wrapper.text()).toContain('v1.4 (iPhone)')
    expect(wrapper.text()).toContain('v1.3 (iPhone)')
    expect(wrapper.text()).toContain('v1.2 (iPhone)')
    expect(wrapper.text()).toContain('v1.1 (iPhone)')
    expect(wrapper.text()).toContain('v1.0.1 (iPhone)')
    expect(wrapper.text()).toContain('v1.0 (iPhone) — Initial release')
    expect(titles.length).toBeGreaterThan(0)
  })

  it('badges v1.6.1 as CURRENT, always expanded (no <details> wrapper)', () => {
    const wrapper = mount(Releases)
    expect(wrapper.text()).toContain('CURRENT — v1.6.1')
    // The current card must not sit inside a <details>: it should be visible
    // without any interaction, unlike every older version.
    const current = wrapper
      .findAll('.container > *')
      .find((el) => el.text().includes('A fairer Efficiency Score'))
    expect(current).toBeDefined()
    expect(current?.element.tagName).not.toBe('DETAILS')
    // v1.6 is history now, collapsed like every older version.
    const v16 = wrapper
      .findAll('.container > *')
      .find((el) => el.text().includes('Trustworthy trips and savings'))
    expect(v16?.element.tagName).toBe('DETAILS')
  })

  it('collapses every older version by default', () => {
    const wrapper = mount(Releases)
    const detailsEls = wrapper.findAll('details')
    expect(detailsEls).toHaveLength(8) // v1.6, v1.5, v1.4, v1.3, v1.2, v1.1, v1.0.1, v1.0
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
    // v1.6.1 truth sheet (ADR-200 revision 6).
    it('states the v1.6.1 score truths — fuel wasted, judged by the car, same at every level', () => {
      const text = mount(Releases).text()
      expect(text).toContain('goes down only when a mistake wastes fuel')
      expect(text).toContain('driving on cleanly brings the score back up')
      expect(text).toContain(
        'On an electric car, only hard braking and driving above a moderate speed count'
      )
      expect(text).toContain('never your speed, gear or proficiency level')
      expect(text).toContain(
        '70 km/h below 1,000 cc, 80 below 1,400 cc, 90 below 1,800 cc, otherwise 105'
      )
      expect(text).toContain('The score is the same at every level')
      expect(text).toContain('A false jump in GPS speed counts as neither a mistake nor waste')
    })

    it('says plainly how 1.6.1 scores compare with 1.6.0, and that saved scores stay (D5)', () => {
      const text = mount(Releases).text()
      expect(text).toContain('In 1.6.0, every mistake took points off for good')
      expect(text).toContain('Most drives with mistakes now score higher')
      expect(text).toContain('Past drives keep their saved score, so Trends may show a step')
    })

    it('lists the Android-only 1.6.1 changes, each labelled Android', () => {
      const text = mount(Releases).text()
      expect(text).toContain('On Android, the screen stays on for the whole drive')
      expect(text).toContain('On Android tablets and foldables, the app rotates freely')
    })

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
    })

    // D4 (owner 2026-10-17): replaces the D2/D3-only "under one point, saved scores unchanged".
    it('says plainly that iPhone scores were too generous before v1.6 (D4)', () => {
      const text = mount(Releases).text()
      expect(text).toContain(
        'iPhone scores were too generous before 1.6: they barely reacted to driving mistakes'
      )
      expect(text).toContain('Past drives keep their saved score.')
      expect(text).toContain('That change alone moves a score by under one point.')
      expect(text).not.toContain('saved scores are unchanged')
    })

    // Truth sheet line 7 (owner-approved 2026-10-17).
    it('states the v1.6 in-car iPhone changes and the card without Stop', () => {
      const text = mount(Releases).text()
      expect(text).toContain(
        'your music or podcast returns to full volume after Efficiver’s last voice prompt'
      )
      expect(text).toContain('the CarPlay start screen no longer flickers')
      expect(text).toContain('because Live Activity buttons don’t work in CarPlay')
    })

    it('keeps the v1.4 history but states the current card behaviour', () => {
      const text = mount(Releases).text()
      expect(text).toContain('the same live score and a Stop button, wherever you glance')
      expect(text).toContain(
        'since v1.6 the card on CarPlay and the Smart Stack shows your driving status and score without a Stop button'
      )
      expect(text).toContain('The Lock Screen card keeps its Stop button.')
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
