import { describe, it, expect, vi, afterEach } from 'vitest'

/**
 * config.ts is evaluated at IMPORT time, so each env permutation needs a fresh
 * module. vi.resetModules() + dynamic import gives that.
 *
 * The branches that matter are the two different default styles:
 *   `X || fallback`      — an EMPTY string falls back
 *   `X !== 'false'`      — anything but the literal "false" is true
 * Getting those backwards is how a cleared env var silently turns a feature on
 * or off, which is exactly what gates the Android store links.
 */
async function loadConfig(env: Record<string, string>) {
  vi.resetModules()
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v)
  return (await import('./config')).config
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('defaults when env is empty', () => {
  it('falls back for every `|| fallback` value', async () => {
    const c = await loadConfig({
      VITE_CONTACT_EMAIL: '',
      VITE_CONTACT_WEBSITE: '',
      VITE_APP_STORE_LINK: '',
      VITE_PLAY_STORE_LINK: '',
      VITE_EMAIL_API_BASE_URL: '',
      VITE_TURNSTILE_SITE_KEY: ''
    })
    expect(c.contact.email).toBe('contact@efficiver.com')
    expect(c.contact.website).toBe('https://www.efficiver.com')
    expect(c.app.ios).toMatch(/apps\.apple\.com/)
    expect(c.app.android).toMatch(/play\.google\.com/)
    expect(c.api.baseUrl).toMatch(/^https:\/\//)
    expect(c.turnstile.siteKey).toBeTruthy()
  })

  it('keeps optional values empty rather than inventing them', async () => {
    const c = await loadConfig({
      VITE_CONTACT_PHONE: '',
      VITE_SOCIAL_INSTAGRAM: '',
      VITE_SOCIAL_TIKTOK: '',
      VITE_SOCIAL_LINKEDIN: '',
      VITE_APPLE_WATCH_LINK: '',
      VITE_ANDROID_WATCH_LINK: '',
      VITE_DASHBOARD_LINK: ''
    })
    expect(c.contact.phone).toBe('')
    expect(c.socials).toEqual({ instagram: '', tiktok: '', linkedin: '' })
    expect(c.app.watch).toEqual({ apple: '', android: '' })
    expect(c.app.dashboard).toBe('')
  })
})

describe('env overrides', () => {
  it('uses supplied values', async () => {
    const c = await loadConfig({
      VITE_CONTACT_EMAIL: 'hi@example.com',
      VITE_CONTACT_PHONE: '+44 20 0000 0000',
      VITE_APP_STORE_LINK: 'https://apps.example/ios',
      VITE_PLAY_STORE_LINK: 'https://play.example/android',
      VITE_SOCIAL_LINKEDIN: 'https://linkedin.example'
    })
    expect(c.contact.email).toBe('hi@example.com')
    expect(c.contact.phone).toBe('+44 20 0000 0000')
    expect(c.app.ios).toBe('https://apps.example/ios')
    expect(c.app.android).toBe('https://play.example/android')
    expect(c.socials.linkedin).toBe('https://linkedin.example')
  })
})

describe('boolean flags use `!== "false"` semantics', () => {
  it('are ON when unset', async () => {
    const c = await loadConfig({})
    expect(c.features.newsletter).toBe(true)
    expect(c.features.contact).toBe(true)
    expect(c.share.x).toBe(true)
    expect(c.share.linkedin).toBe(true)
    expect(c.share.reddit).toBe(true)
    expect(c.share.native).toBe(true)
    expect(c.pricing.launchOffer).toBe(true)
  })

  it('are OFF only for the literal string "false"', async () => {
    const c = await loadConfig({
      VITE_SHOW_NEWSLETTER: 'false',
      VITE_SHOW_CONTACT: 'false',
      VITE_SHARE_ON_X: 'false',
      VITE_SHARE_ON_LINKEDIN: 'false',
      VITE_SHARE_ON_REDDIT: 'false',
      VITE_SHARE_NATIVE: 'false',
      VITE_LAUNCH_OFFER_ECO_MASTER: 'false'
    })
    expect(c.features.newsletter).toBe(false)
    expect(c.features.contact).toBe(false)
    expect(c.share.x).toBe(false)
    expect(c.share.linkedin).toBe(false)
    expect(c.share.reddit).toBe(false)
    expect(c.share.native).toBe(false)
    expect(c.pricing.launchOffer).toBe(false)
  })

  it('stays ON for any other value, including "0" and "off"', async () => {
    const c = await loadConfig({ VITE_SHOW_CONTACT: '0', VITE_SHARE_ON_X: 'off' })
    expect(c.features.contact).toBe(true)
    expect(c.share.x).toBe(true)
  })
})

describe('legal page dates', () => {
  it('carries a date for each dated page', async () => {
    const c = await loadConfig({})
    for (const k of ['help', 'privacy', 'terms', 'accessibility'] as const) {
      expect(c.lastUpdated[k], k).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    }
  })
})

describe('androidAuto stays empty', () => {
  it('is empty by default — Google rejected the Car App Library category', async () => {
    const c = await loadConfig({})
    expect(c.app.androidAuto).toBe('')
  })
})
