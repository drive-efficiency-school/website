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
    Car,
    Watch,
    BatteryCharging
  } from 'lucide-vue-next'

  interface FeaturesProps {
    icon: string
    title: string
    description: string
  }

  // Every claim below is checked against the shipping apps (2026-08-23). Platform-
  // specific capabilities are LABELLED rather than stated as universal:
  //  - CarPlay is iOS-only. There is deliberately NO Android Auto surface — Google
  //    ruled a phone-sensor driving dashboard outside the Car App Library's
  //    permitted categories, so it must not be implied here.
  //  - The map is Apple Maps on iPhone and Google Maps on Android (maps-compose).
  //  - iCloud sync is iOS-only; the Android app has no equivalent sync feature.
  //  - "Cornering" was REMOVED: no cornering detection exists in either codebase
  //    (verified — the engine tracks acceleration, braking and idle only).
  //  - Biometric lock is Face ID / Touch ID on iOS and BiometricPrompt
  //    (androidx.biometric) on Android — so the wording is platform-neutral.
  const featureList: FeaturesProps[] = [
    {
      icon: 'car',
      title: 'CarPlay support (iPhone)',
      description:
        'Drive with your phone in your pocket — Efficiver runs as a Driving Task on the CarPlay screen, with voice prompts through your car audio. Wired or wireless.'
    },
    {
      icon: 'watch',
      title: 'Watch companions',
      description:
        'Start and stop drives from your wrist and glance at your live score — Apple Watch on iPhone, Wear OS on Android.'
    },
    {
      icon: 'map',
      title: 'Live drive map',
      description:
        'Full-screen map that follows you smoothly, with per-waypoint event markers — Apple Maps on iPhone, Google Maps on Android.'
    },
    {
      icon: 'accessibility',
      title: 'Accessibility-first',
      description:
        'Works with the screen reader and text-size settings you already use — VoiceOver and Dynamic Type on iPhone, TalkBack and font scaling on Android.'
    },
    {
      icon: 'cloud',
      title: 'iCloud sync (iPhone)',
      description:
        'On iPhone, sessions and your trained Smart Detection model sync across your devices via your own private iCloud database.'
    },
    {
      icon: 'brainCircuit',
      title: 'Smart Detection',
      description:
        'A one-time, roughly two-minute calibration teaches Efficiver to tell your engine running from stopped, on-device. No OBD dongle, no rev-range setup.'
    },
    {
      icon: 'tabletSmartphone',
      title: 'Offline & background-aware',
      description:
        "Works offline using only your phone's sensors. Continues logging when you switch to Maps or Music."
    },
    {
      // D8. Verified in source on BOTH platforms — iOS PowerManager observes
      // NSProcessInfoPowerStateDidChange; Android registers a receiver on
      // PowerManager.ACTION_POWER_SAVE_MODE_CHANGED. The setting ships ON
      // (AppPrefsLogic.DEFAULT_IS_PRIORITISE_LOW_POWER_ENABLED = true).
      // Deliberately states BEHAVIOUR, never a quantity of battery saved:
      // there is no battery instrumentation in either app to support one.
      icon: 'battery',
      title: 'Respects Low Power Mode',
      description:
        'Prioritise Low Power is on by default. When your phone enters Low Power Mode or Battery Saver, the live map pauses and background work is reduced — on iPhone and Android.'
    },
    {
      icon: 'goal',
      title: 'Fuel & CO₂ Savings',
      description: 'Quantify fuel savings and CO₂ reductions with detailed session metrics.'
    },
    {
      icon: 'activity',
      title: 'Advanced Metrics',
      description: 'Monitor Acceleration, Braking, and Idle Time in real-time.'
    },
    {
      icon: 'fingerprint',
      title: 'Biometric Privacy',
      description:
        'Your drives are stored on your phone and can be locked behind your device biometrics. No tracking, ever.'
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
    | typeof Watch
    | typeof BatteryCharging
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
    car: Car,
    watch: Watch,
    battery: BatteryCharging
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
