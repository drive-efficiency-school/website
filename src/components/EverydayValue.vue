<script setup lang="ts">
  import { useColorMode } from '@vueuse/core'
  const mode = useColorMode()
</script>
<template>
  <section id="progress" class="bg-muted/40 border-y py-16 sm:py-20">
    <div class="container">
      <p class="text-sm text-primary uppercase tracking-widest font-semibold">
        A reason to come back
      </p>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mt-3 max-w-2xl">
        What can your next week of driving teach you?
      </h2>
      <div class="grid md:grid-cols-2 gap-6 mt-10">
        <article class="border rounded-2xl bg-background p-7">
          <p class="text-sm text-primary font-semibold">Your habits</p>
          <h3 class="text-xl font-semibold mt-3">See what keeps happening.</h3>
          <p class="text-muted-foreground leading-relaxed mt-3">
            Review your scores and driving events. Look for repeated hard braking or long idle
            periods, then choose one practical change.
          </p>
          <p class="border-t pt-4 mt-6 text-sm text-muted-foreground">
            Start with your trip score and coaching. Deeper patterns and forecasts are planned for
            Pro.
          </p>
        </article>
        <article class="border rounded-2xl bg-background p-7">
          <p class="text-sm text-primary font-semibold">Your costs</p>
          <h3 class="text-xl font-semibold mt-3">Give the numbers context.</h3>
          <p class="text-muted-foreground leading-relaxed mt-3">
            Wallet Watch uses your fuel or energy price, baseline consumption and trip details to
            estimate impact. Set your currency and units to match your vehicle.
          </p>
          <p class="border-t pt-4 mt-6 text-sm text-muted-foreground">
            Estimates depend on your inputs and driving conditions. They are not a fuel-meter
            reading or a savings guarantee.
          </p>
        </article>
      </div>
      <div id="costs" class="grid md:grid-cols-2 items-center gap-10 mt-12 border-t pt-12">
        <figure class="flex flex-col items-center">
          <img
            :src="mode === 'light' ? 'screen-light_105.webp' : 'screen-dark_005.webp'"
            alt="Wallet Watch settings showing currency, fuel price and baseline mileage inputs"
            width="1206"
            height="2622"
            loading="lazy"
            class="w-52 rounded-3xl border shadow-lg"
          />
          <figcaption class="text-xs text-muted-foreground mt-4 max-w-xs text-center">
            iPhone settings shown. Example prices and baseline values are not recommendations.
          </figcaption>
        </figure>
        <div>
          <p class="text-primary font-semibold text-sm">Wallet Watch, explained</p>
          <h3 class="text-3xl font-bold mt-3">Your inputs give estimates meaning.</h3>
          <ol class="mt-6 space-y-5 list-decimal pl-5 text-muted-foreground">
            <li>
              <strong class="text-foreground">Choose your currency and units.</strong> Read the
              result in terms you use every day.
            </li>
            <li>
              <strong class="text-foreground">Enter your local price.</strong> Use fuel price for
              petrol or diesel, or electricity price for an electric vehicle.
            </li>
            <li>
              <strong class="text-foreground">Set a consumption baseline.</strong> This is the
              reference used for comparison, not a measurement from the car.
            </li>
          </ol>
          <!-- v1.6 (ADR-198): a finished drive keeps the price + baseline in effect when it
               ended; before 1.6 a price edit re-priced every past drive. -->
          <p class="mt-6 text-sm text-muted-foreground">
            Each finished drive keeps the price and baseline that were set when it ended, so
            changing them later changes only your new drives’ estimates. After a currency change,
            older drives use today’s price. Use it to understand the model, not as proof of money
            saved.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
