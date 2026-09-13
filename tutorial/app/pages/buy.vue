<template>
<div>
      <NavigationNavbar/>

  <section class="w-full bg-white text-gray-800">
    <!-- Header -->
    <div class="bg-[#6b6b6b] px-6 py-8 sm:px-12">
      <h1 class="text-3xl font-bold text-white tracking-wide">Buy Our Products</h1>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-6 py-10 sm:px-12">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        
        <!-- LEFT COLUMN -->
        <div>
          <!-- Section 1: Pay With Card -->
          <h2 class="border-b-2 border-gray-200 pb-2 text-xl font-bold text-gray-900">
            Pay With Card Or Bank Account
            <span class="block text-lg font-semibold">(Automated)</span>
          </h2>

          <div class="mt-6 border border-gray-200 bg-[#fafafa] p-5 text-sm leading-relaxed text-gray-700">
            <p>
              You will be required to provide your Product Key, mobile number and email
              address. You will find your Product Key after installing the application. After a
              successful payment, an Activation Key will be automatically sent to your mobile
              number and email address. Please check your spam box in case you could not
              find it in your inbox.
            </p>
          </div>

          <button
            type="button"
            class="mt-6 bg-[#4CAF50] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#43a047]"
          >
            Click to proceed
          </button>

          <!-- Section 2: Bank Transfer -->
          <h2 class="mt-12 border-b-2 border-gray-200 pb-2 text-xl font-bold text-gray-900">
            Payment to Bank | Bank Transfer
          </h2>

          <!-- Bank Details Grid -->
          <div class="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <!-- GT Bank -->
            <div>
              <h3 class="mb-3 font-bold text-gray-900">GT Bank</h3>
              <ul class="space-y-2 text-sm text-gray-700">
                <li><span class="font-semibold">Account Name:</span> IAF SAWII Limited - ExamTips</li>
                <li><span class="font-semibold">Account Number:</span> 0227300274</li>
                <li><span class="font-semibold">Account Type:</span> Current</li>
              </ul>
            </div>

            <!-- Zenith Bank -->
            <div>
              <h3 class="mb-3 font-bold text-gray-900">Zenith Bank</h3>
              <ul class="space-y-2 text-sm text-gray-700">
                <li><span class="font-semibold">Account Name:</span> IAF SAWII Limited</li>
                <li><span class="font-semibold">Account Number:</span> 1014381194</li>
                <li><span class="font-semibold">Account Type:</span> Current</li>
              </ul>
            </div>
          </div>

          <!-- Instructions -->
          <div class="mt-8 text-sm text-gray-700">
            <p class="mb-2">If you are buying less than 10 activation keys, after payment,</p>
            <p class="mb-2">Send Text Message Containing:</p>
            <ol class="list-decimal space-y-1 pl-5">
              <li>Product Name</li>
              <li>Product Key</li>
              <li>Amount Paid</li>
              <li>Bank Name (GTBank or Zenith)</li>
              <li>Depositor's Name or Payment Details</li>
            </ol>
            <p class="mt-4 font-semibold">To:</p>
            <p class="mt-1 font-semibold">09037778195, 08077778195</p>
          </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div>
          <h2 class="border-b-2 border-gray-200 pb-2 text-xl font-bold text-gray-900">
            Sales Outlets
          </h2>

          <!-- Placeholder Images for CDs -->
          <div class="mt-6 flex flex-wrap items-center gap-6">
            <!-- Replace src with your actual image paths -->
            <div class="flex h-32 w-32 items-center justify-center rounded bg-gray-100 text-xs text-gray-400 shadow-sm">
              <!-- <img src="/path-to-cd-image-1.jpg" alt="ExamTips CD 1" class="h-full w-full object-cover" onerror="this.style.display='none'" /> -->
              <span v-if="true">CD Image 1</span>
            </div>
            <div class="flex h-32 w-32 items-center justify-center rounded bg-gray-100 text-xs text-gray-400 shadow-sm">
              <!-- <img src="/path-to-cd-image-2.jpg" alt="ExamTips CD 2" class="h-full w-full object-cover" onerror="this.style.display='none'" />
              <span v-if="true">CD Image 2</span> -->
            </div>
          </div>

          <div class="mt-6 border border-gray-200 bg-[#fafafa] p-5 text-sm leading-relaxed text-gray-700">
            <p>
              You can buy our products in CDs via any of our over 200 sales outlets across the
              country.
            </p>
          </div>

          <button
            type="button"
            class="mt-6 bg-[#4CAF50] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#43a047]"
          >
            Visit Sales Point
          </button>
        </div>

      </div>
    </div>
  </section>
      <NavigationFooter />
</div>
</template>

<script setup lang="ts">
// No specific reactive state is needed for this static component.
// You can add click handlers to the buttons if you need to route them.
</script>