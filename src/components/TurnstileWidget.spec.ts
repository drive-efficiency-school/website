import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'

const mockConfig = vi.hoisted(() => ({ turnstile: { siteKey: 'test-site-key' } }))
vi.mock('@/lib/config', () => ({ config: mockConfig }))

import TurnstileWidget from './TurnstileWidget.vue'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type Captured = {
  sitekey: string
  callback?: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
}

/** A stand-in for the Cloudflare global, capturing what the component passes it. */
function fakeTurnstile(widgetId = 'widget-1') {
  const captured: { options?: Captured } = {}
  const api = {
    render: vi.fn((_el: HTMLElement | string, options: Captured) => {
      captured.options = options
      return widgetId
    }),
    reset: vi.fn(),
    remove: vi.fn(),
    getResponse: vi.fn()
  }
  return { api, captured }
}

function injectedScript(): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

/**
 * happy-dom tries to REALLY fetch a `<script src>` the instant it connects to
 * the document (see HTMLScriptElement's #loadScript). With file loading
 * disabled (vitest.config.ts), that resolves to an auto-fired 'error' event —
 * SYNCHRONOUSLY, inside appendChild, before this file's `.onload!()` /
 * `.onerror!()` calls ever get a turn. Every test below would "pass" against
 * an already-settled promise regardless of what it actually simulates.
 *
 * The fix is the one browsers themselves use for an unrecognised script type:
 * an unsupported `type` attribute makes the loader no-op on connection. The
 * component never reads or sets `type`, so this is invisible to it, and each
 * test regains full, deterministic control over exactly when load/error fires.
 */
function stubInertScriptTags() {
  const realCreateElement = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation(((
    tagName: string,
    options?: ElementCreationOptions
  ) => {
    const el = realCreateElement(tagName, options)
    if (tagName.toLowerCase() === 'script') {
      el.setAttribute('type', 'text/plain')
    }
    return el
  }) as typeof document.createElement)
}

function exposedReset(wrapper: VueWrapper) {
  return (wrapper.vm as unknown as { reset: () => void }).reset()
}

function tokens(wrapper: VueWrapper): string[] {
  return (wrapper.emitted('update:modelValue') ?? []).map((args) => (args as [string])[0])
}

