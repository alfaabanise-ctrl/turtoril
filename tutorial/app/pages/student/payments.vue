<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Types
 * -------------------------------------------------- */

type PaymentStatus = "Successful" | "Pending" | "Failed" | "Refunded";

type PaymentMethod =
  | "Paystack"
  | "Card"
  | "Bank Transfer"
  | "USSD"
  | "Scratch Card";

type PaymentType =
  | "GENERAL_PAYMENT"
  | "PIN_PURCHASE"
  | "SCRATCH_CARD"
  | "SUBSCRIPTION";

interface Payment {
  id: string;
  reference: string;
  description: string;
  amount: number; // Naira
  paymentMethod: PaymentMethod;
  paymentType: PaymentType | string;
  date: string;
  status: PaymentStatus;
  raw?: any; // original server payload for detail/retry
}

/* --------------------------------------------------
 * Composables
 * -------------------------------------------------- */

const { pay } = usePaystack();

/* --------------------------------------------------
 * State
 * -------------------------------------------------- */

const search = ref("");
const selectedStatus = ref<"All" | PaymentStatus>("All");

const payments = ref<Payment[]>([]);
const loading = ref(false);
const errorMessage = ref("");
const processingRef = ref<string | null>(null);

const page = ref(1);
const limit = ref(20);
const total = ref(0);
const totalPages = ref(0);

/* --------------------------------------------------
 * Mappers
 * -------------------------------------------------- */

function mapStatus(raw: string): PaymentStatus {
  const value = String(raw || "").toUpperCase();

  switch (value) {
    case "SUCCESS":
    case "SUCCESSFUL":
    case "COMPLETED":
    case "PAID":
      return "Successful";

    case "PENDING":
    case "PROCESSING":
    case "CREATED":
      return "Pending";

    case "FAILED":
    case "CANCELLED":
    case "EXPIRED":
    case "DECLINED":
      return "Failed";

    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return "Refunded";

    default:
      return "Pending";
  }
}

function mapMethod(raw: string | null | undefined): PaymentMethod {
  const value = String(raw || "").toUpperCase();

  if (value.includes("SCRATCH")) return "Scratch Card";
  if (value.includes("CARD")) return "Card";
  if (value.includes("TRANSFER")) return "Bank Transfer";
  if (value.includes("USSD")) return "USSD";

  return "Paystack";
}

function buildDescription(raw: any): string {
  const type =
    raw?.metadata?.paymentType ||
    raw?.metadata?.purpose ||
    raw?.paymentType ||
    "Payment";

  const labels: Record<string, string> = {
    GENERAL_PAYMENT: "General Payment",
    PIN_PURCHASE: "PIN Purchase",
    SCRATCH_CARD: "Scratch Card Purchase",
    SUBSCRIPTION: "Subscription",
    JAMB_CBT: "JAMB CBT Subscription",
  };

  if (labels[type]) return labels[type];

  return String(type)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(raw: string | Date | undefined): string {
  if (!raw) return "—";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function mapPayment(raw: any): Payment {
  const amountKobo = Number(raw.amount || 0);

  return {
    id: String(raw._id || raw.id || raw.txRef),
    reference: raw.txRef || raw.reference || "—",
    description: buildDescription(raw),
    amount: amountKobo / 100,
    paymentMethod: mapMethod(
      raw.paymentMethod || raw.gateway || raw.metadata?.paymentMethod
    ),
    paymentType:
      raw.metadata?.paymentType || raw.paymentType || "GENERAL_PAYMENT",
    date: formatDate(raw.paidAt || raw.createdAt),
    status: mapStatus(raw.status),
    raw,
  };
}

/* --------------------------------------------------
 * API
 * -------------------------------------------------- */

async function fetchPayments() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const query: Record<string, any> = {
      page: page.value,
      limit: limit.value,
    };

    if (selectedStatus.value !== "All") {
      const statusMap: Record<PaymentStatus, string> = {
        Successful: "SUCCESS",
        Pending: "PENDING",
        Failed: "FAILED",
        Refunded: "REFUNDED",
      };
      query.status = statusMap[selectedStatus.value];
    }

    const response = await useApiFetch("/payments/history", {
      method: "GET",
      query,
    });

    if (!response?.success) {
      throw new Error(
        response?.message || "Unable to load payment history."
      );
    }

    // Server response shape:
    // { success, message, data: { success, page, limit, total, totalPages, payments: [...] } }
    const payload = response.data?.data ?? response.data ?? {};
    const list = Array.isArray(payload.payments)
      ? payload.payments
      : Array.isArray(payload)
        ? payload
        : [];

    payments.value = list.map(mapPayment);
    total.value = payload.total ?? list.length;
    totalPages.value = payload.totalPages ?? 1;
  } catch (error: any) {
    console.error("fetchPayments error:", error);
    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to load payment history.";
    payments.value = [];
  } finally {
    loading.value = false;
  }
}

/* --------------------------------------------------
 * Lifecycle
 * -------------------------------------------------- */

onMounted(fetchPayments);

