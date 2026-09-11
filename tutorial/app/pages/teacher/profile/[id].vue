<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const teacherId = computed(() => String(route.params.id));

/* =========================================================
   TEACHER DATA
========================================================= */

const teacher = ref({
  id: teacherId.value,

  image: null as string | null,

  name: "Michael Johnson",
  email: "michael@example.com",
  phone: "08011112222",
  role: "Teacher",
  status: "Active",
  dateJoined: "14 August 2026",

  /* =======================================================
     ADMIN WHO REFERRED / CREATED THIS TEACHER
  ======================================================= */

  referredBy: {
    id: "ADM-001",
    name: "John Admin",
    email: "john.admin@example.com",
    image: null as string | null,
    dateReferred: "14 August 2026",
    referralCode: "JOHN-ADMIN",
  },

  /* =======================================================
     PAYMENT INFORMATION
  ======================================================= */

  payment: {
    bankName: "GTBank",
    accountName: "Michael Johnson",
    accountNumber: "0123456789",
    paystackCustomerId: "CUS_9K21L83M",
  },

  /* =======================================================
     WALLET / COMMISSION
  ======================================================= */

  wallet: {
    balance: 12000,
    totalEarned: 47000,
    tokenBalance: 6,
  },

  /* =======================================================
     REFERRED STUDENTS
  ======================================================= */

  students: [
    {
      id: 1,

      image: null as string | null,

      name: "David Okafor",
      email: "david@example.com",
      phone: "08133334444",

      profileCompletion: 100,

      subscription: {
        status: "Active",
        plan: "JAMB Access",
        expiresAt: "14 August 2027",
      },

      dateJoined: "18 August 2026",
      lastLogin: "Today, 7:30 PM",
      status: "Active",
    },

    {
      id: 2,

      image: null as string | null,

      name: "Mary Adeyemi",
      email: "mary@example.com",
      phone: "08144445555",

      profileCompletion: 80,

      subscription: {
        status: "Pending",
        plan: null,
        expiresAt: null,
      },

      dateJoined: "20 August 2026",
      lastLogin: "Yesterday, 4:20 PM",
      status: "Pending",
    },

    {
      id: 3,

      image: null as string | null,

      name: "Fatima Bello",
      email: "fatima@example.com",
      phone: "08155556666",

      profileCompletion: 100,

      subscription: {
        status: "Active",
        plan: "JAMB Access",
        expiresAt: "22 August 2027",
      },

      dateJoined: "22 August 2026",
      lastLogin: "Today, 5:10 PM",
      status: "Active",
    },

    {
      id: 4,

      image: null as string | null,

      name: "Emeka Nwosu",
      email: "emeka@example.com",
      phone: "08166667777",

      profileCompletion: 60,

      subscription: {
        status: "Expired",
        plan: "JAMB Access",
        expiresAt: "10 August 2026",
      },

      dateJoined: "10 August 2026",
      lastLogin: "4 days ago",
      status: "Expired",
    },

    {
      id: 5,

      image: null as string | null,

      name: "Daniel Ibrahim",
      email: "daniel@example.com",
      phone: "07055556666",

      profileCompletion: 100,

      subscription: {
        status: "Active",
        plan: "JAMB Access",
        expiresAt: "25 August 2027",
      },

      dateJoined: "25 August 2026",
      lastLogin: "Today, 10:15 AM",
      status: "Active",
    },
  ],
});

/* =========================================================
   TABLE COLUMNS
========================================================= */

const columns = [
  { key: "name", label: "Student" },
  { key: "profileCompletion", label: "Profile" },
  { key: "subscription", label: "Subscription" },
  { key: "dateJoined", label: "Date Joined" },
  { key: "lastLogin", label: "Last Login" },
  { key: "status", label: "Status" },
];

/* =========================================================
   STATUS STYLES
========================================================= */

const statusStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",

  Suspended: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  Cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  "Not Subscribed": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

/* =========================================================
   SUBSCRIPTION STYLES
========================================================= */

