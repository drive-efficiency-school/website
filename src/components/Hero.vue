<script setup lang="ts">
  import { useColorMode } from '@vueuse/core'
  import { Button } from '@/components/ui/button'
  import { ArrowRight, Check } from 'lucide-vue-next'
  import { config } from '@/lib/config'
  const mode = useColorMode()
</script>
<template>
  <section id="flagship" class="container py-14 lg:py-20">
    <div class="grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-12 lg:gap-16">
      <div class="max-w-2xl">
        <p class="text-primary text-sm font-semibold uppercase tracking-widest mb-6">
          Your personal driving coach
        </p>
        <h1 class="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08]">
          Understand your driving.<br /><span class="text-primary">Improve your next trip.</span>
        </h1>
        <p class="text-lg sm:text-xl text-muted-foreground leading-relaxed mt-7 max-w-xl">
          Efficiver turns your phone into a coach for smoother driving. Get a trip score, practical
          feedback and estimated fuel or energy costs. No extra vehicle hardware needed.
        </p>
        <div id="download" class="flex flex-col sm:flex-row flex-wrap gap-3 mt-8">
          <Button as-child size="lg" class="font-semibold"
            ><a :href="config.app.ios" target="_blank" rel="noopener"
              >Download on the App Store <ArrowRight class="size-4 ml-2" /></a
          ></Button>
          <Button
            v-if="config.app.android"
            as-child
            size="lg"
            variant="outline"
            class="font-semibold"
            ><a :href="config.app.android" target="_blank" rel="noopener"
              >Get it on Google Play</a
            ></Button
          >
        </div>
        <p class="mt-4 text-sm text-muted-foreground">
          Free for personal use. Deeper Pro insights are coming soon.
        </p>
        <!-- Next to the Play button, where people decide: the phone app is arm64-only. -->
        <p v-if="config.app.android" class="mt-1 text-sm text-muted-foreground">
          Android: needs Android 12 or later, 64-bit.
        </p>
        <div class="flex flex-wrap gap-x-5 gap-y-3 mt-8 text-sm">
          <span
            v-for="benefit in [
              'Offline trip recording',
              'No OBD dongle',
              'No ads. No ad tracking.'
            ]"
            :key="benefit"
            class="flex items-center gap-2"
            ><Check class="size-4 text-primary" />{{ benefit }}</span
          >
        </div>
        <div class="flex flex-wrap gap-6 mt-8 text-sm font-semibold">
          <a href="#first-drive" class="underline underline-offset-4"
            >Explore your driving feedback ↓</a
          ><a href="#compatibility" class="text-muted-foreground underline underline-offset-4"
            >Check your phone</a
          >
        </div>
      </div>
      <figure
        class="relative rounded-[2rem] border bg-muted/40 p-6 sm:p-8 flex flex-col items-center"
      >
        <div class="flex items-center justify-between w-full gap-4 mb-6">
          <img
            src="/Logo-v1_Transparent.webp"
            alt="Efficiver logo - phone-based driving efficiency coach"
            width="784"
            height="615"
            class="w-20 h-16 object-contain"
          />
          <p class="text-sm text-muted-foreground text-right">
            After your drive.<br /><strong class="text-foreground">A useful review.</strong>
          </p>
        </div>
        <img
          :src="mode === 'light' ? 'screen-light_104.webp' : 'screen-dark_004.webp'"
          alt="Efficiver trip review showing estimated fuel and CO2 metrics, acceleration and braking events"
          width="1206"
          height="2622"
          fetchpriority="high"
          class="w-56 sm:w-60 rounded-[2rem] border shadow-xl"
        />
        <figcaption class="text-xs text-muted-foreground text-center mt-5">
          iPhone trip review shown. Figures are illustrative estimates, not measured savings. Full
          estimates are planned for Pro.
        </figcaption>
      </figure>
    </div>
  </section>
</template>
