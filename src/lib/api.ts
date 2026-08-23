import { config } from '@/lib/config'

const API_BASE_URL = config.api.baseUrl

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  source?: string
  // Anti-spam: honeypot decoy + Cloudflare Turnstile token.
  honeypot?: string
  turnstileToken?: string
}

export interface NewsletterSubscriptionData {
  email: string
  name?: string
  preferences?: string[]
  source?: string
  // Anti-spam: honeypot decoy + Cloudflare Turnstile token.
  honeypot?: string
  turnstileToken?: string
}

export interface ApiResponse {
  message?: string
  error?: boolean
  reason?: string
}

export interface SubscriptionResponse {
  id: string
  email: string
  name?: string
  isActive: boolean
  subscriptionDate: string
  preferences?: string[]
  source: string
}

// New response format from subscribe endpoint
export interface SubscribeResult {
  subscriber: SubscriptionResponse
  isNew: boolean
  message: string
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.reason || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Some endpoints (e.g. POST /contact) return 201 with an empty body.
      // Parsing "" as JSON throws ("Unexpected end of JSON input"), which
      // would surface a false error even though the request succeeded.
      const text = await response.text()
      return (text ? JSON.parse(text) : {}) as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async submitContactForm(data: ContactFormData): Promise<ApiResponse> {
    // Only include optional fields if they have values
    const payload: Record<string, string | undefined> = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    }

    if (data.phone) payload.phone = data.phone
    if (data.company) payload.company = data.company
    payload.source = data.source || config.contact.website || 'www.efficiver.com'
    // Anti-spam — honeypot only when a bot filled it; token always when present.
    if (data.honeypot) payload.honeypot = data.honeypot
    if (data.turnstileToken) payload.turnstileToken = data.turnstileToken

    return this.request<ApiResponse>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async subscribeToNewsletter(data: NewsletterSubscriptionData): Promise<SubscribeResult> {
    const payload = {
      ...data,
      source: data.source || config.contact.website || 'www.efficiver.com'
    }

    return this.request<SubscribeResult>('/subscribers/subscribe', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async unsubscribeFromNewsletter(email: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/subscribers/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }
}

export const apiService = new ApiService()
