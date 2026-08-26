import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import type { SubscribeResult } from '@/lib/api'

const mockSubscribe = vi.hoisted(() => vi.fn())
vi.mock('@/lib/api', () => ({ apiService: { subscribeToNewsletter: mockSubscribe } }))

import NewsletterSignup from './NewsletterSignup.vue'

// TurnstileWidget's own behaviour (script injection, token lifecycle) is
// covered in its own spec. Here it is stubbed so this component's tests
// exercise only NewsletterSignup's logic - but the stub still exposes a real
// `reset` method, since handleSubmit's `finally` calls it unconditionally.
const turnstileReset = vi.fn()
const TurnstileWidgetStub = defineComponent({
  name: 'TurnstileWidget',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(_props, { expose }) {
    expose({ reset: turnstileReset })
    return () => h('div', { 'data-testid': 'turnstile-stub' })
  }
})

function mountForm() {
  return mount(NewsletterSignup, {
    global: { stubs: { TurnstileWidget: TurnstileWidgetStub } }
  })
}

function fakeResult(overrides: Partial<SubscribeResult> = {}): SubscribeResult {
  return {
    subscriber: {
      id: 'sub-1',
      email: 'reader@example.test',
      isActive: true,
      subscriptionDate: '2026-08-26',
      source: 'https://www.efficiver.com'
    },
    isNew: true,
    message: 'Thanks for subscribing!',
    ...overrides
  }
}

async function fillEmail(wrapper: ReturnType<typeof mount>, email: string) {
  await wrapper.get('#newsletter-email').setValue(email)
}

async function submit(wrapper: ReturnType<typeof mount>) {
  await wrapper.get('form').trigger('submit')
}

