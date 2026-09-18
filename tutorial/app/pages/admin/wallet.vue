<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* =========================================================
 * TYPES
 * ========================================================= */

type WalletTransactionType =
  | "Commission"
  | "Withdrawal"
  | "Refund"
  | "Adjustment";

type WalletTransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed";

type WithdrawalStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Rejected";

interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  description: string;
  source: string;
  amount: number;
  direction: "Credit" | "Debit";
  status: WalletTransactionStatus;
  date: string;
  reference: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountName: string;
  accountNumber: string;
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  reference: string;
}

interface WalletSummary {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  commissionRate: number;
  totalCredits: number;
  totalDebits: number;
}

interface WalletApiResponse {
  success: boolean;

  wallet: WalletSummary;

  admin?: {
    _id: string;
    name: string;
    email: string;
  };

  transactions: any[];

  withdrawals: any[];

  minimumWithdrawal: number;
}

/* =========================================================
 * CONFIG
 * ========================================================= */

const config = useRuntimeConfig();

/* =========================================================
 * CURRENCY
 * ========================================================= */

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/* =========================================================
 * LOADING / ERROR
 * ========================================================= */

const loadingWallet = ref(false);

const walletError = ref<string | null>(null);

/* =========================================================
 * WALLET DATA
 * ========================================================= */

const walletBalance = ref(0);

const totalEarned = ref(0);

const totalWithdrawn = ref(0);

const pendingWithdrawal = ref(0);

const commissionRate = ref(0);

const totalCredits = ref(0);

const totalDebits = ref(0);

const minimumWithdrawal = ref(5000);

/* =========================================================
 * TRANSACTIONS
 * ========================================================= */

const transactions = ref<WalletTransaction[]>([]);

/* =========================================================
 * WITHDRAWALS
 * ========================================================= */

const withdrawals = ref<Withdrawal[]>([]);

/* =========================================================
 * WITHDRAWAL MODAL
 * ========================================================= */

const showWithdrawalModal = ref(false);

const withdrawalAmount = ref("");

const withdrawalSubmitting = ref(false);

const withdrawalError = ref<string | null>(null);

const withdrawalSuccess = ref<string | null>(null);

/* =========================================================
 * VIEW MODALS
 * ========================================================= */

const selectedTransaction =
  ref<WalletTransaction | null>(null);

const selectedWithdrawal =
  ref<Withdrawal | null>(null);

/* =========================================================
 * FILTERS
 * ========================================================= */

const selectedTransactionType =
  ref("All Types");

const selectedTransactionStatus =
  ref("All Status");

const search = ref("");

/* =========================================================
 * LOAD WALLET
 * ========================================================= */

async function loadWallet() {
  loadingWallet.value = true;
  walletError.value = null;

  try {
    console.log(
      "Loading admin wallet:",
      `${config.public.apiUrl}/admin/wallet`
    );

    const response =
      await $fetch<WalletApiResponse>(
        "/admin/wallet",
        {
          baseURL:
            config.public.apiUrl,

          credentials: "include",

          method: "GET",
        }
      );

    console.log(
      "Wallet response:",
      response
    );

    if (!response?.success) {
      throw new Error(
        "Unable to load wallet."
      );
    }

    /* --------------------------------------------------
     * Wallet
     * -------------------------------------------------- */

    walletBalance.value =
      Number(
        response.wallet?.balance
      ) || 0;

    totalEarned.value =
      Number(
        response.wallet?.totalEarned
      ) || 0;

    totalWithdrawn.value =
      Number(
        response.wallet?.totalWithdrawn
      ) || 0;

    pendingWithdrawal.value =
      Number(
        response.wallet?.pendingWithdrawal
      ) || 0;

    commissionRate.value =
      Number(
        response.wallet?.commissionRate
      ) || 0;

    totalCredits.value =
      Number(
        response.wallet?.totalCredits
      ) || 0;

    totalDebits.value =
      Number(
        response.wallet?.totalDebits
      ) || 0;

    minimumWithdrawal.value =
      Number(
        response.minimumWithdrawal
      ) || 5000;

    /* --------------------------------------------------
     * Transactions
     * -------------------------------------------------- */

    transactions.value =
      (response.transactions || []).map(
        (transaction: any) => ({
          id:
            String(
              transaction?._id ||
                transaction?.id ||
                transaction?.reference ||
                ""
            ),

          type:
            transaction?.type ||
            "Adjustment",

          description:
            transaction?.description ||
            "Wallet transaction",

          source:
            transaction?.source ||
            "",

          amount:
            Number(
              transaction?.amount
            ) || 0,

          direction:
            transaction?.direction ||
            "Credit",

          status:
            transaction?.status ||
            "Completed",

          date:
            transaction?.createdAt ||
            transaction?.date ||
            "",

          reference:
            transaction?.reference ||
            "—",
        })
      );

    /* --------------------------------------------------
     * Withdrawals
     * -------------------------------------------------- */

    withdrawals.value =
      (response.withdrawals || []).map(
        (withdrawal: any) => ({
          id:
            String(
              withdrawal?._id ||
                withdrawal?.id ||
                withdrawal?.reference ||
                ""
            ),

          amount:
            Number(
              withdrawal?.amount
            ) || 0,

          bankName:
            withdrawal?.bankName ||
            "—",

          accountName:
            withdrawal?.accountName ||
            "—",

          accountNumber:
            withdrawal?.accountNumber ||
            withdrawal?.accountNumberMasked ||
            "****",

          status:
            withdrawal?.status ||
            "Pending",

          requestedAt:
            withdrawal?.requestedAt ||
            withdrawal?.createdAt ||
            "",

          processedAt:
            withdrawal?.processedAt ||
            undefined,

          reference:
            withdrawal?.reference ||
            "—",
        })
      );

  } catch (error: any) {
    console.error(
      "Failed to load wallet:",
      error
    );

    walletError.value =
      error?.data?.message ||
      error?.message ||
      "Failed to load wallet.";

  } finally {
    loadingWallet.value = false;
  }
}

