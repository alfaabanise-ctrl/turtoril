<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  students: number;
  paidStudents: number;
  status: "Active" | "Pending" | "Inactive";
  joinedAt: string;
}

const teachers = ref<Teacher[]>([
  {
    id: 1,
    name: "Mr. Okafor",
    email: "okafor@gmail.com",
    phone: "0803 456 7890",
    students: 86,
    paidStudents: 72,
    status: "Active",
    joinedAt: "12 January 2026",
  },
  {
    id: 2,
    name: "Mrs. Adaeze",
    email: "adaeze@gmail.com",
    phone: "0805 234 5678",
    students: 64,
    paidStudents: 51,
    status: "Active",
    joinedAt: "20 January 2026",
  },
  {
    id: 3,
    name: "Mr. Adewale",
    email: "adewale@gmail.com",
    phone: "0812 345 6789",
    students: 58,
    paidStudents: 47,
    status: "Active",
    joinedAt: "05 February 2026",
  },
  {
    id: 4,
    name: "Mr. Yusuf",
    email: "yusuf@gmail.com",
    phone: "0701 345 6789",
    students: 45,
    paidStudents: 39,
    status: "Active",
    joinedAt: "18 February 2026",
  },
  {
    id: 5,
    name: "Mrs. Grace",
    email: "grace@gmail.com",
    phone: "0806 567 8901",
    students: 39,
    paidStudents: 28,
    status: "Pending",
    joinedAt: "12 March 2026",
  },
  {
    id: 6,
    name: "Mr. Daniel",
    email: "daniel@gmail.com",
    phone: "0814 234 5678",
    students: 31,
    paidStudents: 24,
    status: "Active",
    joinedAt: "25 March 2026",
  },
  {
    id: 7,
    name: "Mrs. Esther",
    email: "esther@gmail.com",
    phone: "0704 789 1234",
    students: 27,
    paidStudents: 18,
    status: "Inactive",
    joinedAt: "08 April 2026",
  },
]);

const columns = [
  { key: "name", label: "Teacher" },
  { key: "students", label: "Students / Paid" },
  { key: "status", label: "Status" },
  { key: "joinedAt", label: "Joined" },
];

const selectedStatus = ref("All Status");

const statuses = ["All Status", "Active", "Pending", "Inactive"];

const filteredTeachers = computed(() => {
  if (selectedStatus.value === "All Status") {
    return teachers.value;
  }

  return teachers.value.filter((teacher) => teacher.status === selectedStatus.value);
});

const totalTeachers = computed(() => teachers.value.length);

const activeTeachers = computed(
  () => teachers.value.filter((teacher) => teacher.status === "Active").length
);

const pendingTeachers = computed(
  () => teachers.value.filter((teacher) => teacher.status === "Pending").length
);

const totalStudents = computed(() =>
  teachers.value.reduce((sum, teacher) => sum + teacher.students, 0)
);

const totalPaidStudents = computed(() =>
  teachers.value.reduce((sum, teacher) => sum + teacher.paidStudents, 0)
);

const stats = computed(() => [
  {
    label: "Total Teachers",
    value: totalTeachers.value,
    icon: "i-heroicons-user-group",
    color: "indigo" as const,
  },
  {
    label: "Active Teachers",
    value: activeTeachers.value,
    icon: "i-heroicons-check-circle",
    color: "green" as const,
  },
  {
    label: "Pending",
    value: pendingTeachers.value,
    icon: "i-heroicons-clock",
    color: "amber" as const,
  },
  {
    label: "Total Students",
    value: totalStudents.value,
    icon: "i-heroicons-academic-cap",
    color: "blue" as const,
  },
]);

const statusStyles: Record<string, string> = {
  Active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",

  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

  Inactive: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const avatarColors = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
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

function paidPercentage(teacher: Teacher) {
  if (!teacher.students) return 0;

  return Math.round((teacher.paidStudents / teacher.students) * 100);
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Teachers
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Manage teachers and monitor their students
        </p>
      </div>
 <CreateUser
        type="teacher"
        button-text="Add Teacher s"
        button-icon="lucide:user-plus"
        button-icon-class="h-5 w-5"
      />
    </div>

    <!-- Teacher List -->
    <UiDataList
      :items="filteredTeachers"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No teachers found"
    >
      <!-- Filters -->
      <template #filters>
        <select
          v-model="selectedStatus"
          class="text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
        >
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </template>

      <!-- Teacher -->
      <template #cell-name="{ item }">
        <div class="flex items-center gap-3 min-w-[240px]">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :class="avatarColor(item.name)"
          >
            {{ initials(item.name) }}
          </div>

          <div class="min-w-0">
            <p class="font-medium text-gray-900 dark:text-white truncate">
              {{ item.name }}
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

              <p class="text-[11px] text-gray-400">
                {{ item.phone }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Students -->
      <template #cell-students="{ item }">
        <div class="min-w-[150px]">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ item.students }}
            </span>

            <span class="text-gray-400"> / </span>

            <span class="font-semibold text-emerald-600 dark:text-emerald-400">
              {{ item.paidStudents }}
            </span>
          </div>

          <div class="flex items-center gap-2 mt-1.5">
            <div
              class="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-emerald-500 rounded-full transition-all"
                :style="{
                  width: `${paidPercentage(item)}%`,
                }"
              />
            </div>

            <span class="text-[11px] text-gray-400"> {{ paidPercentage(item) }}% </span>
          </div>

          <p class="text-[11px] text-gray-400 mt-1">Students / Paid</p>
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
              'bg-amber-500': item.status === 'Pending',
              'bg-gray-400': item.status === 'Inactive',
            }"
          />

          {{ item.status }}
        </span>
      </template>

      <!-- Joined -->
      <template #cell-joinedAt="{ item }">
        <div class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <Icon name="i-heroicons-calendar-days" class="w-4 h-4 text-gray-400" />

          <span class="text-sm">
            {{ item.joinedAt }}
          </span>
        </div>
      </template>

      <!-- Actions -->
      <template #actions_row="{ item }">
        <button
          title="View teacher"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
        >
          <Icon name="i-heroicons-eye" class="w-4 h-4" />
        </button>

        <button
          title="Edit teacher"
          class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-pencil-square" class="w-4 h-4" />
        </button>

        <button
          title="Delete teacher"
          class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
        >
          <Icon name="i-heroicons-trash" class="w-4 h-4" />
        </button>
      </template>
    </UiDataList>

    <!-- Small Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Students Assigned</p>

            <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {{ totalStudents }}
            </p>

            <p class="text-xs text-gray-400 mt-1">Across {{ totalTeachers }} teachers</p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-academic-cap" class="w-5 h-5 text-indigo-500" />
          </div>
        </div>
      </div>

      <div
        class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Subscribed Students</p>

            <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">
              {{ totalPaidStudents }}
            </p>

            <p class="text-xs text-emerald-500 mt-1">
              {{
                totalStudents ? Math.round((totalPaidStudents / totalStudents) * 100) : 0
              }}% conversion
            </p>
          </div>

          <div
            class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center"
          >
            <Icon name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
