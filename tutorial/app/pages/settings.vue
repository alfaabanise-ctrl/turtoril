<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "nav",
});

/* --------------------------------------------------
 * State
 * -------------------------------------------------- */

// --- Role Management ---
type UserRole = "student" | "teacher" | "admin";
const currentRole = ref<UserRole>("student"); // Default role

// Dynamic badge styling and text based on role
const roleBadge = computed(() => {
  switch (currentRole.value) {
    case "teacher":
      return {
        text: "Teacher",
        classes: "bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400/20",
        icon: "heroicons:academic-cap",
      };
    case "admin":
      return {
        text: "Admin",
        classes: "bg-red-50 text-red-700 ring-red-700/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/20",
        icon: "heroicons:shield-check",
      };
    default:
      return {
        text: "Student",
        classes: "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20",
        icon: "heroicons:user",
      };
  }
});

// --- Profile State ---
const firstName = ref("ABDULWAHEED");
const lastName = ref("SOFIYAT");
const email = ref("twinsabanise@gmail.com");
const examTarget = ref("JAMB (UTME/DE)");

// --- Teacher Specific State ---
const teacherAddress = ref("123 Education Lane, Lagos, Nigeria");
const teacherLanguage = ref("English (UK)");
const newSkill = ref("");
const teacherSkills = ref(["Mathematics", "Physics", "Curriculum Development"]);

// --- Admin Specific State ---
const adminLevel = ref("Super Admin");
const adminDepartment = ref("Operations");
const systemMaintenanceMode = ref(false);

// --- Subjects State ---
const selectedSubjects = ref<string[]>([]);
const availableSubjects = [
  "Mathematics", "Chemistry", "Physics", "Biology",
  "English", "Literature", "Geography", "Economics",
  "Government", "Commerce", "C.R.K", "I.R.K"
];

// --- Notifications State ---
const notifications = ref({
  dailyReminder: true,
  streakAlert: true,
  weeklyReport: false,
  promoEmails: false,
});

// --- Password State ---
const showPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const passwordMessage = ref("");
const passwordError = ref("");

// --- Theme State ---
const selectedTheme = ref<"light" | "dark">("light");

/* --------------------------------------------------
 * Methods
 * -------------------------------------------------- */

// --- Teacher Skills ---
const addSkill = () => {
  if (newSkill.value.trim() && !teacherSkills.value.includes(newSkill.value.trim())) {
    teacherSkills.value.push(newSkill.value.trim());
    newSkill.value = "";
  }
};

const removeSkill = (index: number) => {
  teacherSkills.value.splice(index, 1);
};

// --- Theme ---
const setTheme = (theme: "light" | "dark") => {
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
    passwordError.value = "Your new password must be at least 8 characters.";
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match.";
    return;
  }

  passwordMessage.value = "Your password has been updated successfully.";
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
};

