<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const adminId = computed(() => String(route.params.id))

const admin = ref({
  id: adminId.value,
  name: 'John Admin',
  email: 'john.admin@example.com',
  phone: '08012345678',
  role: 'Admin',
  status: 'Active',
  dateJoined: '12 August 2026',

  payment: {
    bankName: 'GTBank',
    accountName: 'John Admin',
    accountNumber: '0123456789',
    paystackCustomerId: 'CUS_7H82K91L',
  },

  wallet: {
    balance: 35000,
    totalFunded: 250000,
    totalSpent: 215000,
  },

  people: [
    {
      id: 1,
      name: 'Michael Johnson',
      email: 'michael@example.com',
      phone: '08011112222',
      type: 'Teacher',
      totalStudentsRegistered: 45,
      studentsPaid: 32,
      dateJoined: '14 August 2026',
      lastLogin: 'Today, 8:42 PM',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '08022223333',
      type: 'Teacher',
      totalStudentsRegistered: 28,
      studentsPaid: 21,
      dateJoined: '16 August 2026',
      lastLogin: 'Today, 6:15 PM',
      status: 'Active',
    },
    {
      id: 3,
      name: 'David Okafor',
      email: 'david@example.com',
      phone: '08133334444',
      type: 'Student',
      totalStudentsRegistered: null,
      studentsPaid: null,
      dateJoined: '18 August 2026',
      lastLogin: 'Today, 7:30 PM',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Mary Adeyemi',
      email: 'mary@example.com',
      phone: '08144445555',
      type: 'Student',
      totalStudentsRegistered: null,
      studentsPaid: null,
      dateJoined: '20 August 2026',
      lastLogin: 'Yesterday, 4:20 PM',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Daniel Ibrahim',
      email: 'daniel@example.com',
      phone: '07055556666',
      type: 'Teacher',
      totalStudentsRegistered: 63,
      studentsPaid: 47,
      dateJoined: '22 August 2026',
      lastLogin: 'Yesterday, 9:05 PM',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Blessing Chukwu',
      email: 'blessing@example.com',
      phone: '07066667777',
      type: 'Teacher',
      totalStudentsRegistered: 19,
      studentsPaid: 12,
      dateJoined: '25 August 2026',
      lastLogin: '3 days ago',
      status: 'Suspended',
    },
  ],
})

/* =========================================================
   TABLE COLUMNS
   Combined "registered" + "paid" into one column: studentsPaid
========================================================= */

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'studentsPaid', label: 'Students Paid' },
  { key: 'dateJoined', label: 'Date Joined' },
  { key: 'lastLogin', label: 'Last Login' },
  { key: 'status', label: 'Status' },
]

const statusStyles: Record<string, string> = {
  Active: 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Expired: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Suspended: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
}

/* =========================================================
   STATS — combined "Registered & Paid" instead of two separate ones
========================================================= */

const totalTeachers = computed(
  () => admin.value.people.filter((p) => p.type === 'Teacher').length
)

const totalStudents = computed(
  () => admin.value.people.filter((p) => p.type === 'Student').length
)

// Students who both registered AND paid (i.e. studentsPaid count from all teachers)
const totalStudentsPaid = computed(() =>
  admin.value.people
    .filter((p) => p.type === 'Teacher')
    .reduce((sum, p) => sum + (p.studentsPaid || 0), 0)
)

const stats = computed(() => [
  { label: 'Teachers', value: totalTeachers.value, icon: 'i-heroicons-academic-cap', color: 'indigo' as const },
  { label: 'Students', value: totalStudents.value, icon: 'i-heroicons-users', color: 'gray' as const },
  { label: 'Students Registered & Paid', value: totalStudentsPaid.value, icon: 'i-heroicons-check-badge', color: 'green' as const },
])

/* =========================================================
   HELPERS
========================================================= */

const initials = (name: string) =>
  name.split(' ').map((w) => w.charAt(0)).slice(0, 2).join('').toUpperCase()

const avatarColor = (name: string) => {
  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500']
  const index = name.split('').reduce((t, c) => t + c.charCodeAt(0), 0) % colors.length
  return colors[index]
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)

const conversionRate = (item: { totalStudentsRegistered: number | null; studentsPaid: number | null }) => {
  if (!item.totalStudentsRegistered) return 0
  return Math.round(((item.studentsPaid ?? 0) / item.totalStudentsRegistered) * 100)
}

/* =========================================================
   ACTIONS
========================================================= */

