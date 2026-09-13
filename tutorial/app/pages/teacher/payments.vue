
<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* -------------------------------------------------------------------------- */
/* Payment                                                                     */
/* -------------------------------------------------------------------------- */

interface Payment {
  id: number;
  student: string;
  email: string;
  phone: string;
  amount: number;
  plan: "Monthly" | "Quarterly" | "Yearly";
  paymentMethod: "Card" | "Bank Transfer" | "USSD" | "Paystack";
  paidAt: string;
  reference: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded";
}

/* -------------------------------------------------------------------------- */
/* Payments                                                                    */
/* -------------------------------------------------------------------------- */

const payments = ref<Payment[]>([
  {
    id: 1,
    student: "Amaka Obi",
    email: "amaka@gmail.com",
    phone: "0803 123 4567",
    amount: 25000,
    plan: "Yearly",
    paymentMethod: "Paystack",
    paidAt: "12 September 2026",
    reference: "PAY-20260912-001",
    status: "Successful",
  },
  {
    id: 2,
    student: "Chiamaka Eze",
    email: "chiamaka@gmail.com",
    phone: "0812 456 7890",
    amount: 25000,
    plan: "Yearly",
    paymentMethod: "Card",
    paidAt: "10 September 2026",
    reference: "PAY-20260910-002",
    status: "Successful",
  },
  {
    id: 3,
    student: "Blessing Johnson",
    email: "blessing@gmail.com",
    phone: "0806 234 5678",
    amount: 25000,
    plan: "Yearly",
    paymentMethod: "Bank Transfer",
    paidAt: "08 September 2026",
    reference: "PAY-20260908-003",
    status: "Successful",
  },
  {
    id: 4,
    student: "Tunde Bello",
    email: "tunde@gmail.com",
    phone: "0805 987 6543",
    amount: 3000,
    plan: "Monthly",
    paymentMethod: "USSD",
    paidAt: "07 September 2026",
    reference: "PAY-20260907-004",
    status: "Pending",
  },
  {
    id: 5,
    student: "Ibrahim Musa",
    email: "ibrahim@gmail.com",
    phone: "0704 345 6789",
    amount: 9000,
    plan: "Quarterly",
    paymentMethod: "Paystack",
    paidAt: "05 September 2026",
    reference: "PAY-20260905-005",
    status: "Successful",
  },
  {
    id: 6,
    student: "Sarah Williams",
    email: "sarah@gmail.com",
    phone: "0814 567 8901",
    amount: 3000,
    plan: "Monthly",
    paymentMethod: "Card",
    paidAt: "04 September 2026",
    reference: "PAY-20260904-006",
    status: "Pending",
  },
  {
    id: 7,
    student: "David Okon",
    email: "david@gmail.com",
    phone: "0701 222 3344",
    amount: 25000,
    plan: "Yearly",
    paymentMethod: "Bank Transfer",
    paidAt: "01 September 2026",
    reference: "PAY-20260901-007",
    status: "Refunded",
  },
  {
    id: 8,
    student: "Esther Daniel",
    email: "esther@gmail.com",
    phone: "0807 345 6789",
    amount: 25000,
    plan: "Yearly",
    paymentMethod: "Paystack",
    paidAt: "30 August 2026",
    reference: "PAY-20260830-008",
    status: "Successful",
  },
]);

/* -------------------------------------------------------------------------- */
/* Filters                                                                     */
/* -------------------------------------------------------------------------- */

const selectedStatus = ref("All Status");
const selectedMethod = ref("All Methods");
const search = ref("");

/* -------------------------------------------------------------------------- */
/* Table                                                                       */
/* -------------------------------------------------------------------------- */

const columns = [
  {
    key: "student",
    label: "Student",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "plan",
    label: "Plan",
  },
  {
    key: "paymentMethod",
    label: "Method",
  },
  {
    key: "paidAt",
    label: "Paid At",
  },
  {
    key: "status",
    label: "Status",
  },
];

/* -------------------------------------------------------------------------- */
/* Currency                                                                    */
/* -------------------------------------------------------------------------- */

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/* -------------------------------------------------------------------------- */
/* Filtered Payments                                                           */
/* -------------------------------------------------------------------------- */

const filteredPayments = computed(() => {
  const query = search.value.trim().toLowerCase();

  return payments.value.filter((payment) => {
    const matchesStatus =
      selectedStatus.value === "All Status" ||
      payment.status === selectedStatus.value;

    const matchesMethod =
      selectedMethod.value === "All Methods" ||
      payment.paymentMethod === selectedMethod.value;

    const matchesSearch =
      !query ||
      payment.student.toLowerCase().includes(query) ||
      payment.email.toLowerCase().includes(query) ||
      payment.phone.toLowerCase().includes(query) ||
      payment.reference.toLowerCase().includes(query);

    return matchesStatus && matchesMethod && matchesSearch;
  });
});

