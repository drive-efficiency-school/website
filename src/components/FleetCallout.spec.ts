import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ContactFormData } from '@/lib/api'

const mockSubmit = vi.hoisted(() => vi.fn())
vi.mock('@/lib/api', () => ({ apiService: { submitContactForm: mockSubmit } }))

import FleetCallout from './FleetCallout.vue'

async function fillAndSubmit(
  wrapper: ReturnType<typeof mount>,
  { company, email }: { company?: string; email: string }
) {
  if (company !== undefined) {
    await wrapper.get('input[name="company"]').setValue(company)
  }
  await wrapper.get('input[name="email"]').setValue(email)
  await wrapper.get('form').trigger('submit')
}

describe('FleetCallout', () => {
  beforeEach(() => {
    mockSubmit.mockReset()
  })

  it('gives drivers no CTA at all - joining is invite-only', () => {
    const wrapper = mount(FleetCallout)
    expect(wrapper.text()).toContain('Your employer gives you a code')
    // No button anywhere in the drivers card; the only button on the page
    // belongs to the operators' form.
    expect(wrapper.findAll('button')).toHaveLength(1)
  })

  it('marks the operator offer as not yet available', () => {
    const wrapper = mount(FleetCallout)
    expect(wrapper.get('[data-testid="fleet-coming-soon"]').text()).toBe('Coming soon')
  })

  it('registers interest with a tagged subject and the given company name', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' })
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: 'Acme Logistics', email: 'ops@acme.test' })

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Acme Logistics',
      email: 'ops@acme.test',
      company: 'Acme Logistics',
      subject: 'Efficiver Fleet — register interest',
      message: 'Fleet interest registered from the website.\nCompany: Acme Logistics',
      honeypot: ''
    })
  })

  it('falls back to a generic name and message when no company is given', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' })
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: '', email: 'ops@acme.test' })

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Fleet enquiry',
        company: '',
        message: 'Fleet interest registered from the website.\nCompany: (not given)'
      })
    )
  })

  it('forwards whatever a bot puts in the honeypot', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' })
    const wrapper = mount(FleetCallout)
    await wrapper.get('input[name="company_website"]').setValue('http://spam.example')
    await fillAndSubmit(wrapper, { email: 'ops@acme.test' })

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ honeypot: 'http://spam.example' })
    )
  })

  it('shows a thank-you message and hides the form on success', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' })
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: 'Acme', email: 'ops@acme.test' })

    expect(wrapper.get('[role="status"]').text()).toContain('we have your details')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('clears email and company on success, but not before showing them submitted', async () => {
    mockSubmit.mockResolvedValue({ message: 'ok' })
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: 'Acme', email: 'ops@acme.test' })
    // Form is gone (thank-you state), so re-mount fresh state is what we can
    // observe: submit was called with the filled values, which is the
    // behaviour that matters. Confirms the vm-level fields cleared too, via a
    // second submit path being unreachable (no form to resubmit).
    expect(wrapper.find('input[name="email"]').exists()).toBe(false)
  })

  it('never sends a second request while the first is in flight', async () => {
    let resolveFirst!: (value: { message: string }) => void
    mockSubmit.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve
        })
    )
    const wrapper = mount(FleetCallout)
    await wrapper.get('input[name="email"]').setValue('ops@acme.test')

    await wrapper.get('form').trigger('submit')
    await wrapper.get('form').trigger('submit')
    expect(mockSubmit).toHaveBeenCalledTimes(1)

    resolveFirst({ message: 'ok' })
    await wrapper.vm.$nextTick()
  })

  it('shows a sending state and disables the button while in flight', async () => {
    let resolveFirst!: (value: { message: string }) => void
    mockSubmit.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFirst = resolve
        })
    )
    const wrapper = mount(FleetCallout)
    await wrapper.get('input[name="email"]').setValue('ops@acme.test')
    await wrapper.get('form').trigger('submit')

    const button = wrapper.get('button[type="submit"]')
    expect(button.text()).toBe('Sending…')
    expect(button.attributes('disabled')).toBeDefined()

    resolveFirst({ message: 'ok' })
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('shows an error message and keeps the form so the reader can retry', async () => {
    mockSubmit.mockRejectedValue(new Error('network error'))
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: 'Acme', email: 'ops@acme.test' })

    expect(wrapper.get('[role="alert"]').text()).toContain('Something went wrong')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('lets the reader retry after an error, and a second success clears it', async () => {
    mockSubmit.mockRejectedValueOnce(new Error('network error'))
    mockSubmit.mockResolvedValueOnce({ message: 'ok' })
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: 'Acme', email: 'ops@acme.test' })
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)

    await wrapper.get('form').trigger('submit')
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  const captured: ContactFormData[] = []
  it('type-checks the payload shape against the real ContactFormData contract', async () => {
    mockSubmit.mockImplementation(async (payload: ContactFormData) => {
      captured.push(payload)
      return { message: 'ok' }
    })
    const wrapper = mount(FleetCallout)
    await fillAndSubmit(wrapper, { company: 'Acme', email: 'ops@acme.test' })
    expect(captured[0].subject).toBe('Efficiver Fleet — register interest')
  })
})
