
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;

  activeUsers: number;

  totalTokens: number;
  activeTokens: number;
  unusedTokens: number;
  usedTokens: number;
  expiredTokens: number;
  revokedTokens: number;

  activeSubscriptions: number;

  totalRevenue: number;
  tokenRevenue: number;

  changes: {
    students: number;
    teachers: number;
    admins: number;
    revenue: number;
  };
}

interface RecentStudent {
  _id?: string;
  id?: string;

  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;

  email: string;

  status:
    | "Active"
    | "Pending"
    | "Expired"
    | "Suspended"
    | "Inactive";

  createdAt?: string;
  joinedAt?: string;

  avatar?: string | null;
  avatar_public_id?: string | null;
}

interface TopTeacher {
  id: string;
  name: string;
  students: number;
  paidStudents: number;
  conversion: number;
}

interface RevenueItem {
  month: string;
  value: number;
}

interface StudentGrowthItem {
  month: string;
  value: number;
  newStudents?: number;
}

interface Payment {
  id: string;
  txRef?: string;

  student: string;
  email?: string;

  amount: number;

  plan?: string;

  paymentPurpose?: string;
  subscriptionType?: string;

  paymentMethod?: string;

  status: string;

  date: string;
  paidAt?: string;
}

interface TokenPlan {
  plan: string;
  total: number;
  revenue: number;
}

interface TokenStatus {
  unused: number;
  active: number;
  used: number;
  expired: number;
  revoked: number;
}

interface TokenPurchase {
  id?: string;

  token: string;

  plan: "Monthly" | "Quarterly" | "Yearly" | string;

  amount: number;

  status: string;

  paymentReference?: string | null;

  createdAt: string;

  activatedAt?: string | null;

