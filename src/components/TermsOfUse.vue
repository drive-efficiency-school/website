<script setup lang="ts">
  import { config } from '@/lib/config'
</script>

<template>
  <div class="reading-page mx-auto px-6 sm:px-8 py-12 sm:py-16">
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
          download and use the App on your iPhone or Android device. Personal use is free. Efficiver
          Pro is an optional paid subscription; see section 10. Using Efficiver for work — where an
          employer receives the drives you record while on duty — is provided through
          <strong>Efficiver Fleet</strong>, under that fleet's agreement with Efficiver; see section
          3 of our <a href="#privacy" class="underline">Privacy Policy</a>. You may not:
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

    <!-- Section 10: Efficiver Pro Subscriptions (1.7.0, plan item H). App Review needs the
         subscription terms here — both apps' paywalls link to this page. Wording owner-approved
         2026-11-06, from Apple's Media Services Terms, Google Play's subscription and price-change
         pages, and what both apps do (ProStoreCopy, ProEntitlementStore / PlayBillingEntitlementSource). -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">10. Efficiver Pro Subscriptions</h2>
      <div class="opacity-80 space-y-4">
        <p>
          <strong>10.1 What Pro is.</strong> Efficiver Pro is an optional, automatically renewing
          subscription. It adds score forecasts, driving patterns, idle-time insights, an annual
          savings projection and your full Year in Driving. Drives, scores and voice coaching stay
          free without Pro.
        </p>
        <p>
          <strong>10.2 Fees and payment.</strong> Pro is offered as a monthly or an annual plan. You
          buy it in the App through the Apple App Store or Google Play. The store shows the price in
          your local currency before you confirm, and prices vary by country. Payment is charged to
          your Apple Account or Google Account when you confirm the purchase. Your purchase is
          subject to Apple's or Google's payment terms, and Efficiver never receives your payment
          details.
        </p>
        <p>
          <strong>10.3 Automatic renewal.</strong> Your subscription renews automatically at the end
          of each monthly or annual period, and the price of the next period is charged to your
          Apple Account or Google Account, until you cancel. Apple charges no more than 24 hours
          before the next period starts. Google Play may authorise the payment up to 48 hours
          before, or up to 5 days in India and Brazil.
        </p>
        <div>
          <p>
            <strong>10.4 Cancellation.</strong> You can cancel at any time. To avoid being charged
            for the next period, cancel at least 24 hours before the current period ends, or earlier
            on Google Play as described in 10.3.
          </p>
          <ul class="list-disc pl-6 mt-2 space-y-2">
            <li>
              iPhone or iPad: Settings → your name → Subscriptions → Efficiver Pro → Cancel
              Subscription.
            </li>
            <li>
              Android: Google Play → Payments &amp; subscriptions → Subscriptions → Efficiver Pro →
              Cancel subscription.
            </li>
            <li>In the App: Settings → Efficiver Pro → Manage Subscription.</li>
          </ul>
          <p class="mt-2">
            Deleting the App does not cancel your subscription. When you cancel, Pro stays on until
            the end of the period you have already paid for, and you are not charged again.
          </p>
        </div>
        <p>
          <strong>10.5 Refunds.</strong> Refunds for purchases made through the App Store are
          handled by Apple under Apple's policies. Refunds for purchases made through Google Play
          are handled under Google Play's policies. You can request one in the App under Settings →
          Efficiver Pro → Request a Refund. Except where the law requires otherwise, Efficiver does
          not give refunds or credits for a partly used period. If a refund is granted, Pro ends.
        </p>
        <p>
          <strong>10.6 Price changes.</strong> Efficiver may change the price of Pro. A new price
          applies to an existing subscription only from a later renewal, and only after Apple or
          Google has told you about it. Where their rules or the law require it, it also applies
          only after you have agreed to it. If you do not agree, your subscription ends when the
          current period ends.
        </p>
        <p>
          <strong>10.7 Your devices.</strong> A subscription bought through the App Store works only
          in the iPhone and iPad App, and one bought through Google Play works only in the Android
          App. On a new device, use Restore Purchases.
        </p>
        <p>
          <strong>10.8 Your rights.</strong> Nothing in this section limits any rights you have
          under the consumer laws of your country.
        </p>
      </div>
    </section>

    <!-- Section 11: Contact -->
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">11. Contact</h2>
      <div class="opacity-80">
        <p>
          For questions about these Terms, email
          <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>.
        </p>
      </div>
    </section>
  </div>
</template>
