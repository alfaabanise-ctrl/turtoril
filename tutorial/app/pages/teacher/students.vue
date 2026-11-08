```vue
<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";

definePageMeta({
  layout: "nav",
});

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface Person {
  _id: string;
  firstName?: string;
  middleName?: string | null;
  lastName?: string | null;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
  role?: string;
}

type TokenStatus =
  | "none"
  | "unused"
  | "active"
  | "used"
  | "expired"
  | "revoked";

type AccountStatus = "Active" | "Suspended" | "Inactive";

interface SoftwareToken {
  _id: string;
  token?: string | null;
  status: "unused" | "active" | "used" | "expired" | "revoked";
  owner?: string | Person | null;
  activatedBy?: string | Person | null;
  activatedAt?: string | null;
  expiresAt?: string | null;
  features?: string[];
  deviceLimit?: number;
  deviceCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiStudent {
  _id: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  whatsapp_no?: string | null;
  avatar?: string | null;
  ExamYear?: number | null;

  status?: AccountStatus;

  emailVerified?: boolean;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;

  teacherOwner?: Person | null;
  adminOwner?: Person | null;

  teacher?: Person | null;
  admin?: Person | null;

  softwareToken?: SoftwareToken | null;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  examYear: string;

  tokenStatus: TokenStatus;

  token: string | null;
  tokenActivatedAt: string | null;
  tokenExpiresAt: string | null;

  deviceCount: number;
  deviceLimit: number;

  features: string[];

  teacher: string;
  admin: string;

  accountStatus: AccountStatus;

  joinedAt: string;

  avatar?: string | null;

  teacherData?: Person | null;
  adminData?: Person | null;

  softwareToken?: SoftwareToken | null;
}

interface StudentsApiResponse {
  success: boolean;
  message?: string;

  data?: {
    students: ApiStudent[];

    summary?: {
      totalStudents: number;
      totalTeachers?: number;

      totalTokens?: number;
      activeTokens?: number;
      unusedTokens?: number;
      usedTokens?: number;
      expiredTokens?: number;
      revokedTokens?: number;

      studentsWithToken?: number;
      studentsWithoutToken?: number;
    };

    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const students = ref<Student[]>([]);

const loading = ref(false);
const errorMessage = ref("");

const search = ref("");

const selectedYear = ref("All Years");

const selectedTokenStatus = ref("All Token Status");

const currentPage = ref(1);

const pageLimit = ref(20);

const totalPages = ref(1);

const totalFilteredStudents = ref(0);

/*
|--------------------------------------------------------------------------
| GLOBAL SUMMARY
|--------------------------------------------------------------------------
*/

const totalStudents = ref(0);
const totalTeachers = ref(0);

const totalTokens = ref(0);
const activeTokens = ref(0);
const unusedTokens = ref(0);
const usedTokens = ref(0);
const expiredTokens = ref(0);
const revokedTokens = ref(0);

const studentsWithToken = ref(0);
const studentsWithoutToken = ref(0);

/*
|--------------------------------------------------------------------------
| TABLE COLUMNS
|--------------------------------------------------------------------------
*/

const columns = [
  {
    key: "name",
    label: "Student",
  },
  {
    key: "tokenStatus",
    label: "Token Status",
  },
  {
    key: "examYear",
    label: "Exam Year",
  },
  {
    key: "devices",
    label: "Devices",
  },

 
  {
    key: "accountStatus",
    label: "Account",
  },
  {
    key: "tokenExpiresAt",
    label: "Token Expiry",
  },
];

/*
|--------------------------------------------------------------------------
| YEAR OPTIONS
|--------------------------------------------------------------------------
*/

const years = computed(() => {
  const currentYear = new Date().getFullYear();

  return [
    "All Years",
    `${currentYear} JAMB`,
    `${currentYear + 1} JAMB`,
    `${currentYear + 2} JAMB`,
  ];
});

/*
|--------------------------------------------------------------------------
| TOKEN STATUS OPTIONS
|--------------------------------------------------------------------------
*/

const tokenStatuses = [
  "All Token Status",
  "unused",
  "active",
  "used",
  "expired",
  "revoked",
  "none",
];

/*
|--------------------------------------------------------------------------
| NAME HELPER
|--------------------------------------------------------------------------
*/

function fullName(user: Person | ApiStudent | null | undefined) {
  if (!user) {
    return "";
  }

  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
}

/*
|--------------------------------------------------------------------------
| EXAM YEAR
|--------------------------------------------------------------------------
*/

function formatExamYear(year?: number | null) {
  if (!year) {
    return "Not set";
  }

  return `${year} JAMB`;
}

/*
|--------------------------------------------------------------------------
| TOKEN STATUS LABEL
|--------------------------------------------------------------------------
*/

function tokenStatusLabel(status: TokenStatus) {
  switch (status) {
    case "active":
      return "Active";

    case "unused":
      return "Unused";

    case "used":
      return "Used";

    case "expired":
      return "Expired";

    case "revoked":
      return "Revoked";

    case "none":
      return "No Token";

    default:
      return "No Token";
  }
}

/*
|--------------------------------------------------------------------------
| MAP API STUDENT
|--------------------------------------------------------------------------
*/

function mapStudent(student: ApiStudent): Student {
  const teacher = student.teacher || student.teacherOwner || null;

  const admin = student.admin || student.adminOwner || null;

  const softwareToken = student.softwareToken || null;

  const tokenStatus: TokenStatus = softwareToken?.status || "none";

  return {
    id: student._id,

    name: fullName(student),

    email: student.email,

    phone: student.phone || student.whatsapp_no || "No phone",

    examYear: formatExamYear(student.ExamYear),

    tokenStatus,

    /*
     * IMPORTANT:
     * Backend should ideally return a masked token,
     * not the full secret token.
     */
    token: softwareToken?.token || null,

    tokenActivatedAt: softwareToken?.activatedAt || null,

    tokenExpiresAt: softwareToken?.expiresAt || null,

    deviceCount: softwareToken?.deviceCount || 0,

    deviceLimit: softwareToken?.deviceLimit || 1,

    features: softwareToken?.features || [],

    teacher: fullName(teacher) || "No Teacher",

    admin: fullName(admin) || "No Admin",

    accountStatus: student.status || "Inactive",

    joinedAt: student.createdAt,

    avatar: student.avatar || null,

    teacherData: teacher,

    adminData: admin,

    softwareToken,
  };
}

/*
|--------------------------------------------------------------------------
| FETCH STUDENTS
|--------------------------------------------------------------------------
*/

async function fetchStudents() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const params = new URLSearchParams();

    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    params.set("page", String(currentPage.value));

    /*
    |--------------------------------------------------------------------------
    | LIMIT
    |--------------------------------------------------------------------------
    */

    params.set("limit", String(pageLimit.value));

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (search.value.trim()) {
      params.set("search", search.value.trim());
    }

    /*
    |--------------------------------------------------------------------------
    | EXAM YEAR
    |--------------------------------------------------------------------------
    */

    if (selectedYear.value !== "All Years") {
      const year = selectedYear.value.replace(" JAMB", "");

      params.set("examYear", year);
    }

    /*
    |--------------------------------------------------------------------------
    | SOFTWARE TOKEN STATUS
    |--------------------------------------------------------------------------
    */

    if (selectedTokenStatus.value !== "All Token Status") {
      params.set("tokenStatus", selectedTokenStatus.value);
    }

    /*
    |--------------------------------------------------------------------------
    | API REQUEST
    |--------------------------------------------------------------------------
    */

    const response = await useApiFetch<StudentsApiResponse>(
      `/teacher/students?${params.toString()}`
    );

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (!response.success) {
      throw new Error(response.message || "Failed to load students");
    }

    const apiData = response.data;

    /*
    |--------------------------------------------------------------------------
    | STUDENTS
    |--------------------------------------------------------------------------
    */

    students.value = (apiData?.students || []).map(mapStudent);

    /*
    |--------------------------------------------------------------------------
    | GLOBAL SUMMARY
    |--------------------------------------------------------------------------
    */

    totalStudents.value = apiData?.summary?.totalStudents || 0;

    totalTeachers.value = apiData?.summary?.totalTeachers || 0;

    totalTokens.value = apiData?.summary?.totalTokens || 0;

    activeTokens.value = apiData?.summary?.activeTokens || 0;

    unusedTokens.value = apiData?.summary?.unusedTokens || 0;

    usedTokens.value = apiData?.summary?.usedTokens || 0;

    expiredTokens.value = apiData?.summary?.expiredTokens || 0;

    revokedTokens.value = apiData?.summary?.revokedTokens || 0;

    studentsWithToken.value = apiData?.summary?.studentsWithToken || 0;

    studentsWithoutToken.value = apiData?.summary?.studentsWithoutToken || 0;

    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    totalFilteredStudents.value = apiData?.pagination?.total || 0;

    totalPages.value = apiData?.pagination?.totalPages || 1;

    currentPage.value = apiData?.pagination?.page || currentPage.value;
  } catch (error: any) {
    console.error("Failed to fetch students:", error);

    errorMessage.value = error?.message || "Unable to load students";

    students.value = [];
  } finally {
    loading.value = false;
  }
}

/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

onMounted(() => {
  fetchStudents();
});

/*
|--------------------------------------------------------------------------
| SEARCH WATCHER
|--------------------------------------------------------------------------
*/

let searchTimer: ReturnType<typeof setTimeout> | undefined;

watch(search, () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchStudents();
  }, 400);
});

/*
|--------------------------------------------------------------------------
| FILTER WATCHER
|--------------------------------------------------------------------------
*/

watch([selectedYear, selectedTokenStatus], () => {
  currentPage.value = 1;
  fetchStudents();
});

/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;

    fetchStudents();
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;

    fetchStudents();
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) {
    return;
  }

  currentPage.value = page;

  fetchStudents();
}

/*
|--------------------------------------------------------------------------
| PAGE NUMBERS
|--------------------------------------------------------------------------
*/

const visiblePages = computed(() => {
  const total = totalPages.value;

  const current = currentPage.value;

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: number[] = [];

  pages.push(1);

  if (current > 4) {
    pages.push(-1);
  }

  const start = Math.max(2, current - 1);

  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (current < total - 3) {
    pages.push(-2);
  }

  pages.push(total);

  return pages;
});

/*
|--------------------------------------------------------------------------
| REFRESH
|--------------------------------------------------------------------------
*/

function refreshStudents() {
  fetchStudents();
}

/*
|--------------------------------------------------------------------------
| DISPLAYED STUDENTS
|--------------------------------------------------------------------------
*/

const filteredStudents = computed(() => {
  return students.value;
});

/*
|--------------------------------------------------------------------------
| TOKEN COUNTS
|--------------------------------------------------------------------------
*/

const activeCount = computed(() => activeTokens.value);

const pendingCount = computed(() => unusedTokens.value);

const expiredCount = computed(() => expiredTokens.value);

/*
|--------------------------------------------------------------------------
| TOKEN COVERAGE
|--------------------------------------------------------------------------
*/

const tokenCoverage = computed(() => {
  if (!totalStudents.value) {
    return 0;
  }

  return Math.round((studentsWithToken.value / totalStudents.value) * 100);
});

/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

const stats = computed(() => [
  {
    label: "Total Students",
    value: totalStudents.value,
    icon: "i-heroicons-user-group",
  },

  {
    label: "Active Tokens",
    value: activeTokens.value,
    icon: "i-heroicons-key",
  },

  {
    label: "Unused Tokens",
    value: unusedTokens.value,
    icon: "i-heroicons-ticket",
  },

  {
    label: "Expired Tokens",
    value: expiredTokens.value,
    icon: "i-heroicons-clock",
  },
]);

/*
|--------------------------------------------------------------------------
| TOKEN STATUS STYLES
|--------------------------------------------------------------------------
*/

const tokenStatusStyles: Record<TokenStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400",

  unused:
    "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400",

  used: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/10 dark:bg-violet-500/10 dark:text-violet-400",

  expired:
    "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400",

  revoked:
    "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400",

  none: "bg-gray-100 text-gray-500 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400",
};

/*
|--------------------------------------------------------------------------
| ACCOUNT STATUS STYLES
|--------------------------------------------------------------------------
*/

const accountStatusStyles: Record<AccountStatus, string> = {
  Active:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Suspended:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

/*
|--------------------------------------------------------------------------
| AVATAR COLORS
|--------------------------------------------------------------------------
*/

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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(name: string) {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return avatarColors[sum % avatarColors.length];
}

/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

function formatDate(date: string | Date | null | undefined) {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/*
|--------------------------------------------------------------------------
| TOKEN EXPIRY
|--------------------------------------------------------------------------
*/

function expiryLabel(date?: string | null) {
  if (!date) {
    return "No expiry";
  }

  const expiry = new Date(date);

  if (Number.isNaN(expiry.getTime())) {
    return "—";
  }

  if (expiry.getTime() < Date.now()) {
    return "Expired";
  }

  return formatDate(date);
}

/*
|--------------------------------------------------------------------------
| DEVICE LABEL
|--------------------------------------------------------------------------
*/

function deviceLabel(student: Student) {
  return `${student.deviceCount} / ${student.deviceLimit}`;
}

/*
|--------------------------------------------------------------------------
| TOKEN DOT
|--------------------------------------------------------------------------
*/

function tokenDotClass(status: TokenStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-500";

    case "unused":
      return "bg-blue-500";

    case "used":
      return "bg-violet-500";

    case "expired":
      return "bg-gray-400";

    case "revoked":
      return "bg-rose-500";

    default:
      return "bg-gray-400";
  }
}

/*
|--------------------------------------------------------------------------
| TOKEN DISPLAY
|--------------------------------------------------------------------------
*/

function displayToken(token?: string | null) {
  if (!token) {
    return "No token";
  }

  return token;
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- ========================================================= -->
    <!-- HEADER -->
    <!-- ========================================================= -->

    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <Icon name="i-heroicons-user-group" class="w-3.5 h-3.5" />

            Student Management
          </span>
        </div>

        <h1
          class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight"
        >
          Students
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Manage students, software tokens, teachers and administrators.
        </p>
      </div>

      <CreateUser
        type="student"
        button-text="Add Student"
        button-icon="lucide:user-plus"
        button-icon-class="h-5 w-5"
      />
    </div>

    <!-- ========================================================= -->
    <!-- ERROR -->
    <!-- ========================================================= -->

    <div
      v-if="errorMessage"
      class="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-400"
    >
      <div class="flex items-center justify-between gap-3">
        <span>
          {{ errorMessage }}
        </span>

        <button
          type="button"
          class="font-medium hover:underline"
          @click="refreshStudents"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- STATS -->
    <!-- ========================================================= -->

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-gray-400">
              {{ stat.label }}
            </p>

            <p
              class="text-2xl font-semibold text-gray-900 dark:text-white mt-1"
            >
              {{ loading ? "..." : stat.value }}
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon :name="stat.icon" class="w-4.5 h-4.5 text-indigo-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TOKEN OVERVIEW -->
    <!-- ========================================================= -->

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- ACTIVE -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-xs font-medium text-gray-400">Active Tokens</p>

            <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {{ activeTokens }}
              Active
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-key" class="w-4.5 h-4.5 text-emerald-500" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-4 text-xs">
          <span
            class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500" />

            {{ unusedTokens }}
            Unused
          </span>

          <span
            class="flex items-center gap-1.5 text-violet-600 dark:text-violet-400"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-violet-500" />

            {{ usedTokens }}
            Used
          </span>
        </div>
      </div>

      <!-- EXPIRED / REVOKED -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400">Expired / Revoked</p>

            <p
              class="text-2xl font-semibold text-gray-900 dark:text-white mt-1"
            >
              {{ expiredTokens + revokedTokens }}
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-no-symbol"
              class="w-4.5 h-4.5 text-rose-500"
            />
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          {{ expiredTokens }} expired · {{ revokedTokens }} revoked
        </p>
      </div>

      <!-- COVERAGE -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400">Token Coverage</p>

            <p
              class="text-2xl font-semibold text-gray-900 dark:text-white mt-1"
            >
              {{ tokenCoverage }}%
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-chart-bar"
              class="w-4.5 h-4.5 text-indigo-500"
            />
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          {{ studentsWithToken }}
          students have tokens ·
          {{ studentsWithoutToken }}
          without
        </p>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TABLE -->
    <!-- ========================================================= -->

    <UiDataList
      :items="filteredStudents"
      :columns="columns"
      row-key="id"
      :stats="stats"
      :empty-text="loading ? 'Loading students...' : 'No students found'"
    >
      <!-- ======================================================= -->
      <!-- FILTERS -->
      <!-- ======================================================= -->

      <template #filters>
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <!-- SEARCH -->

          <div class="relative flex-1 min-w-[220px]">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />

            <input
              v-model="search"
              type="text"
              placeholder="Search students..."
              class="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <!-- YEAR -->

          <select
            v-model="selectedYear"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>

          <!-- TOKEN STATUS -->

          <select
            v-model="selectedTokenStatus"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option
              v-for="status in tokenStatuses"
              :key="status"
              :value="status"
            >
              {{
                status ===
                "All Token Status"
                  ? status
                  : tokenStatusLabel(
                      status as TokenStatus
                    )
              }}
            </option>
          </select>

          <!-- REFRESH -->

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            :disabled="loading"
            @click="refreshStudents"
          >
            <Icon
              name="i-heroicons-arrow-path"
              class="w-4 h-4"
              :class="{
                'animate-spin': loading,
              }"
            />

            Refresh
          </button>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- STUDENT -->
      <!-- ======================================================= -->

      <template #cell-name="{ item }">
        <div class="flex items-center gap-3 min-w-[260px]">
          <div
            v-if="!item.avatar"
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm"
            :class="avatarColor(item.name)"
          >
            {{ initials(item.name) }}
          </div>

          <img
            v-else
            :src="item.avatar"
            :alt="item.name"
            class="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
          />

          <div class="min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white truncate">
              {{ item.name }}
            </p>

            <div class="flex items-center gap-1.5 mt-0.5">
              <Icon
                name="i-heroicons-envelope"
                class="w-3.5 h-3.5 text-gray-400 shrink-0"
              />

              <p class="text-xs text-gray-400 truncate">
                {{ item.email }}
              </p>
            </div>

            <div class="flex items-center gap-1.5 mt-0.5">
              <Icon
                name="i-heroicons-phone"
                class="w-3.5 h-3.5 text-gray-400 shrink-0"
              />

              <p class="text-xs text-gray-400">
                {{ item.phone }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- TOKEN STATUS -->
      <!-- ======================================================= -->

      <template #cell-tokenStatus="{ item }">
        <div class="flex flex-col gap-1">
          <span
            class="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            :class="tokenStatusStyles[item.tokenStatus]"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="tokenDotClass(item.tokenStatus)"
            />

            {{ tokenStatusLabel(item.tokenStatus) }}
          </span>

          <span v-if="item.token" class="text-[11px] text-gray-400 font-mono">
            {{ displayToken(item.token) }}
          </span>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- EXAM YEAR -->
      <!-- ======================================================= -->

      <template #cell-examYear="{ item }">
        <span
          class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300 whitespace-nowrap"
        >
          <Icon
            name="i-heroicons-calendar-days"
            class="w-4 h-4 text-gray-400"
          />

          {{ item.examYear }}
        </span>
      </template>

      <!-- ======================================================= -->
      <!-- DEVICES -->
      <!-- ======================================================= -->

      <template #cell-devices="{ item }">
        <div class="min-w-[90px]">
          <p class="font-semibold text-gray-700 dark:text-gray-200">
            {{ deviceLabel(item) }}
          </p>

          <p class="text-[11px] text-gray-400 mt-0.5">Used / Allowed</p>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- TEACHER -->
      <!-- ======================================================= -->

      <template #cell-teacher="{ item }">
        <div class="flex items-center gap-2 min-w-[170px]">
          <div
            class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0"
          >
            <Icon
              name="i-heroicons-academic-cap"
              class="w-4 h-4 text-indigo-500"
            />
          </div>

          <div class="min-w-0">
            <p class="font-medium text-gray-700 dark:text-gray-200 truncate">
              {{ item.teacher }}
            </p>

            <p class="text-[11px] text-gray-400">Teacher</p>
          </div>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- ADMIN -->
      <!-- ======================================================= -->

      <template #cell-admin="{ item }">
        <div class="flex items-center gap-2 min-w-[150px]">
          <div
            class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0"
          >
            <Icon
              name="i-heroicons-shield-check"
              class="w-4 h-4 text-emerald-500"
            />
          </div>

          <div class="min-w-0">
            <p class="font-medium text-gray-700 dark:text-gray-200 truncate">
              {{ item.admin }}
            </p>

            <p class="text-[11px] text-gray-400">Administrator</p>
          </div>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- ACCOUNT STATUS -->
      <!-- ======================================================= -->

      <template #cell-accountStatus="{ item }">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
          :class="accountStatusStyles[item.accountStatus]"
        >
          {{ item.accountStatus }}
        </span>
      </template>

      <!-- ======================================================= -->
      <!-- TOKEN EXPIRY -->
      <!-- ======================================================= -->

      <template #cell-tokenExpiresAt="{ item }">
        <div class="min-w-[120px]">
          <p
            class="text-sm text-gray-700 dark:text-gray-200"
            :class="{
              'text-rose-500':
                item.tokenStatus === 'expired' ||
                item.tokenStatus === 'revoked',
            }"
          >
            {{ expiryLabel(item.tokenExpiresAt) }}
          </p>

          <p
            v-if="item.tokenActivatedAt"
            class="text-[11px] text-gray-400 mt-0.5"
          >
            Activated:
            {{ formatDate(item.tokenActivatedAt) }}
          </p>
        </div>
      </template>

      <!-- ======================================================= -->
      <!-- ACTIONS -->
      <!-- ======================================================= -->

      <template #actions_row="{ item }">
        <div class="flex items-center">
          <!-- EDIT -->

          <button
            type="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
            title="Edit student"
          >
            <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
          </button>

          <!-- TOKEN -->

          <button
            type="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors ml-1"
            title="View software token"
          >
            <Icon name="i-heroicons-key" class="w-4 h-4" />
          </button>

          <!-- DELETE -->

          <button
            type="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
            title="Delete student"
          >
            <Icon name="i-heroicons-trash" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </UiDataList>

    <!-- ========================================================= -->
    <!-- PAGINATION -->
    <!-- ========================================================= -->

    <div
      v-if="totalPages > 1"
      class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5"
    >
      <p class="text-sm text-gray-400">
        Showing
        {{ Math.min((currentPage - 1) * pageLimit + 1, totalFilteredStudents) }}
        -
        {{ Math.min(currentPage * pageLimit, totalFilteredStudents) }}
        of
        {{ totalFilteredStudents }}
        students
      </p>

      <div class="flex items-center gap-1">
        <!-- PREVIOUS -->

        <button
          type="button"
          class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40"
          :disabled="currentPage <= 1 || loading"
          @click="previousPage"
        >
          Previous
        </button>

        <!-- PAGE NUMBERS -->

        <template v-for="page in visiblePages" :key="page">
          <span v-if="page < 0" class="px-2 text-gray-400"> ... </span>

          <button
            v-else
            type="button"
            class="min-w-9 px-2 py-2 rounded-lg text-sm border"
            :class="
              page === currentPage
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            "
            :disabled="loading"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>

        <!-- NEXT -->

        <button
          type="button"
          class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40"
          :disabled="currentPage >= totalPages || loading"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

