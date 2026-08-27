<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
  } from '@/components/ui/accordion'
  import { config } from '@/lib/config'

  interface FAQProps {
    question: string
    answer: string
    value: string
  }

  const FAQList: FAQProps[] = [
    {
      question: 'How does Efficiver detect my engine without hardware?',
      answer:
        "Efficiver uses your phone's built-in accelerometer to detect vehicle vibration patterns. An initial calibration, which you run yourself while parked, teaches it to tell your engine running from stopped — that is what drives idle detection. No external hardware or OBD dongle. You tell Efficiver your fuel type (petrol, diesel or electric) once in Settings; the app doesn't infer it.",
      value: 'item-1'
    },
    {
      question: 'Does Efficiver require internet or hardware?',
      answer:
        "No hardware, and no connection for the core of it. Recording a drive, your Efficiency Score, engine detection and your saved sessions all run on your phone's own sensors and work with no internet at all. Connected features are separate: weather, the live map, Efficient Route planning, iCloud sync on iPhone, Android's own backup, and fleet upload if you have joined one.",
      value: 'item-2'
    },
    {
      question: 'What cars are supported?',
      answer:
        'Efficiver works with petrol, diesel and electric vehicles — you pick your fuel type in Settings. Setup is an initial Smart Detection calibration that takes about two minutes while parked (roughly a minute with the engine running, then a minute with it off), plus a few seconds of training. You start it yourself; it does not happen automatically as you drive. Recalibrate from Settings → Vehicle if you change where your phone sits in the car, or start driving a different vehicle — the model is learned in that position, and the app will not detect the change for you.',
      value: 'item-3'
    },
    {
      question: 'How much fuel can efficient driving save?',
      answer:
        'Efficient-driving techniques — smoother acceleration, gentler braking, steadier speeds and less idling — are widely studied as a way to reduce fuel use, and the reported effect varies a lot with the vehicle, the route and the driver. Efficiver gives you feedback so you can adopt those techniques; what you actually save depends on how much you change. Efficiver has not measured its own effect on fuel use, so we do not publish a figure for it.',
      value: 'item-4'
    },
    {
      question: 'Does Efficiver need a clear GPS signal to work?',
      answer:
        'Yes. Speed, distance, route, and scoring all come from your phone\'s GPS, so GPS accuracy directly affects your Efficiency Score. Efficiver shows an orange "GPS Warming Up" label for the first few seconds of every drive and a red "Low GPS" label (plus a "GPS Signal Weak — Scores may be affected" banner) whenever signal accuracy drops. Scoring continues during weak signal so you don\'t lose your drive, but accuracy may be reduced. Best results outdoors with a clear view of the sky — tunnels, underground parking, dense tree cover and tall buildings (urban canyons) can degrade accuracy. When the fix goes stale, Efficiver pauses the idle timer rather than counting you as idling, and it does not raise acceleration or braking events from the first readings after the signal returns. Normal scoring resumes on the next good fix.',
      value: 'item-gps'
    },
    {
      question: 'Is my data safe with Efficiver?',
      answer:
        "Yes. Your driving data stays on your phone, stored locally — in SwiftData on iPhone and SQLite on Android. On iPhone, iCloud sync is optional and uses your own private iCloud database — never Efficiver's servers. We don't collect, store, or sell your driving data. Privacy is built in.",
      value: 'item-5'
    },
    {
      question: 'What are the pricing plans for Efficiver?',
      answer:
        'Efficiver is free to download and use, and there is nothing to buy today. Some deeper features — score forecasts, driving patterns, idle-time insights and your annual savings projection — are reserved for Efficiver Pro, which is coming; pricing is still being finalised.',
      value: 'item-6'
    },
    {
      question: 'Which devices are compatible with Efficiver?',
      answer:
        "Efficiver runs on iPhones with iOS 26 or later, and on iPad, with CarPlay support (v1.3) and an Apple Watch companion (v1.4). The AidOps Edge coaching insights use Apple Intelligence where it's available; every other feature works without it. Efficiver is also available on Google Play for Android 12 and later, on 64-bit devices. A Wear OS companion is built and will follow in a later release.",
      value: 'item-7'
    },
    {
      question: 'How is Efficiver different from OBD dongle apps?',
      answer:
        "OBD apps need a hardware dongle plugged into your car's port. Efficiver works with just your phone — no cable, no Bluetooth pairing, nothing to fit. It is free to download and use.",
      value: 'item-8'
    },
    {
      question: 'How can I get support for Efficiver?',
      answer: `Our support team is here to help! Contact us at ${config.contact.email} for assistance or visit our FAQ section for quick answers.`,
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
      Still have questions? Contact us at
      <a :href="'mailto:' + config.contact.email" class="underline">{{ config.contact.email }}</a>
    </h3>
  </section>
</template>
