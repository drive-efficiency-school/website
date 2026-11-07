<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { ArrowRight, Crown, Settings, Users } from 'lucide-vue-next'
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])

  interface Flagship {
    icon: typeof Crown
    color: string
    title: string
    body: string
  }

  // v1.7 — every sentence comes from the owner-approved 1.7 truth sheet (T1–T8, release plan
  // item I, 2026-11-07), the same text as the store notes (iOS Distribution_v1.7.0_WhatsNew.md,
  // Android PLAY_WHATS_NEW_v1.7.0.md). The 1.6.1 cards live on Releases.
  const flagships: Flagship[] = [
    {
      // T1, T4 — iOS 063c501/65d5a60, Android 2ce6a73/efa80c8; the five ProStoreCopy features.
      icon: Crown,
      color: 'text-orange-600 dark:text-orange-400',
      title: 'Efficiver Pro (optional)',
      body: 'Optional Efficiver Pro adds score forecasts, driving patterns, idle-time insights, an annual savings projection and your full Year in Driving. Choose a monthly or annual subscription in the app. Drives, scores and voice coaching stay free.'
    },
    {
      // T2, T3 — ProSubscriptionView / ProSubscriptionScreen ("Payment Problem" / "On Hold").
      icon: Settings,
      color: 'text-blue-600 dark:text-blue-400',
      title: 'Efficiver Pro in Settings',
      body: 'Settings → Efficiver Pro shows your subscription and lets you manage it, request a refund or restore your purchases. If a renewal payment fails, it tells you there too.'
    },
    {
      // T5 — iOS b3f32d6, Android 8544f41 (ADR-199 D10, the Join-a-fleet consent).
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      title: 'Joining a fleet, made clear',
      body: 'Only drives on duty from start to end are shared with your fleet. Change duty part-way and that drive stays on your phone. If the app closes during an on-duty drive, the drive is sent the next time you open Efficiver, marked Partial.'
    }
  ]
</script>

<template>
  <section id="whats-new" class="container py-16 sm:py-20">
    <div class="text-center mb-12">
      <Badge variant="default" class="mb-4 text-sm py-1.5 px-4">NEW — v1.7</Badge>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">What's New in Efficiver 1.7</h2>

      <h3 class="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-6">
        Optional Efficiver Pro, a clear subscription page in Settings, and a fleet consent that says
        exactly which drives are shared.
      </h3>

      <div class="flex flex-col md:flex-row justify-center items-center gap-3">
        <!-- Dual-platform CTAs. The version was baked into the label ("Download v1.5
             on the App Store"), which goes stale every release AND named only one
             store. Both are now store-named and version-free; the Badge above still
             carries the version, in one place instead of three. -->
        <Button as-child class="w-5/6 md:w-auto font-bold group/arrow">
          <a :href="config.app.ios" target="_blank" rel="noopener">
            Download on the App Store
            <ArrowRight class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
          </a>
        </Button>
        <Button v-if="config.app.android" as-child class="w-5/6 md:w-auto font-bold group/arrow">
          <a :href="config.app.android" target="_blank" rel="noopener">
            Get it on Google Play
            <ArrowRight class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
          </a>
        </Button>
        <Button
          variant="secondary"
          class="w-5/6 md:w-auto font-bold"
          @click="emit('navigate', 'releases')"
        >
          Read full release notes
        </Button>
      </div>
    </div>

    <p class="max-w-3xl mx-auto mb-8 rounded-xl border p-5 text-sm text-muted-foreground">
      <strong class="text-foreground">Availability:</strong> drives, scores, voice coaching and
      fuel, cost and CO₂ estimates are free. Optional Efficiver Pro adds forecasts, patterns and
      savings projections in the app.
    </p>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <Card
        v-for="{ icon, color, title, body } in flagships"
        :key="title"
        class="h-full bg-background border-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow"
      >
        <CardHeader class="flex justify-center items-center pb-4">
          <div class="bg-primary/10 p-3 rounded-full ring-8 ring-primary/5 mb-3">
            <component :is="icon" :class="['size-7', color]" />
          </div>
          <CardTitle class="text-xl text-center">{{ title }}</CardTitle>
        </CardHeader>
        <CardContent class="text-muted-foreground text-center text-base leading-relaxed">
          {{ body }}
        </CardContent>
      </Card>
    </div>

    <details class="mx-auto max-w-2xl rounded-lg border bg-card p-5 group">
      <summary
        class="cursor-pointer font-semibold text-base list-none flex justify-between items-center"
      >
        <span>More improvements in 1.7</span>
        <ArrowRight class="size-4 transition-transform group-open:rotate-90" />
      </summary>
      <!-- The 1.6 and 1.6.1 improvements live on the Releases page's entries for those
           versions. T6 — iOS a14a7dd (B4), Android fa7df54 (C4); T7 — Android fa7df54 (C4);
           T8 — Android 6547768 (C3), said plainly per the owner (2026-11-07). -->
      <ul class="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
        <li>
          Changes you make in Settings → Savings → Trends now apply when you go back to Trends, with
          no Refresh needed.
        </li>
        <li>
          On Android, Minimum drive distance now applies to Trends and the savings projection.
        </li>
        <li>On Android, Trends settings are now part of Efficiver Pro, as on iPhone.</li>
      </ul>
    </details>
  </section>
</template>

<style scoped>
  /* Suppress Safari/iOS default disclosure triangle so our custom
     ArrowRight indicator is the only affordance. */
  summary::-webkit-details-marker {
    display: none;
  }
</style>
