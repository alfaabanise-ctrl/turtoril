<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

definePageMeta({
  layout: "nav", // change to your student dashboard layout if different
});

/* =========================================================
 * TYPES
 * ========================================================= */

type PaymentStatus = "Success" | "Pending" | "Failed" | "Refunded";

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
  reference: string;
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
 * CONFIG + STATE
 * ========================================================= */

const config = useRuntimeConfig();

const paymentsData = ref<PaymentApiResponse | null>(null);
const loadingPayments = ref(false);
const paymentError = ref<string | null>(null);

const search = ref("");
const selectedStatus = ref<"All" | PaymentStatus>("All");
const selectedMethod = ref<"All" | PaymentMethod>("All");

/* =========================================================
 * LOAD MY PAYMENTS
 * ========================================================= */

async function loadPayments() {
  loadingPayments.value = true;
  paymentError.value = null;

  try {
    const response = await $fetch<PaymentApiResponse>("/payments/history", {
      baseURL: config.public.apiUrl,
      credentials: "include",
      method: "GET",
    });

    // NOTE: the response itself holds { payments, summary }.
    // The old code used response.data, which does not exist on this type.
    paymentsData.value = response.data;
  } catch (err: any) {
    console.error("Failed to load payments:", err);

    paymentError.value =
      err?.data?.message || err?.message || "Failed to load your payments.";

    paymentsData.value = null;
  } finally {
    loadingPayments.value = false;
  }
}

onMounted(loadPayments);

/* =========================================================
 * NORMALIZERS
 * ========================================================= */

function normalizeStatus(status: unknown): PaymentStatus {
  const value = String(status || "").toUpperCase();

  if (value === "SUCCESS") return "Success";

  if (value === "PENDING" || value === "CREATED" || value === "PROCESSING") {
    return "Pending";
  }

  if (value === "REFUNDED" || value === "PARTIALLY_REFUNDED") {
    return "Refunded";
  }

  return "Failed";
}

function normalizeMethod(method: unknown): PaymentMethod {
  const value = String(method || "UNKNOWN").toUpperCase();

  const validMethods: PaymentMethod[] = [
    "CARD",
    "BANK_TRANSFER",
    "USSD",
    "ACCOUNT",
    "QR",
    "MOBILE_MONEY",
    "UNKNOWN",
  ];

  return validMethods.includes(value as PaymentMethod)
    ? (value as PaymentMethod)
    : "UNKNOWN";
}

/* =========================================================
 * PAYMENT LIST (newest first)
 * ========================================================= */

