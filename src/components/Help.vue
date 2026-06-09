<script setup lang="ts"></script>

<template>
  <div class="container mx-auto px-6 sm:px-8 py-12 sm:py-16">
    <!-- Document Title (excluded from opacity-80) -->
    <h1 class="text-3xl font-bold mb-6 text-center">Help & Support for Efficiver</h1>

    <p class="text-center text-sm text-muted-foreground mb-10">Last updated: May 27, 2026</p>

    <!-- Section 1: Getting Started -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
      <div class="opacity-80">
        <p>Welcome to Efficiver! The onboarding flow gets you ready to drive in a few minutes.</p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Onboarding Steps</h3>
        <ol class="list-decimal pl-6">
          <li><strong>Welcome:</strong> Introduction to Efficiver's features</li>
          <li>
            <strong>Permissions:</strong> <em>Required:</em> Grant location access for GPS tracking
            and Motion &amp; Fitness access for auto-start/stop and engine detection
          </li>
          <li>
            <strong>Vehicle Setup:</strong> Configure your fuel type (petrol, diesel, electric),
            engine size, and transmission settings
          </li>
          <li>
            <strong>Driving Experience:</strong> Set your proficiency level (1-5) for personalized
            tips
          </li>
          <li><strong>Hands-Free Driving:</strong> Learn about automatic drive detection</li>
          <li>
            <strong>Idle Stop:</strong> Configure how Efficiver detects when your engine is idling
          </li>
          <li>
            <strong>Smart Detection:</strong> A one-minute auto-calibration that records your
            engine's unique vibration signature. Park, keep the engine warm and idling, and tap
            <em>Calibrate</em>. Smart Detection takes it from there.
          </li>
          <li><strong>Start Your Drive:</strong> Setup complete — tap the Drive button and go</li>
        </ol>
      </div>
    </section>

    <!-- Section 2: How Efficiver Works -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">How Efficiver Works</h2>
      <div class="opacity-80">
        <p>
          Efficiver uses your iPhone's built-in sensors to track your driving and give instant
          feedback to save fuel — entirely on-device, no OBD hardware required.
        </p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Key Features</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>Smart Detection:</strong> Identifies when your engine is running by recognizing
            its unique vibration 'fingerprint'. Auto-calibrates from a short sample on first launch
            — no rev-range setup, no OBD dongle.
          </li>
          <li>
            <strong>Real-time Efficiency Score:</strong> Live percentage score showing your driving
            efficiency, updated every second.
          </li>
          <li>
            <strong>Live drive map (v1.2):</strong> Full-screen Apple Maps view that follows you as
            you drive. Pinch to zoom, two-finger drag to rotate. Acceleration and braking events
            render as colored markers (green / orange / red) along your route.
          </li>
          <li>
            <strong>Per-waypoint event markers (v1.2):</strong> Colored markers appear on the live
            map and again on the past-trip Route card in Session Detail, so you can spot exactly
            where each event happened.
          </li>
          <li>
            <strong>Low Power Mode-aware map (v1.2):</strong> When iPhone is in Low Power Mode and
            <em>Prioritize Low Power</em> is on in <em>Settings → General</em>, the map pauses with
            a clear placeholder to save battery.
          </li>
          <li>
            <strong>iCloud sync (v1.2):</strong> Your sessions and the trained Smart Detection model
            sync across your iPhones and iPad via your own private iCloud database. Optional and off
            by default.
          </li>
          <li>
            <strong>Efficient Route (v1.1):</strong> Plan an efficient route inside Efficiver and
            open it in Apple or Google Maps. Efficiver logs the drive in the background and saves it
            when you arrive.
          </li>
          <li>
            <strong>Wallet Watch (v1.1):</strong> See your fuel and CO₂ savings in your local
            currency, per session and per month.
          </li>
          <li>
            <strong>Accessibility (v1.2):</strong> Full VoiceOver support, Dynamic Type (default
            through AX5), Reduce Motion, Reduce Transparency, Differentiate Without Color, Bold
            Text, and lifecycle announcements.
          </li>
          <li>
            <strong>Voice Guidance:</strong> Audio feedback in multiple languages to help you drive
            better.
          </li>
          <li>
            <strong>Auto-Start/Stop:</strong> Automatically begins and ends drives when you
            start/stop moving.
          </li>
          <li>
            <strong>Mistake Detection:</strong> Tracks harsh acceleration, braking, and excessive
            idling.
          </li>
          <li>
            <strong>Gear Recommendations:</strong> Suggests optimal gear changes for manual
            transmissions.
          </li>
          <li>
            <strong>Session History:</strong> Detailed analytics for each of your driving sessions.
          </li>
          <li>
            <strong>GPS Required:</strong> Speed, distance, route, and scoring come from your
            iPhone's GPS. Best results outdoors with a clear view of the sky. The app shows an
            orange <em>"GPS Warming Up"</em> label for the first few seconds, and a red
            <em>"Low GPS"</em> label whenever signal accuracy drops below ~30 m.
          </li>
          <li>
            <strong>Offline Operation:</strong> Works offline with GPS signal; all data stays on
            your iPhone unless you opt in to iCloud sync.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 3: Driving Interface -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Driving Interface</h2>
      <div class="opacity-80">
        <p>The drive screen has two pages — swipe up to switch.</p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Page 1 — Gauge + Metrics</h3>
        <ul class="list-disc pl-6">
          <li><strong>Speed Display:</strong> Your current speed with efficiency color coding</li>
          <li>
            <strong>Efficiency Score:</strong> Real-time percentage showing driving efficiency
          </li>
          <li><strong>Altitude:</strong> Current elevation (affects fuel consumption)</li>
          <li><strong>Temperature:</strong> Weather temperature (optional, requires location)</li>
          <li><strong>GPS Status:</strong> Signal strength indicator</li>
          <li><strong>Distance:</strong> Total distance traveled in current session</li>
          <li><strong>Elevation Change:</strong> Total altitude gained / lost</li>
          <li><strong>Mistakes:</strong> Counts of harsh accelerations and braking events</li>
          <li>
            <strong>Gear & Idle:</strong> Recommended gear, idle time, engine-status indicator
          </li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Page 2 — Live drive map (v1.2)</h3>
        <ul class="list-disc pl-6">
          <li>Full-screen Apple Maps view that follows you smoothly as you drive</li>
          <li>Pinch to zoom, two-finger drag to rotate</li>
          <li>+/- and recenter buttons in the corner</li>
          <li>
            Colored markers along your route — green (clean), orange (minor event), red (major
            event)
          </li>
          <li>
            Paused with a placeholder when iPhone is in Low Power Mode and Prioritize Low Power is
            on
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 4: Efficient-Driving Tips -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Efficient-Driving Tips</h2>
      <div class="opacity-80">
        <h3 class="text-xl font-semibold mt-4 mb-2">General Efficiency Tips</h3>
        <ul class="list-disc pl-6">
          <li>Maintain steady speeds and avoid rapid acceleration</li>
          <li>
            Anticipate traffic flow and brake gently. Coasting towards a stoplight rather than
            braking abruptly will boost your efficiency score.
          </li>
          <li>
            Avoid quick starts from traffic lights — gentle acceleration saves fuel and raises your
            score
          </li>
          <li>Use appropriate gears for your speed (manual transmission)</li>
          <li>Minimize idling — turn off the engine when stopped for more than ~10 seconds</li>
          <li>Keep tires properly inflated and the vehicle well-maintained</li>
          <li>Reduce unnecessary weight in your vehicle</li>
          <li>Plan routes to avoid heavy traffic when possible</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Understanding Your Score</h3>
        <ul class="list-disc pl-6">
          <li><strong>80-100%:</strong> Excellent driving</li>
          <li><strong>60-79%:</strong> Good performance with room for improvement</li>
          <li><strong>40-59%:</strong> Moderate efficiency, focus on reducing mistakes</li>
          <li><strong>0-39%:</strong> Significant improvement needed</li>
        </ul>
        <p class="mt-4">
          <strong>Note:</strong> <em>Harsh braking detection</em> is more sensitive than
          acceleration to encourage smoother, safer driving and better fuel efficiency.
        </p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Vehicle-Specific Tips</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>Petrol/Diesel:</strong> Focus on smooth acceleration and optimal gear usage
          </li>
          <li><strong>Electric:</strong> Maintain steady speeds to optimize battery range</li>
          <li>
            <strong>Manual Transmission:</strong> Follow the optimal gear from Voice Guidance or the
            Gear Indicator
          </li>
          <li>
            <strong>Automatic Transmission:</strong> Let the vehicle manage gear shifts naturally
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 5: Troubleshooting -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Troubleshooting</h2>
      <div class="opacity-80">
        <p>If something isn't working right, try these common fixes first.</p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Common Issues</h3>
        <dl class="space-y-4">
          <dt class="font-semibold">App not detecting drives automatically</dt>
          <dd>
            Ensure <em>Auto-Start Drive</em> and <em>Auto-Stop Drive</em> are enabled in
            <em>Settings → Driving</em>. Grant Motion &amp; Fitness permission in
            <em>iOS Settings → Privacy &amp; Security</em>.
          </dd>

          <dt class="font-semibold">Engine detection not working properly</dt>
          <dd>
            Re-run Smart Detection calibration while your vehicle is stationary and the engine is
            warm. Ensure your phone is securely mounted so the app can record your engine's unique
            vibration signature accurately.
          </dd>

          <dt class="font-semibold">No voice feedback</dt>
          <dd>
            Check <em>Settings → Voice → Voice Assistance</em>. Verify device volume and Do Not
            Disturb settings. Try changing the voice language.
          </dd>

          <dt class="font-semibold">GPS signal weak or accuracy degraded</dt>
          <dd>
            GPS is <em>required</em> for Efficiver to function, and accuracy matters as much as
            signal presence. Watch for the orange <em>"GPS Warming Up"</em> label at the start of
            each drive — wait for it to clear before relying on the score. A red
            <em>"Low GPS"</em> label (and the
            <em>"GPS Signal Weak — Scores may be affected"</em> banner on the gauge) means signal
            accuracy has dropped below the ~30 m threshold; scoring continues but accuracy may be
            reduced. To fix: ensure location permissions are granted and
            <em>Precise Location</em> is enabled in
            <em>iOS Settings → Privacy &amp; Security → Location Services → Efficiver</em>. Drive
            outdoors with a clear view of the sky. After exiting a tunnel or underground area,
            expect a one-or-two-second recovery before scoring resumes normally.
          </dd>

          <dt class="font-semibold">High battery usage during drives</dt>
          <dd>
            Enable <em>Prioritize Low Power</em> in <em>Settings → General</em>. With iOS Low Power
            Mode on, the live drive map automatically pauses (v1.2).
          </dd>

          <dt class="font-semibold">iCloud sync not working</dt>
          <dd>
            Ensure you're signed in to the same iCloud account on each device, and that
            <em>iCloud Drive</em> is enabled in <em>iOS Settings → [Your Name] → iCloud</em>.
            Initial sync may take a minute. Sessions sync incrementally as you save them.
          </dd>

          <dt class="font-semibold">Live drive map looks blank or laggy</dt>
          <dd>
            Confirm <em>Apple Maps</em> is enabled in <em>Settings → General</em>. Check for an iOS
            update; map tile rendering benefits from recent iOS versions. Disable Low Power Mode if
            you want the map active.
          </dd>

          <dt class="font-semibold">Incorrect vehicle parameters</dt>
          <dd>
            Go to <em>Settings → Vehicle</em> and update fuel type, engine size, and transmission to
            match your actual vehicle.
          </dd>

          <dt class="font-semibold">App not responding or crashing</dt>
          <dd>
            Force quit and restart the app. Check for iOS updates. If issues persist, contact
            <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>
            with your iOS version and phone model.
          </dd>
        </dl>
      </div>
    </section>

    <!-- Section 6: Settings & Customization -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Settings & Customization</h2>
      <div class="opacity-80">
        <h3 class="text-xl font-semibold mt-4 mb-2">User Mode</h3>
        <ul class="list-disc pl-6">
          <li><strong>Technical:</strong> Detailed vehicle settings and advanced options</li>
          <li><strong>Non-Technical:</strong> Simplified interface with guided explanations</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Vehicle</h3>
        <ul class="list-disc pl-6">
          <li><strong>Fuel Type:</strong> Petrol, Diesel, or Electric</li>
          <li><strong>Engine Size:</strong> Capacity in cc (petrol/diesel) or kW (electric)</li>
          <li>
            <strong>Transmission:</strong> Specify if the vehicle has an automatic transmission
          </li>
          <li><strong>Turbocharged:</strong> Enable for turbo engines</li>
          <li><strong>Number of Gears:</strong> For manual transmissions (4-8 gears)</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Driving</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>Proficiency Level:</strong> 1-5 scale (1=Beginner, 5=Expert) — adjusts feedback
            sensitivity
          </li>
          <li>
            <strong>Auto-Start Drive:</strong> Automatically begin tracking when vehicle moves
          </li>
          <li><strong>Auto-Stop Drive:</strong> Automatically end tracking when vehicle stops</li>
          <li>
            <strong>Auto-Track Drive:</strong> Background-log a drive when you start it from
            Efficient Route in Apple/Google Maps
          </li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Voice</h3>
        <ul class="list-disc pl-6">
          <li><strong>Voice Assistance:</strong> Enable / disable audio feedback</li>
          <li><strong>Language:</strong> Choose from available voice languages</li>
          <li><strong>Voice Volume:</strong> Adjust feedback loudness</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">General</h3>
        <ul class="list-disc pl-6">
          <li><strong>Units:</strong> Kilometers / Miles or Liters / Gallons</li>
          <li>
            <strong>Prioritize Low Power:</strong> Battery-saving mode (pauses the live map in iOS
            Low Power Mode)
          </li>
          <li><strong>Apple Maps:</strong> Enable the live drive map (increases battery usage)</li>
          <li><strong>Temperature in Gauge:</strong> Show weather temperature</li>
          <li>
            <strong>iCloud sync:</strong> Sync sessions and the Smart Detection model across your
            devices via your private iCloud database. Off by default.
          </li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Savings</h3>
        <p class="mb-2">
          Umbrella for savings-related sub-features. Currently contains Wallet Watch (fuel / energy
          cost tracking); more sub-features will land in future releases.
        </p>
        <h4 class="font-semibold mt-3 mb-1">Wallet Watch</h4>
        <ul class="list-disc pl-6">
          <li><strong>Fuel Price:</strong> Set per litre / gallon in your local currency</li>
          <li><strong>Baseline Consumption:</strong> Your vehicle's typical fuel economy</li>
          <li><strong>Currency:</strong> Auto-detected from your iOS region; override if needed</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Security</h3>
        <ul class="list-disc pl-6">
          <li><strong>Biometric Lock:</strong> Face ID / Touch ID protection on app launch</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Accessibility (v1.2)</h3>
        <p>
          Efficiver respects every iOS accessibility setting from
          <em>iOS Settings → Accessibility</em>. No special in-app toggle is needed:
        </p>
        <ul class="list-disc pl-6">
          <li>VoiceOver — full support across every screen + drive lifecycle announcements</li>
          <li>Dynamic Type — default size through AX5</li>
          <li>Reduce Motion — animation gating across the app</li>
          <li>Reduce Transparency — Material backgrounds fall back to solids</li>
          <li>Differentiate Without Color — markers carry shape + label</li>
          <li>Bold Text — semantic text bolds; brand title font is a known limitation</li>
        </ul>
      </div>
    </section>

    <!-- Section 7: Session History -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Session History & Analytics</h2>
      <div class="opacity-80">
        <p>Track your driving improvement over time with detailed session analytics.</p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Session Details</h3>
        <ul class="list-disc pl-6">
          <li><strong>Efficiency Score:</strong> Overall session performance</li>
          <li><strong>Distance:</strong> Total kilometres / miles driven</li>
          <li><strong>Duration:</strong> Total time of the driving session</li>
          <li><strong>Mistakes:</strong> Breakdown of acceleration, braking, and idle events</li>
          <li><strong>Fuel Savings:</strong> Estimated fuel / electricity saved (Wallet Watch)</li>
          <li><strong>Environmental Impact:</strong> CO₂ emissions avoided (Wallet Watch)</li>
          <li><strong>Route card:</strong> Past-trip map with per-waypoint event markers (v1.2)</li>
          <li><strong>Notes:</strong> Tap to add a note (up to 255 characters, v1.1)</li>
          <li><strong>Rename:</strong> Tap the title to rename the session inline (v1.1)</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Analytics Features</h3>
        <ul class="list-disc pl-6">
          <li><strong>Average Score Card:</strong> Overall performance across all sessions</li>
          <li><strong>Session Comparison:</strong> Track improvement over time</li>
          <li><strong>Detailed Breakdown:</strong> Per-session analysis with timestamps</li>
        </ul>
      </div>
    </section>

    <!-- Section 8: Privacy & Data -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Privacy & Data Security</h2>
      <div class="opacity-80">
        <p>
          Efficiver is designed with privacy-first principles. By default, all your driving data
          stays on your iPhone. See the full
          <a href="#privacy" class="underline">Privacy Policy</a> for details.
        </p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Data Storage</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>Local Only by default:</strong> Driving sessions, vehicle settings, and the
            trained Smart Detection model are stored locally in SwiftData on your iPhone.
          </li>
          <li>
            <strong>Optional iCloud sync (v1.2):</strong> If enabled, sessions and the Smart
            Detection model sync via <em>your</em> private iCloud database. Efficiver has no access
            to it.
          </li>
          <li>
            <strong>No third-party servers:</strong> No analytics SDKs, no advertising IDs, no
            telemetry.
          </li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Permissions</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>Location:</strong> <em>Required</em> for GPS tracking and efficiency
            calculations
          </li>
          <li>
            <strong>Motion &amp; Fitness:</strong> Used for auto-start/stop and engine detection
          </li>
          <li>
            <strong>Speech Recognition:</strong> Optional, for voice commands (future feature)
          </li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Data Deletion</h3>
        <ul class="list-disc pl-6">
          <li>Delete individual sessions from history</li>
          <li>Reset all settings to defaults</li>
          <li>Uninstall the app to remove all locally-stored data</li>
          <li>
            Disable iCloud sync to stop adding new cloud-stored sessions; previously synced sessions
            remain on whichever device created them until you delete them
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 9: Support & Contact -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Support & Contact</h2>
      <div class="opacity-80">
        <p>Need help? We're here.</p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Contact Information</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>Email:</strong>
            <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>
          </li>
          <li><strong>Website:</strong> www.efficiver.com</li>
          <li><strong>Response Time:</strong> We aim to respond within a few business days</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Before Contacting Support</h3>
        <ul class="list-disc pl-6">
          <li>Check this help page for solutions to common issues</li>
          <li>Ensure your app is updated to the latest version (currently v1.2)</li>
          <li>Note your iOS version and iPhone model</li>
          <li>Include screenshots if describing visual issues</li>
          <li>Describe the problem with specific steps to reproduce</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Quick FAQ</h3>
        <dl class="space-y-4">
          <dt class="font-semibold">Does Efficiver work with all vehicles?</dt>
          <dd>
            Yes — Efficiver works with petrol, diesel, hybrid, and electric vehicles of all makes
            and models.
          </dd>

          <dt class="font-semibold">Is Efficiver free?</dt>
          <dd>Yes. All features are free, with no in-app purchases.</dd>

          <dt class="font-semibold">Does Efficiver require internet?</dt>
          <dd>
            No, Efficiver works completely offline using only your phone's sensors. Internet is
            optional and only used for iCloud sync (if enabled) and weather (via Apple WeatherKit).
          </dd>

          <dt class="font-semibold">How accurate is the efficiency scoring?</dt>
          <dd>
            The scoring is based on real driving physics and calibrated for accuracy, though
            individual results may vary based on vehicle condition and driving conditions.
          </dd>

          <dt class="font-semibold">Can I use Efficiver while driving?</dt>
          <dd>
            Efficiver is designed for hands-free use via voice feedback. Do not manually operate the
            App while driving — use a passenger or pull over to interact with the screen. See
            <a href="#terms" class="underline">Terms of Use</a> §3.
          </dd>
        </dl>
      </div>
    </section>

    <!-- Section 10: Updates & Roadmap -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Updates & Roadmap</h2>
      <div class="opacity-80">
        <p>
          We regularly update Efficiver with new features and improvements. Check the App Store for
          updates, or read the full
          <a href="#releases" class="underline">release notes</a>.
        </p>
        <h3 class="text-xl font-semibold mt-4 mb-2">Recently Shipped</h3>
        <ul class="list-disc pl-6">
          <li>
            <strong>v1.2 (May 2026):</strong> Live drive map with per-waypoint event markers, iCloud
            sync across your devices, deep accessibility pass, Low Power Mode-aware map
          </li>
          <li>
            <strong>v1.1 (May 2026):</strong> Smart Detection auto-calibration, Efficient Route
            planning, Wallet Watch fuel + CO₂ savings, in-drive session rename + notes
          </li>
          <li>
            <strong>v1.0.x (Q1-Q2 2026):</strong> Initial release with vibration-based engine
            detection, voice feedback in multiple languages, biometric lock, weather integration
          </li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">On the Roadmap</h3>
        <ul class="list-disc pl-6">
          <li>Android port — in active development</li>
          <li>Apple Watch companion app — a future release</li>
          <li>Foundation Models-powered session summarisation</li>
        </ul>
        <p class="mt-4 text-sm">
          Efficiver ships today on iOS (iPhone, iPad, CarPlay). An Android port is in active
          development — we don't have a public release date yet, and we'll announce beta sign-up
          when one is open.
        </p>
      </div>
    </section>
  </div>
</template>
