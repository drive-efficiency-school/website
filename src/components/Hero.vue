<script setup lang="ts">
  import { useColorMode } from '@vueuse/core'
  const mode = useColorMode()

  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { ArrowRight, Check } from 'lucide-vue-next'
  import ShareButtons from './ShareButtons.vue'
  import { config } from '@/lib/config'

  const darkImages = [
    'screen-dark_001.webp',
    'screen-dark_002.webp',
    'screen-dark_003.webp',
    'screen-dark_004.webp',
    'screen-dark_005.webp',
    'screen-dark_006.webp'
  ]

  const lightImages = [
    'screen-light_101.webp',
    'screen-light_102.webp',
    'screen-light_103.webp',
    'screen-light_104.webp',
    'screen-light_105.webp',
    'screen-light_106.webp'
  ]
</script>

<template>
  <section class="container">
    <div class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
      <div class="text-center space-y-8">
        <div class="flex flex-wrap justify-center gap-3">
          <Badge variant="outline" class="text-sm py-2">
            <span class="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span>Free Forever</span>
          </Badge>
          <Badge variant="secondary" class="text-sm py-2">
            <span class="mr-2">🚗</span>
            <span>Free for personal use</span>
          </Badge>
        </div>

        <p class="text-sm text-muted-foreground">
          Formerly known as Efficient Driver – now
          <span class="font-semibold text-primary">Efficiver</span>
        </p>

        <div class="max-w-screen-md mx-auto text-center">
          <div class="flex justify-center mb-8">
            <img
              src="/Logo-v1_Transparent.webp"
              alt="Efficiver logo - phone-based driving efficiency coach"
              width="784"
              height="615"
              fetchpriority="high"
              class="w-72 h-72 md:w-96 md:h-96 object-contain dark:shadow-none"
            />
          </div>
          <div class="space-y-4">
            <p class="text-2xl md:text-3xl font-semibold text-muted-foreground">
              The Offline Eco-Driving Assistant.
            </p>
          </div>
        </div>

        <p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
          Drive smarter and smoother with Efficiver – an offline, sensor-based app that helps you
          understand and improve your driving efficiency, with estimated fuel, cost and CO₂ impact
          for every drive.
        </p>

        <div class="flex flex-col md:flex-row justify-center items-center gap-4">
          <!-- Dual-platform CTAs (Play production access granted 2026-08-23). The
               generic "Download Now" named no store, which was fine while iOS was the
               only one; with both live the visitor needs to know which is which. The
               Android button stays gated on config.app.android so a cleared env var
               reverts the site to iOS-only rather than linking to nothing. -->
          <Button as-child class="w-5/6 md:w-auto font-bold group/arrow">
            <a :href="config.app.ios" target="_blank">
              Download on the App Store
              <ArrowRight
                class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform"
              />
            </a>
          </Button>

          <Button v-if="config.app.android" as-child class="w-5/6 md:w-auto font-bold group/arrow">
            <a :href="config.app.android" target="_blank">
              Get it on Google Play
              <ArrowRight
                class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform"
              />
            </a>
          </Button>

          <Button as-child variant="secondary" class="w-5/6 md:w-auto font-bold">
            <a href="#features">Learn More About Efficiver Features</a>
          </Button>
        </div>

        <div class="flex flex-wrap justify-center gap-6 mt-8 text-base font-medium">
          <span class="flex items-center"
            ><Check class="size-5 mr-2 text-primary" /> No Ads or Analytics</span
          >
          <span class="flex items-center"
            ><Check class="size-5 mr-2 text-primary" /> Background Ready</span
          >
          <span class="flex items-center"
            ><Check class="size-5 mr-2 text-primary" /> Biometric Secured</span
          >
        </div>

        <div class="flex justify-center mt-6">
          <ShareButtons />
        </div>
      </div>

      <div class="relative group mt-14">
        <!-- gradient shadow -->
        <div
          class="absolute -top-6 right-12 w-[90%] h-12 lg:h-[80%] bg-primary/50 blur-3xl rounded-full img-shadow-animation"
        ></div>

        <div
          class="grid grid-cols-3 gap-4 w-full max-w-[1200px] mx-auto rounded-lg relative border border-t-2 border-t-primary/30 img-border-animation"
        >
          <img
            v-for="(image, index) in mode === 'light' ? lightImages : darkImages"
            :key="index"
            :src="image"
            :alt="`Efficiver app screenshot showing ${index === 0 ? 'DriveButton interface' : index === 1 ? 'calibration screen' : index === 2 ? 'trip score card' : index === 3 ? 'estimated fuel and CO2 metrics' : index === 4 ? 'driving analytics' : 'eco-driving badges'}`"
            width="600"
            height="1304"
            loading="lazy"
            class="rounded-lg border border-primary/20 w-full h-auto"
          />
        </div>

        <!-- gradient effect img -->
        <div
          class="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .img-shadow-animation {
    animation-name: img-shadow-animation;
    animation-iteration-count: infinite;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-direction: alternate;
  }

  .img-border-animation {
    animation-name: img-border-animation;
    animation-iteration-count: infinite;
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-direction: alternate;
  }

  @keyframes img-shadow-animation {
    from {
      opacity: 0.5;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @keyframes img-border-animation {
    from {
      border-top-color: hsl(var(--primary) / 0.1);
    }

    to {
      border-top-color: hsl(var(--primary) / 0.6);
    }
  }
</style>
