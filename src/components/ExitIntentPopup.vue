<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Button } from '@/components/ui/button'
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
  } from '@/components/ui/sheet'
  import { X, Fuel, ArrowRight } from 'lucide-vue-next'

  import { config } from '@/lib/config'

  const isOpen = ref(false)
  const hasShown = ref(false)

  function handleMouseLeave(e: MouseEvent) {
    // Only trigger when mouse leaves through the top of the page (exit intent)
    if (e.clientY <= 0 && !hasShown.value) {
      // Check if user has dismissed before (stored in localStorage)
      const dismissed = localStorage.getItem('exitPopupDismissed')
      if (!dismissed) {
        isOpen.value = true
        hasShown.value = true
      }
    }
  }

  function dismissPopup() {
    isOpen.value = false
    localStorage.setItem('exitPopupDismissed', 'true')
  }

  function goToAppStore() {
    window.open(config.app.ios, '_blank')
    dismissPopup()
  }

  // Android launched 2026-08-23. This popup sent EVERY visitor to the App Store,
  // so an Android reader was pushed to a store they cannot install from.
  function goToPlayStore() {
    window.open(config.app.android, '_blank')
    dismissPopup()
  }

  onMounted(() => {
    // Only add listener on desktop (screen width > 768px)
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('mouseleave', handleMouseLeave)
  })
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent side="top" class="sm:max-w-md mx-auto">
      <SheetHeader>
        <div class="flex justify-center mb-4">
          <div class="bg-primary/20 p-4 rounded-full">
            <Fuel class="h-8 w-8 text-primary" />
          </div>
        </div>
        <SheetTitle class="text-center text-2xl">Wait — before you go 🚗</SheetTitle>
        <SheetDescription class="text-center text-base pt-2">
          Efficiver is free, works offline, and respects your privacy. Real-time driving feedback
          helps you adopt the techniques that save fuel.
        </SheetDescription>
      </SheetHeader>

      <div class="space-y-4 pt-4">
        <div class="bg-muted/50 rounded-lg p-4 text-center">
          <p class="text-xl font-bold text-primary">Save. Drive. Live.</p>
          <p class="text-sm text-muted-foreground mt-1">Free, offline, private.</p>
        </div>

        <div class="flex flex-col gap-3">
          <Button class="w-full font-bold group/arrow" size="lg" @click="goToAppStore">
            Download on the App Store
            <ArrowRight class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
          </Button>
          <Button
            v-if="config.app.android"
            class="w-full font-bold group/arrow"
            size="lg"
            @click="goToPlayStore"
          >
            Get it on Google Play
            <ArrowRight class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" class="w-full text-muted-foreground" @click="dismissPopup">
            <X class="h-4 w-4 mr-2" />
            No thanks
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
