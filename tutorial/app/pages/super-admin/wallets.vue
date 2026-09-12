<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

interface Wallet {
  id: number;
  owner: string;
  email: string;
  type: "Admin" | "Teacher" | "Agent";
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  status: "Active" | "Suspended";
  updatedAt: string;
}

const wallets = ref<Wallet[]>([
  {
    id: 1,
    owner: "John Admin",
    email: "john.admin@example.com",
    type: "Admin",
    balance: 485000,
    totalEarned: 1250000,
    totalWithdrawn: 765000,
    status: "Active",
    updatedAt: "12 Sep 2026, 10:42 AM",
  },
  {
    id: 2,
    owner: "Sarah Williams",
    email: "sarah.williams@example.com",
    type: "Admin",
    balance: 326500,
    totalEarned: 980000,
    totalWithdrawn: 653500,
    status: "Active",
    updatedAt: "12 Sep 2026, 09:18 AM",
  },
  {
    id: 3,
    owner: "Mr. Okafor",
    email: "okafor.teacher@example.com",
    type: "Teacher",
    balance: 184500,
    totalEarned: 540000,
    totalWithdrawn: 355500,
    status: "Active",
    updatedAt: "11 Sep 2026, 06:35 PM",
  },
  {
    id: 4,
    owner: "Mrs. Adaeze",
    email: "adaeze.teacher@example.com",
    type: "Teacher",
    balance: 142000,
    totalEarned: 420000,
    totalWithdrawn: 278000,
    status: "Active",
    updatedAt: "11 Sep 2026, 03:27 PM",
  },
  {
    id: 5,
    owner: "Mr. Adewale",
    email: "adewale.teacher@example.com",
    type: "Teacher",
    balance: 98500,
    totalEarned: 315000,
    totalWithdrawn: 216500,
    status: "Active",
    updatedAt: "10 Sep 2026, 01:12 PM",
  },
  {
    id: 6,
    owner: "Referral Agent 01",
    email: "agent01@example.com",
    type: "Agent",
    balance: 76500,
    totalEarned: 210000,
    totalWithdrawn: 133500,
    status: "Active",
    updatedAt: "10 Sep 2026, 11:45 AM",
  },
  {
    id: 7,
    owner: "Referral Agent 02",
    email: "agent02@example.com",
    type: "Agent",
    balance: 45200,
    totalEarned: 165000,
    totalWithdrawn: 119800,
    status: "Suspended",
    updatedAt: "08 Sep 2026, 04:21 PM",
  },
  {
    id: 8,
    owner: "Mr. Yusuf",
    email: "yusuf.teacher@example.com",
    type: "Teacher",
    balance: 87200,
    totalEarned: 285000,
    totalWithdrawn: 197800,
    status: "Active",
    updatedAt: "09 Sep 2026, 02:16 PM",
  },
  {
    id: 9,
    owner: "Admin Bello",
    email: "admin.bello@example.com",
    type: "Admin",
    balance: 267000,
    totalEarned: 745000,
    totalWithdrawn: 478000,
    status: "Active",
    updatedAt: "12 Sep 2026, 08:52 AM",
  },
  {
    id: 10,
    owner: "Mr. Emeka",
    email: "emeka.teacher@example.com",
    type: "Teacher",
    balance: 64300,
    totalEarned: 198000,
    totalWithdrawn: 133700,
    status: "Active",
    updatedAt: "07 Sep 2026, 05:41 PM",
  },
]);

const columns = [
  { key: "owner", label: "Wallet Owner" },
  { key: "type", label: "Type" },
  { key: "balance", label: "Balance" },
  { key: "totalEarned", label: "Total Earned" },
  { key: "totalWithdrawn", label: "Withdrawn" },
  { key: "status", label: "Status" },
];

const selectedType = ref("All Types");
const selectedStatus = ref("All Status");

const types = ["All Types", "Admin", "Teacher", "Agent"];

const statuses = ["All Status", "Active", "Suspended"];

