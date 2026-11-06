import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TermsOfUse from './TermsOfUse.vue'
import { config } from '@/lib/config'

describe('TermsOfUse', () => {
  it('shows the content-change date from the shared config', () => {
    const wrapper = mount(TermsOfUse)
    expect(wrapper.text()).toContain(`Last updated: ${config.lastUpdated.terms}`)
  })

  it('renders all eleven sections in order', () => {
    // Subscriptions went in as §10, before Contact, so Driving Safety stays §3 —
    // Help links to "Terms of Use §3".
    const wrapper = mount(TermsOfUse)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    expect(headings).toEqual([
      '1. Acceptance of Terms',
      '2. License to Use',
      '3. Driving Safety & User Responsibility',
      '4. Disclaimer of Warranties',
      '5. Limitation of Liability',
      '6. Privacy',
      '7. Changes to Terms',
      '8. Termination',
      '9. Governing Law',
      '10. Efficiver Pro Subscriptions',
      '11. Contact'
    ])
  })

  describe('Efficiver Pro subscription terms (§10, App Review)', () => {
    function section10(wrapper: ReturnType<typeof mount>): string {
      const sections = wrapper.findAll('section')
      const pro = sections.find((s) => s.get('h2').text() === '10. Efficiver Pro Subscriptions')
      return pro!.text()
    }

    it('points the free licence (§2) at the paid option in §10', () => {
      const wrapper = mount(TermsOfUse)
      const licence = wrapper.findAll('section')[1].text()
      expect(licence).toContain('Personal use is free.')
      expect(licence).toContain('Efficiver Pro is an optional paid subscription; see section 10.')
    })

    it('has its eight parts in order', () => {
      const text = section10(mount(TermsOfUse))
      const parts = [
        '10.1 What Pro is.',
        '10.2 Fees and payment.',
        '10.3 Automatic renewal.',
        '10.4 Cancellation.',
        '10.5 Refunds.',
        '10.6 Price changes.',
        '10.7 Your devices.',
        '10.8 Your rights.'
      ]
      const positions = parts.map((p) => text.indexOf(p))
      expect(positions.every((p) => p >= 0)).toBe(true)
      expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    })

    it('lists exactly what both apps sell as Pro, and what stays free', () => {
      // The five ProStoreCopy features (iOS ProStoreCopy.swift, Android ProStore.kt) and
      // Android's FREE_NOTE — the Terms must not promise more or less than the paywall.
      const text = section10(mount(TermsOfUse))
      expect(text).toContain(
        'score forecasts, driving patterns, idle-time insights, an annual savings projection and your full Year in Driving'
      )
      expect(text).toContain('Drives, scores and voice coaching stay free without Pro.')
    })

    it('states the auto-renewal and when each store charges', () => {
      const text = section10(mount(TermsOfUse))
      expect(text).toContain('renews automatically at the end of each monthly or annual period')
      expect(text).toContain('until you cancel')
      expect(text).toContain('Apple charges no more than 24 hours before the next period starts.')
      expect(text).toContain('up to 48 hours before, or up to 5 days in India and Brazil')
    })

    it('gives a cancel path for each store and in the App', () => {
      const items = mount(TermsOfUse)
        .findAll('section')
        .find((s) => s.get('h2').text().startsWith('10.'))!
        .findAll('li')
        .map((li) => li.text())
      expect(items).toEqual([
        'iPhone or iPad: Settings → your name → Subscriptions → Efficiver Pro → Cancel Subscription.',
        'Android: Google Play → Payments & subscriptions → Subscriptions → Efficiver Pro → Cancel subscription.',
        'In the App: Settings → Efficiver Pro → Manage Subscription.'
      ])
    })

    it('says deleting the App does not cancel, and access lasts to the paid period end', () => {
      const text = section10(mount(TermsOfUse))
      expect(text).toContain('Deleting the App does not cancel your subscription.')
      expect(text).toContain('Pro stays on until the end of the period you have already paid for')
    })

    it('leaves refunds to the stores, with the law as the only exception', () => {
      const text = section10(mount(TermsOfUse))
      expect(text).toContain('handled by Apple under Apple')
      expect(text).toContain("handled under Google Play's policies")
      expect(text).toContain(
        'Except where the law requires otherwise, Efficiver does not give refunds or credits for a partly used period.'
      )
    })

    it('applies a new price only after notice, and ends the plan if not agreed', () => {
      const text = section10(mount(TermsOfUse))
      expect(text).toContain('only after Apple or Google has told you about it')
      expect(text).toContain(
        'If you do not agree, your subscription ends when the current period ends.'
      )
    })

    it('warns that Pro does not cross stores — there is no Efficiver account', () => {
      const text = section10(mount(TermsOfUse))
      expect(text).toContain('works only in the iPhone and iPad App')
      expect(text).toContain('works only in the Android App')
      expect(text).toContain('use Restore Purchases')
    })

    it('keeps consumer-law rights intact', () => {
      expect(section10(mount(TermsOfUse))).toContain(
        'Nothing in this section limits any rights you have under the consumer laws of your country.'
      )
    })

    it('offers no free trial and quotes no price — trials are not planned, prices come from the store', () => {
      const text = section10(mount(TermsOfUse))
      expect(text).not.toMatch(/free trial/i)
      expect(text).not.toMatch(/\d+-day/i)
      expect(text).not.toMatch(/[$£€₹]\s?\d/)
    })
  })

  it('states plainly that Efficiver is not a safety-critical system (§3)', () => {
    const wrapper = mount(TermsOfUse)
    expect(wrapper.text()).toContain('It is NOT a navigation')
    expect(wrapper.text()).toContain('You remain fully responsible for safe operation')
    expect(wrapper.text()).toContain('Do not manually operate the App while driving')
  })

  it('scopes commercial use through Efficiver Fleet, linking to the Privacy Policy (§2)', () => {
    const wrapper = mount(TermsOfUse)
    const privacyLinks = wrapper.findAll('a[href="#privacy"]')
    expect(privacyLinks.length).toBeGreaterThanOrEqual(2) // §2 and §6
    expect(wrapper.text()).toContain('Efficiver Fleet')
  })

  it('names India as the governing law, not a placeholder jurisdiction (§9)', () => {
    const wrapper = mount(TermsOfUse)
    expect(wrapper.text()).toContain('laws of the Republic of India')
  })

  it('offers a working contact mailto link (§11)', () => {
    const wrapper = mount(TermsOfUse)
    const link = wrapper.get('a[href="mailto:contact@efficiver.com"]')
    expect(link.text()).toBe('contact@efficiver.com')
  })
})
