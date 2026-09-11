<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const studentId = computed(() => String(route.params.id));

const student = ref({
  id: studentId.value,

  image: null as string | null,

  name: "Daniel Abubakar",
  email: "daniel@example.com",
  phone: "08012345678",

  role: "Student",
  status: "Active",

  dateJoined: "18 August 2026",
  lastLogin: "10 September 2026, 08:42 PM",

  profileCompletion: 85,

  subscription: {
    status: "Active",
    plan: "JAMB Access",
    startDate: "20 August 2026",
    endDate: "20 August 2027",
    lastSubscriptionDate: "20 August 2026",
  },

  registeredByTeacher: {
    id: "TCH-002",
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "08011112222",
    image: null as string | null,
    dateRegistered: "18 August 2026",
    referralCode: "MICHAEL-J",
  },

  registeredByAdmin: {
    id: "ADM-001",
    name: "John Admin",
    email: "john.admin@example.com",
    phone: "08022223333",
    image: null as string | null,
    dateRegistered: "18 August 2026",
  },

  activity: {
    lastLogin: "10 September 2026, 08:42 PM",
    lastProfileUpdate: "05 September 2026, 03:20 PM",
    accountCreated: "18 August 2026",
    lastSubscriptionDate: "20 August 2026",
  },
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const getStatusClass = (status: string) => {
  const normalized = status.toLowerCase();

  if (normalized === "active") {
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }

  if (normalized === "pending" || normalized === "expiring soon") {
    return "bg-amber-50 text-amber-600 border-amber-100";
  }

  if (
    normalized === "expired" ||
    normalized === "suspended" ||
    normalized === "cancelled"
  ) {
    return "bg-red-50 text-red-600 border-red-100";
  }

  return "bg-slate-50 text-slate-600 border-slate-100";
};

const goBack = () => {
  router.back();
};

const editStudent = () => {
  console.log("Edit student:", student.value.id);
};

const manageSubscription = () => {
  console.log("Manage subscription:", student.value.id);
};

const viewTeacher = () => {
  router.push(`/admin/teachers/${student.value.registeredByTeacher.id}`);
};

const viewAdmin = () => {
  router.push(`/admin/admins/${student.value.registeredByAdmin.id}`);
};
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] font-[Poppins]">
    <div class="mx-auto max-w-[1600px] space-y-6 p-4 md:p-6 lg:p-8">
      <!-- Header -->
      <div
        class="flex flex-col gap-4 rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-3">
          <button type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
            @click="goBack">
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </button>

          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-semibold text-slate-900">Student Details</h1>

              <span class="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                :class="getStatusClass(student.status)">
                {{ student.status }}
              </span>
            </div>

            <p class="mt-1 text-sm text-slate-500">
              View and manage this student's account.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            @click="editStudent">
            <Icon name="lucide:pencil" class="h-4 w-4" />

            Edit Student
          </button>

          <button type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            @click="manageSubscription">
            <Icon name="lucide:calendar-plus" class="h-4 w-4" />

            Manage Subscription
          </button>
        </div>
      </div>

      <!-- Student Profile -->
      <section class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Student Profile</h2>

            <p class="mt-1 text-sm text-slate-500">Basic student account information.</p>
          </div>

          <span class="text-xs font-medium text-slate-400"> ID: {{ student.id }} </span>
        </div>

        <div class="grid gap-6 lg:grid-cols-[auto_1fr]">
          <!-- Student Image -->
          <div class="flex justify-center lg:justify-start">
            <div class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] bg-slate-100">
              <img v-if="student.image" :src="student.image" :alt="student.name" class="h-full w-full object-cover" />

              <span v-else class="text-2xl font-semibold text-slate-500">
                {{ getInitials(student.name) }}
              </span>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p class="text-xs text-slate-400">Full Name</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ student.name }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Email Address</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ student.email }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Phone Number</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ student.phone }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Role</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ student.role }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Date Joined</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ student.dateJoined }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Last Login</p>

              <p class="mt-1 text-sm font-medium text-slate-800">
                {{ student.lastLogin }}
              </p>
            </div>

            <div>
              <p class="text-xs text-slate-400">Account Status</p>

              <span class="mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium"
                :class="getStatusClass(student.status)">
                {{ student.status }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Profile Completion -->
      <section class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Profile Completion</h2>

            <p class="mt-1 text-sm text-slate-500">
              How much of the student's profile has been completed.
            </p>
          </div>

          <div class="text-right">
            <p class="text-2xl font-semibold text-slate-900">
              {{ student.profileCompletion }}%
            </p>

            <p class="text-xs text-slate-400">Complete</p>
          </div>
        </div>

        <div class="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-slate-900 transition-all" :style="{
            width: `${student.profileCompletion}%`,
          }" />
        </div>

        <div class="mt-4 flex items-center justify-between">
          <span class="text-xs text-slate-400"> Profile progress </span>

          <span class="text-xs font-medium text-slate-600">
            {{ student.profileCompletion }}%
          </span>
        </div>
      </section>

      <!-- Subscription -->
      <section class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-base font-semibold text-slate-900">Subscription</h2>

            <p class="mt-1 text-sm text-slate-500">
              Current student subscription information.
            </p>
          </div>

          <span class="inline-flex w-fit rounded-full border px-3 py-1 text-[11px] font-medium"
            :class="getStatusClass(student.subscription.status)">
            {{ student.subscription.status }}
          </span>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <!-- Plan -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                <Icon name="lucide:badge-check" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Current Plan</p>

                <p class="mt-1 text-sm font-semibold text-slate-800">
                  {{ student.subscription.plan }}
                </p>
              </div>
            </div>
          </div>

          <!-- Start Date -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                <Icon name="lucide:calendar-days" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Start Date</p>

                <p class="mt-1 text-sm font-semibold text-slate-800">
                  {{ student.subscription.startDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- End Date -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                <Icon name="lucide:calendar-clock" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">End Date</p>

                <p class="mt-1 text-sm font-semibold text-slate-800">
                  {{ student.subscription.endDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Last Subscription -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600">
                <Icon name="lucide:history" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Last Subscription</p>

                <p class="mt-1 text-sm font-semibold text-slate-800">
                  {{ student.subscription.lastSubscriptionDate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Registration -->
      <section class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div class="mb-6">
          <h2 class="text-base font-semibold text-slate-900">Registration</h2>

          <p class="mt-1 text-sm text-slate-500">
            Admin and teacher responsible for registering this student.
          </p>
        </div>

        <div class="grid gap-5 lg:grid-cols-2">
          <!-- Teacher -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500">
                  <Icon name="lucide:user-round-plus" class="h-4 w-4" />
                </div>

                <div>
                  <p class="text-sm font-semibold text-slate-800">
                    Registered By Teacher
                  </p>

                  <p class="text-xs text-slate-400">Teacher information</p>
                </div>
              </div>

              <button type="button" class="text-xs font-medium text-slate-500 transition hover:text-slate-900"
                @click="viewTeacher">
                View
              </button>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img v-if="student.registeredByTeacher.image" :src="student.registeredByTeacher.image"
                  :alt="student.registeredByTeacher.name" class="h-full w-full object-cover" />

                <span v-else class="text-sm font-semibold text-slate-500">
                  {{ getInitials(student.registeredByTeacher.name) }}
                </span>
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-800">
                  {{ student.registeredByTeacher.name }}
                </p>

                <p class="mt-1 truncate text-xs text-slate-400">
                  {{ student.registeredByTeacher.email }}
                </p>

                <p class="mt-1 text-xs text-slate-400">
                  ID:
                  {{ student.registeredByTeacher.id }}
                </p>
              </div>
            </div>

            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-white px-4 py-3">
                <p class="text-[11px] text-slate-400">Date Registered</p>

                <p class="mt-1 text-xs font-medium text-slate-700">
                  {{ student.registeredByTeacher.dateRegistered }}
                </p>
              </div>

              <div class="rounded-xl bg-white px-4 py-3">
                <p class="text-[11px] text-slate-400">Referral Code</p>

                <p class="mt-1 text-xs font-medium text-slate-700">
                  {{ student.registeredByTeacher.referralCode }}
                </p>
              </div>
            </div>
          </div>

          <!-- Admin -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500">
                  <Icon name="lucide:shield-check" class="h-4 w-4" />
                </div>

                <div>
                  <p class="text-sm font-semibold text-slate-800">Registered By Admin</p>

                  <p class="text-xs text-slate-400">Admin information</p>
                </div>
              </div>

              <button type="button" class="text-xs font-medium text-slate-500 transition hover:text-slate-900"
                @click="viewAdmin">
                View
              </button>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                <img v-if="student.registeredByAdmin.image" :src="student.registeredByAdmin.image"
                  :alt="student.registeredByAdmin.name" class="h-full w-full object-cover" />

                <span v-else class="text-sm font-semibold text-slate-500">
                  {{ getInitials(student.registeredByAdmin.name) }}
                </span>
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-800">
                  {{ student.registeredByAdmin.name }}
                </p>

                <p class="mt-1 truncate text-xs text-slate-400">
                  {{ student.registeredByAdmin.email }}
                </p>

                <p class="mt-1 text-xs text-slate-400">
                  ID:
                  {{ student.registeredByAdmin.id }}
                </p>
              </div>
            </div>

            <div class="mt-5">
              <div class="rounded-xl bg-white px-4 py-3">
                <p class="text-[11px] text-slate-400">Date Registered</p>

                <p class="mt-1 text-xs font-medium text-slate-700">
                  {{ student.registeredByAdmin.dateRegistered }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Account Activity -->
      <section class="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div class="mb-6">
          <h2 class="text-base font-semibold text-slate-900">Account Activity</h2>

          <p class="mt-1 text-sm text-slate-500">
            Important activity recorded on this student account.
          </p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <!-- Account Created -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500">
                <Icon name="lucide:user-plus" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Account Created</p>

                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ student.activity.accountCreated }}
                </p>
              </div>
            </div>
          </div>

          <!-- Last Login -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500">
                <Icon name="lucide:log-in" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Last Login</p>

                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ student.activity.lastLogin }}
                </p>
              </div>
            </div>
          </div>

          <!-- Profile Update -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500">
                <Icon name="lucide:user-round-pen" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Last Profile Update</p>

                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ student.activity.lastProfileUpdate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Subscription -->
          <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500">
                <Icon name="lucide:calendar-check-2" class="h-5 w-5" />
              </div>

              <div>
                <p class="text-xs text-slate-400">Last Subscription</p>

                <p class="mt-1 text-sm font-semibold text-slate-700">
                  {{ student.activity.lastSubscriptionDate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
