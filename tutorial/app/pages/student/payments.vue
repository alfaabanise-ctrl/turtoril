<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* =========================================================
 * TYPES
 * ========================================================= */

type PaymentStatus =
  | "Success"
  | "Pending"
  | "Failed"
  | "Refunded";

type PaymentMethod =
  | "CARD"
  | "BANK_TRANSFER"
  | "USSD"
  | "ACCOUNT"
  | "QR"
  | "MOBILE_MONEY"
  | "UNKNOWN";

interface Payment {
  id: string;
  student: string;
  email: string;
  amount: number;
  plan: string;
  method: PaymentMethod;
  teacher: string;
  date: string;
  status: PaymentStatus;
}

interface PaymentApiResponse {
  success?: boolean;
  message?: string;
  payments?: any[];
  summary?: any;
}

/* =========================================================
 * CONFIG
 * ========================================================= */

const config = useRuntimeConfig();

/* =========================================================
 * CSR STATE
 * ========================================================= */

/*
 * IMPORTANT:
 * Do NOT call this apiData.
 * We use paymentsData to avoid any naming collision.
 */

const paymentsData = ref<PaymentApiResponse | null>(null);

const loadingPayments = ref(false);

const paymentError = ref<string | null>(null);

/* =========================================================
 * FILTERS
 * ========================================================= */

const search = ref("");

const selectedStatus = ref<"All" | PaymentStatus>("All");

const selectedMethod = ref<"All" | PaymentMethod>("All");

/* =========================================================
 * LOAD PAYMENTS
 * ========================================================= */

async function loadPayments() {
  loadingPayments.value = true;
  paymentError.value = null;

  try {
    console.log(
      "Loading admin payments...",
      `${config.public.apiUrl}/admin/payments`
    );

    const response = await $fetch<PaymentApiResponse>(
      "/admin/payments",
      {
        baseURL: config.public.apiUrl,
        credentials: "include",
        method: "GET",
      }
    );

    console.log("Admin payments response:", response);

    /*
     * IMPORTANT:
     * Only paymentsData is updated here.
     */
    paymentsData.value = response;

  } catch (err: any) {
    console.error(
      "Failed to load payments:",
      err
    );

    paymentError.value =
      err?.data?.message ||
      err?.message ||
      "Failed to load payments.";

    paymentsData.value = null;

  } finally {
    loadingPayments.value = false;
  }
}

/* =========================================================
 * CSR ONLY
 * ========================================================= */

onMounted(() => {
  loadPayments();
});

/* =========================================================
 * STATUS
 * ========================================================= */

function normalizeStatus(
  status: unknown
): PaymentStatus {
  const value = String(status || "").toUpperCase();

  if (value === "SUCCESS") {
    return "Success";
  }

  if (
    value === "PENDING" ||
    value === "CREATED" ||
    value === "PROCESSING"
  ) {
    return "Pending";
  }

  if (
    value === "REFUNDED" ||
    value === "PARTIALLY_REFUNDED"
  ) {
    return "Refunded";
  }

  return "Failed";
}

/* =========================================================
 * PAYMENT METHOD
 * ========================================================= */

function normalizeMethod(
  method: unknown
): PaymentMethod {
  const value = String(
    method || "UNKNOWN"
  ).toUpperCase();

  const validMethods: PaymentMethod[] = [
    "CARD",
    "BANK_TRANSFER",
    "USSD",
    "ACCOUNT",
    "QR",
    "MOBILE_MONEY",
    "UNKNOWN",
  ];

  if (
    validMethods.includes(
      value as PaymentMethod
    )
  ) {
    return value as PaymentMethod;
  }

  return "UNKNOWN";
}

/* =========================================================
 * PAYMENT LIST
 * ========================================================= */

