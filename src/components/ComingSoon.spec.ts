import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComingSoon from './ComingSoon.vue'

describe('ComingSoon', () => {
  it('renders the placeholder heading and message', () => {
    const wrapper = mount(ComingSoon)
    expect(wrapper.get('h2').text()).toBe('Coming Soon...')
    expect(wrapper.text()).toContain('Dashboard')
  })
})
