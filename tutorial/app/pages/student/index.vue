<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";

definePageMeta({
  layout: "nav",
});

// ============================================================
// TYPES
// ============================================================

type PaymentStatus =
  | "Successful"
  | "Pending"
  | "Failed"
  | "Refunded";

interface Payment {
  id: number | string;
  reference: string;
  description: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

// ============================================================
// STUDENT
// ============================================================

const studentName =
  ref("RACHEAL");

const studentLevel =
  ref("100L, HASS");
const auth = useAuth()
// ============================================================
// PAYMENT STATE
// ============================================================

const hasPaidForAccess =
  ref(false);

const activationCode =
  ref("");

const copied =
  ref(false);

const paymentError =
  ref("");

const paymentSuccess =
  ref("");

const paymentAmount =
  ref("₦0");

const paidAmount =
  ref("₦0");

const debtAmount =
  ref("₦0");

const payments =
  ref<Payment[]>([]);

const paymentSearch =
  ref("");

const requestingPayment =
  ref<number | string | null>(
    null
  );

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (
  amount: number
) =>
  new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(amount);

// ============================================================
// STATUS
// ============================================================

const statusConfig: Record<
  PaymentStatus,
  {
    icon: string;
    class: string;
  }
> = {
  Successful: {
    icon:
      "heroicons:check-circle",

    class:
      "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20",
  },

  Pending: {
    icon:
      "heroicons:clock",

    class:
      "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/20",
  },

  Failed: {
    icon:
      "heroicons:x-circle",

    class:
      "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20",
  },

  Refunded: {
    icon:
      "heroicons:arrow-uturn-left",

    class:
      "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/20",
  },
};

// ============================================================
// FILTER PAYMENTS
// ============================================================

const filteredPayments =
  computed(() => {
    const search =
      paymentSearch.value
        .trim()
        .toLowerCase();

    if (!search) {
      return payments.value;
    }

    return payments.value.filter(
      (payment) =>
        [
          payment.reference,
          payment.description,
          payment.status,
          payment.date,
        ].some((value) =>
          String(value)
            .toLowerCase()
            .includes(search)
        )
    );
  });

// ============================================================
// NORMALIZE STATUS
// ============================================================

const normalizePaymentStatus = (
  status: string
): PaymentStatus => {
  switch (
    String(status).toUpperCase()
  ) {
    case "SUCCESS":
    case "SUCCESSFUL":
      return "Successful";

    case "PENDING":
    case "PROCESSING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "REFUNDED":
      return "Refunded";

    default:
      return "Pending";
  }
};

// ============================================================
// LOAD PAYMENT HISTORY
// ============================================================

const loadPaymentHistory =
  async () => {
    try {
      const response =
        await useApiFetch(
          "/payments/history",
          {
            method: "GET",
          }
        );

      if (!response?.success) {
        return;
      }

      const data =
        response.data?.data ??
        response.data ??
        [];
        console.log(data,'fgfdgdfdfgdf');
      if (!Array.isArray(data.payments)) {
        return;
      }
      console.log(data,'fgfdgdfdfgdf');
      
      payments.value =
        data.payments.map(
          (
            item: any,
            index: number
          ) => ({
            id:
              item._id ||
              item.id ||
              index,

            reference:
              item.txRef ||
              item.reference ||
              `PAY-${index + 1}`,

            description:
              
              item.paymentType ||
              item.subscriptionType ,
              

            amount:
              Number(
                item.amount || 0
              ) / 100,

            date: item.createdAt
              ? new Date(
                  item.createdAt
                ).toLocaleDateString(
                  "en-NG",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "",

            status:
              normalizePaymentStatus(
                item.status
              ),
          })
        );
    } catch (error) {
      console.error(
        "Unable to load payment history:",
        error
      );
    }
  };

// ============================================================
// PAYMENT INITIALIZED
// ============================================================

const onPaymentInitialized =
  (payment: any) => {
    console.log(
      "Payment initialized:",
      payment
    );

    const amount =
      Number(payment?.amount || 0) /
      100;

    if (amount > 0) {
      paymentAmount.value =
        formatCurrency(amount);
    }

    paymentError.value = "";
    paymentSuccess.value = "";
  };

// ============================================================
// PAYMENT SUCCESS
// ============================================================

const onPaymentSuccess =
  async (payment: any) => {
    console.log(
      "Payment successful:",
      payment
    );

    hasPaidForAccess.value =
      true;

    paymentSuccess.value =
      "Payment successful. Your access has been activated.";

    activationCode.value =
      payment?.activationCode ||
      payment?.data?.activationCode ||
      "";

    await loadPaymentHistory();
  };

// ============================================================
// PAYMENT CANCEL
// ============================================================

const onPaymentCancel =
  () => {
    paymentError.value =
      "Payment was cancelled.";

    paymentSuccess.value = "";
  };

// ============================================================
// PAYMENT ERROR
// ============================================================

const onPaymentError =
  (error: any) => {
    console.error(
      "Payment error:",
      error
    );

    paymentError.value =
      error?.message ||
      "Unable to process payment.";

    paymentSuccess.value = "";
  };

// ============================================================
// RETRY PENDING PAYMENT
// ============================================================

const requestPayment = async (
  payment: Payment
) => {
  if (
    requestingPayment.value !==
    null
  ) {
    return;
  }

  requestingPayment.value =
    payment.id;

  try {
    const response =
      await useApiFetch(
        "/payments/verify",
        {
          method: "POST",

          body: {
            ref: payment.reference,
          },
        }
      );
       
        
    if (response?.success) {
      await loadPaymentHistory();
    }
  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );
  } finally {
    requestingPayment.value =
      null;
  }
};

// ============================================================
// COPY ACTIVATION CODE
// ============================================================

const copyCode = async () => {
  if (!activationCode.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      activationCode.value
    );

    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error(
      "Unable to copy activation code:",
      error
    );
  }
};

