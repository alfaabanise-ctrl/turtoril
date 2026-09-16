<!-- <script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  totalTeachers: number;
  totalStudents: number;
  paidStudents: number;
  dateJoined: string;
  lastLogin: string;
  status: "Active" | "Suspended" | "Inactive";
}

interface AdminSummary {
  totalAdmins: number;
  totalTeachers: number;
  totalStudents: number;
  paidStudents: number;
}

const summary = ref<AdminSummary>({
  totalAdmins: 12,
  totalTeachers: 186,
  totalStudents: 3840,
  paidStudents: 2914,
});

const admins = ref<Admin[]>([
  {
    id: "ADM-001",
    name: "John Admin",
    email: "john@example.com",
    phone: "08012345678",
    image: null,
    totalTeachers: 24,
    totalStudents: 486,
    paidStudents: 378,
    dateJoined: "12 January 2026",
    lastLogin: "11 September 2026 06:42 PM",
    status: "Active",
  },
  {
    id: "ADM-002",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "08023456789",
    image: null,
    totalTeachers: 18,
    totalStudents: 352,
    paidStudents: 291,
    dateJoined: "20 January 2026",
    lastLogin: "11 September 2026 05:18 PM",
    status: "Active",
  },
  {
    id: "ADM-003",
    name: "David Anderson",
    email: "david@example.com",
    phone: "08034567890",
    image: null,
    totalTeachers: 31,
    totalStudents: 624,
    paidStudents: 487,
    dateJoined: "03 February 2026",
    lastLogin: "10 September 2026 09:12 PM",
    status: "Active",
  },
  {
    id: "ADM-004",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "08045678901",
    image: null,
    totalTeachers: 14,
    totalStudents: 218,
    paidStudents: 164,
    dateJoined: "15 February 2026",
    lastLogin: "09 September 2026 04:37 PM",
    status: "Active",
  },
  {
    id: "ADM-005",
    name: "Elizabeth Johnson",
    email: "elizabeth@example.com",
    phone: "08056789012",
    image: null,
    totalTeachers: 27,
    totalStudents: 531,
    paidStudents: 419,
    dateJoined: "28 February 2026",
    lastLogin: "11 September 2026 01:24 PM",
    status: "Active",
  },
  {
    id: "ADM-006",
    name: "Daniel Smith",
    email: "daniel@example.com",
    phone: "08067890123",
    image: null,
    totalTeachers: 11,
    totalStudents: 193,
    paidStudents: 142,
    dateJoined: "09 March 2026",
    lastLogin: "08 September 2026 11:05 AM",
    status: "Inactive",
  },
  {
    id: "ADM-007",
    name: "James Wilson",
    email: "james@example.com",
    phone: "08078901234",
    image: null,
    totalTeachers: 22,
    totalStudents: 407,
    paidStudents: 318,
    dateJoined: "19 March 2026",
    lastLogin: "11 September 2026 03:52 PM",
    status: "Active",
  },
  {
    id: "ADM-008",
    name: "Grace Thompson",
    email: "grace@example.com",
    phone: "08089012345",
    image: null,
    totalTeachers: 16,
    totalStudents: 294,
    paidStudents: 227,
    dateJoined: "02 April 2026",
    lastLogin: "10 September 2026 08:15 PM",
    status: "Active",
  },
]);

const search = ref("");
const statusFilter = ref("All");
const isLoading = ref(false);

const selectedAdmin = ref<Admin | null>(null);
const activeModal = ref<"view" | "edit" | "suspend" | null>(null);

const columns = [
  {
    key: "name",
    label: "Administrator",
  },
  {
    key: "totalTeachers",
    label: "Teachers",
  },
  {
    key: "students",
    label: "Students / Paid",
  },
  {
    key: "dateJoined",
    label: "Date Joined",
  },
  {
    key: "lastLogin",
    label: "Last Login",
  },
  {
    key: "status",
    label: "Status",
  },
];

