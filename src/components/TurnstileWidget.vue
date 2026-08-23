<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  import { config } from '@/lib/config'

  // Emits the current token: a non-empty string once solved, '' when it
  // resets / expires / errors. Parent binds via v-model.
  const emit = defineEmits<{ (e: 'update:modelValue', token: string): void }>()

  const container = ref<HTMLElement | null>(null)
  let widgetId: string | undefined

  const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

  function loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.turnstile) return resolve()
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error('Turnstile script failed')))
        return
      }
      const s = document.createElement('script')
      s.src = SCRIPT_SRC
      s.async = true
      s.defer = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Turnstile script failed'))
      document.head.appendChild(s)
    })
  }

  async function renderWidget() {
    try {
      await loadScript()
    } catch {
      return // offline / blocked — leave token empty; backend enforces.
    }
    if (!window.turnstile || !container.value) return
    widgetId = window.turnstile.render(container.value, {
      sitekey: config.turnstile.siteKey,
      callback: (token: string) => emit('update:modelValue', token),
      'error-callback': () => emit('update:modelValue', ''),
      'expired-callback': () => emit('update:modelValue', '')
    })
  }

  // Reset the widget (e.g. after a submit) so the next submission gets a
  // fresh single-use token. Exposed to the parent via a template ref.
  function reset() {
    if (window.turnstile && widgetId !== undefined) {
      window.turnstile.reset(widgetId)
      emit('update:modelValue', '')
    }
  }

  onMounted(renderWidget)
  onBeforeUnmount(() => {
    if (window.turnstile && widgetId !== undefined) window.turnstile.remove(widgetId)
  })

  defineExpose({ reset })
</script>

<template>
  <!-- text-left: the injected Turnstile iframe is inline, so an inherited
       text-center (e.g. the newsletter section wrapper) would center it;
       forms keep the widget left-aligned with the field stack. -->
  <div ref="container" class="text-left" />
</template>
