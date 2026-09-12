
<script setup lang="ts">
definePageMeta({
  layout: "nav",
})

type ReportPeriod = "7 Days" | "30 Days" | "90 Days" | "This Year"

interface RevenuePoint {
  label: string
  revenue: number
  payments: number
}

interface GrowthPoint {
  label: string
  students: number
  teachers: number
}

interface TeacherPerformance {
  id: number
  name: string
  students: number
  paidStudents: number
  revenue: number
  averageScore: number
}

interface AgentPerformance {
  id: number
  name: string
  referrals: number
  paid: number
  conversion: number
  revenue: number
}

interface AdminPerformance {
  id: number
  name: string
  students: number
  teachers: number
  subscriptions: number
  revenue: number
}

const selectedPeriod = ref<ReportPeriod>("30 Days")
const selectedReport = ref("Overview")
const isExporting = ref(false)

const periods: ReportPeriod[] = [
  "7 Days",
  "30 Days",
  "90 Days",
  "This Year",
]

const reportTypes = [
  "Overview",
  "Revenue",
  "Users",
  "Subscriptions",
  "Payments",
  "Referrals",
  "Performance",
]

/* -------------------------------------------------------------------------- */
/*                                  SUMMARY                                   */
/* -------------------------------------------------------------------------- */

const summary = {
  totalRevenue: 1487500,
  revenueGrowth: 18.6,

  totalStudents: 486,
  studentGrowth: 12.4,

  totalTeachers: 38,
  teacherGrowth: 8.2,

  totalAdmins: 12,
  adminGrowth: 4.8,

  activeSubscriptions: 378,
  subscriptionGrowth: 15.7,

  totalPayments: 428,
  successfulPayments: 392,

  pendingPayments: 18,
  failedPayments: 12,
  refundedPayments: 6,

  averageScore: 71.8,
}

/* -------------------------------------------------------------------------- */
/*                              REVENUE DATA                                  */
/* -------------------------------------------------------------------------- */

const revenueData = computed<RevenuePoint[]>(() => {
  if (selectedPeriod.value === "7 Days") {
    return [
      { label: "Mon", revenue: 42000, payments: 14 },
      { label: "Tue", revenue: 58000, payments: 19 },
      { label: "Wed", revenue: 51000, payments: 17 },
      { label: "Thu", revenue: 72000, payments: 25 },
      { label: "Fri", revenue: 68000, payments: 23 },
      { label: "Sat", revenue: 91000, payments: 31 },
      { label: "Sun", revenue: 74000, payments: 25 },
    ]
  }

  if (selectedPeriod.value === "90 Days") {
    return [
      { label: "Jun", revenue: 286000, payments: 81 },
      { label: "Jul", revenue: 342000, payments: 96 },
      { label: "Aug", revenue: 411000, payments: 118 },
      { label: "Sep", revenue: 448500, payments: 133 },
    ]
  }

  if (selectedPeriod.value === "This Year") {
    return [
      { label: "Jan", revenue: 168000, payments: 51 },
      { label: "Feb", revenue: 194000, payments: 58 },
      { label: "Mar", revenue: 217000, payments: 64 },
      { label: "Apr", revenue: 236000, payments: 71 },
      { label: "May", revenue: 258000, payments: 75 },
      { label: "Jun", revenue: 286000, payments: 81 },
      { label: "Jul", revenue: 342000, payments: 96 },
      { label: "Aug", revenue: 411000, payments: 118 },
      { label: "Sep", revenue: 448500, payments: 133 },
    ]
  }

  return [
    { label: "Week 1", revenue: 186000, payments: 51 },
    { label: "Week 2", revenue: 224000, payments: 63 },
    { label: "Week 3", revenue: 258000, payments: 74 },
    { label: "Week 4", revenue: 312000, payments: 89 },
    { label: "Week 5", revenue: 287000, payments: 82 },
    { label: "Week 6", revenue: 220500, payments: 69 },
  ]
})

const maxRevenue = computed(() => {
  return Math.max(...revenueData.value.map((item) => item.revenue), 1)
})

const totalPeriodRevenue = computed(() => {
  return revenueData.value.reduce(
    (total, item) => total + item.revenue,
    0,
  )
})

const totalPeriodPayments = computed(() => {
  return revenueData.value.reduce(
    (total, item) => total + item.payments,
    0,
  )
})

/* -------------------------------------------------------------------------- */
/*                              USER GROWTH                                   */
/* -------------------------------------------------------------------------- */

