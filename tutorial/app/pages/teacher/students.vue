
<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "nav",
});

/* -------------------------------------------------------------------------- */
/* Student                                                                     */
/* -------------------------------------------------------------------------- */

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  examYear: string;
  subjects: string;
  mockScore?: number;
  subscribed: boolean;
  status: "Active" | "Pending" | "Expired";
  joinedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Students                                                                    */
/* -------------------------------------------------------------------------- */

const students = ref<Student[]>([
  {
    id: 1,
    name: "Amaka Obi",
    email: "amaka@gmail.com",
    phone: "0803 123 4567",
    examYear: "2027 JAMB",
    subjects: "Physics, Chemistry, Biology",
    mockScore: 248,
    subscribed: true,
    status: "Active",
    joinedAt: "12 August 2026",
  },
  {
    id: 2,
    name: "Tunde Bello",
    email: "tunde@gmail.com",
    phone: "0805 987 6543",
    examYear: "2027 JAMB",
    subjects: "Economics, Government, Literature",
    subscribed: false,
    status: "Pending",
    joinedAt: "01 September 2026",
  },
  {
    id: 3,
    name: "Chiamaka Eze",
    email: "chiamaka@gmail.com",
    phone: "0812 456 7890",
    examYear: "2026 JAMB",
    subjects: "Physics, Chemistry, Mathematics",
    mockScore: 289,
    subscribed: true,
    status: "Active",
    joinedAt: "20 July 2026",
  },
  {
    id: 4,
    name: "Blessing Johnson",
    email: "blessing@gmail.com",
    phone: "0806 234 5678",
    examYear: "2027 JAMB",
    subjects: "English, Biology, Chemistry",
    mockScore: 276,
    subscribed: true,
    status: "Active",
    joinedAt: "05 August 2026",
  },
  {
    id: 5,
    name: "Ibrahim Musa",
    email: "ibrahim@gmail.com",
    phone: "0704 345 6789",
    examYear: "2026 JAMB",
    subjects: "Mathematics, Physics, Chemistry",
    mockScore: 231,
    subscribed: true,
    status: "Active",
    joinedAt: "18 June 2026",
  },
  {
    id: 6,
    name: "Sarah Williams",
    email: "sarah@gmail.com",
    phone: "0814 567 8901",
    examYear: "2027 JAMB",
    subjects: "Biology, Chemistry, English",
    mockScore: 198,
    subscribed: false,
    status: "Pending",
    joinedAt: "08 September 2026",
  },
  {
    id: 7,
    name: "David Okon",
    email: "david@gmail.com",
    phone: "0701 222 3344",
    examYear: "2026 JAMB",
    subjects: "Government, CRS, Literature",
    mockScore: 190,
    subscribed: false,
    status: "Expired",
    joinedAt: "15 May 2026",
  },
  {
    id: 8,
    name: "Esther Daniel",
    email: "esther@gmail.com",
    phone: "0807 345 6789",
    examYear: "2028 JAMB",
    subjects: "Mathematics, Physics, English",
    mockScore: 214,
    subscribed: true,
    status: "Active",
    joinedAt: "10 September 2026",
  },
]);

/* -------------------------------------------------------------------------- */
/* Filters                                                                     */
/* -------------------------------------------------------------------------- */

const search = ref("");
const selectedYear = ref("All Years");
const selectedSubscription = ref("All Subscriptions");
const selectedStatus = ref("All Status");

const filteredStudents = computed(() => {
  const query = search.value.toLowerCase().trim();

  return students.value.filter((student) => {
    const matchesSearch =
      !query ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.phone.toLowerCase().includes(query);

    const matchesYear =
      selectedYear.value === "All Years" ||
      student.examYear === selectedYear.value;

    const matchesSubscription =
      selectedSubscription.value === "All Subscriptions" ||
      (selectedSubscription.value === "Subscribed" && student.subscribed) ||
      (selectedSubscription.value === "Not Subscribed" &&
        !student.subscribed);

    const matchesStatus =
      selectedStatus.value === "All Status" ||
      student.status === selectedStatus.value;

    return (
      matchesSearch &&
      matchesYear &&
      matchesSubscription &&
      matchesStatus
    );
  });
});

/* -------------------------------------------------------------------------- */
/* Stats                                                                       */
/* -------------------------------------------------------------------------- */

const totalStudents = computed(() => students.value.length);

const subscribedStudents = computed(
  () => students.value.filter((student) => student.subscribed).length,
);

const pendingStudents = computed(
  () =>
    students.value.filter((student) => student.status === "Pending").length,
);

const expiredStudents = computed(
  () =>
    students.value.filter((student) => student.status === "Expired").length,
);

const stats = computed(() => [
  {
    label: "Total Students",
    value: totalStudents.value,
    icon: "heroicons:academic-cap",
  },
  {
    label: "Subscribed",
    value: subscribedStudents.value,
    icon: "heroicons:check-circle",
  },
  {
    label: "Pending",
    value: pendingStudents.value,
    icon: "heroicons:clock",
  },
  {
    label: "Expired",
    value: expiredStudents.value,
    icon: "heroicons:exclamation-circle",
  },
]);

