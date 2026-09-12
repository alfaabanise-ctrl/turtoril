```vue
<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Teacher
 * -------------------------------------------------- */

const teacher = ref({
  name: "Mr. Okafor",
});

/* --------------------------------------------------
 * Teacher Token
 * -------------------------------------------------- */

const teacherToken = ref({
  code: "TCH-7K4P-92LM-XQ8T",
  status: "Active" as "Active" | "Expired",
  package: "Full Package",
  generatedAt: "12 September 2026",
  expiresAt: "12 September 2027",
});

/* --------------------------------------------------
 * Dashboard Statistics
 * -------------------------------------------------- */

const dashboard = ref({
  totalStudentsCreated: 86,
  totalStudentsSubscribed: 64,
  totalStudentsNotSubscribed: 22,
  subscription: "Full Package",
  subscriptionStatus: "Active",
});

/* --------------------------------------------------
 * Computed
 * -------------------------------------------------- */

const tokenIsActive = computed(() => teacherToken.value.status === "Active");

/* --------------------------------------------------
 * Actions
 * -------------------------------------------------- */

const copyToken = async () => {
  try {
    await navigator.clipboard.writeText(teacherToken.value.code);
  } catch {
    console.log("Unable to copy token");
  }
};

const createStudent = () => {
  console.log("Navigate to create student");
};

const manageStudents = () => {
  console.log("Navigate to students");
};

const viewSubscription = () => {
  console.log("Navigate to subscription");
};
</script>

<template>
  <div class="space-y-6 pb-10">
    <!-- ==================================================
         WELCOME HEADER
    =================================================== -->

    <section>
      <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        Teacher Dashboard
      </p>

      <h1
        class="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
      >
        Welcome back, {{ teacher.name }} 👋
      </h1>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Manage your students, subscription and teacher access from one place.
      </p>
    </section>

    <!-- ==================================================
         STATISTICS
    =================================================== -->

    <section>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <!-- Total Students Created -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Students Created
              </p>

              <p
                class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ dashboard.totalStudentsCreated }}
              </p>

              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Students created by you
              </p>
            </div>

            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            >
              <span class="i-heroicons-user-group h-5 w-5"></span>
            </div>
          </div>
        </div>

        <!-- Total Students Subscribed -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Students Subscribed
              </p>

              <p
                class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ dashboard.totalStudentsSubscribed }}
              </p>

              <p class="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                Active subscriptions
              </p>
            </div>

            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              <span class="i-heroicons-check-badge h-5 w-5"></span>
            </div>
          </div>
        </div>

        <!-- Students Not Subscribed -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Students Not Subscribed
              </p>

              <p
                class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ dashboard.totalStudentsNotSubscribed }}
              </p>

              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Awaiting subscription
              </p>
            </div>

            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
            >
              <span class="i-heroicons-user-plus h-5 w-5"></span>
            </div>
          </div>
        </div>

        <!-- Subscription -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                My Subscription
              </p>

              <p
                class="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {{ dashboard.subscription }}
              </p>

              <div
                class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                {{ dashboard.subscriptionStatus }}
              </div>
            </div>
            zxsa
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
            >
              <span class="i-heroicons-credit-card h-5 w-5"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================================================
         TEACHER TOKEN
    =================================================== -->

    <section
      class="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-5 text-white shadow-sm sm:p-7"
    >
      <!-- Decorative -->

      <div class="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10"></div>

      <div class="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-white/5"></div>

      <div class="relative">
        <!-- Token Header -->

        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="mt-4 text-xl font-bold sm:text-2xl">Your Teacher Access Token</h2>

            <p class="mt-2 max-w-xl text-sm leading-6 text-white/70">
              This token was automatically generated for your teacher account and provides
              access to your assigned package.
            </p>
          </div>

          <!-- Status -->

          <div
            class="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold backdrop-blur"
          >
            <span
              class="h-2 w-2 rounded-full"
              :class="tokenIsActive ? 'bg-emerald-400' : 'bg-red-400'"
            ></span>

            {{ teacherToken.status }}
          </div>
        </div>

        <!-- Token Card -->

        <div
          class="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
            Access Token
          </p>

          <div
            class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <code
              class="break-all text-xl font-bold tracking-wider text-white sm:text-2xl"
            >
              {{ teacherToken.code }}
            </code>

            <button
              type="button"
              @click="copyToken"
              class="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <span class="i-heroicons-clipboard-document h-5 w-5"></span>

              Copy Token
            </button>
          </div>

          <!-- Token Details -->

          <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] text-white/50">Package</p>

              <p class="mt-1 text-sm font-semibold">
                {{ teacherToken.package }}
              </p>
            </div>

            <div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] text-white/50">Generated</p>

              <p class="mt-1 text-sm font-semibold">
                {{ teacherToken.generatedAt }}
              </p>
            </div>

            <div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p class="text-[11px] text-white/50">Expires</p>

              <p class="mt-1 text-sm font-semibold">
                {{ teacherToken.expiresAt }}
              </p>
            </div>
          </div>
        </div>

        <!-- Token Footer -->

        <div class="mt-5 flex items-center gap-2 text-xs text-white/65">
          <span class="i-heroicons-shield-check h-4 w-4"></span>

          Your access token is automatically linked to your teacher account.
        </div>
      </div>
    </section>

    <!-- ==================================================
         QUICK ACTIONS
    =================================================== -->

    <section>
      <div class="mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h2>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your students and account.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Create Student -->

        <button
          type="button"
          @click="createStudent"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <span class="i-heroicons-user-plus h-5 w-5"></span>
          </div>

          <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
            Create Student
          </h3>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Create a new student account.
          </p>

          <div
            class="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
          >
            Create student

            <span class="i-heroicons-arrow-right h-3.5 w-3.5"></span>
          </div>
        </button>

        <!-- Manage Students -->

        <button
          type="button"
          @click="manageStudents"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/30"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          >
            <span class="i-heroicons-user-group h-5 w-5"></span>
          </div>

          <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
            Manage Students
          </h3>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            View and manage students you created.
          </p>

          <div
            class="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
          >
            Manage students

            <span class="i-heroicons-arrow-right h-3.5 w-3.5"></span>
          </div>
        </button>

        <!-- Subscription -->

        <button
          type="button"
          @click="viewSubscription"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-violet-500/30"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
          >
            <span class="i-heroicons-credit-card h-5 w-5"></span>
          </div>

          <h3 class="mt-4 text-sm font-bold text-gray-900 dark:text-white">
            Subscription
          </h3>

          <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            View your subscription and access package.
          </p>

          <div
            class="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400"
          >
            View subscription

            <span class="i-heroicons-arrow-right h-3.5 w-3.5"></span>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>
