<script setup lang="ts">

definePageMeta({
  layout: "nav",
});


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

interface Wallet {
  id: string;
  owner: string;
  email: string;
  type: "Admin" | "Teacher" | "Platform";
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalRefunded: number;
  status: "Active" | "Suspended" | "Locked" | "Closed";
  updatedAt: string;
  createdAt?: string;
}

interface WalletApiResponse {
  success: boolean;
  message?: string;
  wallets: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface WalletStatistics {
  totalWallets: number;
  activeWallets: number;
  suspendedWallets: number;
  lockedWallets: number;
  closedWallets: number;
  totalBalance: number;
  totalPendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalRefunded: number;

  byType?: Record<
    string,
    {
      count: number;
      balance: number;
      pendingBalance: number;
      totalEarned: number;
      totalWithdrawn: number;
    }
  >;
}

interface WalletStatisticsResponse {
  success: boolean;
  message?: string;
  statistics: WalletStatistics;
}


/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const wallets = ref<Wallet[]>([]);

const loading = ref(false);

const statisticsLoading = ref(false);

const errorMessage = ref("");

const selectedType = ref<
  "All Types" | "Admin" | "Teacher" | "Platform"
>("All Types");

const selectedStatus = ref<
  "All Status" | "Active" | "Suspended" | "Locked" | "Closed"
>("All Status");

const currentPage = ref(1);

const pageLimit = ref(20);

const totalPages = ref(1);

const totalWallets = ref(0);

function fromKobo(amount: unknown): number {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return value / 100;
}
/*
|--------------------------------------------------------------------------
| Filter Options
|--------------------------------------------------------------------------
*/

const types = [
  "All Types",
  "Admin",
  "Teacher",
  "Platform",
];

const statuses = [
  "All Status",
  "Active",
  "Suspended",
  "Locked",
  "Closed",
];


/*
|--------------------------------------------------------------------------
| Statistics State
|--------------------------------------------------------------------------
*/

const statistics = ref<WalletStatistics>({
  totalWallets: 0,
  activeWallets: 0,
  suspendedWallets: 0,
  lockedWallets: 0,
  closedWallets: 0,
  totalBalance: 0,
  totalPendingBalance: 0,
  totalEarned: 0,
  totalWithdrawn: 0,
  totalRefunded: 0,
  byType: {},
});


/*
|--------------------------------------------------------------------------
| Columns
|--------------------------------------------------------------------------
*/

const columns = [
  {
    key: "owner",
    label: "Wallet Owner",
  },

  {
    key: "type",
    label: "Type",
  },

  {
    key: "balance",
    label: "Balance",
  },

  {
    key: "totalEarned",
    label: "Total Earned",
  },

  {
    key: "totalWithdrawn",
    label: "Withdrawn",
  },

  {
    key: "status",
    label: "Status",
  },
];


/*
|--------------------------------------------------------------------------
| Filtered Wallets
|--------------------------------------------------------------------------
*/

const filteredWallets = computed(() => {
  return wallets.value.filter((wallet) => {

    const typeMatch =
      selectedType.value === "All Types" ||
      wallet.type === selectedType.value;

    const statusMatch =
      selectedStatus.value === "All Status" ||
      wallet.status === selectedStatus.value;

    return typeMatch && statusMatch;
  });
});


/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

const totalBalance = computed(() => {
  return statistics.value.totalBalance;
});

const totalEarned = computed(() => {
  return statistics.value.totalEarned;
});

const totalWithdrawn = computed(() => {
  return statistics.value.totalWithdrawn;
});

const activeWallets = computed(() => {
  return statistics.value.activeWallets;
});

const suspendedWallets = computed(() => {
  return statistics.value.suspendedWallets;
});


/*
|--------------------------------------------------------------------------
| Statistics Cards
|--------------------------------------------------------------------------
*/

const stats = computed(() => [
  {
    label: "Total Balance",
    value: formatCurrency(totalBalance.value),
    icon: "i-heroicons-wallet",
    color: "indigo" as const,
  },

  {
    label: "Total Earned",
    value: formatCurrency(totalEarned.value),
    icon: "i-heroicons-arrow-trending-up",
    color: "green" as const,
  },

  {
    label: "Total Withdrawn",
    value: formatCurrency(totalWithdrawn.value),
    icon: "i-heroicons-arrow-trending-down",
    color: "amber" as const,
  },

  {
    label: "Active Wallets",
    value: activeWallets.value,
    icon: "i-heroicons-check-circle",
    color: "blue" as const,
  },
]);


/*
|--------------------------------------------------------------------------
| Wallet Type Styles
|--------------------------------------------------------------------------
*/

const walletTypeStyles: Record<string, string> = {
  Admin:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

  Teacher:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Platform:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
};


/*
|--------------------------------------------------------------------------
| Status Styles
|--------------------------------------------------------------------------
*/

const statusStyles: Record<string, string> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Suspended:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  Locked:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Closed:
    "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
};


