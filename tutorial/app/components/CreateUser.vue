<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";

/* =========================================================
 * TYPES
 * ========================================================= */

type UserType = "student" | "teacher" | "admin";

interface UserForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/* =========================================================
 * PROPS
 * ========================================================= */

const props = withDefaults(
  defineProps<{
    type: UserType;
    buttonText?: string;
    buttonIcon?: string;
    buttonIconClass?: string;
    buttonClass?: string;
  }>(),
  {
    buttonText: "Create User",
    buttonIcon: "lucide:plus",
    buttonIconClass: "h-5 w-5",
    buttonClass:
      "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700",
  },
);

/* =========================================================
 * NUXT
 * ========================================================= */

const config = useRuntimeConfig();
const { $toast } = useNuxtApp();

/* =========================================================
 * MODAL
 * ========================================================= */

const isOpen = ref(false);

/* =========================================================
 * LOADING
 * ========================================================= */

const loading = ref(false);
const verifying = ref(false);
const resending = ref(false);

/* =========================================================
 * VERIFICATION
 * ========================================================= */

const verificationStep = ref(false);
const verificationCode = ref("");
const verificationError = ref("");

/* =========================================================
 * FORM
 * ========================================================= */

const form = reactive<UserForm>({
  fullName: "",
  email: "",
  phone: "",
  password: "",
});

/* =========================================================
 * DYNAMIC LABELS
 * ========================================================= */

const typeLabel = computed(() => {
  const labels: Record<UserType, string> = {
    student: "Student",
    teacher: "Teacher",
    admin: "Admin",
  };

  return labels[props.type];
});

const modalTitle = computed(() => {
  return `Add ${typeLabel.value}`;
});

const modalDescription = computed(() => {
  const descriptions: Record<UserType, string> = {
    student: "Create a JAMB student account.",
    teacher: "Create a teacher account for managing students.",
    admin: "Create an administrator account.",
  };

  return descriptions[props.type];
});

const emailPlaceholder = computed(() => {
  const placeholders: Record<UserType, string> = {
    student: "student@example.com",
    teacher: "teacher@example.com",
    admin: "admin@example.com",
  };

  return placeholders[props.type];
});

const roleIcon = computed(() => {
  const icons: Record<UserType, string> = {
    student: "lucide:graduation-cap",
    teacher: "lucide:book-open",
    admin: "lucide:shield-check",
  };

  return icons[props.type];
});

/* =========================================================
 * OPEN MODAL
 * ========================================================= */

const openModal = () => {
  resetForm();

  verificationStep.value = false;
  verificationCode.value = "";
  verificationError.value = "";

  isOpen.value = true;
};

/* =========================================================
 * CLOSE MODAL
 * ========================================================= */

const closeModal = () => {
  if (loading.value || verifying.value || resending.value) {
    return;
  }

  isOpen.value = false;

  resetForm();

  verificationStep.value = false;
  verificationCode.value = "";
  verificationError.value = "";
};

/* =========================================================
 * RESET FORM
 * ========================================================= */

const resetForm = () => {
  form.fullName = "";
  form.email = "";
  form.phone = "";
  form.password = "";
};

/* =========================================================
 * VALIDATE FORM
 * ========================================================= */

const validateForm = () => {
  if (!form.fullName.trim()) {
    $toast?.error?.("Please enter the full name.");
    return false;
  }

  if (!form.email.trim()) {
    $toast?.error?.("Please enter an email address.");
    return false;
  }

  if (!form.phone.trim()) {
    $toast?.error?.("Please enter a phone number.");
    return false;
  }

  if (!form.password.trim()) {
    $toast?.error?.("Please enter a password.");
    return false;
  }

  if (form.password.length < 6) {
    $toast?.error?.("Password must be at least 6 characters.");
    return false;
  }

  return true;
};

/* =========================================================
 * SPLIT FULL NAME
 *
 * "John Peter Doe"
 *
 * firstName = John
 * lastName  = Peter Doe
 * ========================================================= */

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);

  const firstName = parts.shift() || "";

  const lastName = parts.join(" ");

  return {
    firstName,
    lastName,
  };
};

/* =========================================================
 * GET API ERROR MESSAGE
 * ========================================================= */

const getErrorMessage = (error: any) => {
  return (
    error?.data?.message ||
    error?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

/* =========================================================
 * CREATE USER
 * ========================================================= */

const createUser = async () => {
  if (loading.value) return;

  if (!validateForm()) return;

  loading.value = true;

  try {
    const { firstName, lastName } = splitFullName(form.fullName);

    /*
     * The exact payload sent to your backend.
     */

    const payload = {
      firstName,
      lastName,
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,

      /*
       * student | teacher | admin
       */
      role: props.type,
    };

    console.log("CREATE USER URL:", `${config.public.apiUrl}/auth/register`);

    console.log("CREATE USER PAYLOAD:", payload);

    const response: any = await $fetch(
      `${config.public.apiUrl}/auth/register`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: payload,
      },
    );

    console.log("CREATE USER RESPONSE:", response);

    /*
     * If your backend automatically sends
     * a verification email after registration,
     * show the verification screen.
     */

    verificationError.value = "";

    verificationCode.value = "";

    verificationStep.value = true;

    $toast?.success?.(
      response?.message ||
        `${typeLabel.value} account created. Verification code sent to email.`,
    );
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);

    $toast?.error?.(
      getErrorMessage(error),
    );
  } finally {
    loading.value = false;
  }
};

