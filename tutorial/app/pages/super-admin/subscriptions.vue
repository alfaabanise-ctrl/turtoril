<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

interface Subscription {
  id: number;
  student: string;
  email: string;
  phone: string;
  plan: "Monthly" | "Quarterly" | "Yearly";
  amount: number;
  paid: boolean;
  referredBy: string;
  admin: string;
  startedAt: string;
  expiresAt: string;
  status: "Active" | "Pending" | "Expired" | "Cancelled";
}

const subscriptions = ref<Subscription[]>([
  {
    id: 1,
    student: "Amaka Obi",
    email: "amaka@gmail.com",
    phone: "0803 123 4567",
    plan: "Yearly",
    amount: 25000,
    paid: true,
    referredBy: "Mr. Okafor",
    admin: "John Admin",
    startedAt: "12 August 2026",
    expiresAt: "12 August 2027",
    status: "Active",
  },
  {
    id: 2,
    student: "Tunde Bello",
    email: "tunde@gmail.com",
    phone: "0805 987 6543",
    plan: "Monthly",
    amount: 3000,
    paid: false,
    referredBy: "Mrs. Adaeze",
    admin: "Sarah Williams",
    startedAt: "01 September 2026",
    expiresAt: "01 October 2026",
    status: "Pending",
  },
  {
    id: 3,
    student: "Chiamaka Eze",
    email: "chiamaka@gmail.com",
    phone: "0812 456 7890",
    plan: "Yearly",
    amount: 25000,
    paid: true,
    referredBy: "Mr. Okafor",
    admin: "John Admin",
    startedAt: "20 July 2026",
    expiresAt: "20 July 2027",
    status: "Active",
  },
  {
    id: 4,
    student: "David Okon",
    email: "david@gmail.com",
    phone: "0701 222 3344",
    plan: "Quarterly",
    amount: 8500,
    paid: false,
    referredBy: "Admin Bello",
    admin: "Michael Brown",
    startedAt: "15 May 2026",
    expiresAt: "15 August 2026",
    status: "Expired",
  },
  {
    id: 5,
    student: "Blessing Johnson",
    email: "blessing@gmail.com",
    phone: "0806 456 7812",
    plan: "Yearly",
    amount: 25000,
    paid: true,
    referredBy: "Mr. Adewale",
    admin: "Sarah Williams",
    startedAt: "24 August 2026",
    expiresAt: "24 August 2027",
    status: "Active",
  },
  {
    id: 6,
    student: "Ibrahim Musa",
    email: "ibrahim@gmail.com",
    phone: "0814 678 9012",
    plan: "Quarterly",
    amount: 8500,
    paid: true,
    referredBy: "Mr. Yusuf",
    admin: "David Anderson",
    startedAt: "29 August 2026",
    expiresAt: "29 November 2026",
    status: "Active",
  },
  {
    id: 7,
    student: "Sarah James",
    email: "sarah@gmail.com",
    phone: "0705 234 5678",
    plan: "Monthly",
    amount: 3000,
    paid: false,
    referredBy: "Mrs. Adaeze",
    admin: "John Admin",
    startedAt: "03 September 2026",
    expiresAt: "03 October 2026",
    status: "Pending",
  },
  {
    id: 8,
    student: "Daniel Okafor",
    email: "daniel@gmail.com",
    phone: "0809 345 6789",
    plan: "Yearly",
    amount: 25000,
    paid: true,
    referredBy: "Mr. Okafor",
    admin: "Michael Brown",
    startedAt: "18 August 2026",
    expiresAt: "18 August 2027",
    status: "Active",
  },
  {
    id: 9,
    student: "Grace Thompson",
    email: "grace@gmail.com",
    phone: "0802 456 7890",
    plan: "Monthly",
    amount: 3000,
    paid: true,
    referredBy: "Mr. Adewale",
    admin: "Sarah Williams",
    startedAt: "25 August 2026",
    expiresAt: "25 September 2026",
    status: "Active",
  },
  {
    id: 10,
    student: "Emeka Nwosu",
    email: "emeka@gmail.com",
    phone: "0816 789 0123",
    plan: "Quarterly",
    amount: 8500,
    paid: false,
    referredBy: "Mr. Yusuf",
    admin: "David Anderson",
    startedAt: "10 June 2026",
    expiresAt: "10 September 2026",
    status: "Cancelled",
  },
]);

