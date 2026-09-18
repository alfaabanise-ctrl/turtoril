<script setup lang="ts">
import { onMounted, ref } from "vue"

definePageMeta({
  layout: "nav",
})

/* --------------------------------------------------
 * TYPES
 * -------------------------------------------------- */

interface Teacher {
  id: string
  name: string
  firstName?: string
  middleName?: string | null
  lastName?: string | null
  email?: string
  phone?: string | null
  avatar?: string | null
  role?: string
  status?: string
  adminOwner?: string | null
  commissionPercentage?: number
  createdAt?: string
}

interface TeacherToken {
  id: string
  code: string
  plan: string
  amount: number
  paymentReference: string
  status: string
  activatedBy?: string | null
  activatedAt?: string | null
  expiresAt?: string | null
  features?: string[]
  deviceLimit?: number
  deviceCount?: number
  createdAt?: string
  updatedAt?: string
}

interface TeacherDashboard {
  totalStudentsCreated: number
  totalStudentsSubscribed: number
  totalStudentsNotSubscribed: number
  subscription: string
  subscriptionStatus: string
}

/* --------------------------------------------------
 * STATE
 * -------------------------------------------------- */

const loading = ref(false)
const errorMessage = ref("")

const teacher = ref<Teacher>({
  id: "",
  name: "Teacher",
})

const teacherToken = ref<TeacherToken | null>(null)

const dashboard = ref<TeacherDashboard>({
  totalStudentsCreated: 0,
  totalStudentsSubscribed: 0,
  totalStudentsNotSubscribed: 0,
  subscription: "No Subscription",
  subscriptionStatus: "Inactive",
})

/* --------------------------------------------------
 * LOAD TEACHER DASHBOARD
 * -------------------------------------------------- */

const loadTeacherDashboard = async () => {
  loading.value = true
  errorMessage.value = ""

  try {
    const response = await useApiFetch(
      "/teacher/dashboard",
      {
        method: "GET",
      },
    )

    console.log(
      "TEACHER DASHBOARD RESPONSE:",
      response,
    )

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Unable to load teacher dashboard.",
      )
    }

    /*
     * Your useApiFetch may return:
     *
     * response.data
     * OR
     * response.data.data
     *
     * So handle both.
     */

    const data =
      response.data?.data ??
      response.data ??
      response

    /* --------------------------------------------------
     * TEACHER
     * -------------------------------------------------- */

    teacher.value = {
      id:
        String(
          data.teacher?.id ??
            data.teacher?._id ??
            "",
        ),

      name:
        data.teacher?.name ||
        [
          data.teacher?.firstName,
          data.teacher?.middleName,
          data.teacher?.lastName,
        ]
          .filter(Boolean)
          .join(" ") ||
        "Teacher",

      firstName:
        data.teacher?.firstName,

      middleName:
        data.teacher?.middleName ?? null,

      lastName:
        data.teacher?.lastName ?? null,

      email:
        data.teacher?.email,

      phone:
        data.teacher?.phone ?? null,

      avatar:
        data.teacher?.avatar ?? null,

      role:
        data.teacher?.role,

      status:
        data.teacher?.status,

      adminOwner:
        data.teacher?.adminOwner ?? null,

      commissionPercentage:
        Number(
          data.teacher
            ?.commissionPercentage ?? 0,
        ),

      createdAt:
        data.teacher?.createdAt,
    }

    /* --------------------------------------------------
     * DASHBOARD
     * -------------------------------------------------- */

    dashboard.value = {
      totalStudentsCreated:
        Number(
          data.dashboard
            ?.totalStudentsCreated ?? 0,
        ),

      totalStudentsSubscribed:
        Number(
          data.dashboard
            ?.totalStudentsSubscribed ?? 0,
        ),

      totalStudentsNotSubscribed:
        Number(
          data.dashboard
            ?.totalStudentsNotSubscribed ?? 0,
        ),

      subscription:
        data.dashboard?.subscription ||
        "No Subscription",

      subscriptionStatus:
        data.dashboard
          ?.subscriptionStatus ||
        "Inactive",
    }

    /* --------------------------------------------------
     * TEACHER TOKEN
     * -------------------------------------------------- */

    if (data.teacherToken) {
      teacherToken.value = {
        id:
          String(
            data.teacherToken.id ??
              data.teacherToken._id ??
              "",
          ),

        code:
          data.teacherToken.code ||
          data.teacherToken.token ||
          "",

        plan:
          data.teacherToken.plan ||
          "Full Package",

        amount:
          Number(
            data.teacherToken.amount ?? 0,
          ),

        paymentReference:
          data.teacherToken
            .paymentReference ||
          "",

        status:
          data.teacherToken.status ||
          "unused",

        activatedBy:
          data.teacherToken
            .activatedBy ?? null,

        activatedAt:
          data.teacherToken
            .activatedAt ?? null,

        expiresAt:
          data.teacherToken.expiresAt ??
          null,

        features:
          Array.isArray(
            data.teacherToken.features,
          )
            ? data.teacherToken.features
            : [],

        deviceLimit:
          Number(
            data.teacherToken
              .deviceLimit ?? 1,
          ),

        deviceCount:
          Number(
            data.teacherToken
              .deviceCount ?? 0,
          ),

        createdAt:
          data.teacherToken.createdAt,

        updatedAt:
          data.teacherToken.updatedAt,
      }
    } else {
      teacherToken.value = null
    }
  } catch (error: any) {
    console.error(
      "Teacher dashboard error:",
      error,
    )

    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to load teacher dashboard."
  } finally {
    loading.value = false
  }
}

