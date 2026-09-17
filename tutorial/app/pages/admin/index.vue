
<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Types
 * -------------------------------------------------- */

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  directStudents: number;
  teacherStudents: number;
  activeSubscriptions: number;
  totalRevenue: number;
  walletBalance: number;
  unusedTokens: number;
  totalTokens: number;
  usedTokens: number;
  expiredTokens: number;
  revokedTokens: number;
}

interface Student {
  _id: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string | null;
  name?: string;
  email: string;
  status: string;
  teacher?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  } | null;
  createdAt?: string;
}

interface Teacher {
  _id: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string | null;
  name?: string;
  email?: string;
  students: number;
  paid: number;
}

interface Payment {
  _id: string;
  student?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  } | null;
  amount: number;
  plan?: string;
  status: string;
  paidAt?: string;
  createdAt?: string;
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  recentStudents: Student[];
  recentTeachers: Teacher[];
  topTeachers: Teacher[];
  recentPayments: Payment[];
}

/* --------------------------------------------------
 * Default / fallback data
 * -------------------------------------------------- */

const defaultStats: DashboardStats = {
  totalStudents: 0,
  totalTeachers: 0,
  directStudents: 0,
  teacherStudents: 0,
  activeSubscriptions: 0,
  totalRevenue: 0,
  walletBalance: 0,
  unusedTokens: 0,
  totalTokens: 0,
  usedTokens: 0,
  expiredTokens: 0,
  revokedTokens: 0,
};

/*
 * Keep the page alive even if the API is unavailable.
 */
const dashboard = ref<DashboardResponse | null>(null);

const pending = ref(true);
const isRefreshing = ref(false);
const apiError = ref<unknown>(null);

/* --------------------------------------------------
 * API fetch
 * -------------------------------------------------- */

async function loadDashboard() {
  pending.value = true;
  apiError.value = null;

  try {
    const response = await useApiFetch<DashboardResponse>(
      "/admin/dashboard",
      {
        method: "GET",
      }
    );

    /*
     * useApiFetch normally returns:
     * {
     *   data,
     *   pending,
     *   error,
     *   refresh
     * }
     *
     * We only take the actual data here.
     */
      console.log(response.data.data);
      
    if (response?.data?.data) {
      dashboard.value = response.data.data;
    } else {
      dashboard.value = null;

      if (response?.error?.value) {
        apiError.value = response.error.value;
      }
    }
  } catch (err) {
    /*
     * IMPORTANT:
     * API crash/network/server error will NOT crash the page.
     */
    console.error("Admin dashboard API error:", err);

    apiError.value = err;
    dashboard.value = null;
  } finally {
    pending.value = false;
  }
}

/*
 * Initial request.
 *
 * If API crashes, catch() above prevents the page
 * from crashing.
 */
await loadDashboard();

/* --------------------------------------------------
 * Refresh
 * -------------------------------------------------- */

async function reloadDashboard() {
  if (isRefreshing.value) {
    return;
  }

  isRefreshing.value = true;

  try {
    await loadDashboard();
  } finally {
    isRefreshing.value = false;
  }
}

/* --------------------------------------------------
 * Safe data
 * -------------------------------------------------- */

const statsData = computed<DashboardStats>(() => {
  return {
    ...defaultStats,
    ...(dashboard.value?.stats || {}),
  };
});

const recentStudents = computed<Student[]>(() => {
  return dashboard.value?.recentStudents || [];
});

const recentPayments = computed<Payment[]>(() => {
  return dashboard.value?.recentPayments || [];
});

const topTeachers = computed<Teacher[]>(() => {
  return dashboard.value?.topTeachers || [];
});

/* --------------------------------------------------
 * API state
 * -------------------------------------------------- */

const hasApiError = computed(() => {
  return Boolean(apiError.value);
});

/*
 * API did not crash, but backend returned no dashboard.
 */
const isEmptyDashboard = computed(() => {
  return (
    !pending.value &&
    !apiError.value &&
    !dashboard.value
  );
});

/* --------------------------------------------------
 * Stats
 * -------------------------------------------------- */

const stats = computed(() => [
  {
    label: "Total Students",
    value: statsData.value.totalStudents.toLocaleString(),
    change: `${statsData.value.directStudents.toLocaleString()} registered directly`,
    icon: "i-heroicons-academic-cap",
    color: "indigo",
  },

  {
    label: "Total Teachers",
    value: statsData.value.totalTeachers.toLocaleString(),
    change: "Teachers in your network",
    icon: "i-heroicons-user-group",
    color: "emerald",
  },

  {
    label: "Active Subscriptions",
    value: statsData.value.activeSubscriptions.toLocaleString(),
    change: `${statsData.value.unusedTokens.toLocaleString()} unused tokens`,
    icon: "i-heroicons-check-circle",
    color: "green",
  },

  {
    label: "Wallet Balance",
    value: formatCurrency(statsData.value.walletBalance),
    change: "Available balance",
    icon: "i-heroicons-wallet",
    color: "amber",
  },
]);

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

