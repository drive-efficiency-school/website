import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorks from './HowItWorks.vue'
import DownloadPhone from '@/components/icons/DownloadPhone.vue'
import DriveCar from '@/components/icons/DriveCar.vue'
import AnalyzeChart from '@/components/icons/AnalyzeChart.vue'
import ImproveBadge from '@/components/icons/ImproveBadge.vue'

describe('HowItWorks', () => {
  it('lists all four steps in order, each with its own badge', () => {
    const wrapper = mount(HowItWorks)
    expect(wrapper.findAll('.pb-4').map((el) => el.text())).toEqual([
      'Download',
      'Drive',
      'Analyze',
      'Improve'
    ])
    expect(wrapper.text()).toContain('Download & Calibrate')
    expect(wrapper.text()).toContain('Drive & Track')
    expect(wrapper.text()).toContain('Analyze')
    expect(wrapper.text()).toContain('Improve')
  })

  it('picks a distinct icon for each of the four steps, in order', () => {
    const wrapper = mount(HowItWorks)
    expect(wrapper.findComponent(DownloadPhone).exists()).toBe(true)
    expect(wrapper.findComponent(DriveCar).exists()).toBe(true)
    expect(wrapper.findComponent(AnalyzeChart).exists()).toBe(true)
    expect(wrapper.findComponent(ImproveBadge).exists()).toBe(true)
  })

  it('alternates row direction and glow position between even and odd steps', () => {
    const wrapper = mount(HowItWorks)
    const rows = wrapper.findAll('#how-it-works > div > div')
    expect(rows).toHaveLength(4)
    // index 0 (even): normal order, glow stays on the right.
    expect(rows[0].classes()).not.toContain('flex-row-reverse')
    // index 1 (odd): reversed row, glow moves to the left.
    expect(rows[1].classes()).toContain('flex-row-reverse')
    expect(rows[2].classes()).not.toContain('flex-row-reverse')
    expect(rows[3].classes()).toContain('flex-row-reverse')
  })

  it('gives every step icon an accessible label from its own alt text', () => {
    // Every item in HowItWorksList sets `alt`, so this also pins that the
    // `alt || title` fallback is choosing the FIRST operand here - the
    // fallback itself only fires if a future item omits `alt`.
    const wrapper = mount(HowItWorks)
    expect(wrapper.find('[aria-label="Download the Efficiver app on mobile"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Drive and track with your phone in the car"]').exists()).toBe(
      true
    )
  })
})
