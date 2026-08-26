import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return {
    config: {
      ...actual.config,
      contact: { ...actual.config.contact },
      app: { ...actual.config.app },
      features: { ...actual.config.features },
      socials: { ...actual.config.socials }
    }
  }
})

import Footer from './Footer.vue'
import { config } from '@/lib/config'

function linkTexts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('a').map((a) => a.text())
}

describe('Footer', () => {
  beforeEach(() => {
    config.contact.phone = ''
    config.app.android = ''
    config.features.contact = true
    config.features.newsletter = true
    config.socials.instagram = ''
    config.socials.tiktok = ''
    config.socials.linkedin = ''
  })

  it('shows the current copyright range ending at the real current year', () => {
    const wrapper = mount(Footer)
    const year = new Date().getFullYear()
    expect(wrapper.text()).toContain(`© 2015–${year}`)
  })

  describe('conditional links', () => {
    it('hides the phone link when no phone is configured', () => {
      const wrapper = mount(Footer)
      expect(linkTexts(wrapper).some((t) => t.includes('Phone'))).toBe(false)
    })

    it('shows the phone link once a number is configured', () => {
      config.contact.phone = '+1-555-0100'
      const wrapper = mount(Footer)
      const phone = wrapper.findAll('a').find((a) => a.text().includes('Phone'))!
      expect(phone.attributes('href')).toBe('tel:+1-555-0100')
    })

    it('marks Android "(soon)" and not clickable with no Play link', () => {
      const wrapper = mount(Footer)
      expect(wrapper.text()).toContain('Android')
      expect(wrapper.text()).toContain('(soon)')
      expect(linkTexts(wrapper).some((t) => t.includes('Android'))).toBe(false)
    })

    it('links straight to Play once an Android link is configured', () => {
      config.app.android = 'https://play.google.com/test'
      const wrapper = mount(Footer)
      const android = wrapper.findAll('a').find((a) => a.text().trim() === 'Android')!
      expect(android.attributes('href')).toBe('https://play.google.com/test')
      expect(wrapper.text()).not.toContain('(soon)')
    })

    it('hides Contact Us and Feedback together when the contact feature is off', () => {
      config.features.contact = false
      const wrapper = mount(Footer)
      const texts = linkTexts(wrapper)
      expect(texts.some((t) => t.includes('Contact Us'))).toBe(false)
      expect(texts.some((t) => t.includes('Feedback'))).toBe(false)
      // FAQ has no such gate.
      expect(texts.some((t) => t.includes('FAQ'))).toBe(true)
    })

    it('shows Contact Us and Feedback together when the contact feature is on', () => {
      config.features.contact = true
      const wrapper = mount(Footer)
      const texts = linkTexts(wrapper)
      expect(texts.some((t) => t.includes('Contact Us'))).toBe(true)
      expect(texts.some((t) => t.includes('Feedback'))).toBe(true)
    })

    it('hides the Newsletter link when that feature is off', () => {
      config.features.newsletter = false
      const wrapper = mount(Footer)
      expect(linkTexts(wrapper).some((t) => t.includes('Newsletter'))).toBe(false)
    })

    it.each([
      ['instagram', 'Instagram'],
      ['tiktok', 'TikTok'],
      ['linkedin', 'LinkedIn']
    ] as const)('shows %s only once a handle is configured', async (key, label) => {
      const wrapper = mount(Footer)
      expect(linkTexts(wrapper).some((t) => t.includes(label))).toBe(false)

      config.socials[key] = `https://${key}.example/efficiver`
      const wrapper2 = mount(Footer)
      const link = wrapper2.findAll('a').find((a) => a.text().includes(label))!
      expect(link.attributes('href')).toBe(`https://${key}.example/efficiver`)
    })
  })

  describe('navigation events', () => {
    it('emits main when the logo is clicked', async () => {
      const wrapper = mount(Footer)
      await wrapper.get('a[href="/#"]').trigger('click')
      expect(wrapper.emitted('navigate')).toEqual([['main']])
    })

    it('routes each legal/help link to its own distinct target', async () => {
      const wrapper = mount(Footer)
      const targets: Record<string, string> = {
        '#terms': 'terms',
        '#privacy': 'privacy',
        '#accessibility': 'accessibility',
        '#help': 'help'
      }
      for (const [href, target] of Object.entries(targets)) {
        const link = wrapper.get(`a[href="${href}"]`)
        await link.trigger('click')
        expect(wrapper.emitted('navigate')!.at(-1)).toEqual([target])
      }
    })

    it('sends the static platform links (iOS, CarPlay, Apple Watch, Wear OS) back to main', async () => {
      const wrapper = mount(Footer)
      const staticLabels = ['iOS', 'CarPlay', 'Apple Watch', 'Wear OS']
      for (const label of staticLabels) {
        const link = wrapper.findAll('a').find((a) => a.text().trim() === label)!
        await link.trigger('click')
        expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['main'])
      }
    })
  })

  describe('copying the build version', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('copies the version string and shows a confirmation that reverts after 2s', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      const wrapper = mount(Footer)
      const button = wrapper.get('button')
      const original = button.text()

      await button.trigger('click')
      expect(writeText).toHaveBeenCalledWith(original)
      expect(wrapper.get('button').text()).toBe('Copied!')
      expect(wrapper.get('button').attributes('title')).toBe('Copied!')

      await vi.advanceTimersByTimeAsync(2000)
      expect(wrapper.get('button').text()).toBe(original)
      expect(wrapper.get('button').attributes('title')).toBe('Click to copy version')
    })
  })
})