/* -------------------------------------------------------------------------- */
/* Table                                                                       */
/* -------------------------------------------------------------------------- */

const columns = [
  {
    key: "name",
    label: "Student",
  },
  {
    key: "subjects",
    label: "Subjects",
  },
  {
    key: "examYear",
    label: "Exam Year",
  },
  {
    key: "mockScore",
    label: "Last Mock",
  },
  {
    key: "subscribed",
    label: "Subscribed",
  },
  {
    key: "status",
    label: "Status",
  },
];

/* -------------------------------------------------------------------------- */
/* Add Student                                                                 */
/* -------------------------------------------------------------------------- */

const showAddModal = ref(false);

const newStudent = ref({
  name: "",
  email: "",
  phone: "",
  examYear: "2027 JAMB",
  subjects: "",
  subscribed: false,
});

const resetForm = () => {
  newStudent.value = {
    name: "",
    email: "",
    phone: "",
    examYear: "2027 JAMB",
    subjects: "",
    subscribed: false,
  };
};

const openAddStudent = () => {
  resetForm();
  showAddModal.value = true;
};

const closeAddStudent = () => {
  showAddModal.value = false;
  resetForm();
};

const addStudent = () => {
  if (
    !newStudent.value.name.trim() ||
    !newStudent.value.email.trim() ||
    !newStudent.value.phone.trim()
  ) {
    return;
  }

  const student: Student = {
    id: Date.now(),
    name: newStudent.value.name.trim(),
    email: newStudent.value.email.trim(),
    phone: newStudent.value.phone.trim(),
    examYear: newStudent.value.examYear,
    subjects: newStudent.value.subjects.trim() || "—",
    subscribed: newStudent.value.subscribed,
    status: newStudent.value.subscribed ? "Active" : "Pending",
    joinedAt: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date()),
  };

  students.value.unshift(student);

  closeAddStudent();
};

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

const viewStudent = (student: Student) => {
  console.log("View student:", student);
};

const editStudent = (student: Student) => {
  console.log("Edit student:", student);
};

