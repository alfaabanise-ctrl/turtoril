<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * Types
 * -------------------------------------------------- */
type UserRole = "student" | "teacher" | "admin";
type Theme = "light" | "dark";

/* --------------------------------------------------
 * Role Management
 * -------------------------------------------------- */
const currentRole = ref<UserRole>("student"); // Default role

const roleOptions: { value: UserRole; label: string; icon: string }[] = [
  { value: "student", label: "Student", icon: "heroicons:user" },
  { value: "teacher", label: "Teacher", icon: "heroicons:academic-cap" },
  { value: "admin", label: "Admin", icon: "heroicons:shield-check" },
];

// Dynamic badge styling and text based on role
const roleBadge = computed(() => {
  switch (currentRole.value) {
    case "teacher":
      return {
        text: "Teacher",
        classes:
          "bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400/20",
        icon: "heroicons:academic-cap",
      };
    case "admin":
      return {
        text: "Admin",
        classes:
          "bg-red-50 text-red-700 ring-red-700/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20",
        icon: "heroicons:shield-check",
      };
    default:
      return {
        text: "Student",
        classes:
          "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20",
        icon: "heroicons:user",
      };
  }
});

// Role helpers
const isStudent = computed(() => currentRole.value === "student");
const isTeacher = computed(() => currentRole.value === "teacher");
const isAdmin = computed(() => currentRole.value === "admin");

// Bank details are only available to teachers and admins
const canManageBankDetails = computed(
  () => isTeacher.value || isAdmin.value
);

/* --------------------------------------------------
 * Profile State
 * -------------------------------------------------- */
const firstName = ref("ABDULWAHEED");
const lastName = ref("SOFIYAT");
const email = ref("twinsabanise@gmail.com");
const examTarget = ref("JAMB (UTME/DE)");

const fullName = computed(
  () => `${firstName.value} ${lastName.value}`.trim()
);

const initials = computed(() => {
  const f = firstName.value?.trim()?.[0] ?? "";
  const l = lastName.value?.trim()?.[0] ?? "";
  return `${f}${l}`.toUpperCase() || "U";
});

/* --------------------------------------------------
 * Teacher Specific State
 * -------------------------------------------------- */
const teacherAddress = ref("123 Education Lane, Lagos, Nigeria");
const teacherLanguage = ref("English (UK)");
const newSkill = ref("");
const teacherSkills = ref<string[]>([
  "Mathematics",
  "Physics",
  "Curriculum Development",
]);

/* --------------------------------------------------
 * Admin Specific State
 * -------------------------------------------------- */
const adminLevel = ref("Super Admin");
const adminDepartment = ref("Operations");
const systemMaintenanceMode = ref(false);

/* --------------------------------------------------
 * Bank Account State (Teacher & Admin only)
 * -------------------------------------------------- */
const banks = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Kuda Microfinance Bank",
  "Moniepoint MFB",
  "Opay Digital Services",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

const bankDetails = ref({
  bankName: "",
  accountNumber: "",
  accountName: "",
});

const isVerifying = ref(false);
const isSavingBank = ref(false);
const bankMessage = ref("");
const bankError = ref("");

// Has the user filled in a complete, valid set of bank details?
const hasBankDetails = computed(
  () =>
    !!bankDetails.value.bankName &&
    bankDetails.value.accountNumber.length === 10 &&
    !!bankDetails.value.accountName.trim()
);

// Keep only digits, max 10 characters
const onAccountNumberInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const digits = target.value.replace(/\D/g, "").slice(0, 10);
  bankDetails.value.accountNumber = digits;
  target.value = digits;
  bankError.value = "";
  bankMessage.value = "";
};

const resetBankDetails = () => {
  bankDetails.value = {
    bankName: "",
    accountNumber: "",
    accountName: "",
  };
  bankMessage.value = "";
  bankError.value = "";
};

const verifyAccount = async () => {
  bankMessage.value = "";
  bankError.value = "";

  if (!bankDetails.value.bankName) {
    bankError.value = "Please select your bank first.";
    return;
  }
  if (bankDetails.value.accountNumber.length !== 10) {
    bankError.value = "Account number must be exactly 10 digits.";
    return;
  }

  isVerifying.value = true;
  try {
    // ---------------------------------------------------------------
    // TODO: Replace this mock with a real bank account resolution call
    // e.g. await $fetch("/api/bank/resolve", { method: "POST", body: {...} })
    // ---------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 900));

    bankDetails.value.accountName = fullName.value.toUpperCase();
    bankMessage.value = "Account verified successfully.";
  } catch (e) {
    bankError.value = "Could not verify this account. Please try again.";
  } finally {
    isVerifying.value = false;
  }
};