const growthData = computed<GrowthPoint[]>(() => {
  if (selectedPeriod.value === "7 Days") {
    return [
      { label: "Mon", students: 12, teachers: 2 },
      { label: "Tue", students: 18, teachers: 1 },
      { label: "Wed", students: 21, teachers: 3 },
      { label: "Thu", students: 15, teachers: 2 },
      { label: "Fri", students: 26, teachers: 4 },
      { label: "Sat", students: 31, teachers: 2 },
      { label: "Sun", students: 24, teachers: 1 },
    ]
  }

  if (selectedPeriod.value === "90 Days") {
    return [
      { label: "Jun", students: 71, teachers: 5 },
      { label: "Jul", students: 86, teachers: 7 },
      { label: "Aug", students: 113, teachers: 9 },
      { label: "Sep", students: 126, teachers: 8 },
    ]
  }

  if (selectedPeriod.value === "This Year") {
    return [
      { label: "Jan", students: 38, teachers: 3 },
      { label: "Feb", students: 46, teachers: 4 },
      { label: "Mar", students: 52, teachers: 3 },
      { label: "Apr", students: 61, teachers: 5 },
      { label: "May", students: 72, teachers: 6 },
      { label: "Jun", students: 71, teachers: 5 },
      { label: "Jul", students: 86, teachers: 7 },
      { label: "Aug", students: 113, teachers: 9 },
      { label: "Sep", students: 126, teachers: 8 },
    ]
  }

  return [
    { label: "Week 1", students: 46, teachers: 5 },
    { label: "Week 2", students: 58, teachers: 6 },
    { label: "Week 3", students: 67, teachers: 7 },
    { label: "Week 4", students: 74, teachers: 8 },
    { label: "Week 5", students: 91, teachers: 6 },
    { label: "Week 6", students: 82, teachers: 7 },
  ]
})

const maxGrowth = computed(() => {
  return Math.max(
    ...growthData.value.map((item) => item.students),
    1,
  )
})

/* -------------------------------------------------------------------------- */
/*                          SUBSCRIPTION BREAKDOWN                            */
/* -------------------------------------------------------------------------- */

const subscriptionPlans = [
  {
    name: "Yearly",
    count: 186,
    percentage: 49,
    revenue: 930000,
    icon: "i-heroicons-calendar-days",
    class: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  },
  {
    name: "Quarterly",
    count: 117,
    percentage: 31,
    revenue: 994500,
    icon: "i-heroicons-calendar",
    class: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    name: "Monthly",
    count: 75,
    percentage: 20,
    revenue: 225000,
    icon: "i-heroicons-clock",
    class: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  },
]

/* -------------------------------------------------------------------------- */
/*                            PAYMENT METHODS                                 */
/* -------------------------------------------------------------------------- */

