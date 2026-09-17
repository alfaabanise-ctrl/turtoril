```vue
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "nav",
});

/* ================================================================
 * TYPES
 * ================================================================ */

type UserRole =
  | "student"
  | "teacher"
  | "admin"
  | "superadmin";

type Theme = "light" | "dark";

interface LocationData {
  country: string;
  state: string;
  city: string;
  address: string;
}

interface TeacherDetails {
  address: string;
  qualification: string;
  experience: number;
  skills: string[];
  subjects: string[];
  language: string;
  about: string;
}

interface StudentDetails {
  examTarget: string;
  subjects: string[];
  schoolName: string;
  className: string;
  studyLevel: string;
}

interface AdminDetails {
  department: string;
  adminLevel: string;
  maintenanceMode: boolean;
  about: string;
}

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  verified: boolean;
  verifiedAt: string | null;
}

interface NotificationSettings {
  dailyReminder: boolean;
  streakAlert: boolean;
  weeklyReport: boolean;
  promoEmails: boolean;
}

interface AppearanceSettings {
  theme: Theme;
}

interface UserDetails {
  _id?: string;
  user?: string;

  bio?: string;
  gender?: string;
  dateOfBirth?: string | null;
  language?: string;

  teacher?: Partial<TeacherDetails>;
  student?: Partial<StudentDetails>;
  admin?: Partial<AdminDetails>;

  bank?: Partial<BankDetails>;

  notifications?: Partial<NotificationSettings>;

  appearance?: Partial<AppearanceSettings>;

  preferences?: {
    timezone?: string;
    currency?: string;
  };
}

interface ProfileUser {
  _id: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  email: string;
  phone?: string | null;
  whatsapp_no?: string | null;
  ExamYear?: number;
  role: UserRole;
  status?: string;
  location?: Partial<LocationData>;
  commissionPercentage?: number;
  details?: UserDetails;
}

/* ================================================================
 * API
 * ================================================================ */

const auth = useAuth();

const profile = ref<ProfileUser | null>(null);

const isLoading = ref(false);
const isSaving = ref(false);
const loadError = ref("");
const saveMessage = ref("");
const saveError = ref("");

/* ================================================================
 * ROLE
 * ================================================================ */

const currentRole = computed<UserRole>(() => {
  const role = profile.value?.role;

  if (
    role === "teacher" ||
    role === "admin" ||
    role === "superadmin"
  ) {
    return role;
  }

  return "student";
});

const isStudent = computed(
  () => currentRole.value === "student"
);

const isTeacher = computed(
  () => currentRole.value === "teacher"
);

const isAdmin = computed(
  () =>
    currentRole.value === "admin" ||
    currentRole.value === "superadmin"
);

const canManageBankDetails = computed(
  () => isTeacher.value || isAdmin.value
);

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

    case "superadmin":
      return {
        text: "Super Admin",
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

/*
 * IMPORTANT:
 *
 * The role is READ ONLY.
 * We don't allow the user to change:
 *
 * role
 * commissionPercentage
 * adminOwner
 * teacherOwner
 * status
 *
 * The backend controls these.
 */

/* ================================================================
 * PROFILE STATE
 * ================================================================ */

const firstName = ref("");
const middleName = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const whatsappNo = ref("");
const examYear = ref<number | null>(null);
const examTarget = ref("");

const location = ref<LocationData>({
  country: "Nigeria",
  state: "",
  city: "",
  address: "",
});

const fullName = computed(() =>
  [
    firstName.value,
    middleName.value,
    lastName.value,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
);

const initials = computed(() => {
  const f = firstName.value?.trim()?.[0] ?? "";
  const l = lastName.value?.trim()?.[0] ?? "";

  return (
    `${f}${l}`.toUpperCase() || "U"
  );
});

/* ================================================================
 * TEACHER
 * ================================================================ */

const teacherAddress = ref("");
const teacherLanguage = ref("English (UK)");
const teacherQualification = ref("");
const teacherExperience = ref(0);
const teacherAbout = ref("");

const newSkill = ref("");

const teacherSkills = ref<string[]>([]);

const addSkill = () => {
  const value = newSkill.value.trim();

  if (
    value &&
    !teacherSkills.value.some(
      (skill) =>
        skill.toLowerCase() === value.toLowerCase()
    )
  ) {
    teacherSkills.value.push(value);
  }

  newSkill.value = "";
};

const removeSkill = (index: number) => {
  teacherSkills.value.splice(index, 1);
};

/* ================================================================
 * ADMIN
 * ================================================================ */

const adminLevel = ref("");
const adminDepartment = ref("");
const systemMaintenanceMode = ref(false);

/* ================================================================
 * BANK
 * ================================================================ */

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

const bankDetails = ref<BankDetails>({
  bankName: "",
  accountNumber: "",
  accountName: "",
  verified: false,
  verifiedAt: null,
});

const isVerifying = ref(false);
const isSavingBank = ref(false);
const bankMessage = ref("");
const bankError = ref("");

const hasBankDetails = computed(
  () =>
    !!bankDetails.value.bankName &&
    bankDetails.value.accountNumber.length === 10 &&
    !!bankDetails.value.accountName.trim()
);

const onAccountNumberInput = (
  event: Event
) => {
  const target =
    event.target as HTMLInputElement;

  const digits = target.value
    .replace(/\D/g, "")
    .slice(0, 10);

  bankDetails.value.accountNumber = digits;

  target.value = digits;

  bankDetails.value.verified = false;
  bankDetails.value.verifiedAt = null;

  bankError.value = "";
  bankMessage.value = "";
};

const resetBankDetails = () => {
  const details = profile.value?.details?.bank;

  bankDetails.value = {
    bankName: details?.bankName || "",
    accountNumber:
      details?.accountNumber || "",
    accountName:
      details?.accountName || "",
    verified:
      details?.verified || false,
    verifiedAt:
      details?.verifiedAt || null,
  };

  bankMessage.value = "";
  bankError.value = "";
};

/*
 * This is intentionally still a local verification placeholder.
 *
 * A real bank verification should be performed on the backend
 * through Paystack's bank account resolve API or your chosen
 * bank verification service.
 */
const verifyAccount = async () => {
  bankMessage.value = "";
  bankError.value = "";

  if (!bankDetails.value.bankName) {
    bankError.value =
      "Please select your bank first.";
    return;
  }

  if (
    bankDetails.value.accountNumber.length !==
    10
  ) {
    bankError.value =
      "Account number must be exactly 10 digits.";
    return;
  }

  isVerifying.value = true;

  try {
    /*
     * Replace with your real backend bank
     * verification endpoint when available.
     */
    bankDetails.value.accountName =
      bankDetails.value.accountName ||
      fullName.value.toUpperCase();

    bankDetails.value.verified = true;

    bankMessage.value =
      "Account details verified.";
  } catch (error: any) {
    bankError.value =
      error?.message ||
      "Could not verify this account.";
  } finally {
    isVerifying.value = false;
  }
};

/* ================================================================
 * SUBJECTS
 * ================================================================ */

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

const toggleSubject = (
  subject: string
) => {
  const index =
    selectedSubjects.value.indexOf(subject);

  if (index > -1) {
    selectedSubjects.value.splice(
      index,
      1
    );
  } else if (
    selectedSubjects.value.length <
    MAX_SUBJECTS
  ) {
    selectedSubjects.value.push(subject);
  }
};

const isSubjectSelected = (
  subject: string
) =>
  selectedSubjects.value.includes(
    subject
  );

const subjectsLimitReached =
  computed(
    () =>
      selectedSubjects.value.length >=
      MAX_SUBJECTS
  );

/* ================================================================
 * NOTIFICATIONS
 * ================================================================ */

const notifications =
  ref<NotificationSettings>({
    dailyReminder: true,
    streakAlert: true,
    weeklyReport: false,
    promoEmails: false,
  });

/* ================================================================
 * THEME
 * ================================================================ */

const selectedTheme =
  ref<Theme>("light");

const setTheme = async (
  theme: Theme
) => {
  selectedTheme.value = theme;

  if (theme === "dark") {
    document.documentElement.classList.add(
      "dark"
    );
    localStorage.setItem(
      "theme",
      "dark"
    );
  } else {
    document.documentElement.classList.remove(
      "dark"
    );
    localStorage.setItem(
      "theme",
      "light"
    );
  }

  /*
   * Save theme to OthersSchema.
   */
  await saveProfile({
    details: {
      appearance: {
        theme,
      },
    },
  });
};

/* ================================================================
 * PASSWORD
 * ================================================================ */

const showPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword =
  ref(false);

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const passwordMessage = ref("");
const passwordError = ref("");
const isUpdatingPassword =
  ref(false);

const updatePassword = async () => {
  passwordMessage.value = "";
  passwordError.value = "";

  if (!currentPassword.value) {
    passwordError.value =
      "Please enter your current password.";
    return;
  }

  if (!newPassword.value) {
    passwordError.value =
      "Please enter your new password.";
    return;
  }

  if (newPassword.value.length < 8) {
    passwordError.value =
      "New password must be at least 8 characters long.";
    return;
  }

  if (
    newPassword.value ===
    currentPassword.value
  ) {
    passwordError.value =
      "New password must be different from your current password.";
    return;
  }

  if (!confirmPassword.value) {
    passwordError.value =
      "Please confirm your new password.";
    return;
  }

  if (
    newPassword.value !==
    confirmPassword.value
  ) {
    passwordError.value =
      "Passwords do not match.";
    return;
  }

  isUpdatingPassword.value = true;

  try {
    const response =
      await useApiFetch(
        "/profile/me/password",
        {
          method: "PUT",

          body: {
            currentPassword:
              currentPassword.value,

            newPassword:
              newPassword.value,
          },
        }
      );

    if (!response.success) {
      passwordError.value =
        response.message ||
        "Failed to update password.";

      return;
    }

    passwordMessage.value =
      response.message ||
      "Password updated successfully.";

    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error: any) {
    passwordError.value =
      error?.message ||
      "Failed to update password.";
  } finally {
    isUpdatingPassword.value =
      false;
  }
};

/* ================================================================
 * LOAD PROFILE
 * ================================================================ */

const loadProfile = async () => {
  isLoading.value = true;
  loadError.value = "";

  try {
    const response =
      await useApiFetch<{
        success: boolean;
        user: ProfileUser;
        message?: string;
      }>("/profile/me");

    if (!response.success) {
      loadError.value =
        response.message ||
        "Failed to load your profile.";

      return;
    }

    const data =
      response.data?.user;

    if (!data) {
      loadError.value =
        "Profile data was not returned by the server.";

      return;
    }

    profile.value = data;

    /*
     * ------------------------------------------------------------
     * USER
     * ------------------------------------------------------------
     */

    firstName.value =
      data.firstName || "";

    middleName.value =
      data.middleName || "";

    lastName.value =
      data.lastName || "";

    email.value =
      data.email || "";

    phone.value =
      data.phone || "";

    whatsappNo.value =
      data.whatsapp_no || "";

    examYear.value =
      data.ExamYear ?? null;

    /*
     * ------------------------------------------------------------
     * LOCATION
     * ------------------------------------------------------------
     */

    location.value = {
      country:
        data.location?.country ||
        "Nigeria",

      state:
        data.location?.state || "",

      city:
        data.location?.city || "",

      address:
        data.location?.address || "",
    };

    /*
     * ------------------------------------------------------------
     * DETAILS
     * ------------------------------------------------------------
     */

    const details =
      data.details || {};

    /*
     * Student
     */
    console.log(details.subjects, 'details.subjects');
    
    examTarget.value =
      details.student?.examTarget ||
      "";

    selectedSubjects.value =
      Array.isArray(
        details?.subjects
      )
        ? [
            ...details!.subjects!,
          ]
        : [];

    /*
     * Teacher
     */

    teacherAddress.value =
      details.teacher?.address ||
      "";

    teacherLanguage.value =
      details.teacher?.language ||
      details.language ||
      "English (UK)";

    teacherQualification.value =
      details.teacher?.qualification ||
      "";

    teacherExperience.value =
      Number(
        details.teacher?.experience || 0
      );

    teacherAbout.value =
      details.teacher?.about ||
      "";

    teacherSkills.value =
      Array.isArray(
        details.teacher?.skills
      )
        ? [
            ...details.teacher!.skills!,
          ]
        : [];

    /*
     * Admin
     */

    adminLevel.value =
      details.admin?.adminLevel ||
      "";

    adminDepartment.value =
      details.admin?.department ||
      "";

    systemMaintenanceMode.value =
      Boolean(
        details.admin
          ?.maintenanceMode
      );

    /*
     * Bank
     */

    bankDetails.value = {
      bankName:
        details.bank?.bankName || "",

      accountNumber:
        details.bank?.accountNumber ||
        "",

      accountName:
        details.bank?.accountName ||
        "",

      verified:
        Boolean(
          details.bank?.verified
        ),

      verifiedAt:
        details.bank?.verifiedAt ||
        null,
    };

    /*
     * Notifications
     */

    notifications.value = {
      dailyReminder:
        details.notifications
          ?.dailyReminder ??
        true,

      streakAlert:
        details.notifications
          ?.streakAlert ??
        true,

      weeklyReport:
        details.notifications
          ?.weeklyReport ??
        false,

      promoEmails:
        details.notifications
          ?.promoEmails ??
        false,
    };

    /*
     * Appearance
     */

    const backendTheme =
      details.appearance?.theme;

    if (
      backendTheme === "dark" ||
      backendTheme === "light"
    ) {
      selectedTheme.value =
        backendTheme;
    }

    applyTheme(
      selectedTheme.value
    );

    /*
     * Update auth state if possible.
     *
     * We don't assume a particular implementation
     * of useAuth(), so we only update when the object
     * is writable.
     */
    try {
      if (
        auth?.value &&
        auth.value.user
      ) {
        Object.assign(
          auth.value.user,
          data
        );
      }
    } catch {
      // Auth state update is optional.
    }
  } catch (error: any) {
    console.error(
      "LOAD PROFILE ERROR:",
      error
    );

    loadError.value =
      error?.message ||
      "Failed to load your profile.";
  } finally {
    isLoading.value = false;
  }
};

/* ================================================================
 * APPLY THEME
 * ================================================================ */

const applyTheme = (
  theme: Theme
) => {
  if (!import.meta.client) {
    return;
  }

  if (theme === "dark") {
    document.documentElement.classList.add(
      "dark"
    );

    localStorage.setItem(
      "theme",
      "dark"
    );
  } else {
    document.documentElement.classList.remove(
      "dark"
    );

    localStorage.setItem(
      "theme",
      "light"
    );
  }
};

/* ================================================================
 * SAVE PROFILE
 * ================================================================ */

interface ProfileUpdatePayload {
  firstName?: string;
  middleName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  whatsapp_no?: string | null;
  ExamYear?: number | null;

  location?: Partial<LocationData>;

  details?: UserDetails;
}

const saveProfile = async (
  payload: ProfileUpdatePayload
) => {
  const response =
    await useApiFetch<{
      success: boolean;
      message?: string;
      user?: ProfileUser;
    }>("/profile/me", {
      method: "PUT",
      body: payload,
    });

  if (!response.success) {
    throw new Error(
      response.message ||
        "Failed to save profile."
    );
  }

  /*
   * Backend returns the updated user.
   */
  if (response.data?.user) {
    profile.value =
      response.data.user;
  }

  return response.data;
};

/* ================================================================
 * SAVE ACCOUNT DETAILS
 * ================================================================ */

const saveAccountDetails = async () => {
  saveMessage.value = "";
  saveError.value = "";
  isSaving.value = true;

  try {
    await saveProfile({
      firstName:
        firstName.value.trim(),

      middleName:
        middleName.value.trim() ||
        null,

      lastName:
        lastName.value.trim() ||
        null,

      phone:
        phone.value.trim() ||
        null,

      whatsapp_no:
        whatsappNo.value.trim() ||
        null,

      ExamYear:
        examYear.value,

      location: {
        country:
          location.value.country,

        state:
          location.value.state,

        city:
          location.value.city,

        address:
          location.value.address,
      },

      details: {
        student: {
          examTarget:
            examTarget.value,

          subjects:
            selectedSubjects.value,
        },

        teacher: {
          address:
            teacherAddress.value,

          language:
            teacherLanguage.value,

          qualification:
            teacherQualification.value,

          experience:
            teacherExperience.value,

          skills:
            teacherSkills.value,

          about:
            teacherAbout.value,
        },

        admin: {
          adminLevel:
            adminLevel.value,

          department:
            adminDepartment.value,

          maintenanceMode:
            systemMaintenanceMode.value,
        },
      },
    });

    saveMessage.value =
      "Account details saved successfully.";
  } catch (error: any) {
    saveError.value =
      error?.message ||
      "Failed to save account details.";
  } finally {
    isSaving.value = false;
  }
};

/* ================================================================
 * SAVE BANK
 * ================================================================ */

const saveBankDetails = async () => {
  bankMessage.value = "";
  bankError.value = "";

  if (!bankDetails.value.bankName) {
    bankError.value =
      "Please select your bank.";
    return;
  }

  if (
    bankDetails.value.accountNumber.length !==
    10
  ) {
    bankError.value =
      "Account number must be exactly 10 digits.";
    return;
  }

  if (
    !bankDetails.value.accountName.trim()
  ) {
    bankError.value =
      "Please enter the account name.";
    return;
  }

  isSavingBank.value = true;

  try {
    await saveProfile({
      details: {
        bank: {
          bankName:
            bankDetails.value.bankName,

          accountNumber:
            bankDetails.value.accountNumber,

          accountName:
            bankDetails.value.accountName,

          verified:
            bankDetails.value.verified,

          verifiedAt:
            bankDetails.value.verifiedAt,
        },
      },
    });

    bankMessage.value =
      "Bank account details saved successfully.";
  } catch (error: any) {
    bankError.value =
      error?.message ||
      "Failed to save bank details.";
  } finally {
    isSavingBank.value = false;
  }
};

/* ================================================================
 * SAVE SUBJECTS
 * ================================================================ */

const isSavingSubjects =
  ref(false);

const subjectMessage = ref("");
const subjectError = ref("");

const saveSubjects = async () => {
  subjectMessage.value = "";
  subjectError.value = "";

  if (
    selectedSubjects.value.length >
    MAX_SUBJECTS
  ) {
    subjectError.value =
      `You can select up to ${MAX_SUBJECTS} subjects.`;

    return;
  }

  isSavingSubjects.value = true;
  console.log( selectedSubjects.value);
  
  try {
    await saveProfile({
      details: {
        student: {
          subjects:
            selectedSubjects.value,
        },

        teacher: {
          subjects:
            selectedSubjects.value,
        },
      },
    });

    subjectMessage.value =
      "Subjects saved successfully.";
  } catch (error: any) {
    subjectError.value =
      error?.message ||
      "Failed to save subjects.";
  } finally {
    isSavingSubjects.value = false;
  }
};

/* ================================================================
 * SAVE NOTIFICATIONS
 * ================================================================ */

const isSavingNotifications =
  ref(false);

const notificationMessage = ref("");

const saveNotifications =
  async () => {
    notificationMessage.value = "";
    isSavingNotifications.value =
      true;

    try {
      await saveProfile({
        details: {
          notifications: {
            ...notifications.value,
          },
        },
      });

      notificationMessage.value =
        "Notification settings saved.";
    } catch (error: any) {
      notificationMessage.value =
        error?.message ||
        "Failed to save notifications.";
    } finally {
      isSavingNotifications.value =
        false;
    }
  };

/* ================================================================
 * DANGER ACTIONS
 * ================================================================ */

const clearQuizHistory = () => {
  if (
    confirm(
      "Clear quiz history?"
    )
  ) {
    alert(
      "Connect this button to your quiz-history DELETE endpoint."
    );
  }
};

const logOutAllDevices = () => {
  if (
    confirm(
      "Log out everywhere?"
    )
  ) {
    alert(
      "Connect this button to your session/revoke endpoint."
    );
  }
};

const deleteAccount = () => {
  if (
    confirm(
      "Delete account? This cannot be undone."
    )
  ) {
    alert(
      "Connect this button to your account deletion endpoint."
    );
  }
};

/* ================================================================
 * MOUNT
 * ================================================================ */

onMounted(async () => {
  /*
   * First load backend profile.
   */
  await loadProfile();

  /*
   * If backend doesn't have appearance yet,
   * use local device theme.
   */
  if (
    !profile.value?.details
      ?.appearance?.theme
  ) {
    const savedTheme =
      localStorage.getItem(
        "theme"
      );

    if (
      savedTheme === "dark"
    ) {
      selectedTheme.value =
        "dark";
    } else {
      selectedTheme.value =
        "light";
    }

    applyTheme(
      selectedTheme.value
    );
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950"
  >
    <div
      class="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8"
    >

      <!-- ============================================================
           LOADING
      ============================================================= -->

      <div
        v-if="isLoading"
        class="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        ></div>

        <p
          class="mt-4 text-sm text-gray-500 dark:text-gray-400"
        >
          Loading your profile...
        </p>
      </div>

      <!-- ============================================================
           ERROR
      ============================================================= -->

      <div
        v-if="loadError"
        class="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/30"
      >
        <div class="flex items-start gap-3">
          <Icon
            name="heroicons:exclamation-triangle"
            class="mt-0.5 h-5 w-5 text-red-600"
          />

          <div>
            <p
              class="font-medium text-red-800 dark:text-red-300"
            >
              Unable to load profile
            </p>

            <p
              class="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {{ loadError }}
            </p>

            <button
              type="button"
              class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              @click="loadProfile"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

      <template v-if="profile && !isLoading">

        <!-- ============================================================
             PROFILE CARD
        ============================================================= -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-wrap items-center gap-4"
          >
            <div
              class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white"
            >
              {{ initials }}
            </div>

            <div class="min-w-0 flex-1">
              <h1
                class="truncate text-lg font-semibold text-gray-900 dark:text-white"
              >
                {{ fullName || "User" }}
              </h1>

              <p
                class="truncate text-sm text-gray-500 dark:text-gray-400"
              >
                {{ email }}
              </p>

              <div
                class="mt-2 flex flex-wrap items-center gap-2"
              >
                <span
                  class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {{ profile.status || "Active" }}
                </span>

                <span
                  class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="roleBadge.classes"
                >
                  <Icon
                    :name="roleBadge.icon"
                    class="h-3.5 w-3.5"
                  />

                  {{ roleBadge.text }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================
             ACCOUNT DETAILS
        ============================================================= -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <h2
            class="text-base font-semibold text-gray-900 dark:text-white"
          >
            Account Details
          </h2>

          <div
            class="mt-6 grid gap-5 sm:grid-cols-2"
          >

            <!-- First -->
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

            <!-- Middle -->
            <div>
              <label
                for="middleName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Middle Name
              </label>

              <input
                id="middleName"
                v-model="middleName"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Last -->
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
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>

              <input
                id="email"
                :value="email"
                type="email"
                disabled
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
              />

              <p
                class="mt-1 text-xs text-gray-500"
              >
                Email is managed by your account.
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone
              </label>

              <input
                id="phone"
                v-model="phone"
                type="tel"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- WhatsApp -->
            <div>
              <label
                for="whatsapp"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                WhatsApp Number
              </label>

              <input
                id="whatsapp"
                v-model="whatsappNo"
                type="tel"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Exam Year -->
            <div
              v-if="isStudent"
            >
              <label
                for="examYear"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Exam Year
              </label>

              <input
                id="examYear"
                v-model.number="examYear"
                type="number"
                min="2000"
                max="2100"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Exam Target -->
            <div
              v-if="isStudent"
            >
              <label
                for="examTarget"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Exam Target
              </label>

              <select
                id="examTarget"
                v-model="examTarget"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">
                  Select exam
                </option>

                <option>
                  JAMB (UTME/DE)
                </option>

                <option>
                  WAEC
                </option>

                <option>
                  NECO
                </option>
              </select>
            </div>

            <!-- Country -->
            <div>
              <label
                for="country"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Country
              </label>

              <input
                id="country"
                v-model="location.country"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- State -->
            <div>
              <label
                for="state"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                State
              </label>

              <input
                id="state"
                v-model="location.state"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- City -->
            <div>
              <label
                for="city"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                City
              </label>

              <input
                id="city"
                v-model="location.city"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Address -->
            <div
              class="sm:col-span-2"
            >
              <label
                for="address"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address
              </label>

              <input
                id="address"
                v-model="location.address"
                type="text"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <!-- Teacher -->
            <template
              v-if="isTeacher"
            >
              <div
                class="sm:col-span-2"
              >
                <label
                  for="teacherAddress"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Teacher Address
                </label>

                <input
                  id="teacherAddress"
                  v-model="teacherAddress"
                  type="text"
                  class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  for="teacherLanguage"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Language
                </label>

                <select
                  id="teacherLanguage"
                  v-model="teacherLanguage"
                  class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option>
                    English (UK)
                  </option>

                  <option>
                    English (US)
                  </option>

                  <option>
                    French
                  </option>

                  <option>
                    Spanish
                  </option>
                </select>
              </div>

              <div>
                <label
                  for="qualification"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Qualification
                </label>

                <input
                  id="qualification"
                  v-model="teacherQualification"
                  type="text"
                  class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label
                  for="experience"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Experience (Years)
                </label>

                <input
                  id="experience"
                  v-model.number="teacherExperience"
                  type="number"
                  min="0"
                  class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div
                class="sm:col-span-2"
              >
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Skills
                </label>

                <div
                  class="mt-2 flex gap-2"
                >
                  <input
                    v-model="newSkill"
                    type="text"
                    placeholder="Add a skill..."
                    class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    @keyup.enter="addSkill"
                  />

                  <button
                    type="button"
                    class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    @click="addSkill"
                  >
                    Add
                  </button>
                </div>

                <div
                  class="mt-3 flex flex-wrap gap-2"
                >
                  <span
                    v-for="(
                      skill,
                      index
                    ) in teacherSkills"
                    :key="skill"
                    class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {{ skill }}

                    <button
                      type="button"
                      class="text-gray-400 hover:text-red-500"
                      @click="
                        removeSkill(index)
                      "
                    >
                      <Icon
                        name="heroicons:x-mark"
                        class="h-3.5 w-3.5"
                      />
                    </button>
                  </span>
                </div>
              </div>
            </template>

            <!-- ADMIN -->
            <template
              v-if="isAdmin"
            >
              <div>
                <label
                  for="adminLevel"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Admin Level
                </label>

                <input
                  id="adminLevel"
                  :value="adminLevel"
                  disabled
                  type="text"
                  class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                />
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
                  class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div
                class="sm:col-span-2 flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
              >
                <div>
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    System Maintenance Mode
                  </p>

                  <p
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Temporarily disable access for non-admin users.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  :aria-checked="
                    systemMaintenanceMode
                  "
                  class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                  :class="
                    systemMaintenanceMode
                      ? 'bg-red-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  "
                  @click="
                    systemMaintenanceMode =
                      !systemMaintenanceMode
                  "
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                    :class="
                      systemMaintenanceMode
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    "
                  ></span>
                </button>
              </div>
            </template>
          </div>

          <p
            v-if="saveMessage"
            class="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            {{ saveMessage }}
          </p>

          <p
            v-if="saveError"
            class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ saveError }}
          </p>

          <div
            class="mt-6 flex justify-end"
          >
            <button
              type="button"
              :disabled="isSaving"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              @click="saveAccountDetails"
            >
              {{
                isSaving
                  ? "Saving..."
                  : "Save Changes"
              }}
            </button>
          </div>
        </div>

        <!-- ============================================================
             BANK
        ============================================================= -->

        <div
          v-if="canManageBankDetails"
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-wrap items-start justify-between gap-3"
          >
            <div>
              <h2
                class="text-base font-semibold text-gray-900 dark:text-white"
              >
                Bank Account Details
              </h2>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                Used for payouts and earnings.
              </p>
            </div>

            <span
              v-if="
                bankDetails.verified
              "
              class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"
            >
              <Icon
                name="heroicons:check-badge"
                class="h-3.5 w-3.5"
              />
              Verified
            </span>

            <span
              v-else-if="
                hasBankDetails
              "
              class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            >
              Not verified
            </span>

            <span
              v-else
              class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              Not set
            </span>
          </div>

          <div
            class="mt-6 grid gap-5 sm:grid-cols-2"
          >
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
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                @change="
                  bankDetails.verified = false
                "
              >
                <option value="">
                  Select your bank
                </option>

                <option
                  v-for="bank in banks"
                  :key="bank"
                  :value="bank"
                >
                  {{ bank }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="accountNumber"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Account Number
              </label>

              <input
                id="accountNumber"
                :value="
                  bankDetails.accountNumber
                "
                type="text"
                inputmode="numeric"
                autocomplete="off"
                maxlength="10"
                placeholder="0123456789"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm tracking-widest text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                @input="onAccountNumberInput"
              />

              <p
                class="mt-1 text-xs text-gray-500"
              >
                10 digits, no spaces.
              </p>
            </div>

            <div
              class="sm:col-span-2"
            >
              <label
                for="accountName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Account Name
              </label>

              <div
                class="mt-2 flex gap-2"
              >
                <input
                  id="accountName"
                  v-model="
                    bankDetails.accountName
                  "
                  type="text"
                  placeholder="Account name"
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm uppercase text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  @input="
                    bankDetails.verified = false
                  "
                />

                <button
                  type="button"
                  :disabled="isVerifying"
                  class="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                  @click="verifyAccount"
                >
                  {{
                    isVerifying
                      ? "Verifying..."
                      : "Verify"
                  }}
                </button>
              </div>
            </div>
          </div>

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

          <div
            class="mt-6 flex justify-end gap-3"
          >
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="resetBankDetails"
            >
              Reset
            </button>

            <button
              type="button"
              :disabled="isSavingBank"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              @click="saveBankDetails"
            >
              {{
                isSavingBank
                  ? "Saving..."
                  : "Save Bank Details"
              }}
            </button>
          </div>
        </div>

        <!-- ============================================================
             SUBJECTS
        ============================================================= -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div
            class="flex flex-wrap items-center justify-between gap-2"
          >
            <h2
              class="text-base font-semibold text-gray-900 dark:text-white"
            >
              My Subjects
            </h2>

            <span
              class="text-xs text-gray-500 dark:text-gray-400"
            >
              {{ selectedSubjects.length }}/{{
                MAX_SUBJECTS
              }}
              selected
            </span>
          </div>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            You can select up to 4 subjects.
          </p>

          <div
            class="mt-5 flex flex-wrap gap-2"
          >
            <button
              v-for="subject in availableSubjects"
              :key="subject"
              type="button"
              :disabled="
                !isSubjectSelected(subject) &&
                subjectsLimitReached
              "
              class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
              :class="
                isSubjectSelected(subject)
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400'
              "
              @click="
                toggleSubject(subject)
              "
            >
              {{ subject }}
            </button>
          </div>

          <p
            v-if="subjectMessage"
            class="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            {{ subjectMessage }}
          </p>

          <p
            v-if="subjectError"
            class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400"
          >
            {{ subjectError }}
          </p>

          <div
            class="mt-6 flex justify-end"
          >
            <button
              type="button"
              :disabled="isSavingSubjects"
              class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              @click="saveSubjects"
            >
              {{
                isSavingSubjects
                  ? "Saving..."
                  : "Save Subjects"
              }}
            </button>
          </div>
        </div>

        <!-- ============================================================
             APPEARANCE
        ============================================================= -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <h2
            class="text-base font-semibold text-gray-900 dark:text-white"
          >
            Appearance
          </h2>

          <p
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            Choose how the app looks on this device.
          </p>

          <div
            class="mt-4 inline-flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800"
          >
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
              :class="
                selectedTheme === 'light'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              "
              @click="setTheme('light')"
            >
              <Icon
                name="heroicons:sun"
                class="h-4 w-4"
              />

              Light
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium"
              :class="
                selectedTheme === 'dark'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              "
              @click="setTheme('dark')"
            >
              <Icon
                name="heroicons:moon"
                class="h-4 w-4"
              />

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
          <div
            class="flex items-center justify-between"
          >
            <div>
              <h2
                class="text-base font-semibold text-gray-900 dark:text-white"
              >
                Notifications
              </h2>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                Manage your notification preferences.
              </p>
            </div>

            <button
              type="button"
              :disabled="
                isSavingNotifications
              "
              class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              @click="
                saveNotifications
              "
            >
              {{
                isSavingNotifications
                  ? "Saving..."
                  : "Save"
              }}
            </button>
          </div>

          <div
            class="mt-5 divide-y divide-gray-100 dark:divide-gray-800"
          >
            <div
              v-for="item in [
                {
                  key: 'dailyReminder',
                  title: 'Daily Study Reminder',
                  description: 'Get reminded to practice every day',
                },
                {
                  key: 'streakAlert',
                  title: 'Streak Alert',
                  description: 'Notify me when I am about to lose my streak',
                },
                {
                  key: 'weeklyReport',
                  title: 'Weekly Progress Report',
                  description: 'Receive a summary of your week',
                },
                {
                  key: 'promoEmails',
                  title: 'Promotional Emails',
                  description: 'Tips, updates and special offers',
                },
              ]"
              :key="item.key"
              class="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ item.title }}
                </p>

                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ item.description }}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                :aria-checked="
                  notifications[
                    item.key as keyof NotificationSettings
                  ]
                "
                class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition"
                :class="
                  notifications[
                    item.key as keyof NotificationSettings
                  ]
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                "
                @click="
                  notifications[
                    item.key as keyof NotificationSettings
                  ] =
                    !notifications[
                      item.key as keyof NotificationSettings
                    ]
                "
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                  :class="
                    notifications[
                      item.key as keyof NotificationSettings
                    ]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  "
                ></span>
              </button>
            </div>
          </div>

          <p
            v-if="notificationMessage"
            class="mt-4 text-sm text-green-600 dark:text-green-400"
          >
            {{ notificationMessage }}
          </p>
        </div>

        <!-- ============================================================
             SECURITY
        ============================================================= -->

        <div
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <h2
            class="text-base font-semibold text-gray-900 dark:text-white"
          >
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

          <div
            class="mt-5 grid gap-5"
          >
            <div>
              <label
                for="currentPassword"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Current Password
              </label>

              <div
                class="relative mt-2"
              >
                <input
                  id="currentPassword"
                  v-model="currentPassword"
                  :type="
                    showPassword
                      ? 'text'
                      : 'password'
                  "
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  class="absolute inset-y-0 right-0 px-3 text-gray-400"
                  @click="
                    showPassword =
                      !showPassword
                  "
                >
                  <Icon
                    :name="
                      showPassword
                        ? 'heroicons:eye-slash'
                        : 'heroicons:eye'
                    "
                    class="h-4 w-4"
                  />
                </button>
              </div>
            </div>

            <div>
              <label
                for="newPassword"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>

              <div
                class="relative mt-2"
              >
                <input
                  id="newPassword"
                  v-model="newPassword"
                  :type="
                    showNewPassword
                      ? 'text'
                      : 'password'
                  "
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  class="absolute inset-y-0 right-0 px-3 text-gray-400"
                  @click="
                    showNewPassword =
                      !showNewPassword
                  "
                >
                  <Icon
                    :name="
                      showNewPassword
                        ? 'heroicons:eye-slash'
                        : 'heroicons:eye'
                    "
                    class="h-4 w-4"
                  />
                </button>
              </div>
            </div>

            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </label>

              <div
                class="relative mt-2"
              >
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  "
                  class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />

                <button
                  type="button"
                  class="absolute inset-y-0 right-0 px-3 text-gray-400"
                  @click="
                    showConfirmPassword =
                      !showConfirmPassword
                  "
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

            <div
              class="flex justify-end"
            >
              <button
                type="button"
                :disabled="
                  isUpdatingPassword
                "
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                @click="
                  updatePassword
                "
              >
                {{
                  isUpdatingPassword
                    ? "Updating..."
                    : "Update Password"
                }}
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
          <h2
            class="text-base font-semibold text-red-600 dark:text-red-400"
          >
            Danger Zone
          </h2>

          <div
            class="mt-5 divide-y divide-gray-100 dark:divide-gray-800"
          >
            <div
              class="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Clear Quiz History
                </p>

                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Remove your quiz records and analytics data.
                </p>
              </div>

              <button
                type="button"
                class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                @click="
                  clearQuizHistory
                "
              >
                Clear History
              </button>
            </div>

            <div
              class="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Log Out of All Devices
                </p>

                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Invalidate all active sessions.
                </p>
              </div>

              <button
                type="button"
                class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
                @click="
                  logOutAllDevices
                "
              >
                Log Out All
              </button>
            </div>

            <div
              class="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div>
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  Delete Account
                </p>

                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Permanently delete your account and associated data.
                </p>
              </div>

              <button
                type="button"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                @click="
                  deleteAccount
                "
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>
