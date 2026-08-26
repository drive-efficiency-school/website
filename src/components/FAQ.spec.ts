import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FAQ from './FAQ.vue'
import { config } from '@/lib/config'

describe('FAQ', () => {
  it('lists all eleven questions', () => {
    // 10 numbered entries (item-1..item-10) PLUS item-gps, spliced in between
    // item-4 and item-5 in the source array - 11 in total.
    const wrapper = mount(FAQ)
    const triggers = wrapper.findAll('.AccordionRoot button')
    expect(triggers).toHaveLength(11)
    expect(triggers[0].text()).toContain('How does Efficiver detect my engine without hardware?')
    expect(triggers[10].text()).toContain('What happened to Efficient Driver?')
  })

  it("interpolates the support answer with the site's own contact email", async () => {
    const wrapper = mount(FAQ)
    // Radix's AccordionContent is not merely visually hidden while closed - its
    // text is genuinely absent from the DOM, so the item has to be opened
    // before its answer is checkable at all.
    const triggers = wrapper.findAll('.AccordionRoot button')
    const supportTrigger = triggers.find((t) => t.text().includes('How can I get support'))!
    await supportTrigger.trigger('click')
    expect(wrapper.text()).toContain(`Contact us at ${config.contact.email} for assistance`)
  })

  it('offers the same email as a working mailto link below the list', () => {
    const wrapper = mount(FAQ)
    const link = wrapper.get('a[href^="mailto:"]')
    expect(link.attributes('href')).toBe(`mailto:${config.contact.email}`)
    expect(link.text()).toBe(config.contact.email)
  })

  it('expands an answer when its question is clicked', async () => {
    const wrapper = mount(FAQ)
    expect(wrapper.text()).not.toContain('An initial calibration')

    await wrapper.get('.AccordionRoot button').trigger('click')

    expect(wrapper.text()).toContain('An initial calibration')
  })
})
