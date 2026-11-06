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
    // Only the Fleet card renders this literally ("Talk to us"). Efficiver
    // shows its own store-link text and Pro echoes its own price label -
    // both computed, not stored, so there is no second copy of the text to
    // drift out of sync with what the button actually does.
    buttonText?: string
    benefitList: string[]
  }

  // Tier names + boundaries are the naming SOT in
  // docs/Pricing/..._Gross_Pricing_Brief_v2.0.md §2 (owner-locked 2026-07-09):
  // Efficiver (free) · Efficiver Pro · Efficiver Fleet. §2.1: "Basic" and
  // "Full App" are CODE-level terms only and must never be customer-facing.
  //
  // Benefit lists are the §5 Tier-1-vs-Tier-2 feature matrix verbatim in
  // substance — NOT invented. Notably absent from Pro on purpose: idle
  // detection and Auto-Start, which are free in both apps
  // (DrivingPreferences.enableIdleMonitoring / DrivingDetector) and appear in
  // no §5 Pro row. Selling those as paid was the previous card's real defect.
  //
  // NO prices here, per §10 step 2: 175 storefront currencies must not drift
  // against store truth.
  const plans: PlanProps[] = [
    {
      id: 'efficiver',
      title: 'Efficiver',
      popular: 0,
      description: 'Everything you need to start driving more efficiently.',
      benefitList: [
        'Unlimited drives',
        'Your Efficiency Score after every drive',
        'Score confidence and weak-GPS warnings',
        'Eco-driving coaching tips',
        'Recent trip history',
        'Fuel, cost and CO₂ estimates (preview)'
      ]
    },
    {
      id: 'pro',
      title: 'Efficiver Pro',
      popular: 1,
      description: 'Depth on your own phone — trends, explanations and full history.',
      benefitList: [
        'Everything in Efficiver',
        'Full score with explanations',
        'Weekly and monthly trends',
        'Extended trip history',
        'Personalized coaching tips',
        'Full fuel, cost and CO₂ estimates',
        'Improvement progress and shareable summaries'
      ]
    },
    {
      id: 'fleet',
      title: 'Efficiver Fleet',
      popular: 0,
      description: 'For teams — the trip records and coaching a fleet needs.',
      buttonText: 'Talk to us',
      benefitList: [
        'The same app your drivers already use',
        'On-duty trip records shared with the fleet',
        'Driver scores and coaching',
        'No hardware, no trackers to fit',
        'Invite-based — drivers join with a code'
      ]
    }
  ]

  /**
   * Price label. `config.pricing.launchOffer` is the flip switch Brief §10
   * step 2 describes: TRUE = pre-billing, FALSE = post-billing.
   *
   * Post-billing is the 1.7.0 default (plan item H, owner-approved 2026-11-06):
   * both apps sell Pro in-app (StoreKit 2 / Play Billing), so the card says
   * "In-App Purchase" and links to both stores. Pre-billing ("Coming soon", no
   * purchase path) returns only when the switch is set to exactly 'true'. The
   * prod deploy still waits for both store approvals (Brief §10 step 8, plan
   * K step 6).
   */
  function getPriceLabel(id: string): string {
    if (id === 'efficiver') return 'Free'
    if (id === 'pro') return config.pricing.launchOffer ? 'Coming soon' : 'In-App Purchase'
    return 'Talk to us'
  }

  function getPriceSubtext(id: string): string {
    if (id === 'efficiver') return 'forever'
    // No prices on the site (Brief §10 step 2): 175 storefront currencies must
    // not drift against store truth. Both apps sell exactly these two plans.
    if (id === 'pro')
      return config.pricing.launchOffer ? 'pricing being finalised' : 'monthly or annual'
    // Tier 3/4 bill through RazorPay — Brief §2: "no IAP anywhere in this tier".
    // A per-seat price here misrepresented the channel.
    return 'for teams of any size'
  }
</script>

<template>
  <section id="pricing" class="container py-16 sm:py-20">
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">Pricing</h2>

    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
      Start free. Go deeper when you need to.
    </h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
      Efficiver is free to use. Efficiver Pro adds deeper insights and history, and Efficiver Fleet
      covers driving for work.
    </h3>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
      <Card
        v-for="{ id, title, popular, description, buttonText, benefitList } in plans"
        :key="title"
        :class="{
          'drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary ':
            popular === PopularPlan?.NO && id === 'efficiver',
          'bg-muted/20': popular === PopularPlan?.YES
        }"
      >
        <CardHeader class="relative">
          <CardTitle class="pb-2">
            {{ title }}
          </CardTitle>

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
          <!-- Efficiver: a real store link, the same dual-platform pattern Hero/
               WhatsNew/Releases use. Pro, post-billing (Brief §10 step 4): the
               same two store links — Pro is bought inside the app, so they lead
               to the download. Pro, pre-billing: disabled, echoing the price
               label, so "Coming soon" never sits over a purchase path. Fleet: an
               in-page anchor to the enquiry form, not a dead button. -->
          <div v-if="id === 'efficiver'" class="flex flex-col gap-2 w-full">
            <Button as-child class="w-full">
              <a :href="config.app.ios" target="_blank" rel="noopener">Get Started — App Store</a>
            </Button>
            <Button v-if="config.app.android" as-child variant="secondary" class="w-full">
              <a :href="config.app.android" target="_blank" rel="noopener"
                >Get Started — Google Play</a
              >
            </Button>
          </div>
          <Button
            v-else-if="id === 'pro' && config.pricing.launchOffer"
            variant="secondary"
            class="w-full"
            disabled
          >
            {{ getPriceLabel(id) }}
          </Button>
          <div v-else-if="id === 'pro'" class="flex flex-col gap-2 w-full">
            <Button as-child class="w-full">
              <a :href="config.app.ios" target="_blank" rel="noopener">Get Pro — App Store</a>
            </Button>
            <Button v-if="config.app.android" as-child variant="secondary" class="w-full">
              <a :href="config.app.android" target="_blank" rel="noopener">Get Pro — Google Play</a>
            </Button>
          </div>
          <Button v-else as-child class="w-full">
            <a href="#fleet">{{ buttonText }}</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>
