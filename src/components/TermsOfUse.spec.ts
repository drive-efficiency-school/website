import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TermsOfUse from './TermsOfUse.vue'
import { config } from '@/lib/config'

describe('TermsOfUse', () => {
  it('shows the content-change date from the shared config', () => {
    const wrapper = mount(TermsOfUse)
    expect(wrapper.text()).toContain(`Last updated: ${config.lastUpdated.terms}`)
  })

  it('renders all ten sections in order', () => {
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
      '10. Contact'
    ])
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

  it('offers a working contact mailto link (§10)', () => {
    const wrapper = mount(TermsOfUse)
    const link = wrapper.get('a[href="mailto:contact@efficiver.com"]')
    expect(link.text()).toBe('contact@efficiver.com')
  })
})
