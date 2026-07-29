<script setup lang="ts">
  /**
   * Efficiver Fleet callout — two audiences, two different honest actions.
   *
   * DRIVERS get no button on purpose: joining is invite-only (a code minted
   * by their employer's fleet), so the only real action is "ask your
   * employer". A CTA that cannot be completed would be worse than none.
   *
   * OPERATORS get "Coming Soon" + interest capture rather than a link into
   * the portal, because (a) production still runs TEST-mode payment keys
   * until the owner's live cutover, so a real company cannot be charged
   * yet, and (b) the portal has no public entry point — subscribe/:token
   * is the only anonymous page and it needs a token. Flipping this to a
   * "Get started" link after the live cutover is a one-line change.
   *
   * Interest capture reuses the existing contact-form service (no new
   * endpoint); the subject tags it so fleet leads are filterable.
   */
  import { ref } from 'vue'
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { apiService, type ContactFormData } from '@/lib/api'

  const email = ref('')
  const company = ref('')
  const honeypot = ref('')
  const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function register() {
    if (status.value === 'sending') return
    status.value = 'sending'
    try {
      const payload: ContactFormData = {
        name: company.value || 'Fleet enquiry',
        email: email.value,
        company: company.value,
        subject: 'Efficiver Fleet — register interest',
        message: `Fleet interest registered from the website.\nCompany: ${company.value || '(not given)'}`,
        honeypot: honeypot.value
      }
      await apiService.submitContactForm(payload)
      status.value = 'success'
      email.value = ''
      company.value = ''
    } catch {
      status.value = 'error'
    }
  }
</script>

<template>
  <section id="fleet" class="container py-24 sm:py-32">
    <h2 class="text-lg text-primary text-center mb-2 tracking-wider">Efficiver Fleet</h2>

    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">Driving for work?</h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
      The same app your drivers already use, with the trip records and coaching a fleet needs — no
      hardware, no trackers to fit.
    </h3>

    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- Drivers: invite-only, so deliberately no CTA button. -->
      <Card class="flex flex-col">
        <CardHeader>
          <CardTitle class="text-xl">Driving for a fleet?</CardTitle>
        </CardHeader>
        <CardContent class="flex-1 text-muted-foreground space-y-3">
          <p>
            Efficiver Fleet is invite-based. Your employer gives you a code — enter it in the app
            under <strong class="text-foreground">Settings → Join a fleet</strong>.
          </p>
          <p>
            Only the drives you record while you are
            <strong class="text-foreground">on duty</strong> are shared with your fleet. Off-duty
            drives stay on your phone, and you can leave the fleet at any time.
          </p>
          <p class="text-sm">No code yet? Ask your employer — we can't issue one for you.</p>
        </CardContent>
      </Card>

      <!-- Operators: coming soon + interest capture. -->
      <Card class="flex flex-col border-primary">
        <CardHeader>
          <div class="flex items-center gap-3">
            <CardTitle class="text-xl">Run a fleet?</CardTitle>
            <span
              class="rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1"
              data-testid="fleet-coming-soon"
            >
              Coming soon
            </span>
          </div>
        </CardHeader>
        <CardContent class="flex-1 text-muted-foreground space-y-4">
          <p>
            Trip records, driver scores and coaching from the phones your drivers already carry. We
            are onboarding fleets soon — tell us about yours and we'll get in touch.
          </p>

          <form v-if="status !== 'success'" class="space-y-3" @submit.prevent="register">
            <Input
              v-model="company"
              type="text"
              name="company"
              placeholder="Company or fleet name"
              autocomplete="organization"
              aria-label="Company or fleet name"
            />
            <Input
              v-model="email"
              type="email"
              name="email"
              required
              placeholder="Work email"
              autocomplete="email"
              aria-label="Work email"
            />
            <!-- Anti-spam honeypot: mirrors the contact + newsletter forms. -->
            <input
              v-model="honeypot"
              type="text"
              name="company_website"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
              class="hidden"
            />
            <Button type="submit" class="w-full" :disabled="status === 'sending'">
              {{ status === 'sending' ? 'Sending…' : 'Register your interest' }}
            </Button>
            <p v-if="status === 'error'" class="text-sm text-destructive" role="alert">
              Something went wrong. Please email
              <a href="mailto:contact@efficiver.com" class="underline">contact@efficiver.com</a>.
            </p>
          </form>

          <p v-else class="text-sm text-foreground" role="status">
            Thanks — we have your details and will be in touch.
          </p>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