// --- General Actions ---
const saveAccountDetails = () => alert("Account details saved!");
const saveSubjects = () => alert(`Subjects saved: ${selectedSubjects.value.join(", ")}`);
const clearQuizHistory = () => confirm("Clear quiz history?") && alert("Cleared.");
const logOutAllDevices = () => confirm("Log out everywhere?") && alert("Logged out.");
const deleteAccount = () => confirm("Delete account? This cannot be undone.") && alert("Deleted.");
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      
      <!-- ROLE SWITCHER (For Testing/Demo) -->
      <div class="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">View settings as:</span>
        <div class="flex gap-2">
          <button 
            @click="currentRole = 'student'" 
            :class="currentRole === 'student' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'"
            class="rounded-md px-3 py-1 text-xs font-medium transition"
          >Student</button>
          <button 
            @click="currentRole = 'teacher'" 
            :class="currentRole === 'teacher' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'"
            class="rounded-md px-3 py-1 text-xs font-medium transition"
          >Teacher</button>
          <button 
            @click="currentRole = 'admin'" 
            :class="currentRole === 'admin' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'"
            class="rounded-md px-3 py-1 text-xs font-medium transition"
          >Admin</button>
        </div>
      </div>

      <!-- Warning Banner (Only for Students) -->
      <div v-if="currentRole === 'student'" class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        <Icon name="heroicons:exclamation-triangle" class="mt-0.5 h-5 w-5 shrink-0" />
        <span>You can select up to 4 subjects.</span>
      </div>

      <div class="space-y-6">
        
        <!-- Profile Header (Dynamic Badge) -->
        <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-sm relative">
                AS
                <Icon name="heroicons:check-badge" class="absolute -bottom-1 -right-1 h-5 w-5 text-blue-500 bg-white rounded-full" />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">ABDULWAHEED SOFIYAT</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">twinsabanise@gmail.com</p>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/20">Free Plan</span>
                  
                  <!-- Dynamic Role Badge -->
                  <span :class="roleBadge.classes" class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                    <Icon :name="roleBadge.icon" class="h-3 w-3" /> {{ roleBadge.text }}
                  </span>
                </div>
              </div>
            </div>
            <button class="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Icon name="heroicons:pencil" class="h-4 w-4" /> Edit
            </button>
          </div>
        </section>

        <!-- Account Details (Common to all) -->
        <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Icon name="heroicons:user" class="h-5 w-5 text-gray-400" /> Account Details
            </h2>
          </div>
          <div class="p-5 sm:p-6">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">First Name</label>
                <input v-model="firstName" type="text" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
              </div>
              <div>
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Name</label>
                <input v-model="lastName" type="text" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
              </div>
              <div class="sm:col-span-2">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address</label>
                <input v-model="email" type="email" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
              </div>
              
              <!-- Exam Target (Only for Students) -->
              <div v-if="currentRole === 'student'" class="sm:col-span-2">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Exam Target</label>
                <select v-model="examTarget" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500">
                  <option>JAMB (UTME/DE)</option>
                  <option>WAEC</option>
                  <option>NECO</option>
                </select>
              </div>

              <!-- Teacher Specific Fields -->
              <template v-if="currentRole === 'teacher'">
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Address</label>
                  <input v-model="teacherAddress" type="text" placeholder="Enter your address" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Language / Locale</label>
                  <select v-model="teacherLanguage" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500">
                    <option>English (UK)</option>
                    <option>English (US)</option>
                    <option>French</option>
                    <option>Spanish</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Skills</label>
                  <div class="flex gap-2 mb-2">
                    <input v-model="newSkill" @keyup.enter="addSkill" type="text" placeholder="Add a skill..." class="h-10 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
                    <button @click="addSkill" type="button" class="h-10 px-4 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">Add</button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(skill, index) in teacherSkills" :key="index" class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {{ skill }}
                      <button @click="removeSkill(index)" class="text-gray-400 hover:text-red-500">
                        <Icon name="heroicons:x-mark" class="h-3 w-3" />
                      </button>
                    </span>
                  </div>
                </div>
              </template>

              <!-- Admin Specific Fields -->
              <template v-if="currentRole === 'admin'">
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Admin Level</label>
                  <select v-model="adminLevel" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500">
                    <option>Super Admin</option>
                    <option>Moderator</option>
                    <option>Support Staff</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Department</label>
                  <input v-model="adminDepartment" type="text" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
                </div>
              </template>

            </div>
            <button @click="saveAccountDetails" class="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:w-auto">
              <Icon name="heroicons:document-check" class="h-4 w-4" /> Save Changes
            </button>
          </div>
        </section>

        <!-- My Subjects (Only for Students) -->
        <section v-if="currentRole === 'student'" class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Icon name="heroicons:book-open" class="h-5 w-5 text-gray-400" /> My Subjects
            </h2>
            <span class="text-xs text-gray-500 dark:text-gray-400">Select up to 4</span>
          </div>
          <div class="p-5 sm:p-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                v-for="subject in availableSubjects"
                :key="subject"
                @click="toggleSubject(subject)"
                class="rounded-lg border px-3 py-2 text-xs font-medium transition"
                :class="
                  selectedSubjects.includes(subject)
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600'
                "
              >
                {{ subject }}
              </button>
            </div>
            <button @click="saveSubjects" class="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <Icon name="heroicons:document-check" class="h-4 w-4" /> Save Subjects
            </button>
          </div>
        </section>

        <!-- Plan & Usage (Only for Students & Teachers) -->
        <section v-if="currentRole !== 'admin'" class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Icon name="heroicons:credit-card" class="h-5 w-5 text-gray-400" /> Plan & Usage
            </h2>
          </div>
          <div class="p-5 sm:p-6">
            <div class="flex flex-col items-start justify-between gap-4 rounded-xl bg-gray-900 p-4 sm:flex-row sm:items-center dark:bg-gray-800">
              <div>
                <h3 class="text-sm font-semibold text-white">Free Plan</h3>
                <p class="text-xs text-gray-400">10 quizzes · 2 AI generations</p>
              </div>
              <button class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700">
                <Icon name="heroicons:sparkles" class="h-3.5 w-3.5" /> Upgrade
              </button>
            </div>
            
            <div class="mt-4 grid grid-cols-3 gap-4">
              <div class="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
                <p class="text-lg font-bold text-gray-900 dark:text-white">0</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Quizzes Taken</p>
              </div>
              <div class="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
                <p class="text-lg font-bold text-gray-900 dark:text-white">0</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">AI Generations</p>
              </div>
              <div class="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-800/50">
                <p class="text-lg font-bold text-gray-900 dark:text-white">0</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Notifications -->
        <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Icon name="heroicons:bell" class="h-5 w-5 text-gray-400" /> Notifications
            </h2>
          </div>
          <div class="divide-y divide-gray-100 p-5 sm:p-6 dark:divide-gray-800">
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Daily Study Reminder</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Get reminded to practice every day</p>
              </div>
              <button @click="notifications.dailyReminder = !notifications.dailyReminder" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="notifications.dailyReminder ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'">
                <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="notifications.dailyReminder ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Streak Alert</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Notify me when I'm about to lose my streak</p>
              </div>
              <button @click="notifications.streakAlert = !notifications.streakAlert" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="notifications.streakAlert ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'">
                <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="notifications.streakAlert ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Weekly Progress Report</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Receive a summary of your week every Sunday</p>
              </div>
              <button @click="notifications.weeklyReport = !notifications.weeklyReport" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="notifications.weeklyReport ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'">
                <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="notifications.weeklyReport ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Promotional Emails</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Tips, feature updates and special offers</p>
              </div>
              <button @click="notifications.promoEmails = !notifications.promoEmails" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none" :class="notifications.promoEmails ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'">
                <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="notifications.promoEmails ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>
          </div>
        </section>

        <!-- Security -->
        <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
            <h2 class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Icon name="heroicons:lock-closed" class="h-5 w-5 text-gray-400" /> Security
            </h2>
          </div>
          <div class="px-5 py-6 sm:px-6">
            <div v-if="passwordMessage" class="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400">
              <Icon name="heroicons:check-circle" class="mt-0.5 h-5 w-5 shrink-0" />
              <span>{{ passwordMessage }}</span>
            </div>
            <div v-if="passwordError" class="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
              <Icon name="heroicons:exclamation-circle" class="mt-0.5 h-5 w-5 shrink-0" />
              <span>{{ passwordError }}</span>
            </div>

            <div class="space-y-4 max-w-xl">
              <div>
                <label for="current-password" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Password</label>
                <div class="relative">
                  <input id="current-password" v-model="currentPassword" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter current password" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200" @click="showPassword = !showPassword">
                    <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label for="new-password" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">New Password</label>
                <div class="relative">
                  <input id="new-password" v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="New password" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200" @click="showNewPassword = !showNewPassword">
                    <Icon :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label for="confirm-password" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Confirm New Password</label>
                <div class="relative">
                  <input id="confirm-password" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Confirm new password" class="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500" />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200" @click="showConfirmPassword = !showConfirmPassword">
                    <Icon :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div class="pt-1">
                <button type="button" class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50" @click="updatePassword">
                  <Icon name="heroicons:lock-closed" class="h-4 w-4" /> Update Password
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="overflow-hidden rounded-2xl border border-red-200 bg-white dark:border-red-900/50 dark:bg-gray-900">
          <div class="border-b border-red-200 px-5 py-4 dark:border-red-900/50 sm:px-6">
            <h2 class="flex items-center gap-2 text-base font-semibold text-red-600 dark:text-red-400">
              <Icon name="heroicons:exclamation-triangle" class="h-5 w-5" /> Danger Zone
            </h2>
          </div>
          <div class="divide-y divide-gray-100 p-5 sm:p-6 dark:divide-gray-800">
            <div class="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Clear Quiz History</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Remove all your quiz records and analytics data. This cannot be undone.</p>
              </div>
              <button @click="clearQuizHistory" class="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-red-300 bg-white px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950/30">
                Clear History
              </button>
            </div>
            <div class="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Log Out of All Devices</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Invalidate all active sessions and log out everywhere.</p>
              </div>
              <button @click="logOutAllDevices" class="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-red-300 bg-white px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950/30">
                Log Out All
              </button>
            </div>
            <div class="flex flex-col items-start justify-between gap-4 py-4 sm:flex-row sm:items-center">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Permanently delete your account and all associated data.</p>
              </div>
              <button @click="deleteAccount" class="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-red-300 bg-white px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950/30">
                Delete Account
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>