const filteredWallets = computed(() => {
  return wallets.value.filter((wallet) => {
    const typeMatch =
      selectedType.value === "All Types" || wallet.type === selectedType.value;

    const statusMatch =
      selectedStatus.value === "All Status" || wallet.status === selectedStatus.value;

    return typeMatch && statusMatch;
  });
});

const totalBalance = computed(() =>
  wallets.value.reduce((sum, wallet) => sum + wallet.balance, 0)
);

const totalEarned = computed(() =>
  wallets.value.reduce((sum, wallet) => sum + wallet.totalEarned, 0)
);

const totalWithdrawn = computed(() =>
  wallets.value.reduce((sum, wallet) => sum + wallet.totalWithdrawn, 0)
);

const activeWallets = computed(
  () => wallets.value.filter((wallet) => wallet.status === "Active").length
);

const suspendedWallets = computed(
  () => wallets.value.filter((wallet) => wallet.status === "Suspended").length
);

const stats = computed(() => [
  {
    label: "Total Balance",
    value: formatCurrency(totalBalance.value),
    icon: "i-heroicons-wallet",
    color: "indigo" as const,
  },
  {
    label: "Total Earned",
    value: formatCurrency(totalEarned.value),
    icon: "i-heroicons-arrow-trending-up",
    color: "green" as const,
  },
  {
    label: "Total Withdrawn",
    value: formatCurrency(totalWithdrawn.value),
    icon: "i-heroicons-arrow-trending-down",
    color: "amber" as const,
  },
  {
    label: "Active Wallets",
    value: activeWallets.value,
    icon: "i-heroicons-check-circle",
    color: "blue" as const,
  },
]);

