import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, app: { ...actual.config.app } } }
})

import Hero from './Hero.vue'
import { config } from '@/lib/config'

describe('Hero', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('links the App Store button to the configured iOS URL', () => {
    config.app.ios = 'https://apps.apple.com/test-app'
    const wrapper = mount(Hero)
    expect(wrapper.get('a[href="https://apps.apple.com/test-app"]').text()).toContain(
      'Download on the App Store'
    )
  })

  it('shows the Play Store button only when an Android link is configured', () => {
    config.app.android = 'https://play.google.com/test-app'
    const wrapper = mount(Hero)
    expect(wrapper.text()).toContain('Get it on Google Play')
  })

  it('hides the Play Store button with no Android link', () => {
    config.app.android = ''
    const wrapper = mount(Hero)
    expect(wrapper.text()).not.toContain('Google Play')
  })

  it('names the former brand once, without hiding the current one', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).toContain('Formerly known as Efficient Driver')
    expect(wrapper.text()).toContain('Efficiver')
  })

  it('makes no safety-benefit claim, per D9 - smoother, not safer', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).not.toMatch(/\bsafer\b/i)
    expect(wrapper.text()).toContain('smoother')
  })

  it('shows the light screenshot set when the color mode is light', () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const wrapper = mount(Hero)
    const images = wrapper.findAll('img[src^="screen-"]')
    expect(images).toHaveLength(6)
    expect(images[0].attributes('src')).toBe('screen-light_101.webp')
  })

  it('shows the dark screenshot set when the color mode is dark', () => {
    localStorage.setItem('vueuse-color-scheme', 'dark')
    const wrapper = mount(Hero)
    const images = wrapper.findAll('img[src^="screen-"]')
    expect(images[0].attributes('src')).toBe('screen-dark_001.webp')
  })

  it('gives every screenshot a distinct, descriptive alt text', () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const wrapper = mount(Hero)
    const alts = wrapper.findAll('img[src^="screen-"]').map((img) => img.attributes('alt'))
    expect(alts).toEqual([
      expect.stringContaining('DriveButton interface'),
      expect.stringContaining('calibration screen'),
      expect.stringContaining('trip score card'),
      expect.stringContaining('fuel savings metrics'),
      expect.stringContaining('driving analytics'),
      expect.stringContaining('eco-driving badges')
    ])
  })

  it('renders the share row', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).toContain('Share:')
  })
})
