import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mutable config stand-in: the Android button is gated on `config.app.android`
// being non-empty, and that gate is the thing that kept "(soon)" honest before
// the Play listing went live. It has to be exercised in BOTH states.
// vi.hoisted, because vi.mock is lifted above ordinary top-level consts.
const mockConfig = vi.hoisted(() => ({
  app: {
    ios: 'https://apps.apple.com/test-ios',
    android: 'https://play.google.com/test-android'
  }
}))
vi.mock('@/lib/config', () => ({ config: mockConfig }))

import ExitIntentPopup from './ExitIntentPopup.vue'

function leaveThroughTop(clientY = -5) {
  document.dispatchEvent(new MouseEvent('mouseleave', { clientY }))
}

function setInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true })
}

// radix's Presence unmounts the sheet on a MACROTASK, after the leave
// transition resolves - nextTick alone leaves a closed sheet sitting in the DOM,
// which makes an absence assertion look like a failure to close.
const settle = () => new Promise((resolve) => setTimeout(resolve, 20))

describe('ExitIntentPopup', () => {
  let openSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    localStorage.clear()
    document.body.innerHTML = ''
    setInnerWidth(1280) // desktop, so the listener attaches
    openSpy = vi.fn()
    Object.defineProperty(window, 'open', { value: openSpy, configurable: true, writable: true })
    mockConfig.app.android = 'https://play.google.com/test-android'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('stays shut until the pointer leaves through the TOP of the page', async () => {
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })

    // Leaving sideways or downward is not exit intent.
    leaveThroughTop(25)
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).not.toContain('before you go')

    leaveThroughTop(-1)
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('before you go')
    wrapper.unmount()
  })

  it('treats clientY of exactly 0 as leaving through the top', async () => {
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })
    leaveThroughTop(0)
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('before you go')
    wrapper.unmount()
  })

  it('never reopens within a session once it has been shown', async () => {
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })

    leaveThroughTop()
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('before you go')

    // Dismiss, then leave through the top again.
    const buttons = Array.from(document.body.querySelectorAll('button'))
    const noThanks = buttons.find((b) => b.textContent?.includes('No thanks'))!
    noThanks.click()
    await wrapper.vm.$nextTick()
    await settle()

    // Clear the persisted flag first, so the ONLY thing that can keep it shut is
    // the in-session `hasShown` guard - otherwise this test would pass on the
    // localStorage check and never exercise the guard it claims to.
    localStorage.clear()

    leaveThroughTop()
    await wrapper.vm.$nextTick()
    await settle()
    expect(document.body.textContent).not.toContain('before you go')
    wrapper.unmount()
  })

  it('respects a dismissal from a PREVIOUS visit', async () => {
    localStorage.setItem('exitPopupDismissed', 'true')
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })

    leaveThroughTop()
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).not.toContain('before you go')
    wrapper.unmount()
  })

  it('records the dismissal so it survives a reload', async () => {
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })
    leaveThroughTop()
    await wrapper.vm.$nextTick()

    const buttons = Array.from(document.body.querySelectorAll('button'))
    buttons.find((b) => b.textContent?.includes('No thanks'))!.click()
    await wrapper.vm.$nextTick()

    expect(localStorage.getItem('exitPopupDismissed')).toBe('true')
    wrapper.unmount()
  })

  it('sends an iOS reader to the App Store and closes', async () => {
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })
    leaveThroughTop()
    await wrapper.vm.$nextTick()

    const buttons = Array.from(document.body.querySelectorAll('button'))
    buttons.find((b) => b.textContent?.includes('App Store'))!.click()
    await wrapper.vm.$nextTick()

    expect(openSpy).toHaveBeenCalledWith('https://apps.apple.com/test-ios', '_blank')
    expect(localStorage.getItem('exitPopupDismissed')).toBe('true')
    wrapper.unmount()
  })

  it('sends an Android reader to Play, not to the App Store', async () => {
    // This popup used to push EVERY visitor at the App Store, so an Android
    // reader was sent to a store they cannot install from.
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })
    leaveThroughTop()
    await wrapper.vm.$nextTick()

    const buttons = Array.from(document.body.querySelectorAll('button'))
    buttons.find((b) => b.textContent?.includes('Google Play'))!.click()
    await wrapper.vm.$nextTick()

    expect(openSpy).toHaveBeenCalledWith('https://play.google.com/test-android', '_blank')
    expect(localStorage.getItem('exitPopupDismissed')).toBe('true')
    wrapper.unmount()
  })

  it('hides the Play button entirely when no Play link is configured', async () => {
    mockConfig.app.android = ''
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })
    leaveThroughTop()
    await wrapper.vm.$nextTick()

    const labels = Array.from(document.body.querySelectorAll('button')).map((b) => b.textContent)
    expect(labels.some((t) => t?.includes('App Store'))).toBe(true)
    expect(labels.some((t) => t?.includes('Google Play'))).toBe(false)
    wrapper.unmount()
  })

  it('does not arm exit intent on a narrow viewport - there is no cursor to lose', async () => {
    setInnerWidth(768) // the guard is > 768, so 768 itself is "mobile"
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })

    leaveThroughTop()
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).not.toContain('before you go')
    wrapper.unmount()
  })

  it("closes on Escape, but does NOT persist a dismissal - the sheet's own close path, not the button", async () => {
    // Distinct from dismissPopup(): Escape drives radix's v-model:open from
    // the OTHER direction (the Sheet emitting update:open back to the
    // parent), not our own button handler. A reader who backs out with
    // Escape has not said "don't show me this again" the way clicking
    // "No thanks" does, so it must not write the localStorage flag.
    const wrapper = mount(ExitIntentPopup, { attachTo: document.body })
    leaveThroughTop()
    await wrapper.vm.$nextTick()
    expect(document.body.textContent).toContain('before you go')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await wrapper.vm.$nextTick()
    await settle()

    expect(document.body.textContent).not.toContain('before you go')
    expect(localStorage.getItem('exitPopupDismissed')).toBeNull()
    wrapper.unmount()
  })

  it('detaches its document listener on unmount', () => {
    const add = vi.spyOn(document, 'addEventListener')
    const remove = vi.spyOn(document, 'removeEventListener')

    const wrapper = mount(ExitIntentPopup)
    const added = add.mock.calls.find(([type]) => type === 'mouseleave')
    expect(added).toBeDefined()

    wrapper.unmount()
    const removed = remove.mock.calls.find(([type]) => type === 'mouseleave')
    expect(removed).toBeDefined()
    expect(removed![1]).toBe(added![1])
  })
})
