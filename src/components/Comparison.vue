<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Check, X } from 'lucide-vue-next'

  interface ComparisonRow {
    feature: string
    efficiver: boolean | string
    obdApps: boolean | string
  }

  // Only rows that follow from the CATEGORY DEFINITION survive here. "An OBD
  // app requires an OBD dongle" is what the category name means — no product
  // survey needed to say it, and the same holds for the port EVs often do not
  // expose.
  //
  // Removed, and why (review finding 9 asks for products / market / date /
  // sources / conditions — none exist):
  //   Cost "$50-150 dongle"  — a price claim about products we have not surveyed
  //   Setup Time "15+ minutes" — a speed claim about the same
  //   Battery Drain "Minimal vs High" — unmeasured on BOTH sides; there is no
  //     battery instrumentation in either Efficiver app. The real, verified
  //     Low Power behaviour moved to Features, where it is a statement about
  //     Efficiver alone.
  //   Privacy First / Works Offline — assert third-party data practices
  //   Cost "Free Forever" — presented Efficiver as one price; the naming SOT
  //     has three tiers (Brief §10 step 3 asks for exactly this scoping)
  const comparisonData: ComparisonRow[] = [
    { feature: 'OBD dongle required', efficiver: false, obdApps: true },
    { feature: 'Works on vehicles with no usable OBD port', efficiver: true, obdApps: false }
  ]
</script>

<template>
  <section id="comparison" class="container py-24 sm:py-32">
    <div class="text-center mb-12">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">Why Efficiver?</h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">No OBD Dongle Needed</h2>

      <p class="md:w-2/3 mx-auto text-xl text-muted-foreground">
        Efficiver does not need an OBD connection for its phone-based coaching.
      </p>
    </div>

    <div class="max-w-4xl mx-auto">
      <Card class="overflow-hidden">
        <CardHeader class="bg-muted/50">
          <div class="grid grid-cols-3 gap-4 text-center">
            <CardTitle class="text-lg">Feature</CardTitle>
            <CardTitle class="text-lg">
              <Badge variant="default" class="text-base px-4 py-1">Efficiver</Badge>
            </CardTitle>
            <CardTitle class="text-lg text-muted-foreground">OBD Apps</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <div
            v-for="(row, index) in comparisonData"
            :key="row.feature"
            :class="[
              'grid grid-cols-3 gap-4 p-4 text-center items-center',
              index % 2 === 0 ? 'bg-background' : 'bg-muted/30'
            ]"
          >
            <div class="text-left font-medium">{{ row.feature }}</div>
            <div class="flex justify-center">
              <template v-if="typeof row.efficiver === 'boolean'">
                <Check v-if="row.efficiver" class="h-6 w-6 text-green-500" />
                <X v-else class="h-6 w-6 text-red-500" />
              </template>
              <!-- v8 ignore start -->
              <span v-else class="text-green-600 dark:text-green-400 font-semibold">{{
                row.efficiver
              }}</span>
              <!-- v8 ignore stop -->
            </div>
            <div class="flex justify-center">
              <template v-if="typeof row.obdApps === 'boolean'">
                <Check v-if="row.obdApps" class="h-6 w-6 text-green-500" />
                <X v-else class="h-6 w-6 text-red-500" />
              </template>
              <!-- v8 ignore start -->
              <span v-else class="text-muted-foreground">{{ row.obdApps }}</span>
              <!-- v8 ignore stop -->
            </div>
          </div>
        </CardContent>
      </Card>

      <p class="mt-4 text-sm text-muted-foreground text-center">
        This compares Efficiver against the OBD-app category by definition — an OBD app needs an OBD
        connection. Hardware, cost, setup, connectivity and data practices vary across individual
        products.
      </p>
    </div>
  </section>
</template>
