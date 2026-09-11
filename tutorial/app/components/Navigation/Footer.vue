<template>
  <footer class="bg-[#0B0F1A] text-gray-300">
    <!-- Top gradient bar -->
    <div class="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-teal-400"></div>

    <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
      <!-- Brand -->
      <div>
        <NuxtLink to="/" class="text-2xl font-bold">
          <span class="text-blue-500">exam</span><span class="text-orange-500">tips</span>
        </NuxtLink>
        <p class="mt-4 text-sm text-gray-400 max-w-xs">
          Empowering learners with digital education and real-world skills.
        </p>

        <div class="flex items-center gap-3 mt-5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#0B0F1A] hover:opacity-80 transition"
          >
            <Icon name="mdi:facebook" class="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            class="flex items-center justify-center w-9 h-9 rounded-full bg-white text-[#0B0F1A] hover:opacity-80 transition"
          >
            <Icon name="mdi:twitter" class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">
          Quick Links
        </h3>
        <ul class="space-y-3 text-sm">
          <li>
            <NuxtLink to="/about" class="hover:text-white transition">About Us</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="hover:text-white transition">Contact Us</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Legal -->
      <div>
        <h3 class="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">
          Legal
        </h3>
        <ul class="space-y-3 text-sm">
          <li>
            <NuxtLink to="/privacy-policy" class="hover:text-white transition">
              Privacy Policy
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terms" class="hover:text-white transition">
              Terms &amp; Conditions
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10">
      <div class="max-w-7xl mx-auto px-6 py-5 text-center text-xs text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Examtips. All rights reserved.</p>
        <p class="mt-1">
          Powered by
          <a
            href="https://abanise.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-white transition"
          >
            Abanise
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No props/logic needed — static footer content.
// Requires @nuxt/icon module installed and registered in nuxt.config.ts:
//
// export default defineNuxtConfig({
//   modules: ['@nuxt/icon']
// })
</script>