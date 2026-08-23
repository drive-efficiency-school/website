<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Button } from './ui/button'
  import { Card, CardHeader, CardContent } from './ui/card'
  import { Label } from './ui/label'
  import { Input } from './ui/input'
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

  import { AlertCircle, CheckCircle, Loader2, Mail } from 'lucide-vue-next'
  import { apiService, type NewsletterSubscriptionData } from '@/lib/api'
  import TurnstileWidget from './TurnstileWidget.vue'

  interface NewsletterFormProps {
    email: string
    name: string
    preferences: string[]
  }

  const newsletterForm = reactive<NewsletterFormProps>({
    email: '',
    name: '',
    preferences: []
  })

  const availablePreferences = [
    { id: 'technology', label: 'Technology Updates' },
    { id: 'business', label: 'Business Insights' },
    { id: 'sustainability', label: 'Sustainability' },
    { id: 'product', label: 'Product News' }
  ]

  const isSubmitting = ref(false)
  const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
  const errorMessage = ref('')
  const successMessage = ref('')
  const isNewSubscriber = ref(true)

  // Anti-spam: hidden honeypot (real users leave it blank) + Turnstile token.
  const honeypot = ref('')
  const turnstileToken = ref('')
  const turnstileRef = ref<InstanceType<typeof TurnstileWidget> | null>(null)

  const handleSubmit = async () => {
    if (isSubmitting.value) return

    isSubmitting.value = true
    submitStatus.value = 'idle'
    errorMessage.value = ''

    try {
      const formData: NewsletterSubscriptionData = {
        email: newsletterForm.email,
        name: newsletterForm.name || undefined,
        preferences: newsletterForm.preferences.length > 0 ? newsletterForm.preferences : undefined,
        // source intentionally omitted — api.ts defaults it to config.contact.website (.env-driven)
        honeypot: honeypot.value || undefined,
        turnstileToken: turnstileToken.value || undefined
      }

      const result = await apiService.subscribeToNewsletter(formData)
      submitStatus.value = 'success'

      // Use the message from API response
      successMessage.value = result.message
      isNewSubscriber.value = result.isNew

      // Reset form on success
      Object.assign(newsletterForm, {
        email: '',
        name: '',
        preferences: []
      })
    } catch (error) {
      submitStatus.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred'
    } finally {
      isSubmitting.value = false
      // Turnstile tokens are single-use — refresh for any subsequent submit.
      honeypot.value = ''
      turnstileToken.value = ''
      turnstileRef.value?.reset()
    }
  }

  const togglePreference = (preferenceId: string) => {
    const index = newsletterForm.preferences.indexOf(preferenceId)
    if (index > -1) {
      newsletterForm.preferences.splice(index, 1)
    } else {
      newsletterForm.preferences.push(preferenceId)
    }
  }
</script>

<template>
  <Card class="bg-muted/60 dark:bg-card">
    <CardHeader class="text-center">
      <div
        class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
      >
        <Mail class="h-6 w-6 text-primary" />
      </div>
      <h3 class="text-xl font-semibold">Stay Updated</h3>
      <p class="text-sm text-muted-foreground">
        Get the latest updates on Efficiver and sustainable driving solutions.
      </p>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2 text-left">
          <Label for="newsletter-email">Email Address *</Label>
          <Input
            id="newsletter-email"
            v-model="newsletterForm.email"
            name="email"
            autocomplete="email"
            type="email"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div class="space-y-2 text-left">
          <Label for="newsletter-name">Name (Optional)</Label>
          <Input
            id="newsletter-name"
            v-model="newsletterForm.name"
            name="name"
            autocomplete="name"
            type="text"
            placeholder="Your Name"
          />
        </div>

        <div class="space-y-2 text-left">
          <div
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Interests (Optional)
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="pref in availablePreferences"
              :key="pref.id"
              type="button"
              :class="[
                'px-3 py-1 text-sm rounded-full border transition-colors',
                newsletterForm.preferences.includes(pref.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent'
              ]"
              @click="togglePreference(pref.id)"
            >
              {{ pref.label }}
            </button>
          </div>
        </div>

        <!-- Honeypot: hidden from real users; bots that fill it are dropped. -->
        <div class="hidden" aria-hidden="true">
          <label for="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            v-model="honeypot"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <TurnstileWidget ref="turnstileRef" v-model="turnstileToken" />

        <Alert v-if="submitStatus === 'error'" variant="destructive">
          <AlertCircle class="w-4 h-4" />
          <AlertTitle>Subscription Failed</AlertTitle>
          <AlertDescription>
            {{ errorMessage || 'Unable to subscribe to newsletter. Please try again.' }}
          </AlertDescription>
        </Alert>

        <Alert
          v-if="submitStatus === 'success'"
          variant="default"
          class="border-green-200 bg-green-50 text-green-800"
        >
          <CheckCircle class="w-4 h-4" />
          <AlertTitle>{{ isNewSubscriber ? 'Subscribed!' : 'Already Subscribed' }}</AlertTitle>
          <AlertDescription>
            {{ successMessage || "Thank you for subscribing! You'll receive updates soon." }}
          </AlertDescription>
        </Alert>

        <Button class="w-full" :disabled="isSubmitting" type="submit">
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          {{ isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter' }}
        </Button>
      </form>

      <p class="text-xs text-muted-foreground mt-4 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </CardContent>
  </Card>
</template>