/* -------------------------------------------------------------------------- */
/* Payment Statistics                                                          */
/* -------------------------------------------------------------------------- */

const successfulPayments = computed(() =>
  payments.value.filter(
    (payment) => payment.status === "Successful",
  ),
);

const pendingPayments = computed(() =>
  payments.value.filter(
    (payment) => payment.status === "Pending",
  ),
);

const failedPayments = computed(() =>
  payments.value.filter(
    (payment) => payment.status === "Failed",
  ),
);

const refundedPayments = computed(() =>
  payments.value.filter(
    (payment) => payment.status === "Refunded",
  ),
);

/* -------------------------------------------------------------------------- */
/* Revenue                                                                     */
/* -------------------------------------------------------------------------- */

const totalRevenue = computed(() =>
  successfulPayments.value.reduce(
    (total, payment) => total + payment.amount,
    0,
  ),
);

const pendingValue = computed(() =>
  pendingPayments.value.reduce(
    (total, payment) => total + payment.amount,
    0,
  ),
);

const refundedValue = computed(() =>
  refundedPayments.value.reduce(
    (total, payment) => total + payment.amount,
    0,
  ),
);

/* -------------------------------------------------------------------------- */
/* Stats                                                                       */
/* -------------------------------------------------------------------------- */

const stats = computed(() => [
  {
    label: "Total Revenue",
    value: currency.format(totalRevenue.value),
    icon: "heroicons:banknotes",
  },
  {
    label: "Successful",
    value: successfulPayments.value.length,
    icon: "heroicons:check-circle",
  },
  {
    label: "Pending",
    value: pendingPayments.value.length,
    icon: "heroicons:clock",
  },
  {
    label: "Pending Value",
    value: currency.format(pendingValue.value),
    icon: "heroicons:arrow-path",
  },
]);

/* -------------------------------------------------------------------------- */
/* Classes                                                                     */
/* -------------------------------------------------------------------------- */

const statusClass = (status: Payment["status"]) => {
  switch (status) {
    case "Successful":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "Failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "Refunded":
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }
};

const methodClass = (method: Payment["paymentMethod"]) => {
  switch (method) {
    case "Paystack":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

    case "Card":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "Bank Transfer":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "USSD":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }
};

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

const viewPayment = (payment: Payment) => {
  console.log("View payment:", payment);
};

/* -------------------------------------------------------------------------- */
/* Export                                                                      */
/* -------------------------------------------------------------------------- */

