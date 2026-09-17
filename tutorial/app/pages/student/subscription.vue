```vue
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* ==================================================
 * TYPES
 * ================================================== */

type TokenPlan =
  | "Monthly"
  | "Quarterly"
  | "Yearly";

type TokenStatus =
  | "unused"
  | "active"
  | "used"
  | "expired"
  | "revoked";

interface SubscriptionPlan {
  id: number;
  name: TokenPlan;
  description: string;
  price: number; // Naira
  duration: string;
  popular?: boolean;
  features: string[];
}

interface PurchasedToken {
  id: string;
  token: string;
  plan: TokenPlan;
  amount: number; // Kobo
  paymentReference: string | null;
  status: TokenStatus;
  activatedBy: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  features: string[];
  deviceLimit: number;
  deviceCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TokensApiResponse {
  success: boolean;
  message?: string;
  tokens: PurchasedToken[];
  total: number;
}

/* ==================================================
 * STATE
 * ================================================== */

const showPlans = ref(false);

const selectedPlan =
  ref<SubscriptionPlan | null>(null);

const purchasedTokens =
  ref<PurchasedToken[]>([]);

const tokensLoading = ref(false);

const tokensError = ref("");

const paymentLoading = ref(false);

const paymentError = ref("");

/* ==================================================
 * PLANS
 * ================================================== */

const plans = ref<SubscriptionPlan[]>([
  {
    id: 1,
    name: "Monthly",
    description:
      "Access the platform for one month.",
    price: 15000,
    duration: "1 Month",
    features: [
      "Full CBT access",
      "JAMB past questions",
      "Practice tests",
      "Performance tracking",
    ],
  },

  {
    id: 2,
    name: "Quarterly",
    description:
      "Enjoy access for three months.",
    price: 40000,
    duration: "3 Months",
    popular: true,
    features: [
      "Full CBT access",
      "JAMB past questions",
      "Practice tests",
      "Performance tracking",
    ],
  },

  {
    id: 3,
    name: "Yearly",
    description:
      "Get full access for one year.",
    price: 120000,
    duration: "12 Months",
    features: [
      "Full CBT access",
      "JAMB past questions",
      "Practice tests",
      "Performance tracking",
    ],
  },
]);

/* ==================================================
 * MONEY
 * ================================================== */

const fromKobo = (
  amount: unknown
): number => {
  const value = Number(amount ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return value / 100;
};

const formatCurrency = (
  amount: number
) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

/* ==================================================
 * DATE
 * ================================================== */

const formatDate = (
  date: string | null | undefined
) => {
  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

/* ==================================================
 * CURRENT ACTIVE SUBSCRIPTION
 * ================================================== */

const currentSubscription =
  computed<PurchasedToken | null>(() => {
    const now = Date.now();

    const activeToken =
      purchasedTokens.value.find(
        (token) => {
          if (token.status !== "active") {
            return false;
          }

          if (!token.expiresAt) {
            return true;
          }

          const expiry =
            new Date(
              token.expiresAt
            ).getTime();

          return (
            !Number.isNaN(expiry) &&
            expiry > now
          );
        }
      );

    return activeToken || null;
  });

/* ==================================================
 * ACTIVE STATUS
 * ================================================== */

const isActive = computed(() => {
  return Boolean(
    currentSubscription.value
  );
});

/* ==================================================
 * TOTAL PURCHASES
 * ================================================== */

const totalPurchases = computed(() => {
  return purchasedTokens.value.length;
});

/* ==================================================
 * CURRENT STATUS
 *
 * IMPORTANT:
 * This NEVER reads .status from null.
 * ================================================== */

const currentStatus =
  computed<TokenStatus | null>(() => {
    return (
      currentSubscription.value
        ?.status || null
    );
  });

/* ==================================================
 * STATUS LABEL
 * ================================================== */

const statusLabel = (
  status: TokenStatus | null
) => {
  if (!status) {
    return "No Subscription";
  }

  switch (status) {
    case "active":
      return "Active";

    case "unused":
      return "Unused";

    case "used":
      return "Used";

    case "expired":
      return "Expired";

    case "revoked":
      return "Revoked";

    default:
      return "Unknown";
  }
};

/* ==================================================
 * STATUS CLASS
 * ================================================== */

const statusClass = (
  status: TokenStatus | null
) => {
  switch (status) {
    case "active":
      return "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20";

    case "unused":
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/20";

    case "used":
      return "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/20";

    case "expired":
      return "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20";

    case "revoked":
      return "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/30 dark:text-orange-400 dark:ring-orange-400/20";

    default:
      return "bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-400";
  }
};

/* ==================================================
 * STATUS ICON
 * ================================================== */

const statusIcon = (
  status: TokenStatus | null
) => {
  switch (status) {
    case "active":
      return "heroicons:check-circle";

    case "unused":
      return "heroicons:clock";

    case "used":
      return "heroicons:check";

    case "expired":
      return "heroicons:x-circle";

    case "revoked":
      return "heroicons:no-symbol";

    default:
      return "heroicons:minus-circle";
  }
};

/* ==================================================
 * FETCH PURCHASED TOKENS
 * ================================================== */

const fetchPurchasedTokens =
  async () => {
    try {
      tokensLoading.value = true;
      tokensError.value = "";

      const response =
        await useApiFetch<TokensApiResponse>(
          "/token/softwareTokens",
          {
            method: "GET",
          }
        );

      console.log(
        "📥 Purchased tokens:",
        response
      );

      if (!response?.success) {
        tokensError.value =
          response?.message ||
          "Unable to load your subscriptions.";

        purchasedTokens.value = [];

        return;
      }

      if (!response.data) {
        tokensError.value =
          "No subscription data was returned.";

        purchasedTokens.value = [];

        return;
      }

      purchasedTokens.value =
        Array.isArray(
          response.data.tokens
        )
          ? response.data.tokens
          : [];
    } catch (error: any) {
      console.error(
        "❌ Fetch subscriptions error:",
        error
      );

      purchasedTokens.value = [];

      tokensError.value =
        error?.message ||
        "Unable to load your subscriptions.";
    } finally {
      tokensLoading.value = false;
    }
  };

/* ==================================================
 * OPEN PLANS
 * ================================================== */

const openPlans = () => {
  paymentError.value = "";
  selectedPlan.value = null;
  showPlans.value = true;
};

/* ==================================================
 * CLOSE PLANS
 * ================================================== */

const closePlans = () => {
  if (paymentLoading.value) {
    return;
  }

  showPlans.value = false;
  selectedPlan.value = null;
  paymentError.value = "";
};

/* ==================================================
 * SELECT PLAN
 * ================================================== */

const selectPlan = (
  plan: SubscriptionPlan
) => {
  paymentError.value = "";
  selectedPlan.value = plan;
};

/* ==================================================
 * SUBSCRIBE / PAYMENT
 * ================================================== */

const subscribe = async (
  plan: SubscriptionPlan | null
) => {
  if (!plan) {
    return;
  }

  try {
    paymentLoading.value = true;
    paymentError.value = "";

    /*
     * Naira -> Kobo
     *
     * ₦15,000 = 1,500,000 Kobo
     * ₦40,000 = 4,000,000 Kobo
     * ₦120,000 = 12,000,000 Kobo
     */

    const amountInKobo =
      Math.round(
        Number(plan.price) * 100
      );

    const response =
      await useApiFetch<any>(
        "/api/payments/initialize",
        {
          method: "POST",

          body: {
            amount: amountInKobo,

            paymentPurpose:
              "SOFTWARE_TOKEN",

            metadata: {
              plan: plan.name,
              duration: plan.duration,
              subscriptionPlanId:
                plan.id,
            },
          },
        }
      );

    console.log(
      "💳 Payment response:",
      response
    );

    if (!response?.success) {
      paymentError.value =
        response?.message ||
        "Unable to initialize payment.";

      return;
    }

    const data =
      response.data;

    const paymentData =
      data?.data || data;

    const authorizationUrl =
      paymentData?.authorization_url ||
      paymentData?.authorizationUrl;

    if (!authorizationUrl) {
      paymentError.value =
        "Payment URL was not returned by the server.";

      console.error(
        "❌ Missing Paystack URL:",
        response
      );

      return;
    }

    window.location.href =
      authorizationUrl;
  } catch (error: any) {
    console.error(
      "❌ Payment error:",
      error
    );

    paymentError.value =
      error?.message ||
      "Unable to start payment.";
  } finally {
    paymentLoading.value = false;
  }
};

/* ==================================================
 * RENEW
 * ================================================== */

const renewSubscription = () => {
  openPlans();
};

/* ==================================================
 * LOAD
 * ================================================== */

onMounted(async () => {
  await fetchPurchasedTokens();
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 px-1 sm:px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8"
  >
    <div
      class="mx-auto w-full max-w-7xl"
    >

      <!-- ==========================================
           HEADER
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

            <Icon
              name="heroicons:chevron-right"
              class="h-4 w-4 text-gray-400"
            />

            <span
              class="text-sm font-medium text-gray-900 dark:text-white"
            >
              Subscription
            </span>
          </div>

          <h1
            class="mt-3 text-2xl font-bold text-gray-900 dark:text-white"
          >
            Subscription
          </h1>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            Manage your subscription and access
            to the platform.
          </p>
        </div>

        <!-- ACTIVE -->
        <button
          v-if="isActive"
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none"
          @click="renewSubscription"
        >
          <Icon
            name="heroicons:arrow-path"
            class="h-4 w-4"
          />

          Renew Subscription
        </button>

        <!-- NO ACTIVE SUBSCRIPTION -->
        <button
          v-else
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none"
          @click="openPlans"
        >
          <Icon
            name="heroicons:credit-card"
            class="h-4 w-4"
          />

          Subscribe Now
        </button>
      </div>

      <!-- ==========================================
           CURRENT SUBSCRIPTION
           ========================================== -->

     

      <!-- ==========================================
           ALL PURCHASED SUBSCRIPTIONS
           ========================================== -->

      <section
        class="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >

        <div
          class="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6"
        >

          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >

            <div>

              <h2
                class="text-lg font-semibold text-gray-900 dark:text-white"
              >
                My Purchased Subscriptions
              </h2>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                All subscription tokens purchased
                by your account.
              </p>

            </div>

            <span
              class="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
            >
              {{ totalPurchases }}
              {{
                totalPurchases === 1
                  ? "Purchase"
                  : "Purchases"
              }}
            </span>

          </div>

        </div>

        <!-- LOADING -->

        <div
          v-if="tokensLoading"
          class="flex items-center justify-center px-6 py-12"
        >

          <div
            class="flex items-center gap-3"
          >

            <Icon
              name="heroicons:arrow-path"
              class="h-5 w-5 animate-spin text-indigo-600"
            />

            <span
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Loading your subscriptions...
            </span>

          </div>

        </div>

        <!-- ERROR -->

        <div
          v-else-if="tokensError"
          class="m-5 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20"
        >

          <div class="flex gap-3">

            <Icon
              name="heroicons:exclamation-triangle"
              class="h-5 w-5 shrink-0 text-red-600"
            />

            <div>

              <p
                class="text-sm font-semibold text-red-700 dark:text-red-400"
              >
                Unable to load subscriptions
              </p>

              <p
                class="mt-1 text-sm text-red-600 dark:text-red-300"
              >
                {{ tokensError }}
              </p>

            </div>

          </div>

        </div>

        <!-- EMPTY -->

        <div
          v-else-if="purchasedTokens.length === 0"
          class="px-6 py-12 text-center"
        >

          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
          >
            <Icon
              name="heroicons:key"
              class="h-6 w-6 text-gray-400"
            />
          </div>

          <h3
            class="mt-4 text-sm font-semibold text-gray-900 dark:text-white"
          >
            No Purchases Yet
          </h3>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            Your purchased subscription tokens
            will appear here.
          </p>

        </div>

        <!-- PURCHASES -->

        <div
          v-else
          class="divide-y divide-gray-100 dark:divide-gray-800"
        >

          <div
            v-for="token in purchasedTokens"
            :key="token.id"
            class="sm:p-5 p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/40 sm:p-6"
          >

            <div
              class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
            >

              <!-- TOKEN -->

              <div
                class="flex min-w-0 items-start gap-4"
              >

                <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30"
                >
                  <Icon
                    name="heroicons:key"
                    class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div class="min-w-0">

                  <div
                    class="flex flex-wrap items-center gap-2"
                  >

                    <h3
                      class="font-semibold text-gray-900 dark:text-white"
                    >
                      {{ token.plan }}
                      Subscription
                    </h3>

                    <span
                      class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      :class="
                        statusClass(token.status)
                      "
                    >
                      {{
                        statusLabel(
                          token.status
                        )
                      }}
                    </span>

                  </div>

                  <div
                    class="mt-2 flex items-center gap-2"
                  >

                    <Icon
                      name="heroicons:key"
                      class="h-3.5 w-3.5 text-gray-400"
                    />

                    <code
                      class="break-all rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {{ token.token }}
                    </code>

                  </div>

                  <p
                    v-if="token.paymentReference"
                    class="mt-2 text-xs text-gray-400"
                  >
                    Payment:
                    {{ token.paymentReference }}
                  </p>

                </div>

              </div>

              <!-- DETAILS -->

              <div
                class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:min-w-[520px]"
              >

                <!-- AMOUNT -->

                <div>

                  <p
                    class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  >
                    Amount
                  </p>

                  <p
                    class="mt-1 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      formatCurrency(
                        fromKobo(
                          token.amount
                        )
                      )
                    }}
                  </p>

                </div>

                <!-- PURCHASED -->

                <div>

                  <p
                    class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  >
                    Purchased
                  </p>

                  <p
                    class="mt-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{
                      formatDate(
                        token.createdAt
                      )
                    }}
                  </p>

                </div>

                <!-- ACTIVATED -->

                <div>

                  <p
                    class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  >
                    Activated
                  </p>

                  <p
                    class="mt-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{
                      token.activatedAt
                        ? formatDate(
                            token.activatedAt
                          )
                        : "Not activated"
                    }}
                  </p>

                </div>

                <!-- EXPIRES -->

                <div>

                  <p
                    class="text-[11px] font-medium uppercase tracking-wide text-gray-400"
                  >
                    Expires
                  </p>

                  <p
                    class="mt-1 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{
                      token.expiresAt
                        ? formatDate(
                            token.expiresAt
                          )
                        : "No expiry"
                    }}
                  </p>

                </div>

              </div>

            </div>

            <!-- FEATURES -->

            <div
              v-if="token.features?.length"
              class="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800"
            >

              <p
                class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400"
              >
                Included Features
              </p>

              <div
                class="flex flex-wrap gap-2"
              >

                <span
                  v-for="feature in token.features"
                  :key="feature"
                  class="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                >

                  <Icon
                    name="heroicons:check-circle"
                    class="h-3.5 w-3.5 text-green-500"
                  />

                  {{ feature }}

                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      <!-- ==========================================
           ACCESS INFORMATION
           ========================================== -->

      <section
        class="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
      >

        <div class="flex gap-3">

          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30"
          >
            <Icon
              name="heroicons:information-circle"
              class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <div>

            <h3
              class="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Subscription Access
            </h3>

            <p
              class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400"
            >
              Your subscription gives you access
              to the available learning and practice
              features for the duration of your plan.
            </p>

          </div>

        </div>

      </section>

      <!-- ==========================================
           PLANS
           ========================================== -->

      <section
        class="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >

        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-800"
        >

          <div>

            <h2
              class="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Subscription Plans
            </h2>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              Choose a plan that works for you.
            </p>

          </div>

        </div>

        <div
          class="grid grid-cols-1 gap-4 p-5 sm:p-6 lg:grid-cols-3"
        >

          <div
            v-for="plan in plans"
            :key="plan.id"
            class="relative rounded-xl border border-gray-200 p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-indigo-700"
            :class="{
              'border-indigo-500 ring-1 ring-indigo-500 dark:border-indigo-500':
                plan.popular,
            }"
          >

            <!-- POPULAR -->

            <span
              v-if="plan.popular"
              class="absolute right-4 top-4 rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            >
              Popular
            </span>

            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
            >
              <Icon
                name="heroicons:credit-card"
                class="h-5 w-5 text-gray-600 dark:text-gray-300"
              />
            </div>

            <h3
              class="mt-4 text-lg font-semibold text-gray-900 dark:text-white"
            >
              {{ plan.name }}
            </h3>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ plan.description }}
            </p>

            <div class="mt-5">

              <span
                class="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {{ formatCurrency(plan.price) }}
              </span>

              <span
                class="ml-1 text-sm text-gray-500 dark:text-gray-400"
              >
                / {{ plan.duration }}
              </span>

            </div>

            <div
              class="mt-5 space-y-3"
            >

              <div
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start gap-2"
              >

                <Icon
                  name="heroicons:check-circle"
                  class="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                />

                <span
                  class="text-sm text-gray-600 dark:text-gray-400"
                >
                  {{ feature }}
                </span>

              </div>

            </div>

            <button
              type="button"
              class="mt-6 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              :class="{
                'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700':
                  plan.popular,
              }"
              @click="selectPlan(plan)"
            >
              Choose Plan
            </button>

          </div>

        </div>

      </section>

    </div>

    <!-- ==========================================
         MODAL
         ========================================== -->

    <Transition name="fade">

      <div
        v-if="selectedPlan"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
        @click.self="selectedPlan = null"
      >

        <div
          class="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >

          <!-- HEADER -->

          <div
            class="flex items-start justify-between border-b border-gray-200 p-5 dark:border-gray-800"
          >

            <div>

              <h2
                class="text-lg font-bold text-gray-900 dark:text-white"
              >
                Confirm Subscription
              </h2>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                Review your selected plan.
              </p>

            </div>

            <button
              type="button"
              class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="selectedPlan = null"
            >
              <Icon
                name="heroicons:x-mark"
                class="h-5 w-5"
              />
            </button>

          </div>

          <!-- BODY -->

          <div class="p-5">

            <div
              class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
            >

              <div
                class="flex items-center justify-between gap-4"
              >

                <div>

                  <p
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ selectedPlan.name }}
                  </p>

                  <p
                    class="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ selectedPlan.duration }}
                  </p>

                </div>

                <p
                  class="text-lg font-bold text-gray-900 dark:text-white"
                >
                  {{
                    formatCurrency(
                      selectedPlan.price
                    )
                  }}
                </p>

              </div>

            </div>

            <!-- PAYMENT ERROR -->

            <div
              v-if="paymentError"
              class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20"
            >

              <div class="flex gap-3">

                <Icon
                  name="heroicons:exclamation-triangle"
                  class="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                />

                <p
                  class="text-sm text-red-700 dark:text-red-300"
                >
                  {{ paymentError }}
                </p>

              </div>

            </div>

            <div
              class="mt-4 flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/40 dark:bg-indigo-900/20"
            >

              <Icon
                name="heroicons:information-circle"
                class="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400"
              />

              <p
                class="text-sm leading-5 text-indigo-700 dark:text-indigo-300"
              >
                You will be redirected to Paystack
                to complete your payment.
              </p>

            </div>

          </div>

          <!-- FOOTER -->

          <div
            class="flex flex-col-reverse gap-3 border-t border-gray-200 p-5 sm:flex-row sm:justify-end dark:border-gray-800"
          >

            <button
              type="button"
              :disabled="paymentLoading"
              class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="selectedPlan = null"
            >
              Cancel
            </button>

            <button
              type="button"
              :disabled="paymentLoading"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              @click="subscribe(selectedPlan)"
            >

              <Icon
                v-if="paymentLoading"
                name="heroicons:arrow-path"
                class="h-4 w-4 animate-spin"
              />

              <Icon
                v-else
                name="heroicons:credit-card"
                class="h-4 w-4"
              />

              {{
                paymentLoading
                  ? "Processing..."
                  : "Continue to Payment"
              }}

            </button>

          </div>

        </div>

      </div>

    </Transition>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

