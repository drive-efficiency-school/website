<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { ArrowRight, CircleStop, Banknote, Users } from 'lucide-vue-next'
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])

  interface Flagship {
    icon: typeof CircleStop
    color: string
    title: string
    body: string
  }

  // v1.6 — every sentence comes from the owner-approved truth sheet
  // (docs/Efficiver_v1.6_Release_Tracker.md, ADR-194..199). The v1.5 cards live on Releases.
  const flagships: Flagship[] = [
    {
      icon: CircleStop,
      color: 'text-blue-600 dark:text-blue-400',
      title: 'Every drive tells the truth',
      body: 'If your phone closes the app before a drive ends, the drive is kept up to its last automatic save and marked Interrupted — it is never shown as a normal finished drive. Each drive also records how it started and ended.'
    },
    {
      icon: Banknote,
      color: 'text-orange-600 dark:text-orange-400',
      title: 'Savings that stay put',
      body: 'Each finished drive keeps the fuel price and typical consumption that were set when it ended, so editing today’s price no longer changes past savings. Savings in per-gallon regions, such as the US, were shown too high before this release; they are now correct.'
    },
    {
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      title: 'Fleet: on duty from start to end',
      body: 'A drive reaches your fleet only if it was on duty from start to end. An on-duty drive interrupted mid-way is now sent the next time you open the app, marked Partial, and a short stop while on duty starts a new drive — so every leg reaches the fleet.'
    }
  ]
</script>

<template>
  <section id="whats-new" class="container py-16 sm:py-20">
    <div class="text-center mb-12">
      <Badge variant="default" class="mb-4 text-sm py-1.5 px-4">NEW — v1.6</Badge>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">What's New in Efficiver 1.6</h2>

      <h3 class="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-6">
        Drives that say how they ended, savings that keep the price set when each drive ended, and
        fleet drives that arrive complete — or honestly marked Partial.
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
      <strong class="text-foreground">Availability:</strong> recorded scores and core coaching are
      free. Forecasts, deeper patterns and savings projections are planned for Efficiver Pro, which
      is coming soon. Screens and release notes may include these future Pro features.
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
        <span>More improvements in v1.6</span>
        <ArrowRight class="size-4 transition-transform group-open:rotate-90" />
      </summary>
      <ul class="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
        <!-- D4 (owner 2026-10-17, truth sheet line 4; iOS b32c1ad): the live score's session
             clock barely advanced, so iPhone scores barely reacted to mistakes. No migration —
             saved scores stay as they were. -->
        <li>
          iPhone scores were too generous before 1.6: they barely reacted to driving mistakes, and
          idling pushed them up. Drives with mistakes now score lower and idling no longer raises
          the score, the same as on Android. Past drives keep their saved score.
        </li>
        <li>
          Route maps draw only trusted GPS positions — a gap between dots means GPS couldn't be
          trusted there.
        </li>
        <li>
          The Efficiency Score no longer counts air-conditioning or tyre-pressure inputs the phone
          can't measure. That change alone moves a score by under one point.
        </li>
        <!-- Truth sheet line 7 (owner-approved 2026-10-17; iOS 745fbf9, 1484736). -->
        <li>
          On iPhone, your music or podcast returns to full volume after Efficiver's last voice
          prompt — also when prompts overlap or a phone call interrupts one.
        </li>
        <li>
          On iPhone, the CarPlay start screen no longer flickers. The Live Activity card on the
          CarPlay Home Screen and the Apple Watch Smart Stack shows your driving status and score;
          it has no Stop button, because Live Activity buttons don't work in CarPlay. Stop from the
          Efficiver CarPlay screen, the Lock Screen, the Dynamic Island or Siri.
        </li>
        <li>
          The live idle count now adds up every 30-second idle period across the whole drive,
          instead of restarting at each stop.
        </li>
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
