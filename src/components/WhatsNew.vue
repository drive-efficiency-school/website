<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { ArrowRight, Watch, Banknote, Layers } from 'lucide-vue-next'
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])

  interface Flagship {
    icon: typeof Watch
    color: string
    title: string
    body: string
  }

  const flagships: Flagship[] = [
    {
      icon: Watch,
      color: 'text-blue-600 dark:text-blue-400',
      title: 'Apple Watch companion',
      body: 'Your drive, on your wrist. Live score, mistakes, and elapsed time at a glance — start or stop with a tap or Siri, with a haptic buzz on every harsh accel or brake. Weather and your drive advisory show before you start; your last drive’s score and savings stay on your watch face.'
    },
    {
      icon: Banknote,
      color: 'text-orange-600 dark:text-orange-400',
      title: 'More accurate savings',
      body: 'Fuel and CO₂ savings are now calculated from your actual speed, acceleration, and road grade — not just your Efficiency Score. Same private math, entirely on your device.'
    },
    {
      icon: Layers,
      color: 'text-green-600 dark:text-green-400',
      title: 'Your drive card, everywhere',
      body: 'The same live drive card now appears on your car’s CarPlay screen and your Apple Watch’s Smart Stack, not just the Lock Screen. Stop the drive from wherever you glance.'
    }
  ]
</script>

<template>
  <section id="whats-new" class="container py-24 sm:py-32">
    <div class="text-center mb-12">
      <Badge variant="default" class="mb-4 text-sm py-1.5 px-4">NEW — v1.4</Badge>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">What's New in Efficiver 1.4</h2>

      <h3 class="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-6">
        An Apple Watch companion, more accurate savings, and your drive card everywhere — now on the
        App Store.
      </h3>

      <div class="flex flex-col md:flex-row justify-center items-center gap-3">
        <Button as-child class="w-5/6 md:w-auto font-bold group/arrow">
          <a :href="config.app.ios" target="_blank" rel="noopener">
            Download v1.4 on the App Store
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
        <span>More improvements in v1.4</span>
        <ArrowRight class="size-4 transition-transform group-open:rotate-90" />
      </summary>
      <ul class="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
        <li>
          Gear Shift Speed rows in Settings now show the true range for each gear — no more
          overlapping numbers.
        </li>
        <li>
          Auto-Track Drive starts more reliably, with clearer handling of the Always-location
          permission it needs.
        </li>
        <li>
          Sharper, higher-contrast live drive card on CarPlay and your Apple Watch's Smart Stack.
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
