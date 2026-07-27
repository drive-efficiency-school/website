<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import { ArrowRight, BarChart3, Sparkles, Compass } from 'lucide-vue-next'
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])

  interface Flagship {
    icon: typeof BarChart3
    color: string
    title: string
    body: string
  }

  const flagships: Flagship[] = [
    {
      icon: BarChart3,
      color: 'text-blue-600 dark:text-blue-400',
      title: 'One chart, your whole story',
      body: 'Your recorded days and your forecast now live in a single interactive chart. Drag across it to scrub any day and read that exact score — past or predicted — with your average, your patterns, and the idle lever right below it.'
    },
    {
      icon: Sparkles,
      color: 'text-purple-600 dark:text-purple-400',
      title: 'AidOps Edge, on your phone',
      body: 'The on-device intelligence that narrates your Year Recap and Your Patterns now has a name and an honest status wherever it appears — plus a new Assistance page in Settings showing whether Apple Intelligence is active. Insights are generated on your phone; nothing leaves your device.'
    },
    {
      icon: Compass,
      color: 'text-green-600 dark:text-green-400',
      title: 'Insights that say where they go',
      body: 'The Savings and Efficiency cards now show their destination — Recap, Trends, or Set Up — so a tap is never a surprise. Deeper pages share one consistent title style throughout the app.'
    }
  ]
</script>

<template>
  <section id="whats-new" class="container py-24 sm:py-32">
    <div class="text-center mb-12">
      <Badge variant="default" class="mb-4 text-sm py-1.5 px-4">NEW — v1.5</Badge>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">What's New in Efficiver 1.5</h2>

      <h3 class="md:w-2/3 mx-auto text-xl text-center text-muted-foreground mb-6">
        A single scrubbable chart for your history and forecast, on-device AidOps Edge insights, and
        Insights cards that tell you where they lead.
      </h3>

      <div class="flex flex-col md:flex-row justify-center items-center gap-3">
        <Button as-child class="w-5/6 md:w-auto font-bold group/arrow">
          <a :href="config.app.ios" target="_blank" rel="noopener">
            Download v1.5 on the App Store
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
        <span>More improvements in v1.5</span>
        <ArrowRight class="size-4 transition-transform group-open:rotate-90" />
      </summary>
      <ul class="mt-4 space-y-2 text-muted-foreground list-disc list-inside">
        <li>
          Refreshing your forecast keeps the chart on screen — your recorded history stays visible
          while the new projection is calculated.
        </li>
        <li>
          Your Patterns tells you when it's being rewritten, instead of silently swapping the text
          once it lands.
        </li>
        <li>
          Joining a fleet now explains clearly when the fleet's subscription is what's blocking you.
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