/* --------------------------------------------------
 * COPY TOKEN
 * -------------------------------------------------- */

const copyToken = async () => {
  const code =
    teacherToken.value?.code

  if (!code) {
    return
  }

  try {
    await navigator.clipboard.writeText(
      code,
    )

    console.log(
      "Token copied successfully",
    )
  } catch (error) {
    console.error(
      "Unable to copy token:",
      error,
    )
  }
}

/* --------------------------------------------------
 * NAVIGATION
 * -------------------------------------------------- */

const createStudent = () => {
  navigateTo("/teacher/students/create")
}

const manageStudents = () => {
  navigateTo("/teacher/students")
}

const viewSubscription = () => {
  navigateTo("/teacher/subscription")
}

/* --------------------------------------------------
 * TOKEN STATUS
 * -------------------------------------------------- */

const tokenStatusClass = (
  status: string,
) => {
  switch (
    String(status).toUpperCase()
  ) {
    case "ACTIVE":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"

    case "UNUSED":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"

    case "EXPIRED":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"

    case "REVOKED":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }
}

/* --------------------------------------------------
 * FORMAT TOKEN AMOUNT
 * -------------------------------------------------- */

const formatTokenAmount = (
  amount: number,
) => {
  /*
   * SoftwareToken amount is KOBO.
   *
   * Example:
   * 400000 = ₦4,000
   */

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(
    Number(amount || 0) / 100,
  )
}

/* --------------------------------------------------
 * FORMAT DATE
 * -------------------------------------------------- */

const formatDate = (
  value?: string | null,
) => {
  if (!value) {
    return "Not available"
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Not available"
  }

  return date.toLocaleDateString(
    "en-NG",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  )
}

/* --------------------------------------------------
 * INITIAL LOAD
 * -------------------------------------------------- */

onMounted(() => {
  loadTeacherDashboard()
})
</script>