/* =========================================================
 * VERIFY EMAIL
 * ========================================================= */

const verifyEmail = async () => {
  if (verifying.value) return;

  verificationError.value = "";

  const code = verificationCode.value.trim();

  if (!code) {
    verificationError.value =
      "Please enter the verification code.";

    return;
  }

  if (!/^\d{6}$/.test(code)) {
    verificationError.value =
      "Verification code must contain 6 digits.";

    return;
  }

  verifying.value = true;

  try {
    const payload = {
      email: form.email.trim(),
      code,
      isPrivate:true,
      role: props.type,
    };

    console.log(
      "VERIFY EMAIL URL:",
      `${config.public.apiUrl}/auth/verify-email`,
    );

    console.log("VERIFY EMAIL PAYLOAD:", payload);

    const response: any = await $fetch(
      `${config.public.apiUrl}/auth/verify-email`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: payload,
      },
    );

    console.log("VERIFY EMAIL RESPONSE:", response);

    $toast?.success?.(
      response?.message ||
        `${typeLabel.value} email verified successfully.`,
    );

    /*
     * Close after successful verification.
     */

    verificationStep.value = false;

    verificationCode.value = "";

    isOpen.value = false;

    resetForm();
  } catch (error: any) {
    console.error("VERIFY EMAIL ERROR:", error);

    const message = getErrorMessage(error);

    verificationError.value = message;

    $toast?.error?.(message);
  } finally {
    verifying.value = false;
  }
};

/* =========================================================
 * RESEND VERIFICATION CODE
 * ========================================================= */

const resendVerification = async () => {
  if (resending.value) return;

  resending.value = true;

  verificationError.value = "";

  try {
    const payload = {
      email: form.email.trim(),
      role: props.type,
    };

    console.log(
      "RESEND VERIFICATION URL:",
      `${config.public.apiUrl}/auth/auth/resend-otp`,
    );

    console.log(
      "RESEND VERIFICATION PAYLOAD:",
      payload,
    );

    const response: any = await $fetch(
      `${config.public.apiUrl}/auth/resend-otp`,
      {
        method: "POST",

        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: payload,
      },
    );

    console.log(
      "RESEND VERIFICATION RESPONSE:",
      response,
    );

    $toast?.success?.(
      response?.message ||
        "A new verification code has been sent.",
    );
  } catch (error: any) {
    console.error(
      "RESEND VERIFICATION ERROR:",
      error,
    );

    const message = getErrorMessage(error);

    verificationError.value = message;

    $toast?.error?.(message);
  } finally {
    resending.value = false;
  }
};

/* =========================================================
 * BACK TO FORM
 * ========================================================= */

const backToForm = () => {
  if (verifying.value) return;

  verificationStep.value = false;

  verificationCode.value = "";

  verificationError.value = "";
};

/* =========================================================
 * WATCH MODAL
 * ========================================================= */

watch(isOpen, (value) => {
  if (!value) {
    verificationStep.value = false;
    verificationCode.value = "";
    verificationError.value = "";
  }
});
</script>

