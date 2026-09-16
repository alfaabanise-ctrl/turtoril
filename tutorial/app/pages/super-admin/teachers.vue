```vue
<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

/* =========================================================
   TYPES
========================================================= */

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  students: number;
  paidStudents: number;
  admin: string;
  adminId: string | null;
  status: "Active" | "Pending" | "Inactive" | "Suspended";
  dateJoined: string;
  lastLogin: string | null;
}

interface TeachersApiResponse {
  success: boolean;
  teachers: any[];
  summary?: {
    totalTeachers: number;
    totalStudents: number;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/* =========================================================
   STATE
========================================================= */

const teachers = ref<Teacher[]>([]);

const loading = ref(false);
const errorMessage = ref("");

const search = ref("");
const selectedStatus = ref("All Status");

const currentPage = ref(1);
const limit = ref(20);

const totalTeachers = ref(0);
const totalStudentsApi = ref(0);
const totalPages = ref(1);

/* =========================================================
   COLUMNS
========================================================= */

const columns = [
  { key: "name", label: "Teacher" },
  { key: "students", label: "Students / Paid" },
  { key: "admin", label: "Admin" },
  { key: "status", label: "Status" },
];

/* =========================================================
   STATUS
========================================================= */

const statuses = [
  "All Status",
  "Active",
  "Pending",
  "Inactive",
  "Suspended",
];

/* =========================================================
   FETCH TEACHERS
========================================================= */

async function fetchTeachers() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const params = new URLSearchParams();

    params.set("page", String(currentPage.value));
    params.set("limit", String(limit.value));

    if (search.value.trim()) {
      params.set("search", search.value.trim());
    }

    if (selectedStatus.value !== "All Status") {
      params.set(
        "status",
        selectedStatus.value.toLowerCase()
      );
    }

    const response = await useApiFetch<TeachersApiResponse>(
      `/superadmin/teachers?${params.toString()}`
    );

    if (!response.success) {
      throw new Error(
        response.message || "Failed to load teachers"
      );
    }

    const apiData = response.data;

    if (!apiData) {
      teachers.value = [];
      totalTeachers.value = 0;
      totalStudentsApi.value = 0;
      totalPages.value = 1;
      return;
    }

    /* =====================================================
       MAP BACKEND DATA → FRONTEND DATA
    ===================================================== */

    teachers.value = (apiData.teachers || []).map(
      (teacher: any) => {
        const name = [
          teacher.firstName,
          teacher.middleName,
          teacher.lastName,
        ]
          .filter(Boolean)
          .join(" ")
          .trim();

        let adminName = "Not Assigned";

        if (teacher.admin) {
          adminName = [
            teacher.admin.firstName,
            teacher.admin.middleName,
            teacher.admin.lastName,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();

          if (!adminName) {
            adminName = "Not Assigned";
          }
        }

        return {
          id: String(teacher._id),

          name: name || "Unnamed Teacher",

          email: teacher.email || "-",

          phone:
            teacher.phone ||
            teacher.whatsapp_no ||
            "-",

          image: teacher.avatar || null,

          students: Number(
            teacher.totalStudents ??
              teacher.studentsCount ??
              teacher.students ??
              0
          ),

          paidStudents: Number(
            teacher.subscribedStudents ??
              teacher.paidStudents ??
              teacher.paidStudentCount ??
              0
          ),

          admin: adminName,

          adminId: teacher.adminOwner
            ? String(
                typeof teacher.adminOwner === "object"
                  ? teacher.adminOwner._id
                  : teacher.adminOwner
              )
            : null,

          status: normalizeStatus(teacher.status),

          dateJoined: teacher.createdAt || "",

          lastLogin: teacher.lastLogin || null,
        };
      }
    );

    /* =====================================================
       PAGINATION
    ===================================================== */

    totalTeachers.value =
      Number(apiData.pagination?.total) ||
      Number(apiData.summary?.totalTeachers) ||
      teachers.value.length;

    totalStudentsApi.value =
      Number(apiData.summary?.totalStudents) ||
      teachers.value.reduce(
        (total, teacher) =>
          total + teacher.students,
        0
      );

    totalPages.value =
      Number(apiData.pagination?.pages) ||
      Math.max(
        1,
        Math.ceil(
          totalTeachers.value / limit.value
        )
      );
  } catch (error: any) {
    console.error(
      "❌ Failed to fetch teachers:",
      error
    );

    teachers.value = [];

    errorMessage.value =
      error?.message ||
      "Unable to load teachers.";
  } finally {
    loading.value = false;
  }
}

/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(
  status: any
): Teacher["status"] {
  if (!status) {
    return "Active";
  }

  const value = String(status).toLowerCase();

  if (value === "active") return "Active";
  if (value === "pending") return "Pending";
  if (value === "inactive") return "Inactive";
  if (value === "suspended") return "Suspended";

  return "Active";
}

/* =========================================================
   SEARCH
========================================================= */

let searchTimer:
  | ReturnType<typeof setTimeout>
  | null = null;

watch(search, () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  searchTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchTeachers();
  }, 400);
});

/* =========================================================
   STATUS FILTER
========================================================= */

watch(selectedStatus, () => {
  currentPage.value = 1;
  fetchTeachers();
});

/* =========================================================
   FILTERED TEACHERS
========================================================= */

const filteredTeachers = computed(() => {
  /*
   * Filtering is performed by the backend.
   * We return the API results directly.
   */

  return teachers.value;
});

/* =========================================================
   COUNTS
========================================================= */

const activeCount = computed(() =>
  teachers.value.filter(
    (teacher) =>
      teacher.status === "Active"
  ).length
);

const pendingCount = computed(() =>
  teachers.value.filter(
    (teacher) =>
      teacher.status === "Pending"
  ).length
);

const inactiveCount = computed(() =>
  teachers.value.filter(
    (teacher) =>
      teacher.status === "Inactive"
  ).length
);

const suspendedCount = computed(() =>
  teachers.value.filter(
    (teacher) =>
      teacher.status === "Suspended"
  ).length
);

/* =========================================================
   STUDENT TOTALS
========================================================= */

const totalStudents = computed(() => {
  return (
    totalStudentsApi.value ||
    teachers.value.reduce(
      (total, teacher) =>
        total + teacher.students,
      0
    )
  );
});

const totalPaidStudents = computed(() => {
  return teachers.value.reduce(
    (total, teacher) =>
      total + teacher.paidStudents,
    0
  );
});

/* =========================================================
   STATS
========================================================= */

const stats = computed(() => [
  {
    label: "Total Teachers",
    value: totalTeachers.value,
    icon: "i-heroicons-academic-cap",
    color: "indigo" as const,
  },

  {
    label: "Active Teachers",
    value: activeCount.value,
    icon: "i-heroicons-check-circle",
    color: "green" as const,
  },

  {
    label: "Pending",
    value: pendingCount.value,
    icon: "i-heroicons-clock",
    color: "amber" as const,
  },

  {
    label: "Total Students",
    value: totalStudents.value,
    icon: "i-heroicons-users",
    color: "sky" as const,
  },
]);

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles: Record<string, string> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Inactive:
    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",

  Suspended:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const statusDots: Record<string, string> = {
  Active: "bg-green-500",
  Pending: "bg-amber-500",
  Inactive: "bg-gray-400",
  Suspended: "bg-red-500",
};

/* =========================================================
   INITIALS
========================================================= */

function initials(name: string) {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   AVATAR COLORS
========================================================= */

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

function avatarColor(name: string) {
  const sum = name
    .split("")
    .reduce(
      (acc, c) =>
        acc + c.charCodeAt(0),
      0
    );

  return avatarColors[
    sum % avatarColors.length
  ];
}

/* =========================================================
   PAID PERCENTAGE
========================================================= */

function paidPercentage(
  teacher: Teacher
) {
  if (!teacher.students) {
    return 0;
  }

  return Math.round(
    (teacher.paidStudents /
      teacher.students) *
      100
  );
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
  date: string | null
) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (
    Number.isNaN(parsed.getTime())
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(parsed);
}

/* =========================================================
   PAGINATION
========================================================= */

function nextPage() {
  if (
    currentPage.value >=
    totalPages.value
  ) {
    return;
  }

  currentPage.value++;
  fetchTeachers();
}

function previousPage() {
  if (currentPage.value <= 1) {
    return;
  }

  currentPage.value--;
  fetchTeachers();
}

function goToPage(page: number) {
  if (
    page < 1 ||
    page > totalPages.value
  ) {
    return;
  }

  currentPage.value = page;
  fetchTeachers();
}

/* =========================================================
   REFRESH
========================================================= */

function refreshTeachers() {
  fetchTeachers();
}

/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(() => {
  fetchTeachers();
});
</script>

<template>
  <div
    class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <div>
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-academic-cap"
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div>
            <h1
              class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
            >
              Teachers
            </h1>

            <p
              class="text-sm text-gray-400 mt-0.5"
            >
              Manage all teachers and their students
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Refresh -->
        <button
          type="button"
          title="Refresh teachers"
          @click="refreshTeachers"
          :disabled="loading"
          class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors disabled:opacity-50"
        >
          <Icon
            name="i-heroicons-arrow-path"
            class="w-5 h-5"
            :class="{
              'animate-spin': loading,
            }"
          />
        </button>

        <CreateUser
          type="teacher"
          button-text="Add Teacher"
          button-icon="lucide:user-plus"
          button-icon-class="h-5 w-5"
        />
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="mb-5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2">
        <Icon
          name="i-heroicons-exclamation-triangle"
          class="w-5 h-5 text-red-500"
        />

        <p
          class="text-sm text-red-700 dark:text-red-400"
        >
          {{ errorMessage }}
        </p>
      </div>

      <button
        type="button"
        @click="fetchTeachers"
        class="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Retry
      </button>
    </div>

    <!-- Data List -->
    <UiDataList
      :items="filteredTeachers"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No teachers found"
    >
      <!-- Filters -->
      <template #filters>
        <div
          class="flex flex-col sm:flex-row gap-2"
        >
          <!-- Search -->
          <div class="relative">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />

            <input
              v-model="search"
              type="search"
              placeholder="Search teachers..."
              class="w-full sm:w-64 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <!-- Status -->
          <select
            v-model="selectedStatus"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option
              v-for="status in statuses"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
        </div>
      </template>

      <!-- Teacher -->
      <template #cell-name="{ item }">
        <div
          class="flex items-center gap-3 min-w-[240px]"
        >
          <!-- Real Avatar -->
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.name"
            class="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
          />

          <!-- Initial Avatar -->
          <div
            v-else
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm"
            :class="avatarColor(item.name)"
          >
            {{ initials(item.name) }}
          </div>

          <!-- Details -->
          <div class="min-w-0">
            <p
              class="font-medium text-gray-900 dark:text-white truncate"
            >
              {{ item.name }}
            </p>

            <div
              class="flex items-center gap-1.5 mt-0.5"
            >
              <Icon
                name="i-heroicons-envelope"
                class="w-3.5 h-3.5 text-gray-400 shrink-0"
              />

              <p
                class="text-xs text-gray-400 truncate"
              >
                {{ item.email }}
              </p>
            </div>

            <div
              class="flex items-center gap-1.5 mt-0.5"
            >
              <Icon
                name="i-heroicons-phone"
                class="w-3.5 h-3.5 text-gray-400 shrink-0"
              />

              <p
                class="text-xs text-gray-400"
              >
                {{ item.phone }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Students / Paid -->
      <template #cell-students="{ item }">
        <div class="min-w-[150px]">
          <div
            class="flex items-center gap-2"
          >
            <span
              class="font-semibold text-gray-900 dark:text-white"
            >
              {{ item.students }}
            </span>

            <span class="text-gray-400">
              /
            </span>

            <span
              class="font-semibold text-emerald-600 dark:text-emerald-400"
            >
              {{ item.paidStudents }}
            </span>
          </div>

          <div
            class="flex items-center gap-2 mt-1.5"
          >
            <div
              class="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-emerald-500 rounded-full transition-all"
                :style="{
                  width: `${paidPercentage(item)}%`,
                }"
              />
            </div>

            <span
              class="text-[11px] text-gray-400"
            >
              {{ paidPercentage(item) }}%
            </span>
          </div>

          <p
            class="text-[11px] text-gray-400 mt-1"
          >
            Students / Paid
          </p>
        </div>
      </template>

      <!-- Admin -->
      <template #cell-admin="{ item }">
        <div
          class="flex items-center gap-2"
        >
          <div
            class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0"
          >
            <Icon
              name="i-heroicons-user"
              class="w-4 h-4 text-indigo-500"
            />
          </div>

          <div class="min-w-0">
            <p
              class="font-medium text-gray-700 dark:text-gray-200 truncate"
            >
              {{ item.admin }}
            </p>

            <p
              class="text-[11px] text-gray-400"
            >
              Administrator
            </p>
          </div>
        </div>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="statusStyles[item.status]"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="statusDots[item.status]"
          />

          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #actions_row="{ item }">
        <button
          title="Edit teacher"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
        >
          <Icon
            name="i-heroicons-pencil-square"
            class="w-4 h-4"
          />
        </button>

        <button
          title="Delete teacher"
          class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
        >
          <Icon
            name="i-heroicons-trash"
            class="w-4 h-4"
          />
        </button>
      </template>
    </UiDataList>

    <!-- Pagination -->
    <div
      v-if="totalTeachers > 0"
      class="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <p class="text-sm text-gray-400">
        Page {{ currentPage }} of {{ totalPages }}
        · {{ totalTeachers }} teachers
      </p>

      <div class="flex items-center gap-1">
        <button
          type="button"
          @click="previousPage"
          :disabled="
            currentPage === 1 || loading
          "
          class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          @click="goToPage(page)"
          class="min-w-9 px-2 py-2 rounded-lg text-sm transition-colors"
          :class="
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          "
        >
          {{ page }}
        </button>

        <button
          type="button"
          @click="nextPage"
          :disabled="
            currentPage === totalPages ||
            loading
          "
          class="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading && !teachers.length"
      class="py-12 flex flex-col items-center justify-center"
    >
      <Icon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-indigo-500 animate-spin"
      />

      <p
        class="mt-3 text-sm text-gray-400"
      >
        Loading teachers...
      </p>
    </div>
  </div>
</template>
```

### One backend requirement

For the **Admin** column to show the real administrator's name, your `/api/superadmin/teachers` controller needs to populate `adminOwner`:

```js
.populate({
  path: "adminOwner",
  select: "firstName middleName lastName email avatar",
})
```

Then return:

```js
admin: teacher.adminOwner
  ? {
      _id: teacher.adminOwner._id,
      firstName: teacher.adminOwner.firstName,
      middleName: teacher.adminOwner.middleName,
      lastName: teacher.adminOwner.lastName,
      email: teacher.adminOwner.email,
      avatar: teacher.adminOwner.avatar,
    }
  : null
```

Also, because your `useApiFetch()` wraps the raw backend response, this frontend correctly reads:

```text
response
   ↓
response.success
response.data
   ↓
response.data.teachers
response.data.summary
response.data.pagination
```

So you **do not need fake teacher records anymore**.

One thing to watch: your MongoDB schema shown earlier does **not** define `status` or `lastLogin`. If you want those two fields to actually persist in MongoDB, they should be added to `Usercbt`; otherwise the API can only treat a missing status as `Active`.