const payments = computed<Payment[]>(() => {
  const rows =
    paymentsData.value?.payments ?? [];

  return rows.map(
    (payment: any, index: number) => {
      const payer =
        payment?.payer || {};

      const student =
        payment?.student || {};

      const teacher =
        payment?.teacher || {};

      const studentName =
        student.name ||
        student.fullName ||
        `${student.firstName || payer.firstName || ""} ${
          student.lastName || payer.lastName || ""
        }`.trim() ||
        "Unknown Student";

      const teacherName =
        teacher.name ||
        teacher.fullName ||
        `${teacher.firstName || ""} ${
          teacher.lastName || ""
        }`.trim() ||
        "Direct";

      return {
        id:
          payment?._id ||
          payment?.id ||
          payment?.txRef ||
          `payment-${index}`,

        student: studentName,

        email:
          student.email ||
          payer.email ||
          "—",

        /*
         * Your backend stores amount in kobo.
         */
        amount:
          Number(payment?.amount || 0) /
          100,

        plan:
          payment?.plan ||
          payment?.subscriptionType ||
          payment?.paymentPurpose ||
          "—",

        method:
          normalizeMethod(
            payment?.paymentMethod
          ),

        teacher: teacherName,

        date:
          payment?.createdAt ||
          payment?.paidAt ||
          payment?.date ||
          "",

        status:
          normalizeStatus(
            payment?.status
          ),
      };
    }
  );
});

/* =========================================================
 * FILTERED PAYMENTS
 * ========================================================= */

const filteredPayments = computed(() => {
  const query =
    search.value
      .trim()
      .toLowerCase();

  return payments.value.filter(
    (payment) => {
      const matchesSearch =
        !query ||
        payment.student
          .toLowerCase()
          .includes(query) ||
        payment.email
          .toLowerCase()
          .includes(query) ||
        payment.teacher
          .toLowerCase()
          .includes(query) ||
        payment.plan
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        selectedStatus.value === "All" ||
        payment.status ===
          selectedStatus.value;

      const matchesMethod =
        selectedMethod.value === "All" ||
        payment.method ===
          selectedMethod.value;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    }
  );
});

/* =========================================================
 * STATS
 * ========================================================= */

const totalPayments = computed(
  () => payments.value.length
);

const successfulPayments = computed(
  () =>
    payments.value.filter(
      (payment) =>
        payment.status === "Success"
    ).length
);

const pendingPayments = computed(
  () =>
    payments.value.filter(
      (payment) =>
        payment.status === "Pending"
    ).length
);

const failedPayments = computed(
  () =>
    payments.value.filter(
      (payment) =>
        payment.status === "Failed"
    ).length
);

const refundedPayments = computed(
  () =>
    payments.value.filter(
      (payment) =>
        payment.status === "Refunded"
    ).length
);

/* =========================================================
 * REVENUE
 * ========================================================= */

const totalRevenue = computed(() =>
  payments.value
    .filter(
      (payment) =>
        payment.status === "Success"
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    )
);

const pendingRevenue = computed(() =>
  payments.value
    .filter(
      (payment) =>
        payment.status === "Pending"
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    )
);

const refundedRevenue = computed(() =>
  payments.value
    .filter(
      (payment) =>
        payment.status === "Refunded"
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    )
);

/* =========================================================
 * CURRENCY
 * ========================================================= */

const currency = new Intl.NumberFormat(
  "en-NG",
  {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }
);

/* =========================================================
 * DATE
 * ========================================================= */

function formatDate(
  date: string | Date | null | undefined
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

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(parsed);
}

/* =========================================================
 * METHOD LABEL
 * ========================================================= */

function methodLabel(
  method: PaymentMethod
) {
  switch (method) {
    case "BANK_TRANSFER":
      return "Bank Transfer";

    case "MOBILE_MONEY":
      return "Mobile Money";

    case "UNKNOWN":
      return "Unknown";

    default:
      return method;
  }
}

/* =========================================================
 * STATUS CLASS
 * ========================================================= */

