<script setup lang="ts">
const products = [
  {
    title: "ICAN",
    subtitle: "Professional Exam Preparation",
    description:
      "Master ICAN examinations with structured practice questions, realistic CBT simulations, detailed explanations and performance tracking.",
    image: "/ico.webp",
    link: "/products/ican",
    icon: "lucide:briefcase-business",
  },
  {
    title: "JAMB",
    subtitle: "UTME Preparation",
    description:
      "Prepare smarter with thousands of JAMB practice questions, timed CBT simulations and detailed performance analysis.",
    image: "/ico.webp",
    link: "/products/jamb",
    icon: "lucide:graduation-cap",
  },
  {
    title: "WAEC",
    subtitle: "WASSCE Preparation",
    description:
      "Practice WAEC past questions, identify weak areas and build the confidence you need for your examination.",
    image: "/ico.webp",
    link: "/products/waec",
    icon: "lucide:book-open-check",
  },
];

const stats = [
  {
    value: "50K+",
    label: "Practice Questions",
  },
  {
    value: "10K+",
    label: "Students",
  },
  {
    value: "20+",
    label: "Subjects",
  },
];
</script>

<template>
  <main class=" h-100vh bg-[#f7fafc] text-slate-900">
    <!-- HERO -->
    <Container class="relative ">
      <!-- Background decoration -->
      <div   class="pointer-events-none absolute -left-40  h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-3xl" />

      <div  class="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl"  />

      <div   class="relative mx-auto grid min-h-full  w-full items-center gap-16 px-6 py-10 sm:px-10 lg:grid-cols-[1.05fr_.95fr] lg:px-16" >
        <!-- LEFT CONTENT -->
        <div class="relative z-10">
          <!-- Badge -->
          <div  class="mb- inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-medium text-[#067a9d] shadow-sm backdrop-blur"    >
            <span class="relative flex h-2.5 w-2.5">
              <span   class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                 <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>

            Smarter way to prepare for exams
          </div>

          <!-- Heading -->
          <h1
            class="max-w-[760px] text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Prepare.
            <span class="text-[#0794bd]">Practice.</span>
            <br />
            Pass with confidence.
          </h1>

          <!-- Description -->
          <p class="mt-1 max-w-[650px] text-base leading-7 text-slate-600 sm:text-lg">
            Your all-in-one examination preparation platform for
            <strong class="font-semibold text-slate-800"> ICAN, JAMB, WAEC </strong>
            and other professional and academic examinations.
          </p>

          <!-- Buttons -->
          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              to="/products"
              class="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#0794bd] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#057fa3] hover:shadow-xl"
            >
             Start Mock Exams

              <Icon
                name="lucide:arrow-right"
                class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </NuxtLink>

            <NuxtLink
              to="/about"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
            >
              <Icon name="lucide:play-circle" class="h-4 w-4" />
              How it works
            </NuxtLink>
          </div>

          <!-- Stats -->
          <div
            class="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-slate-200 pt-8"
          >
            <div v-for="stat in stats" :key="stat.label">
              <p class="text-2xl font-black tracking-tight text-slate-950">
                {{ stat.value }}
              </p>

              <p class="mt-1 text-xs font-medium text-slate-500">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </div>
        <div>
         <img src="/images/hero.png" alt="Hero Image" class="w-full max-w-[560px] rounded-[30px]" />
        </div>
       
      </div>
    </Container>

    <!-- PRODUCTS -->
    <Container class="border-t  border-slate-200 bg-white">
      <div class="mx-auto max-w-[1400px] px-6 py-2 sm:px-10 lg:px-">
        <div class="max-w-2xl">
          <p class="text-sm font-bold uppercase tracking-[0.18em] text-[#0794bd]">
            Our platform
          </p>

          <h2 class="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Everything you need to prepare better.
          </h2>

          <p class="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Choose an examination and start practising with a focused preparation
            experience built around your goals.
          </p>
        </div>

        <!-- Product grid -->
        <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="product in products"
            :key="product.title"
            :to="product.link"
            class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] p-7 transition duration-500 hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60"
          >
            <!-- Number -->
            <span
              class="absolute right-6 top-6 text-5xl font-black text-slate-100 transition duration-500 group-hover:text-cyan-50"
            >
              0{{ products.indexOf(product) + 1 }}
            </span>

            <!-- Icon -->
            <div
              class="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0794bd]/10 text-[#0794bd]"
            >
              <Icon :name="product.icon" class="h-6 w-6" />
            </div>

            <p
              class="relative mt-7 text-xs font-semibold uppercase tracking-wider text-[#0794bd]"
            >
              {{ product.subtitle }}
            </p>

            <h3 class="relative mt-2 text-2xl font-black text-slate-950">
              ExamTips {{ product.title }}
            </h3>

            <p class="relative mt-3 text-sm leading-6 text-slate-500">
              {{ product.description }}
            </p>

            <div
              class="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-slate-800"
            >
              Explore {{ product.title }}

              <Icon
                name="lucide:arrow-right"
                class="h-4 w-4 transition duration-300 group-hover:translate-x-1"
              />
            </div>
          </NuxtLink>
        </div>
      </div>
    </Container>
  </main>
</template>
