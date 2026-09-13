<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Student
 * -------------------------------------------------- */

const studentName = ref("RACHEAL");
const studentLevel = ref("100L, HASS");

/* --------------------------------------------------
 * Mobile App Access Token
 * -------------------------------------------------- */

const hasPaidForAccess = ref(false);
const activationCode = ref("");
const copied = ref(false);

const generateCode = () => {
  hasPaidForAccess.value = true;

  activationCode.value =
    "STU-" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 6).toUpperCase();
};

const copyCode = async () => {
  if (!activationCode.value) return;

  await navigator.clipboard.writeText(activationCode.value);

  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

/* --------------------------------------------------
 * Payment Summary
 * -------------------------------------------------- */

const paymentAmount = ref("₦0");
const paidAmount = ref("₦0");
const debtAmount = ref("₦0");

/* --------------------------------------------------
 * Payment History
 * -------------------------------------------------- */

type PaymentStatus = "Successful" | "Pending" | "Failed" | "Refunded";

interface Payment {
  id: number;
  reference: string;
  description: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

const payments = ref<Payment[]>([
  {
    id: 1,
    reference: "PAY-2026-001",
    description: "JAMB CBT Subscription",
    amount: 15000,
    date: "12 September 2026",
    status: "Successful",
  },
  {
    id: 2,
    reference: "PAY-2026-002",
    description: "Mobile App Access",
    amount: 5000,
    date: "10 September 2026",
    status: "Pending",
  },
  {
    id: 3,
    reference: "PAY-2026-003",
    description: "Practice Package",
    amount: 7500,
    date: "05 September 2026",
    status: "Successful",
  },
  {
    id: 4,
    reference: "PAY-2026-004",
    description: "Subscription Renewal",
    amount: 10000,
    date: "28 August 2026",
    status: "Failed",
  },
]);

const paymentSearch = ref("");

const filteredPayments = computed(() => {
  const search = paymentSearch.value.trim().toLowerCase();

  if (!search) {
    return payments.value;
  }

  return payments.value.filter((payment) =>
    [payment.reference, payment.description, payment.status, payment.date].some((value) =>
      value.toLowerCase().includes(search)
    )
  );
});

/* --------------------------------------------------
 * Request Payment
 * -------------------------------------------------- */

const requestingPayment = ref<number | null>(null);

const requestPayment = (payment: Payment) => {
  requestingPayment.value = payment.id;

  // Connect your API here.
  // Example:
  //
  // await $fetch("/api/student/payments/request", {
  //   method: "POST",
  //   body: {
  //     paymentId: payment.id,
  //   },
  // });

  setTimeout(() => {
    requestingPayment.value = null;
  }, 1000);
};

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const statusClass = (status: PaymentStatus) => {
  switch (status) {
    case "Successful":
      return "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20";

    case "Pending":
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/20";

    case "Failed":
      return "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20";

    case "Refunded":
      return "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/20";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const statusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "Successful":
      return "heroicons:check-circle";

    case "Pending":
      return "heroicons:clock";

    case "Failed":
      return "heroicons:x-circle";

    case "Refunded":
      return "heroicons:arrow-uturn-left";

    default:
      return "heroicons:information-circle";
  }
};

/* --------------------------------------------------
 * Theme
 * -------------------------------------------------- */

const selectedTheme = ref<"light" | "dark">("light");

const setTheme = (theme: "light" | "dark") => {
  selectedTheme.value = theme;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    selectedTheme.value = "dark";
    document.documentElement.classList.add("dark");
  } else {
    selectedTheme.value = "light";
    document.documentElement.classList.remove("dark");
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- ==========================================
           MOBILE APP ACCESS TOKEN
           ========================================== -->

      <div
        class="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="p-5 sm:p-6">
          <!-- Not Paid -->
          <div
            v-if="!hasPaidForAccess"
            class="flex flex-col items-center justify-center py-4 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30"
              >
                <Icon
                  name="heroicons:device-phone-mobile"
                  class="h-6 w-6 text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  Activate Your Mobile App
                </h3>

                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Purchase an access token to unlock the mobile app.
                </p>
              </div>
            </div>

            <button
              type="button"
              class="mt-4 inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:mt-0 sm:w-auto"
              @click="generateCode"
            >
              <Icon name="heroicons:credit-card" class="h-4 w-4" />

              Pay & Generate Code
            </button>
          </div>

          <!-- Paid -->
          <div
            v-else
            class="flex flex-col items-center justify-center py-4 text-center sm:flex-row sm:justify-between sm:text-left"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30"
              >
                <Icon
                  name="heroicons:check-circle"
                  class="h-6 w-6 text-green-600 dark:text-green-400"
                />
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  Your Activation Code
                </h3>

                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Use this code in the mobile app to activate your account.
                </p>
              </div>
            </div>

            <div
              class="mt-4 flex w-full shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-800 sm:mt-0 sm:w-auto"
            >
              <code
                class="px-3 font-mono text-base font-bold tracking-widest text-gray-900 dark:text-white"
              >
                {{ activationCode }}
              </code>

              <button
                type="button"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-600 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                title="Copy Code"
                @click="copyCode"
              >
                <Icon
                  :name="copied ? 'heroicons:check' : 'heroicons:clipboard-document'"
                  class="h-4 w-4"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           DASHBOARD GRID
           ========================================== -->

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Welcome -->
        <div
          class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="relative z-10">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              Welcome back, {{ studentName }}! 👋
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ studentLevel }}
            </p>

            <div class="mt-4 flex flex-col items-start gap-3">
              <span
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20"
              >
                Profile Completed
              </span>

              <NuxtLink
                to="/student/setting"
                class="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-100 px-4 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
              >
                Update Profile
              </NuxtLink>
            </div>
          </div>

          <div class="absolute bottom-0 right-0 z-0 h-32 w-32 opacity-80">
          <img src="/images/pricing.png" alt="" srcset="">
          </div>
        </div>

        <!-- Payment Summary -->
        <div
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Payment
            </span>

            <NuxtLink
              to="/student/payments"
              class="rounded-md bg-green-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-green-600"
            >
              Payment History
            </NuxtLink>
          </div>

          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ paymentAmount }}
            </span>
          </div>

          <div
            class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800"
          >
            <div class="flex flex-col">
              <span
                class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
              >
                <Icon name="heroicons:check-circle" class="h-3 w-3 text-green-500" />

                Paid
              </span>

              <span class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {{ paidAmount }}
              </span>
            </div>

            <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            <div class="flex flex-col items-end">
              <span
                class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
              >
                Debt

                <Icon name="heroicons:exclamation-circle" class="h-3 w-3 text-red-500" />
              </span>

              <span class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {{ debtAmount }}
              </span>
            </div>
          </div>
        </div>

        <!-- Portal Closing Date -->
        <div
          class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="relative z-10">
            <div
              class="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30"
            >
              <Icon
                name="heroicons:calendar-days"
                class="h-4 w-4 text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Not Set</h3>

            <p class="text-sm text-gray-500 dark:text-gray-400">Portal Closing Date</p>
          </div>

          <div class="absolute bottom-0 left-0 right-0 h-16 w-full">
            <img
              src="/images/calendar.svg"
              alt="Calendar Illustration"
              class="h-full w-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>

      <!-- ==========================================
           PAYMENT HISTORY
           ========================================== -->

      <div
        class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Header -->
        <div class="border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Payment History
              </h2>

              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View your payments and payment status.
              </p>
            </div>

            <!-- Request Payment -->
            <button
              type="button"
              class="mt-4 inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:mt-0 sm:w-auto"
              @click="generateCode"
            >
              <Icon name="heroicons:credit-card" class="h-4 w-4" />

              Pay & Generate Code
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6">
          <div class="relative max-w-sm">
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="paymentSearch"
              type="text"
              placeholder="Search payments..."
              class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full text-left text-sm">
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400"
            >
              <tr>
                <th class="px-6 py-4 font-semibold">Reference</th>

                <th class="px-6 py-4 font-semibold">Description</th>

                <th class="px-6 py-4 font-semibold">Amount</th>

                <th class="px-6 py-4 font-semibold">Date</th>

                <th class="px-6 py-4 font-semibold">Status</th>

                <th class="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr
                v-for="payment in filteredPayments"
                :key="payment.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {{ payment.reference }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400">
                  {{ payment.description }}
                </td>

                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-gray-900 dark:text-white"
                >
                  {{ formatCurrency(payment.amount) }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                  {{ payment.date }}
                </td>

                <td class="whitespace-nowrap px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="statusClass(payment.status)"
                  >
                    <Icon :name="statusIcon(payment.status)" class="h-3.5 w-3.5" />

                    {{ payment.status }}
                  </span>
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-right">
                  <button
                    v-if="payment.status === 'Pending'"
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                    :disabled="requestingPayment === payment.id"
                    @click="requestPayment(payment)"
                  >
                    <Icon
                      :name="
                        requestingPayment === payment.id
                          ? 'heroicons:arrow-path'
                          : 'heroicons:arrow-up-right'
                      "
                      class="h-4 w-4"
                      :class="requestingPayment === payment.id ? 'animate-spin' : ''"
                    />

                    {{ requestingPayment === payment.id ? "Requesting..." : "Request" }}
                  </button>

                  <span v-else class="text-xs text-gray-400 dark:text-gray-500"> — </span>
                </td>
              </tr>

              <tr v-if="filteredPayments.length === 0">
                <td colspan="6" class="px-6 py-10 text-center">
                  <Icon
                    name="heroicons:banknotes"
                    class="mx-auto h-8 w-8 text-gray-300 dark:text-gray-700"
                  />

                  <p class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    No payments found
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Payment List -->
        <div class="divide-y divide-gray-100 md:hidden dark:divide-gray-800">
          <div v-for="payment in filteredPayments" :key="payment.id" class="p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ payment.description }}
                </p>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ payment.reference }}
                </p>
              </div>

              <span
                class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="statusClass(payment.status)"
              >
                <Icon :name="statusIcon(payment.status)" class="h-3.5 w-3.5" />

                {{ payment.status }}
              </span>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div>
                <p class="text-base font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(payment.amount) }}
                </p>

                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{ payment.date }}
                </p>
              </div>

              <button
                v-if="payment.status === 'Pending'"
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                :disabled="requestingPayment === payment.id"
                @click="requestPayment(payment)"
              >
                <Icon name="heroicons:arrow-up-right" class="h-4 w-4" />

                {{ requestingPayment === payment.id ? "Requesting..." : "Request" }}
              </button>
            </div>
          </div>

          <div v-if="filteredPayments.length === 0" class="px-5 py-10 text-center">
            <Icon
              name="heroicons:banknotes"
              class="mx-auto h-8 w-8 text-gray-300 dark:text-gray-700"
            />

            <p class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              No payments found
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
          <div
            class="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              Showing {{ filteredPayments.length }} of {{ payments.length }} payments
            </span>

            <NuxtLink
              to="/student/payments"
              class="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all payments
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ==========================================
           RECENT NOTIFICATIONS
           ========================================== -->

      <div
        class="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:w-1/3"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            Recent Notifications
          </h3>

          <Icon name="heroicons:bell" class="h-5 w-5 text-gray-400" />
        </div>

        <div class="mt-4">
          <button
            type="button"
            class="w-full rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
          >
            View all Notifications
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