const filteredAdmins = computed(() => {
  const query = search.value.trim().toLowerCase();

  return admins.value.filter((admin) => {
    const matchesSearch =
      !query ||
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.id.toLowerCase().includes(query) ||
      admin.phone.includes(query);

    const matchesStatus =
      statusFilter.value === "All" || admin.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const activeAdmins = computed(
  () => admins.value.filter((admin) => admin.status === "Active").length
);

const suspendedAdmins = computed(
  () => admins.value.filter((admin) => admin.status === "Suspended").length
);

const inactiveAdmins = computed(
  () => admins.value.filter((admin) => admin.status === "Inactive").length
);

const subscriptionRate = computed(() => {
  if (!summary.value.totalStudents) return 0;

  return Math.round(
    (summary.value.paidStudents / summary.value.totalStudents) * 100
  );
});

const stats = computed(() => [
  {
    label: "Total Admins",
    value: summary.value.totalAdmins,
    icon: "i-heroicons-users",
    description: "Registered administrators",
  },
  {
    label: "Active Admins",
    value: activeAdmins.value,
    icon: "i-heroicons-check-circle",
    description: "Currently active",
  },
  {
    label: "Total Teachers",
    value: summary.value.totalTeachers,
    icon: "i-heroicons-academic-cap",
    description: "Managed teachers",
  },
  {
    label: "Total Students",
    value: summary.value.totalStudents,
    icon: "i-heroicons-user-group",
    description: `${subscriptionRate.value}% paid`,
  },
]);

const statusStyles: Record<Admin["status"], string> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Suspended: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  Inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const statusDots: Record<Admin["status"], string> = {
  Active: "bg-green-500",
  Suspended: "bg-rose-500",
  Inactive: "bg-gray-400",
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

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(name: string) {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return avatarColors[sum % avatarColors.length];
}

function paidPercentage(admin: Admin) {
  if (!admin.totalStudents) return 0;

  return Math.round((admin.paidStudents / admin.totalStudents) * 100);
}

function openModal(type: "view" | "edit" | "suspend", admin: Admin) {
  selectedAdmin.value = admin;
  activeModal.value = type;
}

function closeModal() {
  activeModal.value = null;
}

function statusDot(status: Admin["status"]) {
  return statusDots[status];
}
</script> -->
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* =========================================================
   TYPES
========================================================= */

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string | null;

  totalTeachers: number;
  totalStudents: number;
  paidStudents: number;

  dateJoined: string;
  lastLogin: string;

  status: "Active" | "Suspended" | "Inactive";
}

interface AdminSummary {
  totalAdmins: number;
  totalTeachers: number;
  totalStudents: number;
  paidStudents: number;
}

interface AdminApiResponse {
  success: boolean;
  data: {
    admins: any[];
    summary?: {
      totalAdmins: number;
      totalTeachers: number;
      totalStudents: number;
      paidStudents: number;
    };
  };
  message?: string;
}

/* =========================================================
   STATE
========================================================= */

const summary = ref<AdminSummary>({
  totalAdmins: 0,
  totalTeachers: 0,
  totalStudents: 0,
  paidStudents: 0,
});

const admins = ref<Admin[]>([]);

const search = ref("");
const statusFilter = ref("All");

const isLoading = ref(false);
const errorMessage = ref("");

const selectedAdmin = ref<Admin | null>(null);

const activeModal = ref<"view" | "edit" | "suspend" | null>(null);

/* =========================================================
   TABLE COLUMNS
========================================================= */

const columns = [
  {
    key: "name",
    label: "Administrator",
  },
  {
    key: "totalTeachers",
    label: "Teachers",
  },
  {
    key: "students",
    label: "Students / Paid",
  },
  {
    key: "dateJoined",
    label: "Date Joined",
  },
  {
    key: "lastLogin",
    label: "Last Login",
  },
  {
    key: "status",
    label: "Status",
  },
];

/* =========================================================
   FETCH ADMINS
========================================================= */

async function fetchAdmins() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    console.log("🔥 Fetching administrators...");

    const response = await useApiFetch<AdminApiResponse>(
      "/superadmin/admin",
      {
        method: "GET",
      }
    );

    console.log("📥 Admin API response:", response);

    if (!response.success) {
      errorMessage.value =
        response.message || "Failed to load administrators.";

      console.error("❌ Admin API error:", response.message);

      return;
    }

    if (!response.data) {
      errorMessage.value = "No administrator data was returned.";

      return;
    }

    const payload = response.data;

    /* =====================================================
       MAP ADMIN DATA
    ===================================================== */

    admins.value = (payload.admins || []).map((admin: any) => {
      const name =
        admin.name ||
        [admin.firstName, admin.middleName, admin.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();

      return {
        id: String(admin.id || admin._id || ""),

        name: name || "Unknown Administrator",

        email: admin.email || "",

        phone:
          admin.phone ||
          admin.whatsapp_no ||
          "",

        image:
          admin.image ||
          admin.avatar ||
          null,

        totalTeachers: Number(
          admin.totalTeachers || 0
        ),

        totalStudents: Number(
          admin.totalStudents || 0
        ),

        paidStudents: Number(
          admin.paidStudents || 0
        ),

        dateJoined:
          admin.dateJoined
            ? formatDate(admin.dateJoined)
            : admin.createdAt
              ? formatDate(admin.createdAt)
              : "—",

        lastLogin:
          admin.lastLogin
            ? formatDate(admin.lastLogin)
            : "Never",

        status: normalizeStatus(admin.status),
      };
    });

    /* =====================================================
       USE BACKEND SUMMARY
    ===================================================== */

    if (payload.summary) {
      summary.value = {
        totalAdmins: Number(
          payload.summary.totalAdmins || 0
        ),

        totalTeachers: Number(
          payload.summary.totalTeachers || 0
        ),

        totalStudents: Number(
          payload.summary.totalStudents || 0
        ),

        paidStudents: Number(
          payload.summary.paidStudents || 0
        ),
      };
    } else {
      /* ===================================================
         FALLBACK SUMMARY
      =================================================== */

      summary.value = {
        totalAdmins: admins.value.length,

        totalTeachers: admins.value.reduce(
          (total, admin) =>
            total + admin.totalTeachers,
          0
        ),

        totalStudents: admins.value.reduce(
          (total, admin) =>
            total + admin.totalStudents,
          0
        ),

        paidStudents: admins.value.reduce(
          (total, admin) =>
            total + admin.paidStudents,
          0
        ),
      };
    }

    console.log("✅ Administrators loaded:", admins.value);
    console.log("📊 Summary:", summary.value);
  } catch (error: any) {
    console.error(
      "🔥 Error fetching administrators:",
      error
    );

    errorMessage.value =
      error?.message ||
      "Unable to load administrators.";
  } finally {
    isLoading.value = false;
  }
}

/* =========================================================
   FORMAT DATE
========================================================= */

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

/* =========================================================
   NORMALIZE STATUS
========================================================= */

function normalizeStatus(
  status: any
): Admin["status"] {
  const value = String(
    status || "active"
  ).toLowerCase();

  switch (value) {
    case "suspended":
      return "Suspended";

    case "inactive":
      return "Inactive";

    case "active":
    default:
      return "Active";
  }
}

/* =========================================================
   FILTER ADMINS
========================================================= */

const filteredAdmins = computed(() => {
  const query = search.value
    .trim()
    .toLowerCase();

  return admins.value.filter((admin) => {
    const matchesSearch =
      !query ||
      admin.name
        .toLowerCase()
        .includes(query) ||
      admin.email
        .toLowerCase()
        .includes(query) ||
      admin.id
        .toLowerCase()
        .includes(query) ||
      admin.phone
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      statusFilter.value === "All" ||
      admin.status === statusFilter.value;

    return (
      matchesSearch &&
      matchesStatus
    );
  });
});

/* =========================================================
   ADMIN COUNTS
========================================================= */

const activeAdmins = computed(
  () =>
    admins.value.filter(
      (admin) =>
        admin.status === "Active"
    ).length
);

const suspendedAdmins = computed(
  () =>
    admins.value.filter(
      (admin) =>
        admin.status === "Suspended"
    ).length
);

const inactiveAdmins = computed(
  () =>
    admins.value.filter(
      (admin) =>
        admin.status === "Inactive"
    ).length
);

/* =========================================================
   SUBSCRIPTION RATE
========================================================= */

const subscriptionRate = computed(() => {
  if (!summary.value.totalStudents) {
    return 0;
  }

  return Math.round(
    (summary.value.paidStudents /
      summary.value.totalStudents) *
      100
  );
});

/* =========================================================
   STATISTICS
========================================================= */

const stats = computed(() => [
  {
    label: "Total Admins",
    value: summary.value.totalAdmins,
    icon: "i-heroicons-users",
    description:
      "Registered administrators",
  },

  {
    label: "Active Admins",
    value: activeAdmins.value,
    icon: "i-heroicons-check-circle",
    description:
      "Currently active",
  },

  {
    label: "Total Teachers",
    value: summary.value.totalTeachers,
    icon: "i-heroicons-academic-cap",
    description:
      "Managed teachers",
  },

  {
    label: "Total Students",
    value: summary.value.totalStudents,
    icon: "i-heroicons-user-group",
    description:
      `${subscriptionRate.value}% paid`,
  },
]);

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles: Record<
  Admin["status"],
  string
> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Suspended:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  Inactive:
    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const statusDots: Record<
  Admin["status"],
  string
> = {
  Active: "bg-green-500",

  Suspended: "bg-rose-500",

  Inactive: "bg-gray-400",
};

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
  "bg-cyan-500",
  "bg-orange-500",
];

/* =========================================================
   INITIALS
========================================================= */

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   AVATAR COLOR
========================================================= */

function avatarColor(name: string) {
  const sum = name
    .split("")
    .reduce(
      (acc, char) =>
        acc + char.charCodeAt(0),
      0
    );

  return avatarColors[
    sum % avatarColors.length
  ];
}

/* =========================================================
   PAID PERCENTAGE
========================================================= */

function paidPercentage(admin: Admin) {
  if (!admin.totalStudents) {
    return 0;
  }

  return Math.round(
    (admin.paidStudents /
      admin.totalStudents) *
      100
  );
}

/* =========================================================
   MODALS
========================================================= */

function openModal(
  type: "view" | "edit" | "suspend",
  admin: Admin
) {
  selectedAdmin.value = admin;
  activeModal.value = type;
}

function closeModal() {
  activeModal.value = null;
  selectedAdmin.value = null;
}

function statusDot(
  status: Admin["status"]
) {
  return statusDots[status];
}

/* =========================================================
   REFRESH
========================================================= */

async function refreshAdmins() {
  await fetchAdmins();
}

/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(() => {
  fetchAdmins();
});
</script>

<template>
  <Container class="mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div
      class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <div class="flex items-center gap-2">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <Icon name="i-heroicons-shield-check" class="h-5 w-5" />
          </div>

          <span
            class="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
          >
            Administration
          </span>
        </div>

        <h1
          class="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
        >
          Admins
        </h1>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage administrators, teachers, students and platform activity.
        </p>
      </div>
      <CreateUser
        type="admin"
        button-text="Add Admin"
        button-icon="lucide:user-plus"
        button-icon-class="h-5 w-5"
      />
      
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
      >
        <div class="flex items-start justify-between">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400 dark:group-hover:bg-indigo-500"
          >
            <Icon :name="stat.icon" class="h-5 w-5" />
          </div>

          <div
            class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-gray-400 dark:bg-gray-800"
          >
            <Icon name="i-heroicons-arrow-trending-up" class="h-3.5 w-3.5" />
          </div>
        </div>

        <div class="mt-5">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ stat.label }}
          </p>

          <p
            class="mt-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            {{ stat.value.toLocaleString() }}
          </p>

          <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {{ stat.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Overview -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <!-- Paid Students -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Paid Students
            </p>

            <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {{ summary.paidStudents.toLocaleString() }}
              <span class="text-sm font-normal text-gray-400">
                /
                {{ summary.totalStudents.toLocaleString() }}
              </span>
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Icon name="i-heroicons-check-badge" class="h-5 w-5" />
          </div>
        </div>

        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between text-xs">
            <span class="text-gray-400"> Payment rate </span>

            <span class="font-semibold text-emerald-600">
              {{ subscriptionRate }}%
            </span>
          </div>

          <div
            class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <div
              class="h-full rounded-full bg-emerald-500 transition-all"
              :style="{
                width: `${subscriptionRate}%`,
              }"
            />
          </div>
        </div>
      </div>

      <!-- Active Admins -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Administrators
            </p>

            <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {{ activeAdmins }}
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Icon name="i-heroicons-bolt" class="h-5 w-5" />
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <span class="inline-flex items-center gap-1.5 text-emerald-600">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {{ activeAdmins }} Active
          </span>

          <span class="inline-flex items-center gap-1.5 text-rose-500">
            <span class="h-1.5 w-1.5 rounded-full bg-rose-500" />
            {{ suspendedAdmins }} Suspended
          </span>
        </div>
      </div>

      <!-- Account Health -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Health
            </p>

            <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {{ inactiveAdmins }}

              <span class="text-sm font-normal text-gray-400"> inactive </span>
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          >
            <Icon name="i-heroicons-chart-bar" class="h-5 w-5" />
          </div>
        </div>

        <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Keep administrator accounts active and secure.
        </p>
      </div>
    </div>

    <!-- Admin Table -->
    <UiDataList
      :items="filteredAdmins"
      :columns="columns"
      row-key="id"
      :loading="isLoading"
      empty-text="No administrators found"
    >
      <!-- Filters -->
      <template #filters>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <div class="relative w-full sm:w-72">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="search"
              type="text"
              placeholder="Search admins..."
              class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <select
            v-model="statusFilter"
            class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="All">All Status</option>

            <option value="Active">Active</option>

            <option value="Suspended">Suspended</option>

            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </template>

      <!-- Administrator -->
      <template #cell-name="{ item }">
        <div class="flex min-w-[250px] items-center gap-3">
          <!-- Avatar -->
          <div
            v-if="item.image"
            class="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-900"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
          </div>

          <div
            v-else
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900"
            :class="avatarColor(item.name)"
          >
            {{ initials(item.name) }}
          </div>

          <!-- Admin Details -->
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="truncate font-semibold text-gray-900 dark:text-white">
                {{ item.name }}
              </p>

              <span
                v-if="item.id === 'ADM-001'"
                class="hidden rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 sm:inline-flex dark:bg-indigo-500/10 dark:text-indigo-400"
              >
                You
              </span>
            </div>

            <!-- Email -->
            <div class="mt-0.5 flex items-center gap-1.5">
              <Icon
                name="i-heroicons-envelope"
                class="h-3.5 w-3.5 shrink-0 text-gray-400"
              />

              <p class="truncate text-xs text-gray-400 dark:text-gray-500">
                {{ item.email }}
              </p>
            </div>

            <!-- Phone -->
            <div class="mt-0.5 flex items-center gap-1.5">
              <Icon
                name="i-heroicons-phone"
                class="h-3.5 w-3.5 shrink-0 text-gray-400"
              />

              <p class="text-xs text-gray-400 dark:text-gray-500">
                {{ item.phone }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Teachers -->
      <template #cell-totalTeachers="{ item }">
        <div class="flex min-w-[100px] items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <Icon name="i-heroicons-academic-cap" class="h-4 w-4" />
          </div>

          <div>
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ item.totalTeachers }}
            </p>

            <p class="text-[10px] text-gray-400">Teachers</p>
          </div>
        </div>
      </template>

      <!-- Students / Paid -->
      <template #cell-students="{ item }">
        <div class="min-w-[150px]">
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
            >
              <Icon name="i-heroicons-user-group" class="h-4 w-4" />
            </div>

            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-gray-900 dark:text-white">
                {{ item.totalStudents }}
              </span>

              <span class="text-gray-400"> / </span>

              <span
                class="font-semibold text-emerald-600 dark:text-emerald-400"
              >
                {{ item.paidStudents }}
              </span>
            </div>
          </div>

          <!-- Progress -->
          <div class="mt-2 flex items-center gap-2">
            <div
              class="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <div
                class="h-full rounded-full bg-emerald-500 transition-all"
                :style="{
                  width: `${paidPercentage(item)}%`,
                }"
              />
            </div>

            <span class="text-[10px] font-medium text-emerald-600">
              {{ paidPercentage(item) }}%
            </span>
          </div>

          <p class="mt-1 text-[10px] text-gray-400">Students / Paid</p>
        </div>
      </template>

      <!-- Date Joined -->
      <template #cell-dateJoined="{ item }">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <Icon
              name="i-heroicons-calendar-days"
              class="h-4 w-4 text-gray-400"
            />
          </div>

          <span
            class="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300"
          >
            {{ item.dateJoined }}
          </span>
        </div>
      </template>

      <!-- Last Login -->
      <template #cell-lastLogin="{ item }">
        <div>
          <div class="flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span
              class="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300"
            >
              {{ item.lastLogin }}
            </span>
          </div>

          <p class="mt-1 pl-3 text-[10px] text-gray-400">Last activity</p>
        </div>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
          :class="statusStyles[item.status]"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="statusDot(item.status)"
          />

          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #actions_row="{ item }">
        <div class="flex items-center justify-end gap-1">
          <button
            type="button"
            title="View admin"
            class="rounded-lg p-1.5 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            @click="openModal('view', item)"
          >
            <Icon name="i-heroicons-eye" class="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Edit admin"
            class="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            @click="openModal('edit', item)"
          >
            <Icon name="i-heroicons-pencil-square" class="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Suspend admin"
            class="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
            @click="openModal('suspend', item)"
          >
            <Icon name="i-heroicons-no-symbol" class="h-4 w-4" />
          </button>
        </div>
      </template>
    </UiDataList>
  </Container>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  display: n;
  transform: translateY(8px) scale(0.98);
}
</style>
