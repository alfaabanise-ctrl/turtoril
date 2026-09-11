<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'super-admin',
})

interface Admin {
  id: string
  name: string
  email: string
  phone: string
  image: string | null

  totalTeachers: number
  totalStudents: number
  subscribedStudents: number

  dateJoined: string
  lastLogin: string

  status: 'Active' | 'Suspended' | 'Inactive'
}

interface AdminSummary {
  totalAdmins: number
  totalTeachers: number
  totalStudents: number
  subscribedStudents: number
}

/*
|--------------------------------------------------------------------------
| Backend Data
|--------------------------------------------------------------------------
|
| These values should eventually come directly from your API.
| The frontend does NOT calculate teacher/student totals.
|
*/

const summary = ref<AdminSummary>({
  totalAdmins: 12,
  totalTeachers: 186,
  totalStudents: 3840,
  subscribedStudents: 2914,
})

const admins = ref<Admin[]>([
  {
    id: 'ADM-001',
    name: 'John Admin',
    email: 'john@example.com',
    phone: '08012345678',
    image: null,

    totalTeachers: 24,
    totalStudents: 486,
    subscribedStudents: 378,

    dateJoined: '12 January 2026',
    lastLogin: '11 September 2026, 06:42 PM',

    status: 'Active',
  },

  {
    id: 'ADM-002',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '08023456789',
    image: null,

    totalTeachers: 18,
    totalStudents: 352,
    subscribedStudents: 291,

    dateJoined: '20 January 2026',
    lastLogin: '11 September 2026, 05:18 PM',

    status: 'Active',
  },

  {
    id: 'ADM-003',
    name: 'David Anderson',
    email: 'david@example.com',
    phone: '08034567890',
    image: null,

    totalTeachers: 31,
    totalStudents: 624,
    subscribedStudents: 487,

    dateJoined: '03 February 2026',
    lastLogin: '10 September 2026, 09:12 PM',

    status: 'Active',
  },

  {
    id: 'ADM-004',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '08045678901',
    image: null,

    totalTeachers: 14,
    totalStudents: 218,
    subscribedStudents: 164,

    dateJoined: '15 February 2026',
    lastLogin: '09 September 2026, 04:37 PM',

    status: 'Active',
  },

  {
    id: 'ADM-005',
    name: 'Elizabeth Johnson',
    email: 'elizabeth@example.com',
    phone: '08056789012',
    image: null,

    totalTeachers: 27,
    totalStudents: 531,
    subscribedStudents: 419,

    dateJoined: '28 February 2026',
    lastLogin: '11 September 2026, 01:24 PM',

    status: 'Active',
  },

  {
    id: 'ADM-006',
    name: 'Daniel Smith',
    email: 'daniel@example.com',
    phone: '08067890123',
    image: null,

    totalTeachers: 11,
    totalStudents: 193,
    subscribedStudents: 142,

    dateJoined: '09 March 2026',
    lastLogin: '08 September 2026, 11:05 AM',

    status: 'Inactive',
  },

  {
    id: 'ADM-007',
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '08078901234',
    image: null,

    totalTeachers: 22,
    totalStudents: 407,
    subscribedStudents: 318,

    dateJoined: '19 March 2026',
    lastLogin: '11 September 2026, 03:52 PM',

    status: 'Active',
  },

  {
    id: 'ADM-008',
    name: 'Grace Thompson',
    email: 'grace@example.com',
    phone: '08089012345',
    image: null,

    totalTeachers: 16,
    totalStudents: 294,
    subscribedStudents: 227,

    dateJoined: '02 April 2026',
    lastLogin: '10 September 2026, 08:15 PM',

    status: 'Active',
  },
])

/*
|--------------------------------------------------------------------------
| Search & Filters
|--------------------------------------------------------------------------
*/

const search = ref('')
const statusFilter = ref('All')
const isLoading = ref(false)

