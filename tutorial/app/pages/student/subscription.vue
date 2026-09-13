<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Types
 * -------------------------------------------------- */

type SubscriptionStatus = "Active" | "Pending" | "Expired" | "Cancelled";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  popular?: boolean;
  features: string[];
}

interface CurrentSubscription {
  plan: string;
  amount: number;
  startedAt: string;
  expiresAt: string;
  status: SubscriptionStatus;
  reference: string;
}

/* --------------------------------------------------
 * State
 * -------------------------------------------------- */

const showPlans = ref(false);
const selectedPlan = ref<SubscriptionPlan | null>(null);

/* --------------------------------------------------
 * Current Subscription
 * -------------------------------------------------- */

const currentSubscription = ref<CurrentSubscription>({
  plan: "JAMB CBT Subscription",
  amount: 15000,
  startedAt: "12 September 2026",
  expiresAt: "12 October 2026",
  status: "Active",
  reference: "SUB-2026-001",
});

/* --------------------------------------------------
 * Subscription Plans
 * -------------------------------------------------- */

const plans = ref<SubscriptionPlan[]>([
  {
    id: 1,
    name: "Monthly",
    description: "Access the platform for one month.",
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
    description: "Enjoy access for three months.",
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
    description: "Get full access for one year.",
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

/* --------------------------------------------------
 * Computed
 * -------------------------------------------------- */

const isActive = computed(() => currentSubscription.value.status === "Active");

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

const statusClass = (status: SubscriptionStatus) => {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20";

    case "Pending":
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/20";

    case "Expired":
      return "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20";

    case "Cancelled":
      return "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/20";
  }
};

const statusIcon = (status: SubscriptionStatus) => {
  switch (status) {
    case "Active":
      return "heroicons:check-circle";

    case "Pending":
      return "heroicons:clock";

    case "Expired":
      return "heroicons:x-circle";

    case "Cancelled":
      return "heroicons:minus-circle";
  }
};

/* --------------------------------------------------
 * Actions
 * -------------------------------------------------- */

const openPlans = () => {
  showPlans.value = true;
};

const closePlans = () => {
  showPlans.value = false;
  selectedPlan.value = null;
};

const selectPlan = (plan: SubscriptionPlan) => {
  selectedPlan.value = plan;
};

const subscribe = (plan: SubscriptionPlan) => {
  console.log("Subscribe to:", plan);

  // Connect your payment/subscription API here.
  //
  // Example:
  //
  // await $fetch("/api/student/subscription", {
  //   method: "POST",
  //   body: {
  //     planId: plan.id,
  //   },
  // });
};

const renewSubscription = () => {
  openPlans();
};
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
              Subscription
            </span>
          </div>

          <h1 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
            Subscription
          </h1>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your subscription and access to the platform.
          </p>
        </div>

        <button
          v-if="isActive"
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          @click="renewSubscription"
        >
          <Icon name="heroicons:arrow-path" class="h-4 w-4" />

          Renew Subscription
        </button>

        <button
          v-else
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          @click="openPlans"
        >
          <Icon name="heroicons:credit-card" class="h-4 w-4" />

          Subscribe Now
        </button>
      </div>

      <!-- ==========================================
           CURRENT SUBSCRIPTION
           ========================================== -->

      <section
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Header -->
        <div class="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-3">
              <div
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30"
              >
                <Icon
                  name="heroicons:credit-card"
                  class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
                />
              </div>

              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Subscription
                </h2>

                <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  Your current subscription details.
                </p>
              </div>
            </div>

            <span
              class="inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset"
              :class="statusClass(currentSubscription.status)"
            >
              <Icon :name="statusIcon(currentSubscription.status)" class="h-3.5 w-3.5" />

              {{ currentSubscription.status }}
            </span>
          </div>
        </div>

        <!-- Subscription Details -->
        <div class="p-5 sm:p-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Plan -->
            <div>
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Plan
              </p>

              <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                {{ currentSubscription.plan }}
              </p>
            </div>

            <!-- Amount -->
            <div>
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Amount
              </p>

              <p class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatCurrency(currentSubscription.amount) }}
              </p>
            </div>

            <!-- Started -->
            <div>
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Started
              </p>

              <p class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ currentSubscription.startedAt }}
              </p>
            </div>

            <!-- Expires -->
            <div>
              <p
                class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Expires
              </p>

              <p class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {{ currentSubscription.expiresAt }}
              </p>
            </div>
          </div>

          <!-- Reference -->
          <div
            class="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-center gap-2">
              <Icon name="heroicons:hashtag" class="h-4 w-4 text-gray-400" />

              <span class="text-xs text-gray-500 dark:text-gray-400">
                Subscription Reference
              </span>
            </div>

            <code class="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {{ currentSubscription.reference }}
            </code>
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
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
              Subscription Access
            </h3>

            <p class="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Your subscription gives you access to the available learning and practice
              features for the duration of your plan.
            </p>
          </div>
        </div>
      </section>

      <!-- ==========================================
           AVAILABLE PLANS
           ========================================== -->

      <section
        class="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-gray-800"
        >
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Subscription Plans
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose a plan that works for you.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 p-5 sm:p-6 lg:grid-cols-3">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="relative rounded-xl border border-gray-200 p-5 transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-indigo-700"
            :class="{
              'border-indigo-500 ring-1 ring-indigo-500 dark:border-indigo-500':
                plan.popular,
            }"
          >
            <!-- Popular -->
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

            <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {{ plan.name }}
            </h3>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ plan.description }}
            </p>

            <div class="mt-5">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatCurrency(plan.price) }}
              </span>

              <span class="ml-1 text-sm text-gray-500 dark:text-gray-400">
                / {{ plan.duration }}
              </span>
            </div>

            <!-- Features -->
            <div class="mt-5 space-y-3">
              <div
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start gap-2"
              >
                <Icon
                  name="heroicons:check-circle"
                  class="mt-0.5 h-4 w-4 shrink-0 text-green-500"
                />

                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ feature }}
                </span>
              </div>
            </div>

            <!-- Button -->
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
         PLAN CONFIRMATION MODAL
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
          <!-- Modal Header -->
          <div
            class="flex items-start justify-between border-b border-gray-200 p-5 dark:border-gray-800"
          >
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                Confirm Subscription
              </h2>

              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review your selected plan.
              </p>
            </div>

            <button
              type="button"
              class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="selectedPlan = null"
            >
              <Icon name="heroicons:x-mark" class="h-5 w-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5">
            <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ selectedPlan.name }}
                  </p>

                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ selectedPlan.duration }}
                  </p>
                </div>

                <p class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(selectedPlan.price) }}
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

              <p class="text-sm leading-5 text-indigo-700 dark:text-indigo-300">
                You will be redirected to the payment process to complete your
                subscription.
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div
            class="flex flex-col-reverse gap-3 border-t border-gray-200 p-5 sm:flex-row sm:justify-end dark:border-gray-800"
          >
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="selectedPlan = null"
            >
              Cancel
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              @click="subscribe(selectedPlan)"
            >
              <Icon name="heroicons:credit-card" class="h-4 w-4" />

              Continue to Payment
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
