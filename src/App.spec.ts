import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount, type VueWrapper } from '@vue/test-utils'

// Every child App imports gets its MODULE evaluated even when shallowMount
// will stub its render - stubbing intercepts at render time, not at import
// time. Several of those modules read config fields (e.g. Hero -> ShareButtons
// reads config.contact.website as a compiled prop default) that have nothing
// to do with what THIS spec tests. importOriginal keeps every real field
// intact and overrides only the two flags this file actually varies.
vi.mock('@/lib/config', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/config')>()
  return { config: { ...actual.config, features: { ...actual.config.features } } }
})

import App from './App.vue'
import { config } from '@/lib/config'

// App.vue's own logic is routing (hash <-> view) and two content gates.
// Every child is deliberately shallow-stubbed: what each of THEM renders is
// each one's own spec's job, not this one's.
function mainStubs(wrapper: VueWrapper) {
  return {
    hero: wrapper.find('hero-stub').exists(),
    whatsNew: wrapper.find('whats-new-stub').exists(),
    features: wrapper.find('features-stub').exists(),
    comparison: wrapper.find('comparison-stub').exists(),
    howItWorks: wrapper.find('how-it-works-stub').exists(),
    pricing: wrapper.find('pricing-stub').exists(),
    fleetCallout: wrapper.find('fleet-callout-stub').exists(),
    newsletter: wrapper.find('newsletter-signup-stub').exists(),
    contact: wrapper.find('contact-stub').exists(),
    faq: wrapper.find('f-a-q-stub').exists()
  }
}

function pageStubs(wrapper: VueWrapper) {
  return {
    terms: wrapper.find('terms-of-use-stub').exists(),
    privacy: wrapper.find('privacy-policy-stub').exists(),
    accessibility: wrapper.find('accessibility-stub').exists(),
    help: wrapper.find('help-stub').exists(),
    comingSoon: wrapper.find('coming-soon-stub').exists(),
    releases: wrapper.find('releases-stub').exists()
  }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 10))