describe('TurnstileWidget', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    delete window.turnstile
    stubInertScriptTags()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete window.turnstile
  })

  describe('loading the Cloudflare script', () => {
    it('skips loading entirely when the global is already present', async () => {
      const { api } = fakeTurnstile()
      window.turnstile = api

      const wrapper = mount(TurnstileWidget)
      await flush()

      expect(injectedScript()).toBeNull() // nothing appended
      expect(api.render).toHaveBeenCalledTimes(1)
      wrapper.unmount()
    })

    it('injects the script once and renders after it loads', async () => {
      const wrapper = mount(TurnstileWidget)
      await flush()

      const script = injectedScript()
      expect(script).not.toBeNull()
      expect(script!.async).toBe(true)
      expect(script!.defer).toBe(true)

      const { api } = fakeTurnstile()
      window.turnstile = api
      script!.onload!(new Event('load'))
      await flush()

      expect(api.render).toHaveBeenCalledTimes(1)
      wrapper.unmount()
    })

    it('reuses a script another instance already injected', async () => {
      // Two widgets on one page (newsletter + contact) must not append the tag
      // twice; the second waits on the first one's load event.
      const existing = document.createElement('script')
      existing.src = SCRIPT_SRC
      document.head.appendChild(existing)

      const wrapper = mount(TurnstileWidget)
      await flush()

      expect(document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`)).toHaveLength(1)

      const { api } = fakeTurnstile()
      window.turnstile = api
      existing.dispatchEvent(new Event('load'))
      await flush()

      expect(api.render).toHaveBeenCalledTimes(1)
      wrapper.unmount()
    })

    it('stays silent when the script fails - the backend still enforces', async () => {
      const wrapper = mount(TurnstileWidget)
      await flush()

      const script = injectedScript()!
      script.onerror!(new Event('error'))
      await flush()

      // No token, no throw, no widget. An offline or ad-blocked visitor gets a
      // form that submits and is rejected server-side, not a broken page.
      expect(tokens(wrapper)).toEqual([])
      wrapper.unmount()
    })

    it('stays silent when a REUSED script fails', async () => {
      const existing = document.createElement('script')
      existing.src = SCRIPT_SRC
      document.head.appendChild(existing)

      const wrapper = mount(TurnstileWidget)
      await flush()

      existing.dispatchEvent(new Event('error'))
      await flush()

      expect(tokens(wrapper)).toEqual([])
      wrapper.unmount()
    })

    it('does not render if the script loads but never defines the global', async () => {
      const wrapper = mount(TurnstileWidget)
      await flush()

      // Resolve the load WITHOUT setting window.turnstile — a CDN returning a
      // captive-portal page with a 200 does exactly this.
      injectedScript()!.onload!(new Event('load'))
      await flush()

      expect(tokens(wrapper)).toEqual([])
      wrapper.unmount()
    })

    it('does not render into a container that is gone (unmount mid-load)', async () => {
      // The real race the container guard exists for: the reader navigates away
      // while the Cloudflare script is still in flight.
      const wrapper = mount(TurnstileWidget)
      await flush()

      const script = injectedScript()!
      const { api } = fakeTurnstile()
      window.turnstile = api

      wrapper.unmount() // container ref drops to null
      script.onload!(new Event('load'))
      await flush()

      expect(api.render).not.toHaveBeenCalled()
    })
  })

  describe('token lifecycle', () => {
    async function mountRendered() {
      const { api, captured } = fakeTurnstile()
      window.turnstile = api
      const wrapper = mount(TurnstileWidget)
      await flush()
      return { wrapper, api, captured }
    }

    it('passes the configured site key', async () => {
      const { wrapper, captured } = await mountRendered()
      expect(captured.options!.sitekey).toBe('test-site-key')
      wrapper.unmount()
    })

    it('emits the token when the challenge is solved', async () => {
      const { wrapper, captured } = await mountRendered()
      captured.options!.callback!('solved-token')
      expect(tokens(wrapper)).toEqual(['solved-token'])
      wrapper.unmount()
    })

    it('clears the token when the challenge errors', async () => {
      const { wrapper, captured } = await mountRendered()
      captured.options!.callback!('solved-token')
      captured.options!['error-callback']!()
      expect(tokens(wrapper)).toEqual(['solved-token', ''])
      wrapper.unmount()
    })

    it('clears the token when the challenge expires', async () => {
      const { wrapper, captured } = await mountRendered()
      captured.options!.callback!('solved-token')
      captured.options!['expired-callback']!()
      // An expired token must not be left sitting in the parent's v-model, or
      // the next submit sends a token Cloudflare will reject.
      expect(tokens(wrapper)).toEqual(['solved-token', ''])
      wrapper.unmount()
    })
  })

  describe('reset, for single-use tokens', () => {
    it('resets the widget and clears the parent token', async () => {
      const { api } = fakeTurnstile('widget-42')
      window.turnstile = api
      const wrapper = mount(TurnstileWidget)
      await flush()

      exposedReset(wrapper)

      expect(api.reset).toHaveBeenCalledWith('widget-42')
      expect(tokens(wrapper)).toEqual([''])
      wrapper.unmount()
    })

    it('is a no-op when the widget never rendered', async () => {
      // Script blocked: reset must not throw when the parent calls it in its
      // submit `finally`.
      const wrapper = mount(TurnstileWidget)
      await flush()
      injectedScript()!.onerror!(new Event('error'))
      await flush()

      expect(() => exposedReset(wrapper)).not.toThrow()
      expect(tokens(wrapper)).toEqual([])
      wrapper.unmount()
    })

    it('is a no-op when the global disappeared after rendering', async () => {
      const { api } = fakeTurnstile()
      window.turnstile = api
      const wrapper = mount(TurnstileWidget)
      await flush()

      delete window.turnstile
      expect(() => exposedReset(wrapper)).not.toThrow()
      expect(tokens(wrapper)).toEqual([])
      wrapper.unmount()
    })
  })

  describe('teardown', () => {
    it('removes its widget so Cloudflare stops tracking it', async () => {
      const { api } = fakeTurnstile('widget-7')
      window.turnstile = api
      const wrapper = mount(TurnstileWidget)
      await flush()

      wrapper.unmount()
      expect(api.remove).toHaveBeenCalledWith('widget-7')
    })

    it('unmounts cleanly when no widget was ever rendered', async () => {
      const wrapper = mount(TurnstileWidget)
      await flush()
      injectedScript()!.onerror!(new Event('error'))
      await flush()

      expect(() => wrapper.unmount()).not.toThrow()
    })

    it('unmounts cleanly when the global disappeared', async () => {
      const { api } = fakeTurnstile()
      window.turnstile = api
      const wrapper = mount(TurnstileWidget)
      await flush()

      delete window.turnstile
      expect(() => wrapper.unmount()).not.toThrow()
      expect(api.remove).not.toHaveBeenCalled()
    })
  })

  it('keeps the widget left-aligned inside a centred section', () => {
    // text-left is load-bearing: the injected iframe is inline, so an inherited
    // text-center from the newsletter wrapper would centre it away from the
    // field stack.
    const wrapper = mount(TurnstileWidget)
    expect(wrapper.get('div').classes()).toContain('text-left')
    wrapper.unmount()
  })
})
