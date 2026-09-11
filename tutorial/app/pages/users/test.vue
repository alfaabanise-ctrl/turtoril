<script setup lang="ts">
definePageMeta({
  layout: 'nav', // uses your LeftNav via layouts/default.vue
})
interface Student {
  id: number
  name: string
  email: string
  phone: string
  examYear: string          // e.g. "2027 JAMB"
  subjectsCombo: string     // e.g. "Physics, Chemistry, Biology"
  status: 'Active' | 'Pending' | 'Expired'
  referredBy: string        // agent/teacher name
  mockScore?: number        // last mock exam score, nice engagement signal
  joinedAt: string
}

const students = ref<Student[]>([
  { id: 1, name: 'Amaka Obi', email: 'amaka@gmail.com', phone: '0803 123 4567', examYear: '2027 JAMB', subjectsCombo: 'Physics, Chemistry, Biology', status: 'Active', referredBy: 'Mr. Okafor', mockScore: 248, joinedAt: '2026-08-12' },
  { id: 2, name: 'Tunde Bello', email: 'tunde@gmail.com', phone: '0805 987 6543', examYear: '2027 JAMB', subjectsCombo: 'Economics, Government, Literature', status: 'Pending', referredBy: 'Mrs. Adaeze', joinedAt: '2026-09-01' },
  { id: 3, name: 'Chiamaka Eze', email: 'chiamaka@gmail.com', phone: '0812 456 7890', examYear: '2026 JAMB', subjectsCombo: 'Physics, Chemistry, Mathematics', status: 'Active', referredBy: 'Mr. Okafor', mockScore: 289, joinedAt: '2026-07-20' },
  { id: 4, name: 'David Okon', email: 'david@gmail.com', phone: '0701 222 3344', examYear: '2026 JAMB', subjectsCombo: 'Government, CRS, Literature', status: 'Expired', referredBy: 'Admin Bello', mockScore: 190, joinedAt: '2026-05-15' },
])

const columns = [
  { key: 'name', label: 'Student' },
  { key: 'subjectsCombo', label: 'Subjects' },
  { key: 'examYear', label: 'Exam Year' },
  { key: 'mockScore', label: 'Last Mock' },
  { key: 'referredBy', label: 'Agent/Teacher' },
  { key: 'status', label: 'Token Status' },
]

const selectedYear = ref('All Years')
const years = ['All Years', '2026 JAMB', '2027 JAMB', '2028 JAMB']

const filteredByYear = computed(() =>
  selectedYear.value === 'All Years'
    ? students.value
    : students.value.filter((s) => s.examYear === selectedYear.value)
)

const activeCount = computed(() => students.value.filter((s) => s.status === 'Active').length)
const pendingCount = computed(() => students.value.filter((s) => s.status === 'Pending').length)
const expiredCount = computed(() => students.value.filter((s) => s.status === 'Expired').length)

const stats = computed(() => [
  { label: 'Active Tokens', value: activeCount.value, icon: 'i-heroicons-key', color: 'green' as const },
  { label: 'Pending Payment', value: pendingCount.value, icon: 'i-heroicons-clock', color: 'amber' as const },
  { label: 'Expired', value: expiredCount.value, icon: 'i-heroicons-x-circle', color: 'rose' as const },
])

const statusStyles: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Expired: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}
const avatarColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500']
function avatarColor(name: string) {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[sum % avatarColors.length]
}

function scoreColor(score?: number) {
  if (!score) return 'text-gray-400'
  if (score >= 250) return 'text-green-600'
  if (score >= 180) return 'text-amber-600'
  return 'text-rose-500'
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Students</h1>
        <p class="text-sm text-gray-400 mt-1">All students preparing for JAMB on the platform</p>
      </div>
      <UserFormModal
       type="teacher"
       buttonText="Create Teacher"/>
      <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
        <Icon name="i-heroicons-user-plus" class="w-4 h-4" />
        Add Student
      </button>
    </div>

    <UiDataList
      :items="filteredByYear"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No students found"
    >
      <template #filters>
        <select
          v-model="selectedYear"
          class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
        >
          <option v-for="y in years" :key="y">{{ y }}</option>
        </select>
      </template>

      <template #cell-name="{ item }">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :class="avatarColor(item.name)"
          >
            {{ initials(item.name) }}
          </div>
          <div class="min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ item.email }}</p>
          </div>
        </div>
      </template>

      <template #cell-subjectsCombo="{ item }">
        <span class="text-gray-600 dark:text-gray-300 text-sm">{{ item.subjectsCombo }}</span>
      </template>

      <template #cell-examYear="{ item }">
        <span class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
          <Icon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />
          {{ item.examYear }}
        </span>
      </template>

      <template #cell-mockScore="{ item }">
        <span v-if="item.mockScore" class="font-semibold" :class="scoreColor(item.mockScore)">
          {{ item.mockScore }}/400
        </span>
        <span v-else class="text-gray-300 text-sm">—</span>
      </template>

      <template #cell-referredBy="{ item }">
        <span class="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Icon name="i-heroicons-user-circle" class="w-4 h-4 text-gray-400" />
          {{ item.referredBy }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="statusStyles[item.status]"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="{
              'bg-green-500': item.status === 'Active',
              'bg-amber-500': item.status === 'Pending',
              'bg-gray-400': item.status === 'Expired',
            }"
          />
          {{ item.status }}
        </span>
      </template>

      <template #actions_row="{ item }">
        <button class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
          <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
        </button>
        <button class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1">
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
        </button>
      </template>
    </UiDataList>
  </div>
</template>