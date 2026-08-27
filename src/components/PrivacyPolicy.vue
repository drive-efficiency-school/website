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
            don't store it on our servers — <strong>unless you join a fleet</strong> (see the next
            point).
          </li>
          <li>
            <strong>Fleet mode is the one exception, and it is opt-in.</strong> If your employer
            runs Efficiver Fleet and gives you an invite code, the drives you record
            <em>while you are on duty</em> are uploaded and shared with that employer. You are shown
            what will be shared and must agree before joining, you control the on-duty switch, and
            you can leave at any time. Off-duty drives never leave your phone. See section 3.
          </li>
          <li>
            On iPhone, if you are signed in to iCloud your sessions sync through <em>your own</em>
            private iCloud database — never our servers. On Android, Efficiver does not sync to our
            servers either; if you leave Android's own backup switched on, your drives and settings
            are backed up to
            <em>your</em> Google account so a replacement phone can restore them.
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
          <li>
            We never sell, rent, or trade your personal information. Beyond your own fleet if you
            choose to join one, and the weather and maps providers above who only see a location
            request, we don't share it with anyone.
          </li>
          <li>No advertising identifiers, no third-party analytics, no ad tracking.</li>
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
            GPS waypoints, route choices) are stored locally using SwiftData. They are not
            transmitted to Efficiver's servers — the only exception is an on-duty drive when you
            have joined a fleet (section 3).
          </li>
          <li>
            <strong>Smart Detection model</strong> is trained entirely on your iPhone using Apple's
            machine-learning frameworks, and is never sent to Efficiver. While you are signed in to
            iCloud it syncs through <em>your own</em> private iCloud database (below).
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

        <h3 class="text-xl font-semibold mt-6 mb-2">iCloud sync (on while you are signed in)</h3>
        <p>
          <strong>Efficiver does not have a separate sync switch.</strong> While your iPhone is
          signed in to iCloud, your driving sessions and the Smart Detection model synchronize
          across <em>your own</em> Apple devices through <em>your own</em> private iCloud database.
          Efficiver has no access to that database — the data is in your Apple account, not on our
          servers.
        </p>
        <p class="mt-2">
          We keep it that way deliberately: a per-user sync switch would mean maintaining two
          different storage layouts and migrating your history between them, which is exactly the
          kind of change that has cost users their data before.
        </p>
        <p class="mt-2">
          You control it in iOS, not in Efficiver. Open
          <em>Settings → [your name] → iCloud</em>, tap <em>See All</em> next to
          <em>Saved to iCloud</em>, and choose Efficiver. Apple describes the effect as the app no
          longer connecting with iCloud, so your data exists only on your device. Apple does not
          document what happens to data already stored in iCloud at that point, so we will not claim
          it either — if you want that removed, contact us and we will help you get to the right
          place.
        </p>

        <h3 class="text-xl font-semibold mt-6 mb-2">What the app does NOT collect</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>No advertising identifiers (IDFA, IDFV)</li>
          <li>No analytics events (no Apple App Analytics, no third-party SDKs)</li>
          <li>No crash reports sent to us</li>
          <li>No usage analytics or telemetry about how you use the app</li>
          <li>
            No location tracking outside an active drive. Each drive's route is stored with that
            session on your device.
          </li>
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
            GPS waypoints, route choices) are stored locally on your phone. They are not transmitted
            to Efficiver's servers — the only exception is an on-duty drive when you have joined a
            fleet (section 3).
          </li>
          <li>
            <strong>Smart Detection model</strong> is trained entirely on your phone and is never
            sent to Efficiver. It is included in your Google account backup (below), so a
            replacement phone keeps your calibration.
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

        <h3 class="text-xl font-semibold mt-6 mb-2">Backup to your Google account</h3>
        <p>
          Efficiver runs no cloud sync of its own on Android — there is no Efficiver server holding
          your drives, and nothing is uploaded to us. The one exception is a fleet: if you have
          joined one, on-duty drives are uploaded to that fleet (section 3).
        </p>
        <p class="mt-2">
          Android itself, however, does back the app up if you have device backup switched on. That
          is a Google feature, it goes to <em>your</em> Google account, and Efficiver cannot read
          it. We deliberately include your drive history, your settings and your Smart Detection
          calibration so that losing or replacing your phone does not lose your data. Verbose logs
          and the recomputable forecast cache are excluded.
        </p>
        <p class="mt-2">
          To turn it off, use Android's own setting — typically
          <em>Settings → Google → Backup</em>, or the per-app control your device provides. Turning
          it off stops future backups; it does not delete a backup already taken.
        </p>

        <h3 class="text-xl font-semibold mt-6 mb-2">What the Android app does NOT collect</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>No advertising identifiers</li>
          <li>No analytics events (no third-party analytics SDKs)</li>
          <li>No crash reports sent to us</li>
          <li>No usage analytics or telemetry about how you use the app</li>
          <li>
            No location tracking outside an active drive. Each drive's route is stored with that
            session on your phone.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 3: Fleet mode -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. Fleet mode (opt-in, both apps)</h2>
      <div class="opacity-80">
        <p>
          Some drivers use Efficiver for work, for an employer that runs
          <strong>Efficiver Fleet</strong>. This is the only situation in which your driving data
          leaves your phone and becomes visible to someone else. It is off unless you deliberately
          turn it on, and it works the same way on iPhone and Android.
        </p>

        <h3 class="text-xl font-semibold mt-6 mb-2">How it is switched on</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            Your employer gives you an <strong>invite code</strong>. Without a valid code from a
            fleet with an active subscription, you cannot join — there is no open sign-up.
          </li>
          <li>
            Before you join, the app shows you a <strong>consent screen</strong> describing what
            will be shared. You must accept it to continue.
          </li>
          <li>
            Once joined, you control an <strong>on-duty / off-duty</strong> switch. Nothing is
            uploaded while you are off duty.
          </li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">What is shared, and when</h3>
        <p>
          When you finish a drive <em>while on duty</em>, that drive is uploaded to your fleet. It
          contains:
        </p>
        <ul class="list-disc pl-6 space-y-2 mt-2">
          <li>
            The <strong>route of that drive</strong> — GPS points with timestamps, speed, heading
            and altitude.
          </li>
          <li>
            <strong>Driving-quality events</strong> from that drive — harsh acceleration and
            braking, with severity and when they happened.
          </li>
          <li>
            A <strong>summary</strong> — Efficiency Score, distance, idle time, start and end time,
            and whether the drive started automatically or manually.
          </li>
          <li>
            Identifiers that tie the drive to you as a driver in that fleet, and to the device that
            recorded it.
          </li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">What is never shared with your fleet</h3>
        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>Drives recorded while you are off duty</strong>, which stay on your phone.
          </li>
          <li>Any drive at all if you have not joined a fleet.</li>
          <li>
            Continuous or background location when you are not driving — Efficiver only records
            during a drive.
          </li>
          <li>Your contacts, messages, photos, or anything unrelated to the drive itself.</li>
          <li>Your Smart Detection model, which is never shared with your fleet.</li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-2">Who controls that data</h3>
        <p>
          Once an on-duty drive is uploaded,
          <strong>your employer decides what happens to it</strong>. In data-protection terms they
          are the controller and Efficiver processes the data on their behalf, under our agreement
          with them. Your employer also sets <strong>how long</strong>
          uploaded drives are kept, after which they are permanently purged.
        </p>
        <p class="mt-2">
          This means that to see, correct, or delete drives that have already been uploaded, you
          should ask your employer or fleet administrator first — they control that data. If you
          cannot reach them, email
          <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a> and we
          will help you get to the right place.
        </p>

        <h3 class="text-xl font-semibold mt-6 mb-2">Leaving a fleet</h3>
        <p>
          You can leave a fleet at any time from the same screen you joined on. After you leave,
          nothing further is uploaded. Drives already uploaded remain with your employer under their
          retention setting, as described above.
        </p>
      </div>
    </section>

    <!-- Section 4: The Efficiver website -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. The Efficiver website (efficiver.com)</h2>
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

    <!-- Section 5: How we share data -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. How we share data</h2>
      <div class="opacity-80">
        <p>We don't sell, rent, or trade your personal information. The only times it is shared:</p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Your employer, if you join a fleet.</strong> On-duty drives are uploaded and
            shared with the fleet you joined, which is the whole purpose of that feature. This only
            happens after you enter their invite code and accept the consent screen. Full detail in
            section 3.
          </li>
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

    <!-- Section 6: Your rights -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Your rights</h2>
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
            On iPhone, turn Efficiver off under <em>Settings → [your name] → iCloud → See All</em>
            to stop it syncing. Deleting your sessions inside the app removes them from iCloud and
            your other devices too. On Android, turn off device backup in Android's settings to stop
            future backups, and delete the existing app backup from your Google account to remove
            what has already been saved.
          </li>
          <li>
            <strong>Leave a fleet</strong> at any time from the fleet screen in Settings, which
            stops any further uploads. For drives already uploaded, ask your employer or fleet
            administrator — they control that data and set how long it is kept (section 3).
          </li>
          <li>Unsubscribe from the newsletter via the link in any newsletter email.</li>
          <li>
            Email <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>
            to request deletion of any data we hold from the contact form or newsletter.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 7: Children's privacy -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Children's privacy</h2>
      <div class="opacity-80">
        <p>
          Efficiver carries a 17+ age rating on the app stores, which reflects the app's content and
          its use while driving. Separately, and whatever that rating says, we do not knowingly
          collect personal information from children under 13. If you believe we have inadvertently
          received such information, please contact us and we will delete it.
        </p>
      </div>
    </section>

    <!-- Section 8: Changes to this policy -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">8. Changes to this policy</h2>
      <div class="opacity-80">
        <p>
          We may update this Privacy Policy as the app and website evolve. The "Last updated" date
          at the top of this page reflects the most recent change. Material changes will be
          highlighted on the website and in the app's What's New / release notes.
        </p>
      </div>
    </section>

    <!-- Section 9: Contact -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">9. Contact</h2>
      <div class="opacity-80">
        <p>
          For privacy questions, email
          <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>
