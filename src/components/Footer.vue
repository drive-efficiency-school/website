<script setup lang="ts">
  import { ref } from 'vue'
  import Separator from './ui/separator/Separator.vue'
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])

  const version = 'v1.3.22 (26072703)'
  const copied = ref(false)
  const currentYear = new Date().getFullYear()

  function copyVersion() {
    navigator.clipboard.writeText(version)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
</script>

<template>
  <footer id="footer" class="container py-24 pb-16 sm:py-32 sm:pb-24">
    <div class="p-10 bg-muted/50 dark:bg-card border rounded-2xl">
      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div class="col-span-full xl:col-span-2">
          <a href="/#" class="flex font-bold items-center" @click="emit('navigate', 'main')">
            <img
              src="../icons/EDIcons_128x128_Transparent.webp"
              alt="Efficiver Logo - Free Driving Coach App"
              class="h-10 w-10 mr-2 bg-gradient-to via-primary rounded-lg size-9 border text-white"
            />
            <h3 class="text-2xl">Efficiver</h3>
          </a>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Contact</h3>
          <div>
            <a :href="'mailto:' + config.contact.email" class="opacity-60 hover:opacity-100">
              Email
            </a>
          </div>
          <div v-if="config.contact.phone">
            <a :href="'tel:' + config.contact.phone" class="opacity-60 hover:opacity-100">
              Phone
            </a>
          </div>
          <div>
            <a :href="config.contact.website" class="opacity-60 hover:opacity-100"> Website </a>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Platforms</h3>
          <div>
            <a href="/#" class="opacity-60 hover:opacity-100" @click="emit('navigate', 'main')">
              iOS
            </a>
          </div>
          <div>
            <a href="/#" class="opacity-60 hover:opacity-100" @click="emit('navigate', 'main')">
              CarPlay
            </a>
          </div>
          <div>
            <a href="/#" class="opacity-60 hover:opacity-100" @click="emit('navigate', 'main')">
              Apple Watch
            </a>
          </div>
          <div>
            <a
              v-if="config.app.android"
              :href="config.app.android"
              target="_blank"
              class="opacity-60 hover:opacity-100"
            >
              Android
            </a>
            <span v-else class="text-muted-foreground cursor-not-allowed opacity-60">
              Android <span class="text-[10px]">(soon)</span>
            </span>
          </div>
          <!-- Android Auto entry removed 2026-07-27: the Android app no longer ships an
               Android Auto surface (Google Play ruled a phone-sensor driving dashboard
               outside the Car App Library's permitted categories), so advertising it as
               "(soon)" would be untrue. CarPlay above is unaffected and stays. -->
          <div>
            <a
              v-if="config.app.watch.android"
              :href="config.app.watch.android"
              target="_blank"
              class="opacity-60 hover:opacity-100"
            >
              Wear OS
            </a>
            <span v-else class="text-muted-foreground cursor-not-allowed opacity-60">
              Wear OS <span class="text-[10px]">(soon)</span>
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Help</h3>
          <div v-if="config.features.contact">
            <a
              href="#contact"
              class="opacity-60 hover:opacity-100"
              @click="emit('navigate', 'main')"
            >
              Contact Us
            </a>
          </div>
          <div>
            <a href="#faq" class="opacity-60 hover:opacity-100" @click="emit('navigate', 'main')">
              FAQ
            </a>
          </div>
          <div v-if="config.features.newsletter">
            <a
              href="#newsletter"
              class="opacity-60 hover:opacity-100"
              @click="emit('navigate', 'main')"
            >
              Newsletter
            </a>
          </div>
          <div v-if="config.features.contact">
            <a
              href="#contact"
              class="opacity-60 hover:opacity-100"
              @click="emit('navigate', 'main')"
            >
              Feedback
            </a>
          </div>
          <div>
            <a
              href="#investors"
              class="opacity-60 hover:opacity-100 cursor-pointer"
              @click="emit('navigate', 'investors')"
            >
              Investors
            </a>
          </div>
          <div>
            <a
              href="#terms"
              class="opacity-60 hover:opacity-100 cursor-pointer"
              @click="emit('navigate', 'terms')"
            >
              Terms of Use
            </a>
          </div>
          <div>
            <a
              href="#privacy"
              class="opacity-60 hover:opacity-100 cursor-pointer"
              @click="emit('navigate', 'privacy')"
            >
              Privacy Policy
            </a>
          </div>
          <div>
            <a
              href="#accessibility"
              class="opacity-60 hover:opacity-100 cursor-pointer"
              @click="emit('navigate', 'accessibility')"
            >
              Accessibility
            </a>
          </div>
          <div>
            <a
              href="#help"
              class="opacity-60 hover:opacity-100 cursor-pointer"
              @click="emit('navigate', 'help')"
            >
              Help & Support
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Socials</h3>
          <div v-if="config.socials.instagram">
            <a
              :href="config.socials.instagram"
              target="_blank"
              class="opacity-60 hover:opacity-100"
            >
              Instagram
            </a>
          </div>

          <div v-if="config.socials.tiktok">
            <a :href="config.socials.tiktok" target="_blank" class="opacity-60 hover:opacity-100">
              TikTok
            </a>
          </div>

          <div v-if="config.socials.linkedin">
            <a :href="config.socials.linkedin" target="_blank" class="opacity-60 hover:opacity-100">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <Separator class="my-6" />
      <section class="flex flex-col sm:flex-row items-center justify-between gap-2">
        <h3>
          © 2015–{{ currentYear }}
          <a
            target="_blank"
            :href="config.contact.website"
            class="text-primary transition-all border-primary hover:border-b-2"
          >
            Efficiver
          </a>
          <span class="hidden sm:inline"> • All rights reserved</span>
        </h3>
        <button
          class="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          :title="copied ? 'Copied!' : 'Click to copy version'"
          @click="copyVersion"
        >
          {{ copied ? 'Copied!' : version }}
        </button>
      </section>
    </div>
  </footer>
</template>
