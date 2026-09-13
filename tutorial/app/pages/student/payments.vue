<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Types
 * -------------------------------------------------- */

type PaymentStatus = "Successful" | "Pending" | "Failed" | "Refunded";

type PaymentMethod = "Paystack" | "Card" | "Bank Transfer" | "USSD";

interface Payment {
  id: number;
  reference: string;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  status: PaymentStatus;
}

/* --------------------------------------------------
 * State
 * -------------------------------------------------- */

const search = ref("");
const selectedStatus = ref<"All" | PaymentStatus>("All");

/* --------------------------------------------------
 * Payment Data
 * -------------------------------------------------- */

const payments = ref<Payment[]>([
  {
    id: 1,
    reference: "PAY-2026-001",
    description: "JAMB CBT Subscription",
    amount: 15000,
    paymentMethod: "Paystack",
    date: "12 September 2026",
    status: "Successful",
  },
  {
    id: 2,
    reference: "PAY-2026-002",
    description: "Mobile App Access",
    amount: 5000,
    paymentMethod: "Card",
    date: "10 September 2026",
    status: "Pending",
  },
  {
    id: 3,
    reference: "PAY-2026-003",
    description: "Practice Package",
    amount: 7500,
    paymentMethod: "Bank Transfer",
    date: "05 September 2026",
    status: "Successful",
  },
  {
    id: 4,
    reference: "PAY-2026-004",
    description: "Subscription Renewal",
    amount: 10000,
    paymentMethod: "USSD",
    date: "28 August 2026",
    status: "Failed",
  },
  {
    id: 5,
    reference: "PAY-2026-005",
    description: "JAMB Past Questions",
    amount: 8000,
    paymentMethod: "Paystack",
    date: "20 August 2026",
    status: "Successful",
  },
  {
    id: 6,
    reference: "PAY-2026-006",
    description: "Mobile App Access",
    amount: 5000,
    paymentMethod: "Card",
    date: "15 August 2026",
    status: "Refunded",
  },
]);

/* --------------------------------------------------
 * Computed
 * -------------------------------------------------- */

const totalPaid = computed(() =>
  payments.value
    .filter((payment) => payment.status === "Successful")
    .reduce((total, payment) => total + payment.amount, 0)
);

const pendingPayments = computed(() =>
  payments.value.filter((payment) => payment.status === "Pending")
);

const totalPending = computed(() =>
  pendingPayments.value.reduce((total, payment) => total + payment.amount, 0)
);

const failedPayments = computed(() =>
  payments.value.filter((payment) => payment.status === "Failed")
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
  {
    key: "reference",
    label: "Reference",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "paymentMethod",
    label: "Payment Method",
  },
  {
    key: "date",
    label: "Date",
  },
  {
    key: "status",
    label: "Status",
  },
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

/* --------------------------------------------------
 * Actions
 * -------------------------------------------------- */

function viewPayment(payment: Payment) {
  console.log("View payment:", payment);

  // Add your payment details action/API here.
}

async function requestPayment(payment: Payment) {
  if (payment.status !== "Pending") return;

  console.log("Request pending payment:", payment);

  // Connect your API here:
  //
  // await $fetch("/api/student/payments/request", {
  //   method: "POST",
  //   body: {
  //     paymentId: payment.id,
  //   },
  // });
}
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
          <!-- Breadcrumb -->
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

        <!-- Request Pending Payment -->
        <button
          v-if="pendingPayments.length"
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          @click="requestPayment(pendingPayments[0])"
        >
          <Icon name="heroicons:arrow-up-right" class="h-4 w-4" />

          Request Payment
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
        empty-text="No payments found"
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
          <span class="text-gray-700 dark:text-gray-300">
            {{ item.description }}
          </span>
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
          <span class="text-gray-600 dark:text-gray-400">
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

            <!-- Request Pending -->
            <button
              v-if="item.status === 'Pending'"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              @click="requestPayment(item)"
            >
              <Icon name="heroicons:arrow-up-right" class="h-3.5 w-3.5" />

              Request
            </button>
          </div>
        </template>
      </UiDataList>
    </div>
  </div>
</template>