/*
|--------------------------------------------------------------------------
| Avatar Colors
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


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function initials(name: string) {
  if (!name) {
    return "??";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


function avatarColor(name: string) {
  if (!name) {
    return avatarColors[0];
  }

  const sum = name
    .split("")
    .reduce(
      (acc, character) =>
        acc + character.charCodeAt(0),
      0
    );

  return avatarColors[
    sum % avatarColors.length
  ];
}


function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}


function formatCompactCurrency(amount: number) {
  amount = Number(amount || 0);

  if (amount >= 1_000_000) {
    return `₦${(
      amount / 1_000_000
    ).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `₦${(
      amount / 1_000
    ).toFixed(1)}K`;
  }

  return `₦${amount}`;
}


function formatDate(date: string) {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(parsed);
}


function walletTypeIcon(
  type: Wallet["type"]
) {
  if (type === "Admin") {
    return "i-heroicons-shield-check";
  }

  if (type === "Teacher") {
    return "i-heroicons-academic-cap";
  }

  return "i-heroicons-building-office-2";
}


function walletTypeIconColor(
  type: Wallet["type"]
) {
  if (type === "Admin") {
    return "text-indigo-500";
  }

  if (type === "Teacher") {
    return "text-emerald-500";
  }

  return "text-violet-500";
}


function balancePercentage(
  wallet: Wallet
) {
  if (!wallet.totalEarned) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (wallet.balance /
        wallet.totalEarned) *
        100
    )
  );
}


/*
|--------------------------------------------------------------------------
| Normalize Backend Wallet
|--------------------------------------------------------------------------
*/
function normalizeWallet(wallet: any): Wallet {
  let type: Wallet["type"] = "Admin";

  if (
    wallet.type === "Teacher" ||
    wallet.ownerType === "TEACHER"
  ) {
    type = "Teacher";
  }

  if (
    wallet.type === "Platform" ||
    wallet.ownerType === "PLATFORM"
  ) {
    type = "Platform";
  }

  let status: Wallet["status"] = "Active";

  const backendStatus = String(
    wallet.status || ""
  ).toUpperCase();

  if (backendStatus === "SUSPENDED") {
    status = "Suspended";
  }

  if (backendStatus === "LOCKED") {
    status = "Locked";
  }

  if (backendStatus === "CLOSED") {
    status = "Closed";
  }

  /*
  |--------------------------------------------------------------------------
  | Owner
  |--------------------------------------------------------------------------
  */

  let ownerName = "Unknown User";
  let ownerEmail = wallet.email || "";

  if (
    wallet.owner &&
    typeof wallet.owner === "object"
  ) {
    ownerName = [
      wallet.owner.firstName,
      wallet.owner.middleName,
      wallet.owner.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    if (!ownerName) {
      ownerName =
        wallet.owner.name ||
        wallet.owner.email ||
        "Unknown User";
    }

    ownerEmail =
      wallet.owner.email ||
      ownerEmail;
  } else if (
    typeof wallet.owner === "string"
  ) {
    ownerName = wallet.owner;
  }

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  | Backend wallet amounts are Kobo.
  | Convert them to Naira here.
  |--------------------------------------------------------------------------
  */

  const balance = fromKobo(
    wallet.availableBalance ??
      wallet.balance ??
      0
  );

  const pendingBalance = fromKobo(
    wallet.pendingBalance
  );

  const totalEarned = fromKobo(
    wallet.totalEarned
  );

  const totalWithdrawn = fromKobo(
    wallet.totalWithdrawn
  );

  const totalRefunded = fromKobo(
    wallet.totalRefunded
  );

  return {
    id: String(
      wallet.id ||
        wallet._id ||
        ""
    ),

    owner: ownerName,

    email: ownerEmail,

    type,

    balance,

    pendingBalance,

    totalEarned,

    totalWithdrawn,

    totalRefunded,

    status,

    updatedAt: formatDate(
      wallet.updatedAt
    ),

    createdAt:
      wallet.createdAt,
  };
}


/*
|--------------------------------------------------------------------------
| Load Wallets
|--------------------------------------------------------------------------
*/

async function fetchWallets() {

  loading.value = true;

  errorMessage.value = "";


  try {

    /*
     * Query parameters sent to backend
     */

    const query: Record<
      string,
      string | number
    > = {

      page:
        currentPage.value,

      limit:
        pageLimit.value,
    };


    /*
     * Type Filter
     */

    if (
      selectedType.value !==
      "All Types"
    ) {

      if (
        selectedType.value ===
        "Admin"
      ) {
        query.ownerType =
          "ADMIN";
      }

      if (
        selectedType.value ===
        "Teacher"
      ) {
        query.ownerType =
          "TEACHER";
      }

      if (
        selectedType.value ===
        "Platform"
      ) {
        query.ownerType =
          "PLATFORM";
      }
    }


    /*
     * Status Filter
     */

    if (
      selectedStatus.value !==
      "All Status"
    ) {

      query.status =
        selectedStatus.value.toUpperCase();
    }


    /*
     * ==========================================================
     * IMPORTANT
     * ==========================================================
     *
     * USE useApiFetch HERE
     *
     * NOT $fetch
     */

    const result =
      await useApiFetch<WalletApiResponse>(
        "/superadmin/wallets",
        {
          method: "GET",
          query,
        }
      );


    console.log(
      "💰 Wallet API result:",
      result
    );


    /*
     * Error handled by useApiFetch
     */

    if (!result.success) {

      throw new Error(
        result.message ||
          "Failed to retrieve wallets"
      );
    }


    /*
     * The actual backend response
     * is inside result.data
     */

    const response =
      result.data;


    /*
     * Backend returned success:false
     */

    if (
      !response ||
      !response.success
    ) {

      throw new Error(
        response?.message ||
          "Failed to retrieve wallets"
      );
    }


    /*
     * Normalize wallets
     */

    wallets.value =
      (
        response.wallets ||
        []
      ).map(
        normalizeWallet
      );


    /*
     * Pagination
     */

    totalWallets.value =
      Number(
        response.pagination?.total
      ) ||
      wallets.value.length;


    totalPages.value =
      Number(
        response.pagination?.pages
      ) || 1;


  } catch (
    error: any
  ) {

    console.error(
      "🔥 Fetch wallets error:",
      error
    );


    errorMessage.value =
      error?.message ||
      "Failed to load wallets.";


    wallets.value = [];


  } finally {

    loading.value = false;
  }
}


/*
|--------------------------------------------------------------------------
| Load Wallet Statistics
|--------------------------------------------------------------------------
*/

async function fetchWalletStatistics() {

  statisticsLoading.value =
    true;


  try {

    /*
     * USE useApiFetch
     */

    const result =
      await useApiFetch<WalletStatisticsResponse>(
        "/superadmin/wallets/statistics",
        {
          method: "GET",
        }
      );


    console.log(
      "📊 Wallet statistics result:",
      result
    );


    /*
     * Error from useApiFetch
     */

    if (!result.success) {

      throw new Error(
        result.message ||
          "Failed to retrieve wallet statistics"
      );
    }


    /*
     * Actual backend response
     */

    const response =
      result.data;


    /*
     * Backend error
     */

    if (
      !response ||
      !response.success
    ) {

      throw new Error(
        response?.message ||
          "Failed to retrieve wallet statistics"
      );
    }


    /*
     * Statistics
     */

    const data =
      response.statistics;


    /*
     * Normalize statistics
     */

statistics.value = {
  totalWallets:
    Number(data?.totalWallets) || 0,

  activeWallets:
    Number(data?.activeWallets) || 0,

  suspendedWallets:
    Number(data?.suspendedWallets) || 0,

  lockedWallets:
    Number(data?.lockedWallets) || 0,

  closedWallets:
    Number(data?.closedWallets) || 0,

  /*
  |--------------------------------------------------------------------------
  | Kobo -> Naira
  |--------------------------------------------------------------------------
  */

  totalBalance:
    fromKobo(data?.totalBalance),

  totalPendingBalance:
    fromKobo(data?.totalPendingBalance),

  totalEarned:
    fromKobo(data?.totalEarned),

  totalWithdrawn:
    fromKobo(data?.totalWithdrawn),

  totalRefunded:
    fromKobo(data?.totalRefunded),

  byType: Object.fromEntries(
    Object.entries(
      data?.byType || {}
    ).map(([type, value]: [string, any]) => [
      type,
      {
        count:
          Number(value?.count) || 0,

        balance:
          fromKobo(value?.balance),

        pendingBalance:
          fromKobo(
            value?.pendingBalance
          ),

        totalEarned:
          fromKobo(
            value?.totalEarned
          ),

        totalWithdrawn:
          fromKobo(
            value?.totalWithdrawn
          ),
      },
    ])
  ),
};


  } catch (
    error: any
  ) {

    console.error(
      "🔥 Fetch wallet statistics error:",
      error
    );

  } finally {

    statisticsLoading.value =
      false;
  }
}


/*
|--------------------------------------------------------------------------
| Refresh
|--------------------------------------------------------------------------
*/

async function refreshWallets() {

  await Promise.all([
    fetchWallets(),
    fetchWalletStatistics(),
  ]);
}


/*
|--------------------------------------------------------------------------
| Filter Changes
|--------------------------------------------------------------------------
*/

watch(
  [
    selectedType,
    selectedStatus,
  ],

  async () => {

    currentPage.value = 1;

    await fetchWallets();
  }
);


/*
|--------------------------------------------------------------------------
| Initial Load
|--------------------------------------------------------------------------
*/

onMounted(async () => {

  await refreshWallets();

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

        <div class="flex items-center gap-2">

          <div
            class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-wallet"
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />

          </div>

          <h1
            class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
          >
            Wallets
          </h1>

        </div>

        <p
          class="text-sm text-gray-400 mt-1"
        >
          Manage admin, teacher and referral agent wallets
        </p>

      </div>


      <div
        class="flex items-center gap-2"
      >

        <!-- Refresh -->

        <button
          type="button"
          :disabled="
            loading ||
            statisticsLoading
          "
          @click="refreshWallets"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >

          <Icon
            name="i-heroicons-arrow-path"
            class="w-4 h-4"
            :class="{
              'animate-spin':
                loading ||
                statisticsLoading,
            }"
          />

          {{
            loading ||
            statisticsLoading
              ? "Refreshing..."
              : "Refresh"
          }}

        </button>


        <!-- Wallet Report -->

        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >

          <Icon
            name="i-heroicons-banknotes"
            class="w-4 h-4"
          />

          Wallet Report

        </button>

      </div>

    </div>


    <!-- Error -->

    <div
      v-if="errorMessage"
      class="mb-6 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
    >

      {{ errorMessage }}

    </div>


    <!-- Wallet Overview -->

    <div
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
    >

      <!-- Total Balance -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-start justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Total Balance
            </p>

            <p
              class="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{
                formatCompactCurrency(
                  totalBalance
                )
              }}
            </p>

            <p
              class="text-xs text-gray-400 mt-1"
            >
              {{
                formatCurrency(
                  totalBalance
                )
              }}
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-wallet"
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />

          </div>

        </div>

      </div>


      <!-- Total Earned -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-start justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Total Earned
            </p>

            <p
              class="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{
                formatCompactCurrency(
                  totalEarned
                )
              }}
            </p>

            <p
              class="text-xs text-emerald-500 mt-1"
            >
              Lifetime wallet earnings
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-arrow-trending-up"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />

          </div>

        </div>

      </div>


      <!-- Total Withdrawn -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-start justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Total Withdrawn
            </p>

            <p
              class="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{
                formatCompactCurrency(
                  totalWithdrawn
                )
              }}
            </p>

            <p
              class="text-xs text-gray-400 mt-1"
            >
              Money paid out
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-arrow-up-right"
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
            />

          </div>

        </div>

      </div>


      <!-- Active Wallets -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-start justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Active Wallets
            </p>

            <p
              class="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{ activeWallets }}
            </p>

            <p
              class="text-xs text-gray-400 mt-1"
            >
              {{ suspendedWallets }}
              suspended
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-green-600 dark:text-green-400"
            />

          </div>

        </div>

      </div>

    </div>


    <!-- Wallet Table -->

    <UiDataList
      :items="filteredWallets"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No wallets found"
    >

      <!-- Filters -->

      <template #filters>

        <div
          class="flex flex-wrap items-center gap-2"
        >

          <!-- Type -->

          <select
            v-model="selectedType"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >

            <option
              v-for="type in types"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>

          </select>


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


      <!-- Owner -->

      <template #cell-owner="{ item }">

        <div
          class="flex items-center gap-3 min-w-[230px]"
        >

          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :class="
              avatarColor(
                item.owner
              )
            "
          >

            {{
              initials(
                item.owner
              )
            }}

          </div>

          <div
            class="min-w-0"
          >

            <p
              class="font-medium text-gray-900 dark:text-white truncate"
            >
              {{ item.owner }}
            </p>

            <p
              class="text-xs text-gray-400 truncate mt-0.5"
            >
              {{ item.email }}
            </p>

            <p
              class="text-[11px] text-gray-400 mt-1 flex items-center gap-1"
            >

              <Icon
                name="i-heroicons-clock"
                class="w-3 h-3"
              />

              {{ item.updatedAt }}

            </p>

          </div>

        </div>

      </template>


      <!-- Type -->

      <template #cell-type="{ item }">

        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="
            walletTypeStyles[
              item.type
            ]
          "
        >

          <Icon
            :name="
              walletTypeIcon(
                item.type
              )
            "
            class="w-3.5 h-3.5"
          />

          {{ item.type }}

        </span>

      </template>


      <!-- Balance -->

      <template #cell-balance="{ item }">

        <div
          class="min-w-[150px]"
        >

          <div
            class="flex items-center gap-2"
          >

            <span
              class="font-semibold text-gray-900 dark:text-white"
            >
              {{
                formatCurrency(
                  item.balance
                )
              }}
            </span>

          </div>


          <div
            class="flex items-center gap-2 mt-1.5"
          >

            <div
              class="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >

              <div
                class="h-full bg-indigo-500 rounded-full transition-all"
                :style="{
                  width: `${balancePercentage(item)}%`,
                }"
              />

            </div>

            <span
              class="text-[11px] text-gray-400"
            >
              {{
                balancePercentage(
                  item
                )
              }}%
            </span>

          </div>


          <p
            class="text-[11px] text-gray-400 mt-1"
          >
            Available balance
          </p>

        </div>

      </template>


      <!-- Total Earned -->

      <template #cell-totalEarned="{ item }">

        <div>

          <p
            class="font-semibold text-emerald-600 dark:text-emerald-400"
          >
            {{
              formatCurrency(
                item.totalEarned
              )
            }}
          </p>

          <p
            class="text-[11px] text-gray-400 mt-0.5"
          >
            Lifetime earnings
          </p>

        </div>

      </template>


      <!-- Total Withdrawn -->

      <template #cell-totalWithdrawn="{ item }">

        <div>

          <p
            class="font-semibold text-gray-700 dark:text-gray-200"
          >
            {{
              formatCurrency(
                item.totalWithdrawn
              )
            }}
          </p>

          <p
            class="text-[11px] text-gray-400 mt-0.5"
          >
            Paid out
          </p>

        </div>

      </template>


      <!-- Status -->

      <template #cell-status="{ item }">

        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="
            statusStyles[
              item.status
            ]
          "
        >

          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="{
              'bg-green-500':
                item.status ===
                'Active',

              'bg-rose-500':
                item.status ===
                'Suspended',

              'bg-amber-500':
                item.status ===
                'Locked',

              'bg-gray-500':
                item.status ===
                'Closed',
            }"
          />

          {{ item.status }}

        </span>

      </template>

    </UiDataList>


    <!-- Bottom Wallet Summary -->

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
    >

      <!-- Available -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-center justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Available for Withdrawal
            </p>

            <p
              class="text-xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{
                formatCurrency(
                  totalBalance
                )
              }}
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-banknotes"
              class="w-5 h-5 text-indigo-500"
            />

          </div>

        </div>

      </div>


      <!-- Earned -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-center justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Lifetime Earnings
            </p>

            <p
              class="text-xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{
                formatCurrency(
                  totalEarned
                )
              }}
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-chart-bar"
              class="w-5 h-5 text-emerald-500"
            />

          </div>

        </div>

      </div>


      <!-- Withdrawn -->

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >

        <div
          class="flex items-center justify-between"
        >

          <div>

            <p
              class="text-sm text-gray-400"
            >
              Lifetime Withdrawals
            </p>

            <p
              class="text-xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {{
                formatCurrency(
                  totalWithdrawn
                )
              }}
            </p>

          </div>

          <div
            class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center"
          >

            <Icon
              name="i-heroicons-arrow-up-right"
              class="w-5 h-5 text-amber-500"
            />

          </div>

        </div>

      </div>

    </div>

  </div>

</template>