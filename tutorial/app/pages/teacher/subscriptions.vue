<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

interface Subscription {
  id: number;
  student: string;
  email: string;
  plan: "Monthly" | "Quarterly" | "Yearly";
  amount: number;
  startedAt: string;
  expiresAt: string;
  status: "Active" | "Pending" | "Expired" | "Cancelled";
}

const subscriptions = ref<Subscription[]>([
  {
    id: 1,
    student: "Amaka Obi",
    email: "amaka@gmail.com",
    plan: "Yearly",
    amount: 25000,
    startedAt: "12 August 2026",
    expiresAt: "12 August 2027",
    status: "Active",
  },
  {
    id: 2,
    student: "Chiamaka Eze",
    email: "chiamaka@gmail.com",
    plan: "Yearly",
    amount: 25000,
    startedAt: "20 July 2026",
    expiresAt: "20 July 2027",
    status: "Active",
  },
  {
    id: 3,
    student: "Tunde Bello",
    email: "tunde@gmail.com",
    plan: "Monthly",
    amount: 3000,
    startedAt: "01 September 2026",
    expiresAt: "01 October 2026",
    status: "Pending",
  },
  {
    id: 4,
    student: "Ibrahim Musa",
    email: "ibrahim@gmail.com",
    plan: "Quarterly",
    amount: 9000,
    startedAt: "18 June 2026",
    expiresAt: "18 September 2026",
    status: "Active",
  },
  {
    id: 5,
    student: "Sarah Williams",
    email: "sarah@gmail.com",
    plan: "Monthly",
    amount: 3000,
    startedAt: "08 September 2026",
    expiresAt: "08 October 2026",
    status: "Pending",
  },
  {
    id: 6,
    student: "Esther Daniel",
    email: "esther@gmail.com",
    plan: "Yearly",
    amount: 25000,
    startedAt: "10 September 2026",
    expiresAt: "10 September 2027",
    status: "Active",
  },
  {
    id: 7,
    student: "David Okon",
    email: "david@gmail.com",
    plan: "Yearly",
    amount: 25000,
    startedAt: "15 May 2026",
    expiresAt: "15 May 2027",
    status: "Expired",
  },
  {
    id: 8,
    student: "Michael James",
    email: "michael@gmail.com",
    plan: "Monthly",
    amount: 3000,
    startedAt: "25 August 2026",
    expiresAt: "25 September 2026",
    status: "Cancelled",
  },
]);

const columns = [
  { key: "student", label: "Student" },
  { key: "plan", label: "Plan" },
  { key: "amount", label: "Amount" },
  { key: "startedAt", label: "Started" },
  { key: "expiresAt", label: "Expires" },
  { key: "status", label: "Status" },
];

const selectedStatus = ref("All Status");

const statuses = [
  "All Status",
  "Active",
  "Pending",
  "Expired",
  "Cancelled",
];

const filteredSubscriptions = computed(() => {
  if (selectedStatus.value === "All Status") {
    return subscriptions.value;
  }

  return subscriptions.value.filter(
    (subscription) => subscription.status === selectedStatus.value
  );
});

const activeCount = computed(
  () =>
    subscriptions.value.filter(
      (subscription) => subscription.status === "Active"
    ).length
);

const pendingCount = computed(
  () =>
    subscriptions.value.filter(
      (subscription) => subscription.status === "Pending"
    ).length
);

const expiredCount = computed(
  () =>
    subscriptions.value.filter(
      (subscription) => subscription.status === "Expired"
    ).length
);

const totalRevenue = computed(() =>
  subscriptions.value
    .filter((subscription) => subscription.status === "Active")
    .reduce((total, subscription) => total + subscription.amount, 0)
);

const stats = computed(() => [
  {
    label: "Active",
    value: activeCount.value,
    icon: "i-heroicons-check-circle",
    color: "green" as const,
  },
  {
    label: "Pending",
    value: pendingCount.value,
    icon: "i-heroicons-clock",
    color: "amber" as const,
  },
  {
    label: "Expired",
    value: expiredCount.value,
    icon: "i-heroicons-x-circle",
    color: "rose" as const,
  },
  {
    label: "Active Value",
    value: formatCurrency(totalRevenue.value),
    icon: "i-heroicons-banknotes",
    color: "indigo" as const,
  },
]);

const statusStyles: Record<string, string> = {
  Active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Expired:
    "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",

  Cancelled:
    "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
};

const planStyles: Record<string, string> = {
  Monthly:
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

  Quarterly:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",

  Yearly:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

function avatarColor(name: string) {
  const sum = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return avatarColors[sum % avatarColors.length];
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
    >
      <div>
        <h1
          class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight"
        >
          Subscriptions
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Manage your students' subscriptions and plans
        </p>
      </div>

      <button
        class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
      >
        <Icon name="i-heroicons-plus" class="w-4 h-4" />
        Add Subscription
      </button>
    </div>

    <UiDataList
      :items="filteredSubscriptions"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No subscriptions found"
    >
      <!-- Filter -->
      <template #filters>
        <select
          v-model="selectedStatus"
          class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
        >
          <option
            v-for="status in statuses"
            :key="status"
            :value="status"
          >
            {{ status }}
          </option>
        </select>
      </template>

      <!-- Student -->
      <template #cell-student="{ item }">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :class="avatarColor(item.student)"
          >
            {{ initials(item.student) }}
          </div>

          <div class="min-w-0">
            <p
              class="font-medium text-gray-900 dark:text-white truncate"
            >
              {{ item.student }}
            </p>

            <p class="text-xs text-gray-400 truncate">
              {{ item.email }}
            </p>
          </div>
        </div>
      </template>

      <!-- Plan -->
      <template #cell-plan="{ item }">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
          :class="planStyles[item.plan]"
        >
          {{ item.plan }}
        </span>
      </template>

      <!-- Amount -->
      <template #cell-amount="{ item }">
        <span
          class="font-semibold text-gray-900 dark:text-white"
        >
          {{ formatCurrency(item.amount) }}
        </span>
      </template>

      <!-- Started -->
      <template #cell-startedAt="{ item }">
        <span
          class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300"
        >
          <Icon
            name="i-heroicons-calendar-days"
            class="w-4 h-4 text-gray-400"
          />

          {{ item.startedAt }}
        </span>
      </template>

      <!-- Expires -->
      <template #cell-expiresAt="{ item }">
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ item.expiresAt }}
        </span>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <span
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="statusStyles[item.status]"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="{
              'bg-green-500': item.status === 'Active',
              'bg-amber-500': item.status === 'Pending',
              'bg-gray-400': item.status === 'Expired',
              'bg-rose-500': item.status === 'Cancelled',
            }"
          />

          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <template #actions_row="{ item }">
        <button
          title="View subscription"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
        >
          <Icon name="i-heroicons-eye" class="w-4 h-4" />
        </button>

        <button
          title="Edit subscription"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
        </button>
      </template>
    </UiDataList>
  </div>
</template>