/* =========================================================
 * CLIENT SIDE ONLY
 * ========================================================= */

onMounted(() => {
  loadWallet();
});

/* =========================================================
 * FORMAT DATE
 * ========================================================= */

function formatDate(
  value: string | Date | null | undefined
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/* =========================================================
 * COMMISSION TRANSACTIONS
 * ========================================================= */

const commissionTransactions =
  computed(() =>
    transactions.value.filter(
      (transaction) =>
        transaction.type ===
          "Commission" &&
        transaction.direction ===
          "Credit"
    )
  );

/* =========================================================
 * COMPLETED COMMISSIONS
 * ========================================================= */

const completedCommissionTransactions =
  computed(() =>
    commissionTransactions.value.filter(
      (transaction) =>
        transaction.status ===
        "Completed"
    )
  );

/* =========================================================
 * TOTAL COMMISSION
 *
 * Use backend totalEarned instead of calculating
 * from only the last 50 transactions.
 * ========================================================= */

const totalCommission = computed(
  () => totalEarned.value
);

/* =========================================================
 * THIS MONTH COMMISSION
 * ========================================================= */

const thisMonthCommission =
  computed(() => {
    const now = new Date();

    const month =
      now.getMonth();

    const year =
      now.getFullYear();

    return completedCommissionTransactions.value
      .filter((transaction) => {
        const date =
          new Date(
            transaction.date
          );

        return (
          !Number.isNaN(
            date.getTime()
          ) &&
          date.getMonth() ===
            month &&
          date.getFullYear() ===
            year
        );
      })
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      );
  });

/* =========================================================
 * PENDING COMMISSION
 * ========================================================= */

const pendingCommission =
  computed(() =>
    commissionTransactions.value
      .filter(
        (transaction) =>
          transaction.status ===
          "Pending"
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0
      )
  );

/* =========================================================
 * COMPLETED WITHDRAWALS
 * ========================================================= */

const completedWithdrawals =
  computed(() =>
    withdrawals.value.filter(
      (withdrawal) =>
        withdrawal.status ===
        "Completed"
    )
  );

/* =========================================================
 * PENDING WITHDRAWALS
 * ========================================================= */

const pendingWithdrawals =
  computed(() =>
    withdrawals.value.filter(
      (withdrawal) =>
        withdrawal.status ===
          "Pending" ||
        withdrawal.status ===
          "Processing"
    )
  );

/* =========================================================
 * WITHDRAWAL TOTAL
 * ========================================================= */

const withdrawalValue =
  computed(() =>
    totalWithdrawn.value
  );

/* =========================================================
 * PENDING WITHDRAWAL TOTAL
 * ========================================================= */