const saveBankDetails = async () => {
  bankMessage.value = "";
  bankError.value = "";

  if (!bankDetails.value.bankName) {
    bankError.value = "Please select your bank.";
    return;
  }
  if (bankDetails.value.accountNumber.length !== 10) {
    bankError.value = "Account number must be exactly 10 digits.";
    return;
  }
  if (!bankDetails.value.accountName.trim()) {
    bankError.value = "Please enter the account name.";
    return;
  }

  isSavingBank.value = true;
  try {
    // ---------------------------------------------------------------
    // TODO: Replace this mock with your real save endpoint
    // e.g. await $fetch("/api/user/bank", { method: "PUT", body: bankDetails.value })
    // ---------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 800));

    bankMessage.value = "Bank account details saved successfully.";
  } catch (e) {
    bankError.value = "Something went wrong while saving. Please try again.";
  } finally {
    isSavingBank.value = false;
  }
};

/* --------------------------------------------------
 * Subjects State
 * -------------------------------------------------- */
const selectedSubjects = ref<string[]>([]);
const availableSubjects = [
  "Mathematics",
  "Chemistry",
  "Physics",
  "Biology",
  "English",
  "Literature",
  "Geography",
  "Economics",
  "Government",
  "Commerce",
  "C.R.K",
  "I.R.K",
];

const MAX_SUBJECTS = 4;

const toggleSubject = (subject: string) => {
  const index = selectedSubjects.value.indexOf(subject);
  if (index > -1) {
    selectedSubjects.value.splice(index, 1);
  } else if (selectedSubjects.value.length < MAX_SUBJECTS) {
    selectedSubjects.value.push(subject);
  }
};

const isSubjectSelected = (subject: string) =>
  selectedSubjects.value.includes(subject);

const subjectsLimitReached = computed(
  () => selectedSubjects.value.length >= MAX_SUBJECTS
);

/* --------------------------------------------------
 * Notifications State
 * -------------------------------------------------- */
const notifications = ref({
  dailyReminder: true,
  streakAlert: true,
  weeklyReport: false,
  promoEmails: false,
});

/* --------------------------------------------------
 * Password State
 * -------------------------------------------------- */
const showPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const passwordMessage = ref("");
const passwordError = ref("");

/* --------------------------------------------------
 * Theme State
 * -------------------------------------------------- */
const selectedTheme = ref<Theme>("light");

/* --------------------------------------------------
 * Methods
 * -------------------------------------------------- */

// --- Teacher Skills ---
const addSkill = () => {
  const value = newSkill.value.trim();
  if (value && !teacherSkills.value.includes(value)) {
    teacherSkills.value.push(value);
    newSkill.value = "";
  }
};

const removeSkill = (index: number) => {
  teacherSkills.value.splice(index, 1);
};

// --- Theme ---
const setTheme = (theme: Theme) => {
  selectedTheme.value = theme;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    selectedTheme.value = "dark";
    document.documentElement.classList.add("dark");
  } else {
    selectedTheme.value = "light";
    document.documentElement.classList.remove("dark");
  }
});

