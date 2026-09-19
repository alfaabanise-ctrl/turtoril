<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  watch,
} from "vue";

definePageMeta({
  layout: "nav",
});

/* ================================================================
 * TYPES
 * ================================================================ */

type LedgerDirection =
  | "CREDIT"
  | "DEBIT";

type LedgerStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REVERSED"
  | "CANCELLED";

type LedgerEntryType =
  | "COMMISSION"
  | "REFERRAL_BONUS"
  | "WITHDRAWAL"
  | "PAYOUT"
  | "REFUND"
  | "REVERSAL"
  | "ADJUSTMENT";

type OwnerType =
  | "TEACHER"
  | "ADMIN"
  | "PLATFORM";

interface OwnerUser {
  _id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  whatsapp_no?: string;
  avatar?: string;
  role?: string;
}

interface LedgerRecord {
  _id: string;

  wallet?: string | null;

  owner?: string | null;

  ownerType?: OwnerType;

  ownerUser?: OwnerUser | null;

  entryType: LedgerEntryType;

  direction: LedgerDirection;

  amount: number;

  currency?: string;

  availableBalanceBefore?: number;
  availableBalanceAfter?: number;

  pendingBalanceBefore?: number;
  pendingBalanceAfter?: number;

  totalBalanceBefore?: number;
  totalBalanceAfter?: number;

  status: LedgerStatus;

  reference: string;

  idempotencyKey?: string;

  payment?: string | null;

  relatedLedger?: string | null;

  externalReference?: string | null;

  description?: string;

  metadata?: Record<string, any>;

  createdBy?: string | null;

  createdAt?: string;

  completedAt?: string | null;

  reversedAt?: string | null;
}

interface LedgerApiResponse {
  success: boolean;

  message?: string;