// ============================================================
// THEME
// ============================================================

const selectedTheme =
  ref<"light" | "dark">(
    "light"
  );

const setTheme = (
  theme: "light" | "dark"
) => {
  selectedTheme.value =
    theme;

  document.documentElement.classList.toggle(
    "dark",
    theme === "dark"
  );

  localStorage.setItem(
    "theme",
    theme
  );
};

// ============================================================
// INITIAL LOAD
// ============================================================

onMounted(async () => {
  const theme =
    localStorage.getItem(
      "theme"
    );

  setTheme(
    theme === "dark"
      ? "dark"
      : "light"
  );

  await loadPaymentHistory();
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950"
  >
    <div
      class="mx-auto w-full max-w-7xl px-0 py-6 sm:px-6 lg:px-8"
    >

      <!-- =====================================================
           MOBILE APP ACCESS
      ====================================================== -->

      <section
        class="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="p-2 sm:p-6">

          <!-- NOT PAID -->

          <div
            v-if="!hasPaidForAccess"
            class="flex flex-col items-center justify-between py-4 text-center sm:flex-row sm:text-left"
          >
            <div
              class="flex items-center gap-4"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30"
              >
                <Icon
                  name="heroicons:device-phone-mobile"
                  class="h-6 w-6 text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Activate Your Mobile App
                </h3>

                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  Purchase an access token to unlock the mobile app.
                </p>
              </div>
            </div>

            <!-- REUSABLE PAYMENT -->

            <div
              class="mt-4 w-full sm:mt-0 sm:w-auto"
            >
              <PaymentPaystackPayment
                :amount="5000"
                :email="''"
                payment-purpose="TOKEN_PURCHASE"
                :metadata="{
                  source:
                    'STUDENT_DASHBOARD',
                  purpose:
                    'MOBILE_APP_ACTIVATION'
                }"
                label="Pay & Generate Code"
                loading-label="Processing..."
                @initialized="
                  onPaymentInitialized
                "
                @success="
                  onPaymentSuccess
                "
                @cancel="
                  onPaymentCancel
                "
                @error="
                  onPaymentError
                "
              />
            </div>
          </div>

          <!-- PAID -->

          <div
            v-else
            class="flex flex-col items-center justify-between py-4 text-center sm:flex-row sm:text-left"
          >
            <div
              class="flex items-center gap-4"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30"
              >
                <Icon
                  name="heroicons:check-circle"
                  class="h-6 w-6 text-green-600 dark:text-green-400"
                />
              </div>

              <div>
                <h3
                  class="text-base font-semibold text-gray-900 dark:text-white"
                >
                  Your Activation Code
                </h3>

                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  Use this code in the mobile app to activate your account.
                </p>
              </div>
            </div>

            <div
              class="mt-4 flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-1.5 dark:border-gray-700 dark:bg-gray-800 sm:mt-0 sm:w-auto"
            >
              <code
                class="px-3 font-mono text-base font-bold tracking-widest text-gray-900 dark:text-white"
              >
                {{ activationCode }}
              </code>

              <button
                type="button"
                title="Copy Code"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-600 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                @click="copyCode"
              >
                <Icon
                  :name="
                    copied
                      ? 'heroicons:check'
                      : 'heroicons:clipboard-document'
                  "
                  class="h-4 w-4"
                />
              </button>
            </div>
          </div>

          <!-- ERROR -->

          <p
            v-if="paymentError"
            class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
          >
            {{ paymentError }}
          </p>

          <!-- SUCCESS -->

          <p
            v-if="paymentSuccess"
            class="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400"
          >
            {{ paymentSuccess }}
          </p>
        </div>
      </section>

      <!-- =====================================================
           DASHBOARD
      ====================================================== -->

      <div
        class="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >

        <!-- WELCOME -->

        <section
          class="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 sm:p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="relative z-10">
            <h2
              class="text-xl font-bold text-gray-900 dark:text-white"
            >
              Welcome back,
              {{ auth.user.firstName }}! 👋
            </h2>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ studentLevel }}
            </p>

            <div
              class="mt-4 flex flex-col items-start gap-3"
            >
              <span
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/30 dark:text-green-400"
              >
                Profile Completed
              </span>

              <NuxtLink
                to="/settings"
                class="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-100 px-4 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400"
              >
                Update Profile
              </NuxtLink>
            </div>
          </div>

          <div
            class="absolute bottom-0 right-0 z-0 h-32 w-32 opacity-80"
          >
            <img
              src="/images/pricing.png"
              alt=""
              class="h-full w-full object-contain"
            />
          </div>
        </section>

        <!-- PAYMENT SUMMARY -->

        <section
          class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex items-center justify-between"
          >
            <span
              class="text-sm font-medium text-gray-500 dark:text-gray-400"
            >
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
            <span
              class="text-3xl font-bold text-gray-900 dark:text-white"
            >
              {{ paymentAmount }}
            </span>
          </div>

          <div
            class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800"
          >
            <div>
              <span
                class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
              >
                <Icon
                  name="heroicons:check-circle"
                  class="h-3 w-3 text-green-500"
                />
                Paid
              </span>

              <span
                class="mt-1 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                {{ paidAmount }}
              </span>
            </div>

            <div
              class="h-6 w-px bg-gray-200 dark:bg-gray-700"
            />

            <div class="text-right">
              <span
                class="flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400"
              >
                Debt

                <Icon
                  name="heroicons:exclamation-circle"
                  class="h-3 w-3 text-red-500"
                />
              </span>

              <span
                class="mt-1 block text-sm font-semibold text-gray-900 dark:text-white"
              >
                {{ debtAmount }}
              </span>
            </div>
          </div>
        </section>

        <!-- CLOSING DATE -->

        <section
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

            <h3
              class="text-lg font-bold text-gray-900 dark:text-white"
            >
              Not Set
            </h3>

            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Portal Closing Date
            </p>
          </div>

          <div
            class="absolute bottom-0 left-0 right-0 h-16"
          >
            <img
              src="/images/calendar.svg"
              alt="Calendar Illustration"
              class="h-full w-full object-cover opacity-80"
            />
          </div>
        </section>
      </div>

      <!-- =====================================================
           PAYMENT HISTORY
      ====================================================== -->

      <section
        class="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6"
        >
          <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2
                class="text-lg font-semibold text-gray-900 dark:text-white"
              >
                Payment History
              </h2>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                View your payments and payment status.
              </p>
            </div>

            <div
              class="w-full sm:w-auto"
            >
              <PaymentPaystackPayment
                :amount="5000"
                :email="''"
                payment-purpose="TOKEN_PURCHASE"
                :metadata="{
                  source:
                    'STUDENT_DASHBOARD',
                  purpose:
                    'MOBILE_APP_ACTIVATION'
                }"
                label="Pay & Generate Code"
                @initialized="
                  onPaymentInitialized
                "
                @success="
                  onPaymentSuccess
                "
                @cancel="
                  onPaymentCancel
                "
                @error="
                  onPaymentError
                "
              />
            </div>
          </div>
        </div>

        <!-- SEARCH -->

        <div
          class="border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6"
        >
          <div class="relative max-w-sm">
            <Icon
              name="heroicons:magnifying-glass"
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="paymentSearch"
              type="text"
              placeholder="Search payments..."
              class="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <!-- DESKTOP -->

        <div
          class="hidden overflow-x-auto md:block"
        >
          <table
            class="w-full text-left text-sm"
          >
            <thead
              class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400"
            >
              <tr>
                <th class="px-6 py-4 font-semibold">
                  Reference
                </th>

                <th class="px-6 py-4 font-semibold">
                  Description
                </th>

                <th class="px-6 py-4 font-semibold">
                  Amount
                </th>

                <th class="px-6 py-4 font-semibold">
                  Date
                </th>

                <th class="px-6 py-4 font-semibold">
                  Status
                </th>

                <th
                  class="px-6 py-4 text-right font-semibold"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody
              v-if="filteredPayments.length"
              class="divide-y divide-gray-100 dark:divide-gray-800"
            >
              <tr
                v-for="payment in filteredPayments.slice(0, 7)"
                :key="payment.id"
                class="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                <td
                  class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {{ payment.reference }}
                </td>

                <td
                  class="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400"
                >
                  JAMB CBT Subscription
                </td>

                <td
                  class="whitespace-nowrap px-6 py-4 font-semibold text-gray-900 dark:text-white"
                >
                  {{ formatCurrency(payment.amount) }}
                </td>

                <td
                  class="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400"
                >
                  {{ payment.date }}
                </td>

                <td
                  class="whitespace-nowrap px-6 py-4"
                >
                  <span
                    class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                    :class="
                      statusConfig[
                        payment.status
                      ].class
                    "
                  >
                    <Icon
                      :name="
                        statusConfig[
                          payment.status
                        ].icon
                      "
                      class="h-3.5 w-3.5"
                    />

                    {{ payment.status }}
                  </span>
                </td>

                <td
                  class="whitespace-nowrap px-6 py-4 text-right"
                >
                  <button
                    v-if="
                      payment.status ===
                      'Pending'
                    "
                    type="button"
                    :disabled="
                      requestingPayment ===
                      payment.id
                    "
                    class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-400"
                    @click="
                      requestPayment(
                        payment
                      )
                    "
                  >
                    <Icon
                      :name="
                        requestingPayment ===
                        payment.id
                          ? 'heroicons:arrow-path'
                          : 'heroicons:arrow-up-right'
                      "
                      class="h-4 w-4"
                      :class="
                        requestingPayment ===
                        payment.id
                          ? 'animate-spin'
                          : ''
                      "
                    />

                    {{
                      requestingPayment ===
                      payment.id
                        ? "Requesting..."
                        : "Request"
                    }}
                  </button>

                  <span
                    v-else
                    class="text-xs text-gray-400 dark:text-gray-500"
                  >
                    —
                  </span>
                </td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr>
                <td
                  colspan="6"
                  class="px-6 py-10 text-center"
                >
                  <Icon
                    name="heroicons:banknotes"
                    class="mx-auto h-8 w-8 text-gray-300 dark:text-gray-700"
                  />

                  <p
                    class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    No payments found
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- MOBILE -->

        <div
          class="divide-y divide-gray-100 md:hidden dark:divide-gray-800"
        >
          <div
            v-for="payment in filteredPayments"
            :key="payment.id"
            class="p-5"
          >
            <div
              class="flex items-start justify-between gap-4"
            >
              <div>
                <p
                  class="text-sm font-semibold text-gray-900 dark:text-white"
                >
                  {{ payment.description }}
                </p>

                <p
                  class="mt-1 text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ payment.reference }}
                </p>
              </div>

              <span
                class="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                :class="
                  statusConfig[
                    payment.status
                  ].class
                "
              >
                <Icon
                  :name="
                    statusConfig[
                      payment.status
                    ].icon
                  "
                  class="h-3.5 w-3.5"
                />

                {{ payment.status }}
              </span>
            </div>

            <div
              class="mt-4 flex items-center justify-between"
            >
              <div>
                <p
                  class="text-base font-bold text-gray-900 dark:text-white"
                >
                  {{
                    formatCurrency(
                      payment.amount
                    )
                  }}
                </p>

                <p
                  class="mt-1 text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ payment.date }}
                </p>
              </div>

              <button
                v-if="
                  payment.status ===
                  'Pending'
                "
                type="button"
                :disabled="
                  requestingPayment ===
                  payment.id
                "
                class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-400"
                @click="
                  requestPayment(
                    payment
                  )
                "
              >
                <Icon
                  :name="
                    requestingPayment ===
                    payment.id
                      ? 'heroicons:arrow-path'
                      : 'heroicons:arrow-up-right'
                  "
                  class="h-4 w-4"
                  :class="
                    requestingPayment ===
                    payment.id
                      ? 'animate-spin'
                      : ''
                  "
                />

                {{
                  requestingPayment ===
                  payment.id
                    ? "Requesting..."
                    : "Request"
                }}
              </button>
            </div>
          </div>

          <div
            v-if="
              filteredPayments.length ===
              0
            "
            class="px-5 py-10 text-center"
          >
            <Icon
              name="heroicons:banknotes"
              class="mx-auto h-8 w-8 text-gray-300 dark:text-gray-700"
            />

            <p
              class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              No payments found
            </p>
          </div>
        </div>

        <!-- FOOTER -->

        <div
          class="border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6"
        >
          <div
            class="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>
              Showing
              {{ filteredPayments.length }}
              of
              {{ payments.length }}
              payments
            </span>

            <NuxtLink
              to="/student/payments"
              class="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View all payments
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- =====================================================
           NOTIFICATIONS
      ====================================================== -->

      <section
        class="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:w-1/3"
      >
        <div
          class="flex items-center justify-between"
        >
          <h3
            class="text-base font-semibold text-gray-900 dark:text-white"
          >
            Recent Notifications
          </h3>

          <Icon
            name="heroicons:bell"
            class="h-5 w-5 text-gray-400"
          />
        </div>

        <button
          type="button"
          class="mt-4 w-full rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
        >
          View all Notifications
        </button>
      </section>
    </div>
  </div>
</template>