const subscriptionStyles: Record<string, string> = {
  Active: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Expired: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",

  Suspended: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  Cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",

  "Not Subscribed": "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

/* =========================================================
   STATS
========================================================= */

const totalStudents = computed(() => teacher.value.students.length);

const completedProfiles = computed(
  () =>
    teacher.value.students.filter((student) => student.profileCompletion === 100).length
);

const subscribedStudents = computed(
  () =>
    teacher.value.students.filter((student) => student.subscription.status === "Active")
      .length
);

const pendingSubscriptions = computed(
  () =>
    teacher.value.students.filter((student) => student.subscription.status === "Pending")
      .length
);

const stats = computed(() => [
  {
    label: "Total Students",
    value: totalStudents.value,
    icon: "i-heroicons-users",
    color: "indigo" as const,
  },

  {
    label: "Profiles Complete",
    value: completedProfiles.value,
    icon: "i-heroicons-user-circle",
    color: "green" as const,
  },

  {
    label: "Subscribed",
    value: subscribedStudents.value,
    icon: "i-heroicons-check-badge",
    color: "green" as const,
  },

  {
    label: "Pending Subscription",
    value: pendingSubscriptions.value,
    icon: "i-heroicons-clock",
    color: "amber" as const,
  },
]);

/* =========================================================
   HELPERS
========================================================= */

const initials = (name: string) =>
  name
    .split(" ")
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

const avatarColor = (name: string) => {
  const colors = [
    "bg-indigo-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-orange-500",
    "bg-rose-500",
  ];

  const index =
    name.split("").reduce((total, character) => total + character.charCodeAt(0), 0) %
    colors.length;

  return colors[index];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

/* =========================================================
   ACTIONS
========================================================= */

const goBack = () => router.back();

const editTeacher = () => {
  console.log("Edit teacher:", teacherId.value);
};

const suspendTeacher = () => {
  console.log("Suspend teacher:", teacherId.value);
};

const viewStudent = (studentId: number) => {
  console.log("View student:", studentId);
};

const editStudent = (studentId: number) => {
  console.log("Edit student:", studentId);
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 font-['Poppins'] text-gray-900 dark:bg-gray-950 dark:text-white"
  >
    <div class="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <!-- =================================================
           HEADER
      ================================================== -->

      <div class="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="goBack"
        >
          <Icon name="i-heroicons-arrow-left" class="h-4 w-4" />

          Back to Teachers
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            @click="editTeacher"
          >
            <Icon name="i-heroicons-pencil-square" class="h-4 w-4" />

            Edit Teacher
          </button>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Icon name="i-heroicons-ellipsis-horizontal" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- =================================================
           TEACHER PROFILE
      ================================================== -->

      <section
        class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-4">
            <!-- Teacher Image -->
            <div
              class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-xl font-bold text-white"
              :class="teacher.image ? 'bg-gray-100' : 'bg-purple-600'"
            >
              <img
                v-if="teacher.image"
                :src="teacher.image"
                :alt="teacher.name"
                class="h-full w-full object-cover"
              />

              <span v-else>
                {{ initials(teacher.name) }}
              </span>
            </div>

            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl font-bold">
                  {{ teacher.name }}
                </h1>

                <span
                  class="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                >
                  <Icon name="i-heroicons-academic-cap" class="h-3.5 w-3.5" />

                  {{ teacher.role }}
                </span>

                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  :class="statusStyles[teacher.status]"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="teacher.status === 'Active' ? 'bg-green-500' : 'bg-rose-500'"
                  />

                  {{ teacher.status }}
                </span>
              </div>

              <div
                class="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="i-heroicons-envelope" class="h-4 w-4 text-gray-400" />

                  {{ teacher.email }}
                </span>

                <span class="inline-flex items-center gap-1.5">
                  <Icon name="i-heroicons-phone" class="h-4 w-4 text-gray-400" />

                  {{ teacher.phone }}
                </span>

                <span class="inline-flex items-center gap-1.5">
                  <Icon name="i-heroicons-calendar-days" class="h-4 w-4 text-gray-400" />

                  Joined {{ teacher.dateJoined }}
                </span>
              </div>
            </div>
          </div>

          <!-- Teacher ID -->

          <div class="rounded-2xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <p class="text-xs text-gray-400">Teacher ID</p>

            <p class="mt-1 font-mono text-sm font-semibold">
              {{ teacher.id }}
            </p>
          </div>
        </div>
      </section>

      <!-- =================================================
           REFERRED BY ADMIN
      ================================================== -->

      <section
        class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-6">
          <h2 class="text-lg font-bold">Referred By Admin</h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The administrator who created or referred this teacher.
          </p>
        </div>

        <div
          class="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-4">
            <!-- Admin Image -->
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl text-sm font-bold text-white"
              :class="teacher.referredBy.image ? 'bg-gray-100' : 'bg-indigo-600'"
            >
              <img
                v-if="teacher.referredBy.image"
                :src="teacher.referredBy.image"
                :alt="teacher.referredBy.name"
                class="h-full w-full object-cover"
              />

              <span v-else>
                {{ initials(teacher.referredBy.name) }}
              </span>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <p class="font-semibold">
                  {{ teacher.referredBy.name }}
                </p>

                <span
                  class="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  Admin
                </span>
              </div>

              <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {{ teacher.referredBy.email }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p class="text-xs text-gray-400">Admin ID</p>

              <p class="mt-1 font-mono text-sm font-medium">
                {{ teacher.referredBy.id }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-400">Referral Code</p>

              <p class="mt-1 font-mono text-sm font-medium">
                {{ teacher.referredBy.referralCode }}
              </p>
            </div>

            <div>
              <p class="text-xs text-gray-400">Date Referred</p>

              <p class="mt-1 text-sm font-medium">
                {{ teacher.referredBy.dateReferred }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- =================================================
           ACCOUNT & PAYMENT
      ================================================== -->

      <section
        class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="mb-6">
          <h2 class="text-lg font-bold">Account & Payment Information</h2>

          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Bank details, commission earnings, and activation balance.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <!-- BANK -->

          <div
            class="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400"
              >
                <Icon name="i-heroicons-building-library" class="h-5 w-5" />
              </div>

              <div>
                <h3 class="text-sm font-semibold">Bank Account</h3>

                <p class="text-xs text-gray-400">Withdrawal details</p>
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <div>
                <p class="text-xs text-gray-400">Bank</p>

                <p class="mt-1 text-sm font-medium">
                  {{ teacher.payment.bankName }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-400">Account Name</p>

                <p class="mt-1 text-sm font-medium">
                  {{ teacher.payment.accountName }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-400">Account Number</p>

                <p class="mt-1 font-mono text-sm font-semibold">
                  {{ teacher.payment.accountNumber }}
                </p>
              </div>
            </div>
          </div>

          <!-- EARNINGS -->

          <div
            class="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm dark:bg-gray-800 dark:text-emerald-400"
              >
                <Icon name="i-heroicons-banknotes" class="h-5 w-5" />
              </div>

              <div>
                <h3 class="text-sm font-semibold">Commission Earnings</h3>

                <p class="text-xs text-gray-400">From student referrals</p>
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <div>
                <p class="text-xs text-gray-400">Paystack Customer ID</p>

                <p class="mt-1 break-all font-mono text-sm font-medium">
                  {{ teacher.payment.paystackCustomerId }}
                </p>
              </div>

              <div>
                <p class="text-xs text-gray-400">Total Earned</p>

                <p class="mt-1 text-sm font-semibold">
                  {{ formatCurrency(teacher.wallet.totalEarned) }}
                </p>
              </div>
            </div>
          </div>

          <!-- WALLET -->

          <div
            class="rounded-2xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm dark:bg-gray-800 dark:text-orange-400"
              >
                <Icon name="i-heroicons-wallet" class="h-5 w-5" />
              </div>

              <div>
                <h3 class="text-sm font-semibold">Wallet</h3>

                <p class="text-xs text-gray-400">Withdrawable balance</p>
              </div>
            </div>

            <div class="mt-5">
              <p class="text-xs text-gray-400">Available Balance</p>

              <p class="mt-1 text-2xl font-bold">
                {{ formatCurrency(teacher.wallet.balance) }}
              </p>

              <p class="mt-2 text-xs text-gray-400">
                {{ teacher.wallet.tokenBalance }}
                token{{ teacher.wallet.tokenBalance === 1 ? "" : "s" }}
                remaining for activation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- =================================================
           REFERRED STUDENTS
      ================================================== -->

      <section>
        <UiDataList
          :items="teacher.students"
          :columns="columns"
          row-key="id"
          :stats="stats"
          :show-total-stat="false"
          title="Referred Students"
          subtitle="Students registered through this teacher"
          empty-text="No students referred yet"
        >
          <!-- STUDENT -->

          <template #cell-name="{ item }">
            <div class="flex items-center gap-3">
              <!-- Future Student Image -->
              <div
                class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white"
                :class="item.image ? 'bg-gray-100' : avatarColor(item.name)"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                />

                <span v-else>
                  {{ initials(item.name) }}
                </span>
              </div>

              <div class="min-w-0">
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ item.name }}
                </p>

                <p class="truncate text-xs text-gray-400">
                  {{ item.email }}
                </p>
              </div>
            </div>
          </template>

          <!-- PROFILE COMPLETION -->

          <template #cell-profileCompletion="{ item }">
            <div class="min-w-[130px]">
              <div class="mb-1.5 flex items-center justify-between gap-3">
                <span
                  class="text-sm font-medium"
                  :class="
                    item.profileCompletion === 100
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-300'
                  "
                >
                  {{ item.profileCompletion }}%
                </span>

                <span
                  v-if="item.profileCompletion === 100"
                  class="text-xs text-green-600 dark:text-green-400"
                >
                  Complete
                </span>

                <span v-else class="text-xs text-gray-400"> Incomplete </span>
              </div>

              <div
                class="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
              >
                <div
                  class="h-full rounded-full transition-all"
                  :class="
                    item.profileCompletion === 100 ? 'bg-green-500' : 'bg-indigo-500'
                  "
                  :style="{
                    width: `${item.profileCompletion}%`,
                  }"
                />
              </div>
            </div>
          </template>

          <!-- SUBSCRIPTION -->

          <template #cell-subscription="{ item }">
            <div>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                :class="subscriptionStyles[item.subscription.status]"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="{
                    'bg-green-500': item.subscription.status === 'Active',

                    'bg-amber-500': item.subscription.status === 'Pending',

                    'bg-gray-400': item.subscription.status === 'Expired',

                    'bg-rose-500':
                      item.subscription.status === 'Suspended' ||
                      item.subscription.status === 'Cancelled',

                    'bg-gray-400': item.subscription.status === 'Not Subscribed',
                  }"
                />

                {{ item.subscription.status }}
              </span>

              <p v-if="item.subscription.plan" class="mt-1 text-xs text-gray-400">
                {{ item.subscription.plan }}
              </p>
            </div>
          </template>

          <!-- DATE JOINED -->

          <template #cell-dateJoined="{ item }">
            <span
              class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300"
            >
              <Icon name="i-heroicons-calendar-days" class="h-4 w-4 text-gray-400" />

              {{ item.dateJoined }}
            </span>
          </template>

          <!-- LAST LOGIN -->

          <template #cell-lastLogin="{ item }">
            <span
              class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-300"
            >
              <Icon name="i-heroicons-clock" class="h-4 w-4 text-gray-400" />

              {{ item.lastLogin }}
            </span>
          </template>

          <!-- STATUS -->

          <template #cell-status="{ item }">
            <span
              class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
              :class="statusStyles[item.status]"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="{
                  'bg-green-500': item.status === 'Active',
                  'bg-amber-500': item.status === 'Pending',
                  'bg-gray-400': item.status === 'Expired',
                  'bg-rose-500': item.status === 'Suspended',
                }"
              />

              {{ item.status }}
            </span>
          </template>

          <!-- ACTIONS -->

          <template #actions_row="{ item }">
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
              title="View student"
              @click="viewStudent(item.id)"
            >
              <Icon name="i-heroicons-eye" class="h-4 w-4" />
            </button>

            <button
              type="button"
              class="ml-1 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
              title="Edit student"
              @click="editStudent(item.id)"
            >
              <Icon name="i-heroicons-pencil-square" class="h-4 w-4" />
            </button>
          </template>
        </UiDataList>
      </section>

      <!-- =================================================
           ACCOUNT ACTIONS
      ================================================== -->

      <section
        class="rounded-3xl border border-rose-100 bg-white p-6 dark:border-rose-500/20 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Account Actions
            </h2>

            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Temporarily restrict this teacher's account.
            </p>
          </div>

          <button
            type="button"
            class="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10"
            @click="suspendTeacher"
          >
            Suspend Teacher
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
