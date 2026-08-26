<script setup lang="ts">
  import Marquee from '@selemondev/vue3-marquee'
  // Not '.../dist/style.css' - the package's own exports map only declares
  // './style.css'. The old path resolved under Vite's dev-server (browser
  // resolution is more permissive) but fails outright under vitest's
  // Node-ESM-strict transform, which is what surfaced it.
  import '@selemondev/vue3-marquee/style.css'

  import { Car, Zap, Leaf, Battery, Smartphone, Globe, Bike } from 'lucide-vue-next'

  interface sponsorsProps {
    icon: string
    name: string
  }

  const sponsors: sponsorsProps[] = [
    {
      icon: 'car',
      name: 'Tata Motors'
    },
    {
      icon: 'zap',
      name: 'Mahindra Electric'
    },
    {
      icon: 'leaf',
      name: 'Ola Electric'
    },
    {
      icon: 'battery',
      name: 'Ather Energy'
    },
    {
      icon: 'smartphone',
      name: 'BluSmart'
    },
    {
      icon: 'globe',
      name: 'Yulu'
    },
    {
      icon: 'bike',
      name: 'Hero Electric'
    },
    {
      icon: 'bike',
      name: 'TVS Motor'
    },
    {
      icon: 'bike',
      name: 'Bajaj Auto'
    },
    {
      icon: 'zap',
      name: 'Revolt Motors'
    }
  ]

  const iconMap: Record<
    string,
    | typeof Car
    | typeof Zap
    | typeof Leaf
    | typeof Battery
    | typeof Smartphone
    | typeof Globe
    | typeof Bike
  > = {
    car: Car,
    zap: Zap,
    leaf: Leaf,
    battery: Battery,
    smartphone: Smartphone,
    globe: Globe,
    bike: Bike
  }
</script>

<template>
  <section id="sponsors" class="max-w-[75%] mx-auto pb-24 sm:pb-32">
    <h2 class="text-lg md:text-xl text-center mb-6">Our Eco Partners</h2>

    <div class="mx-auto">
      <Marquee class="gap-[3rem]" :pause-on-hover="true" :fade="true" inner-class-name="gap-[3rem]">
        <div v-for="{ icon, name } in sponsors" :key="name">
          <div class="flex items-center text-xl md:text-2xl font-medium">
            <component :is="iconMap[icon]" class="mr-2" stroke-width="3" />
            {{ name }}
          </div>
        </div>
      </Marquee>
    </div>
  </section>
</template>
