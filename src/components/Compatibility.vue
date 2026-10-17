<template>
  <section id="compatibility" class="container py-16 sm:py-20">
    <div class="max-w-2xl mb-9">
      <p class="text-primary text-sm uppercase tracking-widest font-semibold">
        Made for your phone
      </p>
      <h2 class="text-3xl sm:text-4xl font-bold mt-3">Same purpose. Know the differences.</h2>
      <p class="mt-4 text-lg text-muted-foreground">
        Core recording and scoring work without the optional AI assistant.
      </p>
    </div>
    <div class="overflow-x-auto rounded-2xl border">
      <table class="w-full text-sm text-left">
        <caption class="sr-only">
          Efficiver iPhone and Android compatibility
        </caption>
        <thead class="bg-muted">
          <tr>
            <th scope="col" class="p-4 sm:p-5">What to expect</th>
            <th scope="col" class="p-4 sm:p-5">iPhone</th>
            <th scope="col" class="p-4 sm:p-5">Android</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr>
            <th scope="row" class="p-4 sm:p-5 font-medium">Phone requirements</th>
            <td class="p-4 sm:p-5">iOS 26 or later</td>
            <!-- The phone app ships arm64-v8a native code only (app/build.gradle.kts abiFilters):
                 it needs a 64-bit version of ANDROID, not just a 64-bit chip — many older
                 phones run 32-bit Android on 64-bit hardware and cannot install it. -->
            <td class="p-4 sm:p-5">Android 12 or later, 64-bit version of Android</td>
          </tr>
          <tr>
            <th scope="row" class="p-4 sm:p-5 font-medium">Offline recording &amp; scoring</th>
            <td class="p-4 sm:p-5">Yes</td>
            <td class="p-4 sm:p-5">Yes</td>
          </tr>
          <tr>
            <th scope="row" class="p-4 sm:p-5 font-medium">Car screen</th>
            <td class="p-4 sm:p-5">CarPlay (iPhone)</td>
            <td class="p-4 sm:p-5">Use your phone</td>
          </tr>
          <tr>
            <th scope="row" class="p-4 sm:p-5 font-medium">Watch companion</th>
            <td class="p-4 sm:p-5">Apple Watch (iPhone)</td>
            <!-- Wear OS is live on Play since 2026-09-12 (wear 10054), from the phone listing. -->

            <td class="p-4 sm:p-5">Wear OS (Android)</td>
          </tr>
          <tr>
            <th scope="row" class="p-4 sm:p-5 font-medium">Personal data</th>
            <td class="p-4 sm:p-5">On-device, with private iCloud sync on iPhone</td>
            <td class="p-4 sm:p-5">On-device, with Android backup</td>
          </tr>
          <tr>
            <th scope="row" class="p-4 sm:p-5 font-medium">Optional AI explanations</th>
            <td class="p-4 sm:p-5">Requires supported Apple Intelligence</td>
            <td class="p-4 sm:p-5">Requires a compatible phone and model download</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="mt-5 text-sm text-muted-foreground">
      Feature access also depends on your plan. Maps, weather, backups and fleet uploads use a
      connection. <a href="#help" class="underline underline-offset-4">Read the setup guide</a>.
    </p>
  </section>
</template>
