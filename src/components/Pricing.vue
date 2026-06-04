<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
  } from '@/components/ui/card'
  import { config } from '@/lib/config'
  import { Check } from 'lucide-vue-next'

  enum PopularPlan {
    NO = 0,
    YES = 1
  }

  interface PlanProps {
    id: string
    title: string
    popular: PopularPlan
    description: string
    buttonText: string
    benefitList: string[]
  }

  const plans: PlanProps[] = [
    {
      id: 'smart_driver',
      title: 'Smart Driver',
      popular: 0,
      description: 'Ideal for learners – detailed metrics, coaching.',
      buttonText: 'Get Started',
      benefitList: [
        'Unlimited trips',
        'Detailed trip metrics',
        'Fuel/CO2 savings estimate',
        'Offline driving tips',
        'Custom profiles'
      ]
    },
    {
      id: 'eco_master',
      title: 'Eco Master',
      popular: 1,
      description: 'Best for eco-drivers – analytics, gamified fun.',
      buttonText: 'Get Started',
      benefitList: [
        'All Smart Driver features',
        'Idle detection',
        'Gamified badges',
        'Advanced offline analytics',
        'Auto-Start Mode'
      ]
    },
    {
      id: 'enterprise',
      title: 'Enterprise',
      popular: 0,
      description: 'For businesses – scalable, robust solution.',
      buttonText: 'Contact Us',
      benefitList: [
        'Multi-user support',
        'Custom reports',
        'Advanced analytics',
        'Dedicated support',
        '30-day free trial'
      ]
    }
  ]

  function getPriceLabel(id: string): string {
    if (id === 'smart_driver') {
      return 'Free Forever'
    }
    if (id === 'eco_master') {
      return config.pricing.launchOffer ? 'Free (Launch Offer)' : 'In-App Purchase'
    }
    return 'Custom Pricing'
  }

  function getPriceSubtext(id: string): string {
    if (id === 'smart_driver') return 'Basic Features'
    if (id === 'eco_master') return 'Full Access'
    return '/user/year'
  }
</script>

<template>
  <section id="pricing" class="container py-24 sm:py-32">
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">Pricing</h2>

    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
      Affordable Plans for Every Driver
    </h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
      Unlock the full potential of Efficiver with our flexible plans. Start free, upgrade in the
      app, or go Enterprise.
    </h3>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
      <Card
        v-for="{ id, title, popular, description, buttonText, benefitList } in plans"
        :key="title"
        :class="{
          'drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]':
            popular === PopularPlan?.YES,
          'opacity-75': popular === PopularPlan?.NO
        }"
      >
        <CardHeader class="relative">
          <CardTitle class="pb-2">
            {{ title }}
          </CardTitle>
          <span
            v-if="id === 'eco_master' && config.pricing.launchOffer"
            class="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded"
          >
            Launch Offer
          </span>

          <CardDescription class="pb-4">{{ description }}</CardDescription>

          <div>
            <span class="text-2xl font-bold">{{ getPriceLabel(id) }}</span>
            <span class="text-muted-foreground ml-1 text-sm"> {{ getPriceSubtext(id) }}</span>
          </div>
        </CardHeader>

        <CardContent class="flex">
          <div class="space-y-4">
            <span v-for="benefit in benefitList" :key="benefit" class="flex">
              <Check class="text-primary mr-2" />
              <h3>{{ benefit }}</h3>
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <Button :variant="popular === PopularPlan?.NO ? 'secondary' : 'default'" class="w-full">
            {{ buttonText }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>
