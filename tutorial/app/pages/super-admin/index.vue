```vue
<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

interface Student {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Pending" | "Expired";
  joinedAt: string;
}

interface Payment {
  id: number;
  student: string;
  amount: number;
  plan: "Monthly" | "Quarterly" | "Yearly";
  status: "Successful" | "Pending" | "Failed";
  date: string;
}

interface Teacher {
  id: number;
  name: string;
  students: number;
  paidStudents: number;
}

const stats = [
  {
    label: "Total Students",
    value: "1,248",
    change: "+12.5%",
    description: "from last month",
    icon: "i-heroicons-academic-cap",
    iconClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    positive: true,
  },
  {
    label: "Total Teachers",
    value: "86",
    change: "+8.2%",
    description: "from last month",
    icon: "i-heroicons-user-group",
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    positive: true,
  },
  {
    label: "Total Admins",
    value: "12",
    change: "+2",
    description: "new this month",
    icon: "i-heroicons-shield-check",
    iconClass: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    positive: true,
  },
  {
    label: "Active Subscriptions",
    value: "934",
    change: "+15.8%",
    description: "from last month",
    icon: "i-heroicons-rectangle-stack",
    iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    positive: true,
  },
  {
    label: "Total Revenue",
    value: "₦4.82M",
    change: "+18.4%",
    description: "from last month",
    icon: "i-heroicons-banknotes",
    iconClass: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    positive: true,
  },
];

const revenueData = [
  { month: "Mar", value: 320000 },
  { month: "Apr", value: 410000 },
  { month: "May", value: 580000 },
  { month: "Jun", value: 720000 },
  { month: "Jul", value: 850000 },
  { month: "Aug", value: 970000 },
  { month: "Sep", value: 1120000 },
];

const studentGrowth = [
  { month: "Mar", value: 640 },
  { month: "Apr", value: 720 },
  { month: "May", value: 815 },
  { month: "Jun", value: 910 },
  { month: "Jul", value: 1030 },
  { month: "Aug", value: 1140 },
  { month: "Sep", value: 1248 },
];

const recentStudents: Student[] = [
  {
    id: 1,
    name: "Amaka Obi",
    email: "amaka@gmail.com",
    status: "Active",
    joinedAt: "12 Sep 2026",
  },
  {
    id: 2,
    name: "Tunde Bello",
    email: "tunde@gmail.com",
    status: "Pending",
    joinedAt: "11 Sep 2026",
  },
  {
    id: 3,
    name: "Chiamaka Eze",
    email: "chiamaka@gmail.com",
    status: "Active",
    joinedAt: "10 Sep 2026",
  },
  {
    id: 4,
    name: "David Okon",
    email: "david@gmail.com",
    status: "Expired",
    joinedAt: "09 Sep 2026",
  },
  {
    id: 5,
    name: "Blessing Johnson",
    email: "blessing@gmail.com",
    status: "Active",
    joinedAt: "08 Sep 2026",
  },
];

const recentPayments: Payment[] = [
  {
    id: 1,
    student: "Amaka Obi",
    amount: 25000,
    plan: "Yearly",
    status: "Successful",
    date: "12 Sep 2026",
  },
  {
    id: 2,
    student: "Ibrahim Musa",
    amount: 8500,
    plan: "Quarterly",
    status: "Successful",
    date: "11 Sep 2026",
  },
  {
    id: 3,
    student: "Blessing Johnson",
    amount: 25000,
    plan: "Yearly",
    status: "Successful",
    date: "10 Sep 2026",
  },
  {
    id: 4,
    student: "Tunde Bello",
    amount: 3000,
    plan: "Monthly",
    status: "Pending",
    date: "10 Sep 2026",
  },
  {
    id: 5,
    student: "Sarah James",
    amount: 3000,
    plan: "Monthly",
    status: "Successful",
    date: "09 Sep 2026",
  },
];

const topTeachers: Teacher[] = [
  {
    id: 1,
    name: "Mr. Okafor",
    students: 124,
    paidStudents: 98,
  },
  {
    id: 2,
    name: "Mrs. Adaeze",
    students: 108,
    paidStudents: 82,
  },
  {
    id: 3,
    name: "Mr. Adewale",
    students: 96,
    paidStudents: 79,
  },
  {
    id: 4,
    name: "Mr. Yusuf",
    students: 91,
    paidStudents: 72,
  },
  {
    id: 5,
    name: "Mrs. Grace",
    students: 84,
    paidStudents: 68,
  },
];

const revenueMax = Math.max(...revenueData.map((item) => item.value));

const growthMax = Math.max(...studentGrowth.map((item) => item.value));

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatCompactCurrency = (value: number) => {
  if (value >= 1000000) {
    return `₦${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `₦${Math.round(value / 1000)}K`;
  }

  return `₦${value}`;
};