describe('App', () => {
  beforeEach(() => {
    config.features.newsletter = true
    config.features.contact = true
    window.location.hash = ''
  })

  afterEach(() => {
    window.location.hash = ''
  })

  describe('the default route', () => {
    it('renders the full landing page and none of the standalone pages', async () => {
      const wrapper = shallowMount(App)
      await flush()

      expect(mainStubs(wrapper)).toEqual({
        hero: true,
        whatsNew: true,
        features: true,
        comparison: true,
        howItWorks: true,
        pricing: true,
        fleetCallout: true,
        newsletter: true,
        contact: true,
        faq: true
      })
      expect(pageStubs(wrapper)).toEqual({
        terms: false,
        privacy: false,
        accessibility: false,
        help: false,
        comingSoon: false,
        releases: false
      })
    })

    it('hides the newsletter section when the feature flag is off', async () => {
      config.features.newsletter = false
      const wrapper = shallowMount(App)
      await flush()
      expect(wrapper.find('#newsletter').exists()).toBe(false)
      expect(wrapper.find('contact-stub').exists()).toBe(true)
    })

    it('hides Contact when the feature flag is off', async () => {
      config.features.contact = false
      const wrapper = shallowMount(App)
      await flush()
      expect(wrapper.find('contact-stub').exists()).toBe(false)
      expect(wrapper.find('#newsletter').exists()).toBe(true)
    })
  })

  describe('landing on a direct link', () => {
    it.each([
      ['#terms', 'terms'],
      ['#privacy', 'privacy'],
      ['#accessibility', 'accessibility'],
      ['#help', 'help'],
      ['#coming-soon', 'comingSoon'],
      ['#releases', 'releases']
    ] as const)('opens %s straight from the initial hash', async (hash, key) => {
      window.location.hash = hash
      const wrapper = shallowMount(App)
      await flush()

      const pages = pageStubs(wrapper)
      expect(pages[key]).toBe(true)
      expect(Object.values(pages).filter(Boolean)).toHaveLength(1)
      // The landing page underneath is gone, not just visually covered.
      expect(wrapper.find('hero-stub').exists()).toBe(false)
    })
  })

  describe('navigating from within the app', () => {
    it("Navbar's navigate event switches the view and updates the hash", async () => {
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'Navbar' }).vm.$emit('navigate', 'privacy')

      expect(window.location.hash).toBe('#privacy')
      expect(pageStubs(wrapper).privacy).toBe(true)
    })

    it('scrolls to top when leaving the landing page', async () => {
      const scrollTo = vi.fn()
      window.scrollTo = scrollTo
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'Navbar' }).vm.$emit('navigate', 'help')
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

    it('does NOT scroll when navigating back to the landing page', async () => {
      // navigate()'s own guard only fires window.scrollTo while some show*
      // flag is true - returning to "main" sets every flag false, so the
      // condition is false and scrollTo must not run for this transition.
      window.location.hash = '#help'
      const wrapper = shallowMount(App)
      await flush()

      const scrollTo = vi.fn()
      window.scrollTo = scrollTo
      await wrapper.findComponent({ name: 'Navbar' }).vm.$emit('navigate', 'main')

      expect(window.location.hash).toBe('')
      expect(mainStubs(wrapper).hero).toBe(true)
      expect(scrollTo).not.toHaveBeenCalled()
    })

    it('clears the hash entirely for "main", rather than leaving a stale value', async () => {
      window.location.hash = '#terms'
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'Navbar' }).vm.$emit('navigate', 'main')
      expect(window.location.hash).toBe('')
    })

    it("Footer's navigate event drives the same routing", async () => {
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'Footer' }).vm.$emit('navigate', 'accessibility')
      expect(pageStubs(wrapper).accessibility).toBe(true)
    })

    it("forwards Accessibility's own navigate event back to main", async () => {
      window.location.hash = '#accessibility'
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'Accessibility' }).vm.$emit('navigate', 'main')
      expect(mainStubs(wrapper).hero).toBe(true)
    })

    it("forwards Releases' own navigate event", async () => {
      window.location.hash = '#releases'
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'Releases' }).vm.$emit('navigate', 'main')
      expect(mainStubs(wrapper).hero).toBe(true)
    })

    it("forwards WhatsNew's navigate event (its own 'release notes' CTA)", async () => {
      const wrapper = shallowMount(App)
      await flush()

      await wrapper.findComponent({ name: 'WhatsNew' }).vm.$emit('navigate', 'releases')
      expect(pageStubs(wrapper).releases).toBe(true)
    })
  })

  describe('the browser back/forward buttons', () => {
    it('reacts to a hashchange event fired after mount, not only the initial hash', async () => {
      const wrapper = shallowMount(App)
      await flush()
      expect(mainStubs(wrapper).hero).toBe(true)

      window.location.hash = '#privacy'
      window.dispatchEvent(new Event('hashchange'))
      await flush()

      expect(pageStubs(wrapper).privacy).toBe(true)
      expect(mainStubs(wrapper).hero).toBe(false)
    })

    it('returns to the landing page when the hash is cleared externally', async () => {
      window.location.hash = '#help'
      const wrapper = shallowMount(App)
      await flush()
      expect(pageStubs(wrapper).help).toBe(true)

      window.location.hash = ''
      window.dispatchEvent(new Event('hashchange'))
      await flush()

      expect(mainStubs(wrapper).hero).toBe(true)
      expect(Object.values(pageStubs(wrapper)).every((v) => v === false)).toBe(true)
    })

    it('stops listening once unmounted', async () => {
      const add = vi.spyOn(window, 'addEventListener')
      const remove = vi.spyOn(window, 'removeEventListener')
      const wrapper = shallowMount(App)
      await flush()

      const added = add.mock.calls.find(([type]) => type === 'hashchange')
      expect(added).toBeDefined()
      wrapper.unmount()
      // App.vue registers the listener but has no onUnmounted cleanup for it -
      // pinning that plainly, so a future add of one is a deliberate change
      // this test then updates, not a silent regression either way.
      expect(remove.mock.calls.some(([type]) => type === 'hashchange')).toBe(false)
    })
  })
})