  data?: {
    ledgers: LedgerRecord[];

    summary?: {
      total: number;
      credits: number;
      debits: number;
      pending: number;
      completed: number;
      failed: number;
      reversed: number;
      cancelled: number;
    };

    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

/* ================================================================
 * STATE
 * ================================================================ */

const ledgers =
  ref<LedgerRecord[]>([]);

const loading =
  ref(false);

const errorMessage =
  ref("");

const search =
  ref("");

const selectedOwnerType =
  ref("All Owners");

const selectedDirection =
  ref("All Directions");

const selectedStatus =
  ref("All Status");

const selectedEntryType =
  ref("All Types");

const currentPage =
  ref(1);

const pageLimit =
  ref(20);

const totalPages =
  ref(1);

const totalLedgerRecords =
  ref(0);

/* ================================================================
 * SUMMARY
 * ================================================================ */

const totalEntries =
  ref(0);

const totalCredits =
  ref(0);

const totalDebits =
  ref(0);

const totalPending =
  ref(0);

const totalCompleted =
  ref(0);

const totalFailed =
  ref(0);

const totalReversed =
  ref(0);

const totalCancelled =
  ref(0);

/* ================================================================
 * TABLE COLUMNS
 * ================================================================ */

const columns = [
  {
    key: "owner",
    label: "Person",
  },

  {
    key: "ownerType",
    label: "Role",
  },

  {
    key: "reference",
    label: "Reference",
  },

  {
    key: "entryType",
    label: "Type",
  },

  {
    key: "direction",
    label: "Direction",
  },

  {
    key: "amount",
    label: "Amount",
  },

  {
    key: "balance",
    label: "Balance",
  },

  {
    key: "status",
    label: "Status",
  },

  {
    key: "description",
    label: "Description",
  },

  {
    key: "createdAt",
    label: "Date",
  },
];

/* ================================================================
 * FILTER OPTIONS
 * ================================================================ */

const ownerTypeOptions = [
  "All Owners",
  "ADMIN",
  "TEACHER",
  "PLATFORM",
];

const directionOptions = [
  "All Directions",
  "CREDIT",
  "DEBIT",
];

const statusOptions = [
  "All Status",
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REVERSED",
  "CANCELLED",
];

const entryTypeOptions = [
  "All Types",
  "COMMISSION",
  "REFERRAL_BONUS",
  "WITHDRAWAL",
  "PAYOUT",
  "REFUND",
  "REVERSAL",
  "ADJUSTMENT",
];

/* ================================================================
 * CURRENCY
 * ================================================================ */

const currency = new Intl.NumberFormat(
  "en-NG",
  {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }
);

/* ================================================================
 * MONEY
 * ================================================================ */

function fromKobo(
  amount?: number | null
) {
  return Number(amount || 0) / 100;
}

function formatMoney(
  amount?: number | null
) {
  return currency.format(
    fromKobo(amount)
  );
}

/* ================================================================
 * DATE
 * ================================================================ */

function formatDate(
  date?: string | null
) {
  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

/* ================================================================
 * DATE + TIME
 * ================================================================ */

function formatDateTime(
  date?: string | null
) {
  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "—";
  }

  return parsed.toLocaleString(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/* ================================================================
 * OWNER NAME
 * ================================================================ */

function ownerName(
  user?: OwnerUser | null
) {
  if (!user) {
    return "Unknown User";
  }

  const name = [
    user.firstName,
    user.middleName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    name ||
    user.email ||
    "Unknown User"
  );
}

/* ================================================================
 * OWNER EMAIL
 * ================================================================ */

function ownerEmail(
  user?: OwnerUser | null
) {
  return (
    user?.email ||
    "No email"
  );
}

/* ================================================================
 * OWNER PHONE
 * ================================================================ */

function ownerPhone(
  user?: OwnerUser | null
) {
  return (
    user?.phone ||
    user?.whatsapp_no ||
    ""
  );
}

/* ================================================================
 * INITIALS
 * ================================================================ */

function ownerInitials(
  user?: OwnerUser | null
) {
  if (!user) {
    return "U";
  }

  const first =
    user.firstName
      ?.charAt(0)
      .toUpperCase() || "";

  const last =
    user.lastName
      ?.charAt(0)
      .toUpperCase() || "";

  return (
    `${first}${last}` ||
    user.email
      ?.charAt(0)
      .toUpperCase() ||
    "U"
  );
}

/* ================================================================
 * OWNER TYPE LABEL
 * ================================================================ */

function ownerTypeLabel(
  type?: OwnerType
) {
  switch (type) {
    case "ADMIN":
      return "Admin";

    case "TEACHER":
      return "Teacher";

    case "PLATFORM":
      return "Platform";

    default:
      return "Unknown";
  }
}

/* ================================================================
 * OWNER TYPE STYLE
 * ================================================================ */

function ownerTypeClass(
  type?: OwnerType
) {
  switch (type) {
    case "ADMIN":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

    case "TEACHER":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

    case "PLATFORM":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

/* ================================================================
 * ENTRY TYPE LABEL
 * ================================================================ */

function entryTypeLabel(
  type: string
) {
  switch (type) {
    case "COMMISSION":
      return "Commission";

    case "REFERRAL_BONUS":
      return "Referral Bonus";

    case "WITHDRAWAL":
      return "Withdrawal";

    case "PAYOUT":
      return "Payout";

    case "REFUND":
      return "Refund";

    case "REVERSAL":
      return "Reversal";

    case "ADJUSTMENT":
      return "Adjustment";

    default:
      return type;
  }
}

/* ================================================================
 * ENTRY TYPE STYLE
 * ================================================================ */

function entryTypeClass(
  type: LedgerEntryType
) {
  switch (type) {
    case "COMMISSION":
      return "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

    case "REFERRAL_BONUS":
      return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

    case "WITHDRAWAL":
      return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    case "PAYOUT":
      return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    case "REFUND":
      return "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400";

    case "REVERSAL":
      return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";

    case "ADJUSTMENT":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

/* ================================================================
 * DIRECTION LABEL
 * ================================================================ */

function directionLabel(
  direction: LedgerDirection
) {
  return direction === "CREDIT"
    ? "Credit"
    : "Debit";
}

/* ================================================================
 * DIRECTION STYLE
 * ================================================================ */

function directionClass(
  direction: LedgerDirection
) {
  return direction === "CREDIT"
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
}

/* ================================================================
 * STATUS LABEL
 * ================================================================ */

function statusLabel(
  status: LedgerStatus
) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "COMPLETED":
      return "Completed";

    case "FAILED":
      return "Failed";

    case "REVERSED":
      return "Reversed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

/* ================================================================
 * STATUS STYLE
 * ================================================================ */

function statusClass(
  status: LedgerStatus
) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";

    case "FAILED":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "REVERSED":
      return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400";

    case "CANCELLED":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

/* ================================================================
 * FETCH LEDGER
 * ================================================================ */

async function fetchLedger() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const params =
      new URLSearchParams();

    /* PAGE */
    params.set(
      "page",
      String(currentPage.value)
    );

    /* LIMIT */
    params.set(
      "limit",
      String(pageLimit.value)
    );

    /* SEARCH */
    if (
      search.value.trim()
    ) {
      params.set(
        "search",
        search.value.trim()
      );
    }

    /* OWNER TYPE */
    if (
      selectedOwnerType.value !==
      "All Owners"
    ) {
      params.set(
        "ownerType",
        selectedOwnerType.value
      );
    }

    /* DIRECTION */
    if (
      selectedDirection.value !==
      "All Directions"
    ) {
      params.set(
        "direction",
        selectedDirection.value
      );
    }

    /* STATUS */
    if (
      selectedStatus.value !==
      "All Status"
    ) {
      params.set(
        "status",
        selectedStatus.value
      );
    }

    /* ENTRY TYPE */
    if (
      selectedEntryType.value !==
      "All Types"
    ) {
      params.set(
        "entryType",
        selectedEntryType.value
      );
    }

    /* API */
    const response =
      await useApiFetch<LedgerApiResponse>(
        `/wallet/ledgers?${params.toString()}`
      );

    console.log(
      "SUPER ADMIN LEDGER RESPONSE:",
      response
    );

    if (!response?.success) {
      throw new Error(
        response?.message ||
        "Failed to load ledger history"
      );
    }

    const apiData =
      response?.data?.data;

    /* LEDGERS */
    ledgers.value =
      apiData?.ledgers || [];

    /* SUMMARY */
    totalEntries.value =
      apiData?.summary?.total || 0;

    totalCredits.value =
      apiData?.summary?.credits || 0;

    totalDebits.value =
      apiData?.summary?.debits || 0;

    totalPending.value =
      apiData?.summary?.pending || 0;

    totalCompleted.value =
      apiData?.summary?.completed || 0;

    totalFailed.value =
      apiData?.summary?.failed || 0;

    totalReversed.value =
      apiData?.summary?.reversed || 0;

    totalCancelled.value =
      apiData?.summary?.cancelled || 0;

    /* PAGINATION */
    totalLedgerRecords.value =
      apiData?.pagination?.total || 0;

    totalPages.value =
      apiData?.pagination?.totalPages || 1;

    currentPage.value =
      apiData?.pagination?.page ||
      currentPage.value;

  } catch (error: any) {
    console.error(
      "FAILED TO FETCH SUPER ADMIN LEDGER:",
      error
    );

    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to load ledger history";

    ledgers.value = [];

  } finally {
    loading.value = false;
  }
}

/* ================================================================
 * INITIAL LOAD
 * ================================================================ */

onMounted(() => {
  fetchLedger();
});

/* ================================================================
 * SEARCH WATCH
 * ================================================================ */

let searchTimer:
  ReturnType<typeof setTimeout> |
  undefined;

watch(
  search,
  () => {
    if (searchTimer) {
      clearTimeout(
        searchTimer
      );
    }

    searchTimer =
      setTimeout(() => {
        currentPage.value = 1;
        fetchLedger();
      }, 400);
  }
);

/* ================================================================
 * FILTER WATCH
 * ================================================================ */

watch(
  [
    selectedOwnerType,
    selectedDirection,
    selectedStatus,
    selectedEntryType,
  ],
  () => {
    currentPage.value = 1;
    fetchLedger();
  }
);

/* ================================================================
 * PAGINATION
 * ================================================================ */

function nextPage() {
  if (
    currentPage.value <
    totalPages.value
  ) {
    currentPage.value++;
    fetchLedger();
  }
}

function previousPage() {
  if (
    currentPage.value > 1
  ) {
    currentPage.value--;
    fetchLedger();
  }
}

function goToPage(
  page: number
) {
  if (
    page < 1 ||
    page > totalPages.value
  ) {
    return;
  }

  currentPage.value = page;
  fetchLedger();
}

/* ================================================================
 * PAGE NUMBERS
 * ================================================================ */

const visiblePages =
  computed(() => {
    const total =
      totalPages.value;

    const current =
      currentPage.value;

    if (total <= 7) {
      return Array.from(
        {
          length: total,
        },
        (_, index) =>
          index + 1
      );
    }

    const pages: number[] = [];

    pages.push(1);

    if (current > 4) {
      pages.push(-1);
    }

    const start =
      Math.max(
        2,
        current - 1
      );

    const end =
      Math.min(
        total - 1,
        current + 1
      );

    for (
      let page = start;
      page <= end;
      page++
    ) {
      pages.push(page);
    }

    if (
      current <
      total - 3
    ) {
      pages.push(-2);
    }

    pages.push(total);

    return pages;
  });

/* ================================================================
 * REFRESH
 * ================================================================ */

function refreshLedger() {
  fetchLedger();
}

/* ================================================================
 * STATS
 * ================================================================ */

const stats =
  computed(() => [
    {
      label: "Ledger Entries",
      value:
        totalEntries.value,
      icon:
        "i-heroicons-list-bullet",
    },

    {
      label: "Credits",
      value:
        totalCredits.value,
      icon:
        "i-heroicons-arrow-down-left",
    },

    {
      label: "Debits",
      value:
        totalDebits.value,
      icon:
        "i-heroicons-arrow-up-right",
    },

    {
      label: "Pending",
      value:
        totalPending.value,
      icon:
        "i-heroicons-clock",
    },
  ]);
</script>

<template>
  <div
    class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"
  >

    <!-- =========================================================
         HEADER
    ========================================================== -->

    <div
      class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >

      <div>

        <div
          class="mb-1 flex items-center gap-2"
        >

          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >

            <Icon
              name="i-heroicons-building-library"
              class="h-3.5 w-3.5"
            />

            Super Admin Finance

          </span>

        </div>

        <h1
          class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
        >
          Platform Ledger
        </h1>

        <p
          class="mt-1 text-sm text-gray-400"
        >
          View financial transactions across admins, teachers and the platform.
        </p>

      </div>

    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->

    <div
      v-if="errorMessage"
      class="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-500/10 dark:text-rose-400"
    >

      <div
        class="flex items-center justify-between gap-3"
      >

        <span>
          {{ errorMessage }}
        </span>

        <button
          type="button"
          class="font-medium hover:underline"
          @click="refreshLedger"
        >
          Retry
        </button>

      </div>

    </div>

    <!-- =========================================================
         STATS
    ========================================================== -->

    <div
      class="mb-6 grid  gap-3 grid-cols-4"
    >

      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >

        <div
          class="flex items-start justify-between gap-3"
        >

          <div>

            <p
              class="text-xs font-medium text-gray-400"
            >
              {{ stat.label }}
            </p>

            <p
              class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              {{
                loading
                  ? "..."
                  : stat.value
              }}
            </p>

          </div>

          <div
            class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10"
          >

            <Icon
              :name="stat.icon"
              class="h-4.5 w-4.5 text-indigo-500"
            />

          </div>

        </div>

      </div>

    </div>

    <!-- =========================================================
         LEDGER
    ========================================================== -->

    <UiDataList
      :items="ledgers"
      :columns="columns"
      row-key="_id"
      :stats="stats"
      :empty-text="
        loading
          ? 'Loading platform ledger...'
          : 'No ledger records found'
      "
    >

      <!-- =======================================================
           FILTERS
      ======================================================== -->

      <template #filters>

        <div
          class=" w-full space-x-1 flex-col gap-2 xl:flex-row"
        >

       

          <!-- OWNER -->

          <select
            v-model="selectedOwnerType"
            class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >

            <option
              v-for="item in ownerTypeOptions"
              :key="item"
              :value="item"
            >
              {{
                item === "All Owners"
                  ? item
                  : ownerTypeLabel(
                      item as OwnerType
                    )
              }}
            </option>

          </select>

          <!-- DIRECTION -->

          <select
            v-model="selectedDirection"
            class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >

            <option
              v-for="item in directionOptions"
              :key="item"
              :value="item"
            >
              {{
                item ===
                "All Directions"
                  ? item
                  : item === "CREDIT"
                    ? "Credit"
                    : "Debit"
              }}
            </option>

          </select>

          <!-- TYPE -->

          <select
            v-model="selectedEntryType"
            class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >

            <option
              v-for="item in entryTypeOptions"
              :key="item"
              :value="item"
            >
              {{
                item === "All Types"
                  ? item
                  : entryTypeLabel(item)
              }}
            </option>

          </select>

          <!-- STATUS -->

          <select
            v-model="selectedStatus"
            class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >

            <option
              v-for="item in statusOptions"
              :key="item"
              :value="item"
            >
              {{
                item === "All Status"
                  ? item
                  : statusLabel(
                      item as LedgerStatus
                    )
              }}
            </option>

          </select>

          <!-- REFRESH -->

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            :disabled="loading"
            @click="refreshLedger"
          >

            <Icon
              name="i-heroicons-arrow-path"
              class="h-4 w-4"
              :class="{
                'animate-spin':
                  loading,
              }"
            />

            Refresh

          </button>

        </div>

      </template>

      <!-- =======================================================
           PERSON
      ======================================================== -->

      <template
        #cell-owner="{ item }"
      >

        <div
          class="flex min-w-[220px] items-center gap-3"
        >

          <!-- AVATAR -->

          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >

            <img
              v-if="item.ownerUser?.avatar"
              :src="item.ownerUser.avatar"
              :alt="ownerName(item.ownerUser)"
              class="h-full w-full object-cover"
            />

            <span v-else>
              {{
                ownerInitials(
                  item.ownerUser
                )
              }}
            </span>

          </div>

          <!-- USER -->

          <div class="min-w-0">

            <p
              class="truncate text-sm font-semibold text-gray-800 dark:text-gray-200"
            >
              {{
                ownerName(
                  item.ownerUser
                )
              }}
            </p>

            <p
              class="truncate text-[11px] text-gray-400"
            >
              {{
                ownerEmail(
                  item.ownerUser
                )
              }}
            </p>

            <p
              v-if="
                ownerPhone(
                  item.ownerUser
                )
              "
              class="truncate text-[11px] text-gray-400"
            >
              {{
                ownerPhone(
                  item.ownerUser
                )
              }}
            </p>

          </div>

        </div>

      </template>

      <!-- =======================================================
           OWNER TYPE
      ======================================================== -->

      <template
        #cell-ownerType="{ item }"
      >

        <span
          class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
          :class="
            ownerTypeClass(
              item.ownerType
            )
          "
        >

          {{
            ownerTypeLabel(
              item.ownerType
            )
          }}

        </span>

      </template>

      <!-- =======================================================
           REFERENCE
      ======================================================== -->

      <template
        #cell-reference="{ item }"
      >

        <div
          class="min-w-[210px]"
        >

          <p
            class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200"
          >
            {{ item.reference }}
          </p>

          <p
            v-if="item.externalReference"
            class="mt-1 truncate text-[11px] text-gray-400"
          >
            External:
            {{ item.externalReference }}
          </p>

        </div>

      </template>

      <!-- =======================================================
           TYPE
      ======================================================== -->

      <template
        #cell-entryType="{ item }"
      >

        <span
          class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
          :class="
            entryTypeClass(
              item.entryType
            )
          "
        >
          {{
            entryTypeLabel(
              item.entryType
            )
          }}
        </span>

      </template>

      <!-- =======================================================
           DIRECTION
      ======================================================== -->

      <template
        #cell-direction="{ item }"
      >

        <div
          class="flex items-center gap-2"
        >

          <div
            class="flex h-7 w-7 items-center justify-center rounded-full"
            :class="
              item.direction ===
              'CREDIT'
                ? 'bg-emerald-50 dark:bg-emerald-500/10'
                : 'bg-rose-50 dark:bg-rose-500/10'
            "
          >

            <Icon
              :name="
                item.direction ===
                'CREDIT'
                  ? 'i-heroicons-arrow-down-left'
                  : 'i-heroicons-arrow-up-right'
              "
              class="h-4 w-4"
              :class="
                item.direction ===
                'CREDIT'
                  ? 'text-emerald-500'
                  : 'text-rose-500'
              "
            />

          </div>

          <span
            class="text-sm font-medium"
            :class="
              directionClass(
                item.direction
              )
            "
          >
            {{
              directionLabel(
                item.direction
              )
            }}
          </span>

        </div>

      </template>

      <!-- =======================================================
           AMOUNT
      ======================================================== -->

      <template
        #cell-amount="{ item }"
      >

        <span
          class="whitespace-nowrap text-sm font-bold"
          :class="
            directionClass(
              item.direction
            )
          "
        >

          {{
            item.direction ===
            "CREDIT"
              ? "+"
              : "-"
          }}

          {{ formatMoney(item.amount) }}

        </span>

      </template>

      <!-- =======================================================
           BALANCE
      ======================================================== -->

      <template
        #cell-balance="{ item }"
      >

        <div
          class="min-w-[150px]"
        >

          <p
            class="text-sm font-semibold text-gray-700 dark:text-gray-200"
          >
            {{
              formatMoney(
                item.availableBalanceAfter
              )
            }}
          </p>

          <p
            class="mt-0.5 text-[11px] text-gray-400"
          >
            Available after
          </p>

          <p
            class="mt-1 text-[11px] text-gray-400"
          >
            Pending:
            {{
              formatMoney(
                item.pendingBalanceAfter
              )
            }}
          </p>

        </div>

      </template>

      <!-- =======================================================
           STATUS
      ======================================================== -->

      <template
        #cell-status="{ item }"
      >

        <span
          class="inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-medium"
          :class="
            statusClass(
              item.status
            )
          "
        >

          {{
            statusLabel(
              item.status
            )
          }}

        </span>

      </template>

      <!-- =======================================================
           DESCRIPTION
      ======================================================== -->

      <template
        #cell-description="{ item }"
      >

        <div
          class="max-w-[280px]"
        >

          <p
            class="truncate text-sm text-gray-700 dark:text-gray-200"
            :title="
              item.description || ''
            "
          >
            {{
              item.description ||
              "—"
            }}
          </p>

          <p
            v-if="item.relatedLedger"
            class="mt-0.5 text-[11px] text-gray-400"
          >
            Related ledger
          </p>

        </div>

      </template>

      <!-- =======================================================
           DATE
      ======================================================== -->

      <template
        #cell-createdAt="{ item }"
      >

        <div
          class="min-w-[145px]"
        >

          <p
            class="text-sm text-gray-700 dark:text-gray-200"
          >
            {{
              formatDate(
                item.createdAt
              )
            }}
          </p>

          <p
            class="mt-0.5 text-[11px] text-gray-400"
          >
            {{
              item.createdAt
                ? formatDateTime(
                    item.createdAt
                  )
                : "—"
            }}
          </p>

        </div>

      </template>

      <!-- =======================================================
           ACTIONS
      ======================================================== -->

      <template
        #actions_row="{ item }"
      >

        <button
          type="button"
          class="rounded-lg p-1.5 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          title="View ledger"
          @click="
            console.log(
              'Ledger:',
              item
            )
          "
        >

          <Icon
            name="i-heroicons-eye"
            class="h-4 w-4"
          />

        </button>

      </template>

    </UiDataList>

    <!-- =========================================================
         PAGINATION
    ========================================================== -->

    <div
      v-if="totalPages > 1"
      class="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >

      <p
        class="text-sm text-gray-400"
      >

        Showing

        {{
          Math.min(
            (currentPage - 1) *
              pageLimit +
              1,
            totalLedgerRecords
          )
        }}

        -

        {{
          Math.min(
            currentPage *
              pageLimit,
            totalLedgerRecords
          )
        }}

        of

        {{ totalLedgerRecords }}

        ledger entries

      </p>

      <div
        class="flex items-center gap-1"
      >

        <!-- PREVIOUS -->

        <button
          type="button"
          class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
          :disabled="
            currentPage <= 1 ||
            loading
          "
          @click="previousPage"
        >
          Previous
        </button>

        <!-- PAGE NUMBERS -->

        <template
          v-for="page in visiblePages"
          :key="page"
        >

          <span
            v-if="page < 0"
            class="px-2 text-gray-400"
          >
            ...
          </span>

          <button
            v-else
            type="button"
            class="min-w-9 rounded-lg border px-2 py-2 text-sm"
            :class="
              page === currentPage
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'
            "
            :disabled="loading"
            @click="
              goToPage(page)
            "
          >
            {{ page }}
          </button>

        </template>

        <!-- NEXT -->

        <button
          type="button"
          class="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
          :disabled="
            currentPage >=
              totalPages ||
            loading
          "
          @click="nextPage"
        >
          Next
        </button>

      </div>

    </div>

  </div>
</template>