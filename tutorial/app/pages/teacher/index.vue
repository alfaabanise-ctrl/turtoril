<script setup lang="ts">
import { ref } from "vue";

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
 * Teacher Access Token
 * -------------------------------------------------- */

const teacherToken = ref({
  code: "TCH-7K4P-92LM-XQ8T",
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
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <!-- ==================================================
           WELCOME
      ================================================== -->

      <section class="mb-6">
        <div>
          <h1
            class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
          >
            Welcome back, {{ teacher.name }}
          </h1>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            Manage your students and subscription from your dashboard.
          </p>
        </div>
      </section>

      <!-- ==================================================
           MAIN DASHBOARD
      ================================================== -->

      <div
        class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
      >

        <!-- ==================================================
             LEFT SIDE
        ================================================== -->

        <div class="min-w-0 space-y-6">

          <!-- ==================================================
               STATISTICS
          ================================================== -->

          <section
            class="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >

            <!-- Total Students -->

            <div
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Total Students
                  </p>

                  <p
                    class="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {{ dashboard.totalStudentsCreated }}
                  </p>
                </div>

                <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Icon
                    name="heroicons:user-group"
                    class="h-6 w-6"
                  />
                </div>
              </div>
            </div>

            <!-- Subscribed Students -->

            <div
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Students Subscribed
                  </p>

                  <p
                    class="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {{ dashboard.totalStudentsSubscribed }}
                  </p>
                </div>

                <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                >
                  <Icon
                    name="heroicons:check-circle"
                    class="h-6 w-6"
                  />
                </div>
              </div>
            </div>

            <!-- Not Subscribed -->

            <div
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Students Not Subscribed
                  </p>

                  <p
                    class="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {{ dashboard.totalStudentsNotSubscribed }}
                  </p>
                </div>

                <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                >
                  <Icon
                    name="heroicons:user-plus"
                    class="h-6 w-6"
                  />
                </div>
              </div>
            </div>

            <!-- Subscription -->

            <div
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    My Subscription
                  </p>

                  <p
                    class="mt-2 text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {{ dashboard.subscription }}
                  </p>

                  <p
                    class="mt-1 text-xs font-medium text-green-600 dark:text-green-400"
                  >
                    {{ dashboard.subscriptionStatus }}
                  </p>
                </div>

                <div
                  class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Icon
                    name="heroicons:credit-card"
                    class="h-6 w-6"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- ==================================================
               QUICK ACTIONS
          ================================================== -->

          <section
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
          >
            <div>
              <h2
                class="text-lg font-bold text-gray-900 dark:text-white"
              >
                Quick Actions
              </h2>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                Quickly access the most important teacher actions.
              </p>
            </div>

            <div
              class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
            >

              <!-- Create Student -->

              <button
                type="button"
                @click="createStudent"
                class="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Icon
                    name="heroicons:user-plus"
                    class="h-5 w-5"
                  />
                </span>

                <span>
                  <span
                    class="block text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Create Student
                  </span>

                  <span
                    class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400"
                  >
                    Add a new student
                  </span>
                </span>
              </button>

              <!-- Manage Students -->

              <button
                type="button"
                @click="manageStudents"
                class="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Icon
                    name="heroicons:users"
                    class="h-5 w-5"
                  />
                </span>

                <span>
                  <span
                    class="block text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Manage Students
                  </span>

                  <span
                    class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400"
                  >
                    View your students
                  </span>
                </span>
              </button>

              <!-- Subscription -->

              <button
                type="button"
                @click="viewSubscription"
                class="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10"
              >
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <Icon
                    name="heroicons:credit-card"
                    class="h-5 w-5"
                  />
                </span>

                <span>
                  <span
                    class="block text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Subscription
                  </span>

                  <span
                    class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400"
                  >
                    Manage your plan
                  </span>
                </span>
              </button>

            </div>
          </section>
        </div>

        <!-- ==================================================
             RIGHT SIDE — SIMPLE TOKEN
        ================================================== -->

        <aside class="min-w-0">
          <section
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
          >

            <h2
              class="text-lg font-bold text-gray-900 dark:text-white"
            >
              Teacher Access Token
            </h2>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              Your token for accessing the app.
            </p>

            <!-- Token -->

            <div
              class="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <p
                class="text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Access Token
              </p>

              <code
                class="mt-2 block break-all text-sm font-bold tracking-wider text-gray-900 dark:text-white"
              >
                {{ teacherToken.code }}
              </code>
            </div>

            <!-- Copy -->

            <button
              type="button"
              @click="copyToken"
              class="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              <Icon
                name="heroicons:clipboard-document"
                class="h-5 w-5"
              />

              Copy Token
            </button>

            <!-- Simple Notice -->

            <div
              class="mt-4 flex gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <Icon
                name="heroicons:information-circle"
                class="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400"
              />

              <p
                class="text-xs leading-5 text-gray-600 dark:text-gray-300"
              >
                This token unlocks all features of the app and can
                only be used on one device.
              </p>
            </div>

          </section>
        </aside>

      </div>
    </div>
  </main>
</template>