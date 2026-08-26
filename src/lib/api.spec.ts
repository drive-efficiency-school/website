import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiService, type ContactFormData, type NewsletterSubscriptionData } from './api'

/**
 * ApiService — every branch, including the ones that only appear against a real
 * backend: a 201 with an EMPTY body (which `JSON.parse('')` would throw on), an
 * error body carrying `reason`, an error body that is not JSON at all, and a
 * transport-level throw.
 */

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    text: async () => JSON.stringify(body),
    json: async () => body
  } as unknown as Response
}

function rawResponse(text: string, ok = true, status = 200, statusText = 'OK') {
  return {
    ok,
    status,
    statusText,
    text: async () => text,
    json: async () => JSON.parse(text)
  } as unknown as Response
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  // request() logs on failure; keep the suite output readable while still
  // being able to assert it was called.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const minimalContact: ContactFormData = {
  name: 'Alex Smith',
  email: 'alex@example.com',
  subject: 'General Inquiry',
  message: 'Hello'
}

describe('submitContactForm', () => {
  it('POSTs JSON to /contact with the required fields', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.submitContactForm(minimalContact)

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toMatch(/\/contact$/)
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    const sent = JSON.parse(init.body)
    expect(sent).toMatchObject({
      name: 'Alex Smith',
      email: 'alex@example.com',
      subject: 'General Inquiry',
      message: 'Hello'
    })
  })

  it('survives a 201 with an EMPTY body', async () => {
    // The real /contact returns 201 with no body. JSON.parse('') throws, which
    // would surface a false error on a successful submit.
    fetchMock.mockResolvedValue(rawResponse('', true, 201))
    await expect(apiService.submitContactForm(minimalContact)).resolves.toEqual({})
  })

  it('parses a JSON body when one is returned', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'thanks' }))
    await expect(apiService.submitContactForm(minimalContact)).resolves.toEqual({
      message: 'thanks'
    })
  })

  it('omits optional fields that are absent', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.submitContactForm(minimalContact)
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent).not.toHaveProperty('phone')
    expect(sent).not.toHaveProperty('company')
    expect(sent).not.toHaveProperty('honeypot')
    expect(sent).not.toHaveProperty('turnstileToken')
  })

  it('includes optional fields when present', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.submitContactForm({
      ...minimalContact,
      phone: '+1 555 0000',
      company: 'Acme',
      honeypot: 'bot-filled',
      turnstileToken: 'tok'
    })
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.phone).toBe('+1 555 0000')
    expect(sent.company).toBe('Acme')
    expect(sent.honeypot).toBe('bot-filled')
    expect(sent.turnstileToken).toBe('tok')
  })

  it('defaults source when the caller omits it', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.submitContactForm(minimalContact)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).source).toBeTruthy()
  })

  it('honours an explicit source', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.submitContactForm({ ...minimalContact, source: 'partner-site' })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).source).toBe('partner-site')
  })

  it('surfaces the backend reason on a non-ok response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      statusText: 'Unprocessable',
      json: async () => ({ reason: 'Email already queued' })
    } as unknown as Response)
    await expect(apiService.submitContactForm(minimalContact)).rejects.toThrow(
      'Email already queued'
    )
  })

  it('falls back to status text when the error body has no reason', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({})
    } as unknown as Response)
    await expect(apiService.submitContactForm(minimalContact)).rejects.toThrow(
      'HTTP 500: Internal Server Error'
    )
  })

  it('falls back to status text when the error body is not JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      json: async () => {
        throw new Error('not json')
      }
    } as unknown as Response)
    await expect(apiService.submitContactForm(minimalContact)).rejects.toThrow(
      'HTTP 502: Bad Gateway'
    )
  })

  it('rethrows a transport failure and logs it', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(apiService.submitContactForm(minimalContact)).rejects.toThrow('Failed to fetch')
    expect(console.error).toHaveBeenCalled()
  })
})

describe('subscribeToNewsletter', () => {
  const sub: NewsletterSubscriptionData = { email: 'a@b.com' }

  it('POSTs to the subscribe endpoint and returns the result', async () => {
    const result = {
      subscriber: {
        id: '1',
        email: 'a@b.com',
        isActive: true,
        subscriptionDate: '2026-01-01',
        source: 'efficiver.com'
      },
      isNew: true,
      message: 'Subscribed'
    }
    fetchMock.mockResolvedValue(jsonResponse(result))
    await expect(apiService.subscribeToNewsletter(sub)).resolves.toEqual(result)
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/subscribers\/subscribe$/)
  })

  it('defaults source and preserves supplied fields', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.subscribeToNewsletter({
      email: 'a@b.com',
      name: 'A',
      preferences: ['product'],
      honeypot: '',
      turnstileToken: 't'
    })
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent.source).toBeTruthy()
    expect(sent.name).toBe('A')
    expect(sent.preferences).toEqual(['product'])
    expect(sent.turnstileToken).toBe('t')
  })

  it('honours an explicit source', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.subscribeToNewsletter({ ...sub, source: 'campaign' })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).source).toBe('campaign')
  })
})

describe('unsubscribeFromNewsletter', () => {
  it('POSTs only the email', async () => {
    fetchMock.mockResolvedValue(rawResponse(''))
    await apiService.unsubscribeFromNewsletter('a@b.com')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toMatch(/\/subscribers\/unsubscribe$/)
    expect(JSON.parse(init.body)).toEqual({ email: 'a@b.com' })
  })
})