  expiresAt?: string | null;

  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface DashboardResponse {
  stats: DashboardStats;

  users?: {
    total: number;
    students: number;
    teachers: number;
    admins: number;
    active: number;
    inactive: number;
    suspended: number;
    newThisMonth: number;
    newStudentsThisMonth: number;
    newTeachersThisMonth: number;
  };

  tokens?: {
    total: number;
    unused: number;
    active: number;
    currentlyActive: number;
    used: number;
    expired: number;
    revoked: number;
    currentlyExpired: number;

    statuses: TokenStatus;

    plans: TokenPlan[];
  };

  revenue: {
    total: number;
    tokenRevenue?: number;
    currentMonth?: number;
    previousMonth?: number;
    growth: number;
    data: RevenueItem[];
  };

  recentStudents: RecentStudent[];

  recentPayments: Payment[];

  recentTokenPurchases?: TokenPurchase[];

  formattedTokenPurchases?: TokenPurchase[];

  topTeachers: TopTeacher[];

  studentGrowth: StudentGrowthItem[];
}

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const loading = ref(true);
const refreshing = ref(false);
const errorMessage = ref("");

const dashboard = ref<DashboardResponse>({
  stats: {
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,

    activeUsers: 0,

    totalTokens: 0,
    activeTokens: 0,
    unusedTokens: 0,
    usedTokens: 0,
    expiredTokens: 0,
    revokedTokens: 0,

    activeSubscriptions: 0,

    totalRevenue: 0,
    tokenRevenue: 0,

    changes: {
      students: 0,
      teachers: 0,
      admins: 0,
      revenue: 0,
    },
  },

  users: {
    total: 0,
    students: 0,
    teachers: 0,
    admins: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    newThisMonth: 0,
    newStudentsThisMonth: 0,
    newTeachersThisMonth: 0,
  },

  tokens: {
    total: 0,
    unused: 0,
    active: 0,
    currentlyActive: 0,
    used: 0,
    expired: 0,
    revoked: 0,
    currentlyExpired: 0,

    statuses: {
      unused: 0,
      active: 0,
      used: 0,
      expired: 0,
      revoked: 0,
    },

    plans: [],
  },

  recentStudents: [],
  recentPayments: [],
  recentTokenPurchases: [],
  formattedTokenPurchases: [],
  topTeachers: [],
  studentGrowth: [],

  revenue: {
    total: 0,
    tokenRevenue: 0,
    currentMonth: 0,
    previousMonth: 0,
    growth: 0,
    data: [],
  },
});

/*
|--------------------------------------------------------------------------
| FETCH DASHBOARD
|--------------------------------------------------------------------------
*/

const fetchDashboard = async (showRefresh = false) => {
  if (showRefresh) {
    refreshing.value = true;
  } else {
    loading.value = true;
  }

  errorMessage.value = "";

  try {
    /*
     * Your route is:
     * GET /superadmin/dashboard
     *
     * If your actual route is /super-admin/dashboard,
     * change it here.
     */

    const response = await useApiFetch<{
      success: boolean;
      data: DashboardResponse;
    }>("/superadmin/dashboard");

    console.log(
      "SUPER ADMIN DASHBOARD RESPONSE:",
      response
    );

    if (!response.success) {
      errorMessage.value =
        response.message ||
        "Failed to load dashboard.";

      return;
    }

    if (!response.data?.data) {
      errorMessage.value =
        "Dashboard returned no data.";

      return;
    }

    dashboard.value = response.data.data;
  } catch (error: any) {
    console.error(
      "DASHBOARD FETCH ERROR:",
      error
    );

    errorMessage.value =
      error?.message ||
      "Failed to load dashboard.";
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| STATS CARDS
|--------------------------------------------------------------------------
*/

const stats = computed(() => {
  const data = dashboard.value;

  return [
    {
      label: "Total Users",
      value:
        data.stats.totalUsers.toLocaleString(),

      change: "",

      description: `${data.stats.activeUsers.toLocaleString()} active users`,

      icon: "i-heroicons-users",

      iconClass:
        "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",

      positive: true,
    },

    {
      label: "Total Students",

      value:
        data.stats.totalStudents.toLocaleString(),

      change:
        `${data.stats.changes.students >= 0 ? "+" : ""}${data.stats.changes.students}%`,

      description: "from last month",

      icon:
        "i-heroicons-academic-cap",

      iconClass:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",

      positive:
        data.stats.changes.students >= 0,
    },

    {
      label: "Total Teachers",

      value:
        data.stats.totalTeachers.toLocaleString(),

      change:
        `${data.stats.changes.teachers >= 0 ? "+" : ""}${data.stats.changes.teachers}%`,

      description: "from last month",

      icon:
        "i-heroicons-user-group",

      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

      positive:
        data.stats.changes.teachers >= 0,
    },

    {
      label: "Total Admins",

      value:
        data.stats.totalAdmins.toLocaleString(),

      change:
        `${data.stats.changes.admins >= 0 ? "+" : ""}${data.stats.changes.admins}%`,

      description: "administrators",

      icon:
        "i-heroicons-shield-check",

      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",

      positive:
        data.stats.changes.admins >= 0,
    },

    {
      label: "Total Tokens",

      value:
        data.stats.totalTokens.toLocaleString(),

      change: "",

      description:
        "software tokens generated",

      icon:
        "i-heroicons-key",

      iconClass:
        "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",

      positive: true,
    },

    {
      label: "Active Tokens",

      value:
        data.stats.activeTokens.toLocaleString(),

      change: "",

      description:
        "currently active",

      icon:
        "i-heroicons-check-badge",

      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

      positive: true,
    },

    {
      label: "Unused Tokens",

      value:
        data.stats.unusedTokens.toLocaleString(),

      change: "",

      description:
        "available for activation",

      icon:
        "i-heroicons-ticket",

      iconClass:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",

      positive: true,
    },

    {
      label: "Total Revenue",

      value:
        formatCompactCurrency(
          data.stats.totalRevenue
        ),

      change:
        data.revenue.growth !== 0
          ? `${data.revenue.growth >= 0 ? "+" : ""}${data.revenue.growth}%`
          : "",

      description:
        "verified platform revenue",

      icon:
        "i-heroicons-banknotes",

      iconClass:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",

      positive:
        data.revenue.growth >= 0,
    },
  ];
});

/*
|--------------------------------------------------------------------------
| DATA
|--------------------------------------------------------------------------
*/

const revenueData = computed(
  () =>
    dashboard.value.revenue?.data || []
);

const studentGrowth = computed(
  () =>
    dashboard.value.studentGrowth || []
);

const recentStudents = computed(
  () =>
    dashboard.value.recentStudents || []
);

const recentPayments = computed(
  () =>
    dashboard.value.recentPayments || []
);

const topTeachers = computed(
  () =>
    dashboard.value.topTeachers || []
);

const tokenPurchases = computed(
  () =>
    dashboard.value
      .formattedTokenPurchases ||
    dashboard.value.recentTokenPurchases ||
    []
);

const tokenPlans = computed(
  () =>
    dashboard.value.tokens?.plans || []
);

const tokenStatuses = computed(
  () =>
    dashboard.value.tokens?.statuses || {
      unused: 0,
      active: 0,
      used: 0,
      expired: 0,
      revoked: 0,
    }
);

/*
|--------------------------------------------------------------------------
| CHART MAXIMUMS
|--------------------------------------------------------------------------
*/

const revenueMax = computed(() => {
  if (!revenueData.value.length) {
    return 1;
  }

  return Math.max(
    ...revenueData.value.map(
      (item) => item.value
    ),
    1
  );
});

const growthMax = computed(() => {
  if (!studentGrowth.value.length) {
    return 1;
  }

  return Math.max(
    ...studentGrowth.value.map(
      (item) => item.value
    ),
    1
  );
});

/*
|--------------------------------------------------------------------------
| FORMATTING
|--------------------------------------------------------------------------
*/

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(value);
};

const formatCompactCurrency = (
  value: number
) => {
  if (value >= 1000000000) {
    return `₦${(
      value / 1000000000
    ).toFixed(1)}B`;
  }

  if (value >= 1000000) {
    return `₦${(
      value / 1000000
    ).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `₦${Math.round(
      value / 1000
    )}K`;
  }

  return `₦${Math.round(value)}`;
};

const initials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0)
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

/*
|--------------------------------------------------------------------------
| DATE FORMAT
|--------------------------------------------------------------------------
*/

const formatDate = (
  date?: string | null
) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(parsed);
};

/*
|--------------------------------------------------------------------------
| AVATAR
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

const avatarColor = (name = "") => {
  if (!name) {
    return avatarColors[0];
  }

  const index =
    name.charCodeAt(0) %
    avatarColors.length;

  return avatarColors[index];
};

/*
|--------------------------------------------------------------------------
| STUDENT STATUS
|--------------------------------------------------------------------------
*/

const studentStatusClass = (
  status: RecentStudent["status"]
) => {
  const styles = {
    Active:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    Pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    Expired:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

    Suspended:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

    Inactive:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    styles[status] ||
    styles.Inactive
  );
};

/*
|--------------------------------------------------------------------------
| PAYMENT STATUS
|--------------------------------------------------------------------------
*/

const paymentStatusClass = (
  status: string
) => {
  const normalized =
    status.toLowerCase();

  if (
    normalized === "success" ||
    normalized === "successful"
  ) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
  }

  if (
    normalized === "pending" ||
    normalized === "processing"
  ) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
  }

  return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
};

/*
|--------------------------------------------------------------------------
| TOKEN STATUS
|--------------------------------------------------------------------------
*/

const tokenStatusClass = (
  status: string
) => {
  const styles: Record<
    string,
    string
  > = {
    unused:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    active:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    used:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

    expired:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

    revoked:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    styles[status.toLowerCase()] ||
    styles.revoked
  );
};

/*
|--------------------------------------------------------------------------
| TOKEN STATUS LABEL
|--------------------------------------------------------------------------
*/

const tokenStatusLabel = (
  status: string
) => {
  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
};

/*
|--------------------------------------------------------------------------
| TEACHER CONVERSION
|--------------------------------------------------------------------------
*/

const teacherConversion = (
  teacher: TopTeacher
) => {
  if (
    typeof teacher.conversion ===
    "number"
  ) {
    return Math.round(
      teacher.conversion
    );
  }

  if (!teacher.students) {
    return 0;
  }

  return Math.round(
    (teacher.paidStudents /
      teacher.students) *
      100
  );
};

/*
|--------------------------------------------------------------------------
| TOKEN PLAN ICON
|--------------------------------------------------------------------------
*/

const planIcon = (plan: string) => {
  if (plan === "Monthly") {
    return "i-heroicons-calendar";
  }

  if (plan === "Quarterly") {
    return "i-heroicons-calendar-days";
  }

  if (plan === "Yearly") {
    return "i-heroicons-star";
  }

  return "i-heroicons-cube";
};

/*
|--------------------------------------------------------------------------
| REFRESH
|--------------------------------------------------------------------------
*/

const refreshDashboard = () => {
  fetchDashboard(true);
};

/*
|--------------------------------------------------------------------------
| INITIAL LOAD
|--------------------------------------------------------------------------
*/

onMounted(() => {
  fetchDashboard();
});
</script>

<template>
  <div class="space-y-6 pb-8">

    <!-- ========================================================= -->
    <!-- HEADER -->
    <!-- ========================================================= -->

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div class="flex items-center gap-2">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900"
          >
            <Icon
              name="i-heroicons-squares-2x2"
              class="h-5 w-5"
            />
          </div>

          <h1
            class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Super Admin Dashboard
          </h1>
        </div>

        <p
          class="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          Overview of users, software tokens,
          payments and platform revenue.
        </p>
      </div>

      <div class="flex items-center gap-2">

        <NuxtLink
          to="/super-admin/reports"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Icon
            name="i-heroicons-chart-bar-square"
            class="h-4 w-4"
          />

          Reports
        </NuxtLink>

        <button
          type="button"
          :disabled="refreshing"
          @click="refreshDashboard"
          class="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Icon
            name="i-heroicons-arrow-path"
            class="h-4 w-4"
            :class="{
              'animate-spin': refreshing,
            }"
          />

          {{
            refreshing
              ? "Refreshing..."
              : "Refresh"
          }}
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- ERROR -->
    <!-- ========================================================= -->

    <div
      v-if="errorMessage"
      class="flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-500/10 dark:text-rose-400"
    >
      <div class="flex items-center gap-3">
        <Icon
          name="i-heroicons-exclamation-triangle"
          class="h-5 w-5"
        />

        <span>{{ errorMessage }}</span>
      </div>

      <button
        type="button"
        @click="fetchDashboard()"
        class="font-semibold underline"
      >
        Retry
      </button>
    </div>

    <!-- ========================================================= -->
    <!-- MAIN STATS -->
    <!-- ========================================================= -->

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-start justify-between gap-3"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl"
            :class="stat.iconClass"
          >
            <Icon
              :name="stat.icon"
              class="h-5 w-5"
            />
          </div>

          <span
            v-if="stat.change"
            class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium"
            :class="
              stat.positive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
            "
          >
            <Icon
              :name="
                stat.positive
                  ? 'i-heroicons-arrow-trending-up'
                  : 'i-heroicons-arrow-trending-down'
              "
              class="h-3 w-3"
            />

            {{ stat.change }}
          </span>
        </div>

        <div class="mt-4">
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            {{ stat.label }}
          </p>

          <p
            class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"
          >
            {{ stat.value }}
          </p>

          <p
            class="mt-1 text-xs text-gray-400"
          >
            {{ stat.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TOKEN OVERVIEW -->
    <!-- ========================================================= -->

    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="border-b border-gray-100 px-5 py-4 dark:border-gray-800"
      >
        <div
          class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Software Token Overview
            </h2>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              Current state of all software tokens
              in your platform.
            </p>
          </div>

          <NuxtLink
            to="/super-admin/tokens"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Manage tokens
          </NuxtLink>
        </div>
      </div>

      <div
        class="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-5 sm:divide-y-0 dark:divide-gray-800"
      >
        <!-- UNUSED -->

        <div class="p-5">
          <div
            class="flex items-center gap-2"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10"
            >
              <Icon
                name="i-heroicons-ticket"
                class="h-4 w-4 text-amber-600 dark:text-amber-400"
              />
            </div>

            <span
              class="text-xs text-gray-400"
            >
              Unused
            </span>
          </div>

          <p
            class="mt-3 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ tokenStatuses.unused.toLocaleString() }}
          </p>

          <p class="mt-1 text-[11px] text-gray-400">
            Available
          </p>
        </div>

        <!-- ACTIVE -->

        <div class="p-5">
          <div
            class="flex items-center gap-2"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10"
            >
              <Icon
                name="i-heroicons-check-badge"
                class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <span
              class="text-xs text-gray-400"
            >
              Active
            </span>
          </div>

          <p
            class="mt-3 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ tokenStatuses.active.toLocaleString() }}
          </p>

          <p class="mt-1 text-[11px] text-gray-400">
            Activated
          </p>
        </div>

        <!-- USED -->

        <div class="p-5">
          <div
            class="flex items-center gap-2"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10"
            >
              <Icon
                name="i-heroicons-check"
                class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <span
              class="text-xs text-gray-400"
            >
              Used
            </span>
          </div>

          <p
            class="mt-3 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ tokenStatuses.used.toLocaleString() }}
          </p>

          <p class="mt-1 text-[11px] text-gray-400">
            Completed
          </p>
        </div>

        <!-- EXPIRED -->

        <div class="p-5">
          <div
            class="flex items-center gap-2"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10"
            >
              <Icon
                name="i-heroicons-clock"
                class="h-4 w-4 text-rose-600 dark:text-rose-400"
              />
            </div>

            <span
              class="text-xs text-gray-400"
            >
              Expired
            </span>
          </div>

          <p
            class="mt-3 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ tokenStatuses.expired.toLocaleString() }}
          </p>

          <p class="mt-1 text-[11px] text-gray-400">
            No longer active
          </p>
        </div>

        <!-- REVOKED -->

        <div class="p-5">
          <div
            class="flex items-center gap-2"
          >
            <div
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <Icon
                name="i-heroicons-no-symbol"
                class="h-4 w-4 text-gray-500"
              />
            </div>

            <span
              class="text-xs text-gray-400"
            >
              Revoked
            </span>
          </div>

          <p
            class="mt-3 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ tokenStatuses.revoked.toLocaleString() }}
          </p>

          <p class="mt-1 text-[11px] text-gray-400">
            Disabled
          </p>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- REVENUE + STUDENT GROWTH -->
    <!-- ========================================================= -->

    <div
      class="grid grid-cols-1 gap-6 xl:grid-cols-2"
    >

      <!-- REVENUE -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Revenue Overview
            </h2>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              Verified revenue generated over the
              last 7 months
            </p>
          </div>

          <div class="text-right">
            <p
              class="text-xl font-bold text-gray-900 dark:text-white"
            >
              {{
                formatCompactCurrency(
                  dashboard.revenue.total
                )
              }}
            </p>

            <p
              class="text-xs"
              :class="
                dashboard.revenue.growth >= 0
                  ? 'text-emerald-500'
                  : 'text-rose-500'
              "
            >
              {{
                dashboard.revenue.growth >= 0
                  ? "+"
                  : ""
              }}{{ dashboard.revenue.growth }}%
            </p>
          </div>
        </div>

        <div
          class="mt-6 flex h-64 items-end gap-3 sm:gap-5"
        >
          <div
            v-for="item in revenueData"
            :key="item.month"
            class="flex h-full flex-1 flex-col justify-end"
          >
            <div
              class="mb-2 text-center text-[10px] text-gray-400"
            >
              {{ formatCompactCurrency(item.value) }}
            </div>

            <div
              class="w-full rounded-t-lg bg-indigo-500 transition-all hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              :style="{
                height: `${Math.max(
                  (item.value / revenueMax) * 75,
                  item.value > 0 ? 8 : 2
                )}%`,
              }"
            ></div>

            <div
              class="mt-2 text-center text-xs text-gray-400"
            >
              {{ item.month }}
            </div>
          </div>

          <div
            v-if="!revenueData.length"
            class="flex h-full w-full items-center justify-center text-sm text-gray-400"
          >
            No revenue data yet.
          </div>
        </div>
      </div>

      <!-- STUDENT GROWTH -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Student Growth
            </h2>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              New students registered each month
            </p>
          </div>

          <div class="text-right">
            <p
              class="text-xl font-bold text-gray-900 dark:text-white"
            >
              {{
                dashboard.stats.totalStudents.toLocaleString()
              }}
            </p>

            <p
              class="text-xs text-emerald-500"
            >
              Total students
            </p>
          </div>
        </div>

        <div
          class="mt-6 flex h-64 items-end gap-3 sm:gap-5"
        >
          <div
            v-for="item in studentGrowth"
            :key="item.month"
            class="flex h-full flex-1 flex-col justify-end"
          >
            <div
              class="mb-2 text-center text-[10px] text-gray-400"
            >
              {{ item.value }}
            </div>

            <div
              class="w-full rounded-t-lg bg-emerald-500 transition-all hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              :style="{
                height: `${Math.max(
                  (item.value / growthMax) * 75,
                  item.value > 0 ? 8 : 2
                )}%`,
              }"
            ></div>

            <div
              class="mt-2 text-center text-xs text-gray-400"
            >
              {{ item.month }}
            </div>
          </div>

          <div
            v-if="!studentGrowth.length"
            class="flex h-full w-full items-center justify-center text-sm text-gray-400"
          >
            No student data yet.
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TOKEN PLANS + RECENT TOKEN PURCHASES -->
    <!-- ========================================================= -->

    <div
      class="grid grid-cols-1 gap-6 xl:grid-cols-3"
    >

      <!-- PLAN BREAKDOWN -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div>
          <h2
            class="font-semibold text-gray-900 dark:text-white"
          >
            Token Plans
          </h2>

          <p
            class="mt-1 text-xs text-gray-400"
          >
            Token sales by subscription plan
          </p>
        </div>

        <div
          class="mt-5 space-y-4"
        >
          <div
            v-for="plan in tokenPlans"
            :key="plan.plan"
          >
            <div
              class="flex items-center justify-between gap-3"
            >
              <div
                class="flex items-center gap-3"
              >
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10"
                >
                  <Icon
                    :name="planIcon(plan.plan)"
                    class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div>
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ plan.plan }}
                  </p>

                  <p
                    class="text-xs text-gray-400"
                  >
                    {{ plan.total }} tokens
                  </p>
                </div>
              </div>

              <p
                class="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {{ formatCurrency(plan.revenue) }}
              </p>
            </div>
          </div>

          <div
            v-if="!tokenPlans.length"
            class="py-8 text-center text-sm text-gray-400"
          >
            No token sales yet.
          </div>
        </div>
      </div>

      <!-- RECENT TOKEN PURCHASES -->

      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm xl:col-span-2 dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Recent Token Activity
            </h2>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              Latest software token purchases
            </p>
          </div>

          <NuxtLink
            to="/super-admin/tokens"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View all
          </NuxtLink>
        </div>

        <div
          class="divide-y divide-gray-100 dark:divide-gray-800"
        >
          <div
            v-for="token in tokenPurchases.slice(0, 5)"
            :key="token.id || token.token"
            class="flex items-center justify-between gap-4 px-5 py-4"
          >
            <div
              class="flex min-w-0 items-center gap-3"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-500/10"
              >
                <Icon
                  name="i-heroicons-key"
                  class="h-5 w-5 text-cyan-600 dark:text-cyan-400"
                />
              </div>

              <div class="min-w-0">
                <p
                  class="truncate font-mono text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ token.token }}
                </p>

                <p
                  class="mt-0.5 text-xs text-gray-400"
                >
                  {{ token.plan }}
                  ·
                  {{ formatDate(token.createdAt) }}
                </p>
              </div>
            </div>

            <div
              class="shrink-0 text-right"
            >
              <p
                class="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {{ formatCurrency(token.amount) }}
              </p>

              <span
                class="mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-medium"
                :class="
                  tokenStatusClass(
                    token.status
                  )
                "
              >
                {{
                  tokenStatusLabel(
                    token.status
                  )
                }}
              </span>
            </div>
          </div>

          <div
            v-if="!tokenPurchases.length"
            class="px-5 py-10 text-center text-sm text-gray-400"
          >
            No token purchases yet.
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- RECENT STUDENTS + PAYMENTS -->
    <!-- ========================================================= -->

    <div
      class="grid grid-cols-1 gap-6 xl:grid-cols-2"
    >

      <!-- RECENT STUDENTS -->

      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Recent Students
            </h2>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              Recently registered students
            </p>
          </div>

          <NuxtLink
            to="/super-admin/students"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View all
          </NuxtLink>
        </div>

        <div
          class="divide-y divide-gray-100 dark:divide-gray-800"
        >
          <div
            v-for="student in recentStudents"
            :key="
              student.id ||
              student._id ||
              student.email
            "
            class="flex items-center justify-between gap-3 px-5 py-4"
          >
            <div
              class="flex min-w-0 items-center gap-3"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                
              >
                {{
                  initials(
                    student.name ||
                      `${student.firstName || ""} ${student.lastName || ""}`
                  )
                }}
              </div>

              <div class="min-w-0">
                <p
                  class="truncate text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{
                    student.name ||
                    `${student.firstName || ""} ${student.lastName || ""}`
                  }}
                </p>

                <p
                  class="mt-0.5 truncate text-xs text-gray-400"
                >
                  {{ student.email }}
                </p>
              </div>
            </div>

            <div
              class="shrink-0 text-right"
            >
              <span
                class="inline-flex rounded-full px-2 py-1 text-[10px] font-medium"
                :class="
                  studentStatusClass(
                    student.status
                  )
                "
              >
                {{ student.status }}
              </span>

              <p
                class="mt-1 text-[10px] text-gray-400"
              >
                {{
                  formatDate(
                    student.joinedAt ||
                      student.createdAt
                  )
                }}
              </p>
            </div>
          </div>

          <div
            v-if="!recentStudents.length"
            class="px-5 py-10 text-center text-sm text-gray-400"
          >
            No students yet.
          </div>
        </div>
      </div>

      <!-- RECENT PAYMENTS -->

      <div
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Recent Payments
            </h2>

            <p
              class="mt-1 text-xs text-gray-400"
            >
              Latest verified successful payments
            </p>
          </div>

          <NuxtLink
            to="/super-admin/payments"
            class="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View all
          </NuxtLink>
        </div>

        <div
          class="divide-y divide-gray-100 dark:divide-gray-800"
        >
          <div
            v-for="payment in recentPayments.slice(
              0,
              5
            )"
            :key="payment.id"
            class="flex items-center justify-between gap-3 px-5 py-4"
          >
            <div
              class="flex min-w-0 items-center gap-3"
            >
              <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
              >
                <Icon
                  name="i-heroicons-banknotes"
                  class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div class="min-w-0">
                <p
                  class="truncate text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ payment.student }}
                </p>

                <p
                  class="mt-0.5 truncate text-xs text-gray-400"
                >
                  {{
                    payment.plan ||
                    payment.paymentPurpose ||
                    "Payment"
                  }}

                  ·

                  {{
                    formatDate(
                      payment.date
                    )
                  }}
                </p>
              </div>
            </div>

            <div
              class="shrink-0 text-right"
            >
              <p
                class="text-sm font-semibold text-gray-900 dark:text-white"
              >
                {{
                  formatCurrency(
                    payment.amount
                  )
                }}
              </p>

              <span
                class="mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-medium"
                :class="
                  paymentStatusClass(
                    payment.status
                  )
                "
              >
                {{ payment.status }}
              </span>
            </div>
          </div>

          <div
            v-if="!recentPayments.length"
            class="px-5 py-10 text-center text-sm text-gray-400"
          >
            No payments yet.
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- TOP TEACHERS -->
    <!-- ========================================================= -->

    <div
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"
      >
        <div>
          <h2
            class="font-semibold text-gray-900 dark:text-white"
          >
            Top Teachers
          </h2>

          <p
            class="mt-1 text-xs text-gray-400"
          >
            Teachers with the highest student
            activity
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

      <div
        class="hidden overflow-x-auto md:block"
      >
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

          <tbody
            class="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <tr
              v-for="teacher in topTeachers"
              :key="teacher.id"
              class="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/30"
            >
              <td class="px-5 py-4">
                <div
                  class="flex items-center gap-3"
                >
                  <div
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    {{
                      initials(
                        teacher.name
                      )
                    }}
                  </div>

                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ teacher.name }}
                  </span>
                </div>
              </td>

              <td
                class="px-5 py-4 text-sm text-gray-600 dark:text-gray-300"
              >
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
                <div
                  class="flex min-w-[150px] items-center gap-3"
                >
                  <div
                    class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    <div
                      class="h-full rounded-full bg-emerald-500"
                      :style="{
                        width: `${teacherConversion(
                          teacher
                        )}%`,
                      }"
                    ></div>
                  </div>

                  <span
                    class="w-10 text-xs text-gray-400"
                  >
                    {{
                      teacherConversion(
                        teacher
                      )
                    }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="!topTeachers.length"
          class="px-5 py-10 text-center text-sm text-gray-400"
        >
          No teacher activity yet.
        </div>
      </div>

      <!-- Mobile -->

      <div
        class="divide-y divide-gray-100 dark:divide-gray-800 md:hidden"
      >
        <div
          v-for="teacher in topTeachers"
          :key="teacher.id"
          class="px-5 py-4"
        >
          <div
            class="flex items-center justify-between gap-3"
          >
            <div
              class="flex items-center gap-3"
            >
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
              >
                {{
                  initials(
                    teacher.name
                  )
                }}
              </div>

              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ teacher.name }}
                </p>

                <p
                  class="mt-0.5 text-xs text-gray-400"
                >
                  {{ teacher.students }}
                  students
                </p>
              </div>
            </div>

            <span
              class="text-sm font-semibold text-emerald-600 dark:text-emerald-400"
            >
              {{ teacher.paidStudents }}
              paid
            </span>
          </div>

          <div
            class="mt-3 flex items-center gap-3"
          >
            <div
              class="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <div
                class="h-full rounded-full bg-emerald-500"
                :style="{
                  width: `${teacherConversion(
                    teacher
                  )}%`,
                }"
              ></div>
            </div>

            <span
              class="text-xs text-gray-400"
            >
              {{
                teacherConversion(
                  teacher
                )
              }}%
            </span>
          </div>
        </div>

        <div
          v-if="!topTeachers.length"
          class="px-5 py-10 text-center text-sm text-gray-400"
        >
          No teacher activity yet.
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- QUICK ACCESS -->
    <!-- ========================================================= -->

    <div>
      <h2
        class="mb-4 text-sm font-semibold text-gray-900 dark:text-white"
      >
        Quick Access
      </h2>

      <div
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >

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

          <p
            class="mt-3 text-sm font-medium text-gray-900 dark:text-white"
          >
            Admins
          </p>
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

          <p
            class="mt-3 text-sm font-medium text-gray-900 dark:text-white"
          >
            Teachers
          </p>
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

          <p
            class="mt-3 text-sm font-medium text-gray-900 dark:text-white"
          >
            Students
          </p>
        </NuxtLink>

        <NuxtLink
          to="/super-admin/tokens"
          class="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-500/10"
          >
            <Icon
              name="i-heroicons-key"
              class="h-5 w-5 text-cyan-600 dark:text-cyan-400"
            />
          </div>

          <p
            class="mt-3 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tokens
          </p>
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

          <p
            class="mt-3 text-sm font-medium text-gray-900 dark:text-white"
          >
            Payments
          </p>
        </NuxtLink>

        <NuxtLink
          to="/super-admin/reports"
          class="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/30"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10"
          >
            <Icon
              name="i-heroicons-chart-bar-square"
              class="h-5 w-5 text-rose-600 dark:text-rose-400"
            />
          </div>

          <p
            class="mt-3 text-sm font-medium text-gray-900 dark:text-white"
          >
            Reports
          </p>
        </NuxtLink>

      </div>
    </div>
  </div>
</template>