<template>
  <div>
    <!-- =====================================================
         TRIGGER BUTTON
    ====================================================== -->

    <button
      type="button"
      :class="buttonClass"
      @click="openModal"
    >
      <Icon
        :name="buttonIcon"
        :class="buttonIconClass"
      />

      <span>
        {{ buttonText }}
      </span>
    </button>

    <!-- =====================================================
         MODAL
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <!-- BACKDROP -->

          <div
            class="absolute inset-0 bg-black/50 backdrop-blur-sm"
            @click="closeModal"
          />

          <!-- MODAL -->

          <div
            class="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          >
            <!-- =================================================
                 HEADER
            ================================================== -->

            <div
              class="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h2
                    class="text-lg font-bold text-gray-900 dark:text-white"
                  >
                    {{
                      verificationStep
                        ? "Verify Email"
                        : modalTitle
                    }}
                  </h2>

                  <span
                    v-if="!verificationStep"
                    class="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                  >
                    {{ typeLabel }}
                  </span>
                </div>

                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {{
                    verificationStep
                      ? `Enter the 6-digit code sent to ${form.email}`
                      : modalDescription
                  }}
                </p>
              </div>

              <button
                type="button"
                class="ml-4 shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                :disabled="
                  loading ||
                  verifying ||
                  resending
                "
                @click="closeModal"
              >
                <Icon
                  name="heroicons:x-mark"
                  class="h-5 w-5"
                />
              </button>
            </div>

            <!-- =================================================
                 VERIFICATION SCREEN
            ================================================== -->

            <div
              v-if="verificationStep"
              class="p-6"
            >
              <div class="mx-auto max-w-md">
                <!-- Icon -->

                <div
                  class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10"
                >
                  <Icon
                    name="lucide:mail-check"
                    class="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <!-- Text -->

                <div class="mt-5 text-center">
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Check your email
                  </h3>

                  <p
                    class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
                  >
                    We sent a verification code to
                  </p>

                  <p
                    class="mt-1 break-all text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{ form.email }}
                  </p>
                </div>

                <!-- Error -->

                <div
                  v-if="verificationError"
                  class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                >
                  <div class="flex items-start gap-2">
                    <Icon
                      name="lucide:circle-alert"
                      class="mt-0.5 h-4 w-4 shrink-0"
                    />

                    <span>
                      {{ verificationError }}
                    </span>
                  </div>
                </div>

                <!-- CODE -->

                <div class="mt-6">
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Verification Code
                  </label>

                  <input
                    v-model="verificationCode"
                    type="text"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    maxlength="6"
                    placeholder="000000"
                    class="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    @input="
                      verificationCode =
                        verificationCode
                          .replace(/\D/g, '')
                          .slice(0, 6)
                    "
                    @keyup.enter="verifyEmail"
                  />
                </div>

                <!-- VERIFY -->

                <button
                  type="button"
                  :disabled="
                    verifying ||
                    verificationCode.length !== 6
                  "
                  class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="verifyEmail"
                >
                  <Icon
                    v-if="verifying"
                    name="lucide:loader-2"
                    class="h-5 w-5 animate-spin"
                  />

                  <Icon
                    v-else
                    name="lucide:shield-check"
                    class="h-5 w-5"
                  />

                  {{
                    verifying
                      ? "Verifying..."
                      : "Verify Email"
                  }}
                </button>

                <!-- RESEND -->

                <div class="mt-5 text-center">
                  <p
                    class="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Didn't receive the code?
                  </p>

                  <button
                    type="button"
                    :disabled="resending"
                    class="mt-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400"
                    @click="resendVerification"
                  >
                    <span
                      v-if="resending"
                      class="inline-flex items-center gap-1.5"
                    >
                      <Icon
                        name="lucide:loader-2"
                        class="h-4 w-4 animate-spin"
                      />

                      Sending...
                    </span>

                    <span v-else>
                      Resend verification code
                    </span>
                  </button>
                </div>

                <!-- BACK -->

                <button
                  type="button"
                  :disabled="verifying"
                  class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="backToForm"
                >
                  <Icon
                    name="lucide:arrow-left"
                    class="h-4 w-4"
                  />

                  Back to form
                </button>
              </div>
            </div>

            <!-- =================================================
                 CREATE USER FORM
            ================================================== -->

            <form
              v-else
              class="space-y-5 p-6"
              @submit.prevent="createUser"
            >
              <div class="grid gap-5 sm:grid-cols-2">
                <!-- ACCOUNT TYPE -->

                <div class="sm:col-span-2">
                  <div
                    class="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10"
                  >
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                    >
                      <Icon
                        :name="roleIcon"
                        class="h-5 w-5"
                      />
                    </div>

                    <div class="min-w-0">
                      <p
                        class="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {{ typeLabel }} account
                      </p>

                      <p
                        class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                      >
                        {{ modalDescription }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- FULL NAME -->

                <div class="sm:col-span-2">
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>

                  <div class="relative">
                    <Icon
                      name="lucide:user"
                      class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      v-model="form.fullName"
                      type="text"
                      placeholder="Enter full name"
                      autocomplete="name"
                      required
                      class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <!-- EMAIL -->

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>

                  <div class="relative">
                    <Icon
                      name="lucide:mail"
                      class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      v-model="form.email"
                      type="email"
                      :placeholder="emailPlaceholder"
                      autocomplete="email"
                      required
                      class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <!-- PHONE -->

                <div>
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </label>

                  <div class="relative">
                    <Icon
                      name="lucide:phone"
                      class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      v-model="form.phone"
                      type="tel"
                      placeholder="08012345678"
                      autocomplete="tel"
                      required
                      class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <!-- PASSWORD -->

                <div class="sm:col-span-2">
                  <label
                    class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Temporary Password
                  </label>

                  <div class="relative">
                    <Icon
                      name="lucide:lock"
                      class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      v-model="form.password"
                      type="password"
                      placeholder="Enter temporary password"
                      autocomplete="new-password"
                      minlength="6"
                      required
                      class="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>

                  <p
                    class="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Minimum 6 characters.
                  </p>
                </div>
              </div>

              <!-- =================================================
                   ACTIONS
              ================================================== -->

              <div
                class="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800"
              >
                <button
                  type="button"
                  :disabled="loading"
                  class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="closeModal"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  :disabled="loading"
                  class="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon
                    v-if="loading"
                    name="lucide:loader-2"
                    class="h-4 w-4 animate-spin"
                  />

                  <Icon
                    v-else
                    name="lucide:user-plus"
                    class="h-4 w-4"
                  />

                  {{
                    loading
                      ? "Creating..."
                      : `Create ${typeLabel}`
                  }}
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
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>