<template>
  <div>
  <NavigationNavbar />
  <div class="bg-gray-50 min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden text-white">
      <!-- Background image -->
      <img
        src="/images/hero-students.jpg"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Gradient overlay on top of the image — keeps the brand colors dominant -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-sky-500/65 to-teal-400/50"></div>

      <!-- Decorative blur shapes, above the overlay -->
      <div class="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-white blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
      </div>

      <div class="relative max-w-5xl mx-auto px-6 py-24 text-center">
        <span class="inline-block text-xs font-semibold tracking-widest uppercase bg-white/15 px-4 py-1.5 rounded-full mb-6">
          About Us
        </span>
        <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Making learning simpler,<br class="hidden sm:block" /> one resource at a time.
        </h1>
        <p class="mt-6 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          Examtips is your one-stop hub for quality learning resources —
          apps, study tools, ebooks, and more — built for students and
          lifelong learners alike.
        </p>
      </div>
    </section>

    <!-- Stats strip -->
    <section class="max-w-5xl mx-auto px-6 -mt-10 relative">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
        <div v-for="stat in stats" :key="stat.label" class="px-4 py-6 text-center">
          <p class="text-2xl sm:text-3xl font-extrabold text-gray-900">{{ stat.value }}</p>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Intro -->
    <section class="max-w-3xl mx-auto px-6 pt-16 pb-4 text-center">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Who we are</h2>
      <p class="text-gray-600 leading-relaxed">
        Examtips exists to make learning simpler. We curate and build
        practical resources that span everything from exam preparation
        to career growth, so that whether you're a student, a job
        seeker, or just someone chasing new skills, you'll find
        something useful here.
      </p>
    </section>

    <!-- Feature cards -->
    <section class="max-w-5xl mx-auto px-6 py-14">
      <div class="grid gap-6 sm:grid-cols-2">
        <div
          v-for="item in features"
          :key="item.title"
          class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100"
        >
          <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
            <Icon :name="item.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ item.text }}</p>
        </div>
      </div>
    </section>

    <!-- Mission timeline -->
    <section class="max-w-5xl mx-auto px-6 pb-16">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
        How we work
      </h2>
      <div class="grid sm:grid-cols-3 gap-6">
        <div v-for="(step, i) in howWeWork" :key="step.title" class="relative">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-bold">
              {{ i + 1 }}
            </div>
            <h3 class="font-semibold text-gray-900">{{ step.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed pl-11">
            {{ step.text }}
          </p>
        </div>
      </div>
    </section>

    <!-- Goal banner -->
    <section class="max-w-5xl mx-auto px-6 pb-16">
      <div class="rounded-2xl bg-gray-900 text-white px-8 py-10 sm:px-12 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div class="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-teal-300">
          <Icon name="mdi:target" class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-bold mb-1">Our Goal</h2>
          <p class="text-gray-300 leading-relaxed">
            To keep making learning easier and more accessible than it's
            ever been — for everyone, everywhere.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-3xl mx-auto px-6 pb-20 text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-3">Get in Touch</h2>
      <p class="text-gray-600 mb-6">
        Have something important to discuss? We'd love to hear from you.
      </p>
      <NuxtLink
        to="/contact"
        class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        <Icon name="mdi:email-outline" class="w-5 h-5" />
        Contact Us
      </NuxtLink>
      <p class="mt-8 text-sm text-gray-400">Thanks for stopping by 👋</p>
    </section>

    <!-- Powered by -->
    <div class="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
      Powered by
      <a
        href="https://abanise.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-500 hover:text-gray-700 font-medium transition"
      >
        Abanise
      </a>
    </div>
  </div>
  <NavigationFooter />
  </div>
</template>

<script setup lang="ts">


useHead({
  title: 'About Us — Examtips',
})

// Requires @nuxt/icon module registered in nuxt.config.ts:
//
// export default defineNuxtConfig({
//   modules: ['@nuxt/icon']
// })

const stats = [
  { value: '5.5K+', label: 'Community followers' },
  { value: '50+', label: 'Learning resources' },
  { value: '10K+', label: 'Learners reached' },
  { value: '24/7', label: 'Resource access' },
]

const features = [
  {
    icon: 'mdi:school-outline',
    title: 'Education',
    text: "To support learners everywhere, we continuously build and curate top-notch educational content — study software, virtual classrooms, learning apps, and past exam questions with answers for various tests, with new resources added regularly.",
  },
  {
    icon: 'mdi:briefcase-outline',
    title: 'Career',
    text: "Beyond academics, we help you grow professionally. From job-readiness materials and the latest recruitment updates to interview prep and career guidance, we've got resources to help you take the next step.",
  },
]

const howWeWork = [
  {
    title: 'Curate',
    text: 'We source and vet learning materials so you spend less time searching and more time studying.',
  },
  {
    title: 'Build',
    text: "Where a good resource doesn't already exist, we build our own — apps, tools, and guides.",
  },
  {
    title: 'Update',
    text: 'Exams and industries change, so we keep our content current and refreshed regularly.',
  },
]
</script>