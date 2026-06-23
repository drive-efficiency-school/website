<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

  import {
    TabletSmartphone,
    BadgeCheck,
    Goal,
    Mic,
    Activity,
    BrainCircuit,
    Fingerprint,
    Map,
    Cloud,
    Accessibility,
    Car
  } from 'lucide-vue-next'

  interface FeaturesProps {
    icon: string
    title: string
    description: string
  }

  const featureList: FeaturesProps[] = [
    {
      icon: 'car',
      title: 'CarPlay support',
      description:
        'Drive with your phone in your pocket — Efficiver runs as a Driving Task on the CarPlay screen, with voice prompts through your car audio. Wired or wireless.'
    },
    {
      icon: 'map',
      title: 'Live drive map',
      description:
        'Full-screen Apple Maps view that follows you smoothly, with per-waypoint event markers.'
    },
    {
      icon: 'accessibility',
      title: 'Accessibility-first',
      description:
        'VoiceOver, Dynamic Type AX1-AX5, Reduce Motion, Reduce Transparency, Differentiate Without Color.'
    },
    {
      icon: 'cloud',
      title: 'iCloud sync',
      description: 'Sessions and your trained Smart Detection model sync across your devices.'
    },
    {
      icon: 'brainCircuit',
      title: 'Smart Detection',
      description:
        'Learns your engine signature on-device. No OBD dongle, no rev-range setup, no data leaving your iPhone.'
    },
    {
      icon: 'tabletSmartphone',
      title: 'Offline & background-aware',
      description:
        'Works offline using only your iPhone sensors. Continues logging when you switch to Maps or Music.'
    },
    {
      icon: 'goal',
      title: 'Fuel & CO₂ Savings',
      description: 'Quantify fuel savings and CO₂ reductions with detailed session metrics.'
    },
    {
      icon: 'activity',
      title: 'Advanced Metrics',
      description: 'Monitor Acceleration, Braking, Cornering, and Idle Time in real-time.'
    },
    {
      icon: 'fingerprint',
      title: 'Biometric Privacy',
      description: 'Your data is local and secured with FaceID/TouchID. No tracking, ever.'
    },
    {
      icon: 'mic',
      title: 'Voice Commands',
      description: 'Stay safe with hands-free voice controls to start and stop your drives.'
    },
    {
      icon: 'badgeCheck',
      title: 'Safer Driving Tips',
      description: 'Get personalized offline coaching to improve your driving habits and safety.'
    }
  ]

  const iconMap: Record<
    string,
    | typeof TabletSmartphone
    | typeof BadgeCheck
    | typeof Goal
    | typeof Mic
    | typeof Activity
    | typeof BrainCircuit
    | typeof Fingerprint
    | typeof Map
    | typeof Cloud
    | typeof Accessibility
    | typeof Car
  > = {
    tabletSmartphone: TabletSmartphone,
    badgeCheck: BadgeCheck,
    goal: Goal,
    mic: Mic,
    activity: Activity,
    brainCircuit: BrainCircuit,
    fingerprint: Fingerprint,
    map: Map,
    cloud: Cloud,
    accessibility: Accessibility,
    car: Car
  }
</script>

<template>
  <section id="features" class="container py-24 sm:py-32">
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">Features</h2>

    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">Why Choose Efficiver?</h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      Discover the powerful features that make Efficiver the ultimate offline eco-driving app –
      designed to help you save fuel, reduce emissions, and drive safer, all without needing
      internet or hardware.
    </h3>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="{ icon, title, description } in featureList" :key="title">
        <Card class="h-full bg-background border-0 shadow-none">
          <CardHeader class="flex justify-center items-center">
            <div class="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
              <component :is="iconMap[icon]" class="size-6 text-primary" />
            </div>

            <CardTitle>
              {{ title }}
            </CardTitle>
          </CardHeader>

          <CardContent class="text-muted-foreground text-center">
            {{ description }}
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped></style>
