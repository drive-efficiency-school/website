import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import type { ApiResponse } from '@/lib/api'

const mockSubmit = vi.hoisted(() => vi.fn())
vi.mock('@/lib/api', () => ({ apiService: { submitContactForm: mockSubmit } }))

import Contact from './Contact.vue'

const turnstileReset = vi.fn()
const TurnstileWidgetStub = defineComponent({
  name: 'TurnstileWidget',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(_props, { expose }) {
    expose({ reset: turnstileReset })
    return () => h('div')
  }
})

function mountForm() {
  return mount(Contact, { global: { stubs: { TurnstileWidget: TurnstileWidgetStub } } })
}

async function fill(
  wrapper: ReturnType<typeof mount>,
  fields: Partial<
    Record<'firstName' | 'lastName' | 'email' | 'phone' | 'company' | 'message', string>
  >
) {
  const ids: Record<string, string> = {
    firstName: '#first-name',
    lastName: '#last-name',
    email: '#email',
    phone: '#phone',
    company: '#company',
    message: '#message'
  }
  for (const [key, value] of Object.entries(fields)) {
    await wrapper.get(ids[key]).setValue(value)
  }
}

async function submit(wrapper: ReturnType<typeof mount>) {
  await wrapper.get('form').trigger('submit')
}

describe('Contact', () => {
  beforeEach(() => {
    mockSubmit.mockReset()
    turnstileReset.mockClear()
  })

  it('defaults the subject to General Inquiry', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await fill(wrapper, { firstName: 'Alex', lastName: 'Smith', email: 'alex@example.test' })
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ subject: 'General Inquiry' }))
  })

  it('joins first and last name, trimmed, into a single name field', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await fill(wrapper, { firstName: 'Alex', lastName: 'Smith', email: 'alex@example.test' })
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alex Smith' }))
  })

  it('does not leave a trailing space in the name when only the first name is given', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alex' }))
  })

  it('omits phone and company when left blank or whitespace-only', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await fill(wrapper, {
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex@example.test',
      phone: '   '
    })
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ phone: undefined, company: undefined })
    )
  })

  it('trims and sends phone and company when provided', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await fill(wrapper, {
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex@example.test',
      phone: '  +1 555 0100  ',
      company: '  Acme  '
    })
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '+1 555 0100', company: 'Acme' })
    )
  })

  it('forwards whatever a bot puts in the honeypot', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await wrapper.get('#website').setValue('http://spam.example')
    await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ honeypot: 'http://spam.example' })
    )
  })

  it('carries the Turnstile token once solved', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
    const wrapper = mountForm()
    await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
    wrapper.findComponent(TurnstileWidgetStub).vm.$emit('update:modelValue', 'solved-token')
    await wrapper.vm.$nextTick()
    await submit(wrapper)

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ turnstileToken: 'solved-token' })
    )
  })

  it('never sends a second request while the first is in flight', async () => {
    let resolveFirst!: (value: ApiResponse) => void
    mockSubmit.mockImplementation(
      () =>
        new Promise<ApiResponse>((resolve) => {
          resolveFirst = resolve
        })
    )
    const wrapper = mountForm()
    await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
    await submit(wrapper)
    await submit(wrapper)
    expect(mockSubmit).toHaveBeenCalledTimes(1)

    resolveFirst({ message: 'ok' })
    await wrapper.vm.$nextTick()
  })

  it('shows a sending state and disables the button while in flight', async () => {
    let resolveFirst!: (value: ApiResponse) => void
    mockSubmit.mockImplementation(
      () =>
        new Promise<ApiResponse>((resolve) => {
          resolveFirst = resolve
        })
    )
    const wrapper = mountForm()
    await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
    await submit(wrapper)

    const button = wrapper.get('button[type="submit"]')
    expect(button.text()).toBe('Sending...')
    expect(button.attributes('disabled')).toBeDefined()

    resolveFirst({ message: 'ok' })
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  describe('on success', () => {
    it('shows a confirmation and resets Turnstile', async () => {
      mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
      const wrapper = mountForm()
      await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
      await submit(wrapper)

      expect(wrapper.text()).toContain('Message Sent!')
      expect(turnstileReset).toHaveBeenCalledTimes(1)
    })

    it('clears every field, including the ones that were filled', async () => {
      mockSubmit.mockResolvedValue({ message: 'ok' } satisfies ApiResponse)
      const wrapper = mountForm()
      await fill(wrapper, {
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@example.test',
        phone: '555-0100',
        company: 'Acme',
        message: 'Hello'
      })
      await submit(wrapper)

      expect((wrapper.get('#first-name').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#last-name').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#email').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#phone').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#company').element as HTMLInputElement).value).toBe('')
      expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toBe('')
    })
  })

  describe('on failure', () => {
    it("shows the API's own error message", async () => {
      mockSubmit.mockRejectedValue(new Error('Message rejected as spam'))
      const wrapper = mountForm()
      await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
      await submit(wrapper)

      expect(wrapper.text()).toContain('Message rejected as spam')
    })

    it('falls back to a generic message when the rejection is not an Error', async () => {
      mockSubmit.mockRejectedValue('timeout')
      const wrapper = mountForm()
      await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
      await submit(wrapper)

      expect(wrapper.text()).toContain('An unexpected error occurred')
    })

    it('falls back to a fixed message when a real Error carries no text', async () => {
      mockSubmit.mockRejectedValue(new Error(''))
      const wrapper = mountForm()
      await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
      await submit(wrapper)

      expect(wrapper.text()).toContain('There was an error sending your message. Please try again.')
    })

    it('leaves what the reader typed in place, so they do not retype it', async () => {
      mockSubmit.mockRejectedValue(new Error('network error'))
      const wrapper = mountForm()
      await fill(wrapper, { firstName: 'Alex', lastName: 'Smith', email: 'alex@example.test' })
      await submit(wrapper)

      expect((wrapper.get('#first-name').element as HTMLInputElement).value).toBe('Alex')
      expect((wrapper.get('#email').element as HTMLInputElement).value).toBe('alex@example.test')
    })

    it('still resets Turnstile and re-enables the button', async () => {
      mockSubmit.mockRejectedValue(new Error('network error'))
      const wrapper = mountForm()
      await fill(wrapper, { firstName: 'Alex', email: 'alex@example.test' })
      await submit(wrapper)

      expect(turnstileReset).toHaveBeenCalledTimes(1)
      expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
      expect(wrapper.get('button[type="submit"]').text()).toBe('Send message')
    })
  })
})