function statusClass(
  status: PaymentStatus
) {
  switch (status) {
    case "Success":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

    case "Refunded":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

    case "Failed":
    default:
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
}

/* =========================================================
 * CLEAR FILTERS
 * ========================================================= */

function clearFilters() {
  search.value = "";
  selectedStatus.value = "All";
  selectedMethod.value = "All";
}

/* =========================================================
 * REFRESH
 * ========================================================= */

async function reloadPayments() {
  await loadPayments();
}

/* =========================================================
 * EXPORT CSV
 * ========================================================= */

function exportCSV() {
  if (
    !filteredPayments.value.length
  ) {
    return;
  }

  const headers = [
    "Student",
    "Email",
    "Amount",
    "Plan",
    "Payment Method",
    "Teacher",
    "Date",
    "Status",
  ];

  const rows =
    filteredPayments.value.map(
      (payment) => [
        payment.student,
        payment.email,
        payment.amount.toFixed(2),
        payment.plan,
        methodLabel(
          payment.method
        ),
        payment.teacher,
        formatDate(
          payment.date
        ),
        payment.status,
      ]
    );

  const csv = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map(
          (value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
        )
        .join(",")
    )
    .join("\n");

  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.download =
    `admin-payments-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(
    url
  );
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8"
  >
    <div
      class="mx-auto max-w-7xl space-y-6"
    >

      <!-- =================================================
           HEADER
      ================================================== -->

      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1
            class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Payments
          </h1>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            View the first payment made by each
            student in your network.
          </p>
        </div>

        <button
          type="button"
          :disabled="
            !filteredPayments.length
          "
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          @click="exportCSV"
        >
          <Icon
            name="i-heroicons-arrow-down-tray"
            class="h-5 w-5"
          />

          Export CSV
        </button>
      </div>

      <!-- =================================================
           STAT CARDS
      ================================================== -->

      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >

        <!-- Total -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-start justify-between"
          >
            <div>
              <p
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                First Payments
              </p>

              <p
                class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
              >
                {{ totalPayments }}
              </p>
            </div>

            <div
              class="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Icon
                name="i-heroicons-credit-card"
                class="h-6 w-6"
              />
            </div>
          </div>
        </div>

        <!-- Revenue -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-start justify-between"
          >
            <div>
              <p
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                Revenue
              </p>

              <p
                class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
              >
                {{ currency.format(totalRevenue) }}
              </p>
            </div>

            <div
              class="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            >
              <Icon
                name="i-heroicons-banknotes"
                class="h-6 w-6"
              />
            </div>
          </div>
        </div>

        <!-- Pending -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-start justify-between"
          >
            <div>
              <p
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                Pending
              </p>

              <p
                class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
              >
                {{ pendingPayments }}
              </p>
            </div>

            <div
              class="rounded-xl bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              <Icon
                name="i-heroicons-clock"
                class="h-6 w-6"
              />
            </div>
          </div>
        </div>

        <!-- Failed -->
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-start justify-between"
          >
            <div>
              <p
                class="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                Failed
              </p>

              <p
                class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
              >
                {{ failedPayments }}
              </p>
            </div>

            <div
              class="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            >
              <Icon
                name="i-heroicons-x-circle"
                class="h-6 w-6"
              />
            </div>
          </div>
        </div>

      </div>

      <!-- =================================================
           LOADING
      ================================================== -->

      <div
        v-if="loadingPayments"
        class="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30"
        >
          <Icon
            name="i-heroicons-arrow-path"
            class="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400"
          />
        </div>

        <div>
          <p
            class="font-semibold text-gray-900 dark:text-white"
          >
            Loading payments...
          </p>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            Fetching your students' payment records.
          </p>
        </div>
      </div>

      <!-- =================================================
           ERROR
      ================================================== -->

      <div
        v-else-if="paymentError"
        class="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div
            class="flex items-start gap-3"
          >
            <Icon
              name="i-heroicons-exclamation-triangle"
              class="h-6 w-6 shrink-0 text-red-600 dark:text-red-400"
            />

            <div>
              <p
                class="font-semibold text-red-700 dark:text-red-400"
              >
                Failed to load payments
              </p>

              <p
                class="mt-1 text-sm text-red-600 dark:text-red-500"
              >
                {{ paymentError }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            @click="reloadPayments"
          >
            <Icon
              name="i-heroicons-arrow-path"
              class="h-5 w-5"
            />

            Try Again
          </button>
        </div>
      </div>

      <!-- =================================================
           REVENUE DETAILS
      ================================================== -->

      <div
        v-if="
          !loadingPayments &&
          !paymentError
        "
        class="grid grid-cols-1 gap-4 md:grid-cols-3"
      >

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Successful Revenue
          </p>

          <p
            class="mt-2 text-xl font-bold text-green-600 dark:text-green-400"
          >
            {{ currency.format(totalRevenue) }}
          </p>

          <p
            class="mt-1 text-xs text-gray-500"
          >
            {{ successfulPayments }}
            successful payment(s)
          </p>
        </div>

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Pending Revenue
          </p>

          <p
            class="mt-2 text-xl font-bold text-yellow-600 dark:text-yellow-400"
          >
            {{ currency.format(pendingRevenue) }}
          </p>

          <p
            class="mt-1 text-xs text-gray-500"
          >
            {{ pendingPayments }}
            pending payment(s)
          </p>
        </div>

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Refunded Revenue
          </p>

          <p
            class="mt-2 text-xl font-bold text-purple-600 dark:text-purple-400"
          >
            {{ currency.format(refundedRevenue) }}
          </p>

          <p
            class="mt-1 text-xs text-gray-500"
          >
            {{ refundedPayments }}
            refunded payment(s)
          </p>
        </div>

      </div>

      <!-- =================================================
           FILTERS
      ================================================== -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="grid grid-cols-1 gap-4 md:grid-cols-3"
        >

          <!-- Search -->
          <div class="relative">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="search"
              type="search"
              placeholder="Search student, email, teacher..."
              class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Status -->
          <select
            v-model="selectedStatus"
            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">
              All statuses
            </option>

            <option value="Success">
              Success
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>

            <option value="Refunded">
              Refunded
            </option>
          </select>

          <!-- Method -->
          <select
            v-model="selectedMethod"
            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">
              All payment methods
            </option>

            <option value="CARD">
              Card
            </option>

            <option value="BANK_TRANSFER">
              Bank Transfer
            </option>

            <option value="USSD">
              USSD
            </option>

            <option value="ACCOUNT">
              Account
            </option>

            <option value="QR">
              QR
            </option>

            <option value="MOBILE_MONEY">
              Mobile Money
            </option>

            <option value="UNKNOWN">
              Unknown
            </option>
          </select>

        </div>

        <div
          class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Showing
            <span
              class="font-semibold text-gray-900 dark:text-white"
            >
              {{ filteredPayments.length }}
            </span>
            of
            <span
              class="font-semibold text-gray-900 dark:text-white"
            >
              {{ payments.length }}
            </span>
            payments
          </p>

          <button
            v-if="
              search ||
              selectedStatus !== 'All' ||
              selectedMethod !== 'All'
            "
            type="button"
            class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- =================================================
           PAYMENTS
      ================================================== -->

      <div
        v-if="
          !loadingPayments &&
          !paymentError
        "
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >

        <!-- Header -->
        <div
          class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2
              class="font-semibold text-gray-900 dark:text-white"
            >
              Student Payments
            </h2>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              One first payment per student.
            </p>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="reloadPayments"
          >
            <Icon
              name="i-heroicons-arrow-path"
              class="h-4 w-4"
            />

            Refresh
          </button>
        </div>

        <!-- Empty -->
        <div
          v-if="
            filteredPayments.length === 0
          "
          class="flex flex-col items-center justify-center px-6 py-16 text-center"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <Icon
              name="i-heroicons-credit-card"
              class="h-7 w-7 text-gray-400"
            />
          </div>

          <h3
            class="mt-4 font-semibold text-gray-900 dark:text-white"
          >
            No payments found
          </h3>

          <p
            class="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400"
          >
            {{
              payments.length
                ? "Try changing your filters."
                : "There are no student payments to display yet."
            }}
          </p>
        </div>

        <!-- Desktop -->
        <div
          v-else
          class="hidden overflow-x-auto lg:block"
        >
          <table class="w-full text-left">
            <thead
              class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
            >
              <tr>
                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Student
                </th>

                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Amount
                </th>

                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Plan
                </th>

                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Method
                </th>

                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Teacher
                </th>

                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>

                <th
                  class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <tr
                v-for="payment in filteredPayments"
                :key="payment.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td
                  class="px-5 py-4"
                >
                  <p
                    class="font-medium text-gray-900 dark:text-white"
                  >
                    {{ payment.student }}
                  </p>

                  <p
                    class="mt-0.5 text-xs text-gray-500"
                  >
                    {{ payment.email }}
                  </p>
                </td>

                <td
                  class="whitespace-nowrap px-5 py-4"
                >
                  <span
                    class="font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      currency.format(
                        payment.amount
                      )
                    }}
                  </span>
                </td>

                <td
                  class="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{ payment.plan }}
                </td>

                <td
                  class="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{
                    methodLabel(
                      payment.method
                    )
                  }}
                </td>

                <td
                  class="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{ payment.teacher }}
                </td>

                <td
                  class="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400"
                >
                  {{
                    formatDate(
                      payment.date
                    )
                  }}
                </td>

                <td
                  class="px-5 py-4"
                >
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                    :class="
                      statusClass(
                        payment.status
                      )
                    "
                  >
                    {{ payment.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile -->
        <div
          class="divide-y divide-gray-100 dark:divide-gray-800 lg:hidden"
        >
          <div
            v-for="payment in filteredPayments"
            :key="payment.id"
            class="p-5"
          >
            <div
              class="flex items-start justify-between gap-4"
            >
              <div
                class="min-w-0"
              >
                <p
                  class="truncate font-semibold text-gray-900 dark:text-white"
                >
                  {{ payment.student }}
                </p>

                <p
                  class="mt-1 truncate text-xs text-gray-500"
                >
                  {{ payment.email }}
                </p>
              </div>

              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="
                  statusClass(
                    payment.status
                  )
                "
              >
                {{ payment.status }}
              </span>
            </div>

            <div
              class="mt-4 grid grid-cols-2 gap-4"
            >
              <div>
                <p
                  class="text-xs text-gray-500"
                >
                  Amount
                </p>

                <p
                  class="mt-1 font-semibold text-gray-900 dark:text-white"
                >
                  {{
                    currency.format(
                      payment.amount
                    )
                  }}
                </p>
              </div>

              <div>
                <p
                  class="text-xs text-gray-500"
                >
                  Plan
                </p>

                <p
                  class="mt-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{ payment.plan }}
                </p>
              </div>

              <div>
                <p
                  class="text-xs text-gray-500"
                >
                  Method
                </p>

                <p
                  class="mt-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{
                    methodLabel(
                      payment.method
                    )
                  }}
                </p>
              </div>

              <div>
                <p
                  class="text-xs text-gray-500"
                >
                  Teacher
                </p>

                <p
                  class="mt-1 text-sm text-gray-700 dark:text-gray-300"
                >
                  {{ payment.teacher }}
                </p>
              </div>
            </div>

            <div
              class="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800"
            >
              <p
                class="text-xs text-gray-500"
              >
                Payment date
              </p>

              <p
                class="mt-1 text-sm text-gray-700 dark:text-gray-300"
              >
                {{
                  formatDate(
                    payment.date
                  )
                }}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