const pendingWithdrawalValue =
  computed(() =>
    pendingWithdrawal.value
  );

/* =========================================================
 * FILTERED TRANSACTIONS
 * ========================================================= */

const filteredTransactions =
  computed(() => {
    const query =
      search.value
        .trim()
        .toLowerCase();

    return transactions.value.filter(
      (transaction) => {
        const matchesType =
          selectedTransactionType.value ===
            "All Types" ||
          transaction.type ===
            selectedTransactionType.value;

        const matchesStatus =
          selectedTransactionStatus.value ===
            "All Status" ||
          transaction.status ===
            selectedTransactionStatus.value;

        const matchesSearch =
          !query ||
          transaction.description
            .toLowerCase()
            .includes(query) ||
          transaction.source
            .toLowerCase()
            .includes(query) ||
          transaction.reference
            .toLowerCase()
            .includes(query);

        return (
          matchesType &&
          matchesStatus &&
          matchesSearch
        );
      }
    );
  });

/* =========================================================
 * TRANSACTION STATS
 * ========================================================= */

const transactionStats =
  computed(() => [
    {
      label: "Wallet Balance",

      value:
        currency.format(
          walletBalance.value
        ),

      icon:
        "i-heroicons-wallet",
    },

    {
      label: "Total Commission",

      value:
        currency.format(
          totalCommission.value
        ),

      icon:
        "i-heroicons-banknotes",
    },

    {
      label: "Total Withdrawn",

      value:
        currency.format(
          totalWithdrawn.value
        ),

      icon:
        "i-heroicons-arrow-up-right",
    },

    {
      label: "Pending Withdrawal",

      value:
        currency.format(
          pendingWithdrawal.value
        ),

      icon:
        "i-heroicons-clock",
    },
  ]);

/* =========================================================
 * COMMISSION STATS
 * ========================================================= */

const commissionStats =
  computed(() => [
    {
      label: "Total Commission",

      value:
        currency.format(
          totalCommission.value
        ),

      icon:
        "i-heroicons-banknotes",
    },

    {
      label: "This Month",

      value:
        currency.format(
          thisMonthCommission.value
        ),

      icon:
        "i-heroicons-calendar-days",
    },

    {
      label: "Commission Rate",

      value:
        `${commissionRate.value}%`,

      icon:
        "i-heroicons-percent-badge",
    },

    {
      label: "Pending Commission",

      value:
        currency.format(
          pendingCommission.value
        ),

      icon:
        "i-heroicons-clock",
    },
  ]);

/* =========================================================
 * TRANSACTION COLUMNS
 * ========================================================= */

const transactionColumns = [
  {
    key: "description",
    label: "Transaction",
  },

  {
    key: "type",
    label: "Type",
  },

  {
    key: "amount",
    label: "Amount",
  },

  {
    key: "status",
    label: "Status",
  },

  {
    key: "date",
    label: "Date",
  },
];

/* =========================================================
 * TRANSACTION STATUS
 * ========================================================= */

