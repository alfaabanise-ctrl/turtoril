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
]

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
]

</script>

<template>

  <main class="min-h-screen bg-[#f8fafc] font-[Poppins] text-slate-900">

    <!-- =====================================================
         HERO
    ====================================================== -->

    <section
      class="relative min-h-[720px] overflow-hidden bg-cover bg-center bg-no-repeat"
      style="background-image: url('/images/slider5.jpg')"
    >

      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-slate-950/75"></div>

      <!-- Decorative glow -->
      <div
        class="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
      ></div>

      <div
        class="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
      ></div>


      <Container class="relative z-10">

        <div
          class="flex min-h-[720px] items-center"
        >

          <div class="w-full max-w-4xl py-20">

            <!-- Badge -->
            <div
              class="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
            >

              <span class="relative flex h-2.5 w-2.5">

                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60"
                ></span>

                <span
                  class="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400"
                ></span>

              </span>

              Smarter way to prepare for exams

            </div>


            <!-- Heading -->

            <h1
              class="max-w-4xl text-5xl font-bold leading-[1.08] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl"
            >

              Prepare.

              <span class="text-[#18b8e5]">
                Practice.
              </span>

              <br />

              Pass with confidence.

            </h1>


            <!-- Description -->

            <p
              class="mt-7 max-w-2xl text-base font-normal leading-8 text-slate-200 sm:text-lg"
            >

              Your all-in-one examination preparation platform for

              <span class="font-semibold text-white">
                ICAN, JAMB, WAEC
              </span>

              and other professional and academic examinations.

            </p>


            <!-- Buttons -->

            <div class="mt-9 flex flex-col gap-3 sm:flex-row">

              <NuxtLink
                to="/products"
                class="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#0794bd] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-cyan-950/20 transition duration-300 hover:-translate-y-1 hover:bg-[#0685aa]"
              >

                Start Mock Exams

                <Icon
                  name="lucide:arrow-right"
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />

              </NuxtLink>


              <NuxtLink
                to="/about"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15"
              >

                <Icon
                  name="lucide:play-circle"
                  class="h-4 w-4"
                />

                How it works

              </NuxtLink>

            </div>


            <!-- Stats -->

            <div
              class="mt-14 flex flex-wrap gap-x-12 gap-y-7 border-t border-white/15 pt-8"
            >

              <div
                v-for="stat in stats"
                :key="stat.label"
              >

                <p
                  class="text-2xl font-bold tracking-tight text-white"
                >
                  {{ stat.value }}
                </p>

                <p
                  class="mt-1 text-xs font-medium text-slate-300"
                >
                  {{ stat.label }}
                </p>

              </div>

            </div>

          </div>

        </div>

      </Container>

    </section>


    <!-- =====================================================
         PRODUCTS
    ====================================================== -->

    <section class="bg-white">

      <Container>

        <div
          class="px-6 py-20 sm:px-10 lg:px-12"
        >

          <!-- Section heading -->

          <div
            class="mx-auto max-w-3xl text-center"
          >

            <p
              class="text-xs font-bold uppercase tracking-[0.2em] text-[#0794bd]"
            >
              Our Platform
            </p>

            <h2
              class="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
            >
              Everything you need to prepare better.
            </h2>

            <p
              class="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base"
            >
              Choose an examination and start practising with a focused
              preparation experience built around your goals.
            </p>

          </div>


          <!-- Product Cards -->

          <div
            class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >

            <NuxtLink
              v-for="(product, index) in products"
              :key="product.title"
              :to="product.link"
              class="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8fafc] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-200 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/70"
            >

              <!-- Background number -->

              <span
                class="absolute right-5 top-3 text-7xl font-extrabold text-slate-100 transition-colors duration-500 group-hover:text-cyan-50"
              >
                {{ String(index + 1).padStart(2, "0") }}
              </span>


              <!-- Icon -->

              <div
                class="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0794bd]/10 text-[#0794bd] transition duration-300 group-hover:bg-[#0794bd] group-hover:text-white"
              >

                <Icon
                  :name="product.icon"
                  class="h-7 w-7"
                />

              </div>


              <!-- Subtitle -->

              <p
                class="relative mt-7 text-xs font-bold uppercase tracking-[0.12em] text-[#0794bd]"
              >
                {{ product.subtitle }}
              </p>


              <!-- Title -->

              <h3
                class="relative mt-2 text-2xl font-bold text-slate-950"
              >
                ExamTips {{ product.title }}
              </h3>


              <!-- Description -->

              <p
                class="relative mt-4 text-sm leading-7 text-slate-500"
              >
                {{ product.description }}
              </p>


              <!-- Link -->

              <div
                class="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
              >

                Explore {{ product.title }}

                <Icon
                  name="lucide:arrow-right"
                  class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />

              </div>

            </NuxtLink>

          </div>

        </div>

      </Container>

    </section>


    <!-- =====================================================
         SIMPLE CTA
    ====================================================== -->

    <section class="bg-[#f8fafc]">

      <Container>

        <div
          class="px-6 py-20 sm:px-10 lg:px-12"
        >

          <div
            class="relative overflow-hidden rounded-[32px] bg-[#0794bd] px-8 py-14 text-center shadow-xl sm:px-12"
          >

            <div
              class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            ></div>

            <div
              class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-900/20 blur-2xl"
            ></div>


            <div class="relative">

              <p
                class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100"
              >
                Start preparing today
              </p>

              <h2
                class="mx-auto mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl"
              >
                Turn your preparation into confidence.
              </h2>

              <p
                class="mx-auto mt-4 max-w-xl text-sm leading-7 text-cyan-50 sm:text-base"
              >
                Practice with realistic questions, improve your weak areas
                and get ready for your next examination.
              </p>

              <NuxtLink
                to="/products"
                class="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-semibold text-[#0794bd] shadow-lg transition hover:-translate-y-1 hover:bg-slate-50"
              >

                Explore Exams

                <Icon
                  name="lucide:arrow-right"
                  class="h-4 w-4"
                />

              </NuxtLink>

            </div>

          </div>

        </div>

      </Container>

    </section>

  </main>

</template>