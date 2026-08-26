<script setup lang="ts">
  import { config } from '@/lib/config'
</script>

<template>
  <div class="container mx-auto px-6 sm:px-8 py-12 sm:py-16">
    <h1 class="text-3xl font-bold mb-6 text-center">Terms of Use for Efficiver</h1>

    <p class="text-center text-sm text-muted-foreground mb-10">
      Last updated: {{ config.lastUpdated.terms }}
    </p>

    <!-- Section 1: Acceptance of Terms -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <div class="opacity-80">
        <p>
          By downloading, installing, or using the Efficiver mobile app for iPhone or Android (the
          "App") or accessing efficiver.com (the "Website"), you agree to these Terms of Use. If you
          do not agree, please do not use the App or the Website.
        </p>
      </div>
    </section>

    <!-- Section 2: License to Use -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. License to Use</h2>
      <div class="opacity-80">
        <p>
          Efficiver grants you a limited, non-exclusive, non-transferable, revocable license to
          download and use the App on your iPhone or Android device. Personal use is free. Using
          Efficiver for work — where an employer receives the drives you record while on duty — is
          provided through <strong>Efficiver Fleet</strong>, under that fleet's agreement with
          Efficiver; see section 3 of our <a href="#privacy" class="underline">Privacy Policy</a>.
          You may not:
        </p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>Modify, adapt, translate, decompile, reverse-engineer, or disassemble the App</li>
          <li>
            Use the App for commercial fleet, ride-share, or driving-school operations other than
            through Efficiver Fleet or a separate written agreement with Efficiver
          </li>
          <li>Remove any copyright, trademark, or other proprietary notices</li>
          <li>Use the App or Website in violation of any applicable law</li>
          <li>Attempt unauthorized access to the App, Website, or any connected systems</li>
        </ul>
      </div>
    </section>

    <!-- Section 3: Driving Safety & User Responsibility — KEY -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">3. Driving Safety & User Responsibility</h2>
      <div class="opacity-80">
        <p class="font-semibold">
          Efficiver provides informational feedback about your driving. It is NOT a navigation
          system, a collision-avoidance system, or a safety-critical aid. You remain fully
          responsible for safe operation of your vehicle at all times.
        </p>
        <ul class="list-disc pl-6 mt-4 space-y-2">
          <li>
            <strong>Do not manually operate the App while driving.</strong> Voice cues and
            hands-free use are the intended interaction mode. Use a passenger to interact with the
            screen, or pull over safely first.
          </li>
          <li>
            Efficiency Scores, route suggestions, and on-screen feedback are estimates and may not
            reflect actual conditions on the road.
          </li>
          <li>
            Efficiver depends on your device's built-in GPS (Apple's Core Location service on
            iPhone, Android's location services on Android) for speed, distance, route, and scoring.
            GPS accuracy may be reduced or unavailable in tunnels, underground parking, urban
            canyons, or under heavy tree cover, and brief GPS recovery events can produce transient
            inaccuracies in distance, idle time, or harsh-event detection that self-correct on the
            next clean fix. Efficiver shows on-screen GPS-quality indicators ("GPS Warming Up" and
            "Low GPS") but does not control GPS accuracy and is not liable for scoring or route
            inaccuracies caused by GPS conditions outside of its control.
          </li>
          <li>
            Always obey traffic laws, signs, signals, and road conditions. Use your own judgment. Do
            not follow App suggestions if doing so would be unsafe or illegal.
          </li>
          <li>
            Efficiver is not a substitute for safe driving practices, defensive driving, vehicle
            maintenance, or driver training.
          </li>
          <li>
            You acknowledge that Efficiver and its affiliates are not liable for accidents, damage,
            injury, or any other harm arising from your use of the App while driving.
          </li>
        </ul>
      </div>
    </section>

    <!-- Section 4: Disclaimer of Warranties -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. Disclaimer of Warranties</h2>
      <div class="opacity-80">
        <p>
          The App and Website are provided "AS IS" and "AS AVAILABLE" without warranties of any
          kind, express or implied, including but not limited to merchantability, fitness for a
          particular purpose, or non-infringement. Efficiver does not warrant that the App or
          Website will be uninterrupted, error-free, or accurate. Use is at your own risk. Your
          statutory rights are not affected.
        </p>
      </div>
    </section>

    <!-- Section 5: Limitation of Liability -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
      <div class="opacity-80">
        <p>
          To the maximum extent permitted by law, Efficiver and its affiliates shall not be liable
          for any direct, indirect, incidental, consequential, special, or punitive damages arising
          out of or in connection with your use of the App or Website. This includes, but is not
          limited to, lost data, lost profits, vehicle damage, personal injury, or any third-party
          claims. Some jurisdictions do not allow limitations on implied warranties or consequential
          damages; in those jurisdictions, these limitations apply to the maximum extent permitted.
        </p>
      </div>
    </section>

    <!-- Section 6: Privacy -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Privacy</h2>
      <div class="opacity-80">
        <p>
          Your use of the App and Website is also governed by our
          <a href="#privacy" class="underline">Privacy Policy</a>, which describes what data is
          collected, how it is used, and your rights. Please review it.
        </p>
      </div>
    </section>

    <!-- Section 7: Changes to Terms -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
      <div class="opacity-80">
        <p>
          Efficiver may update these Terms from time to time. The "Last updated" date at the top of
          this page reflects the most recent change. Continued use of the App or Website after a
          change constitutes acceptance of the updated Terms. Material changes will be highlighted
          on the Website and in the App's What's New screen.
        </p>
      </div>
    </section>

    <!-- Section 8: Termination -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">8. Termination</h2>
      <div class="opacity-80">
        <p>
          Efficiver may suspend or terminate your access to the App or Website at any time, for any
          reason, including violation of these Terms. Upon termination, your license to use the App
          ends and you must delete any copies in your possession. You may delete the App and
          unsubscribe from any communications at any time.
        </p>
      </div>
    </section>

    <!-- Section 9: Governing Law -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">9. Governing Law</h2>
      <div class="opacity-80">
        <p>
          Efficiver is a trademark registered in India. These Terms shall be governed by and
          construed in accordance with the laws of the Republic of India, without regard to its
          conflict-of-law provisions. Any disputes arising out of or relating to these Terms or your
          use of the App or Website shall be subject to the exclusive jurisdiction of the competent
          courts in India.
        </p>
      </div>
    </section>

    <!-- Section 10: Contact -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">10. Contact</h2>
      <div class="opacity-80">
        <p>
          For questions about these Terms, email
          <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>