const walletTypeStyles: Record<string, string> = {
  Admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

  Teacher: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

  Agent: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
};

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Suspended: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
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
  const sum = name.split("").reduce((acc, character) => acc + character.charCodeAt(0), 0);

  return avatarColors[sum % avatarColors.length];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCompactCurrency(amount: number) {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }

  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(1)}K`;
  }

  return `₦${amount}`;
}

function walletTypeIcon(type: Wallet["type"]) {
  if (type === "Admin") {
    return "i-heroicons-shield-check";
  }

  if (type === "Teacher") {
    return "i-heroicons-academic-cap";
  }

  return "i-heroicons-user-group";
}

function walletTypeIconColor(type: Wallet["type"]) {
  if (type === "Admin") {
    return "text-indigo-500";
  }

  if (type === "Teacher") {
    return "text-emerald-500";
  }

  return "text-violet-500";
}

function balancePercentage(wallet: Wallet) {
  if (!wallet.totalEarned) return 0;

  return Math.min(100, Math.round((wallet.balance / wallet.totalEarned) * 100));
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2">
          <div
            class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-wallet"
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />
          </div>

          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Wallets
          </h1>
        </div>

        <p class="text-sm text-gray-400 mt-1">
          Manage admin, teacher and referral agent wallets
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
          Refresh
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Icon name="i-heroicons-banknotes" class="w-4 h-4" />
          Wallet Report
        </button>
      </div>
    </div>

    <!-- Wallet Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Balance</p>

            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {{ formatCompactCurrency(totalBalance) }}
            </p>

            <p class="text-xs text-gray-400 mt-1">
              {{ formatCurrency(totalBalance) }}
            </p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-wallet"
              class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
            />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Earned</p>

            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {{ formatCompactCurrency(totalEarned) }}
            </p>

            <p class="text-xs text-emerald-500 mt-1">Lifetime wallet earnings</p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-arrow-trending-up"
              class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-400">Total Withdrawn</p>

            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {{ formatCompactCurrency(totalWithdrawn) }}
            </p>

            <p class="text-xs text-gray-400 mt-1">Money paid out</p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-arrow-up-right"
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-gray-400">Active Wallets</p>

            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {{ activeWallets }}
            </p>

            <p class="text-xs text-gray-400 mt-1">{{ suspendedWallets }} suspended</p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center"
          >
            <Icon
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Table -->
    <UiDataList
      :items="filteredWallets"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No wallets found"
    >
      <template #filters>
        <div class="flex flex-wrap items-center gap-2">
          <!-- Type -->
          <select
            v-model="selectedType"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option v-for="type in types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>

          <!-- Status -->
          <select
            v-model="selectedStatus"
            class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
      </template>

      <!-- Owner -->
      <template #cell-owner="{ item }">
        <div class="flex items-center gap-3 min-w-[230px]">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :class="avatarColor(item.owner)"
          >
            {{ initials(item.owner) }}
          </div>

          <div class="min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">
              {{ item.owner }}
            </p>

            <p class="text-xs text-gray-400 truncate mt-0.5">
              {{ item.email }}
            </p>

            <p class="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <Icon name="i-heroicons-clock" class="w-3 h-3" />
              {{ item.updatedAt }}
            </p>
          </div>
        </div>
      </template>

      <!-- Type -->
      <template #cell-type="{ item }">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="walletTypeStyles[item.type]"
        >
          <Icon :name="walletTypeIcon(item.type)" class="w-3.5 h-3.5" />
          {{ item.type }}
        </span>
      </template>

      <!-- Balance -->
      <template #cell-balance="{ item }">
        <div class="min-w-[150px]">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ formatCurrency(item.balance) }}
            </span>
          </div>

          <div class="flex items-center gap-2 mt-1.5">
            <div
              class="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-indigo-500 rounded-full transition-all"
                :style="{
                  width: `${balancePercentage(item)}%`,
                }"
              />
            </div>

            <span class="text-[11px] text-gray-400">
              {{ balancePercentage(item) }}%
            </span>
          </div>

          <p class="text-[11px] text-gray-400 mt-1">Available balance</p>
        </div>
      </template>

      <!-- Total Earned -->
      <template #cell-totalEarned="{ item }">
        <div>
          <p class="font-semibold text-emerald-600 dark:text-emerald-400">
            {{ formatCurrency(item.totalEarned) }}
          </p>

          <p class="text-[11px] text-gray-400 mt-0.5">Lifetime earnings</p>
        </div>
      </template>

      <!-- Total Withdrawn -->
      <template #cell-totalWithdrawn="{ item }">
        <div>
          <p class="font-semibold text-gray-700 dark:text-gray-200">
            {{ formatCurrency(item.totalWithdrawn) }}
          </p>

          <p class="text-[11px] text-gray-400 mt-0.5">Paid out</p>
        </div>
      </template>

      <!-- Status -->
      <template #cell-status="{ item }">
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="statusStyles[item.status]"
        >
          <span
            class="w-1.5 h-1.5 rounded-full"
            :class="{
              'bg-green-500': item.status === 'Active',
              'bg-rose-500': item.status === 'Suspended',
            }"
          />

          {{ item.status }}
        </span>
      </template>

      <!-- Actions -->
      <!-- <template #actions_row="{ item }">
        <button
          title="View wallet"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
        >
          <Icon name="i-heroicons-eye" class="w-4 h-4" />
        </button>

        <button
          title="Wallet transactions"
          class="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-list-bullet" class="w-4 h-4" />
        </button>

        <button
          title="Edit wallet"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
        </button>

        <button
          v-if="item.status === 'Active'"
          title="Suspend wallet"
          class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-lock-closed" class="w-4 h-4" />
        </button>

        <button
          v-else
          title="Activate wallet"
          class="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-lock-open" class="w-4 h-4" />
        </button>
      </template> -->
    </UiDataList>

    <!-- Bottom wallet summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <!-- Available -->
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Available for Withdrawal</p>

            <p class="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {{ formatCurrency(totalBalance) }}
            </p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-banknotes" class="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      <!-- Earned -->
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Lifetime Earnings</p>

            <p class="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {{ formatCurrency(totalEarned) }}
            </p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-chart-bar" class="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>

      <!-- Withdrawn -->
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Lifetime Withdrawals</p>

            <p class="text-xl font-bold text-gray-900 dark:text-white mt-2">
              {{ formatCurrency(totalWithdrawn) }}
            </p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-arrow-up-right" class="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
