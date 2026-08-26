import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Team from './Team.vue'
import LinkedInIcon from '@/icons/LinkedInIcon.vue'
import GithubIcon from '@/icons/GithubIcon.vue'
import XIcon from '@/icons/XIcon.vue'

describe('Team', () => {
  it('renders all three members with their positions', () => {
    const wrapper = mount(Team)
    expect(wrapper.text()).toContain('Dhamodharan')
    expect(wrapper.text()).toContain('Krishnan')
    expect(wrapper.text()).toContain('Technology Head')
    expect(wrapper.text()).toContain('Karuneswara')
    expect(wrapper.text()).toContain('Praba')
  })

  it('separates multiple positions with a comma, but not after the last one', () => {
    const wrapper = mount(Team)
    // Dhamodharan's card: "Technology Head," then "Eco-Driving Innovator" bare.
    expect(wrapper.text()).toContain('Technology Head,')
    expect(wrapper.text()).toContain('Eco-Driving Innovator')
    expect(wrapper.text()).not.toContain('Eco-Driving Innovator,')
  })

  it('resolves each network name to its own icon component', () => {
    const wrapper = mount(Team)
    expect(wrapper.findComponent(LinkedInIcon).exists()).toBe(true)
    expect(wrapper.findComponent(GithubIcon).exists()).toBe(true)
    expect(wrapper.findComponent(XIcon).exists()).toBe(true)
  })

  it('gives every social link an accessible name and opens it in a new tab', () => {
    const wrapper = mount(Team)
    const linkedin = wrapper.get('a[aria-label="Visit our LinkedIn page"]')
    expect(linkedin.attributes('href')).toBe('https://www.linkedin.com/in/efficiver-dhamodharan/')
    expect(linkedin.attributes('target')).toBe('_blank')
  })

  it('only shows the networks each member actually has', () => {
    const wrapper = mount(Team)
    const cards = wrapper.findAll('.group\\/hoverimg')
    // Dhamodharan: 3 networks; Karuneswara: 2; Praba: 2.
    expect(cards[0].findAll('a')).toHaveLength(3)
    expect(cards[1].findAll('a')).toHaveLength(2)
    expect(cards[2].findAll('a')).toHaveLength(2)
  })
})