// A single $nextTick after resolving a deferred mock is not enough hops to
// drain handleSubmit's `finally` block AND the reactivity flush it triggers -
// a macrotask guarantees the whole microtask queue, however many hops deep,
// has settled first.
const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NewsletterSignup', () => {
  beforeEach(() => {
    mockSubscribe.mockReset()
    turnstileReset.mockClear()
  })

  describe('what it renders', () => {
    it('offers an interest toggle for every configured preference', () => {
      const wrapper = mountForm()
      const labels = wrapper.findAll('button[type="button"]').map((b) => b.text())
      expect(labels).toEqual([
        'Technology Updates',
        'Business Insights',
        'Sustainability',
        'Product News'
      ])
    })

    it('hides the honeypot from a real user while keeping it in the form', () => {
      const wrapper = mountForm()
      // Not `[aria-hidden="true"]` - the Mail header icon carries the same
      // attribute, so that selector also matches decorative SVG.
      const wrap = wrapper.get('div.hidden')
      expect(wrap.attributes('aria-hidden')).toBe('true')
      const honeypot = wrapper.get('#newsletter-website')
      expect(honeypot.attributes('tabindex')).toBe('-1')
      expect(honeypot.attributes('autocomplete')).toBe('off')
    })

    it('shows no status alert before any submit', () => {
      const wrapper = mountForm()
      expect(wrapper.text()).not.toContain('Subscription Failed')
      expect(wrapper.text()).not.toContain('Subscribed!')
    })
  })

  describe('toggling interests', () => {
    it('turns a preference on, then back off, on repeated clicks', async () => {
      const wrapper = mountForm()
      const [tech] = wrapper.findAll('button[type="button"]')

      await tech.trigger('click')
      expect(tech.classes()).toContain('bg-primary')

      await tech.trigger('click')
      expect(tech.classes()).not.toContain('bg-primary')
      expect(tech.classes()).toContain('bg-background')
    })
  })

  describe('submitting', () => {
    it('sends only the email when nothing else is filled', async () => {
      mockSubscribe.mockResolvedValue(fakeResult())
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(mockSubscribe).toHaveBeenCalledWith({
        email: 'reader@example.test',
        name: undefined,
        preferences: undefined,
        honeypot: undefined,
        turnstileToken: undefined
      })
    })

    it('carries the name and every toggled preference, in click order', async () => {
      mockSubscribe.mockResolvedValue(fakeResult())
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await wrapper.get('#newsletter-name').setValue('Reader Name')

      const buttons = wrapper.findAll('button[type="button"]')
      await buttons[0].trigger('click') // technology
      await buttons[2].trigger('click') // sustainability
      await submit(wrapper)

      expect(mockSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Reader Name',
          preferences: ['technology', 'sustainability']
        })
      )
    })

    it('carries the Turnstile token once the widget has solved a challenge', async () => {
      mockSubscribe.mockResolvedValue(fakeResult())
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      wrapper.findComponent(TurnstileWidgetStub).vm.$emit('update:modelValue', 'solved-token')
      await wrapper.vm.$nextTick()
      await submit(wrapper)

      expect(mockSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({ turnstileToken: 'solved-token' })
      )
    })

    it('forwards whatever a bot puts in the honeypot, for the backend to drop', async () => {
      // A real visitor never touches this field - it is hidden and off the tab
      // order. Something that fills every input on the page does, and the
      // point of the field is that its value actually reaches the backend.
      mockSubscribe.mockResolvedValue(fakeResult())
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await wrapper.get('#newsletter-website').setValue('http://spam.example')
      await submit(wrapper)

      expect(mockSubscribe).toHaveBeenCalledWith(
        expect.objectContaining({ honeypot: 'http://spam.example' })
      )
    })

    it('never sends a second request while the first is still in flight', async () => {
      let resolveFirst!: (value: SubscribeResult) => void
      mockSubscribe.mockImplementation(
        () =>
          new Promise<SubscribeResult>((resolve) => {
            resolveFirst = resolve
          })
      )
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')

      await submit(wrapper)
      await submit(wrapper) // fired again before the first resolves
      expect(mockSubscribe).toHaveBeenCalledTimes(1)

      resolveFirst(fakeResult())
      await wrapper.vm.$nextTick()
    })

    it('shows a spinner and disables the button while submitting', async () => {
      let resolveFirst!: (value: SubscribeResult) => void
      mockSubscribe.mockImplementation(
        () =>
          new Promise<SubscribeResult>((resolve) => {
            resolveFirst = resolve
          })
      )
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      const button = wrapper.get('button[type="submit"]')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.text()).toContain('Subscribing...')

      resolveFirst(fakeResult())
      await settle()
      expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
    })
  })

  describe('on success', () => {
    it("titles it 'Subscribed!' for a new subscriber and shows the API's own message", async () => {
      mockSubscribe.mockResolvedValue(fakeResult({ isNew: true, message: 'Welcome aboard!' }))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.text()).toContain('Subscribed!')
      expect(wrapper.text()).toContain('Welcome aboard!')
    })

    it("titles it 'Already Subscribed' when the API reports an existing subscriber", async () => {
      mockSubscribe.mockResolvedValue(fakeResult({ isNew: false, message: 'Still with us' }))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.text()).toContain('Already Subscribed')
      expect(wrapper.text()).toContain('Still with us')
    })

    it('clears the form, including any toggled preferences', async () => {
      mockSubscribe.mockResolvedValue(fakeResult())
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await wrapper.get('#newsletter-name').setValue('Reader Name')
      const [tech] = wrapper.findAll('button[type="button"]')
      await tech.trigger('click')

      await submit(wrapper)

      expect((wrapper.get('#newsletter-email').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#newsletter-name').element as HTMLInputElement).value).toBe('')
      expect(wrapper.findAll('button[type="button"]')[0].classes()).not.toContain('bg-primary')
    })

    it('resets the Turnstile widget for the next submission', async () => {
      mockSubscribe.mockResolvedValue(fakeResult())
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(turnstileReset).toHaveBeenCalledTimes(1)
    })

    it('falls back to a fixed thank-you line if the API returns an empty message', async () => {
      // A real, reachable case - not a synthetic one: the backend response
      // shape allows message to be '', and `successMessage || fallback` exists
      // specifically so that does not render a blank alert body.
      mockSubscribe.mockResolvedValue(fakeResult({ message: '' }))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.text()).toContain("Thank you for subscribing! You'll receive updates soon.")
    })
  })

  describe('on failure', () => {
    it("shows the API's own error message", async () => {
      mockSubscribe.mockRejectedValue(new Error('Email already on a suppression list'))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.text()).toContain('Subscription Failed')
      expect(wrapper.text()).toContain('Email already on a suppression list')
    })

    it('falls back to a generic message when the rejection is not an Error', async () => {
      // A thrown string/object bypasses `error instanceof Error`, landing on
      // the catch block's own literal - NOT the template's separate "Unable to
      // subscribe..." fallback, which only ever fires while errorMessage is
      // still empty, and the catch block never leaves it that way.
      mockSubscribe.mockRejectedValue('timeout')
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.text()).toContain('An unexpected error occurred')
    })

    it('falls back to a fixed message when a real Error carries no text', async () => {
      // Also reachable naturally, not synthetically: `error instanceof Error`
      // is true here, so the ternary picks `error.message` - which is ''. This
      // is what the template's OWN `|| 'Unable to subscribe...'` fallback
      // guards: an Error thrown with no message must not render a blank alert.
      mockSubscribe.mockRejectedValue(new Error(''))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.text()).toContain('Unable to subscribe to newsletter. Please try again.')
    })

    it('leaves what the reader typed in place, so they do not retype it', async () => {
      mockSubscribe.mockRejectedValue(new Error('network error'))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await wrapper.get('#newsletter-name').setValue('Reader Name')
      await submit(wrapper)

      expect((wrapper.get('#newsletter-email').element as HTMLInputElement).value).toBe(
        'reader@example.test'
      )
      expect((wrapper.get('#newsletter-name').element as HTMLInputElement).value).toBe(
        'Reader Name'
      )
    })

    it('still resets Turnstile, since the token is single-use', async () => {
      mockSubscribe.mockRejectedValue(new Error('rejected'))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(turnstileReset).toHaveBeenCalledTimes(1)
    })

    it('re-enables the button so the reader can try again', async () => {
      mockSubscribe.mockRejectedValue(new Error('rejected'))
      const wrapper = mountForm()
      await fillEmail(wrapper, 'reader@example.test')
      await submit(wrapper)

      expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
      expect(wrapper.get('button[type="submit"]').text()).toBe('Subscribe to Newsletter')
    })
  })
})
