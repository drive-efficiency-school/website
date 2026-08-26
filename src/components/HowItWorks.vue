<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import DownloadPhone from '@/components/icons/DownloadPhone.vue'
  import DriveCar from '@/components/icons/DriveCar.vue'
  import AnalyzeChart from '@/components/icons/AnalyzeChart.vue'
  import ImproveBadge from '@/components/icons/ImproveBadge.vue'

  interface HowItWorksProps {
    badgeTitle: string
    title: string
    description: string
    alt?: string
  }

  const HowItWorksList: HowItWorksProps[] = [
    {
      badgeTitle: 'Download',
      title: 'Download & Auto-Calibrate',
      description:
        "Install Efficiver and run Smart Detection's calibration once while parked — about two minutes, a minute with the engine running and a minute with it off. It learns to tell your engine running from stopped. No OBD dongle, no rev-range setup.",
      alt: 'Download the Efficiver app on mobile'
    },
    {
      badgeTitle: 'Drive',
      title: 'Drive & Track – Offline',
      description:
        "Track your driving efficiency offline using only your phone's sensors. Keep Efficiver visible while you drive; logging continues when you switch to Maps or Music.",
      alt: 'Drive and track with your phone in the car'
    },
    {
      badgeTitle: 'Analyze',
      title: 'Analyze and Save – Fuel & CO2 Insights',
      description:
        'Get detailed trip metrics to quantify fuel savings and reduce CO2 emissions effortlessly.',
      alt: 'Trip analytics and CO2/fuel insights'
    },
    {
      badgeTitle: 'Improve',
      title: 'Improve – Personalized Tips',
      description:
        'Receive offline coaching tips to drive more smoothly and efficiently with every session.',
      alt: 'Improve driving with personalized tips'
    }
  ]
</script>

<template>
  <section id="how-it-works" class="container py-24 sm:py-32">
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">How It Works</h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold">
        Get Started with Efficiver in 4 Easy Steps
      </h2>
    </div>

    <div class="lg:w-[80%] mx-auto relative">
      <div
        v-for="({ badgeTitle, title, description, alt }, index) in HowItWorksList"
        :key="title"
        :class="['flex mb-8 items-center', { ' flex-row-reverse': index % 2 !== 0 }]"
      >
        <Card class="h-full bg-transparent border-0 shadow-none">
          <CardHeader>
            <div class="pb-4">
              <Badge>{{ badgeTitle }}</Badge>
            </div>

            <CardTitle>
              {{ title }}
            </CardTitle>
          </CardHeader>

          <CardContent class="text-muted-foreground w-[80%]">
            {{ description }}
          </CardContent>
        </Card>

        <div class="w-[105px] md:w-[175px] lg:w-[210px] mx-auto -scale-x-100 text-primary">
          <component
            :is="
              index === 0
                ? DownloadPhone
                : index === 1
                  ? DriveCar
                  : index === 2
                    ? AnalyzeChart
                    : ImproveBadge
            "
            :aria-label="alt || title"
          />
        </div>
        <div
          :class="[
            '-z-10 absolute right-0 w-44 h-72  lg:w-64 lg:h-80 rounded-full bg-primary/15 dark:bg-primary/10 blur-3xl',
            {
              'left-0': index % 2 !== 0
            }
          ]"
        ></div>
      </div>
    </div>
  </section>
</template>
