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
    <section class="relative oerflow-hidden">
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
          <p class="mt-3 max-w-[650px] text-base leading-7 text-slate-600 sm:text-lg">
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
              Explore our products

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

        <!-- RIGHT VISUAL -->
        <div class="relative hidden z-10">
          <!-- Main dashboard card -->
          <div
            class="relative mx-auto max-w-[560px] rounded-[30px] border border-white/70 bg-white/80 p-4 shadow-[0_30px_90px_-30px_rgba(15,23,42,.35)] backdrop-blur-xl"
          >
            <!-- Fake application window -->
            <div
              class="overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50"
            >
              <!-- Window header -->
              <div
                class="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4"
              >
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span class="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>

                <div
                  class="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500"
                >
                  TestDriller
                </div>

                <Icon name="lucide:more-horizontal" class="h-5 w-5 text-slate-400" />
              </div>

              <!-- Application -->
              <div class="p-5 sm:p-7">
                <!-- User header -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-medium text-slate-400">Welcome back</p>

                    <h3 class="mt-1 text-xl font-bold text-slate-900">
                      Ready to practice?
                    </h3>
                  </div>

                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0794bd]/10 text-[#0794bd]"
                  >
                    <Icon name="lucide:user-round" class="h-5 w-5" />
                  </div>
                </div>

                <!-- Progress -->
                <div class="mt-7 rounded-2xl bg-[#063b4a] p-5 text-white">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-xs text-white/60">Your progress</p>

                      <p class="mt-1 text-3xl font-black">78%</p>
                    </div>

                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"
                    >
                      <Icon name="lucide:trending-up" class="h-5 w-5" />
                    </div>
                  </div>

                  <div class="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div class="h-full w-[78%] rounded-full bg-cyan-400" />
                  </div>

                  <div class="mt-2 flex justify-between text-[10px] text-white/50">
                    <span>Learning progress</span>
                    <span>78 / 100</span>
                  </div>
                </div>

                <!-- Product cards -->
                <div class="mt-5 grid gap-3 sm:grid-cols-3">
                  <NuxtLink
                    v-for="product in products"
                    :key="product.title"
                    :to="product.link"
                    class="group rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
                  >
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#0794bd]"
                    >
                      <Icon :name="product.icon" class="h-5 w-5" />
                    </div>

                    <p class="mt-4 text-sm font-bold text-slate-900">
                      {{ product.title }}
                    </p>

                    <p class="mt-1 text-[10px] leading-4 text-slate-400">
                      {{ product.subtitle }}
                    </p>

                    <Icon
                      name="lucide:arrow-up-right"
                      class="mt-3 h-4 w-4 text-slate-300 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0794bd]"
                    />
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Floating notification -->
          <div
            class="absolute -left-5 top-20 hidden w-[190px] rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur md:block"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
              >
                <Icon name="lucide:check" class="h-4 w-4" />
              </div>

              <div>
                <p class="text-xs font-bold text-slate-800">Practice completed</p>

                <p class="mt-0.5 text-[10px] text-slate-400">Score: 92%</p>
              </div>
            </div>
          </div>

          <!-- Floating question card -->
          <div
            class="absolute -bottom-5 -right-5 hidden w-[200px] rounded-2xl border border-white bg-white/95 p-4 shadow-xl backdrop-blur md:block"
          >
            <div class="flex items-center justify-between">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
              >
                <Icon name="lucide:brain" class="h-4 w-4" />
              </div>

              <span
                class="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-600"
              >
                +24 today
              </span>
            </div>

            <p class="mt-3 text-xs font-bold text-slate-800">Questions mastered</p>

            <p class="mt-1 text-[10px] text-slate-400">Keep improving your score.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section class="border-t  border-slate-200 bg-white">
      <div class="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16">
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
              TestDriller {{ product.title }}
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
    </section>
  </main>
</template>
