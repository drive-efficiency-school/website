<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { Button } from './ui/button'
  import { Card, CardHeader, CardContent, CardFooter } from './ui/card'
  import { Label } from './ui/label'
  import { Input } from './ui/input'
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
  } from './ui/select'
  import { Textarea } from './ui/textarea'
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

  import { AlertCircle, CheckCircle, Loader2 } from 'lucide-vue-next'
  import { apiService, type ContactFormData } from '@/lib/api'
  import TurnstileWidget from './TurnstileWidget.vue'

  interface ContactFormProps {
    firstName: string
    lastName: string
    email: string
    phone: string
    company: string
    subject: string
    message: string
  }

  const contactForm = reactive<ContactFormProps>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: 'General Inquiry',
    message: ''
  })

  const isSubmitting = ref(false)
  const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
  const errorMessage = ref('')

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
      const formData: ContactFormData = {
        name: `${contactForm.firstName} ${contactForm.lastName}`.trim(),
        email: contactForm.email,
        phone: contactForm.phone.trim() || undefined,
        company: contactForm.company.trim() || undefined,
        subject: contactForm.subject,
        message: contactForm.message,
        // source intentionally omitted — api.ts defaults it to config.contact.website (.env-driven)
        honeypot: honeypot.value || undefined,
        turnstileToken: turnstileToken.value || undefined
      }

      await apiService.submitContactForm(formData)
      submitStatus.value = 'success'

      // Reset form on success
      Object.assign(contactForm, {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: 'General Inquiry',
        message: ''
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
</script>

<template>
  <section id="contact" class="container py-24 sm:py-32">
    <div class="flex flex-col items-center gap-12">
      <!-- Header -->
      <div class="text-center max-w-3xl">
        <div class="mb-4">
          <h2 class="text-lg text-primary mb-2 tracking-wider">Contact</h2>
          <h2 class="text-3xl md:text-4xl font-bold">Get in Touch</h2>
        </div>
        <p class="text-muted-foreground">
          Have questions about Efficiver? Reach out to our team for support, inquiries, or feedback
          – we’re here to help you drive smarter and greener!
        </p>
      </div>

      <!-- Contact Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl"></div>

      <!-- Form -->
      <Card class="w-full max-w-3xl bg-muted/60 dark:bg-card">
        <CardHeader class="text-primary text-2xl"> </CardHeader>
        <CardContent>
          <form class="grid gap-4" @submit.prevent="handleSubmit">
            <div class="flex flex-col md:flex-row gap-8">
              <div class="flex flex-col w-full gap-1.5">
                <Label for="first-name">First Name</Label>
                <Input
                  id="first-name"
                  v-model="contactForm.firstName"
                  name="first-name"
                  autocomplete="given-name"
                  type="text"
                  required
                  placeholder="Alex"
                />
              </div>

              <div class="flex flex-col w-full gap-1.5">
                <Label for="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  v-model="contactForm.lastName"
                  name="last-name"
                  autocomplete="family-name"
                  type="text"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="contactForm.email"
                name="email"
                autocomplete="email"
                type="email"
                required
                placeholder="alex@example.com"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                v-model="contactForm.phone"
                name="phone"
                autocomplete="tel"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="company">Company (Optional)</Label>
              <Input
                id="company"
                v-model="contactForm.company"
                name="company"
                autocomplete="organization"
                type="text"
                placeholder="Your Company"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="subject">Subject</Label>

              <Select v-model="contactForm.subject" name="subject">
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                    <SelectItem value="Accessibility Feedback">Accessibility Feedback</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="message">Message</Label>
              <Textarea
                id="message"
                v-model="contactForm.message"
                name="message"
                required
                placeholder="Your message about Efficiver..."
                rows="5"
              />
            </div>

            <!-- Honeypot: hidden from real users; bots that fill it are dropped. -->
            <div class="hidden" aria-hidden="true">
              <label for="website">Website</label>
              <input
                id="website"
                v-model="honeypot"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <!-- Turnstile widget temporarily removed: the ~1KB token bloats the
                 request body, which 504s on the app10↔Cloudflare path (AWS issue,
                 not MTU — under investigation). Honeypot above stays active.
                 Re-add this line + set TURNSTILE_ENFORCED=true once AWS is fixed. -->

            <Alert v-if="submitStatus === 'error'" variant="destructive">
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {{ errorMessage || 'There was an error sending your message. Please try again.' }}
              </AlertDescription>
            </Alert>

            <Alert
              v-if="submitStatus === 'success'"
              variant="default"
              class="border-green-200 bg-green-50 text-green-800"
            >
              <CheckCircle class="w-4 h-4" />
              <AlertTitle>Message Sent!</AlertTitle>
              <AlertDescription>
                Thank you for contacting us. We'll get back to you soon!
              </AlertDescription>
            </Alert>

            <Button class="mt-4" :disabled="isSubmitting" type="submit">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Sending...' : 'Send message' }}
            </Button>
          </form>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>
    </div>
  </section>
</template>
