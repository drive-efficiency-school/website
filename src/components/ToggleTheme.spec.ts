import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleTheme from './ToggleTheme.vue'

/**
 * useColorMode persists to localStorage and stamps the root element, so each
 * test starts from a clean store - otherwise the previous test's choice decides
 * the next one's starting icon.
 */
describe('ToggleTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('offers a screen-reader name for the control', () => {
    const wrapper = mount(ToggleTheme)
    expect(wrapper.find('.sr-only').text()).toBe('Toggle theme')
    wrapper.unmount()
  })

  it('shows the moon (go dark) while the stored mode is light', () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const wrapper = mount(ToggleTheme)
    expect(wrapper.text()).toContain('Dark')
    expect(wrapper.text()).not.toContain('Light')
    wrapper.unmount()
  })

  it('shows the sun (go light) while the stored mode is dark', () => {
    localStorage.setItem('vueuse-color-scheme', 'dark')
    const wrapper = mount(ToggleTheme)
    expect(wrapper.text()).toContain('Light')
    expect(wrapper.text()).not.toContain('Dark')
    wrapper.unmount()
  })

  it('switches light -> dark on click', async () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const wrapper = mount(ToggleTheme)
    await wrapper.find('button').trigger('click')
    expect(localStorage.getItem('vueuse-color-scheme')).toBe('dark')
    wrapper.unmount()
  })

  it('switches dark -> light on click', async () => {
    localStorage.setItem('vueuse-color-scheme', 'dark')
    const wrapper = mount(ToggleTheme)
    await wrapper.find('button').trigger('click')
    expect(localStorage.getItem('vueuse-color-scheme')).toBe('light')
    wrapper.unmount()
  })

  it('updates its own icon after toggling, not just the store', async () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const wrapper = mount(ToggleTheme)
    expect(wrapper.text()).toContain('Dark')
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Light')
    wrapper.unmount()
  })

  it('sends a first-time visitor to dark, because the ternary only tests for dark', async () => {
    // No stored preference: useColorMode reports "auto". `mode === 'dark'` is
    // false for "auto", so the FIRST click always lands on dark regardless of
    // what the system is actually set to. Pinning the real behaviour.
    const wrapper = mount(ToggleTheme)
    await wrapper.find('button').trigger('click')
    expect(localStorage.getItem('vueuse-color-scheme')).toBe('dark')
    wrapper.unmount()
  })
})