<template>
  <main
    class="min-h-screen bg-gray-50 dark:bg-gray-950"
  >
    <div
      class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
    >

      <!-- ==================================================
           WELCOME
      =================================================== -->

      <section class="mb-6">
        <div
          class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1
              class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
            >
              Welcome back,
              {{ teacher.name }}
            </h1>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              Manage your students and subscription from your dashboard.
            </p>
          </div>

          <!-- Loading -->
          <div
            v-if="loading"
            class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
          >
            <Icon
              name="heroicons:arrow-path"
              class="h-4 w-4 animate-spin"
            />

            Loading...
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10"
        >
          <div class="flex gap-3">
            <Icon
              name="heroicons:exclamation-circle"
              class="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
            />

            <div>
              <p
                class="text-sm font-semibold text-red-700 dark:text-red-400"
              >
                Unable to load dashboard
              </p>

              <p
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                {{ errorMessage }}
              </p>

              <button
                type="button"
                class="mt-3 text-sm font-semibold text-red-700 underline dark:text-red-400"
                @click="loadTeacherDashboard"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ==================================================
           MAIN DASHBOARD
      =================================================== -->

      <div
        class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
      >

        <!-- ==================================================
             LEFT SIDE
        =================================================== -->

        <div class="min-w-0 space-y-6">

          <!-- ==================================================
               STATISTICS
          =================================================== -->

          <section
            class="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >

            <!-- Total Students -->

            <div
              class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div
                class="flex items-start justify-between"
              >
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Total Students
                  </p>

                  <p
                    class="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {{
                      dashboard.totalStudentsCreated
                    }}
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
              <div
                class="flex items-start justify-between"
              >
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Students Subscribed
                  </p>

                  <p
                    class="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {{
                      dashboard.totalStudentsSubscribed
                    }}
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
              <div
                class="flex items-start justify-between"
              >
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Students Not Subscribed
                  </p>

                  <p
                    class="mt-2 text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {{
                      dashboard.totalStudentsNotSubscribed
                    }}
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
              <div
                class="flex items-start justify-between"
              >
                <div>
                  <p
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    My Subscription
                  </p>

                  <p
                    class="mt-2 text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {{
                      dashboard.subscription
                    }}
                  </p>

                  <p
                    class="mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="
                      dashboard.subscriptionStatus ===
                      'Active'
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : dashboard.subscriptionStatus ===
                          'Expired'
                        ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                    "
                  >
                    {{
                      dashboard.subscriptionStatus
                    }}
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
          =================================================== -->

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
             RIGHT SIDE — ACCESS TOKEN
        =================================================== -->

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

            <!-- ==================================================
                 NO TOKEN
            =================================================== -->

            <div
              v-if="!teacherToken"
              class="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-500/20 dark:bg-yellow-500/10"
            >
              <div class="flex gap-3">
                <Icon
                  name="heroicons:information-circle"
                  class="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400"
                />

                <div>
                  <p
                    class="text-sm font-semibold text-yellow-800 dark:text-yellow-300"
                  >
                    No access token found
                  </p>

                  <p
                    class="mt-1 text-xs leading-5 text-yellow-700 dark:text-yellow-400"
                  >
                    You currently do not have an access token assigned to your account.
                  </p>
                </div>
              </div>
            </div>

            <!-- ==================================================
                 TOKEN
            =================================================== -->

            <template
              v-else
            >

              <!-- Token -->

              <div
                class="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  class="flex items-center justify-between"
                >
                  <p
                    class="text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Access Token
                  </p>

                  <span
                    class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    :class="
                      tokenStatusClass(
                        teacherToken.status,
                      )
                    "
                  >
                    {{
                      teacherToken.status
                    }}
                  </span>
                </div>

                <code
                  class="mt-3 block break-all text-sm font-bold tracking-wider text-gray-900 dark:text-white"
                >
                  {{
                    teacherToken.code
                  }}
                </code>
              </div>

              <!-- Token Information -->

              <div
                class="mt-4 grid grid-cols-2 gap-3"
              >
                <div
                  class="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Plan
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      teacherToken.plan
                    }}
                  </p>
                </div>

                <div
                  class="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Price
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      formatTokenAmount(
                        teacherToken.amount,
                      )
                    }}
                  </p>
                </div>

                <div
                  class="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Device Limit
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      teacherToken.deviceLimit
                    }}
                  </p>
                </div>

                <div
                  class="rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Devices Used
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      teacherToken.deviceCount
                    }}
                  </p>
                </div>
              </div>

              <!-- Expiry -->

              <div
                v-if="teacherToken.expiresAt"
                class="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
              >
                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Expires
                </p>

                <p
                  class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
                >
                  {{
                    formatDate(
                      teacherToken.expiresAt,
                    )
                  }}
                </p>
              </div>

              <!-- Copy -->

              <button
                type="button"
                :disabled="!teacherToken.code"
                @click="copyToken"
                class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon
                  name="heroicons:clipboard-document"
                  class="h-5 w-5"
                />

                Copy Token
              </button>

            </template>

            <!-- Notice -->

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
                This token unlocks the features available to your teacher account and can only be used according to its device limit.
              </p>
            </div>

          </section>
        </aside>

      </div>
    </div>
  </main>
</template>