const transactionStatusClass = (
  status: WalletTransactionStatus
) => {
  const classes = {
    Completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    Pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    Failed:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return classes[status];
};

/* =========================================================
 * WITHDRAWAL STATUS
 * ========================================================= */

const withdrawalStatusClass = (
  status: WithdrawalStatus
) => {
  const classes = {
    Pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    Processing:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    Completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    Rejected:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return classes[status];
};

/* =========================================================
 * TRANSACTION TYPE
 * ========================================================= */

const transactionTypeClass = (
  type: WalletTransactionType
) => {
  const classes = {
    Commission:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",

    Withdrawal:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",

    Refund:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",

    Adjustment:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
  };

  return classes[type];
};

/* =========================================================
 * REQUEST WITHDRAWAL MODAL
 * ========================================================= */

function requestWithdrawal() {
  withdrawalAmount.value = "";

  withdrawalError.value = null;

  withdrawalSuccess.value = null;

  showWithdrawalModal.value = true;
}

/* =========================================================
 * CLOSE WITHDRAWAL MODAL
 * ========================================================= */

function closeWithdrawalModal() {
  if (withdrawalSubmitting.value) {
    return;
  }

  showWithdrawalModal.value = false;

  withdrawalAmount.value = "";

  withdrawalError.value = null;
}

/* =========================================================
 * SUBMIT WITHDRAWAL
 * ========================================================= */

async function submitWithdrawal() {
  withdrawalError.value = null;
  withdrawalSuccess.value = null;

  const amount =
    Number(
      withdrawalAmount.value
    );

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    withdrawalError.value =
      "Enter a valid withdrawal amount.";

    return;
  }

  if (
    amount <
    minimumWithdrawal.value
  ) {
    withdrawalError.value =
      `Minimum withdrawal is ${currency.format(
        minimumWithdrawal.value
      )}.`;

    return;
  }

  if (
    amount >
    walletBalance.value
  ) {
    withdrawalError.value =
      "Withdrawal amount cannot be greater than your wallet balance.";

    return;
  }

  withdrawalSubmitting.value = true;

  try {
    const response =
      await $fetch<any>(
        "/admin/wallet/withdrawals",
        {
          baseURL:
            config.public.apiUrl,

          credentials: "include",

          method: "POST",

          body: {
            amount,
          },
        }
      );

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Withdrawal request failed."
      );
    }

    withdrawalSuccess.value =
      response.message ||
      "Withdrawal request submitted successfully.";

    /*
     * Reload the wallet so:
     *
     * balance
     * transactions
     * withdrawals
     *
     * are immediately updated.
     */
    await loadWallet();

    setTimeout(() => {
      closeWithdrawalModal();
    }, 1000);

  } catch (error: any) {
    console.error(
      "Withdrawal request error:",
      error
    );

    withdrawalError.value =
      error?.data?.message ||
      error?.message ||
      "Failed to submit withdrawal.";

  } finally {
    withdrawalSubmitting.value = false;
  }
}

/* =========================================================
 * VIEW TRANSACTION
 * ========================================================= */

function viewTransaction(
  transaction: WalletTransaction
) {
  selectedTransaction.value =
    transaction;
}

/* =========================================================
 * CLOSE TRANSACTION
 * ========================================================= */

function closeTransaction() {
  selectedTransaction.value =
    null;
}

/* =========================================================
 * VIEW WITHDRAWAL
 * ========================================================= */

function viewWithdrawal(
  withdrawal: Withdrawal
) {
  selectedWithdrawal.value =
    withdrawal;
}

/* =========================================================
 * CLOSE WITHDRAWAL VIEW
 * ========================================================= */

function closeWithdrawalView() {
  selectedWithdrawal.value =
    null;
}

/* =========================================================
 * RELOAD
 * ========================================================= */

