import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import Navbar from './Navbar.vue'

// radix-vue's Sheet/DropdownMenu render their content via Presence, which
// settles on a macrotask - and via a portal to document.body in this app's
// setup, so both `wrapper` queries and `document.body` queries are used
// (matching the technique already proven out for ExitIntentPopup).
const settle = () => new Promise((resolve) => setTimeout(resolve, 20))

function mountNavbar() {
  return mount(Navbar, { attachTo: document.body })
}

async function openMobileSheet(wrapper: VueWrapper) {
  const menu = document.body.querySelector('svg.cursor-pointer') as HTMLElement
  menu.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await wrapper.vm.$nextTick()
  await settle()
}

async function openFeaturesDropdown(wrapper: VueWrapper) {
  const trigger = Array.from(document.body.querySelectorAll('button')).find((b) =>
    b.textContent?.trim().startsWith('Features')
  )!
  trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await wrapper.vm.$nextTick()
  await settle()
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
  })

  it('carries the light shadow class in light mode, dark in dark mode', () => {
    localStorage.setItem('vueuse-color-scheme', 'light')
    const light = mountNavbar()
    expect(light.get('header').classes()).toContain('shadow-light')
    expect(light.get('header').classes()).not.toContain('shadow-dark')
    light.unmount()

    localStorage.setItem('vueuse-color-scheme', 'dark')
    const dark = mountNavbar()
    expect(dark.get('header').classes()).toContain('shadow-dark')
    expect(dark.get('header').classes()).not.toContain('shadow-light')
  })

  it('emits navigate(main) from the always-visible desktop logo', async () => {
    const wrapper = mountNavbar()
    await wrapper.get('a[href="/#"]').trigger('click')
    expect(wrapper.emitted('navigate')).toEqual([['main']])
  })

  describe('the desktop route buttons (always present, regardless of the mobile sheet)', () => {
    it('routes an item with an explicit nav target to that target', async () => {
      const wrapper = mountNavbar()
      const help = document.body.querySelectorAll('a[href="#help"]')[0] as HTMLElement
      help.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['help'])
    })

    it('falls back to "main" for an item with no nav target', async () => {
      const wrapper = mountNavbar()
      const faq = document.body.querySelectorAll('a[href="#faq"]')[0] as HTMLElement
      faq.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['main'])
    })
  })

  describe('the Features dropdown', () => {
    it('is platform-neutral - Apple and Android technologies named side by side', async () => {
      const wrapper = mountNavbar()
      await openFeaturesDropdown(wrapper)
      expect(document.body.textContent).toContain('Apple Maps on iPhone, Google Maps on Android')
      expect(document.body.textContent).toContain('VoiceOver and TalkBack')
      expect(document.body.textContent).toContain('Apple Watch on iPhone, Wear OS on Android')
    })

    it('sends the reader to the Features section and closes the routing back to main', async () => {
      const wrapper = mountNavbar()
      await openFeaturesDropdown(wrapper)
      const item = Array.from(
        document.body.querySelectorAll('a[href="#features"]')
      )[0] as HTMLElement
      item.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['main'])
    })
  })

  describe('the mobile sheet', () => {
    it('opens when the menu icon is tapped, showing the same routes again', async () => {
      const wrapper = mountNavbar()
      expect(document.body.querySelectorAll('a[href="#help"]')).toHaveLength(1)

      await openMobileSheet(wrapper)
      expect(document.body.querySelectorAll('a[href="#help"]')).toHaveLength(2)
    })

    it('emits navigate(main) from its own copy of the logo and the static Features link', async () => {
      const wrapper = mountNavbar()
      await openMobileSheet(wrapper)

      const logos = document.body.querySelectorAll('a[href="/#"]')
      ;(logos[1] as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['main'])

      const features = document.body.querySelector('a[href="#features"]') as HTMLElement
      features.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['main'])
    })

    it('routes its own copy of an explicit-nav item to that target', async () => {
      const wrapper = mountNavbar()
      await openMobileSheet(wrapper)
      const help = document.body.querySelectorAll('a[href="#help"]')[1] as HTMLElement
      help.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['help'])
    })

    it('falls back to main for its own copy of a no-nav item', async () => {
      const wrapper = mountNavbar()
      await openMobileSheet(wrapper)
      const whatsNew = document.body.querySelectorAll('a[href="#whats-new"]')[1] as HTMLElement
      whatsNew.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['main'])
    })

    it('routes the external Dashboard entry to coming-soon and prevents the default link navigation', async () => {
      const wrapper = mountNavbar()
      await openMobileSheet(wrapper)
      const dashboard = Array.from(document.body.querySelectorAll('a')).find(
        (a) => a.textContent?.trim() === 'Dashboard'
      )!
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      dashboard.dispatchEvent(event)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['coming-soon'])
      expect(event.defaultPrevented).toBe(true)
    })

    it('offers the theme toggle in its footer', async () => {
      const wrapper = mountNavbar()
      await openMobileSheet(wrapper)
      expect(document.body.textContent).toContain('Toggle theme')
    })
  })

  describe('the standalone "coming soon" icon button', () => {
    it('routes to coming-soon and prevents default navigation', async () => {
      const wrapper = mountNavbar()
      const button = document.body.querySelector('a[aria-label="Coming soon..."]') as HTMLElement
      const event = new MouseEvent('click', { bubbles: true, cancelable: true })
      button.dispatchEvent(event)
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('navigate')!.at(-1)).toEqual(['coming-soon'])
      expect(event.defaultPrevented).toBe(true)
    })
  })
})
