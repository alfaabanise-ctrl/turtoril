<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

const stats = [
  {
    label: "Total Students",
    value: "486",
    change: "+12 this month",
    icon: "i-heroicons-academic-cap",
    color: "indigo",
  },
  {
    label: "Total Teachers",
    value: "24",
    change: "+2 this month",
    icon: "i-heroicons-user-group",
    color: "emerald",
  },
  {
    label: "Active Subscriptions",
    value: "378",
    change: "+8 this month",
    icon: "i-heroicons-check-circle",
    color: "green",
  },
  {
    label: "Wallet Balance",
    value: "₦485,000",
    change: "Available balance",
    icon: "i-heroicons-wallet",
    color: "amber",
  },
];

const recentStudents = [
  {
    id: 1,
    name: "Amaka Obi",
    email: "amaka@gmail.com",
    teacher: "Mr. Okafor",
    status: "Active",
  },
  {
    id: 2,
    name: "Chiamaka Eze",
    email: "chiamaka@gmail.com",
    teacher: "Mr. Okafor",
    status: "Active",
  },
  {
    id: 3,
    name: "Tunde Bello",
    email: "tunde@gmail.com",
    teacher: "Mrs. Adaeze",
    status: "Pending",
  },
  {
    id: 4,
    name: "Blessing Johnson",
    email: "blessing@gmail.com",
    teacher: "Mr. Adewale",
    status: "Active",
  },
  {
    id: 5,
    name: "Ibrahim Musa",
    email: "ibrahim@gmail.com",
    teacher: "Mr. Yusuf",
    status: "Active",
  },
];

const recentPayments = [
  {
    id: 1,
    student: "Amaka Obi",
    amount: "₦25,000",
    plan: "Yearly",
    status: "Successful",
  },
  {
    id: 2,
    student: "Chiamaka Eze",
    amount: "₦25,000",
    plan: "Yearly",
    status: "Successful",
  },
  {
    id: 3,
    student: "Blessing Johnson",
    amount: "₦25,000",
    plan: "Yearly",
    status: "Successful",
  },
  {
    id: 4,
    student: "Tunde Bello",
    amount: "₦3,000",
    plan: "Monthly",
    status: "Pending",
  },
];

const topTeachers = [
  {
    name: "Mr. Okafor",
    students: 86,
    paid: 72,
  },
  {
    name: "Mrs. Adaeze",
    students: 64,
    paid: 51,
  },
  {
    name: "Mr. Adewale",
    students: 58,
    paid: 47,
  },
  {
    name: "Mr. Yusuf",
    students: 45,
    paid: 39,
  },
];

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(name: string) {
  const total = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return avatarColors[total % avatarColors.length];
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Manage your students, teachers and subscriptions
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <Icon name="i-heroicons-user-group" class="w-4 h-4" />
          Add Teacher
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Icon name="i-heroicons-user-plus" class="w-4 h-4" />
          Add Student
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
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
              'bg-indigo-50 dark:bg-indigo-500/10': stat.color === 'indigo',

              'bg-emerald-50 dark:bg-emerald-500/10': stat.color === 'emerald',

              'bg-green-50 dark:bg-green-500/10': stat.color === 'green',

              'bg-amber-50 dark:bg-amber-500/10': stat.color === 'amber',
            }"
          >
            <Icon
              :name="stat.icon"
              class="w-5 h-5"
              :class="{
                'text-indigo-600 dark:text-indigo-400': stat.color === 'indigo',

                'text-emerald-600 dark:text-emerald-400': stat.color === 'emerald',

                'text-green-600 dark:text-green-400': stat.color === 'green',

                'text-amber-600 dark:text-amber-400': stat.color === 'amber',
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

        <p class="font-semibold text-gray-900 dark:text-white">Students</p>

        <p class="text-xs text-gray-400 mt-1">View and manage students</p>
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

        <p class="font-semibold text-gray-900 dark:text-white">Teachers</p>

        <p class="text-xs text-gray-400 mt-1">Manage your teachers</p>
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

        <p class="font-semibold text-gray-900 dark:text-white">Subscriptions</p>

        <p class="text-xs text-gray-400 mt-1">Track student subscriptions</p>
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

        <p class="font-semibold text-gray-900 dark:text-white">Wallet</p>

        <p class="text-xs text-gray-400 mt-1">View earnings and balance</p>
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
            <h2 class="font-semibold text-gray-900 dark:text-white">Recent Students</h2>

            <p class="text-xs text-gray-400 mt-0.5">Latest students in your network</p>
          </div>

          <NuxtLink
            to="/admin/students"
            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all
          </NuxtLink>
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="student in recentStudents"
            :key="student.id"
            class="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                :class="avatarColor(student.name)"
              >
                {{ initials(student.name) }}
              </div>

              <div class="min-w-0">
                <p class="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {{ student.name }}
                </p>

                <p class="text-xs text-gray-400 truncate">
                  {{ student.email }}
                </p>
              </div>
            </div>

            <div class="hidden sm:block text-right">
              <p class="text-xs text-gray-400">Teacher</p>

              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ student.teacher }}
              </p>
            </div>

            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
              :class="
                student.status === 'Active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
              "
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="student.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'"
              />

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
            <h2 class="font-semibold text-gray-900 dark:text-white">Top Teachers</h2>

            <p class="text-xs text-gray-400 mt-0.5">By student count</p>
          </div>

          <NuxtLink
            to="/admin/teachers"
            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all
          </NuxtLink>
        </div>

        <div class="p-5 space-y-5">
          <div v-for="teacher in topTeachers" :key="teacher.name">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                  :class="avatarColor(teacher.name)"
                >
                  {{ initials(teacher.name) }}
                </div>

                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ teacher.name }}
                </span>
              </div>

              <span class="text-xs text-gray-400"> {{ teacher.students }} students </span>
            </div>

            <div class="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-indigo-500 rounded-full"
                :style="{
                  width: `${Math.round((teacher.paid / teacher.students) * 100)}%`,
                }"
              />
            </div>

            <p class="text-[11px] text-gray-400 mt-1">{{ teacher.paid }} subscribed</p>
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
          <h2 class="font-semibold text-gray-900 dark:text-white">Recent Payments</h2>

          <p class="text-xs text-gray-400 mt-0.5">Latest subscription payments</p>
        </div>

        <NuxtLink
          to="/admin/payments"
          class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all
        </NuxtLink>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="payment in recentPayments"
          :key="payment.id"
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
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ payment.student }}
              </p>

              <p class="text-xs text-gray-400">{{ payment.plan }} subscription</p>
            </div>
          </div>

          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ payment.amount }}
            </p>

            <span
              class="text-[11px]"
              :class="
                payment.status === 'Successful' ? 'text-green-500' : 'text-amber-500'
              "
            >
              {{ payment.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
