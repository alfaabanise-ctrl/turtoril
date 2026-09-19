```vue
<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

/* =========================================================
   TYPES
========================================================= */

type PaymentStatus =
  | "Successful"
  | "Pending"
  | "Failed"
  | "Refunded";

type PaymentPlan =
  | "Monthly"
  | "Quarterly"
  | "Yearly";

type PaymentMethod =
  | "Card"
  | "Bank Transfer"
  | "USSD"
  | "Paystack";

interface Payment {
  id: string | number;
  student: string;
  email: string;
  phone: string;
  avatar?: string | null;
  amount: number;
  plan: PaymentPlan;
  paymentMethod: PaymentMethod;
  referredBy: string;
  admin: string;
  paidAt: string;
  reference: string;
  status: PaymentStatus;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaymentSummary {
  totalPayments: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  successfulPercentage: number;
  totalRevenue: number;
  pendingRevenue: number;
  averagePayment: number;
  paymentMethods: {
    Card: number;
    "Bank Transfer": number;
    USSD: number;
    Paystack: number;
  };
}

interface PaymentsApiData {
  payments: Payment[];
  pagination: Pagination;
  summary: PaymentSummary;
}

interface PaymentsApiResponse {
  success: boolean;
  data: PaymentsApiData;
  message: string | null;
  status: number;
  error: any;
}

/* =========================================================
   STATE
========================================================= */

const isLoading = ref(false);
const errorMessage = ref("");

const payments = ref<Payment[]>([]);
const pagination = ref<Pagination>({
  page: 1,
  limit: 100,
  total: 0,
  totalPages: 0,
});

const summary = ref<PaymentSummary>({
  totalPayments: 0,
  successfulPayments: 0,
  pendingPayments: 0,
  failedPayments: 0,
  refundedPayments: 0,
  successfulPercentage: 0,
  totalRevenue: 0,
  pendingRevenue: 0,
  averagePayment: 0,
  paymentMethods: {
    Card: 0,
    "Bank Transfer": 0,
    USSD: 0,
    Paystack: 0,
  },
});

/* =========================================================
   FILTERS
========================================================= */

const search = ref("");

const selectedStatus = ref("All Status");

const selectedMethod = ref("All Methods");

const selectedPlan = ref("All Plans");

/*
 * 100 is what your API is currently returning.
 * You can change this to 10, 20, 50, 100, etc.
 */
const pageLimit = ref(10);

/* =========================================================
   TABLE COLUMNS
========================================================= */

const columns = [
  { key: "student", label: "Student" },
  { key: "amount", label: "Amount" },
  { key: "plan", label: "Plan" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "referredBy", label: "Agent / Teacher" },

  { key: "paidAt", label: "Date" },
  { key: "reference", label: "Reference" },
  { key: "status", label: "Status" },
];

/* =========================================================
   OPTIONS
========================================================= */

const statusOptions = [
  "All Status",
  "Successful",
  "Pending",
  "Failed",
  "Refunded",
];

const paymentMethods = [
  "All Methods",
  "Card",
  "Bank Transfer",
  "USSD",
  "Paystack",
];

const planOptions = [
  "All Plans",
  "Monthly",
  "Quarterly",
  "Yearly",
];

/* =========================================================
   FETCH PAYMENTS FROM API
========================================================= */
function fromKobo(amount: unknown): number {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return value / 100;
}
async function fetchPayments(page = pagination.value.page) {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    console.log("🔥 Fetching payments...");
    console.log("➡️ Page:", page);
    console.log("➡️ Limit:", pageLimit.value);

    /*
     * IMPORTANT:
     *
     * Your backend must accept:
     *
     * ?page=1&limit=100
     *
     * Example:
     * /superadmin/payments?page=1&limit=100
     */
    const response = await useApiFetch<PaymentsApiResponse>(
      `/admin/payments?page=${page}&limit=${pageLimit.value}`,
      {
        method: "GET",
      }
    );

    console.log("📥 Payment API response:", response);

    if (!response?.success) {
      errorMessage.value =
        response?.message || "Failed to load payments.";

      console.error(
        "❌ Payment API error:",
        response?.message
      );

      return;
    }

    if (!response.data) {
      errorMessage.value =
        "No payment data was returned from the server.";

      return;
    }

    const payload = response.data;

    /*
     * API DATA
     */
   payments.value = Array.isArray(payload.payments)
  ? payload.payments.map((payment) => ({
      ...payment,
      amount: fromKobo(payment.amount),
    }))
  : [];
    /*
     * API PAGINATION
     */
    if (payload.pagination) {
      pagination.value = {
        page: Number(payload.pagination.page) || page,
        limit: Number(payload.pagination.limit) || pageLimit.value,
        total: Number(payload.pagination.total) || 0,
        totalPages:
          Number(payload.pagination.totalPages) || 0,
      };
    }

    /*
     * API SUMMARY
     */
   if (payload.summary) {
  summary.value = {
    totalPayments:
      Number(payload.summary.totalPayments) || 0,

    successfulPayments:
      Number(payload.summary.successfulPayments) || 0,

    pendingPayments:
      Number(payload.summary.pendingPayments) || 0,

    failedPayments:
      Number(payload.summary.failedPayments) || 0,

    refundedPayments:
      Number(payload.summary.refundedPayments) || 0,

    successfulPercentage:
      Number(payload.summary.successfulPercentage) || 0,

    // Kobo → Naira
    totalRevenue:
      fromKobo(payload.summary.totalRevenue),

    pendingRevenue:
      fromKobo(payload.summary.pendingRevenue),

    averagePayment:
      fromKobo(payload.summary.averagePayment),

    paymentMethods: {
      Card:
        Number(payload.summary.paymentMethods?.Card) || 0,

      "Bank Transfer":
        Number(
          payload.summary.paymentMethods?.["Bank Transfer"]
        ) || 0,

      USSD:
        Number(payload.summary.paymentMethods?.USSD) || 0,

      Paystack:
        Number(payload.summary.paymentMethods?.Paystack) || 0,
    },
  };
}
    console.log("✅ Payments loaded:", payments.value);
    console.log("📄 Pagination:", pagination.value);
    console.log("📊 Summary:", summary.value);
  } catch (error: any) {
    console.error(
      "🔥 Error fetching payments:",
      error
    );

    errorMessage.value =
      error?.message ||
      "Unable to load payments.";
  } finally {
    isLoading.value = false;
  }
}

/* =========================================================
   INITIAL LOAD
========================================================= */
onMounted(async() => {
  await fetchPayments(1);
});


/* =========================================================
   PAGINATION
========================================================= */

const currentPage = computed({
  get: () => pagination.value.page,
  set: (value: number) => {
    pagination.value.page = value;
  },
});

const totalPages = computed(
  () => pagination.value.total
);

const totalRecords = computed(
  () => pagination.value.total
);

const hasPreviousPage = computed(
  () => currentPage.value > 1
);

const hasNextPage = computed(
  () => currentPage.value < totalPages.value
);

async function goToPage(page: number) {
  if (isLoading.value) return;

  if (page < 1) return;

  if (totalPages.value && page > totalPages.value) {
    return;
  }

  await fetchPayments(page);

  /*
   * Keep the table at the top after changing page.
   */
  if (import.meta.client) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

async function nextPage() {
  if (!hasNextPage.value) return;

  await goToPage(currentPage.value + 1);
}

async function previousPage() {
  if (!hasPreviousPage.value) return;

  await goToPage(currentPage.value - 1);
}

async function firstPage() {
  await goToPage(1);
}

async function lastPage() {
  if (!totalPages.value) return;

  await goToPage(totalPages.value);
}

/* =========================================================
   PAGE NUMBERS
========================================================= */

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (!total) return [];

  /*
   * Show all pages when there are only a few.
   */
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, index) => index + 1
    );
  }

  const pages: (number | string)[] = [];

  pages.push(1);

  if (current > 4) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  if (current < total - 3) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
});

/* =========================================================
   FILTERING
========================================================= */

/*
 * IMPORTANT:
 *
 * Because pagination is coming from the server,
 * this filters ONLY the records on the current page.
 *
 * For global search/filter across all 228 records,
 * your backend should also accept search/status/method/plan
 * query parameters.
 */
const filteredPayments = computed(() => {
  const query = search.value.trim().toLowerCase();

  return payments.value.filter((payment) => {
    const matchesSearch =
      !query ||
      String(payment.student || "")
        .toLowerCase()
        .includes(query) ||
      String(payment.email || "")
        .toLowerCase()
        .includes(query) ||
      String(payment.phone || "")
        .toLowerCase()
        .includes(query) ||
      String(payment.reference || "")
        .toLowerCase()
        .includes(query) ||
      String(payment.referredBy || "")
        .toLowerCase()
        .includes(query) ||
      String(payment.admin || "")
        .toLowerCase()
        .includes(query);

    const matchesStatus =
      selectedStatus.value === "All Status" ||
      payment.status === selectedStatus.value;

    const matchesMethod =
      selectedMethod.value === "All Methods" ||
      payment.paymentMethod === selectedMethod.value;

    const matchesPlan =
      selectedPlan.value === "All Plans" ||
      payment.plan === selectedPlan.value;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMethod &&
      matchesPlan
    );
  });
});

/* =========================================================
   STATISTICS
========================================================= */

/*
 * USE API SUMMARY.
 *
 * Do NOT calculate these from payments.value because
 * payments.value only contains the current page.
 */

const totalPayments = computed(
  () => summary.value.totalPayments
);

const successfulPayments = computed(
  () => summary.value.successfulPayments
);

const pendingPayments = computed(
  () => summary.value.pendingPayments
);

const failedPayments = computed(
  () => summary.value.failedPayments
);

const refundedPayments = computed(
  () => summary.value.refundedPayments
);

const totalRevenue = computed(
  () => summary.value.totalRevenue
);

const pendingRevenue = computed(
  () => summary.value.pendingRevenue
);

const averagePayment = computed(
  () => summary.value.averagePayment
);

const successfulPercentage = computed(
  () => summary.value.successfulPercentage
);

/* =========================================================
   PAYMENT METHOD COUNTS
========================================================= */

const cardPayments = computed(
  () => summary.value.paymentMethods.Card
);

const bankTransferPayments = computed(
  () => summary.value.paymentMethods["Bank Transfer"]
);

const ussdPayments = computed(
  () => summary.value.paymentMethods.USSD
);

const paystackPayments = computed(
  () => summary.value.paymentMethods.Paystack
);

/* =========================================================
   FORMATTING
========================================================= */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const initials = (name: string) => {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* =========================================================
   AVATAR
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

const avatarColor = (name: string) => {
  const index = String(name || "")
    .split("")
    .reduce(
      (total, char) =>
        total + char.charCodeAt(0),
      0
    );

  return avatarColors[
    index % avatarColors.length
  ];
};

/* =========================================================
   STATUS
========================================================= */

const statusStyles = (
  status: PaymentStatus
) => {
  const styles: Record<
    PaymentStatus,
    string
  > = {
    Successful:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    Pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    Failed:
      "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

    Refunded:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  };

  return styles[status];
};

const statusDot = (
  status: PaymentStatus
) => {
  const dots: Record<
    PaymentStatus,
    string
  > = {
    Successful: "bg-emerald-500",
    Pending: "bg-amber-500",
    Failed: "bg-rose-500",
    Refunded: "bg-violet-500",
  };

  return dots[status];
};

/* =========================================================
   PLAN
========================================================= */

const planStyles = (
  plan: PaymentPlan
) => {
  const styles: Record<
    PaymentPlan,
    string
  > = {
    Monthly:
      "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",

    Quarterly:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

    Yearly:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  };

  return styles[plan];
};

/* =========================================================
   PAYMENT METHOD
========================================================= */

const paymentMethodIcon = (
  method: PaymentMethod
) => {
  const icons: Record<
    PaymentMethod,
    string
  > = {
    Card: "i-heroicons-credit-card",
    "Bank Transfer":
      "i-heroicons-building-library",
    USSD:
      "i-heroicons-device-phone-mobile",
    Paystack:
      "i-heroicons-bolt",
  };

  return icons[method];
};

const paymentMethodStyle = (
  method: PaymentMethod
) => {
  const styles: Record<
    PaymentMethod,
    string
  > = {
    Card:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

    "Bank Transfer":
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",

    USSD:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",

    Paystack:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  };

  return styles[method];
};

/* =========================================================
   FILTER ACTIONS
========================================================= */

function clearFilters() {
  search.value = "";
  selectedStatus.value = "All Status";
  selectedMethod.value = "All Methods";
  selectedPlan.value = "All Plans";
}

/*
 * When changing filters, go back to page 1.
 */
watch(
  [
    search,
    selectedStatus,
    selectedMethod,
    selectedPlan,
  ],
  async () => {
    if (pagination.value.page !== 1) {
      await goToPage(1);
    }
  }
);

/* =========================================================
   ACTIONS
========================================================= */

const viewPayment = (
  payment: Payment
) => {
  console.log(
    "👁️ View payment:",
    payment
  );
};

const viewReceipt = (
  payment: Payment
) => {
  console.log(
    "🧾 View receipt:",
    payment
  );
};

const refundPayment = (
  payment: Payment
) => {
  if (
    payment.status !==
    "Successful"
  ) {
    return;
  }

  /*
   * This only changes the frontend temporarily.
   *
   * Connect this to your refund API when ready.
   */
  payment.status = "Refunded";
};

const retryPayment = (
  payment: Payment
) => {
  if (
    payment.status !==
    "Failed"
  ) {
    return;
  }

  /*
   * This only changes the frontend temporarily.
   *
   * Connect this to your retry API when ready.
   */
  payment.status = "Pending";
};
</script>


<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
          >
            <Icon
              name="i-heroicons-banknotes"
              class="h-5 w-5 text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Payments</h1>

            <p class="text-sm text-gray-500 dark:text-gray-400">
              Manage and monitor all payment transactions.
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Icon name="i-heroicons-arrow-down-tray" class="h-4 w-4" />
          Export
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <Icon name="i-heroicons-plus" class="h-4 w-4" />
          Record Payment {{ totalPages }} 
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Total -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Payments</p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ totalPayments }}
            </p>

            <p class="mt-1 text-xs text-gray-400">All transactions</p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10"
          >
            <Icon name="i-heroicons-credit-card" class="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </div>

      <!-- Successful -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Successful</p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ successfulPayments }}
            </p>

            <div class="mt-1 flex items-center gap-1">
              <span class="text-xs text-emerald-600 dark:text-emerald-400">
                {{ successfulPercentage }}%
              </span>
              <span class="text-xs text-gray-400"> success rate </span>
            </div>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10"
          >
            <Icon name="i-heroicons-check-circle" class="h-5 w-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <!-- Pending -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pending</p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ pendingPayments }}
            </p>

            <p class="mt-1 text-xs text-amber-600 dark:text-amber-400">
              {{ formatCurrency(pendingRevenue) }} awaiting
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10"
          >
            <Icon name="i-heroicons-clock" class="h-5 w-5 text-amber-500" />
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>

            <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(totalRevenue) }}
            </p>

            <p class="mt-1 text-xs text-gray-400">
              Avg. {{ formatCurrency(averagePayment) }} / payment
            </p>
          </div>

          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10"
          >
            <Icon name="i-heroicons-chart-bar" class="h-5 w-5 text-violet-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
   
      <UiDataList
  :columns="columns"
  :items="filteredPayments"
  :searchable="false"
  :pagination="true"
  :current-page="currentPage"
  :total-pages="totalPages"
  :total-items="totalRecords"
  :page-size="pagination.limit"
  :loading="isLoading"
  @page-change="goToPage"
>
        <!-- Filters -->
        <template #filters>
          <div class="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
            <!-- Search -->
            <div class="relative w-full lg:max-w-sm">
              <Icon
                name="i-heroicons-magnifying-glass"
                class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              />

              <input
                v-model="search"
                type="text"
                placeholder="Search payments..."
                class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-gray-700 dark:focus:ring-gray-800"
              />
            </div>

            <!-- Status -->
            <select
              v-model="selectedStatus"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-gray-700"
            >
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>

            <!-- Method -->
            <select
              v-model="selectedMethod"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-gray-700"
            >
              <option v-for="method in paymentMethods" :key="method" :value="method">
                {{ method }}
              </option>
            </select>

            <!-- Plan -->
            <select
              v-model="selectedPlan"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:focus:border-gray-700"
            >
              <option v-for="plan in planOptions" :key="plan" :value="plan">
                {{ plan }}
              </option>
            </select>

            <!-- Clear -->
            <button
              v-if="
                search ||
                selectedStatus !== 'All Status' ||
                selectedMethod !== 'All Methods' ||
                selectedPlan !== 'All Plans'
              "
              type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="clearFilters"
            >
              <Icon name="i-heroicons-x-mark" class="h-4 w-4" />
              Clear
            </button>
          </div>
        </template>

        <!-- Student -->
        <template #cell-student="{ item }">
          <div class="flex min-w-[240px] items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm"
              :class="avatarColor(item.student)"
            >
              {{ initials(item.student) }}
            </div>

            <div class="min-w-0">
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ item.student }}
              </p>

              <div class="mt-0.5 flex items-center gap-1.5">
                <Icon
                  name="i-heroicons-envelope"
                  class="h-3.5 w-3.5 shrink-0 text-gray-400"
                />

                <p class="truncate text-xs text-gray-400">
                  {{ item.email }}
                </p>
              </div>

              <div class="mt-0.5 flex items-center gap-1.5">
                <Icon
                  name="i-heroicons-phone"
                  class="h-3.5 w-3.5 shrink-0 text-gray-400"
                />

                <p class="text-xs text-gray-400">
                  {{ item.phone }}
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Amount -->
        <template #cell-amount="{ item }">
          <div class="min-w-[120px]">
            <p class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(item.amount) }}
            </p>

            <p
              v-if="item.status === 'Successful'"
              class="mt-0.5 text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              Payment received
            </p>

            <p
              v-else-if="item.status === 'Pending'"
              class="mt-0.5 text-[11px] text-amber-600 dark:text-amber-400"
            >
              Awaiting payment
            </p>

            <p
              v-else-if="item.status === 'Refunded'"
              class="mt-0.5 text-[11px] text-violet-600 dark:text-violet-400"
            >
              Amount refunded
            </p>

            <p v-else class="mt-0.5 text-[11px] text-rose-600 dark:text-rose-400">
              Payment unsuccessful
            </p>
          </div>
        </template>

        <!-- Plan -->
        <template #cell-plan="{ item }">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            :class="planStyles(item.plan)"
          >
            {{ item.plan }}
          </span>
        </template>

        <!-- Payment Method -->
        <template #cell-paymentMethod="{ item }">
          <div class="flex min-w-[145px] items-center gap-2.5">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              :class="paymentMethodStyle(item.paymentMethod)"
            >
              <Icon :name="paymentMethodIcon(item.paymentMethod)" class="h-4 w-4" />
            </div>

            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ item.paymentMethod }}
              </p>

              <p class="text-[11px] text-gray-400">Payment method</p>
            </div>
          </div>
        </template>

        <!-- Agent / Teacher -->
        <template #cell-referredBy="{ item }">
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10"
            >
              <Icon name="i-heroicons-user-group" class="h-4 w-4 text-indigo-500" />
            </div>

            <div class="min-w-0">
              <p class="truncate font-medium text-gray-700 dark:text-gray-200">
                {{ item.referredBy }}
              </p>

              <p class="text-[11px] text-gray-400">Agent / Teacher</p>
            </div>
          </div>
        </template>

       
        <!-- Date -->
        <template #cell-paidAt="{ item }">
          <div class="min-w-[150px]">
            <div class="flex items-center gap-1.5">
              <Icon name="i-heroicons-calendar-days" class="h-3.5 w-3.5 text-gray-400" />

              <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ item.paidAt.split(" ")[0] }}
              </p>
            </div>

            <p class="mt-0.5 pl-5 text-[11px] text-gray-400">
              {{ item.paidAt.split(" ").slice(1).join(" ") }}
            </p>
          </div>
        </template>

        <!-- Reference -->
        <template #cell-reference="{ item }">
          <div class="min-w-[170px]">
            <div class="flex items-center gap-1.5">
              <Icon name="i-heroicons-hashtag" class="h-3.5 w-3.5 text-gray-400" />

              <code
                class="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {{ item.reference }}
              </code>
            </div>
          </div>
        </template>

        <!-- Status -->
        <template #cell-status="{ item }">
          <span
            class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            :class="statusStyles(item.status)"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDot(item.status)" />

            {{ item.status }}
          </span>
        </template>

        <!-- Actions -->
        <template #actions_row="{ item }">
          <div class="flex items-center justify-end gap-1">
            <!-- View -->
            <button
              type="button"
              title="View payment"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="viewPayment(item)"
            >
              <Icon name="i-heroicons-eye" class="h-4 w-4" />
            </button>

            <!-- Receipt -->
            <button
              type="button"
              title="View receipt"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="viewReceipt(item)"
            >
              <Icon name="i-heroicons-document-text" class="h-4 w-4" />
            </button>

            <!-- Retry -->
            <button
              v-if="item.status === 'Failed'"
              type="button"
              title="Retry payment"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              @click="retryPayment(item)"
            >
              <Icon name="i-heroicons-arrow-path" class="h-4 w-4" />
            </button>

            <!-- Refund -->
            <button
              v-if="item.status === 'Successful'"
              type="button"
              title="Refund payment"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
              @click="refundPayment(item)"
            >
              <Icon name="i-heroicons-arrow-uturn-left" class="h-4 w-4" />
            </button>
          </div>
        </template>
      </UiDataList>
    </div>

    <!-- Bottom Overview -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <!-- Revenue Overview -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>

            <p class="mt-1 text-xs text-gray-400">Successful transaction revenue</p>
          </div>

          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10"
          >
            <Icon name="i-heroicons-banknotes" class="h-4 w-4 text-emerald-500" />
          </div>
        </div>

        <div class="mt-5">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(totalRevenue) }}
          </p>

          <div class="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              class="h-full rounded-full bg-emerald-500 transition-all"
              :style="{ width: `${successfulPercentage}%` }"
            />
          </div>

          <div class="mt-2 flex justify-between text-xs">
            <span class="text-gray-400"> Success rate </span>

            <span class="font-medium text-emerald-600 dark:text-emerald-400">
              {{ successfulPercentage }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Status -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Payment Status</h3>

            <p class="mt-1 text-xs text-gray-400">Current transaction breakdown</p>
          </div>

          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10"
          >
            <Icon name="i-heroicons-chart-pie" class="h-4 w-4 text-blue-500" />
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              <span class="text-sm text-gray-600 dark:text-gray-300"> Successful </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ successfulPayments }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-amber-500" />
              <span class="text-sm text-gray-600 dark:text-gray-300"> Pending </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ pendingPayments }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-rose-500" />
              <span class="text-sm text-gray-600 dark:text-gray-300"> Failed </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ payments.filter((payment) => payment.status === "Failed").length }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-violet-500" />
              <span class="text-sm text-gray-600 dark:text-gray-300"> Refunded </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ payments.filter((payment) => payment.status === "Refunded").length }}
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Payment Methods</h3>

            <p class="mt-1 text-xs text-gray-400">Transactions by method</p>
          </div>

          <div
            class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10"
          >
            <Icon name="i-heroicons-credit-card" class="h-4 w-4 text-violet-500" />
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-credit-card" class="h-4 w-4 text-blue-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300"> Card </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ payments.filter((payment) => payment.paymentMethod === "Card").length }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-building-library" class="h-4 w-4 text-indigo-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300">
                Bank Transfer
              </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{
                payments.filter((payment) => payment.paymentMethod === "Bank Transfer")
                  .length
              }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon
                name="i-heroicons-device-phone-mobile"
                class="h-4 w-4 text-orange-500"
              />

              <span class="text-sm text-gray-600 dark:text-gray-300"> USSD </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ payments.filter((payment) => payment.paymentMethod === "USSD").length }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-bolt" class="h-4 w-4 text-emerald-500" />

              <span class="text-sm text-gray-600 dark:text-gray-300"> Paystack </span>
            </div>

            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{
                payments.filter((payment) => payment.paymentMethod === "Paystack").length
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