/* --------------------------------------------------
 * Computed
 * -------------------------------------------------- */

const totalPaid = computed(() =>
  payments.value
    .filter((payment) => payment.status === "Successful")
    .reduce((sum, payment) => sum + payment.amount, 0)
);

const pendingPayments = computed(() =>
  payments.value.filter((payment) => payment.status === "Pending")
);

const totalPending = computed(() =>
  pendingPayments.value.reduce((sum, payment) => sum + payment.amount, 0)
);

const failedPayments = computed(() =>
  payments.value.filter((payment) => payment.status === "Failed")
);

const scratchCardPayments = computed(() =>
  payments.value.filter((payment) => payment.paymentMethod === "Scratch Card")
);

const filteredPayments = computed(() => {
  const query = search.value.trim().toLowerCase();

  return payments.value.filter((payment) => {
    const matchesStatus =
      selectedStatus.value === "All" || payment.status === selectedStatus.value;

    const matchesSearch =
      !query ||
      payment.reference.toLowerCase().includes(query) ||
      payment.description.toLowerCase().includes(query) ||
      payment.paymentMethod.toLowerCase().includes(query) ||
      payment.status.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });
});

/* --------------------------------------------------
 * Table Columns
 * -------------------------------------------------- */

const columns = [
  { key: "reference", label: "Reference" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

/* --------------------------------------------------
 * Stats
 * -------------------------------------------------- */

const stats = computed(() => [
  {
    label: "Total Paid",
    value: formatCurrency(totalPaid.value),
    icon: "heroicons:check-circle",
    color: "green",
  },
  {
    label: "Pending",
    value: formatCurrency(totalPending.value),
    icon: "heroicons:clock",
    color: "amber",
  },
  {
    label: "Scratch Cards",
    value: scratchCardPayments.value.length,
    icon: "heroicons:ticket",
    color: "violet",
  },
  {
    label: "Failed",
    value: failedPayments.value.length,
    icon: "heroicons:x-circle",
    color: "rose",
  },
  {
    label: "Transactions",
    value: payments.value.length,
    icon: "heroicons:banknotes",
    color: "indigo",
  },
]);

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusClass(status: PaymentStatus) {
  switch (status) {
    case "Successful":
      return "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20";
    case "Pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-400/20";
    case "Failed":
      return "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-400 dark:ring-rose-400/20";
    case "Refunded":
      return "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/20";
  }
}

function statusIcon(status: PaymentStatus) {
  switch (status) {
    case "Successful":
      return "heroicons:check-circle";
    case "Pending":
      return "heroicons:clock";
    case "Failed":
      return "heroicons:x-circle";
    case "Refunded":
      return "heroicons:arrow-uturn-left";
  }
}

function methodIcon(method: PaymentMethod) {
  switch (method) {
    case "Scratch Card":
      return "heroicons:ticket";
    case "Card":
      return "heroicons:credit-card";
    case "Bank Transfer":
      return "heroicons:building-library";
    case "USSD":
      return "heroicons:device-phone-mobile";
    default:
      return "heroicons:bolt";
  }
}

/* --------------------------------------------------
 * Actions
 * -------------------------------------------------- */

function viewPayment(payment: Payment) {
  console.log("View payment:", payment);
  // Hook up a modal or navigate to /payments/:reference
}

async function requestPayment(payment: Payment) {
  if (payment.status !== "Pending") return;

  const raw = payment.raw || {};
  const reference = raw.txRef || raw.reference;

  if (!reference) {
    errorMessage.value = "Payment reference is missing.";
    return;
  }

  const amountInKobo = Number(raw.amount || 0);
  if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
    errorMessage.value = "Invalid payment amount.";
    return;
  }

  const customerEmail = raw.email || raw.payer?.email || "";
  if (!customerEmail) {
    errorMessage.value = "Customer email is required.";
    return;
  }

  processingRef.value = reference;
  errorMessage.value = "";

  try {
    await pay({
      email: customerEmail,
      amount: amountInKobo, // Paystack inline expects KOBO
      reference,
      metadata: {
        ...(raw.metadata || {}),
        paymentId: raw._id || raw.id,
        paymentType: raw.metadata?.paymentType || "GENERAL_PAYMENT",
      },

      async onSuccess(transaction: any) {
        try {
          const verification = await useApiFetch("/payments/verify", {
            method: "POST",
            body: { ref: transaction.reference },
          });

          if (!verification?.success) {
            throw new Error(
              verification?.message || "Payment verification failed."
            );
          }

          await fetchPayments();
        } catch (error: any) {
          console.error("Verification error:", error);
          errorMessage.value =
            error?.data?.message ||
            error?.message ||
            "Unable to verify payment.";
        } finally {
          processingRef.value = null;
        }
      },

      onCancel() {
        processingRef.value = null;
      },
    });
  } catch (error: any) {
    console.error("requestPayment error:", error);
    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to process payment.";
    processingRef.value = null;
  }
}

/* --------------------------------------------------
 * Watchers
 * -------------------------------------------------- */

watch(selectedStatus, () => {
  page.value = 1;
  fetchPayments();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-7xl">
      <!-- ==========================================
           PAGE HEADER
           ========================================== -->

      <div
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/student"
              class="text-sm text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Dashboard
            </NuxtLink>

            <Icon name="heroicons:chevron-right" class="h-4 w-4 text-gray-400" />

            <span class="text-sm font-medium text-gray-900 dark:text-white">
              Payments
            </span>
          </div>

          <h1 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            Payment History
          </h1>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View your payment history and payment status.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Refresh -->
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click="fetchPayments"
          >
            <Icon
              name="heroicons:arrow-path"
              class="h-4 w-4"
              :class="{ 'animate-spin': loading }"
            />
            Refresh
          </button>

          <!-- Complete Pending Payment -->
          <button
            v-if="pendingPayments.length"
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!!processingRef"
            @click="requestPayment(pendingPayments[0])"
          >
            <Icon
              name="heroicons:arrow-path"
              class="h-4 w-4"
              :class="{ 'animate-spin': !!processingRef }"
            />
            Complete Pending Payment
          </button>
        </div>
      </div>

      <!-- ==========================================
           ERROR BANNER
           ========================================== -->

      <div
        v-if="errorMessage"
        class="mb-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-400"
      >
        <Icon name="heroicons:exclamation-triangle" class="mt-0.5 h-4 w-4" />
        <span class="flex-1">{{ errorMessage }}</span>
        <button
          type="button"
          class="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
          @click="errorMessage = ''"
        >
          <Icon name="heroicons:x-mark" class="h-4 w-4" />
        </button>
      </div>

      <!-- ==========================================
           PAYMENT LIST
           ========================================== -->

      <UiDataList
        :items="filteredPayments"
        :columns="columns"
        row-key="id"
        title="All Payments"
        subtitle="Your complete payment history."
        searchable
        :search-keys="['reference', 'description', 'paymentMethod', 'status']"
        :empty-text="loading ? 'Loading payments…' : 'No payments found'"
        :stats="stats"
        show-total-stat
      >
        <!-- ========================================
             FILTERS
             ======================================== -->

        <template #filters>
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:funnel" class="h-4 w-4 text-gray-400" />

              <select
                v-model="selectedStatus"
                class="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="All">All Status</option>
                <option value="Successful">Successful</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>
        </template>

        <!-- ========================================
             REFERENCE
             ======================================== -->

        <template #cell-reference="{ item }">
          <span class="font-medium text-gray-900 dark:text-white">
            {{ item.reference }}
          </span>
        </template>

        <!-- ========================================
             DESCRIPTION
             ======================================== -->

        <template #cell-description="{ item }">
          <div class="flex items-center gap-2">
            <span class="text-gray-700 dark:text-gray-300">
              {{ item.description }}
            </span>

            <span
              v-if="item.paymentMethod === 'Scratch Card'"
              class="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 ring-1 ring-inset ring-violet-600/20 dark:bg-violet-900/30 dark:text-violet-400 dark:ring-violet-400/20"
            >
              <Icon name="heroicons:ticket" class="h-3 w-3" />
              Scratch
            </span>
          </div>
        </template>

        <!-- ========================================
             AMOUNT
             ======================================== -->

        <template #cell-amount="{ item }">
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(item.amount) }}
          </span>
        </template>

        <!-- ========================================
             PAYMENT METHOD
             ======================================== -->

        <template #cell-paymentMethod="{ item }">
          <span
            class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400"
          >
            <Icon :name="methodIcon(item.paymentMethod)" class="h-4 w-4" />
            {{ item.paymentMethod }}
          </span>
        </template>

        <!-- ========================================
             DATE
             ======================================== -->

        <template #cell-date="{ item }">
          <span class="text-gray-500 dark:text-gray-400">
            {{ item.date }}
          </span>
        </template>

        <!-- ========================================
             STATUS
             ======================================== -->

        <template #cell-status="{ item }">
          <span
            class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
            :class="statusClass(item.status)"
          >
            <Icon :name="statusIcon(item.status)" class="h-3.5 w-3.5" />
            {{ item.status }}
          </span>
        </template>

        <!-- ========================================
             ACTIONS
             ======================================== -->

        <template #actions_row="{ item }">
          <div class="flex items-center justify-end gap-2">
            <!-- View -->
            <button
              type="button"
              title="View payment"
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              @click="viewPayment(item)"
            >
              <Icon name="heroicons:eye" class="h-4 w-4" />
            </button>

            <!-- Complete Pending -->
            <button
              v-if="item.status === 'Pending'"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              :disabled="processingRef === item.reference"
              @click="requestPayment(item)"
            >
              <Icon
                name="heroicons:arrow-path"
                class="h-3.5 w-3.5"
                :class="{
                  'animate-spin': processingRef === item.reference,
                }"
              />
              {{ processingRef === item.reference ? "Processing…" : "Complete" }}
            </button>
          </div>
        </template>
      </UiDataList>
    </div>
  </div>
</template>