// --- Password ---
const updatePassword = () => {
  passwordMessage.value = "";
  passwordError.value = "";

  if (!currentPassword.value) {
    passwordError.value = "Please enter your current password.";
    return;
  }
  if (!newPassword.value) {
    passwordError.value = "Please enter your new password.";
    return;
  }
  if (newPassword.value.length < 8) {
    passwordError.value = "New password must be at least 8 characters long.";
    return;
  }
  if (newPassword.value === currentPassword.value) {
    passwordError.value =
      "New password must be different from your current password.";
    return;
  }
  if (!confirmPassword.value) {
    passwordError.value = "Please confirm your new password.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  // TODO: call your API here
  passwordMessage.value = "Password updated successfully.";
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
};

// --- Account ---
const saveAccountDetails = () => alert("Account details saved!");
const saveSubjects = () =>
  alert(`Subjects saved: ${selectedSubjects.value.join(", ")}`);
const clearQuizHistory = () =>
  confirm("Clear quiz history?") && alert("Cleared.");
const logOutAllDevices = () =>
  confirm("Log out everywhere?") && alert("Logged out.");
const deleteAccount = () =>
  confirm("Delete account? This cannot be undone.") && alert("Deleted.");
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <!-- ============================================================
           ROLE SWITCHER
      ============================================================= -->
      <div
        class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
          View settings as:
        </span>
        <div
          class="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          role="tablist"
        >
          <button
            v-for="option in roleOptions"
            :key="option.value"
            type="button"
            role="tab"
            :aria-selected="currentRole === option.value"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition"
            :class="
              currentRole === option.value
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            "
            @click="currentRole = option.value"
          >
            <Icon :name="option.icon" class="h-4 w-4" />
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- ============================================================
           PROFILE CARD
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-wrap items-center gap-4">
          <!-- Avatar -->
          <div
            class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white"
          >
            {{ initials }}
          </div>

          <!-- Info -->
          <div class="min-w-0 flex-1">
            <h1
              class="truncate text-lg font-semibold text-gray-900 dark:text-white"
            >
              {{ fullName }}
            </h1>
            <p class="truncate text-sm text-gray-500 dark:text-gray-400">
              {{ email }}
            </p>

            <div class="mt-2 flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/20"
              >
                Free Plan
              </span>

              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                :class="roleBadge.classes"
              >
                <Icon :name="roleBadge.icon" class="h-3.5 w-3.5" />
                {{ roleBadge.text }}
              </span>
            </div>
          </div>

          <!-- Edit -->
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Edit
          </button>
        </div>
      </div>

      <!-- ============================================================
           ACCOUNT DETAILS
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          Account Details
        </h2>

        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          <!-- First Name -->
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              First Name
            </label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Last Name
            </label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Email -->
          <div class="sm:col-span-2">
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Exam Target (Student only) -->
          <div v-if="isStudent" class="sm:col-span-2">
            <label
              for="examTarget"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Exam Target
            </label>
            <select
              id="examTarget"
              v-model="examTarget"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option>JAMB (UTME/DE)</option>
              <option>WAEC</option>
              <option>NECO</option>
            </select>
          </div>

          <!-- Teacher-only fields -->
          <template v-if="isTeacher">
            <div class="sm:col-span-2">
              <label
                for="teacherAddress"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address
              </label>
              <input
                id="teacherAddress"
                v-model="teacherAddress"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="sm:col-span-2">
              <label
                for="teacherLanguage"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Language / Locale
              </label>
              <select
                id="teacherLanguage"
                v-model="teacherLanguage"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>English (UK)</option>
                <option>English (US)</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>

            <div class="sm:col-span-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Skills
              </label>
              <div class="mt-2 flex gap-2">
                <input
                  v-model="newSkill"
                  type="text"
                  placeholder="Add a skill..."
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  @keyup.enter="addSkill"
                />
                <button
                  type="button"
                  class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  @click="addSkill"
                >
                  Add
                </button>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="(skill, index) in teacherSkills"
                  :key="skill"
                  class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ skill }}
                  <button
                    type="button"
                    class="text-gray-400 transition hover:text-red-500"
                    aria-label="Remove skill"
                    @click="removeSkill(index)"
                  >
                    <Icon name="heroicons:x-mark" class="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
            </div>
          </template>

          <!-- Admin-only fields -->
          <template v-if="isAdmin">
            <div>
              <label
                for="adminLevel"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Admin Level
              </label>
              <select
                id="adminLevel"
                v-model="adminLevel" disabled
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option>Super Admin</option>
                <option>Moderator</option>
                <option>Support Staff</option>
              </select>
            </div>

            <div>
              <label
                for="adminDepartment"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Department
              </label>
              <input
                id="adminDepartment"
                v-model="adminDepartment"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div
              class="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 sm:col-span-2 dark:border-gray-700"
            >
              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  System Maintenance Mode
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Temporarily disable access for all non-admin users.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="systemMaintenanceMode"
                class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                :class="
                  systemMaintenanceMode
                    ? 'bg-red-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                "
                @click="systemMaintenanceMode = !systemMaintenanceMode"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                  :class="
                    systemMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  "
                />
              </button>
            </div>
          </template>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            @click="saveAccountDetails"
          >
            Save Changes
          </button>
        </div>
      </div>

      <!-- ============================================================
           BANK ACCOUNT DETAILS  (Teacher & Admin only)  ← NEW SECTION
      ============================================================= -->
      <div
        v-if="canManageBankDetails"
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <!-- Header -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">
              Bank Account Details
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Used for payouts and earnings. Only visible to teachers and
              admins.
            </p>
          </div>

          <span
            v-if="hasBankDetails"
            class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/20"
          >
            <Icon name="heroicons:check-badge" class="h-3.5 w-3.5" />
            Added
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-400/20"
          >
            <Icon name="heroicons:exclamation-triangle" class="h-3.5 w-3.5" />
            Not set
          </span>
        </div>

        <!-- Fields -->
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          <!-- Bank Name -->
          <div>
            <label
              for="bankName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Bank Name
            </label>
            <select
              id="bankName"
              v-model="bankDetails.bankName"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="" disabled>Select your bank</option>
              <option v-for="bank in banks" :key="bank" :value="bank">
                {{ bank }}
              </option>
            </select>
          </div>

          <!-- Account Number -->
          <div>
            <label
              for="accountNumber"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Account Number
            </label>
            <input
              id="accountNumber"
              :value="bankDetails.accountNumber"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              maxlength="10"
              placeholder="0123456789"
              class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm tracking-widest text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              @input="onAccountNumberInput"
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              10 digits, no spaces.
            </p>
          </div>

          <!-- Account Name -->
          <div class="sm:col-span-2">
            <label
              for="accountName"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Account Name
            </label>
            <div class="mt-2 flex gap-2">
              <input
                id="accountName"
                v-model="bankDetails.accountName"
                type="text"
                placeholder="e.g. ABDULWAHEED SOFIYAT"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                :disabled="isVerifying"
                class="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                @click="verifyAccount"
              >
                {{ isVerifying ? "Verifying..." : "Verify" }}
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Must match the name registered on the bank account.
            </p>
          </div>
        </div>

        <!-- Feedback -->
        <p
          v-if="bankMessage"
          class="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400"
        >
          {{ bankMessage }}
        </p>
        <p
          v-if="bankError"
          class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {{ bankError }}
        </p>

        <!-- Actions -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="resetBankDetails"
          >
            Clear
          </button>
          <button
            type="button"
            :disabled="isSavingBank"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            @click="saveBankDetails"
          >
            {{ isSavingBank ? "Saving..." : "Save Bank Details" }}
          </button>
        </div>
      </div>

      <!-- ============================================================
           MY SUBJECTS
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            My Subjects
          </h2>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ selectedSubjects.length }}/{{ MAX_SUBJECTS }} selected
          </span>
        </div>

        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          You can select up to 4 subjects.
        </p>

        <div class="mt-5 flex flex-wrap gap-2">
          <button
            v-for="subject in availableSubjects"
            :key="subject"
            type="button"
            :disabled="!isSubjectSelected(subject) && subjectsLimitReached"
            class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
            :class="
              isSubjectSelected(subject)
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400'
            "
            @click="toggleSubject(subject)"
          >
            {{ subject }}
          </button>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            @click="saveSubjects"
          >
            Save Subjects
          </button>
        </div>
      </div>

      <!-- ============================================================
           PLAN & USAGE
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          Plan &amp; Usage
        </h2>

        <div
          class="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800"
        >
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              Free Plan
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              10 quizzes · 2 AI generations
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Upgrade
          </button>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-4">
          <div
            class="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800"
          >
            <p class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Quizzes Taken
            </p>
          </div>
          <div
            class="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800"
          >
            <p class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              AI Generations
            </p>
          </div>
          <div
            class="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800"
          >
            <p class="text-2xl font-bold text-gray-900 dark:text-white">0</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Day Streak
            </p>
          </div>
        </div>
      </div>

      <!-- ============================================================
           APPEARANCE
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          Appearance
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose how the app looks on this device.
        </p>

        <div class="mt-4 inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition"
            :class="
              selectedTheme === 'light'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            "
            @click="setTheme('light')"
          >
            <Icon name="heroicons:sun" class="h-4 w-4" />
            Light
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition"
            :class="
              selectedTheme === 'dark'
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            "
            @click="setTheme('dark')"
          >
            <Icon name="heroicons:moon" class="h-4 w-4" />
            Dark
          </button>
        </div>
      </div>

      <!-- ============================================================
           NOTIFICATIONS
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          Notifications
        </h2>

        <div class="mt-5 divide-y divide-gray-100 dark:divide-gray-800">
          <!-- Daily Study Reminder -->
          <div class="flex items-center justify-between gap-4 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Daily Study Reminder
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Get reminded to practice every day
              </p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="notifications.dailyReminder"
              class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
              :class="
                notifications.dailyReminder
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              "
              @click="notifications.dailyReminder = !notifications.dailyReminder"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                :class="
                  notifications.dailyReminder ? 'translate-x-6' : 'translate-x-1'
                "
              />
            </button>
          </div>

          <!-- Streak Alert -->
          <div class="flex items-center justify-between gap-4 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Streak Alert
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Notify me when I'm about to lose my streak
              </p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="notifications.streakAlert"
              class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
              :class="
                notifications.streakAlert
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              "
              @click="notifications.streakAlert = !notifications.streakAlert"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                :class="
                  notifications.streakAlert ? 'translate-x-6' : 'translate-x-1'
                "
              />
            </button>
          </div>

          <!-- Weekly Progress Report -->
          <div class="flex items-center justify-between gap-4 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Weekly Progress Report
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Receive a summary of your week every Sunday
              </p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="notifications.weeklyReport"
              class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
              :class="
                notifications.weeklyReport
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              "
              @click="notifications.weeklyReport = !notifications.weeklyReport"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                :class="
                  notifications.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                "
              />
            </button>
          </div>

          <!-- Promotional Emails -->
          <div class="flex items-center justify-between gap-4 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Promotional Emails
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Tips, feature updates and special offers
              </p>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="notifications.promoEmails"
              class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
              :class="
                notifications.promoEmails
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              "
              @click="notifications.promoEmails = !notifications.promoEmails"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                :class="
                  notifications.promoEmails ? 'translate-x-6' : 'translate-x-1'
                "
              />
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================================
           SECURITY
      ============================================================= -->
      <div
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 class="text-base font-semibold text-gray-900 dark:text-white">
          Security
        </h2>

        <p
          v-if="passwordMessage"
          class="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400"
        >
          {{ passwordMessage }}
        </p>
        <p
          v-if="passwordError"
          class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {{ passwordError }}
        </p>

        <div class="mt-5 grid gap-5">
          <!-- Current Password -->
          <div>
            <label
              for="currentPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current Password
            </label>
            <div class="relative mt-2">
              <input
                id="currentPassword"
                v-model="currentPassword"
                :type="showPassword ? 'text' : 'password'"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <Icon
                  :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'"
                  class="h-4 w-4"
                />
              </button>
            </div>
          </div>

          <!-- New Password -->
          <div>
            <label
              for="newPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <div class="relative mt-2">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                :aria-label="
                  showNewPassword ? 'Hide password' : 'Show password'
                "
                @click="showNewPassword = !showNewPassword"
              >
                <Icon
                  :name="
                    showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'
                  "
                  class="h-4 w-4"
                />
              </button>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm New Password
            </label>
            <div class="relative mt-2">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                :aria-label="
                  showConfirmPassword ? 'Hide password' : 'Show password'
                "
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Icon
                  :name="
                    showConfirmPassword
                      ? 'heroicons:eye-slash'
                      : 'heroicons:eye'
                  "
                  class="h-4 w-4"
                />
              </button>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              @click="updatePassword"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================================
           DANGER ZONE
      ============================================================= -->
      <div
        class="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/50 dark:bg-gray-900"
      >
        <h2 class="text-base font-semibold text-red-600 dark:text-red-400">
          Danger Zone
        </h2>

        <div class="mt-5 divide-y divide-gray-100 dark:divide-gray-800">
          <!-- Clear Quiz History -->
          <div
            class="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Clear Quiz History
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Remove all your quiz records and analytics data. This cannot be
                undone.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              @click="clearQuizHistory"
            >
              Clear History
            </button>
          </div>

          <!-- Log Out All Devices -->
          <div class="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Log Out of All Devices
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Invalidate all active sessions and log out everywhere.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="logOutAllDevices"
            >
              Log Out All
            </button>
          </div>

          <!-- Delete Account -->
          <div class="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                Delete Account
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              @click="deleteAccount"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>