const goBack = () => router.back()
const editAdmin = () => console.log('Edit admin:', adminId.value)
const suspendAdmin = () => console.log('Suspend admin:', adminId.value)
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-['Poppins'] text-gray-900 dark:bg-gray-950 dark:text-white">
    <div class="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

      <!-- HEADER -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="goBack"
        >
          <Icon name="i-heroicons-arrow-left" class="h-4 w-4" />
          Back to Admins
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            @click="editAdmin"
          >
            <Icon name="i-heroicons-pencil-square" class="h-4 w-4" />
            Edit Admin
          </button>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Icon name="i-heroicons-ellipsis-horizontal" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- BASIC ADMIN INFO -->
      <section class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
              {{ initials(admin.name) }}
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl font-bold">{{ admin.name }}</h1>
                <span class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {{ admin.role }}
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" :class="statusStyles[admin.status]">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {{ admin.status }}
                </span>
              </div>

              <div class="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="i-heroicons-envelope" class="h-4 w-4 text-gray-400" />
                  {{ admin.email }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="i-heroicons-phone" class="h-4 w-4 text-gray-400" />
                  {{ admin.phone }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="i-heroicons-calendar-days" class="h-4 w-4 text-gray-400" />
                  Joined {{ admin.dateJoined }}
                </span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <p class="text-xs text-gray-400">Admin ID</p>
            <p class="mt-1 font-mono text-sm font-semibold">{{ admin.id }}</p>
          </div>
        </div>
      </section>

      <!-- ACCOUNT & PAYMENT -->
      <section class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-6">
          <h2 class="text-lg font-bold">Account & Payment Information</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Account and payment details associated with this admin.</p>
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <div class="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400">
                <Icon name="i-heroicons-building-library" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-sm font-semibold">Bank Account</h3>
                <p class="text-xs text-gray-400">Withdrawal details</p>
              </div>
            </div>
            <div class="mt-5 space-y-3">
              <div>
                <p class="text-xs text-gray-400">Bank</p>
                <p class="mt-1 text-sm font-medium">{{ admin.payment.bankName }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400">Account Name</p>
                <p class="mt-1 text-sm font-medium">{{ admin.payment.accountName }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400">Account Number</p>
                <p class="mt-1 font-mono text-sm font-semibold">{{ admin.payment.accountNumber }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400">
                <Icon name="i-heroicons-credit-card" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-sm font-semibold">Payment Details</h3>
                <p class="text-xs text-gray-400">Paystack information</p>
              </div>
            </div>
            <div class="mt-5 space-y-3">
              <div>
                <p class="text-xs text-gray-400">Paystack Customer ID</p>
                <p class="mt-1 break-all font-mono text-sm font-medium">{{ admin.payment.paystackCustomerId }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400">Total Funded</p>
                <p class="mt-1 text-sm font-semibold">{{ formatCurrency(admin.wallet.totalFunded) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400">Total Spent</p>
                <p class="mt-1 text-sm font-semibold">{{ formatCurrency(admin.wallet.totalSpent) }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm dark:bg-gray-800 dark:text-orange-400">
                <Icon name="i-heroicons-wallet" class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-sm font-semibold">Wallet</h3>
                <p class="text-xs text-gray-400">Current balance</p>
              </div>
            </div>
            <div class="mt-5">
              <p class="text-xs text-gray-400">Available Balance</p>
              <p class="mt-1 text-2xl font-bold">{{ formatCurrency(admin.wallet.balance) }}</p>
              <p class="mt-2 text-xs text-gray-400">Available for student activation.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- PEOPLE / REFERRAL TABLE -->
      <section>
        <UiDataList
          :items="admin.people"
          :columns="columns"
          row-key="id"
          :stats="stats"
          :show-total-stat="false"
          empty-text="No people found"
        >
          <template #cell-name="{ item }">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" :class="avatarColor(item.name)">
                {{ initials(item.name) }}
              </div>
              <div class="min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.email }}</p>
              </div>
            </div>
          </template>

          <template #cell-type="{ item }">
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              :class="item.type === 'Teacher'
                ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'"
            >
              <Icon :name="item.type === 'Teacher' ? 'i-heroicons-academic-cap' : 'i-heroicons-user'" class="h-3.5 w-3.5" />
              {{ item.type }}
            </span>
          </template>

          <!-- COMBINED: Students Paid, with a small progress bar showing conversion vs total registered -->
          <template #cell-studentsPaid="{ item }">
            <div v-if="item.type === 'Teacher'" class="min-w-[140px]">
              <div class="flex items-baseline gap-1.5">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ item.studentsPaid }}</span>
                <span class="text-xs text-gray-400">/ {{ item.totalStudentsRegistered }} registered</span>
              </div>
              <div class="mt-1.5 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  class="h-full rounded-full bg-green-500 transition-all"
                  :style="{ width: `${conversionRate(item)}%` }"
                />
              </div>
            </div>
            <span v-else class="text-gray-300 dark:text-gray-600">—</span>
          </template>

          <template #cell-dateJoined="{ item }">
            <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <Icon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
              {{ item.dateJoined }}
            </span>
          </template>

          <template #cell-lastLogin="{ item }">
            <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
              {{ item.lastLogin }}
            </span>
          </template>

          <template #cell-status="{ item }">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" :class="statusStyles[item.status]">
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="{
                  'bg-green-500': item.status === 'Active',
                  'bg-amber-500': item.status === 'Pending',
                  'bg-gray-400': item.status === 'Expired',
                  'bg-rose-500': item.status === 'Suspended',
                }"
              />
              {{ item.status }}
            </span>
          </template>

          <template #actions_row="{ item }">
            <button type="button" class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors" title="View details" @click="console.log('View:', item.id)">
              <Icon name="i-heroicons-eye" class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ml-1" title="Edit" @click="console.log('Edit:', item.id)">
              <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
            </button>
          </template>
        </UiDataList>
      </section>

      <!-- ACCOUNT ACTION -->
      <section class="rounded-3xl border border-rose-100 bg-white p-6 dark:border-rose-500/20 dark:bg-gray-900">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-rose-600 dark:text-rose-400">Account Actions</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Temporarily restrict this administrator account.</p>
          </div>
          <button type="button" class="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10" @click="suspendAdmin">
            Suspend Admin
          </button>
        </div>
      </section>

    </div>
  </div>
</template>