function formatCurrency(amount: number | undefined | null) {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStudentName(student: Student) {
  if (student.name) {
    return student.name;
  }

  return (
    `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
    "Unknown Student"
  );
}

function getTeacherName(
  teacher: Teacher | Student["teacher"]
) {
  if (!teacher) {
    return "Direct Registration";
  }

  if (teacher.name) {
    return teacher.name;
  }

  return (
    `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
    "Unknown Teacher"
  );
}

function getPaymentStudentName(payment: Payment) {
  if (!payment.student) {
    return "Unknown Student";
  }

  if (payment.student.name) {
    return payment.student.name;
  }

  return (
    `${payment.student.firstName || ""} ${
      payment.student.lastName || ""
    }`.trim() || "Unknown Student"
  );
}

function initials(name: string) {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
];

function avatarColor(name: string) {
  const total = name
    .split("")
    .reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    );

  return avatarColors[
    total % avatarColors.length
  ];
}

function studentStatusClass(status: string) {
  if (status === "Active") {
    return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
  }

  if (status === "Suspended") {
    return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
  }

  return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
}

function studentStatusDot(status: string) {
  if (status === "Active") {
    return "bg-green-500";
  }

  if (status === "Suspended") {
    return "bg-red-500";
  }

  return "bg-amber-500";
}

function paymentStatusClass(status: string) {
  if (status === "SUCCESS") {
    return "text-green-500";
  }

  if (
    status === "PENDING" ||
    status === "PROCESSING" ||
    status === "CREATED"
  ) {
    return "text-amber-500";
  }

  return "text-red-500";
}

function paymentStatusLabel(status: string) {
  switch (status) {
    case "SUCCESS":
      return "Successful";

    case "PENDING":
      return "Pending";

    case "PROCESSING":
      return "Processing";

    case "CREATED":
      return "Created";

    case "FAILED":
      return "Failed";

    case "CANCELLED":
      return "Cancelled";

    case "EXPIRED":
      return "Expired";

    case "REFUNDED":
      return "Refunded";

    case "PARTIALLY_REFUNDED":
      return "Partially Refunded";

    default:
      return status || "Unknown";
  }
}

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function teacherProgress(teacher: Teacher) {
  if (!teacher.students) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (teacher.paid / teacher.students) * 100
    )
  );
}
</script>


<template>   
<div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

