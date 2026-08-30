import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Investors from './Investors.vue'

// This page is unreferenced in App.vue's live render (D2 - see the comment at
// App.vue:39-45): an unsourced Series-A page with undated, undefined figures
// is exactly the highest-liability surface on the site. It is kept, not
// deleted, for a future rewrite with dated, defined, labelled numbers - so
// this spec pins CONTENT, not a judgement on whether the numbers are honest.
describe('Investors', () => {
  it('renders all six sections in order', () => {
    const wrapper = mount(Investors)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    expect(headings).toEqual([
      '1. Company Overview',
      '2. Market Opportunity',
      '3. Business Model',
      '4. Financial Highlights',
      '5. Risk Factors',
      '6. Investor Contact'
    ])
  })

  it('offers a working mailto link for investor correspondence', () => {
    const wrapper = mount(Investors)
    const links = wrapper.findAll('a[href^="mailto:"]')
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => expect(link.attributes('href')).toBe('mailto:contact@efficiver.com'))
  })

  it('names the mission statement', () => {
    const wrapper = mount(Investors)
    expect(wrapper.text()).toContain('Save Earth, Wealth, and Health')
  })

  // Consistency sweep after the v3 content review: this page is unreachable
  // from the live site (see the note above), but its outcome/safety language
  // was left over from before that review and would resurface unfixed if
  // this page is ever restored. Matches the "save fuel"/"drive safer" fixes
  // already shipped in Hero, Features, Help and Releases.
  it('makes no outcome-savings or safety-benefit claim in the mission line', () => {
    const wrapper = mount(Investors)
    const text = wrapper.text()
    expect(text).not.toMatch(/save fuel/i)
    expect(text).not.toMatch(/drive safer/i)
    expect(text).toMatch(/smoother, more efficient driving/i)
  })
})