const columns = [
  { key: "student", label: "Student" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Amount" },
  { key: "paid", label: " " },
  { key: "referredBy", label: "Agent / Teacher" },
  { key: "admin", label: "Admin" },
  { key: "startedAt", label: "Started" },
  { key: "expiresAt", label: "Expires" },
  { key: "status", label: "Status" },
];

const search = ref("");
const selectedPlan = ref("All Plans");
const selectedStatus = ref("All Status");
const selectedPayment = ref("All Payments");

const plans = ["All Plans", "Monthly", "Quarterly", "Yearly"];

const statuses = ["All Status", "Active", "Pending", "Expired", "Cancelled"];

const paymentFilters = ["All Payments", "Paid", "Unpaid"];

const filteredSubscriptions = computed(() => {
  const query = search.value.trim().toLowerCase();

  return subscriptions.value.filter((subscription) => {
    const matchesSearch =
      !query ||
      subscription.student.toLowerCase().includes(query) ||
      subscription.email.toLowerCase().includes(query) ||
      subscription.phone.toLowerCase().includes(query) ||
      subscription.referredBy.toLowerCase().includes(query) ||
      subscription.admin.toLowerCase().includes(query);

    const matchesPlan =
      selectedPlan.value === "All Plans" || subscription.plan === selectedPlan.value;

    const matchesStatus =
      selectedStatus.value === "All Status" ||
      subscription.status === selectedStatus.value;

    const matchesPayment =
      selectedPayment.value === "All Payments" ||
      (selectedPayment.value === "Paid" && subscription.paid) ||
      (selectedPayment.value === "Unpaid" && !subscription.paid);

    return matchesSearch && matchesPlan && matchesStatus && matchesPayment;
  });
});

const activeCount = computed(
  () =>
    subscriptions.value.filter((subscription) => subscription.status === "Active").length
);

const pendingCount = computed(
  () =>
    subscriptions.value.filter((subscription) => subscription.status === "Pending").length
);

const expiredCount = computed(
  () =>
    subscriptions.value.filter((subscription) => subscription.status === "Expired").length
);

const cancelledCount = computed(
  () =>
    subscriptions.value.filter((subscription) => subscription.status === "Cancelled")
      .length
);

const paidCount = computed(
  () => subscriptions.value.filter((subscription) => subscription.paid).length
);

const unpaidCount = computed(
  () => subscriptions.value.filter((subscription) => !subscription.paid).length
);

const totalRevenue = computed(() =>
  subscriptions.value
    .filter((subscription) => subscription.paid)
    .reduce((total, subscription) => total + subscription.amount, 0)
);

const pendingRevenue = computed(() =>
  subscriptions.value
    .filter((subscription) => !subscription.paid && subscription.status === "Pending")
    .reduce((total, subscription) => total + subscription.amount, 0)
);

const paymentRate = computed(() => {
  if (!subscriptions.value.length) return 0;

  return Math.round((paidCount.value / subscriptions.value.length) * 100);
});

const stats = computed(() => [
  {
    label: "Total Subscriptions",
    value: subscriptions.value.length,
    icon: "i-heroicons-credit-card",
  },
  {
    label: "Active",
    value: activeCount.value,
    icon: "i-heroicons-check-circle",
  },
  {
    label: "Paid",
    value: paidCount.value,
    icon: "i-heroicons-banknotes",
  },
  {
    label: "Revenue",
    value: formatCurrency(totalRevenue.value),
    icon: "i-heroicons-chart-bar",
  },
]);

const statusStyles: Record<Subscription["status"], string> = {
  Active:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-400",

  Pending:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400",

  Expired:
    "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-gray-800 dark:text-gray-400",

  Cancelled:
    "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10 dark:bg-rose-500/10 dark:text-rose-400",
};

const planStyles: Record<Subscription["plan"], string> = {
  Monthly: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400",

  Quarterly: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",

  Yearly: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
};

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

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(name: string) {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return avatarColors[sum % avatarColors.length];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function statusDot(status: Subscription["status"]) {
  const dots: Record<Subscription["status"], string> = {
    Active: "bg-emerald-500",
    Pending: "bg-amber-500",
    Expired: "bg-gray-400",
    Cancelled: "bg-rose-500",
  };

  return dots[status];
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <Icon name="i-heroicons-credit-card" class="w-3.5 h-3.5" />

            Billing & Subscriptions
          </span>
        </div>

        <h1
          class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight"
        >
          Subscriptions
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Manage student subscriptions, payments and access periods.
        </p>
      </div>

      <button
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <Icon name="i-heroicons-plus" class="w-4 h-4" />

        Add Subscription
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-medium text-gray-400">
              {{ stat.label }}
            </p>

            <p
              class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-1"
            >
              {{ stat.value }}
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon :name="stat.icon" class="w-4.5 h-4.5 text-indigo-500" />
          </div>
        </div>
      </div>
    </div>

    <!-- Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Payment overview -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-xs font-medium text-gray-400">Payment Overview</p>

            <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {{ paymentRate }}% paid
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-banknotes" class="w-4.5 h-4.5 text-emerald-500" />
          </div>
        </div>

        <div class="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div
            class="h-full rounded-full bg-emerald-500 transition-all"
            :style="{ width: `${paymentRate}%` }"
          />
        </div>

        <div class="flex items-center justify-between mt-2 text-xs">
          <span class="text-emerald-600 dark:text-emerald-400">
            {{ paidCount }} Paid
          </span>

          <span class="text-gray-400"> {{ unpaidCount }} Unpaid </span>
        </div>
      </div>

      <!-- Subscription status -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-xs font-medium text-gray-400">Subscription Status</p>

            <p class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {{ activeCount }} Active
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-signal" class="w-4.5 h-4.5 text-indigo-500" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {{ pendingCount }} Pending
          </span>

          <span class="flex items-center gap-1.5 text-gray-400">
            <span class="w-1.5 h-1.5 rounded-full bg-gray-400" />
            {{ expiredCount }} Expired
          </span>

          <span class="flex items-center gap-1.5 text-rose-500">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500" />
            {{ cancelledCount }} Cancelled
          </span>
        </div>
      </div>

      <!-- Revenue -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-gray-400">Revenue</p>

            <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {{ formatCurrency(totalRevenue) }}
            </p>
          </div>

          <div
            class="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-chart-bar" class="w-4.5 h-4.5 text-violet-500" />
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          {{ formatCurrency(pendingRevenue) }} pending payment
        </p>
      </div>
    </div>

    <!-- Subscription table -->
    <UiDataList
      :items="filteredSubscriptions"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No subscriptions found"
    >
      <!-- Filters -->
      <template #filters>
        <div class="flex flex-col sm:flex-row gap-2 w-full">
          <!-- Search -->
          <div class="relative flex-1 min-w-[220px]">
            <Icon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />

            <input
              v-model="search"
              type="text"
              placeholder="Search subscriptions..."
              class="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-9 pr-3 py-2.5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </div>

          <!-- Plan -->
          <select
            v-model="selectedPlan"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option v-for="plan in plans" :key="plan">
              {{ plan }}
            </option>
          </select>

          <!-- Payment -->
          <select
            v-model="selectedPayment"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option v-for="payment in paymentFilters" :key="payment">
              {{ payment }}
            </option>
          </select>

          <!-- Status -->
          <select
            v-model="selectedStatus"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option v-for="status in statuses" :key="status">
              {{ status }}
            </option>
          </select>
        </div>
      </template>

      <!-- Student -->
      <template #cell-student="{ item }">
        <div class="flex items-center gap-3 min-w-[260px]">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm"
            :class="avatarColor(item.student)"
          >
            {{ initials(item.student) }}
          </div>

          <div class="min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white truncate">
              {{ item.student }}
            </p>

            <div class="flex items-center gap-1.5 mt-0.5">
              <Icon
                name="i-heroicons-envelope"
                class="w-3.5 h-3.5 text-gray-400 shrink-0"
              />

              <p class="text-xs text-gray-400 truncate">
                {{ item.email }}
              </p>
            </div>

            <div class="flex items-center gap-1.5 mt-0.5">
              <Icon name="i-heroicons-phone" class="w-3.5 h-3.5 text-gray-400 shrink-0" />

              <p class="text-xs text-gray-400">
                {{ item.phone }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Plan -->
      <template #cell-plan="{ item }">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
          :class="planStyles[item.plan]"
        >
          <Icon name="i-heroicons-sparkles" class="w-3.5 h-3.5" />

          {{ item.plan }}
        </span>
      </template>

      <!-- Amount -->
      <template #cell-amount="{ item }">
        <div class="min-w-[100px]">
          <p class="font-semibold text-gray-900 dark:text-white">
            {{ formatCurrency(item.amount) }}
          </p>

          <p class="text-[11px] text-gray-400 mt-0.5">{{ item.plan }} plan</p>
        </div>
      </template>

      <!-- Paid -->
      <template #cell-paid="{ item }">
        <div class="flex items-center justify-center">
          <span
            v-if="item.paid"
            class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10"
            title="Paid"
          >
            <Icon name="i-heroicons-check" class="w-4 h-4 text-emerald-500" />
          </span>

          <span
            v-else
            class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800"
            title="Not paid"
          >
            <Icon name="i-heroicons-minus" class="w-4 h-4 text-gray-400" />
          </span>
        </div>
      </template>

      <!-- Agent / Teacher -->
      <template #cell-referredBy="{ item }">
        <div class="flex items-center gap-2 min-w-[170px]">
          <div
            class="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0"
          >
            <Icon name="i-heroicons-user" class="w-4 h-4 text-indigo-500" />
          </div>

          <div class="min-w-0">
            <p class="font-medium text-gray-700 dark:text-gray-200 truncate">
              {{ item.referredBy }}
            </p>

            <p class="text-[11px] text-gray-400">Agent / Teacher</p>
          </div>
        </div>
      </template>

      <!-- Admin -->
      <template #cell-admin="{ item }">
        <div class="flex items-center gap-2 min-w-[150px]">
          <div
            class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0"
          >
            <Icon name="i-heroicons-shield-check" class="w-4 h-4 text-emerald-500" />
          </div>

          <div class="min-w-0">
            <p class="font-medium text-gray-700 dark:text-gray-200 truncate">
              {{ item.admin }}
            </p>

            <p class="text-[11px] text-gray-400">Administrator</p>
          </div>
        </div>
      </template>

      <!-- Started -->
      <template #cell-startedAt="{ item }">
        <span
          class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
        >
          <Icon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />

          {{ item.startedAt }}
        </span>
      </template>

      <!-- Expires -->
      <template #cell-expiresAt="{ item }">
        <span
          class="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap"
        >
          <Icon name="i-heroicons-calendar" class="w-4 h-4 text-gray-400" />

          {{ item.expiresAt }}
        </span>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
          :class="statusStyles[item.status]"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(item.status)" />

          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #actions_row="{ item }">
        <button
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
          title="View subscription"
        >
          <Icon name="i-heroicons-eye" class="w-4 h-4" />
        </button>

        <button
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ml-1"
          title="Edit subscription"
        >
          <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
        </button>

        <button
          class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
          title="Cancel subscription"
        >
          <Icon name="i-heroicons-x-circle" class="w-4 h-4" />
        </button>
      </template>
    </UiDataList>
  </div>
</template>
