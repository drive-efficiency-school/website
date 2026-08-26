<script setup lang="ts">
  import { config } from '@/lib/config'

  const emit = defineEmits(['navigate'])
</script>

<template>
  <div class="container mx-auto px-6 sm:px-8 py-12 sm:py-16">
    <h1 class="text-3xl font-bold mb-6 text-center">Accessibility at Efficiver</h1>

    <p class="text-center text-sm text-muted-foreground mb-10">
      Last updated: {{ config.lastUpdated.accessibility }}
    </p>

    <!-- Commitment -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Our commitment</h2>
      <div class="opacity-80">
        <p>
          Efficiver is built to work with the accessibility features you already rely on. We don't
          add a separate in-app accessibility mode — instead, the app respects your platform's
          settings (<em>iOS Settings → Accessibility</em> or
          <em>Android Settings → Accessibility</em>), so it adapts automatically the moment you
          change them.
        </p>
      </div>
    </section>

    <!-- Supported on iPhone -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Supported on iPhone</h2>
      <div class="opacity-80">
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>VoiceOver</strong> — supported throughout the app, plus spoken drive-lifecycle
            announcements. See Known limitations below for what is not covered yet
          </li>
          <li><strong>Voice Control</strong> — operate the app hands-free</li>
          <li><strong>Larger Text (Dynamic Type)</strong> — from the default size through AX5</li>
          <li><strong>Reduced Motion</strong> — animations are gated app-wide</li>
          <li>
            <strong>Differentiate Without Color</strong> — map markers carry shape and label, not
            color alone
          </li>
          <li>
            <strong>Sufficient Contrast</strong> and <strong>Dark Interface</strong> — full
            light/dark support with legible contrast
          </li>
        </ul>
      </div>
    </section>

    <!-- Supported on Android — every item below is verified against the shipping
         Android app. Deliberately NOT claimed here: Voice Control, Reduce
         Transparency and Bold Text are iOS platform features with no Android
         equivalent in the app, and Differentiate Without Color is implemented on
         iPhone only (see Known limitations). -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Supported on Android</h2>
      <div class="opacity-80">
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>TalkBack</strong> — every interactive control carries a spoken label, checked by
            an automated audit on each release
          </li>
          <li>
            <strong>Larger text</strong> — all text scales with your system font size; screens are
            tested at twice the default scale
          </li>
          <li><strong>Reduce motion</strong> — animations are gated app-wide</li>
          <li><strong>Dark theme</strong> — full light/dark support that follows your system</li>
          <li>
            <strong>Touch targets</strong> — interactive controls meet the 48dp minimum target size
          </li>
        </ul>
      </div>
    </section>

    <!-- No in-app toggle -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">No in-app toggle needed</h2>
      <div class="opacity-80">
        <p>
          On iPhone, Reduce Transparency falls Material backgrounds back to solid surfaces, and Bold
          Text bolds the app's text. These follow your system settings automatically — there's
          nothing to turn on inside Efficiver.
        </p>
      </div>
    </section>

    <!-- Known limitations -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Known limitations</h2>
      <div class="opacity-80">
        <ul class="list-disc pl-6 space-y-2">
          <li>
            On iPhone, with <strong>Bold Text</strong> enabled, the Efficiver brand title font does
            not bold (the rest of the app's text does). We're tracking this for a future release.
          </li>
          <li>
            <strong>Differentiate Without Color</strong> is implemented on iPhone but not yet on
            Android — some Android map markers are distinguished by colour alone. We're working on
            it.
          </li>
          <li>
            <strong>Voice Control</strong> (hands-free operation of the whole app) is an iPhone
            feature. Efficiver's own voice prompts work on both platforms, but Android has no
            equivalent full app-control mode.
          </li>
        </ul>
      </div>
    </section>

    <!-- Report a barrier -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Report an accessibility barrier</h2>
      <div class="opacity-80">
        <p>
          If something doesn't work with your assistive technology, we want to fix it. Email us at
          <a :href="'mailto:' + config.contact.email" class="text-primary hover:underline">{{
            config.contact.email
          }}</a
          ><template v-if="config.features.contact">
            or use the <strong>Accessibility Feedback</strong> option on our
            <a
              href="#contact"
              class="text-primary hover:underline"
              @click="emit('navigate', 'main')"
              >Contact</a
            >
            form</template
          >
          — we read every report.
        </p>
      </div>
    </section>
  </div>
</template>
