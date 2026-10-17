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

  // Beside the Play button, where people decide: the phone app is arm64-only (2026-10-17).
  it('states the Android requirement next to the Play button', () => {
    config.app.android = 'https://play.google.com/test-app'
    expect(mount(Hero).text()).toContain('Android: needs Android 12 or later, 64-bit.')
  })

  it('drops the Android requirement line when there is no Play button', () => {
    config.app.android = ''
    expect(mount(Hero).text()).not.toContain('Android: needs Android 12 or later')
  })

  it('leads with a clear flagship benefit and one main heading', () => {
    const wrapper = mount(Hero)
    expect(wrapper.get('h1').text()).toContain('Understand your driving.')
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
    expect(images).toHaveLength(1)
    expect(images[0].attributes('src')).toBe('screen-light_104.webp')
  })

  it('shows the dark screenshot set when the color mode is dark', () => {
    localStorage.setItem('vueuse-color-scheme', 'dark')
    const wrapper = mount(Hero)
    const images = wrapper.findAll('img[src^="screen-"]')
    expect(images[0].attributes('src')).toBe('screen-dark_004.webp')
  })

  it('gives every screenshot a distinct, descriptive alt text', () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const wrapper = mount(Hero)
    const alts = wrapper.findAll('img[src^="screen-"]').map((img) => img.attributes('alt'))
    expect(alts).toEqual([expect.stringContaining('trip review')])
  })

  it('keeps the first impression focused on installation', () => {
    const wrapper = mount(Hero)
    expect(wrapper.text()).not.toContain('Share:')
  })
})
