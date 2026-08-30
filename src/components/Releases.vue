<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Badge } from '@/components/ui/badge'
  import { Button } from '@/components/ui/button'
  import {
    ExternalLinkIcon,
    Map,
    Cloud,
    Accessibility,
    BrainCircuit,
    Leaf,
    Banknote,
    Car,
    BarChart3,
    Minimize2,
    Watch,
    Layers,
    Sparkles,
    Compass,
    Plus,
    Minus
  } from 'lucide-vue-next'
  import { config } from '@/lib/config'
</script>

<template>
  <div class="container mx-auto px-6 sm:px-8 py-12 sm:py-16 max-w-4xl">
    <div class="text-center mb-12">
      <Badge variant="default" class="mb-4">CURRENT — v1.5</Badge>
      <h1 class="text-3xl md:text-4xl font-bold mb-3">Release notes</h1>
      <p class="text-lg text-muted-foreground">
        Every Efficiver release, in one place. Older entries are collapsed — tap to expand.
      </p>
    </div>

    <!-- v1.5 -->
    <Card class="mb-6 border-2 border-primary/30 shadow-md">
      <CardHeader>
        <div class="flex justify-between items-baseline gap-4">
          <CardTitle class="text-2xl">v1.5 — Converged Trends, AidOps Edge</CardTitle>
          <span class="text-sm text-muted-foreground whitespace-nowrap">July 2026</span>
        </div>
      </CardHeader>
      <CardContent class="space-y-6 text-base">
        <p class="text-muted-foreground">
          v1.5 converges your recorded history and forecast into one interactive chart you can scrub
          day by day, gives the on-device intelligence behind your insights a name and an honest
          status — AidOps Edge — and makes every Insights card say where it leads. Trends, the
          forecast and AidOps Edge insights ship in v1.5's code and are part of Efficiver Pro, which
          is coming — the subscription that unlocks them hasn't rolled out yet.
        </p>

        <div class="flex gap-4 items-start">
          <div class="bg-blue-500/10 p-2 rounded-full ring-4 ring-blue-500/5 shrink-0">
            <BarChart3 class="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 class="font-semibold text-lg mb-1">One chart, your whole story</h4>
            <p class="text-muted-foreground">
              Trends used to show your recorded days and your forecast as separate cards. They're
              now a single continuous chart: your observed daily scores flow into your projection,
              split by a "Today" divider. Drag across it to scrub — the headline swaps to that exact
              day's score, labelled Observed or Predicted, with the likely range for forecast days.
              Your average, your patterns, and the idle lever sit right below.
            </p>
          </div>
        </div>

        <div class="flex gap-4 items-start">
          <div class="bg-purple-500/10 p-2 rounded-full ring-4 ring-purple-500/5 shrink-0">
            <Sparkles class="size-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 class="font-semibold text-lg mb-1">AidOps Edge, on your phone</h4>
            <p class="text-muted-foreground">
              The on-device intelligence that narrates your Year Recap and Your Patterns is now
              called AidOps Edge, and it tells you its state wherever it appears — active, off, or
              unavailable — instead of quietly falling back. A new Assistance page in Settings shows
              whether Apple Intelligence is switched on, and how to enable it if it isn't. The
              numbers are always computed by Efficiver; AidOps Edge only phrases them, on your
              phone. Nothing leaves your device. Year Recap and Your Patterns are part of Efficiver
              Pro, coming soon.
            </p>
          </div>
        </div>

        <div class="flex gap-4 items-start">
          <div class="bg-green-500/10 p-2 rounded-full ring-4 ring-green-500/5 shrink-0">
            <Compass class="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 class="font-semibold text-lg mb-1">Insights that say where they go</h4>
            <p class="text-muted-foreground">
              The Savings and Efficiency cards on Insights now name their destination — Recap,
              Trends, or Set Up — so tapping one is never a surprise. Deeper pages across the app
              share one consistent branded title style.
            </p>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-lg mb-2">Smaller improvements</h4>
          <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
            <li>
              Refreshing your forecast keeps the chart on screen — your recorded history stays
              visible while the new projection is calculated.
            </li>
            <li>
              Your Patterns shows when it's being rewritten, instead of silently swapping the text
              once the new coaching lands.
            </li>
            <li>
              Joining a fleet now explains clearly when the fleet's subscription is what's blocking
              you, rather than failing generically.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <!-- v1.4 -->
    <details class="mb-4 group">
      <summary class="cursor-pointer">
        <Card class="hover:border-primary/40 transition-colors">
          <CardHeader>
            <div class="flex justify-between items-center gap-4">
              <CardTitle class="text-xl"
                >v1.4 (iPhone) — Apple Watch companion, refined fuel and CO₂ estimates</CardTitle
              >
              <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground whitespace-nowrap">July 2026</span>
                <Plus class="size-5 text-muted-foreground group-open:hidden" />
                <Minus class="size-5 text-primary hidden group-open:inline" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>
      <Card class="mt-2 ml-2 border-l-2 border-l-primary/30">
        <CardContent class="pt-6 space-y-4 text-base">
          <p class="text-muted-foreground">
            v1.4 brings Efficiver to your wrist with a full Apple Watch companion, makes your fuel
            and CO₂ savings more accurate by calculating them from your actual driving physics, and
            puts your live drive card on CarPlay and your Watch's Smart Stack. (This release
            predates the Android app.)
          </p>

          <div class="flex gap-4 items-start">
            <div class="bg-blue-500/10 p-2 rounded-full ring-4 ring-blue-500/5 shrink-0">
              <Watch class="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 class="font-semibold text-lg mb-1">Apple Watch companion (iPhone)</h4>
              <p class="text-muted-foreground">
                Your drive on your wrist — Efficiver's first watchOS companion. See your live score,
                accel and braking mistakes, and elapsed time at a glance; start or stop a drive with
                a tap on the watch or by asking Siri. Feel a distinct haptic buzz for every harsh
                acceleration or braking event. Before you drive, check the weather and today's drive
                advisory right on your wrist. After you're done, your last drive's score and yearly
                savings sit on your watch face as a complication.
              </p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="bg-orange-500/10 p-2 rounded-full ring-4 ring-orange-500/5 shrink-0">
              <Banknote class="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 class="font-semibold text-lg mb-1">Refined fuel and CO₂ estimates</h4>
              <p class="text-muted-foreground">
                Estimated fuel and CO₂ impact is now calculated from your actual speed,
                acceleration, and road grade for every second of the drive — not derived from your
                Efficiency Score. The math still runs entirely on your device, and older drives keep
                their original numbers.
              </p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="bg-green-500/10 p-2 rounded-full ring-4 ring-green-500/5 shrink-0">
              <Layers class="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 class="font-semibold text-lg mb-1">Your drive card, everywhere</h4>
              <p class="text-muted-foreground">
                On iPhone, the Live Activity card that shows your drive on the Lock Screen now also
                appears on your car's CarPlay screen and your Apple Watch's Smart Stack — the same
                live score and a Stop button, wherever you glance.
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-lg mb-2">Smaller improvements</h4>
            <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                Gear Shift Speed rows in Settings now show the true range for each gear, instead of
                an overlapping edit range.
              </li>
              <li>
                Auto-Track Drive starts more reliably, with clearer handling of the Always-location
                permission it needs.
              </li>
              <li>Sharper, higher-contrast live drive card on iPhone, CarPlay and Apple Watch.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </details>

    <!-- v1.3 -->
    <details class="mb-4 group">
      <summary class="cursor-pointer">
        <Card class="hover:border-primary/40 transition-colors">
          <CardHeader>
            <div class="flex justify-between items-center gap-4">
              <CardTitle class="text-xl"
                >v1.3 (iPhone) — CarPlay, redesigned Insights, minimizable drive</CardTitle
              >
              <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground whitespace-nowrap">June 2026</span>
                <Plus class="size-5 text-muted-foreground group-open:hidden" />
                <Minus class="size-5 text-primary hidden group-open:inline" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>
      <Card class="mt-2 ml-2 border-l-2 border-l-primary/30">
        <CardContent class="pt-6 space-y-4">
          <div class="flex gap-4 items-start">
            <div class="bg-blue-500/10 p-2 rounded-full ring-4 ring-blue-500/5 shrink-0">
              <Car class="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">CarPlay support</h4>
              <p class="text-muted-foreground">
                Drive with your phone in your pocket. Efficiver appears as a Driving Task on your
                car's CarPlay screen — tap Drive to start tracking, see your live score, distance,
                and time on the head unit, tap Stop to save. Voice prompts route through your car's
                audio. Works wired or wireless.
              </p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="bg-orange-500/10 p-2 rounded-full ring-4 ring-orange-500/5 shrink-0">
              <BarChart3 class="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Redesigned Insights tab</h4>
              <p class="text-muted-foreground">
                The Insights tab opens on an Analytics view that puts your estimated impact and
                efficiency front and centre — your estimated fuel, cost and CO₂ impact so far this
                year, and your average efficiency score, all free. Flip to a searchable list of
                every drive whenever you want. The year-end forecast is coming with Efficiver Pro.
              </p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="bg-green-500/10 p-2 rounded-full ring-4 ring-green-500/5 shrink-0">
              <Minimize2 class="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Minimize the drive</h4>
              <p class="text-muted-foreground">
                Swipe the drive screen down and it shrinks to a live mini-bar instead of ending the
                drive — your score and distance stay one tap away while you change a setting or open
                another screen. The bar stays put wherever you navigate; tap it to jump back in, or
                end the drive right there.
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold mb-2">Smaller improvements</h4>
            <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Search your past drives by name or date from the Sessions list.</li>
              <li>Anomaly Detection flags drives that fall outside your usual pattern.</li>
              <li>
                Smarter auto-stop — Efficiver senses when your engine is actually off and ends
                parked drives sooner, while protecting long waits at traffic lights.
              </li>
              <li>
                The full Year Recap, the Smart Forecast on Trends, and the "cut idle by X%" lever
                are part of Efficiver Pro — coming soon.
              </li>
              <li>
                Live Activity Stop button is now reliable even after the app has been closed — uses
                Apple's documented orphan-activity recovery pattern.
              </li>
              <li>
                CarPlay voice prompts come through at normal volume regardless of whether the head
                unit is on FM or playing music.
              </li>
              <li>Welcome onboarding text scales cleanly at the largest Dynamic Type sizes.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </details>

    <!-- v1.2 -->
    <details class="mb-4 group">
      <summary class="cursor-pointer">
        <Card class="hover:border-primary/40 transition-colors">
          <CardHeader>
            <div class="flex justify-between items-center gap-4">
              <CardTitle class="text-xl"
                >v1.2 (iPhone) — Live drive map, iCloud sync, accessibility</CardTitle
              >
              <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground whitespace-nowrap">May 2026</span>
                <Plus class="size-5 text-muted-foreground group-open:hidden" />
                <Minus class="size-5 text-primary hidden group-open:inline" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>
      <Card class="mt-2 ml-2 border-l-2 border-l-primary/30">
        <CardContent class="pt-6 space-y-4">
          <div class="flex gap-4 items-start">
            <div class="bg-blue-500/10 p-2 rounded-full ring-4 ring-blue-500/5 shrink-0">
              <Map class="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Live drive map</h4>
              <p class="text-muted-foreground">
                A full-screen Apple Maps view that follows you smoothly as you drive. Pinch to zoom,
                two-finger drag to rotate. Acceleration and braking events render as colored markers
                (green / orange / red) along your route — on the live map and again on the past-trip
                Route card in Session Detail. When iPhone is in Low Power Mode (with Prioritize Low
                Power on in <em>Settings → General</em>), the map pauses with a clear placeholder.
              </p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="bg-orange-500/10 p-2 rounded-full ring-4 ring-orange-500/5 shrink-0">
              <Cloud class="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">iCloud sync</h4>
              <p class="text-muted-foreground">
                Your driving sessions and the Smart Detection model now sync across your iPhones and
                iPad via your own private iCloud database. Sign in to iCloud on each device and
                Efficiver picks up where you left off. Optional and off by default; toggle in
                <em>Settings</em>.
              </p>
              <p class="text-muted-foreground mt-2 text-sm">
                <strong>Current behaviour:</strong> iCloud synchronization now occurs automatically
                while you're signed in to iCloud — there is no separate synchronization switch in
                Efficiver.
              </p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="bg-green-500/10 p-2 rounded-full ring-4 ring-green-500/5 shrink-0">
              <Accessibility class="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Built accessibility-first</h4>
              <p class="text-muted-foreground">
                On iPhone: full VoiceOver support, Dynamic Type from default through AX5, Reduce
                Motion across every animation, Reduce Transparency, Differentiate Without Color,
                Bold Text, and lifecycle announcements for drive started / stopped / saved. Drive
                your way. (This release predates the Android app — see the
                <strong>Accessibility</strong> page for what each platform supports today.)
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-semibold mb-2">Smaller improvements</h4>
            <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>"Eco Route" is now "Efficient Route" everywhere in the app.</li>
              <li>
                Drive gauge inner circle is now visible in light mode (was effectively invisible).
              </li>
              <li>Page-bullet and Stop button tap targets grown to Apple's 44pt minimum.</li>
              <li>
                Calibration phase-change confirmations spell out the transition before saving.
              </li>
              <li>Wallet Watch Save button moved to the toolbar.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </details>

    <!-- v1.1 -->
    <details class="mb-4 group">
      <summary class="cursor-pointer">
        <Card class="hover:border-primary/40 transition-colors">
          <CardHeader>
            <div class="flex justify-between items-center gap-4">
              <CardTitle class="text-xl"
                >v1.1 (iPhone) — Smart Detection, Efficient Route, Wallet Watch</CardTitle
              >
              <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground whitespace-nowrap">May 2026</span>
                <Plus class="size-5 text-muted-foreground group-open:hidden" />
                <Minus class="size-5 text-primary hidden group-open:inline" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>
      <Card class="mt-2 ml-2 border-l-2 border-l-primary/30">
        <CardContent class="pt-6 space-y-4">
          <div class="flex gap-4 items-start">
            <div class="bg-green-500/10 p-2 rounded-full ring-4 ring-green-500/5 shrink-0">
              <BrainCircuit class="size-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Smart Detection</h4>
              <p class="text-muted-foreground">
                Efficiver learns your car on its own. No more rev-range setup — tap
                <em>Calibrate Smart Detection</em> on first launch (about a minute) and acceleration
                and braking are picked up automatically. Everything runs on your iPhone; nothing
                leaves your device.
              </p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-blue-500/10 p-2 rounded-full ring-4 ring-blue-500/5 shrink-0">
              <Leaf class="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Efficient Route</h4>
              <p class="text-muted-foreground">
                Plan an efficient route inside Efficiver and open it in Apple or Google Maps for
                turn-by-turn directions. Efficiver quietly logs the drive for you and saves it when
                you arrive — no need to keep the app open. Turn it on in
                <em>Settings → Driving → Auto-Track Drive</em>.
              </p>
            </div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="bg-orange-500/10 p-2 rounded-full ring-4 ring-orange-500/5 shrink-0">
              <Banknote class="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 class="font-semibold mb-1">Wallet Watch</h4>
              <p class="text-muted-foreground">
                See how much money and CO₂ you saved on every drive, in your local currency (₹, $,
                £, and more). Set your fuel price and baseline consumption in
                <em>Settings → Wallet Watch</em>.
              </p>
            </div>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Smaller improvements</h4>
            <ul class="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Rename a session straight from the in-drive top bar.</li>
              <li>Add notes to any session, up to 255 characters.</li>
              <li>
                Weather widget shows live vs cached data, counts down to the next refresh, and flags
                failed refresh attempts.
              </li>
              <li>Refreshed launch animation and a clearer banner when a drive auto-continues.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </details>

    <!-- v1.0.1 -->
    <details class="mb-4 group">
      <summary class="cursor-pointer">
        <Card class="hover:border-primary/40 transition-colors">
          <CardHeader>
            <div class="flex justify-between items-center gap-4">
              <CardTitle class="text-xl"
                >v1.0.1 (iPhone) — Notifications, privacy & app size</CardTitle
              >
              <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground whitespace-nowrap">April 2026</span>
                <Plus class="size-5 text-muted-foreground group-open:hidden" />
                <Minus class="size-5 text-primary hidden group-open:inline" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>
      <Card class="mt-2 ml-2 border-l-2 border-l-primary/30">
        <CardContent class="pt-6 space-y-4">
          <div>
            <h4 class="font-semibold mb-1">🔔 Notifications</h4>
            <p class="text-muted-foreground">
              Auto-detection alerts (drive started/stopped) no longer pile up in Notification Center
              across multiple drives — newer alerts now replace older ones of the same type.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-1">🛡️ Privacy & permissions</h4>
            <p class="text-muted-foreground">
              Clearer permission prompt for motion sensors, explaining how Efficiver detects when
              your engine is running.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-1">📦 App size</h4>
            <p class="text-muted-foreground">
              Optimized internal code for a smaller, more efficient app.
            </p>
          </div>
        </CardContent>
      </Card>
    </details>

    <!-- v1.0 -->
    <details class="mb-4 group">
      <summary class="cursor-pointer">
        <Card class="hover:border-primary/40 transition-colors">
          <CardHeader>
            <div class="flex justify-between items-center gap-4">
              <CardTitle class="text-xl">v1.0 (iPhone) — Initial release</CardTitle>
              <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground whitespace-nowrap">Q1 2026</span>
                <Plus class="size-5 text-muted-foreground group-open:hidden" />
                <Minus class="size-5 text-primary hidden group-open:inline" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </summary>
      <Card class="mt-2 ml-2 border-l-2 border-l-primary/30">
        <CardContent class="pt-6">
          <p class="text-muted-foreground">
            The first public release of Efficiver — the free, offline efficient-driving coach for
            iPhone. Calibrate for petrol, diesel or EV; track acceleration, braking and idle time in
            real time; get estimated fuel and CO₂ impact with personalised coaching, all entirely on
            your device.
          </p>
        </CardContent>
      </Card>
    </details>

    <!-- Both stores since 2026-08-23. "Download the latest version" pointed only at
         the App Store, which read as iOS-only on a page that lists the shared
         release history. -->
    <div class="mt-12 flex flex-col sm:flex-row justify-center items-center gap-3">
      <Button as-child variant="default">
        <a :href="config.app.ios" target="_blank" rel="noopener">
          Download on the App Store
          <ExternalLinkIcon class="size-4 ml-2" />
        </a>
      </Button>
      <Button v-if="config.app.android" as-child variant="default">
        <a :href="config.app.android" target="_blank" rel="noopener">
          Get it on Google Play
          <ExternalLinkIcon class="size-4 ml-2" />
        </a>
      </Button>
    </div>
  </div>
</template>

<style scoped>
  summary {
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
</style>