const exportPayments = () => {
  const rows = filteredPayments.value;

  const headers = [
    "Student",
    "Email",
    "Phone",
    "Amount",
    "Plan",
    "Payment Method",
    "Paid At",
    "Reference",
    "Status",
  ];

  const csvRows = rows.map((payment) => [
    payment.student,
    payment.email,
    payment.phone,
    payment.amount,
    payment.plan,
    payment.paymentMethod,
    payment.paidAt,
    payment.reference,
    payment.status,
  ]);

  const csv = [headers, ...csvRows]
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "teacher-payments.csv";
  link.click();

  URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="space-y-6 p-4 sm:p-6">

    <!-- ============================================================
         HEADER
    ============================================================= -->

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
          View payments made by your students.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        @click="exportPayments"
      >
        <Icon
          name="heroicons:arrow-down-tray"
          class="h-5 w-5"
        />

        Export CSV
      </button>
    </div>

    <!-- ============================================================
         SUMMARY CARDS
    ============================================================= -->

    <div
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >

      <!-- Total Revenue -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Total Revenue
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ currency.format(totalRevenue) }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          >
            <Icon
              name="heroicons:banknotes"
              class="h-6 w-6"
            />
          </div>
        </div>

        <p
          class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          From successful student payments
        </p>
      </div>

      <!-- Successful -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Successful
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ successfulPayments.length }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          >
            <Icon
              name="heroicons:check-circle"
              class="h-6 w-6"
            />
          </div>
        </div>

        <p
          class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          Completed payments
        </p>
      </div>

      <!-- Pending -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Pending
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ pendingPayments.length }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400"
          >
            <Icon
              name="heroicons:clock"
              class="h-6 w-6"
            />
          </div>
        </div>

        <p
          class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ currency.format(pendingValue) }} awaiting confirmation
        </p>
      </div>

      <!-- Refunded -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between">
          <div>
            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Refunded
            </p>

            <p
              class="mt-2 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ currency.format(refundedValue) }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
          >
            <Icon
              name="heroicons:arrow-uturn-left"
              class="h-6 w-6"
            />
          </div>
        </div>

        <p
          class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ refundedPayments.length }} refunded payment(s)
        </p>
      </div>
    </div>

    <!-- ============================================================
         PAYMENT TABLE
    ============================================================= -->

    <UiDataList
      :items="filteredPayments"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No payments found"
    >

      <!-- ==========================================================
           FILTERS
      =========================================================== -->

      <template #filters>
        <div
          class="flex flex-col gap-3 lg:flex-row lg:items-center"
        >

          <!-- Search -->

          <div class="relative flex-1">
            <Icon
              name="heroicons:magnifying-glass"
              class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="search"
              type="text"
              placeholder="Search student or reference..."
              class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600 dark:focus:ring-gray-800"
            />
          </div>

          <!-- Status -->

          <select
            v-model="selectedStatus"
            class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option>All Status</option>
            <option>Successful</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>

          <!-- Method -->

          <select
            v-model="selectedMethod"
            class="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option>All Methods</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>USSD</option>
            <option>Paystack</option>
          </select>
        </div>
      </template>

      <!-- ==========================================================
           STUDENT
      =========================================================== -->

      <template #cell-student="{ item }">
        <div
          class="flex min-w-[220px] items-center gap-3"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {{ item.student.charAt(0) }}
          </div>

          <div class="min-w-0">
            <p
              class="truncate font-medium text-gray-900 dark:text-white"
            >
              {{ item.student }}
            </p>

            <p
              class="truncate text-xs text-gray-500 dark:text-gray-400"
            >
              {{ item.email }}
            </p>

            <p
              class="text-xs text-gray-400 dark:text-gray-500"
            >
              {{ item.phone }}
            </p>
          </div>
        </div>
      </template>

      <!-- ==========================================================
           AMOUNT
      =========================================================== -->

      <template #cell-amount="{ item }">
        <div>
          <p
            class="font-semibold text-gray-900 dark:text-white"
          >
            {{ currency.format(item.amount) }}
          </p>

          <p
            class="text-xs text-gray-500 dark:text-gray-400"
          >
            {{ item.reference }}
          </p>
        </div>
      </template>

      <!-- ==========================================================
           PLAN
      =========================================================== -->

      <template #cell-plan="{ item }">
        <span
          class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {{ item.plan }}
        </span>
      </template>

      <!-- ==========================================================
           PAYMENT METHOD
      =========================================================== -->

      <template #cell-paymentMethod="{ item }">
        <span
          class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
          :class="methodClass(item.paymentMethod)"
        >
          {{ item.paymentMethod }}
        </span>
      </template>

      <!-- ==========================================================
           PAID AT
      =========================================================== -->

      <template #cell-paidAt="{ item }">
        <div>
          <p
            class="text-sm text-gray-700 dark:text-gray-300"
          >
            {{ item.paidAt }}
          </p>

          <p
            class="text-xs text-gray-400 dark:text-gray-500"
          >
            {{ item.reference }}
          </p>
        </div>
      </template>

      <!-- ==========================================================
           STATUS
      =========================================================== -->

      <template #cell-status="{ item }">
        <span
          class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
          :class="statusClass(item.status)"
        >
          {{ item.status }}
        </span>
      </template>

      <!-- ==========================================================
           ACTIONS
      =========================================================== -->

      <template #actions_row="{ item }">
        <div class="flex items-center justify-end gap-1">
          <button
            type="button"
            title="View payment"
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            @click="viewPayment(item)"
          >
            <Icon
              name="heroicons:eye"
              class="h-5 w-5"
            />
          </button>
        </div>
      </template>
    </UiDataList>

    <!-- ============================================================
         PAYMENT SUMMARY
    ============================================================= -->

    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mb-5">
        <h2
          class="font-semibold text-gray-900 dark:text-white"
        >
          Payment Summary
        </h2>

        <p
          class="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          Overview of payments from your students.
        </p>
      </div>

      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >

        <!-- Successful Revenue -->

        <div
          class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Successful Revenue
          </p>

          <p
            class="mt-1 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ currency.format(totalRevenue) }}
          </p>
        </div>

        <!-- Pending -->

        <div
          class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Pending Payments
          </p>

          <p
            class="mt-1 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ currency.format(pendingValue) }}
          </p>
        </div>

        <!-- Failed -->

        <div
          class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
        >
          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            Failed Transactions
          </p>

          <p
            class="mt-1 text-xl font-bold text-gray-900 dark:text-white"
          >
            {{ failedPayments.length }}
          </p>
        </div>

      </div>
    </div>
  </div>
</template>