const filteredAdmins = computed(() => {
  const query = search.value.trim().toLowerCase()

  return admins.value.filter((admin) => {
    const matchesSearch =
      !query ||
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.id.toLowerCase().includes(query) ||
      admin.phone.includes(query)

    const matchesStatus =
      statusFilter.value === 'All' ||
      admin.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

/*
|--------------------------------------------------------------------------
| Table Columns
|--------------------------------------------------------------------------
*/

const columns = [
  {
    key: 'name',
    label: 'Admin',
  },
  {
    key: 'totalTeachers',
    label: 'Total Teachers',
  },
  {
    key: 'totalStudents',
    label: 'Total Students',
  },
  {
    key: 'subscribedStudents',
    label: 'Subscribed Students',
  },
  {
    key: 'dateJoined',
    label: 'Date Joined',
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
  },
  {
    key: 'status',
    label: 'Status',
  },
]

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

const selectedAdmin = ref<Admin | null>(null)

const showViewModal = ref(false)
const showEditModal = ref(false)
const showSuspendModal = ref(false)

function viewAdmin(admin: Admin) {
  selectedAdmin.value = admin
  showViewModal.value = true
}

function editAdmin(admin: Admin) {
  selectedAdmin.value = admin
  showEditModal.value = true
}

function suspendAdmin(admin: Admin) {
  selectedAdmin.value = admin
  showSuspendModal.value = true
}

function closeModals() {
  showViewModal.value = false
  showEditModal.value = false
  showSuspendModal.value = false
  selectedAdmin.value = null
}

function confirmSuspend() {
  if (!selectedAdmin.value) return

  /*
   * In production:
   * await $fetch(`/api/admins/${selectedAdmin.value.id}/suspend`, {
   *   method: 'POST'
   * })
   */

  const admin = admins.value.find(
    (item) => item.id === selectedAdmin.value?.id,
  )

  if (admin) {
    admin.status =
      admin.status === 'Suspended'
        ? 'Active'
        : 'Suspended'
  }

  closeModals()
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function statusClass(status: Admin['status']) {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-600'

    case 'Suspended':
      return 'bg-red-50 text-red-600'

    case 'Inactive':
      return 'bg-slate-100 text-slate-500'

    default:
      return 'bg-slate-100 text-slate-500'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 px-4 py-6 font-[Poppins] sm:px-6 lg:px-8">
    <div class="mx-auto max-w-[1600px] space-y-6">

      <!-- ========================================================= -->
      <!-- PAGE HEADER -->
      <!-- ========================================================= -->

      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="mb-1 flex items-center gap-2">
            <NuxtLink
              to="/super-admin"
              class="text-sm font-medium text-slate-400 transition hover:text-slate-700"
            >
              Dashboard
            </NuxtLink>

            <Icon
              name="lucide:chevron-right"
              class="h-4 w-4 text-slate-300"
            />

            <span class="text-sm font-medium text-slate-700">
              Admins
            </span>
          </div>

          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            Admins
          </h1>

          <p class="mt-1 text-sm text-slate-500">
            Manage platform administrators and monitor their activity.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <Icon
            name="lucide:plus"
            class="h-4 w-4"
          />

          Create Admin
        </button>
      </div>

      <!-- ========================================================= -->
      <!-- SUMMARY CARDS -->
      <!-- ========================================================= -->

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <!-- Total Admins -->
        <div
          class="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">
                Total Admins
              </p>

              <p class="mt-2 text-2xl font-semibold text-slate-900">
                {{ summary.totalAdmins.toLocaleString() }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Platform administrators
              </p>
            </div>

            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
            >
              <Icon
                name="lucide:shield-check"
                class="h-5 w-5 text-slate-700"
              />
            </div>
          </div>
        </div>

        <!-- Total Teachers -->
        <div
          class="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">
                Total Teachers
              </p>

              <p class="mt-2 text-2xl font-semibold text-slate-900">
                {{ summary.totalTeachers.toLocaleString() }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Across all admins
              </p>
            </div>

            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50"
            >
              <Icon
                name="lucide:graduation-cap"
                class="h-5 w-5 text-blue-600"
              />
            </div>
          </div>
        </div>

        <!-- Total Students -->
        <div
          class="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">
                Total Students
              </p>

              <p class="mt-2 text-2xl font-semibold text-slate-900">
                {{ summary.totalStudents.toLocaleString() }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Registered students
              </p>
            </div>

            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50"
            >
              <Icon
                name="lucide:users"
                class="h-5 w-5 text-violet-600"
              />
            </div>
          </div>
        </div>

        <!-- Subscribed Students -->
        <div
          class="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">
                Subscribed Students
              </p>

              <p class="mt-2 text-2xl font-semibold text-slate-900">
                {{ summary.subscribedStudents.toLocaleString() }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Currently subscribed
              </p>
            </div>

            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50"
            >
              <Icon
                name="lucide:badge-check"
                class="h-5 w-5 text-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================================= -->
      <!-- ADMIN LIST -->
      <!-- ========================================================= -->

      <div
        class="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
      >

        <!-- List Header -->
        <div
          class="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h2 class="text-base font-semibold text-slate-900">
              All Administrators
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              View and manage all platform administrators.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">

            <!-- Search -->
            <div class="relative">
              <Icon
                name="lucide:search"
                class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model="search"
                type="text"
                placeholder="Search admins..."
                class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:w-[240px]"
              />
            </div>

            <!-- Status Filter -->
            <div class="relative">
              <Icon
                name="lucide:filter"
                class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <select
                v-model="statusFilter"
                class="h-10 appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Suspended">
                  Suspended
                </option>
              </select>

              <Icon
                name="lucide:chevron-down"
                class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        <!-- ======================================================= -->
        <!-- YOUR EXISTING UiDataList -->
        <!-- ======================================================= -->

        <UiDataList
          :items="filteredAdmins"
          :columns="columns"
          :loading="isLoading"
          empty-title="No admins found"
          empty-description="There are no administrators matching your current search or filter."
        >

          <!-- Admin -->
          <template #name="{ item }">
            <div class="flex min-w-[220px] items-center gap-3">

              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                />

                <span
                  v-else
                  class="text-xs font-semibold text-slate-600"
                >
                  {{ getInitials(item.name) }}
                </span>
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-800">
                  {{ item.name }}
                </p>

                <p class="truncate text-xs text-slate-400">
                  {{ item.email }}
                </p>

                <p class="mt-0.5 text-[11px] text-slate-400">
                  {{ item.id }}
                </p>
              </div>
            </div>
          </template>

          <!-- Teachers -->
          <template #totalTeachers="{ item }">
            <span class="text-sm font-medium text-slate-700">
              {{ item.totalTeachers.toLocaleString() }}
            </span>
          </template>

          <!-- Students -->
          <template #totalStudents="{ item }">
            <span class="text-sm font-medium text-slate-700">
              {{ item.totalStudents.toLocaleString() }}
            </span>
          </template>

          <!-- Subscribed Students -->
          <template #subscribedStudents="{ item }">
            <span class="text-sm font-medium text-emerald-600">
              {{ item.subscribedStudents.toLocaleString() }}
            </span>
          </template>

          <!-- Date Joined -->
          <template #dateJoined="{ item }">
            <span class="whitespace-nowrap text-sm text-slate-600">
              {{ item.dateJoined }}
            </span>
          </template>

          <!-- Last Login -->
          <template #lastLogin="{ item }">
            <span class="whitespace-nowrap text-sm text-slate-500">
              {{ item.lastLogin }}
            </span>
          </template>

          <!-- Status -->
          <template #status="{ item }">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
              :class="statusClass(item.status)"
            >
              <span
                class="mr-1.5 h-1.5 w-1.5 rounded-full bg-current"
              />

              {{ item.status }}
            </span>
          </template>

          <!-- Actions -->
          <template #actions="{ item }">
            <div class="flex items-center justify-end gap-1">

              <button
                type="button"
                title="View Admin"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                @click="viewAdmin(item)"
              >
                <Icon
                  name="lucide:eye"
                  class="h-4 w-4"
                />
              </button>

              <button
                type="button"
                title="Edit Admin"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                @click="editAdmin(item)"
              >
                <Icon
                  name="lucide:pencil"
                  class="h-4 w-4"
                />
              </button>

              <button
                type="button"
                :title="
                  item.status === 'Suspended'
                    ? 'Activate Admin'
                    : 'Suspend Admin'
                "
                class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                @click="suspendAdmin(item)"
              >
                <Icon
                  :name="
                    item.status === 'Suspended'
                      ? 'lucide:check-circle'
                      : 'lucide:ban'
                  "
                  class="h-4 w-4"
                />
              </button>

            </div>
          </template>

        </UiDataList>
      </div>
    </div>

    <!-- =========================================================== -->
    <!-- VIEW ADMIN MODAL -->
    <!-- =========================================================== -->

    <Teleport to="body">
      <Transition name="fade">

        <div
          v-if="showViewModal && selectedAdmin"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          @click.self="closeModals"
        >
          <div
            class="w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >

            <!-- Modal Header -->
            <div
              class="flex items-center justify-between border-b border-slate-100 px-6 py-5"
            >
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  Admin Details
                </h3>

                <p class="mt-1 text-sm text-slate-500">
                  Administrator account information.
                </p>
              </div>

              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                @click="closeModals"
              >
                <Icon
                  name="lucide:x"
                  class="h-5 w-5"
                />
              </button>
            </div>

            <!-- Profile -->
            <div class="space-y-6 p-6">

              <div class="flex items-center gap-4">
                <div
                  class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100"
                >
                  <img
                    v-if="selectedAdmin.image"
                    :src="selectedAdmin.image"
                    :alt="selectedAdmin.name"
                    class="h-full w-full object-cover"
                  />

                  <span
                    v-else
                    class="text-lg font-semibold text-slate-600"
                  >
                    {{ getInitials(selectedAdmin.name) }}
                  </span>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-slate-900">
                    {{ selectedAdmin.name }}
                  </h4>

                  <p class="text-sm text-slate-500">
                    {{ selectedAdmin.email }}
                  </p>

                  <span
                    class="mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                    :class="statusClass(selectedAdmin.status)"
                  >
                    {{ selectedAdmin.status }}
                  </span>
                </div>
              </div>

              <!-- Information -->
              <div class="grid grid-cols-2 gap-4">

                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Admin ID
                  </p>

                  <p class="mt-1 text-sm font-semibold text-slate-800">
                    {{ selectedAdmin.id }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Phone
                  </p>

                  <p class="mt-1 text-sm font-semibold text-slate-800">
                    {{ selectedAdmin.phone }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Teachers
                  </p>

                  <p class="mt-1 text-sm font-semibold text-slate-800">
                    {{ selectedAdmin.totalTeachers.toLocaleString() }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Students
                  </p>

                  <p class="mt-1 text-sm font-semibold text-slate-800">
                    {{ selectedAdmin.totalStudents.toLocaleString() }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Subscribed Students
                  </p>

                  <p class="mt-1 text-sm font-semibold text-emerald-600">
                    {{ selectedAdmin.subscribedStudents.toLocaleString() }}
                  </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs text-slate-400">
                    Date Joined
                  </p>

                  <p class="mt-1 text-sm font-semibold text-slate-800">
                    {{ selectedAdmin.dateJoined }}
                  </p>
                </div>

              </div>

              <div class="rounded-2xl border border-slate-100 p-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-500">
                    Last Login
                  </span>

                  <span class="text-sm font-medium text-slate-800">
                    {{ selectedAdmin.lastLogin }}
                  </span>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div
              class="flex justify-end border-t border-slate-100 px-6 py-4"
            >
              <button
                type="button"
                class="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                @click="closeModals"
              >
                Close
              </button>
            </div>

          </div>
        </div>

      </Transition>
    </Teleport>

    <!-- =========================================================== -->
    <!-- EDIT ADMIN MODAL PLACEHOLDER -->
    <!-- =========================================================== -->

    <Teleport to="body">
      <Transition name="fade">

        <div
          v-if="showEditModal && selectedAdmin"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          @click.self="closeModals"
        >
          <div
            class="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  Edit Admin
                </h3>

                <p class="mt-1 text-sm text-slate-500">
                  Update administrator information.
                </p>
              </div>

              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                @click="closeModals"
              >
                <Icon
                  name="lucide:x"
                  class="h-5 w-5"
                />
              </button>
            </div>

            <div class="mt-6 space-y-4">

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  :value="selectedAdmin.name"
                  type="text"
                  class="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  :value="selectedAdmin.email"
                  type="email"
                  class="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  :value="selectedAdmin.phone"
                  type="text"
                  class="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-slate-400"
                />
              </div>

            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                @click="closeModals"
              >
                Cancel
              </button>

              <button
                type="button"
                class="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                @click="closeModals"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>

      </Transition>
    </Teleport>

    <!-- =========================================================== -->
    <!-- SUSPEND / ACTIVATE MODAL -->
    <!-- =========================================================== -->

    <Teleport to="body">
      <Transition name="fade">

        <div
          v-if="showSuspendModal && selectedAdmin"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          @click.self="closeModals"
        >
          <div
            class="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"
          >

            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50"
            >
              <Icon
                :name="
                  selectedAdmin.status === 'Suspended'
                    ? 'lucide:check-circle'
                    : 'lucide:ban'
                "
                class="h-5 w-5 text-red-600"
              />
            </div>

            <h3 class="mt-5 text-lg font-semibold text-slate-900">
              {{
                selectedAdmin.status === 'Suspended'
                  ? 'Activate Admin?'
                  : 'Suspend Admin?'
              }}
            </h3>

            <p class="mt-2 text-sm leading-6 text-slate-500">
              {{
                selectedAdmin.status === 'Suspended'
                  ? `This will restore ${selectedAdmin.name}'s access to the platform.`
                  : `This will prevent ${selectedAdmin.name} from accessing the platform until the account is activated again.`
              }}
            </p>

            <div class="mt-6 flex justify-end gap-3">

              <button
                type="button"
                class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                @click="closeModals"
              >
                Cancel
              </button>

              <button
                type="button"
                class="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                @click="confirmSuspend"
              >
                {{
                  selectedAdmin.status === 'Suspended'
                    ? 'Activate Admin'
                    : 'Suspend Admin'
                }}
              </button>

            </div>

          </div>
        </div>

      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>