<script setup lang="ts">
  import { defineAsyncComponent, ref, onMounted } from 'vue'
  import { config } from '@/lib/config'

  // Critical above-the-fold components - load immediately
  import Navbar from './components/Navbar.vue'
  import Hero from './components/Hero.vue'
  import Footer from './components/Footer.vue'

  // Below-the-fold components - lazy load
  const WhatsNew = defineAsyncComponent(() => import('./components/WhatsNew.vue'))
  const Features = defineAsyncComponent(() => import('./components/Features.vue'))
  const HowItWorks = defineAsyncComponent(() => import('./components/HowItWorks.vue'))
  const Comparison = defineAsyncComponent(() => import('./components/Comparison.vue'))
  // Testimonials.vue DELETED 2026-07-29 (was unrendered since
  // WEBSITE_AUDIT_V12 I8). The template-default placeholder reviews and
  // shadcn-stock avatars were an FTC compliance risk, and one fabricated
  // "Fleet Manager" review claiming a 10% emissions cut sat next to a real
  // fleet product. If real App Store / Play review excerpts are ever
  // shown, build it fresh from attributed quotes.
  //
  // Team.vue also removed from render per user 2026-05-25 — social
  // handles haven't been migrated to the `efficiver-*` namespace yet
  // (see WEBSITE_AUDIT_V12 I10). Re-introduce once handles are live.
  const Pricing = defineAsyncComponent(() => import('./components/Pricing.vue'))
  const FleetCallout = defineAsyncComponent(() => import('./components/FleetCallout.vue'))
  // Community.vue removed from render 2026-06-23 — its only CTA was a disabled
  // "Follow Us on Social Media" button under a Discord icon, but no social /
  // community presence is configured (config.socials are empty). Re-introduce
  // with a working link once a real community (e.g. Discord) exists.
  const NewsletterSignup = defineAsyncComponent(() => import('./components/NewsletterSignup.vue'))
  const FAQ = defineAsyncComponent(() => import('./components/FAQ.vue'))
  const Contact = defineAsyncComponent(() => import('./components/Contact.vue'))
  const BackToTop = defineAsyncComponent(() => import('./components/BackToTop.vue'))
  const ExitIntentPopup = defineAsyncComponent(() => import('./components/ExitIntentPopup.vue'))

  // Conditional pages - only load when needed
  const Investors = defineAsyncComponent(() => import('./components/Investors.vue'))
  const TermsOfUse = defineAsyncComponent(() => import('./components/TermsOfUse.vue'))
  const PrivacyPolicy = defineAsyncComponent(() => import('./components/PrivacyPolicy.vue'))
  const Accessibility = defineAsyncComponent(() => import('./components/Accessibility.vue'))
  const Help = defineAsyncComponent(() => import('./components/Help.vue'))
  const ComingSoon = defineAsyncComponent(() => import('./components/ComingSoon.vue'))
  const Releases = defineAsyncComponent(() => import('./components/Releases.vue'))

  const showInvestors = ref(false)
  const showTerms = ref(false)
  const showPrivacy = ref(false)
  const showAccessibility = ref(false)
  const showHelp = ref(false)
  const showComingSoon = ref(false)
  const showReleases = ref(false)

  function navigate(
    target:
      | 'main'
      | 'investors'
      | 'terms'
      | 'privacy'
      | 'accessibility'
      | 'help'
      | 'coming-soon'
      | 'releases'
  ) {
    showInvestors.value = target === 'investors'
    showTerms.value = target === 'terms'
    showPrivacy.value = target === 'privacy'
    showAccessibility.value = target === 'accessibility'
    showHelp.value = target === 'help'
    showComingSoon.value = target === 'coming-soon'
    showReleases.value = target === 'releases'
    window.location.hash = target === 'main' ? '' : target
    if (
      showInvestors.value ||
      showTerms.value ||
      showPrivacy.value ||
      showAccessibility.value ||
      showHelp.value ||
      showComingSoon.value ||
      showReleases.value
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Handle initial and dynamic hash changes
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '')
    showInvestors.value = hash === 'investors'
    showTerms.value = hash === 'terms'
    showPrivacy.value = hash === 'privacy'
    showAccessibility.value = hash === 'accessibility'
    showHelp.value = hash === 'help'
    showComingSoon.value = hash === 'coming-soon'
    showReleases.value = hash === 'releases'
    if (
      showInvestors.value ||
      showTerms.value ||
      showPrivacy.value ||
      showAccessibility.value ||
      showHelp.value ||
      showComingSoon.value ||
      showReleases.value
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  onMounted(() => {
    handleHashChange() // Check initial hash on page load
    window.addEventListener('hashchange', handleHashChange)
  })
</script>

<template>
  <Navbar @navigate="navigate" />
  <div
    v-if="
      !showInvestors &&
      !showTerms &&
      !showPrivacy &&
      !showAccessibility &&
      !showHelp &&
      !showComingSoon &&
      !showReleases
    "
  >
    <Hero />
    <WhatsNew @navigate="navigate" />
    <Features />
    <Comparison />
    <HowItWorks />
    <Pricing />
    <FleetCallout />
    <section v-if="config.features.newsletter" id="newsletter" class="container py-24 sm:py-32">
      <div class="mx-auto max-w-2xl text-center">
        <NewsletterSignup />
      </div>
    </section>
    <Contact v-if="config.features.contact" />
    <FAQ />
  </div>
  <Investors v-if="showInvestors" />
  <TermsOfUse v-else-if="showTerms" />
  <PrivacyPolicy v-else-if="showPrivacy" />
  <Accessibility v-else-if="showAccessibility" @navigate="navigate" />
  <Help v-else-if="showHelp" />
  <ComingSoon v-else-if="showComingSoon" />
  <Releases v-else-if="showReleases" @navigate="navigate" />
  <Footer @navigate="navigate" />
  <BackToTop />
  <ExitIntentPopup />
</template>
