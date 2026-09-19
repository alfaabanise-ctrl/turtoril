<script setup lang="ts">

/* ================================================================
 * BENEFITS
 * ================================================================ */

const benefit = [
  {
    id: 1,

    title: "Practice with Purpose",

    description:
      "Turn every practice session into a step toward exam success. ExamTips gives you access to past and carefully crafted model questions in a realistic exam environment. Focus on specific topics, set your own time limits, and practice under conditions that prepare you for the real exam. Powerful search makes it easy to find questions by keywords, while clear answers and explanations help you understand the why behind every question. Track your performance, discover your strengths, identify areas for improvement, and study smarter with every attempt.",

    image: "/images/cbt.png",
  },

  {
    id: 2,

    title: "Learn in the Classroom",

    description:
      "Everything you need to learn, all in one place. The Classroom brings together structured study materials, PDF notes, educational videos, and exercises across your subjects, all aligned with the curriculum. Learn at your own pace, complete exercises to reinforce your understanding, and watch your progress grow in real time. With a clear learning path and progress tracking, you always know what you have mastered and what to tackle next.",

    image: "/images/learning-tools.png",
  },

  {
    id: 3,

    title: "Learn Through Games & Quizzes",

    description:
      "Make learning exciting, interactive, and memorable. Turn questions from our extensive question bank into fun educational games and engaging quizzes. Challenge yourself, test your knowledge, reinforce what you have learned, and improve your skills without the pressure of traditional studying. Every game is an opportunity to learn, grow, and have fun while preparing for success.",

    image: "/images/games.png",
  },
];

/* ================================================================
 * REVIEWS
 * ================================================================ */

const reviews = [
  {
    id: 1,

    text:
      "ExamTips helped me improve my scores significantly. The practice questions and explanations were invaluable!",

    author: "Tolani A.",

    usertype: "Student",
  },

  {
    id: 2,

    text:
      "I was able to identify my weak areas and focus on them, which made a huge difference in my exam performance.",

    author: "Jamal Ke.",

    usertype: "Student",
  },

  {
    id: 3,

    text:
      "The Classroom feature allowed me to learn at my own pace and track my progress effectively.",

    author: "Oyetola C.",

    usertype: "Student",
  },
];

</script>


<template>

  <div class="min-h-screen bg-white text-slate-900">

    <!-- =========================================================
         NAVBAR
    ========================================================== -->

    <NavigationNavbar />


    <!-- =========================================================
         HERO
    ========================================================== -->

    <Herosection />


    <!-- =========================================================
         INTRODUCTION
    ========================================================== -->

    <section class="bg-gray-100 py-6 sm:py-8">

      <Container>

        <div class="mx-auto max-w-4xl px-4 text-center">

          <p
            class="text-sm leading-7 text-gray-600 sm:text-base"
          >
            More than exam prep — a complete learning experience
            with rich content,
            <span class="font-semibold text-[#0794bd]">
              smart practice
            </span>,
            <span class="font-semibold text-[#0794bd]">
              exam tips
            </span>,
            and
            <span class="font-semibold text-[#0794bd]">
              intelligent guidance
            </span>
            to help you learn, improve, and succeed.
          </p>

        </div>

      </Container>

    </section>


    <!-- =========================================================
         BENEFITS
    ========================================================== -->

    <section class="bg-white">

      <Container>

        <div class="space-y-20 py-16 sm:py-20">

          <div
            v-for="(item, index) in benefit"
            :key="item.id"
            class="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
          >

            <!-- ===================================================
                 IMAGE
            ==================================================== -->

            <div
              class="flex items-center justify-center"
              :class="
                index % 2 === 0
                  ? 'md:order-2'
                  : 'md:order-1'
              "
            >

              <div
                class="w-full overflow-hidden rounded-3xl bg-slate-50 p-5 shadow-sm"
              >

                <img
                  :src="item.image"
                  :alt="item.title"
                  class="mx-auto h-auto w-full max-w-lg object-contain"
                />

              </div>

            </div>


            <!-- ===================================================
                 CONTENT
            ==================================================== -->

            <div
              :class="
                index % 2 === 0
                  ? 'md:order-1'
                  : 'md:order-2'
              "
            >

              <span
                class="text-xs font-bold uppercase tracking-[0.2em] text-[#0794bd]"
              >
                Feature {{ String(index + 1).padStart(2, "0") }}
              </span>

              <h2
                class="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
              >
                {{ item.title }}
              </h2>

              <p
                class="mt-5 text-sm leading-8 text-gray-600 sm:text-base"
              >
                {{ item.description }}
              </p>

            </div>

          </div>

        </div>

      </Container>

    </section>


    <!-- =========================================================
         CTA
    ========================================================== -->

    <section
      class="bg-[url('/images/exam-background.jpg')] bg-cover bg-center bg-fixed py-16"
    >

      <Container>

        <div
          class="relative overflow-hidden rounded-3xl bg-slate-950/75 p-8 text-center text-white shadow-xl backdrop-blur-sm sm:p-12"
        >

          <!-- Decorative glow -->

          <div
            class="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
          ></div>

          <div
            class="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl"
          ></div>


          <div class="relative z-10">

            <p
              class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
            >
              Start Learning
            </p>

            <h2
              class="mt-3 text-2xl font-bold sm:text-3xl"
            >
              Upgrade How You Learn
            </h2>

            <p
              class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base"
            >
              Whether you're preparing for JAMB exams or SSCE
              tests like NABTEB and WAEC, ExamTips gives you the
              tools to prepare, practice and improve.
            </p>

            <NuxtLink
              to="/register"
              class="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0794bd] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#0685aa]"
            >

              Get Started Free

              <Icon
                name="lucide:arrow-right"
                class="h-4 w-4"
              />

            </NuxtLink>

          </div>

        </div>

      </Container>

    </section>


    <!-- =========================================================
         REVIEWS
    ========================================================== -->

    <section class="bg-slate-50 py-16 sm:py-20">

      <Container>

        <!-- Heading -->

        <div class="mx-auto max-w-3xl text-center">

          <p
            class="text-xs font-bold uppercase tracking-[0.2em] text-[#0794bd]"
          >
            Student Experiences
          </p>

          <h2
            class="mt-3 text-3xl font-bold tracking-tight text-slate-950"
          >
            Results That Speak
          </h2>

          <p
            class="mt-4 text-sm leading-7 text-gray-600 sm:text-base"
          >
            ExamTips has helped students improve their preparation,
            understand difficult topics and build confidence.
          </p>

        </div>


        <!-- Reviews -->

        <div
          class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >

          <div
            v-for="item in reviews"
            :key="item.id"
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >

            <!-- Quote icon -->

            <div
              class="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0794bd]/10"
            >

              <Icon
                name="lucide:quote"
                class="h-5 w-5 text-[#0794bd]"
              />

            </div>

            <!-- Review -->

            <p
              class="text-sm leading-7 text-gray-600"
            >
              "{{ item.text }}"
            </p>

            <!-- Author -->

            <div class="mt-6">

              <p
                class="text-sm font-semibold text-slate-900"
              >
                {{ item.author }}
              </p>

              <p
                class="mt-1 text-xs text-gray-400"
              >
                {{ item.usertype }}
              </p>

            </div>

          </div>

        </div>

      </Container>

    </section>


    <!-- =========================================================
         FOOTER
    ========================================================== -->

    <NavigationFooter />

  </div>

</template>