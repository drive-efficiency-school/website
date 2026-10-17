<script setup lang="ts">
  import { onMounted } from 'vue'
  import FleetCallout from './FleetCallout.vue'

  // "#fleet" is this page's enquiry-form alias (App.vue routes it here — Pricing's
  // "Talk to us" links to it). App scrolls every page it opens to the top, which left the
  // form, at the bottom, out of view; opened through the alias, bring the form into view.
  onMounted(() => {
    if (window.location.hash === '#fleet') {
      document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
</script>
<template>
  <main>
    <section class="container pt-14 pb-6">
      <a href="#" class="text-sm text-muted-foreground underline underline-offset-4"
        >← Back to the personal app</a
      >
      <p class="text-primary text-sm uppercase tracking-widest font-semibold mt-10">
        Efficiver Fleet · Coming soon
      </p>
      <h1 class="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mt-4">
        Turn work trips into<br />useful coaching.
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl mt-6">
        The same Efficiver app for drivers. A shared view of on-duty trips, driving habits and
        coaching progress for the people managing a fleet.
      </p>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
        <article class="border rounded-2xl p-6">
          <p class="text-primary font-semibold">01 · Invite</p>
          <h2 class="font-semibold text-lg mt-3">Bring drivers on board</h2>
          <p class="text-sm text-muted-foreground mt-3">
            Drivers join with a fleet code in the app. Explain your duty policy before they start.
          </p>
        </article>
        <article class="border rounded-2xl p-6">
          <p class="text-primary font-semibold">02 · Review</p>
          <h2 class="font-semibold text-lg mt-3">Understand work trips</h2>
          <p class="text-sm text-muted-foreground mt-3">
            Review on-duty trip records and scores together, with driver and vehicle context.
          </p>
        </article>
        <article class="border rounded-2xl p-6">
          <p class="text-primary font-semibold">03 · Coach</p>
          <h2 class="font-semibold text-lg mt-3">Make feedback useful</h2>
          <p class="text-sm text-muted-foreground mt-3">
            Use recorded driving patterns to guide focused coaching conversations.
          </p>
        </article>
        <article class="border rounded-2xl p-6">
          <p class="text-primary font-semibold">04 · Follow up</p>
          <h2 class="font-semibold text-lg mt-3">Look for progress</h2>
          <p class="text-sm text-muted-foreground mt-3">
            Compare before-and-after coaching reports. Export CSV or print a report for review.
          </p>
        </article>
      </div>
      <aside class="mt-8 rounded-2xl bg-muted p-6 max-w-4xl">
        <h2 class="font-semibold text-lg">Clear boundaries for drivers and managers</h2>
        <p class="text-muted-foreground mt-3 leading-relaxed">
          On-duty drives are shared with the fleet. A fleet can let drivers change duty status or
          keep members on duty by policy. Explain who controls this before joining. The management
          tools include retention settings and driver-data deletion; agree your organisation’s
          policy before rollout.
        </p>
      </aside>
    </section>
    <FleetCallout />
  </main>
</template>
