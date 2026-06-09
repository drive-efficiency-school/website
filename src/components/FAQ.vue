<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  } from '@/components/ui/accordion'

  interface FAQProps {
    question: string
    answer: string
    value: string
  }

  const FAQList: FAQProps[] = [
    {
      question: 'How does Efficiver detect my engine without hardware?',
      answer:
        "Efficiver uses your iPhone's built-in accelerometer to detect vehicle vibration patterns. This allows us to identify engine type (petrol, diesel, EV) and driving behavior without any external hardware or OBD dongles.",
      value: 'item-1'
    },
    {
      question: 'Does Efficiver require internet or hardware?',
      answer:
        "No. Efficiver works completely offline using your device's sensors - no internet connection or external hardware is needed. Your data never leaves your phone.",
      value: 'item-2'
    },
    {
      question: 'What cars are supported?',
      answer:
        'Efficiver works with all vehicles - petrol, diesel, hybrid, and electric. The app automatically calibrates to your specific vehicle during the first few drives.',
      value: 'item-3'
    },
    {
      question: 'How much fuel can I save with Efficiver?',
      answer:
        'Industry studies show that efficient-driving techniques typically save 8-22% on fuel depending on habits and vehicle. Efficiver gives you real-time feedback so you can adopt those techniques — your actual savings depend on how much you adjust.',
      value: 'item-4'
    },
    {
      question: 'Does Efficiver need a clear GPS signal to work?',
      answer:
        'Yes. Speed, distance, route, and scoring all come from your iPhone\'s GPS, so GPS accuracy directly affects your Efficiency Score. Efficiver shows an orange "GPS Warming Up" label for the first few seconds of every drive and a red "Low GPS" label (plus a "GPS Signal Weak — Scores may be affected" banner) whenever signal accuracy drops. Scoring continues during weak signal so you don\'t lose your drive, but accuracy may be reduced. Best results outdoors with a clear view of the sky — tunnels, underground parking, dense tree cover, and tall buildings (urban canyons) can degrade accuracy and cause brief glitches such as a small jump in distance, a stray harsh-event flag on signal recovery, or the idle timer triggering while you\'re actually moving through a tunnel. These self-correct on the next good fix.',
      value: 'item-gps'
    },
    {
      question: 'Is my data safe with Efficiver?',
      answer:
        "Yes. Your driving data stays on your iPhone, stored locally. iCloud sync is optional and uses your own private iCloud database — never Efficiver's servers. We don't collect, store, or sell your driving data. Privacy is built in.",
      value: 'item-5'
    },
    {
      question: 'What are the pricing plans for Efficiver?',
      answer:
        'Efficiver is currently free, with all features included. No in-app purchases. Future pricing has not been decided.',
      value: 'item-6'
    },
    {
      question: 'Which devices are compatible with Efficiver?',
      answer:
        "Efficiver runs on iPhones with iOS 18 or later, and on iPad, with CarPlay support in v1.3. An Apple Watch companion is on the roadmap for a future release. An Android port is in active development — we don't have a public release date yet, and we'll announce beta sign-up here when one is open.",
      value: 'item-7'
    },
    {
      question: 'How is Efficiver different from OBD dongle apps?',
      answer:
        "Unlike OBD apps that require $50+ hardware dongles, Efficiver works with just your iPhone. No cables, no Bluetooth pairing issues, no battery drain from external devices - and it's completely free.",
      value: 'item-8'
    },
    {
      question: 'How can I get support for Efficiver?',
      answer:
        'Our support team is here to help! Contact us at contact@efficiver.com for assistance or visit our FAQ section for quick answers.',
      value: 'item-9'
    },
    {
      question: 'What happened to Efficient Driver?',
      answer:
        'We have rebranded to Efficiver – shorter, catchier, and reflects our mission to make every drive more efficient. Same great app, same team, just a better name!',
      value: 'item-10'
    }
  ]
</script>

<template>
  <section id="faq" class="container md:w-[700px] py-24 sm:py-32">
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">FAQs</h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold">Frequently Asked Questions</h2>
    </div>

    <Accordion type="single" collapsible class="AccordionRoot">
      <AccordionItem v-for="{ question, answer, value } in FAQList" :key="value" :value="value">
        <AccordionTrigger class="text-left"> {{ question }} </AccordionTrigger>

        <AccordionContent>{{ answer }}</AccordionContent>
      </AccordionItem>
    </Accordion>
    <h3 class="font-medium mt-4">
      Still have questions?
      <a href="mailto:contact@efficiver.com" class="underline"
        >Contact us at contact@efficiver.com</a
      >
    </h3>
  </section>
</template>
