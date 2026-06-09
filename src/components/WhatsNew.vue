<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { ArrowRight, Car, Banknote, Sparkles } from 'lucide-vue-next'
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])

  interface Flagship {
    icon: typeof Car
    color: string
    title: string
    body: string
  }

  const flagships: Flagship[] = [
    {
      icon: Car,
      color: 'text-blue-600 dark:text-blue-400',
      title: 'CarPlay support',
      body: 'Drive with your phone in your pocket. Efficiver appears as a Driving Task on your car’s CarPlay screen — tap Drive to start tracking, see your live score, distance, and time on the head unit, tap Stop to save. Voice prompts route through your car’s audio. Works wired or wireless.'
    },
    {
      icon: Banknote,
      color: 'text-orange-600 dark:text-orange-400',
      title: 'Annual savings projection',
      body: 'See how much you’ll save this year by driving efficiently. Set up Wallet Watch with your fuel cost and currency, and the Sessions screen shows a projected annual savings number — updated as you drive.'
    },
    {
      icon: Sparkles,
      color: 'text-green-600 dark:text-green-400',
      title: 'Year Recap',
      body: 'A shareable card with your year’s driving stats — total kilometres, average efficiency, top drives, and savings. Surfaced from the top of the Sessions screen, ready to share.'
    }
  ]
</script>

<template>
  <section id="whats-new" class="container py-24 sm:py-32">
    <div class="text-center mb-12">
      <Badge variant="default" class="mb-4 text-sm py-1.5 px-4">NEW — v1.3</Badge>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">What's New in Efficiver 1.3</h2>

      <h3 class="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-6">
        CarPlay support, an annual savings projection, and a shareable Year Recap — now on the App
        Store.
      </h3>

      <div class="flex flex-col md:flex-row justify-center items-center gap-3">
        <Button as-child class="w-5/6 md:w-auto font-bold group/arrow">
          <a :href="config.app.ios" target="_blank" rel="noopener">
            Download v1.3 on the App Store
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
        <span>More improvements in v1.3</span>
        <ArrowRight class="size-4 transition-transform group-open:rotate-90" />
      </summary>
      <ul class="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
        <li>
          Smart Forecast on Trends — see where your efficiency is heading and use the "cut idle by
          X%" lever to simulate the impact of reducing idle time.
        </li>
        <li>Pattern Insights card surfaces what's actually driving your scores day-to-day.</li>
        <li>Anomaly Detection flags drives that fall outside your usual pattern.</li>
        <li>
          Sessions screen restructured with side-by-side Trends and Savings tiles plus the Year
          Recap pill at the top.
        </li>
        <li>
          Live Activity Stop button is now reliable even after the app has been closed — uses
          Apple's documented orphan-activity recovery pattern.
        </li>
        <li>
          CarPlay voice prompts come through at normal volume regardless of whether the head unit is
          on FM or playing music.
        </li>
        <li>Welcome onboarding text scales cleanly at the largest Dynamic Type sizes.</li>
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
