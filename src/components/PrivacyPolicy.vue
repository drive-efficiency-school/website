<script setup lang="ts">
  import { config } from '@/lib/config'
</script>

<template>
  <div class="container mx-auto px-6 sm:px-8 py-12 sm:py-16">
    <h1 class="text-3xl font-bold mb-6 text-center">Privacy Policy for Efficiver</h1>

    <p class="text-center text-sm text-muted-foreground mb-10">
      Last updated: {{ config.lastUpdated.privacy }}
    </p>

    <!-- Plain-English summary -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Summary</h2>
      <div class="opacity-80">
        <p>Efficiver is built privacy-first. In plain English:</p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>
            Your driving data stays on your device (iPhone or Android phone). We don't see it and we
            don't store it on our servers.
          </li>
          <li>
            On iPhone, iCloud sync is optional and uses <em>your</em> private iCloud database —
            never our servers. The Android app has no cloud sync; your data stays on your phone.
          </li>
          <li>
            To show weather and plan efficient routes, the app sends your location to weather and
            maps providers — Apple on iPhone; OpenWeather and Google on Android — which process the
            request to return the result.
          </li>
          <li>
            The website's newsletter and contact form collect only what you type in, for the purpose
            you submitted them.
          </li>
          <li>We don't sell, share, rent, or trade your personal information.</li>
          <li>No advertising identifiers, no third-party analytics, no telemetry.</li>
        </ul>
      </div>
    </section>

    <!-- Section 1: The Efficiver iOS app -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. The Efficiver iOS app</h2>
      <div class="opacity-80">
        <h3 class="text-xl font-semibold mt-4 mb-2">What stays on your iPhone</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>Driving sessions</strong> (speed, acceleration, braking, idle time, gear use,
            GPS waypoints, route choices) are stored locally using SwiftData. They are never
            transmitted to Efficiver's servers.
          </li>
          <li>
            <strong>Smart Detection model</strong> is trained entirely on your iPhone using Apple's
            machine-learning frameworks. The model never leaves your device.
          </li>
          <li>
            <strong>Vehicle settings</strong> (fuel type, engine size, transmission) are stored
            locally; never transmitted.
          </li>
          <li>
            <strong>Location data</strong> is used during active drives to log waypoints and compute
            the Efficiency Score. Stored locally with each session. The app requires this permission
            to function.
          </li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">Apple-provided services we call directly</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>WeatherKit</strong> is queried when you start a drive to fetch current weather.
            Apple handles the request; Efficiver does not intermediate or retain the response.
          </li>
          <li>
            <strong>Apple Maps (MapKit)</strong> powers the live drive map and the Efficient Route
            planner — searching for destinations and computing route options. Apple handles these
            requests; Efficiver does not retain them.
          </li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">iCloud sync (optional, off by default)</h3>
        <p>
          If you turn on iCloud sync, your driving sessions and the Smart Detection model
          synchronize across <em>your</em> Apple devices via <em>your</em> private iCloud database.
          This is end-to-end inside your iCloud account; Efficiver has no access to it. You can
          disable iCloud sync at any time in iOS Settings or the app's preferences.
        </p>

        <h3 class="text-xl font-semibold mt-6 mb-2">What the app does NOT collect</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>No advertising identifiers (IDFA, IDFV)</li>
          <li>No analytics events (no Apple App Analytics, no third-party SDKs)</li>
          <li>No crash reports sent to us</li>
          <li>No telemetry of any kind</li>
          <li>No location history beyond the active drive session</li>
        </ul>
      </div>
    </section>

    <!-- Section 2: The Efficiver Android app -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. The Efficiver Android app</h2>
      <div class="opacity-80">
        <h3 class="text-xl font-semibold mt-4 mb-2">What stays on your phone</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>Driving sessions</strong> (speed, acceleration, braking, idle time, gear use,
            GPS waypoints, route choices) are stored locally on your phone. They are never
            transmitted to Efficiver's servers.
          </li>
          <li>
            <strong>Smart Detection model</strong> is trained entirely on your phone. The model
            never leaves your device.
          </li>
          <li>
            <strong>Vehicle settings</strong> (fuel type, engine size, transmission) are stored
            locally; never transmitted.
          </li>
          <li>
            <strong>Location data</strong> is used during active drives to log waypoints and compute
            the Efficiency Score, and is stored locally with each session. The app requires this
            permission to function.
          </li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">Third-party services the Android app calls</h3>
        <p>
          Unlike the iPhone app (which uses Apple's first-party services), the Android app sends
          your location to the following providers to deliver weather and route features. We do not
          store these requests on our servers.
        </p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>OpenWeather</strong> — when you start a drive, your location coordinates are
            sent to OpenWeather to fetch current weather and a short forecast. Handled under
            <a href="https://openweather.co.uk/privacy-policy" class="underline"
              >OpenWeather's privacy policy</a
            >.
          </li>
          <li>
            <strong>Google Maps, Routes &amp; Places</strong> — the live drive map and the Efficient
            Route planner send your location and destination searches to Google to display maps,
            autocomplete places, and compute route options. Handled under
            <a href="https://policies.google.com/privacy" class="underline"
              >Google's privacy policy</a
            >.
          </li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">No cloud sync</h3>
        <p>
          The Android app does not sync to any cloud service. All of your data stays on your phone
          until you delete it in the app or uninstall.
        </p>

        <h3 class="text-xl font-semibold mt-6 mb-2">What the Android app does NOT collect</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>No advertising identifiers</li>
          <li>No analytics events (no third-party analytics SDKs)</li>
          <li>No crash reports sent to us</li>
          <li>No telemetry of any kind</li>
          <li>No location history beyond the active drive session stored on your phone</li>
        </ul>
      </div>
    </section>

    <!-- Section 3: The Efficiver website -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. The Efficiver website (efficiver.com)</h2>
      <div class="opacity-80">
        <p>The website has two optional forms that send information to us:</p>

        <h3 class="text-xl font-semibold mt-4 mb-2">Newsletter subscription</h3>
        <p>
          If you subscribe to the newsletter, we collect your email address, optionally your name,
          and your selected topic preferences. We use this solely to send the newsletter. You can
          unsubscribe at any time using the link in any newsletter email.
        </p>

        <h3 class="text-xl font-semibold mt-4 mb-2">Contact form</h3>
        <p>
          If you submit the contact form, we collect your name, email address, optional phone,
          optional company, the chosen subject, and your message. We use this solely to respond to
          your inquiry. You are not added to any list.
        </p>

        <p class="mt-4">
          Both forms submit to <code>{{ config.api.baseUrl }}</code
          >, an Efficiver-operated email API. Data is retained for the time needed to fulfill your
          request and respond. No third-party processors.
        </p>
      </div>
    </section>

    <!-- Section 4: How we share data -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. How we share data</h2>
      <div class="opacity-80">
        <p>We don't sell, rent, share, or trade your personal information. The only exceptions:</p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Service providers for weather and maps.</strong> To deliver the weather and
            route features, your location (and, for routing, your destination searches) is sent to
            the providers that power those features: Apple on iPhone; OpenWeather and Google on
            Android. They process this data only to return the result, under their own privacy
            policies. Efficiver does not receive or store these requests.
          </li>
          <li>
            If you submit the contact form, we may share your message with the relevant Efficiver
            support staff so we can respond.
          </li>
          <li>
            If required by law (e.g., a valid court order or subpoena), we will comply with that
            legal obligation.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 5: Your rights -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Your rights</h2>
      <div class="opacity-80">
        <p>You can:</p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>
            Delete your driving sessions inside the app. On iPhone you can delete individual
            sessions; on Android, open <strong>Settings → "Delete All Drive Sessions"</strong> to
            permanently remove every saved session (including waypoints, scores, and mistake
            markers) from your phone.
          </li>
          <li>
            Reset all app settings to defaults (<strong>Settings → "Reset All Settings"</strong>).
          </li>
          <li>Uninstall the app to remove all locally-stored data from your device.</li>
          <li>
            On iPhone, disable iCloud sync to stop new cloud-stored sessions; previously-synced
            sessions remain on whichever device created them until you delete them. (The Android app
            has no cloud sync.)
          </li>
          <li>Unsubscribe from the newsletter via the link in any newsletter email.</li>
          <li>
            Email <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>
            to request deletion of any data we hold from the contact form or newsletter.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 6: Children's privacy -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Children's privacy</h2>
      <div class="opacity-80">
        <p>
          Efficiver is intended for users aged 17 and over. We do not knowingly collect personal
          information from children under 13. If you believe we have inadvertently received such
          information, please contact us and we will delete it.
        </p>
      </div>
    </section>

    <!-- Section 7: Changes to this policy -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Changes to this policy</h2>
      <div class="opacity-80">
        <p>
          We may update this Privacy Policy as the app and website evolve. The "Last updated" date
          at the top of this page reflects the most recent change. Material changes will be
          highlighted on the website and in the app's What's New / release notes.
        </p>
      </div>
    </section>

    <!-- Section 8: Contact -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">8. Contact</h2>
      <div class="opacity-80">
        <p>
          For privacy questions, email
          <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>
