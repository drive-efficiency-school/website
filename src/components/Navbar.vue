<script lang="ts" setup>
  import { ref } from 'vue'

  import { useColorMode } from '@vueuse/core'
  // Respect the user's system color-scheme + their ToggleTheme choice.
  // `useColorMode` defaults to 'auto' which follows prefers-color-scheme;
  // ToggleTheme persists explicit user choice via localStorage.
  const mode = useColorMode()

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
  } from '@/components/ui/dropdown-menu'
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription
  } from '@/components/ui/sheet'

  import { Button } from '@/components/ui/button'
  import { Separator } from '@/components/ui/separator'

  import { Menu, ExternalLinkIcon, ChartSpline, ChevronDown } from 'lucide-vue-next'
  import ToggleTheme from './ToggleTheme.vue'

  const emit = defineEmits(['navigate'])

  interface RouteProps {
    href: string
    label: string
    // Navigation target for App.vue's `navigate()`. Omit for home-page
    // section anchors (defaults to 'main' — scroll on the home page);
    // set to a view name (e.g. 'help') for full-page views.
    nav?: string
  }

  interface FeatureProps {
    title: string
    description: string
  }

  const routeList: RouteProps[] = [
    {
      href: '#whats-new',
      label: "What's New"
    },
    {
      // Replaces the old Testimonials link (section unrendered → dead anchor).
      // Help is a full-page view, so it routes through App.vue's `navigate`,
      // not a home-page section scroll.
      href: '#help',
      label: 'Help & Support',
      nav: 'help'
    },
    // Contact link removed — the Contact section is gated off
    // (VITE_SHOW_CONTACT=false in .env), so #contact was a dead anchor.
    // Re-add here when the Contact section is re-enabled.
    {
      href: '#faq',
      label: 'FAQ'
    }
  ]

  const externalList: RouteProps[] = [
    {
      href: '#',
      label: 'Dashboard'
    }
  ]

  const featureList: FeatureProps[] = [
    {
      title: 'Live drive map',
      description: 'Apple Maps follow + per-waypoint event markers.'
    },
    {
      title: 'Accessibility-first',
      description: 'VoiceOver, Dynamic Type, Reduce Motion, and more.'
    },
    {
      title: 'iCloud sync',
      description: 'Sessions and Smart Detection model across devices.'
    }
  ]

  const isOpen = ref<boolean>(false)
</script>

<template>
  <header
    :class="{
      'shadow-light': mode === 'light',
      'shadow-dark': mode === 'dark',
      'w-[90%] md:w-[90%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 bg-card shadow-md': true
    }"
  >
    <a href="/#" class="font-bold text-lg flex items-center" @click="emit('navigate', 'main')">
      <img
        src="../icons/EDIcons_128x128_Transparent.webp"
        alt="Efficiver Logo - Free Driving Coach App"
        class="h-10 w-10 mr-2 bg-gradient-to via-primary rounded-lg size-9 border text-white"
      />
      <span style="font-family: 'Audiowide', cursive">Efficiver</span>
    </a>
    <!-- Mobile -->
    <div class="flex items-center md:hidden">
      <Sheet v-model:open="isOpen">
        <SheetTrigger as-child>
          <Menu class="cursor-pointer" @click="isOpen = true" />
        </SheetTrigger>

        <SheetContent
          side="left"
          class="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card"
        >
          <div>
            <SheetHeader class="mb-4 ml-4">
              <SheetTitle class="flex items-center">
                <a
                  href="/#"
                  class="font-bold text-lg flex items-center"
                  @click="emit('navigate', 'main')"
                >
                  <img
                    src="../icons/EDIcons_128x128_Transparent.webp"
                    alt="Logo"
                    class="h-10 w-10 mr-2 bg-gradient-to via-primary rounded-lg size-9 border text-white"
                  />
                  <span style="font-family: 'Audiowide', cursive">Efficiver</span>
                </a>
              </SheetTitle>
              <SheetDescription class="sr-only"> Mobile navigation menu </SheetDescription>
            </SheetHeader>

            <!-- Wrap every menu item in SheetClose so a tap on any
                 link auto-closes the mobile sheet (radix-vue idiom).
                 The @click handlers retain emit('navigate', ...) so
                 the parent route still updates. -->
            <div class="flex flex-col gap-2">
              <SheetClose as-child>
                <Button as-child variant="ghost" class="justify-start text-base">
                  <a href="#features" @click="emit('navigate', 'main')"> Features </a>
                </Button>
              </SheetClose>
              <SheetClose v-for="{ href, label, nav } in routeList" :key="label" as-child>
                <Button as-child variant="ghost" class="justify-start text-base">
                  <a :href="href" @click="emit('navigate', nav || 'main')">
                    {{ label }}
                  </a>
                </Button>
              </SheetClose>
              <Separator class="my-2" />
              <SheetClose v-for="{ href, label } in externalList" :key="label" as-child>
                <Button as-child variant="ghost" class="justify-start text-base">
                  <a :href="href" @click.prevent="emit('navigate', 'coming-soon')">
                    {{ label }}
                    <ExternalLinkIcon class="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </SheetClose>
            </div>
          </div>

          <SheetFooter class="flex-col sm:flex-col justify-start items-start">
            <Separator class="mb-2" />
            <ToggleTheme />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop -->
    <div class="hidden md:flex items-center gap-2 mx-auto">
      <!-- Features dropdown — click-triggered to match About (was
           hover-triggered NavigationMenu; converted to DropdownMenu
           for consistency). -->
      <DropdownMenu>
        <DropdownMenuTrigger
          class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-card px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
        >
          Features
          <ChevronDown
            class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" class="w-[512px] p-4">
          <div class="grid grid-cols-2 gap-5">
            <img
              src="../icons/EDIcons_256x256_Transparent.webp"
              alt="Efficiver Features"
              class="h-full w-full rounded-md object-cover"
            />
            <ul class="flex flex-col gap-2">
              <li
                v-for="{ title, description } in featureList"
                :key="title"
                class="rounded-md p-3 text-sm hover:bg-muted"
              >
                <a href="#features" @click="emit('navigate', 'main')">
                  <p class="mb-1 font-semibold leading-none text-foreground">
                    {{ title }}
                  </p>
                  <p class="line-clamp-2 text-muted-foreground">
                    {{ description }}
                  </p>
                </a>
              </li>
            </ul>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Plain route links (no dropdown, no hover-trigger). -->
      <Button
        v-for="{ href, label, nav } in routeList"
        :key="label"
        as-child
        variant="ghost"
        class="justify-start text-base"
      >
        <a :href="href" @click="emit('navigate', nav || 'main')">
          {{ label }}
        </a>
      </Button>
    </div>

    <div class="hidden md:flex">
      <ToggleTheme />
      <Button as-child size="sm" variant="ghost" aria-label="Coming soon...">
        <a aria-label="Coming soon..." href="#" @click.prevent="emit('navigate', 'coming-soon')">
          <ChartSpline class="size-5" />
        </a>
      </Button>
    </div>
  </header>
</template>

<style scoped>
  .shadow-light {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
  }
  .shadow-dark {
    box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.141);
  }
</style>
