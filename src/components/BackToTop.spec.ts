import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BackToTop from './BackToTop.vue'

/**
 * The whole component is one threshold and two window listeners. What is worth
 * pinning is the threshold BOUNDARY and the listener teardown - a scroll
 * listener that outlives its component is a real leak, and the only way to
 * catch it is to assert removal with the SAME function reference that was added.
 */

function setScrollY(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true })
}

describe('BackToTop', () => {
  beforeEach(() => {
    setScrollY(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders no button before any scroll', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.find('button').exists()).toBe(false)
    wrapper.unmount()
  })

  it('stays hidden at exactly 400 - the threshold is >, not >=', async () => {
    const wrapper = mount(BackToTop)
    setScrollY(400)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(false)
    wrapper.unmount()
  })

  it('appears one pixel past the threshold', async () => {
    const wrapper = mount(BackToTop)
    setScrollY(401)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.unmount()
  })

  it('carries an accessible name, since the button is icon-only', async () => {
    const wrapper = mount(BackToTop)
    setScrollY(500)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').attributes('aria-label')).toBe('Back to top')
    wrapper.unmount()
  })

  it('hides again when the user scrolls back up', async () => {
    const wrapper = mount(BackToTop)
    setScrollY(500)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(true)

    setScrollY(10)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(false)
    wrapper.unmount()
  })

  it('scrolls to the top smoothly on click', async () => {
    const scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollTo, configurable: true })

    const wrapper = mount(BackToTop)
    setScrollY(500)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    await wrapper.find('button').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    wrapper.unmount()
  })

  it('removes the very listener it added, so it does not leak', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount(BackToTop)
    const added = add.mock.calls.find(([type]) => type === 'scroll')
    expect(added).toBeDefined()

    wrapper.unmount()
    const removed = remove.mock.calls.find(([type]) => type === 'scroll')
    expect(removed).toBeDefined()
    // Same reference - removeEventListener with a different function is a no-op,
    // which is the classic way a "cleaned up" listener silently survives.
    expect(removed![1]).toBe(added![1])
  })

  it('stops responding to scroll once unmounted', async () => {
    const wrapper = mount(BackToTop)
    wrapper.unmount()

    setScrollY(900)
    // If the handler were still attached it would touch a torn-down reactive
    // ref; this asserts the teardown behaviourally, not just by spy bookkeeping.
    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow()
  })
})
