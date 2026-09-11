<template>
  <NavigationNavbar/>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
    
    <div class="max-w-6xl mx-auto">
      <!-- Page heading -->
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Get in Touch
        </h1>
        <p class="mt-3 text-gray-600 max-w-xl mx-auto">
          Questions, feedback, or just want to say hello? Send us a
          message and we'll get back to you as soon as we can.
        </p>
      </div>

      <div class="grid lg:grid-cols-5 gap-8">
        <!-- Form -->
        <div class="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gray-50 border-b border-gray-100 px-6 sm:px-8 py-5">
            <h2 class="font-semibold text-gray-900">Send us a message</h2>
          </div>

          <form class="px-6 sm:px-8 py-8 space-y-5" @submit.prevent="handleSubmit" novalidate>
            <!-- Success / error banner -->
            <div
              v-if="status === 'success'"
              class="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3"
            >
              <Icon name="mdi:check-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Thanks! Your message has been sent — we'll be in touch soon.</span>
            </div>
            <div
              v-else-if="status === 'error'"
              class="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3"
            >
              <Icon name="mdi:alert-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>Something went wrong sending your message. Please try again.</span>
            </div>

            <!-- Full name -->
            <div>
              <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                id="fullname"
                v-model.trim="form.fullname"
                type="text"
                placeholder="e.g. Ada Obi"
                class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
                :class="errors.fullname
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'"
              />
              <p v-if="errors.fullname" class="mt-1 text-xs text-red-600">{{ errors.fullname }}</p>
            </div>

            <!-- Email + Phone -->
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  placeholder="you@example.com"
                  class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
                  :class="errors.email
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'"
                />
                <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  v-model.trim="form.phone"
                  type="tel"
                  placeholder="080..."
                  class="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
                  :class="errors.phone
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'"
                />
                <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
              </div>
            </div>

            <!-- Inquiry type -->
            <div>
              <label for="inquiry" class="block text-sm font-medium text-gray-700 mb-1.5">
                Inquiry Type
              </label>
              <select
                id="inquiry"
                v-model="form.inquiryType"
                class="w-full rounded-lg border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition"
                :class="errors.inquiryType
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'"
              >
              
                <option value="">-Select-</option>
                 <option value="billing">Billing / Payment</option>
               
                <option value="difficulty">Having a technical difficulty</option>
                <option value="improvement">Want to suggest areas to improve</option>
                <option value="distributor">Want to be a Patnership</option>
                <option value="teacher">Want to be an educational consultant</option>
                <option value="copyright">Copyright violation</option>
                <option value="other">Other...</option>
               
              </select>
              <p v-if="errors.inquiryType" class="mt-1 text-xs text-red-600">{{ errors.inquiryType }}</p>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                v-model.trim="form.message"
                rows="5"
                placeholder="How can we help?"
                class="w-full rounded-lg border px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 transition"
                :class="errors.message
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'"
              />
              <div class="flex justify-between mt-1">
                <p v-if="errors.message" class="text-xs text-red-600">{{ errors.message }}</p>
                <p class="text-xs text-gray-400 ml-auto">{{ form.message.length }}/500</p>
              </div>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="status === 'submitting'"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium px-6 py-3 transition"
            >
              <Icon v-if="status === 'submitting'" name="mdi:loading" class="w-5 h-5 animate-spin" />
              {{ status === 'submitting' ? 'Sending…' : 'Send Message' }}
            </button>
          </form>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact details -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-5">
            <div class="flex gap-3">
              <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon name="mdi:email-outline" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <a href="mailto:info@examtips.com" class="font-medium text-gray-900 hover:text-blue-600 transition">
                  info@examtips.com
                </a>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon name="mdi:phone-outline" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm text-gray-500">Tel</p>
                <p class="font-medium text-gray-900">09037778195, 08077778195</p>
              </div>
            </div>

            <div class="flex gap-3">
              <div class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon name="mdi:map-marker-outline" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm text-gray-500">Head Office</p>
                <p class="font-medium text-gray-900 leading-snug">
                  NSPRI Building, 32/34, Barikisu Iyede, UNILAG Road,
                  Abule Oja, Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>

          <!-- Social follow card -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
                ET
              </div>
              <div>
                <p class="font-semibold text-gray-900 text-sm">Examtips</p>
                <p class="text-xs text-gray-500">5.5K followers</p>
              </div>
            </div>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 hover:bg-blue-50 transition"
            >
              <Icon name="mdi:facebook" class="w-4 h-4" />
              Follow
            </a>
          </div>

          <!-- Featured story placeholder -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="relative aspect-video bg-gradient-to-br from-sky-500 to-teal-400 flex items-center justify-center">
              <button
                type="button"
                aria-label="Play video"
                class="w-14 h-14 rounded-full bg-white/25 hover:bg-white/35 backdrop-blur flex items-center justify-center transition"
              >
                <Icon name="mdi:play" class="w-7 h-7 text-white" />
              </button>
              <span class="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold drop-shadow">
                Student success stories
              </span>
            </div>
            <div class="p-5">
              <p class="text-sm text-gray-600 leading-relaxed">
                Every year, learners on Examtips share how consistent
                practice helped them hit their target scores. Follow us
                on social media to catch the next story.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <NavigationFooter/>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact Us — Examtips',
})

const form = reactive({
  fullname: '',
  email: '',
  phone: '',
  inquiryType: '',
  message: '',
})

const errors = reactive({
  fullname: '',
  email: '',
  phone: '',
  inquiryType: '',
  message: '',
})

type Status = 'idle' | 'submitting' | 'success' | 'error'
const status = ref<Status>('idle')

function validate() {
  errors.fullname = form.fullname.length < 2 ? 'Please enter your full name.' : ''
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? ''
    : 'Please enter a valid email address.'
  errors.phone = form.phone.length < 7 ? 'Please enter a valid phone number.' : ''
  errors.inquiryType = form.inquiryType ? '' : 'Please select an inquiry type.'
  errors.message = form.message.length < 10 ? 'Message should be at least 10 characters.' : ''

  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  status.value = 'idle'
  if (!validate()) return

  status.value = 'submitting'
  try {
    // Replace with your real endpoint, e.g.:
    // await $fetch('/api/contact', { method: 'POST', body: form })
    await new Promise((resolve) => setTimeout(resolve, 1200))

    status.value = 'success'
    form.fullname = ''
    form.email = ''
    form.phone = ''
    form.inquiryType = ''
    form.message = ''
  } catch (err) {
    status.value = 'error'
  }
}
</script>