const payments = computed<Payment[]>(() => {
  const rows = paymentsData.value?.payments ?? [];

  return rows
    .map((payment: any, index: number) => {
      const teacher = payment?.teacher || {};

      const teacherName =
        teacher.name ||
        teacher.fullName ||
        `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
        "";

      return {
        id:
          payment?._id || payment?.id || payment?.txRef || `payment-${index}`,

        reference:
          payment?.txRef ||
          payment?.reference ||
          payment?.flwRef ||
          payment?._id ||
          "—",

        // Backend stores amount in kobo
        amount: Number(payment?.amount || 0) / 100,

        plan:
          payment?.plan ||
          payment?.subscriptionType ||
          payment?.paymentPurpose ||
          "—",

        method: normalizeMethod(payment?.paymentMethod),

        teacher: teacherName,

        date: payment?.createdAt || payment?.paidAt || payment?.date || "",

        status: normalizeStatus(payment?.status),
      };
    })
    .sort(
      (a: Payment, b: Payment) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
});

/* =========================================================
 * FILTERS
 * ========================================================= */

const filteredPayments = computed(() => {
  const query = search.value.trim().toLowerCase();

  return payments.value.filter((payment) => {
    const matchesSearch =
      !query ||
      payment.plan.toLowerCase().includes(query) ||
      payment.reference.toLowerCase().includes(query) ||
      payment.teacher.toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus.value === "All" || payment.status === selectedStatus.value;

    const matchesMethod =
      selectedMethod.value === "All" || payment.method === selectedMethod.value;

    return matchesSearch && matchesStatus && matchesMethod;
  });
});

const hasActiveFilters = computed(
  () =>
    !!search.value ||
    selectedStatus.value !== "All" ||
    selectedMethod.value !== "All"
);

/* =========================================================
 * STATS
 * ========================================================= */

const totalPayments = computed(() => payments.value.length);

const countByStatus = (status: PaymentStatus) =>
  payments.value.filter((p) => p.status === status).length;

const successfulPayments = computed(() => countByStatus("Success"));
const pendingPayments = computed(() => countByStatus("Pending"));
const failedPayments = computed(() => countByStatus("Failed"));

const totalPaid = computed(() =>
  payments.value
    .filter((p) => p.status === "Success")
    .reduce((total, p) => total + p.amount, 0)
);

const lastPayment = computed(
  () => payments.value.find((p) => p.status === "Success") ?? null
);

/* =========================================================
 * FORMATTERS
 * ========================================================= */

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function methodLabel(method: PaymentMethod) {
  switch (method) {
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "MOBILE_MONEY":
      return "Mobile Money";
    case "UNKNOWN":
      return "Unknown";
    default:
      return method.charAt(0) + method.slice(1).toLowerCase();
  }
}

function statusClass(status: PaymentStatus) {
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
 * ACTIONS
 * ========================================================= */

function clearFilters() {
  search.value = "";
  selectedStatus.value = "All";
  selectedMethod.value = "All";
}

const copiedId = ref<string | null>(null);

async function copyReference(payment: Payment) {
  try {
    await navigator.clipboard.writeText(payment.reference);
    copiedId.value = payment.id;
    setTimeout(() => {
      if (copiedId.value === payment.id) copiedId.value = null;
    }, 1500);
  } catch {
    // clipboard not available; ignore
  }
}

function exportCSV() {
  if (!filteredPayments.value.length) return;

  const headers = [
    "Reference",
    "Plan",
    "Amount",
    "Payment Method",
    "Teacher",
    "Date",
    "Status",
  ];

  const rows = filteredPayments.value.map((payment) => [
    payment.reference,
    payment.plan,
    payment.amount.toFixed(2),
    methodLabel(payment.method),
    payment.teacher || "—",
    formatDate(payment.date),
    payment.status,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `my-payments-${new Date().toISOString().slice(0, 10)}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8"
  >
    <div class="mx-auto max-w-6xl space-y-6">
      <!-- HEADER -->
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1
            class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Payment History
          </h1>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            All the payments you have made, in one place.
          </p>
        </div>

        <button
          type="button"
          :disabled="!filteredPayments.length"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          @click="exportCSV"
        >
          <Icon name="i-heroicons-arrow-down-tray" class="h-5 w-5" />
          Download CSV
        </button>
      </div>

      <!-- STAT CARDS -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Payments
              </p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ totalPayments }}
              </p>
            </div>
            <div
              class="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            >
              <Icon name="i-heroicons-credit-card" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Paid
              </p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ currency.format(totalPaid) }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                {{ successfulPayments }} successful
              </p>
            </div>
            <div
              class="rounded-xl bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            >
              <Icon name="i-heroicons-banknotes" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ pendingPayments }}
              </p>
            </div>
            <div
              class="rounded-xl bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            >
              <Icon name="i-heroicons-clock" class="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Failed
              </p>
              <p class="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {{ failedPayments }}
              </p>
            </div>
            <div
              class="rounded-xl bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            >
              <Icon name="i-heroicons-x-circle" class="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <!-- LAST PAYMENT -->
      <div
        v-if="!loadingPayments && !paymentError && lastPayment"
        class="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900/50 dark:bg-green-950/20"
      >
        <Icon
          name="i-heroicons-check-circle"
          class="h-8 w-8 shrink-0 text-green-600 dark:text-green-400"
        />
        <div>
          <p class="font-semibold text-green-800 dark:text-green-300">
            Last successful payment: {{ currency.format(lastPayment.amount) }}
          </p>
          <p class="mt-0.5 text-sm text-green-700 dark:text-green-400">
            {{ lastPayment.plan }} · {{ formatDate(lastPayment.date) }}
          </p>
        </div>
      </div>

      <!-- LOADING -->
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
          <p class="font-semibold text-gray-900 dark:text-white">
            Loading your payments...
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Fetching your payment records.
          </p>
        </div>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="paymentError"
        class="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-start gap-3">
            <Icon
              name="i-heroicons-exclamation-triangle"
              class="h-6 w-6 shrink-0 text-red-600 dark:text-red-400"
            />
            <div>
              <p class="font-semibold text-red-700 dark:text-red-400">
                Failed to load payments
              </p>
              <p class="mt-1 text-sm text-red-600 dark:text-red-500">
                {{ paymentError }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            @click="loadPayments"
          >
            <Icon name="i-heroicons-arrow-path" class="h-5 w-5" />
            Try Again
          </button>
        </div>
      </div>

      <!-- FILTERS -->
      <div
        v-if="!loadingPayments && !paymentError && payments.length"
        class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="relative">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            />
            <input
              v-model="search"
              type="search"
              placeholder="Search plan, reference, teacher..."
              class="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <select
            v-model="selectedStatus"
            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            v-model="selectedMethod"
            class="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All payment methods</option>
            <option value="CARD">Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="USSD">USSD</option>
            <option value="ACCOUNT">Account</option>
            <option value="QR">QR</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="UNKNOWN">Unknown</option>
          </select>
        </div>

        <div
          class="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ filteredPayments.length }}
            </span>
            of
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ payments.length }}
            </span>
            payments
          </p>

          <button
            v-if="hasActiveFilters"
            type="button"
            class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>
      </div>

      <!-- PAYMENTS -->
      <div
        v-if="!loadingPayments && !paymentError"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">
              My Payments
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Most recent payments first.
            </p>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="loadPayments"
          >
            <Icon name="i-heroicons-arrow-path" class="h-4 w-4" />
            Refresh
          </button>
        </div>

        <!-- Empty -->
        <div
          v-if="filteredPayments.length === 0"
          class="flex flex-col items-center justify-center px-6 py-16 text-center"
        >
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <Icon name="i-heroicons-credit-card" class="h-7 w-7 text-gray-400" />
          </div>

          <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">
            No payments found
          </h3>

          <p class="mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
            {{
              payments.length
                ? "Try changing your filters."
                : "You have not made any payment yet. Your payments will show here after you subscribe."
            }}
          </p>
        </div>

        <template v-else>
          <!-- Desktop table -->
          <div class="hidden overflow-x-auto lg:block">
            <table class="w-full text-left">
              <thead
                class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
              >
                <tr>
                  <th
                    class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Plan
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Amount
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Method
                  </th>
                  <th
                    class="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Reference
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

              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="payment in filteredPayments"
                  :key="payment.id"
                  class="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td class="px-5 py-4">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ payment.plan }}
                    </p>
                    <p v-if="payment.teacher" class="mt-0.5 text-xs text-gray-500">
                      Teacher: {{ payment.teacher }}
                    </p>
                  </td>

                  <td class="whitespace-nowrap px-5 py-4">
                    <span class="font-semibold text-gray-900 dark:text-white">
                      {{ currency.format(payment.amount) }}
                    </span>
                  </td>

                  <td
                    class="px-5 py-4 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {{ methodLabel(payment.method) }}
                  </td>

                  <td class="px-5 py-4">
                    <button
                      type="button"
                      class="inline-flex max-w-[11rem] items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      title="Copy reference"
                      @click="copyReference(payment)"
                    >
                      <span class="truncate font-mono">
                        {{ payment.reference }}
                      </span>
                      <Icon
                        :name="
                          copiedId === payment.id
                            ? 'i-heroicons-check'
                            : 'i-heroicons-clipboard'
                        "
                        class="h-4 w-4 shrink-0"
                      />
                    </button>
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ formatDate(payment.date) }}
                  </td>

                  <td class="px-5 py-4">
                    <span
                      class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="statusClass(payment.status)"
                    >
                      {{ payment.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile cards -->
          <div class="divide-y divide-gray-100 dark:divide-gray-800 lg:hidden">
            <div
              v-for="payment in filteredPayments"
              :key="payment.id"
              class="p-5"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <p class="truncate font-semibold text-gray-900 dark:text-white">
                    {{ payment.plan }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ formatDate(payment.date) }}
                  </p>
                </div>

                <span
                  class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="statusClass(payment.status)"
                >
                  {{ payment.status }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Amount</p>
                  <p class="mt-1 font-semibold text-gray-900 dark:text-white">
                    {{ currency.format(payment.amount) }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-500">Method</p>
                  <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {{ methodLabel(payment.method) }}
                  </p>
                </div>

                <div v-if="payment.teacher" class="col-span-2">
                  <p class="text-xs text-gray-500">Teacher</p>
                  <p class="mt-1 text-sm text-gray-700 dark:text-gray-300">
                    {{ payment.teacher }}
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="mt-4 flex w-full items-center justify-between gap-2 border-t border-gray-100 pt-3 text-left dark:border-gray-800"
                @click="copyReference(payment)"
              >
                <span class="min-w-0">
                  <span class="block text-xs text-gray-500">Reference</span>
                  <span
                    class="mt-1 block truncate font-mono text-xs text-gray-700 dark:text-gray-300"
                  >
                    {{ payment.reference }}
                  </span>
                </span>
                <Icon
                  :name="
                    copiedId === payment.id
                      ? 'i-heroicons-check'
                      : 'i-heroicons-clipboard'
                  "
                  class="h-4 w-4 shrink-0 text-gray-500"
                />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>