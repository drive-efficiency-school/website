import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'

const mockConfig = vi.hoisted(() => ({
  contact: { website: 'https://www.efficiver.com' },
  share: { x: true, linkedin: true, reddit: true, native: true }
}))
vi.mock('@/lib/config', () => ({ config: mockConfig }))

/**
 * canShare / showNativeShare / hasAnyShare are MODULE-SCOPE constants, computed
 * once at import. Changing config or navigator after import therefore does
 * nothing - every variant needs the module evaluated again, which is what
 * resetModules + dynamic import buys here.
 */
async function mountShare(
  opts: {
    nav?: unknown
    share?: Partial<typeof mockConfig.share>
    props?: Record<string, unknown>
  } = {}
): Promise<VueWrapper> {
  vi.resetModules()
  Object.assign(
    mockConfig.share,
    { x: true, linkedin: true, reddit: true, native: true },
    opts.share ?? {}
  )
  vi.stubGlobal('navigator', 'nav' in opts ? opts.nav : { share: vi.fn() })
  const Component = (await import('./ShareButtons.vue')).default
  return mount(Component, { props: opts.props })
}

function buttonFor(wrapper: VueWrapper, label: string) {
  return wrapper.get(`button[aria-label="${label}"]`)
}

describe('ShareButtons', () => {
  let openSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    openSpy = vi.fn()
    vi.stubGlobal('open', openSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('what it offers', () => {
    it('renders nothing at all when every channel is off', async () => {
      const wrapper = await mountShare({
        share: { x: false, linkedin: false, reddit: false },
        nav: {} // no navigator.share
      })
      expect(wrapper.find('div').exists()).toBe(false)
      expect(wrapper.text()).toBe('')
    })

    it('still renders when the only available channel is the native sheet', async () => {
      const wrapper = await mountShare({
        share: { x: false, linkedin: false, reddit: false, native: true },
        nav: { share: vi.fn() }
      })
      expect(wrapper.text()).toContain('Share:')
      expect(wrapper.find('button[aria-label="Share via native share"]').exists()).toBe(true)
    })

    it('hides a single channel without hiding the row', async () => {
      const wrapper = await mountShare({ share: { x: false } })
      expect(wrapper.find('button[aria-label="Share on X (Twitter)"]').exists()).toBe(false)
      expect(wrapper.find('button[aria-label="Share on LinkedIn"]').exists()).toBe(true)
      expect(wrapper.find('button[aria-label="Share on Reddit"]').exists()).toBe(true)
    })

    it('hides LinkedIn when switched off', async () => {
      const wrapper = await mountShare({ share: { linkedin: false } })
      expect(wrapper.find('button[aria-label="Share on LinkedIn"]').exists()).toBe(false)
    })

    it('hides Reddit when switched off', async () => {
      const wrapper = await mountShare({ share: { reddit: false } })
      expect(wrapper.find('button[aria-label="Share on Reddit"]').exists()).toBe(false)
    })

    it('hides the native button when the browser cannot share', async () => {
      const wrapper = await mountShare({ nav: {} })
      expect(wrapper.find('button[aria-label="Share via native share"]').exists()).toBe(false)
      // The other three are unaffected.
      expect(wrapper.find('button[aria-label="Share on X (Twitter)"]').exists()).toBe(true)
    })

    it('hides the native button when the config opts out, even if the browser can', async () => {
      const wrapper = await mountShare({ share: { native: false }, nav: { share: vi.fn() } })
      expect(wrapper.find('button[aria-label="Share via native share"]').exists()).toBe(false)
    })

    it('survives a navigator-less environment (the SSR guard)', async () => {
      const wrapper = await mountShare({ nav: undefined })
      // typeof navigator === 'undefined' short-circuits before `'share' in navigator`,
      // which would otherwise throw.
      expect(wrapper.find('button[aria-label="Share via native share"]').exists()).toBe(false)
      expect(wrapper.text()).toContain('Share:')
    })

    it('gives every icon-only button an accessible name', async () => {
      const wrapper = await mountShare()
      const names = wrapper.findAll('button').map((b) => b.attributes('aria-label'))
      expect(names).toEqual([
        'Share on X (Twitter)',
        'Share on LinkedIn',
        'Share on Reddit',
        'Share via native share'
      ])
    })
  })

  describe('where it sends the reader', () => {
    it('opens an X intent carrying the encoded text and url', async () => {
      const wrapper = await mountShare()
      await buttonFor(wrapper, 'Share on X (Twitter)').trigger('click')

      const [url, target, features] = openSpy.mock.calls[0]
      expect(url).toContain('https://twitter.com/intent/tweet?text=')
      expect(url).toContain(encodeURIComponent('https://www.efficiver.com'))
      expect(target).toBe('_blank')
      expect(features).toBe('noopener,noreferrer')
    })

    it('opens a LinkedIn share for the url only', async () => {
      const wrapper = await mountShare()
      await buttonFor(wrapper, 'Share on LinkedIn').trigger('click')

      expect(openSpy).toHaveBeenCalledWith(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://www.efficiver.com')}`,
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('opens a Reddit submit carrying url and title', async () => {
      const wrapper = await mountShare()
      await buttonFor(wrapper, 'Share on Reddit').trigger('click')

      const [url] = openSpy.mock.calls[0]
      expect(url).toContain('https://www.reddit.com/submit?url=')
      expect(url).toContain(encodeURIComponent('Efficiver - Free Driving Coach'))
    })

    it('hands the native sheet the title, text and url', async () => {
      const share = vi.fn()
      const wrapper = await mountShare({ nav: { share } })
      await buttonFor(wrapper, 'Share via native share').trigger('click')

      expect(share).toHaveBeenCalledWith({
        title: 'Efficiver - Free Driving Coach',
        text: expect.stringContaining('no OBD hardware'),
        url: 'https://www.efficiver.com'
      })
    })

    it('does nothing if native share vanishes between render and click', async () => {
      // The guard inside shareNative is only reachable this way, and it is not
      // hypothetical: navigator.share is absent in a non-secure context, and a
      // page can lose it on navigation between mount and click.
      const nav: { share?: () => void } = { share: vi.fn() }
      const wrapper = await mountShare({ nav })
      delete nav.share
      await expect(
        buttonFor(wrapper, 'Share via native share').trigger('click')
      ).resolves.toBeUndefined()
    })

    it('carries caller-supplied title, text and url through every channel', async () => {
      const wrapper = await mountShare({
        props: { title: 'Custom Title', text: 'Custom Text', url: 'https://example.test/page' }
      })

      await buttonFor(wrapper, 'Share on X (Twitter)').trigger('click')
      expect(openSpy.mock.calls[0][0]).toContain(encodeURIComponent('Custom Text'))
      expect(openSpy.mock.calls[0][0]).toContain(encodeURIComponent('https://example.test/page'))

      await buttonFor(wrapper, 'Share on Reddit').trigger('click')
      expect(openSpy.mock.calls[1][0]).toContain(encodeURIComponent('Custom Title'))
    })
  })

  describe('the default share text', () => {
    it('makes no first-person savings claim', async () => {
      // The site must not put an outcome in the sharer's mouth for something the
      // product does not measure. Banned in BOTH directions: no percentage, and
      // no "I saved" phrasing.
      const share = vi.fn()
      const wrapper = await mountShare({ nav: { share } })
      await buttonFor(wrapper, 'Share via native share').trigger('click')

      const text = share.mock.calls[0][0].text as string
      expect(text).not.toMatch(/\d+\s*%/)
      expect(text).not.toMatch(/\bI\s+(saved|cut|reduced)\b/i)
      expect(text).toContain('no OBD hardware')
    })
  })
})