```
<!-- Header -->
<div
  class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
>
  <div>
    <h1
      class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
    >
      Dashboard
    </h1>

    <p class="text-sm text-gray-400 mt-1">
      Manage your students, teachers and subscriptions
    </p>
  </div>

  <div class="flex items-center gap-2">

    <button
      @click="reloadDashboard"
      :disabled="pending || isRefreshing"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
    >
      <Icon
        name="i-heroicons-arrow-path"
        class="w-4 h-4"
        :class="{ 'animate-spin': pending || isRefreshing }"
      />

      Refresh
    </button>

    <NuxtLink
      to="/admin/teachers/create"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <Icon name="i-heroicons-user-group" class="w-4 h-4" />
      Add Teacher
    </NuxtLink>

    <NuxtLink
      to="/admin/students/create"
      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
    >
      <Icon name="i-heroicons-user-plus" class="w-4 h-4" />
      Add Student
    </NuxtLink>
  </div>
</div>

<!-- Error -->
<div
  v-if="error"
  class="mb-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4"
>
  <div class="flex items-start gap-3">
    <Icon
      name="i-heroicons-exclamation-triangle"
      class="w-5 h-5 text-red-500 shrink-0"
    />

    <div>
      <p class="font-medium text-red-700 dark:text-red-400">
        Unable to load dashboard
      </p>

      <p class="text-sm text-red-600 dark:text-red-400/80 mt-1">
        Please refresh the page or try again.
      </p>

      <button
        @click="reloadDashboard"
        class="mt-3 text-sm font-medium text-red-700 dark:text-red-400 hover:underline"
      >
        Try again
      </button>
    </div>
  </div>
</div>

<!-- Loading -->
<div
  v-if="pending"
  class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
>
  <div
    v-for="n in 4"
    :key="n"
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 animate-pulse"
  >
    <div class="flex justify-between">
      <div class="space-y-3">
        <div class="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div class="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div class="h-3 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>

      <div class="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
    </div>
  </div>
</div>

<!-- Stats -->
<div
  v-else
  class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
>
  <div
    v-for="stat in stats"
    :key="stat.label"
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5"
  >
    <div class="flex items-start justify-between">

      <div>
        <p class="text-sm text-gray-400">
          {{ stat.label }}
        </p>

        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {{ stat.value }}
        </p>

        <p class="text-xs text-gray-400 mt-1">
          {{ stat.change }}
        </p>
      </div>

      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center"
        :class="{
          'bg-indigo-50 dark:bg-indigo-500/10':
            stat.color === 'indigo',

          'bg-emerald-50 dark:bg-emerald-500/10':
            stat.color === 'emerald',

          'bg-green-50 dark:bg-green-500/10':
            stat.color === 'green',

          'bg-amber-50 dark:bg-amber-500/10':
            stat.color === 'amber',
        }"
      >
        <Icon
          :name="stat.icon"
          class="w-5 h-5"
          :class="{
            'text-indigo-600 dark:text-indigo-400':
              stat.color === 'indigo',

            'text-emerald-600 dark:text-emerald-400':
              stat.color === 'emerald',

            'text-green-600 dark:text-green-400':
              stat.color === 'green',

            'text-amber-600 dark:text-amber-400':
              stat.color === 'amber',
          }"
        />
      </div>
    </div>
  </div>
</div>

<!-- Quick Actions -->
<div
  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
>

  <NuxtLink
    to="/admin/students"
    class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition"
  >
    <div
      class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-3"
    >
      <Icon
        name="i-heroicons-academic-cap"
        class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
      />
    </div>

    <p class="font-semibold text-gray-900 dark:text-white">
      Students
    </p>

    <p class="text-xs text-gray-400 mt-1">
      View and manage students
    </p>
  </NuxtLink>

  <NuxtLink
    to="/admin/teachers"
    class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition"
  >
    <div
      class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3"
    >
      <Icon
        name="i-heroicons-user-group"
        class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
      />
    </div>

    <p class="font-semibold text-gray-900 dark:text-white">
      Teachers
    </p>

    <p class="text-xs text-gray-400 mt-1">
      Manage your teachers
    </p>
  </NuxtLink>

  <NuxtLink
    to="/admin/subscriptions"
    class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-amber-300 dark:hover:border-amber-500/40 transition"
  >
    <div
      class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-3"
    >
      <Icon
        name="i-heroicons-rectangle-stack"
        class="w-5 h-5 text-amber-600 dark:text-amber-400"
      />
    </div>

    <p class="font-semibold text-gray-900 dark:text-white">
      Subscriptions
    </p>

    <p class="text-xs text-gray-400 mt-1">
      Track student subscriptions
    </p>
  </NuxtLink>

  <NuxtLink
    to="/admin/wallet"
    class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-violet-300 dark:hover:border-violet-500/40 transition"
  >
    <div
      class="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center mb-3"
    >
      <Icon
        name="i-heroicons-wallet"
        class="w-5 h-5 text-violet-600 dark:text-violet-400"
      />
    </div>

    <p class="font-semibold text-gray-900 dark:text-white">
      Wallet
    </p>

    <p class="text-xs text-gray-400 mt-1">
      View earnings and balance
    </p>
  </NuxtLink>

</div>

<!-- Main Content -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

  <!-- Recent Students -->
  <div
    class="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
  >

    <div
      class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800"
    >
      <div>
        <h2 class="font-semibold text-gray-900 dark:text-white">
          Recent Students
        </h2>

        <p class="text-xs text-gray-400 mt-0.5">
          Latest students in your network
        </p>
      </div>

      <NuxtLink
        to="/admin/students"
        class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        View all
      </NuxtLink>
    </div>

    <!-- Empty -->
    <div
      v-if="!recentStudents.length"
      class="px-5 py-10 text-center"
    >
      <Icon
        name="i-heroicons-academic-cap"
        class="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700"
      />

      <p class="text-sm text-gray-500 mt-2">
        No students found
      </p>
    </div>

    <div
      v-else
      class="divide-y divide-gray-100 dark:divide-gray-800"
    >

      <div
        v-for="student in recentStudents"
        :key="student._id"
        class="flex items-center justify-between gap-4 px-5 py-4"
      >

        <div class="flex items-center gap-3 min-w-0">

          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :class="avatarColor(getStudentName(student))"
          >
            {{ initials(getStudentName(student)) }}
          </div>

          <div class="min-w-0">

            <p
              class="font-medium text-sm text-gray-900 dark:text-white truncate"
            >
              {{ getStudentName(student) }}
            </p>

            <p class="text-xs text-gray-400 truncate">
              {{ student.email }}
            </p>

          </div>
        </div>

        <div class="hidden sm:block text-right">

          <p class="text-xs text-gray-400">
            Teacher
          </p>
          
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ student.teacher}}
          </p>

        </div>

        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
          :class="studentStatusClass(student.status)"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="studentStatusDot(student.status)"
          ></span>

          {{ student.status }}
        </span>

      </div>

    </div>
  </div>

  <!-- Top Teachers -->
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
  >

    <div
      class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800"
    >
      <div>
        <h2 class="font-semibold text-gray-900 dark:text-white">
          Top Teachers
        </h2>

        <p class="text-xs text-gray-400 mt-0.5">
          By student count
        </p>
      </div>

      <NuxtLink
        to="/admin/teachers"
        class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        View all
      </NuxtLink>
    </div>

    <div
      v-if="!topTeachers.length"
      class="p-8 text-center"
    >
      <Icon
        name="i-heroicons-user-group"
        class="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700"
      />

      <p class="text-sm text-gray-500 mt-2">
        No teachers found
      </p>
    </div>

    <div
      v-else
      class="p-5 space-y-5"
    >

      <div
        v-for="teacher in topTeachers"
        :key="teacher._id"
      >

        <div class="flex items-center justify-between mb-2">

          <div class="flex items-center gap-2">

            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
              :class="avatarColor(getTeacherName(teacher))"
            >
              {{ initials(getTeacherName(teacher)) }}
            </div>

            <span
              class="text-sm font-medium text-gray-800 dark:text-gray-200"
            >
              {{ getTeacherName(teacher) }}
            </span>

          </div>

          <span class="text-xs text-gray-400">
            {{ teacher.students }} students
          </span>

        </div>

        <div
          class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-indigo-500 rounded-full"
            :style="{
              width: `${teacherProgress(teacher)}%`,
            }"
          ></div>
        </div>

        <p class="text-[11px] text-gray-400 mt-1">
          {{ teacher.paid }} subscribed
        </p>

      </div>

    </div>
  </div>

</div>

<!-- Payments -->
<div
  class="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
>

  <div
    class="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800"
  >

    <div>
      <h2 class="font-semibold text-gray-900 dark:text-white">
        Recent Payments
      </h2>

      <p class="text-xs text-gray-400 mt-0.5">
        Latest subscription payments
      </p>
    </div>

    <NuxtLink
      to="/admin/payments"
      class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
    >
      View all
    </NuxtLink>

  </div>

  <!-- Empty -->
  <div
    v-if="!recentPayments.length"
    class="px-5 py-10 text-center"
  >
    <Icon
      name="i-heroicons-banknotes"
      class="w-8 h-8 mx-auto text-gray-300 dark:text-gray-700"
    />

    <p class="text-sm text-gray-500 mt-2">
      No payments found
    </p>
  </div>

  <div
    v-else
    class="divide-y divide-gray-100 dark:divide-gray-800"
  >

    <div
      v-for="payment in recentPayments"
      :key="payment._id"
      class="flex items-center justify-between gap-4 px-5 py-4"
    >

      <div class="flex items-center gap-3">

        <div
          class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
        >
          <Icon
            name="i-heroicons-banknotes"
            class="w-4 h-4 text-emerald-600 dark:text-emerald-400"
          />
        </div>

        <div>

          <p
            class="text-sm font-medium text-gray-900 dark:text-white"
          >
            {{ payment.student}}
          </p>

          <p class="text-xs text-gray-400">
            {{ payment.plan || "Subscription" }}

            <span v-if="payment.paidAt">
              · {{ formatDate(payment.paidAt) }}
            </span>
          </p>

        </div>
      </div>

      <div class="text-right">

        <p
          class="text-sm font-semibold text-gray-900 dark:text-white"
        >
          {{ formatCurrency(payment.amount) }}
        </p>

        <span
          class="text-[11px]"
          :class="paymentStatusClass(payment.status)"
        >
          {{ paymentStatusLabel(payment.status) }}
        </span>

      </div>

    </div>

  </div>
</div>

<!-- Additional dashboard information -->
<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">

  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
  >
    <p class="text-xs text-gray-400">
      Direct Students
    </p>

    <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
      {{ statsData.directStudents.toLocaleString() }}
    </p>
  </div>

  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
  >
    <p class="text-xs text-gray-400">
      Teacher Students
    </p>

    <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
      {{ statsData.teacherStudents.toLocaleString() }}
    </p>
  </div>

  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
  >
    <p class="text-xs text-gray-400">
      Total Revenue
    </p>

    <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
      {{ formatCurrency(statsData.totalRevenue) }}
    </p>
  </div>

  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
  >
    <p class="text-xs text-gray-400">
      Unused Tokens
    </p>

    <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
      {{ statsData.unusedTokens.toLocaleString() }}
    </p>
  </div>

</div>
```

  </div> </template>