const paymentMethods = [
  {
    name: "Paystack",
    count: 178,
    percentage: 42,
    amount: 612500,
    icon: "i-heroicons-bolt",
    class: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    name: "Card",
    count: 126,
    percentage: 29,
    amount: 428000,
    icon: "i-heroicons-credit-card",
    class: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    name: "Bank Transfer",
    count: 88,
    percentage: 21,
    amount: 319000,
    icon: "i-heroicons-building-library",
    class: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  },
  {
    name: "USSD",
    count: 36,
    percentage: 8,
    amount: 128000,
    icon: "i-heroicons-device-phone-mobile",
    class: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
]

/* -------------------------------------------------------------------------- */
/*                         TEACHER PERFORMANCE                                */
/* -------------------------------------------------------------------------- */

const topTeachers: TeacherPerformance[] = [
  {
    id: 1,
    name: "Mr. Okafor",
    students: 82,
    paidStudents: 76,
    revenue: 286000,
    averageScore: 82,
  },
  {
    id: 2,
    name: "Mr. Adewale",
    students: 71,
    paidStudents: 63,
    revenue: 241500,
    averageScore: 79,
  },
  {
    id: 3,
    name: "Mrs. Adaeze",
    students: 68,
    paidStudents: 54,
    revenue: 196000,
    averageScore: 75,
  },
  {
    id: 4,
    name: "Mr. Yusuf",
    students: 61,
    paidStudents: 49,
    revenue: 181500,
    averageScore: 73,
  },
  {
    id: 5,
    name: "Mrs. Johnson",
    students: 54,
    paidStudents: 43,
    revenue: 158000,
    averageScore: 71,
  },
]

/* -------------------------------------------------------------------------- */
/*                           AGENT PERFORMANCE                                */
/* -------------------------------------------------------------------------- */

const topAgents: AgentPerformance[] = [
  {
    id: 1,
    name: "Mr. Okafor",
    referrals: 96,
    paid: 76,
    conversion: 79,
    revenue: 286000,
  },
  {
    id: 2,
    name: "Mr. Adewale",
    referrals: 84,
    paid: 63,
    conversion: 75,
    revenue: 241500,
  },
  {
    id: 3,
    name: "Mrs. Adaeze",
    referrals: 79,
    paid: 54,
    conversion: 68,
    revenue: 196000,
  },
  {
    id: 4,
    name: "Mr. Yusuf",
    referrals: 72,
    paid: 49,
    conversion: 68,
    revenue: 181500,
  },
]

/* -------------------------------------------------------------------------- */
/*                            ADMIN PERFORMANCE                               */
/* -------------------------------------------------------------------------- */

const admins: AdminPerformance[] = [
  {
    id: 1,
    name: "John Admin",
    students: 142,
    teachers: 11,
    subscriptions: 118,
    revenue: 421500,
  },
  {
    id: 2,
    name: "Sarah Williams",
    students: 126,
    teachers: 9,
    subscriptions: 104,
    revenue: 376000,
  },
  {
    id: 3,
    name: "Michael Brown",
    students: 114,
    teachers: 10,
    subscriptions: 91,
    revenue: 341000,
  },
  {
    id: 4,
    name: "David Anderson",
    students: 104,
    teachers: 8,
    subscriptions: 65,
    revenue: 263000,
  },
]

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                      */
/* -------------------------------------------------------------------------- */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-NG").format(value)
}

const initials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
]

const avatarColor = (name: string) => {
  const index = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0)

  return avatarColors[index % avatarColors.length]
}

const teacherConversion = (teacher: TeacherPerformance) => {
  if (!teacher.students) return 0

  return Math.round((teacher.paidStudents / teacher.students) * 100)
}

const getBarHeight = (value: number, max: number) => {
  if (!max) return "0%"

  return `${Math.max((value / max) * 100, 4)}%`
}

const exportReport = async (type = "full") => {
  isExporting.value = true

  await new Promise((resolve) => setTimeout(resolve, 700))

  const rows = [
    [
      "Report",
      "Super Admin Report",
    ],
    [
      "Period",
      selectedPeriod.value,
    ],
    [
      "Generated",
      new Date().toLocaleString(),
    ],
    [],
    [
      "Metric",
      "Value",
    ],
    [
      "Total Revenue",
      formatCurrency(summary.totalRevenue),
    ],
    [
      "Total Students",
      summary.totalStudents,
    ],
    [
      "Total Teachers",
      summary.totalTeachers,
    ],
    [
      "Total Admins",
      summary.totalAdmins,
    ],
    [
      "Active Subscriptions",
      summary.activeSubscriptions,
    ],
    [
      "Successful Payments",
      summary.successfulPayments,
    ],
    [
      "Pending Payments",
      summary.pendingPayments,
    ],
    [
      "Average Score",
      `${summary.averageScore}%`,
    ],
  ]

  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "")

          return `"${text.replace(/"/g, '""')}"`
        })
        .join(","),
    )
    .join("\n")

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `super-admin-${type}-report-${Date.now()}.csv`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)

  isExporting.value = false
}

const printReport = () => {
  window.print()
}
</script>

