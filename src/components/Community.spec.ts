import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Community from './Community.vue'

describe('Community', () => {
  it('renders the invitation and a disabled follow button', () => {
    const wrapper = mount(Community)
    expect(wrapper.text()).toContain('Join the Efficiver')
    expect(wrapper.text()).toContain('Community!')
    const button = wrapper.get('button')
    expect(button.text()).toContain('Follow Us on Social Media')
    // Disabled, not linked: there is no live social presence to send a click to.
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('renders the Discord mark via the dynamic :is binding', () => {
    const wrapper = mount(Community)
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