const initials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
];

const avatarColor = (name: string) => {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};

const studentStatusClass = (status: Student["status"]) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    Expired: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return styles[status];
};

const paymentStatusClass = (status: Payment["status"]) => {
  const styles = {
    Successful:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    Failed: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return styles[status];
};

const teacherConversion = (teacher: Teacher) => {
  if (!teacher.students) return 0;

  return Math.round((teacher.paidStudents / teacher.students) * 100);
};
</script>

<template>
  <div class="space-y-6 pb-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Super Admin Dashboard
        </h1>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your platform's performance.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/super-admin/reports"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Icon name="i-heroicons-chart-bar-square" class="h-4 w-4" />
          Reports
        </NuxtLink>

        <button
          class="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Icon name="i-heroicons-arrow-path" class="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl"
            :class="stat.iconClass"
          >
            <Icon :name="stat.icon" class="h-5 w-5" />
          </div>

          <span
            class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Icon name="i-heroicons-arrow-trending-up" class="h-3 w-3" />
            {{ stat.change }}
          </span>
        </div>

        <div class="mt-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ stat.label }}
          </p>

          <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {{ stat.value }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            {{ stat.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Revenue -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Revenue Overview</h2>
            <p class="mt-1 text-xs text-gray-400">
              Revenue generated over the last 7 months
            </p>
          </div>

          <span
            class="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            +18.4%
          </span>
        </div>

        <div class="mt-6 flex h-64 items-end gap-3 sm:gap-5">
          <div
            v-for="item in revenueData"
            :key="item.month"
            class="flex h-full flex-1 flex-col justify-end"
          >
            <div class="mb-2 text-center text-[10px] text-gray-400">
              {{ formatCompactCurrency(item.value) }}
            </div>

            <div
              class="w-full rounded-t-lg bg-indigo-500 transition-all hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              :style="{
                height: `${Math.max((item.value / revenueMax) * 75, 8)}%`,
              }"
            />

            <div class="mt-2 text-center text-xs text-gray-400">
              {{ item.month }}
            </div>
          </div>
        </div>
      </div>

      <!-- Student Growth -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Student Growth</h2>
            <p class="mt-1 text-xs text-gray-400">Total registered students</p>
          </div>

          <div class="text-right">
            <p class="text-xl font-bold text-gray-900 dark:text-white">1,248</p>
            <p class="text-xs text-emerald-500">+12.5%</p>
          </div>
        </div>

        <div class="mt-6 flex h-64 items-end gap-3 sm:gap-5">
          <div
            v-for="item in studentGrowth"
            :key="item.month"
            class="flex h-full flex-1 flex-col justify-end"
          >
            <div class="mb-2 text-center text-[10px] text-gray-400">
              {{ item.value }}
            </div>

            <div
              class="w-full rounded-t-lg bg-emerald-500 transition-all hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              :style="{
                height: `${Math.max((item.value / growthMax) * 75, 8)}%`,
              }"
            />

            <div class="mt-2 text-center text-xs text-gray-400">
              {{ item.month }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Students + Payments -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <!-- Recent Students -->
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Recent Students</h2>
            <p class="mt-1 text-xs text-gray-400">Recently registered students</p>
          </div>

          <NuxtLink
            to="/super-admin/students"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View all
          </NuxtLink>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="student in recentStudents"
            :key="student.id"
            class="flex items-center justify-between gap-3 px-5 py-4"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                :class="avatarColor(student.name)"
              >
                {{ initials(student.name) }}
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {{ student.name }}
                </p>

                <p class="mt-0.5 truncate text-xs text-gray-400">
                  {{ student.email }}
                </p>
              </div>
            </div>

            <div class="shrink-0 text-right">
              <span
                class="inline-flex rounded-full px-2 py-1 text-[10px] font-medium"
                :class="studentStatusClass(student.status)"
              >
                {{ student.status }}
              </span>

              <p class="mt-1 text-[10px] text-gray-400">
                {{ student.joinedAt }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Payments -->
      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
            <p class="mt-1 text-xs text-gray-400">Latest subscription payments</p>
          </div>

          <NuxtLink
            to="/super-admin/payments"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View all
          </NuxtLink>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="payment in recentPayments"
            :key="payment.id"
            class="flex items-center justify-between gap-3 px-5 py-4"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
              >
                <Icon
                  name="i-heroicons-banknotes"
                  class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {{ payment.student }}
                </p>

                <p class="mt-0.5 text-xs text-gray-400">
                  {{ payment.plan }} · {{ payment.date }}
                </p>
              </div>
            </div>

            <div class="shrink-0 text-right">
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(payment.amount) }}
              </p>

              <span
                class="mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-medium"
                :class="paymentStatusClass(payment.status)"
              >
                {{ payment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Teachers -->
    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h2 class="font-semibold text-gray-900 dark:text-white">Top Teachers</h2>

          <p class="mt-1 text-xs text-gray-400">
            Teachers with the highest student activity
          </p>
        </div>

        <NuxtLink
          to="/super-admin/teachers"
          class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          View all
        </NuxtLink>
      </div>

      <!-- Desktop -->
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full text-left">
          <thead
            class="border-b border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-800/30"
          >
            <tr>
              <th
                class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                Teacher
              </th>

              <th
                class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                Students
              </th>

              <th
                class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                Paid Students
              </th>

              <th
                class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                Conversion
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="teacher in topTeachers"
              :key="teacher.id"
              class="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/30"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    {{ initials(teacher.name) }}
                  </div>

                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ teacher.name }}
                  </span>
                </div>
              </td>

              <td class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                {{ teacher.students }}
              </td>

              <td class="px-5 py-4">
                <span
                  class="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  {{ teacher.paidStudents }}
                </span>
              </td>

              <td class="px-5 py-4">
                <div class="flex min-w-[150px] items-center gap-3">
                  <div
                    class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <div
                      class="h-full rounded-full bg-emerald-500"
                      :style="{
                        width: `${teacherConversion(teacher)}%`,
                      }"
                    />
                  </div>

                  <span class="w-10 text-xs text-gray-400">
                    {{ teacherConversion(teacher) }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800 md:hidden">
        <div v-for="teacher in topTeachers" :key="teacher.id" class="px-5 py-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
              >
                {{ initials(teacher.name) }}
              </div>

              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ teacher.name }}
                </p>

                <p class="mt-0.5 text-xs text-gray-400">
                  {{ teacher.students }} students
                </p>
              </div>
            </div>

            <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {{ teacher.paidStudents }} paid
            </span>
          </div>

          <div class="mt-3 flex items-center gap-3">
            <div
              class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <div
                class="h-full rounded-full bg-emerald-500"
                :style="{
                  width: `${teacherConversion(teacher)}%`,
                }"
              />
            </div>

            <span class="text-xs text-gray-400"> {{ teacherConversion(teacher) }}% </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div>
      <h2 class="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        Quick Access
      </h2>

      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <NuxtLink
          to="/super-admin/admins"
          class="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10"
          >
            <Icon
              name="i-heroicons-shield-check"
              class="h-5 w-5 text-violet-600 dark:text-violet-400"
            />
          </div>

          <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">Admins</p>
        </NuxtLink>

        <NuxtLink
          to="/super-admin/teachers"
          class="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
          >
            <Icon
              name="i-heroicons-user-group"
              class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">Teachers</p>
        </NuxtLink>

        <NuxtLink
          to="/super-admin/students"
          class="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10"
          >
            <Icon
              name="i-heroicons-academic-cap"
              class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">Students</p>
        </NuxtLink>

        <NuxtLink
          to="/super-admin/payments"
          class="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10"
          >
            <Icon
              name="i-heroicons-banknotes"
              class="h-5 w-5 text-amber-600 dark:text-amber-400"
            />
          </div>

          <p class="mt-3 text-sm font-medium text-gray-900 dark:text-white">Payments</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