const deleteStudent = (student: Student) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${student.name}?`,
  );

  if (!confirmed) return;

  students.value = students.value.filter(
    (item) => item.id !== student.id,
  );
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const subscriptionPercentage = computed(() => {
  if (!totalStudents.value) return 0;

  return Math.round(
    (subscribedStudents.value / totalStudents.value) * 100,
  );
});
</script>

<template>
  <div class="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">

    <!-- ============================================================
         HEADER
    ============================================================= -->

    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1
          class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          My Students
        </h1>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage the students under your account.
        </p>
      </div>

  <CreateUser
        type="student"
        button-text="Add Student"
        button-icon="lucide:user-plus"
        button-icon-class="h-5 w-5"
      />
    </div>

    <!-- ============================================================
         STUDENT LIST
    ============================================================= -->

    <UiDataList
      :items="filteredStudents"
      :columns="columns"
      row-key="id"
      :stats="stats"
      empty-text="No students found"
    >

      <!-- ==========================================================
           FILTERS
      =========================================================== -->

      <template #filters>
        <div
          class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >

          <!-- Search -->

          <div class="relative w-full lg:max-w-sm">
            <Icon
              name="heroicons:magnifying-glass"
              class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="search"
              type="text"
              placeholder="Search students..."
              class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">

            <!-- Year -->

            <select
              v-model="selectedYear"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>All Years</option>
              <option>2026 JAMB</option>
              <option>2027 JAMB</option>
              <option>2028 JAMB</option>
            </select>

            <!-- Subscription -->

            <select
              v-model="selectedSubscription"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>All Subscriptions</option>
              <option>Subscribed</option>
              <option>Not Subscribed</option>
            </select>

            <!-- Status -->

            <select
              v-model="selectedStatus"
              class="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
          </div>
        </div>
      </template>

      <!-- ==========================================================
           STUDENT
      =========================================================== -->

      <template #cell-name="{ item }">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
          >
            {{ getInitials(item.name) }}
          </div>

          <div class="min-w-0">
            <p
              class="truncate font-semibold text-gray-900 dark:text-white"
            >
              {{ item.name }}
            </p>

            <p
              class="truncate text-xs text-gray-500 dark:text-gray-400"
            >
              {{ item.email }}
            </p>

            <p
              class="truncate text-xs text-gray-400 dark:text-gray-500"
            >
              {{ item.phone }}
            </p>
          </div>
        </div>
      </template>

      <!-- ==========================================================
           SUBJECTS
      =========================================================== -->

      <template #cell-subjects="{ item }">
        <div class="max-w-[220px]">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ item.subjects }}
          </p>
        </div>
      </template>

      <!-- ==========================================================
           EXAM YEAR
      =========================================================== -->

      <template #cell-examYear="{ item }">
        <span
          class="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {{ item.examYear }}
        </span>
      </template>

      <!-- ==========================================================
           MOCK SCORE
      =========================================================== -->

      <template #cell-mockScore="{ item }">
        <div v-if="item.mockScore !== undefined">
          <span
            class="font-semibold text-gray-900 dark:text-white"
          >
            {{ item.mockScore }}
          </span>

          <span class="text-xs text-gray-400">
            /400
          </span>
        </div>

        <span
          v-else
          class="text-sm text-gray-400"
        >
          —
        </span>
      </template>

      <!-- ==========================================================
           SUBSCRIBED
      =========================================================== -->

      <template #cell-subscribed="{ item }">
        <span
          v-if="item.subscribed"
          class="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
          Yes
        </span>

        <span
          v-else
          class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-gray-400" />
          No
        </span>
      </template>

      <!-- ==========================================================
           STATUS
      =========================================================== -->

      <template #cell-status="{ item }">
        <span
          v-if="item.status === 'Active'"
          class="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400"
        >
          Active
        </span>

        <span
          v-else-if="item.status === 'Pending'"
          class="inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
        >
          Pending
        </span>

        <span
          v-else
          class="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-400"
        >
          Expired
        </span>
      </template>

      <!-- ==========================================================
           ACTIONS
      =========================================================== -->

      <template #actions_row="{ item }">
        <div class="flex items-center justify-end gap-1">

          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="View student"
            @click="viewStudent(item)"
          >
            <Icon
              name="heroicons:eye"
              class="h-5 w-5"
            />
          </button>

          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            title="Edit student"
            @click="editStudent(item)"
          >
            <Icon
              name="heroicons:pencil-square"
              class="h-5 w-5"
            />
          </button>

          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title="Delete student"
            @click="deleteStudent(item)"
          >
            <Icon
              name="heroicons:trash"
              class="h-5 w-5"
            />
          </button>

        </div>
      </template>
    </UiDataList>

    <!-- ============================================================
         SUMMARY
    ============================================================= -->

    <div class="grid gap-4 sm:grid-cols-2">

      <!-- Total -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Total Students
            </p>

            <p
              class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ totalStudents }}
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
          >
            <Icon
              name="heroicons:academic-cap"
              class="h-6 w-6"
            />
          </div>
        </div>
      </div>

      <!-- Subscription Rate -->

      <div
        class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Subscription Rate
            </p>

            <p
              class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"
            >
              {{ subscriptionPercentage }}%
            </p>
          </div>

          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
          >
            <Icon
              name="heroicons:chart-bar"
              class="h-6 w-6"
            />
          </div>
        </div>

        <div
          class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
        >
          <div
            class="h-full rounded-full bg-green-500 transition-all"
            :style="{ width: `${subscriptionPercentage}%` }"
          />
        </div>

        <p
          class="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ subscribedStudents }} of {{ totalStudents }}
          students subscribed
        </p>
      </div>
    </div>

    <!-- ============================================================
         ADD STUDENT MODAL
    ============================================================= -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showAddModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >

          <!-- Backdrop -->

          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="closeAddStudent"
          />

          <!-- Modal -->

          <div
            class="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          >

            <!-- Header -->

            <div
              class="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800"
            >
              <div>
                <h2
                  class="text-lg font-bold text-gray-900 dark:text-white"
                >
                  Add Student
                </h2>

                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  Add a student to your account.
                </p>
              </div>

              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                @click="closeAddStudent"
              >
                <Icon
                  name="heroicons:x-mark"
                  class="h-5 w-5"
                />
              </button>
            </div>

            <!-- Form -->

            <form
              class="space-y-5 p-6"
              @submit.prevent="addStudent"
            >
              <div class="grid gap-5 sm:grid-cols-2">

                <!-- Full Name -->

                <div class="sm:col-span-2">
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>

                  <input
                    v-model="newStudent.name"
                    type="text"
                    placeholder="Enter student's full name"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <!-- Email -->

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>

                  <input
                    v-model="newStudent.email"
                    type="email"
                    placeholder="student@example.com"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <!-- Phone -->

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </label>

                  <input
                    v-model="newStudent.phone"
                    type="tel"
                    placeholder="08012345678"
                    required
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <!-- Exam -->

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Exam
                  </label>

                  <select
                    v-model="newStudent.examYear"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>2026 JAMB</option>
                    <option>2027 JAMB</option>
                    <option>2028 JAMB</option>
                  </select>
                </div>

                <!-- Subjects -->

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subjects
                  </label>

                  <input
                    v-model="newStudent.subjects"
                    type="text"
                    placeholder="Mathematics, Physics, Chemistry"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <!-- Subscription -->

                <div class="sm:col-span-2">
                  <div
                    class="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div>
                      <p
                        class="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Subscribed
                      </p>

                      <p
                        class="mt-1 text-xs text-gray-500 dark:text-gray-400"
                      >
                        Mark this student as having an active subscription.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      :aria-checked="newStudent.subscribed"
                      class="relative h-6 w-11 rounded-full transition"
                      :class="
                        newStudent.subscribed
                          ? 'bg-primary-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      "
                      @click="
                        newStudent.subscribed =
                          !newStudent.subscribed
                      "
                    >
                      <span
                        class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
                        :class="
                          newStudent.subscribed
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        "
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Actions -->

              <div
                class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
              >
                <button
                  type="button"
                  class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="closeAddStudent"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  class="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>