<template>
  <div class="space-y-6 pb-10">

    <!-- Header -->
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <div class="flex items-center gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10"
          >
            <Icon
              name="i-heroicons-chart-bar-square"
              class="h-6 w-6 text-violet-600 dark:text-violet-400"
            />
          </div>

          <div>
            <h1
              class="text-xl font-semibold text-gray-900 dark:text-white"
            >
              Reports & Analytics
            </h1>

            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Monitor your platform performance, revenue and user growth.
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">

        <!-- Period -->
        <select
          v-model="selectedPeriod"
          class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-gray-700"
        >
          <option
            v-for="period in periods"
            :key="period"
            :value="period"
          >
            {{ period }}
          </option>
        </select>

        <!-- Print -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          @click="printReport"
        >
          <Icon
            name="i-heroicons-printer"
            class="h-4 w-4"
          />
          Print
        </button>

        <!-- Export -->
        <button
          type="button"
          :disabled="isExporting"
          class="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          @click="exportReport()"
        >
          <Icon
            :name="
              isExporting
                ? 'i-heroicons-arrow-path'
                : 'i-heroicons-arrow-down-tray'
            "
            class="h-4 w-4"
            :class="{ 'animate-spin': isExporting }"
          />

          {{ isExporting ? "Exporting..." : "Export Report" }}
        </button>
      </div>
    </div>

    <!-- Report Navigation -->
    <div
      class="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex min-w-max gap-1">
        <button
          v-for="report in reportTypes"
          :key="report"
          type="button"
          class="rounded-xl px-4 py-2 text-sm font-medium transition"
          :class="
            selectedReport === report
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
          "
          @click="selectedReport = report"
        >
          {{ report }}
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

      <!-- Revenue -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ formatCurrency(summary.totalRevenue) }}
            </p>

            <div class="mt-1 flex items-center gap-1 text-xs">
              <Icon
                name="i-heroicons-arrow-trending-up"
                class="h-3.5 w-3.5 text-emerald-500"
              />

              <span class="font-medium text-emerald-600 dark:text-emerald-400">
                +{{ summary.revenueGrowth }}%
              </span>

              <span class="text-gray-400">
                vs last period
              </span>
            </div>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
          >
            <Icon
              name="i-heroicons-banknotes"
              class="h-5 w-5 text-emerald-500"
            />
          </div>
        </div>
      </div>

      <!-- Students -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Students
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ formatNumber(summary.totalStudents) }}
            </p>

            <div class="mt-1 flex items-center gap-1 text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">
                +{{ summary.studentGrowth }}%
              </span>

              <span class="text-gray-400">
                growth
              </span>
            </div>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10"
          >
            <Icon
              name="i-heroicons-academic-cap"
              class="h-5 w-5 text-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Teachers -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Teachers
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ summary.totalTeachers }}
            </p>

            <div class="mt-1 flex items-center gap-1 text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">
                +{{ summary.teacherGrowth }}%
              </span>

              <span class="text-gray-400">
                growth
              </span>
            </div>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10"
          >
            <Icon
              name="i-heroicons-user-group"
              class="h-5 w-5 text-indigo-500"
            />
          </div>
        </div>
      </div>

      <!-- Subscriptions -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Active Subscriptions
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ summary.activeSubscriptions }}
            </p>

            <div class="mt-1 flex items-center gap-1 text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">
                +{{ summary.subscriptionGrowth }}%
              </span>

              <span class="text-gray-400">
                growth
              </span>
            </div>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10"
          >
            <Icon
              name="i-heroicons-rectangle-stack"
              class="h-5 w-5 text-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- Average Score -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Average Score
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ summary.averageScore }}%
            </p>

            <div class="mt-1 flex items-center gap-1 text-xs">
              <Icon
                name="i-heroicons-arrow-trending-up"
                class="h-3.5 w-3.5 text-emerald-500"
              />

              <span class="font-medium text-emerald-600 dark:text-emerald-400">
                Improving
              </span>
            </div>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10"
          >
            <Icon
              name="i-heroicons-trophy"
              class="h-5 w-5 text-amber-500"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue + Payment Overview -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">

      <!-- Revenue Chart -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Revenue Overview
            </h2>

            <p class="mt-1 text-xs text-gray-400">
              Revenue and successful payment activity
            </p>
          </div>

          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span class="text-gray-500 dark:text-gray-400">
                Revenue
              </span>
            </div>

            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(totalPeriodRevenue) }}
            </span>
          </div>
        </div>

        <div class="mt-8 flex h-64 gap-3">

          <!-- Y Axis -->
          <div class="flex w-12 flex-col justify-between pb-6 text-right text-[10px] text-gray-400">
            <span>
              {{ formatCurrency(maxRevenue).replace(".00", "") }}
            </span>

            <span>
              {{ formatCurrency(Math.round(maxRevenue * 0.75)).replace(".00", "") }}
            </span>

            <span>
              {{ formatCurrency(Math.round(maxRevenue * 0.5)).replace(".00", "") }}
            </span>

            <span>
              {{ formatCurrency(Math.round(maxRevenue * 0.25)).replace(".00", "") }}
            </span>

            <span>
              0
            </span>
          </div>

          <!-- Chart -->
          <div class="relative flex flex-1 items-end gap-2 border-b border-l border-gray-200 pl-3 dark:border-gray-800">

            <!-- Grid -->
            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div />
            </div>

            <div
              v-for="point in revenueData"
              :key="point.label"
              class="group relative z-10 flex h-full flex-1 items-end"
            >
              <div class="flex h-full w-full flex-col justify-end">
                <div
                  class="relative w-full rounded-t-lg bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-600 dark:bg-emerald-500 dark:group-hover:bg-emerald-400"
                  :style="{
                    height: getBarHeight(point.revenue, maxRevenue),
                  }"
                >
                  <!-- Tooltip -->
                  <div
                    class="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block dark:bg-white dark:text-gray-900"
                  >
                    <p class="font-semibold">
                      {{ formatCurrency(point.revenue) }}
                    </p>

                    <p class="mt-0.5 opacity-70">
                      {{ point.payments }} payments
                    </p>
                  </div>
                </div>

                <span
                  class="mt-2 text-center text-[10px] text-gray-400"
                >
                  {{ point.label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Summary -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <h2
            class="font-semibold text-gray-900 dark:text-white"
          >
            Payment Summary
          </h2>

          <p class="mt-1 text-xs text-gray-400">
            Transaction performance
          </p>
        </div>

        <div class="mt-6 flex items-center justify-center">
          <div class="relative flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              class="absolute inset-2 flex items-center justify-center rounded-full bg-white dark:bg-gray-900"
            >
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ Math.round((summary.successfulPayments / summary.totalPayments) * 100) }}%
                </p>

                <p class="text-[10px] text-gray-400">
                  Success
                </p>
              </div>
            </div>

            <svg
              class="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                class="text-gray-100 dark:text-gray-800"
              />

              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                stroke-linecap="round"
                class="text-emerald-500"
                :stroke-dasharray="`${(summary.successfulPayments / summary.totalPayments) * 276.46} 276.46`"
              />
            </svg>
          </div>
        </div>

        <div class="mt-6 space-y-3">

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300">
                Successful
              </span>
            </div>

            <span class="font-semibold text-gray-900 dark:text-white">
              {{ summary.successfulPayments }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-amber-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300">
                Pending
              </span>
            </div>

            <span class="font-semibold text-gray-900 dark:text-white">
              {{ summary.pendingPayments }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-rose-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300">
                Failed
              </span>
            </div>

            <span class="font-semibold text-gray-900 dark:text-white">
              {{ summary.failedPayments }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-violet-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300">
                Refunded
              </span>
            </div>

            <span class="font-semibold text-gray-900 dark:text-white">
              {{ summary.refundedPayments }}
            </span>
          </div>

        </div>
      </div>
    </div>

    <!-- User Growth + Subscription -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

      <!-- User Growth -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              User Growth
            </h2>

            <p class="mt-1 text-xs text-gray-400">
              New students and teachers
            </p>
          </div>

          <div class="flex items-center gap-3 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span class="text-gray-400">Students</span>
            </div>

            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <span class="text-gray-400">Teachers</span>
            </div>
          </div>
        </div>

        <div class="mt-8 flex h-56 gap-4">

          <div class="flex w-7 flex-col justify-between pb-5 text-[10px] text-gray-400">
            <span>{{ maxGrowth }}</span>
            <span>{{ Math.round(maxGrowth * 0.75) }}</span>
            <span>{{ Math.round(maxGrowth * 0.5) }}</span>
            <span>{{ Math.round(maxGrowth * 0.25) }}</span>
            <span>0</span>
          </div>

          <div class="relative flex flex-1 items-end gap-2 border-b border-l border-gray-200 pl-3 dark:border-gray-800">

            <div class="pointer-events-none absolute inset-0 flex flex-col justify-between pb-5">
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div class="border-t border-dashed border-gray-100 dark:border-gray-800" />
              <div />
            </div>

            <div
              v-for="point in growthData"
              :key="point.label"
              class="relative z-10 flex h-full flex-1 items-end gap-1"
            >
              <div
                class="w-1/2 rounded-t-md bg-blue-500 transition-all hover:bg-blue-600"
                :style="{
                  height: getBarHeight(point.students, maxGrowth),
                }"
                :title="`${point.students} students`"
              />

              <div
                class="w-1/2 rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-600"
                :style="{
                  height: getBarHeight(point.teachers, maxGrowth),
                }"
                :title="`${point.teachers} teachers`"
              />

              <span
                class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400"
              >
                {{ point.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscription Plans -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Subscription Plans
            </h2>

            <p class="mt-1 text-xs text-gray-400">
              Active subscriptions by plan
            </p>
          </div>

          <button
            type="button"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            @click="exportReport('subscriptions')"
          >
            Export
          </button>
        </div>

        <div class="mt-6 space-y-5">

          <div
            v-for="plan in subscriptionPlans"
            :key="plan.name"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg"
                  :class="plan.class"
                >
                  <Icon
                    :name="plan.icon"
                    class="h-4 w-4"
                  />
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {{ plan.name }}
                  </p>

                  <p class="text-[11px] text-gray-400">
                    {{ plan.count }} subscriptions
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(plan.revenue) }}
                </p>

                <p class="text-[11px] text-gray-400">
                  {{ plan.percentage }}%
                </p>
              </div>
            </div>

            <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                class="h-full rounded-full bg-indigo-500 transition-all"
                :style="{ width: `${plan.percentage}%` }"
              />
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            class="font-semibold text-gray-900 dark:text-white"
          >
            Payment Methods
          </h2>

          <p class="mt-1 text-xs text-gray-400">
            How customers are paying on the platform
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          @click="exportReport('payments')"
        >
          <Icon
            name="i-heroicons-arrow-down-tray"
            class="h-3.5 w-3.5"
          />
          Export payment report
        </button>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div
          v-for="method in paymentMethods"
          :key="method.name"
          class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg"
              :class="method.class"
            >
              <Icon
                :name="method.icon"
                class="h-4 w-4"
              />
            </div>

            <span class="text-xs font-medium text-gray-400">
              {{ method.percentage }}%
            </span>
          </div>

          <p class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ method.name }}
          </p>

          <p class="mt-1 text-xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(method.amount) }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            {{ method.count }} transactions
          </p>

          <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              class="h-full rounded-full bg-indigo-500"
              :style="{ width: `${method.percentage}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Tables -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

      <!-- Teachers -->
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Top Teachers
            </h2>

            <p class="mt-1 text-xs text-gray-400">
              Teacher performance by students and revenue
            </p>
          </div>

          <button
            type="button"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            @click="exportReport('teachers')"
          >
            Export
          </button>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">

          <div
            v-for="(teacher, index) in topTeachers"
            :key="teacher.id"
            class="flex items-center gap-3 px-5 py-4"
          >
            <span class="w-5 text-center text-xs font-semibold text-gray-400">
              {{ index + 1 }}
            </span>

            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              :class="avatarColor(teacher.name)"
            >
              {{ initials(teacher.name) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                {{ teacher.name }}
              </p>

              <div class="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                <span>
                  {{ teacher.students }} students
                </span>

                <span>•</span>

                <span>
                  {{ teacherConversion(teacher) }}% paid
                </span>
              </div>
            </div>

            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(teacher.revenue) }}
              </p>

              <div class="mt-1 flex items-center justify-end gap-1">
                <Icon
                  name="i-heroicons-star"
                  class="h-3 w-3 text-amber-500"
                />

                <span class="text-[11px] text-gray-400">
                  {{ teacher.averageScore }}% avg.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Agents -->
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Top Agents / Teachers
            </h2>

            <p class="mt-1 text-xs text-gray-400">
              Best referral conversion performance
            </p>
          </div>

          <button
            type="button"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            @click="exportReport('referrals')"
          >
            Export
          </button>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">

          <div
            v-for="(agent, index) in topAgents"
            :key="agent.id"
            class="flex items-center gap-3 px-5 py-4"
          >
            <span class="w-5 text-center text-xs font-semibold text-gray-400">
              {{ index + 1 }}
            </span>

            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              :class="avatarColor(agent.name)"
            >
              {{ initials(agent.name) }}
            </div>

            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                {{ agent.name }}
              </p>

              <div class="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                <span>
                  {{ agent.referrals }} referrals
                </span>

                <span>•</span>

                <span>
                  {{ agent.paid }} paid
                </span>
              </div>
            </div>

            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ agent.conversion }}%
              </p>

              <p class="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                {{ formatCurrency(agent.revenue) }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Admin Performance -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h2
            class="font-semibold text-gray-900 dark:text-white"
          >
            Administrator Performance
          </h2>

          <p class="mt-1 text-xs text-gray-400">
            Overview of activity across administrators
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          @click="exportReport('admins')"
        >
          <Icon
            name="i-heroicons-arrow-down-tray"
            class="h-3.5 w-3.5"
          />
          Export admin report
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[720px]">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <th class="px-5 py-3 text-left text-xs font-medium text-gray-400">
                Administrator
              </th>

              <th class="px-5 py-3 text-left text-xs font-medium text-gray-400">
                Students
              </th>

              <th class="px-5 py-3 text-left text-xs font-medium text-gray-400">
                Teachers
              </th>

              <th class="px-5 py-3 text-left text-xs font-medium text-gray-400">
                Subscriptions
              </th>

              <th class="px-5 py-3 text-right text-xs font-medium text-gray-400">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">

            <tr
              v-for="admin in admins"
              :key="admin.id"
              class="transition hover:bg-gray-50 dark:hover:bg-gray-950"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                    :class="avatarColor(admin.name)"
                  >
                    {{ initials(admin.name) }}
                  </div>

                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ admin.name }}
                    </p>

                    <p class="text-[11px] text-gray-400">
                      Administrator
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-5 py-4">
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {{ admin.students }}
                </span>
              </td>

              <td class="px-5 py-4">
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {{ admin.teachers }}
                </span>
              </td>

              <td class="px-5 py-4">
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {{ admin.subscriptions }}
                </span>
              </td>

              <td class="px-5 py-4 text-right">
                <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(admin.revenue) }}
                </span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <!-- Quick Reports -->
    <div>
      <div class="mb-4">
        <h2
          class="font-semibold text-gray-900 dark:text-white"
        >
          Quick Reports
        </h2>

        <p class="mt-1 text-xs text-gray-400">
          Generate specific reports for your records
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <button
          type="button"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900"
          @click="exportReport('students')"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10"
            >
              <Icon
                name="i-heroicons-academic-cap"
                class="h-5 w-5 text-blue-500"
              />
            </div>

            <Icon
              name="i-heroicons-arrow-down-tray"
              class="h-4 w-4 text-gray-300 transition group-hover:text-blue-500"
            />
          </div>

          <p class="mt-4 font-medium text-gray-900 dark:text-white">
            Student Report
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-400">
            Student registrations, activity and performance.
          </p>
        </button>

        <button
          type="button"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-900"
          @click="exportReport('revenue')"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
            >
              <Icon
                name="i-heroicons-banknotes"
                class="h-5 w-5 text-emerald-500"
              />
            </div>

            <Icon
              name="i-heroicons-arrow-down-tray"
              class="h-4 w-4 text-gray-300 transition group-hover:text-emerald-500"
            />
          </div>

          <p class="mt-4 font-medium text-gray-900 dark:text-white">
            Revenue Report
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-400">
            Revenue, transactions and payment performance.
          </p>
        </button>

        <button
          type="button"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-900"
          @click="exportReport('subscriptions')"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10"
            >
              <Icon
                name="i-heroicons-rectangle-stack"
                class="h-5 w-5 text-purple-500"
              />
            </div>

            <Icon
              name="i-heroicons-arrow-down-tray"
              class="h-4 w-4 text-gray-300 transition group-hover:text-purple-500"
            />
          </div>

          <p class="mt-4 font-medium text-gray-900 dark:text-white">
            Subscription Report
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-400">
            Plans, active subscriptions and renewals.
          </p>
        </button>

        <button
          type="button"
          class="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-900"
          @click="exportReport('referrals')"
        >
          <div class="flex items-center justify-between">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10"
            >
              <Icon
                name="i-heroicons-user-group"
                class="h-5 w-5 text-orange-500"
              />
            </div>

            <Icon
              name="i-heroicons-arrow-down-tray"
              class="h-4 w-4 text-gray-300 transition group-hover:text-orange-500"
            />
          </div>

          <p class="mt-4 font-medium text-gray-900 dark:text-white">
            Referral Report
          </p>

          <p class="mt-1 text-xs leading-5 text-gray-400">
            Agents, teachers, referrals and conversions.
          </p>
        </button>

      </div>
    </div>

  </div>
</template>

<style>
@media print {
  body {
    background: white !important;
  }

  button,
  select {
    display: none !important;
  }

  .dark\:bg-gray-900,
  .dark\:bg-gray-950 {
    background: white !important;
  }

  .dark\:text-white,
  .dark\:text-gray-200,
  .dark\:text-gray-300 {
    color: #111827 !important;
  }
}
</style>