async function reloadWallet() {
  await loadWallet();
}
</script>
<template>
  <div class="space-y-6 pb-10">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Wallet
        </h1>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your earnings, commissions and withdrawals.
        </p>
      </div>

      <button
        type="button"
        @click="requestWithdrawal"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        <span class="i-heroicons-arrow-up-right h-5 w-5"></span>
        Request Withdrawal
      </button>
    </div>

    <!-- Wallet Balance -->
    <div
      class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-sm"
    >
      <div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10"></div>

      <div class="absolute -bottom-16 right-20 h-44 w-44 rounded-full bg-white/5"></div>

      <div class="relative">
        <div class="flex items-center gap-2 text-sm font-medium text-white/80">
          <span class="i-heroicons-wallet h-5 w-5"></span>
          Available Wallet Balance
        </div>

        <div class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {{ currency.format(walletBalance) }}
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div class="flex items-center gap-2 text-white/80">
            <span class="i-heroicons-arrow-trending-up h-4 w-4"></span>
            Total earned:
            <span class="font-semibold text-white">
              {{ currency.format(totalEarned) }}
            </span>
          </div>

          <div class="flex items-center gap-2 text-white/80">
            <span class="i-heroicons-arrow-up-right h-4 w-4"></span>
            Withdrawn:
            <span class="font-semibold text-white">
              {{ currency.format(totalWithdrawn) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Stats -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="stat in transactionStats"
        :key="stat.label"
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ stat.label }}
            </p>

            <p class="mt-2 text-xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <span :class="[stat.icon, 'h-5 w-5']"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Commission Section -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Commission</h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Earnings generated from successful student subscriptions.
            </p>
          </div>

          <div
            class="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
          >
            <span class="i-heroicons-percent-badge h-4 w-4"></span>
            {{ commissionRate }}% Commission
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="stat in commissionStats"
          :key="stat.label"
          class="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
            >
              <span :class="[stat.icon, 'h-5 w-5']"></span>
            </div>

            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ stat.label }}
              </p>

              <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Commission Explanation -->
      <div class="px-5 pb-5 sm:px-6 sm:pb-6">
        <div
          class="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5"
        >
          <div class="flex gap-3">
            <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
            >
              <span class="i-heroicons-information-circle h-5 w-5"></span>
            </div>

            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                How your commission works
              </h3>

              <p
                class="mt-1 text-sm leading-6 text-indigo-800/80 dark:text-indigo-300/80"
              >
                You receive
                <strong>{{ commissionRate }}%</strong>
                commission from successful subscriptions made by students connected to
                your network. Commission is added to your wallet only after the payment
                has been successfully verified.
              </p>

              <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div class="rounded-lg bg-white/70 p-3 dark:bg-gray-900/40">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Student Payment</p>

                  <p class="mt-1 font-bold text-gray-900 dark:text-white">₦5,000</p>
                </div>

                <div class="rounded-lg bg-white/70 p-3 dark:bg-gray-900/40">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Your Rate</p>

                  <p class="mt-1 font-bold text-indigo-600 dark:text-indigo-400">
                    {{ commissionRate }}%
                  </p>
                </div>

                <div class="rounded-lg bg-white/70 p-3 dark:bg-gray-900/40">
                  <p class="text-xs text-gray-500 dark:text-gray-400">Your Commission</p>

                  <p class="mt-1 font-bold text-emerald-600 dark:text-emerald-400">
                    ₦500
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Transactions -->
    <section>
      <div class="mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">
          Wallet Transactions
        </h2>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View all commissions, withdrawals and wallet adjustments.
        </p>
      </div>

      <UiDataList
        :items="filteredTransactions"
        :columns="transactionColumns"
        row-key="id"
        :stats="transactionStats"
        empty-text="No wallet transactions found"
      >
        <template #filters>
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
            <!-- Search -->
            <div class="relative min-w-0 flex-1">
              <span
                class="i-heroicons-magnifying-glass pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              ></span>

              <input
                v-model="search"
                type="text"
                placeholder="Search transactions..."
                class="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <!-- Type -->
            <select
              v-model="selectedTransactionType"
              class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>All Types</option>
              <option>Commission</option>
              <option>Withdrawal</option>
              <option>Refund</option>
              <option>Adjustment</option>
            </select>

            <!-- Status -->
            <select
              v-model="selectedTransactionStatus"
              class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
        </template>

        <!-- Transaction -->
        <template #cell-description="{ item }">
          <div class="min-w-[220px]">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ item.description }}
            </p>

            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ item.reference }}
            </p>
          </div>
        </template>

        <!-- Type -->
        <template #cell-type="{ item }">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="transactionTypeClass(item.type)"
          >
            {{ item.type }}
          </span>
        </template>

        <!-- Amount -->
        <template #cell-amount="{ item }">
          <span
            class="text-sm font-bold"
            :class="
              item.direction === 'Credit'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            "
          >
            {{ item.direction === "Credit" ? "+" : "-" }}
            {{ currency.format(item.amount) }}
          </span>
        </template>

        <!-- Status -->
        <template #cell-status="{ item }">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="transactionStatusClass(item.status)"
          >
            {{ item.status }}
          </span>
        </template>

        <!-- Date -->
        <template #cell-date="{ item }">
          <span class="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
            {{ item.date }}
          </span>
        </template>

        <!-- Actions -->
        <template #actions_row="{ item }">
          <button
            type="button"
            @click="viewTransaction(item)"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="View transaction"
          >
            <span class="i-heroicons-eye h-5 w-5"></span>
          </button>
        </template>
      </UiDataList>
    </section>

    <!-- Withdrawal History -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-6">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              Withdrawal History
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track your wallet withdrawal requests and their status.
            </p>
          </div>

          <div class="text-sm text-gray-500 dark:text-gray-400">
            Completed:
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ currency.format(withdrawalValue) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden overflow-x-auto md:block">
        <table class="min-w-full">
          <thead>
            <tr
              class="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Reference
              </th>

              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Bank
              </th>

              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Amount
              </th>

              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Requested
              </th>

              <th
                class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Status
              </th>

              <th
                class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="withdrawal in withdrawals"
              :key="withdrawal.id"
              class="transition hover:bg-gray-50 dark:hover:bg-gray-800/30"
            >
              <td class="whitespace-nowrap px-6 py-4">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ withdrawal.reference }}
                </p>
              </td>

              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ withdrawal.bankName }}
                  </p>

                  <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {{ withdrawal.accountName }}
                    ·
                    {{ withdrawal.accountNumber }}
                  </p>
                </div>
              </td>

              <td class="whitespace-nowrap px-6 py-4">
                <span class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ currency.format(withdrawal.amount) }}
                </span>
              </td>

              <td class="whitespace-nowrap px-6 py-4">
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ withdrawal.requestedAt }}
                </span>
              </td>

              <td class="whitespace-nowrap px-6 py-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                  :class="withdrawalStatusClass(withdrawal.status)"
                >
                  {{ withdrawal.status }}
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  @click="viewWithdrawal(withdrawal)"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  title="View withdrawal"
                >
                  <span class="i-heroicons-eye h-5 w-5"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Withdrawal Cards -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800 md:hidden">
        <div v-for="withdrawal in withdrawals" :key="withdrawal.id" class="p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                {{ withdrawal.reference }}
              </p>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ withdrawal.bankName }}
                ·
                {{ withdrawal.accountNumber }}
              </p>
            </div>

            <span
              class="inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="withdrawalStatusClass(withdrawal.status)"
            >
              {{ withdrawal.status }}
            </span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Amount</p>

              <p class="mt-1 text-sm font-bold text-gray-900 dark:text-white">
                {{ currency.format(withdrawal.amount) }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Requested</p>

              <p class="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ withdrawal.requestedAt }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="viewWithdrawal(withdrawal)"
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span class="i-heroicons-eye h-4 w-4"></span>
            View withdrawal
          </button>
        </div>
      </div>

      <!-- Withdrawal Summary -->
      <div
        class="grid grid-cols-1 border-t border-gray-200 dark:border-gray-800 sm:grid-cols-3"
      >
        <div class="p-5">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Completed Withdrawals
          </p>

          <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">
            {{ currency.format(withdrawalValue) }}
          </p>
        </div>

        <div
          class="border-t border-gray-200 p-5 dark:border-gray-800 sm:border-l sm:border-t-0"
        >
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Pending Withdrawals
          </p>

          <p class="mt-1 text-lg font-bold text-amber-600 dark:text-amber-400">
            {{ currency.format(pendingWithdrawalValue) }}
          </p>
        </div>

        <div
          class="border-t border-gray-200 p-5 dark:border-gray-800 sm:border-l sm:border-t-0"
        >
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Minimum Withdrawal
          </p>

          <p class="mt-1 text-lg font-bold text-gray-900 dark:text-white">₦5,000</p>
        </div>
      </div>
    </section>

    <!-- Commission Information -->
    <section
      class="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/5 sm:p-6"
    >
      <div class="flex gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        >
          <span class="i-heroicons-currency-dollar h-5 w-5"></span>
        </div>

        <div>
          <h3 class="text-sm font-bold text-emerald-900 dark:text-emerald-300">
            Commission Information
          </h3>

          <p class="mt-1 text-sm leading-6 text-emerald-800/80 dark:text-emerald-300/80">
            Your wallet receives a
            <strong>{{ commissionRate }}%</strong>
            commission from successful student subscription payments. Commission is
            automatically credited after payment verification.
          </p>

          <div
            class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-emerald-800 dark:text-emerald-300"
          >
            <span class="inline-flex items-center gap-1.5">
              <span class="i-heroicons-check-circle h-4 w-4"></span>
              Successful payments only
            </span>

            <span class="inline-flex items-center gap-1.5">
              <span class="i-heroicons-check-circle h-4 w-4"></span>
              Minimum withdrawal ₦5,000
            </span>

            <span class="inline-flex items-center gap-1.5">
              <span class="i-heroicons-check-circle h-4 w-4"></span>
              Secure wallet tracking
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Financial Summary -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:p-6"
    >
      <div class="mb-5">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">Wallet Summary</h2>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of money moving through your wallet.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Credits
              </p>

              <p class="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {{ currency.format(totalCredits) }}
              </p>
            </div>

            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              <span class="i-heroicons-arrow-down-left h-5 w-5"></span>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total Debits
              </p>

              <p class="mt-1 text-xl font-bold text-red-600 dark:text-red-400">
                {{ currency.format(totalDebits) }}
              </p>
            </div>

            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            >
              <span class="i-heroicons-arrow-up-right h-5 w-5"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
