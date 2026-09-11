<script setup lang="ts">
definePageMeta({
  layout: 'default', // uses your LeftNav via layouts/default.vue
}) 

interface StatCard {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down'
  icon: string
  color: 'indigo' | 'green' | 'amber' | 'rose'
}

const stats: StatCard[] = [
  { label: 'Total Admins', value: 12, change: '+2 this month', trend: 'up', icon: 'i-heroicons-shield-check', color: 'indigo' },
  { label: 'Total Teachers', value: 84, change: '+5 this month', trend: 'up', icon: 'i-heroicons-user-group', color: 'green' },
  { label: 'Total Students', value: 1240, change: '+63 this month', trend: 'up', icon: 'i-heroicons-academic-cap', color: 'amber' },
  { label: 'Active Subscriptions', value: 932, change: '-8 this month', trend: 'down', icon: 'i-heroicons-credit-card', color: 'rose' },
]

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
}

interface Activity {
  id: number
  actor: string
  action: string
  target: string
  time: string
  icon: string
}

const activities: Activity[] = [
  { id: 1, actor: 'Mrs. Adaeze', action: 'added a new student', target: 'Chinedu Okoro', time: '5 mins ago', icon: 'i-heroicons-user-plus' },
  { id: 2, actor: 'Admin Bello', action: 'updated settings for', target: 'JSS Department', time: '32 mins ago', icon: 'i-heroicons-cog-6-tooth' },
  { id: 3, actor: 'System', action: 'renewed subscription for', target: 'Greenfield Academy', time: '1 hr ago', icon: 'i-heroicons-credit-card' },
  { id: 4, actor: 'Mr. Tunde', action: 'removed a teacher account', target: 'Grace Effiong', time: '3 hrs ago', icon: 'i-heroicons-user-minus' },
]

interface QuickAction {
  label: string
  icon: string
  to: string
}

const quickActions: QuickAction[] = [
  { label: 'Add Admin', icon: 'i-heroicons-user-plus', to: '/admins/new' },
  { label: 'Manage Schools', icon: 'i-heroicons-building-library', to: '/schools' },
  { label: 'View Reports', icon: 'i-heroicons-chart-bar', to: '/reports' },
  { label: 'System Settings', icon: 'i-heroicons-cog-6-tooth', to: '/settings' },
]

// Simple bar data for signups over the last 6 months (swap with real API data)
const monthlySignups = [
  { month: 'Apr', value: 62 },
  { month: 'May', value: 78 },
  { month: 'Jun', value: 55 },
  { month: 'Jul', value: 90 },
  { month: 'Aug', value: 74 },
  { month: 'Sep', value: 103 },
]
const maxSignup = Math.max(...monthlySignups.map((m) => m.value))
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
  <!-- <UserFormModal
  :open="true"
  type="student"
  title="Create JAMB Student"
  submit-text="Create Student"
/> -->
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Super Admin Dashboard
        </h1>
        <p class="text-sm text-gray-400 mt-1">Welcome back — here's what's happening across your platform.</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
        <Icon name="i-heroicons-plus" class="w-4 h-4" />
        Add New Admin
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center" :class="colorMap[stat.color]">
            <Icon :name="stat.icon" class="w-5 h-5" />
          </div>
          <span
            v-if="stat.change"
            class="flex items-center gap-1 text-xs font-medium"
            :class="stat.trend === 'up' ? 'text-green-600' : 'text-rose-500'"
          >
            <Icon :name="stat.trend === 'up' ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'" class="w-3.5 h-3.5" />
            {{ stat.change }}
          </span>
        </div>
        <p class="text-2xl font-semibold text-gray-900 dark:text-white leading-tight">{{ stat.value }}</p>
        <p class="text-sm text-gray-400 mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Main grid: chart + quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Signups chart -->
      <div class="lg:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">New Signups</h3>
            <p class="text-sm text-gray-400">Last 6 months</p>
          </div>
          <select class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/60">
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
        </div>

        <div class="flex items-end justify-between gap-3 h-48">
          <div
            v-for="m in monthlySignups"
            :key="m.month"
            class="flex-1 flex flex-col items-center gap-2 group"
          >
            <div class="w-full flex items-end justify-center h-40 relative">
              <span class="absolute -top-6 text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {{ m.value }}
              </span>
              <div
                class="w-full max-w-10 rounded-t-lg bg-indigo-500/80 group-hover:bg-indigo-600 transition-all duration-300"
                :style="{ height: `${(m.value / maxSignup) * 100}%` }"
              />
            </div>
            <span class="text-xs text-gray-400">{{ m.month }}</span>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.label"
            :to="action.to"
            class="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon :name="action.icon" class="w-4.5 h-4.5" />
            </div>
            {{ action.label }}
            <Icon name="i-heroicons-chevron-right" class="w-4 h-4 ml-auto text-gray-300" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <NuxtLink to="/activity" class="text-sm text-indigo-600 hover:underline">View all</NuxtLink>
      </div>

      <div class="flex flex-col">
        <div
          v-for="(activity, i) in activities"
          :key="activity.id"
          class="flex items-start gap-3 py-3"
          :class="i !== activities.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''"
        >
          <div class="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Icon :name="activity.icon" class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-700 dark:text-gray-200">
              <span class="font-medium text-gray-900 dark:text-white">{{ activity.actor }}</span>
              {{ activity.action }}
              <span class="font-medium text-gray-900 dark:text-white">{{ activity.target }}</span>
            </p>
          </div>
          <span class="text-xs text-gray-400 whitespace-nowrap">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>