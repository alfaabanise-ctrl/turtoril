<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute, useRuntimeConfig } from "#app";

const { $toast } = useNuxtApp();
const auth = useAuth();
const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();

/* =========================================================
   STATES
========================================================= */

const otpverify = ref(false);
const loading = ref(false);
const registerloading = ref(false);
const loginloading = ref(false);
const resetpassword = ref(false);
const isregisterpage = ref(false);
const loginWithGoogle = ref(false);

/* =========================================================
   REGISTER DATA
========================================================= */

const registerData = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_pwd: "",
  phone: "",
});

/* =========================================================
   LOGIN DATA
========================================================= */

const loginData = reactive({
  email: "",
  password: "",
});

/* =========================================================
   QUERY STATE
========================================================= */

const syncFromQuery = () => {
  resetpassword.value = route.query.forgetpage === "true";
  isregisterpage.value = route.query.type === "register-page";
};

syncFromQuery();



/* =========================================================
   FORGOT PASSWORD
========================================================= */

const handleforgetPage = () => {
  const newQuery = { ...route.query };

  delete newQuery.forgetpage;

  router.replace({
    query: newQuery,
  });
};

const showforgetPage = () => {
  const newQuery = { ...route.query };

  newQuery.forgetpage = "true";

  router.replace({
    query: newQuery,
  });
};

/* =========================================================
   LOGIN / REGISTER SWITCH
========================================================= */

const goToLogin = () => {
  isregisterpage.value = false;

  router.replace({
    query: {
      ...route.query,
      type: "login-page",
    },
  });
};

const goToRegister = () => {
  isregisterpage.value = true;

  router.replace({
    query: {
      ...route.query,
      type: "register-page",
    },
  });
};

const handlechangepage = () => {
  if (isregisterpage.value) {
    goToLogin();
  } else {
    goToRegister();
  }
};

/* =========================================================
   REGISTER
========================================================= */

const handleregister = async () => {
  if (registerloading.value) return;

  registerloading.value = true;

  try {
    // Validate frontend data first
    if (!registerData.first_name.trim()) {
      $toast.error("Please enter your first name.");
      return;
    }

    if (!registerData.last_name.trim()) {
      $toast.error("Please enter your last name.");
      return;
    }

    if (!registerData.email.trim()) {
      $toast.error("Please enter your email address.");
      return;
    }

    if (!registerData.phone.trim()) {
      $toast.error("Please enter your phone number.");
      return;
    }

    if (registerData.password.length < 6) {
      $toast.error("Password must be at least 6 characters.");
      return;
    }


    // EXACT object we are sending
    const payload = {
      firstName: registerData.first_name.trim(),
      lastName: registerData.last_name.trim(),
      email: registerData.email.trim(),
      password: registerData.password,
      phone: registerData.phone.trim(),
    };

    console.log("REGISTER URL:", `${config.public.apiUrl}/auth/register`);
    console.log("REGISTER PAYLOAD:", payload);
    console.log(
      "REGISTER JSON:",
      JSON.stringify(payload)
    );

    const response = await fetch(
      `${config.public.apiUrl}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      }
    );

    console.log("REGISTER STATUS:", response.status);
    console.log("REGISTER RESPONSE URL:", response.url);
    console.log(
      "REGISTER CONTENT TYPE:",
      response.headers.get("content-type")
    );

    const rawResponse = await response.text();

    console.log("REGISTER RAW RESPONSE:", rawResponse);

    let data: any = null;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      console.error(
        "Backend returned non-JSON response:",
        rawResponse
      );

      $toast.error(
        `Server returned an invalid response (${response.status}).`
      );

      return;
    }

    if (!response.ok) {
      $toast.error(
        data?.message || "Registration failed."
      );

      return;
    }

    console.log("REGISTER SUCCESS:", data);

    $toast.success(
      data?.message || "Registration successful."
    );

    setTimeout(() => {
      otpverify.value = true;
    }, 800);

  } catch (err: any) {
    console.error("REGISTER FETCH ERROR:", err);

    $toast.error(
      typeof err?.message === "string"
        ? err.message
        : "Unable to connect to the server."
    );
  } finally {
    registerloading.value = false;
  }
};

/* =========================================================
   LOGIN
========================================================= */

const handlelogin = async () => {
  loginloading.value = true;

  try {
    const response = await fetch(`${config.public.apiUrl}/auth/login/local`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify({
        emaillOrPhone: loginData.email.trim(),
        pwd: loginData.password,
      }),
    });

    const data = await response.json();

    /* ---------------------------------------------
       LOGIN ERROR
    --------------------------------------------- */

    if (!response.ok) {
      $toast.error(data.message || "Login failed.");

      if (response.status === 403) {
        otpverify.value = true;
      }

      return;
    }

    /* ---------------------------------------------
       AUTH STATE
    --------------------------------------------- */
console.log(data);

    auth.value.user = data?.data || null;
    auth.value.authenticated = true;
    auth.value.checked = true;
    auth.value.serverError = false;

    /* ---------------------------------------------
       SUCCESS
    --------------------------------------------- */

    $toast.success(data.message || "Login successful.");

    setTimeout(() => {
  const role = auth.value.user?.role;
      console.log(role, 'role');
      
  if (role === "admin" ) {
    router.push("/admin");
  } else if (role === "teacher") {
    router.push("/teacher");
  }  else if (role === "superadmin") {
    router.push("/super-admin");
  }  else if (role === "student") {
    router.push("/student");
  } else {
    router.push("/search");
  }
}, 800);
  } catch (err: any) {
    console.error("Login failed:", err);

    $toast.error(err?.message || "An error occurred while logging in.");
  } finally {
    loginloading.value = false;
  }
};

/* =========================================================
   GOOGLE LOGIN
========================================================= */

const handleloginwithGoogle = async () => {
  loginWithGoogle.value = true;

  try {
    const response = await fetch(`${config.public.apiUrl}/auth/login/google`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      $toast.error(data.message || "Google login failed.");

      return;
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      $toast.error("Google authentication URL was not returned.");
    }
  } catch (err: any) {
    console.error("Google login failed:", err);

    $toast.error(err?.message || "Unable to continue with Google.");
  } finally {
    loginWithGoogle.value = false;
  }
};

/* =========================================================
   WATCH QUERY
========================================================= */

watch(() => route.query, syncFromQuery, {
  deep: true,
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- =====================================================
         FORGOT PASSWORD
    ====================================================== -->

    <div v-if="resetpassword" class="relative z-50">
      <Forgetpage @close="handleforgetPage" />
    </div>

    <!-- =====================================================
         AUTH PAGE
    ====================================================== -->

    <div v-else class="min-h-screen lg:grid lg:grid-cols-2">
      <!-- ===================================================
           LEFT BRANDING PANEL
      ==================================================== -->

      <section
        class="relative hidden min-h-screen overflow-hidden bg-[#071126] lg:flex lg:flex-col"
      >
        <!-- Background grid -->

        <div
          class="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgba(59,130,246,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.10)_1px,transparent_1px)] bg-[size:38px_38px]"
        />

        <!-- Blue glow -->

        <div
          class="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-3xl"
        />

        <!-- Purple glow -->

        <div
          class="pointer-events-none absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-indigo-600/10 blur-3xl"
        />

        <!-- Content -->

        <div
          class="relative z-10 flex min-h-screen flex-col px-8 py-8 xl:px-12 xl:py-10"
        >
          <!-- Logo -->

          <div class="flex items-center">
            <NavigationLogo />
          </div>

          <!-- Main hero -->

          <div class="flex flex-1 flex-col justify-center max-w-xl">
            <!-- Small badge -->

            <div class="mb-6">
              <span
                class="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-300"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-blue-400" />

                Smarter preparation starts here
              </span>
            </div>

            <!-- Heading -->

            <h1
              class="text-4xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl"
            >
              Nigeria's smartest

              <span class="block text-blue-500"> exam prep </span>

              <span class="block"> platform. </span>
            </h1>

            <!-- Description -->

            <p
              class="mt-5 max-w-lg text-sm leading-7 text-slate-400 xl:text-base"
            >
              Prepare for JAMB, WAEC, NECO and more with thousands of past
              questions, smart practice tools and AI-powered learning support.
            </p>

            <!-- Features -->

            <div class="mt-7 space-y-3">
              <!-- Feature 1 -->

              <div
                class="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 backdrop-blur-sm"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/20"
                >
                  📚
                </span>

                <span> 10,000+ JAMB & WAEC past questions </span>
              </div>

              <!-- Feature 2 -->

              <div
                class="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 backdrop-blur-sm"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-600/20"
                >
                  ✨
                </span>

                <span> AI quizzes from your own notes </span>
              </div>

              <!-- Feature 3 -->

              <div
                class="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-slate-300 backdrop-blur-sm"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600/20"
                >
                  📊
                </span>

                <span> Detailed performance insights </span>
              </div>
            </div>
          </div>

          <!-- Statistics -->

          <div class="flex items-center gap-10 border-t border-white/10 pt-6">
            <div>
              <p class="text-2xl font-bold text-white">10K+</p>

              <p
                class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              >
                Questions
              </p>
            </div>

            <div>
              <p class="text-2xl font-bold text-white">2.4K</p>

              <p
                class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              >
                Active users
              </p>
            </div>

            <div>
              <p class="text-2xl font-bold text-white">Free</p>

              <p
                class="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
              >
                To start
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================================================
           RIGHT AUTH PANEL
      ==================================================== -->

      <section
        class="min-h-screen bg-white px-5 py-6 sm:px-8 lg:px-12 xl:px-16"
      >
        <div
          class="mx-auto flex min-h-screen w-full max-w-[500px] flex-col justify-center"
        >
          <!-- Mobile logo -->

          <div class="mb-7 flex justify-center lg:hidden">
            <NavigationLogo />
          </div>

          <!-- =================================================
               AUTH CONTENT
          ================================================== -->

          <div>
            <!-- Tabs -->

            <div class="mb-9 grid grid-cols-2 rounded-xl bg-[#f4f6ff] p-1">
              <!-- Login -->

              <button
                type="button"
                @click="goToLogin"
                class="rounded-lg px-5 py-3 text-sm font-semibold transition"
                :class="
                  !isregisterpage
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                "
              >
                Log In
              </button>

              <!-- Register -->

              <button
                type="button"
                @click="goToRegister"
                class="rounded-lg px-5 py-3 text-sm font-semibold transition"
                :class="
                  isregisterpage
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                "
              >
                Sign Up
              </button>
            </div>

            <!-- =================================================
                 OTP
            ================================================== -->

            <div
              v-if="otpverify"
              class="flex min-h-[500px] items-center justify-center"
            >
              <AuthEmailVerifcation
                :email="isregisterpage ? registerData.email : loginData.email"
              />
            </div>

            <!-- =================================================
                 LOGIN
            ================================================== -->

            <div v-else-if="!isregisterpage">
              <!-- Header -->

              <div class="mb-7">
                <div
                  class="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600"
                >
                  🎁 Free to join
                </div>

                <h2 class="text-3xl font-bold tracking-tight text-slate-950">
                  Welcome back
                </h2>

                <p class="mt-2 text-sm leading-6 text-slate-500">
                  Sign in and continue your exam preparation journey.
                </p>
              </div>

              <!-- Login form -->

              <form @submit.prevent="handlelogin" class="space-y-5">
                <!-- Email -->

                <FormInput
                  type="email"
                  v-model:inputValue="loginData.email"
                  :required="true"
                  :usePlaceholder="true"
                  label="Email address"
                  placeholder="you@example.com"
                >
                  <template #prefix>
                    <Icon
                      name="heroicons:envelope"
                      class="h-5 w-5 text-slate-400"
                    />
                  </template>
                </FormInput>

                <!-- Password -->

                <FormInput
                  type="password"
                  v-model:inputValue="loginData.password"
                  :required="true"
                  :usePlaceholder="true"
                  label="Password"
                  placeholder="Enter your password"
                />

                <!-- Forgot password -->

                <div class="flex justify-end">
                  <button
                    type="button"
                    @click="showforgetPage"
                    class="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </button>
                </div>

                <!-- Login button -->

                <button
                  type="submit"
                  :disabled="loginloading"
                  class="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    v-if="loginloading"
                    class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />

                  {{ loginloading ? "Logging in..." : "Log In" }}
                </button>

                <!-- Divider -->

                <div class="relative py-2">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200" />
                  </div>

                  <div class="relative flex justify-center">
                    <span class="bg-white px-4 text-xs text-slate-400">
                      or continue with
                    </span>
                  </div>
                </div>

                <!-- Google -->

                <button
                  type="button"
                  @click="handleloginwithGoogle"
                  :disabled="loginWithGoogle"
                  class="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <Icon name="logos:google-icon" class="h-5 w-5" />

                  {{
                    loginWithGoogle ? "Connecting..." : "Continue with Google"
                  }}
                </button>
              </form>

              <!-- Bottom -->

              <p class="mt-7 text-center text-sm text-slate-500">
                Don't have an account?

                <button
                  type="button"
                  @click="goToRegister"
                  class="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign up
                </button>
              </p>
            </div>

            <!-- =================================================
                 REGISTER
            ================================================== -->

            <div v-else>
              <!-- Header -->

              <div class="mb-7">
                <div
                  class="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600"
                >
                  🎁 Free to join
                </div>

                <h2 class="text-3xl font-bold tracking-tight text-slate-950">
                  Create your account
                </h2>

                <p class="mt-2 text-sm leading-6 text-slate-500">
                  Join thousands of Nigerian students preparing smarter for
                  their exams.
                </p>
              </div>

              <!-- Register form -->

              <form @submit.prevent="handleregister" class="space-y-5">
                <!-- First + Last name -->

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <!-- First name -->

                  <FormInput
                    type="text"
                 
                    :required="true"
                    :usePlaceholder="true"
                    label="First name"
                    placeholder="Ada"
                   v-model:inputValue="registerData.first_name"
                  >
                    <template #prefix>
                      <Icon
                        name="heroicons:user"
                        class="h-5 w-5 text-slate-400"
                      />
                    </template>
                  </FormInput>

                  <FormInput
                    type="text"
                   
                    :required="true"
                    :usePlaceholder="true"
                    label="Last name"
                    placeholder="Obi"
                      v-model:inputValue="registerData.last_name"
                  >
                    <template #prefix>
                      <Icon
                        name="heroicons:user"
                        class="h-5 w-5 text-slate-400"
                      />
                    </template>
                  </FormInput>
                </div>

                <!-- Email -->

                <FormInput
                  type="email"
                  v-model:inputValue="registerData.email"
                  :required="true"
                  :usePlaceholder="true"
                  label="Email address"
                  placeholder="you@example.com"
                >
                  <template #prefix>
                    <Icon
                      name="heroicons:envelope"
                      class="h-5 w-5 text-slate-400"
                    />
                  </template>
                </FormInput>

                <!-- Phone -->

                <FormInput
                  type="tel"
                  v-model:inputValue="registerData.phone"
                  :required="true"
                  :usePlaceholder="true"
                  label="Phone number"
                  placeholder="08012345678"
                >
                  <template #prefix>
                    <Icon
                      name="heroicons:device-phone-mobile"
                      class="h-5 w-5 text-slate-400"
                    />
                  </template>
                </FormInput>

                <!-- Password -->

                <FormInput
                  type="password"
                  v-model:inputValue="registerData.password"
                  :required="true"
                  :usePlaceholder="true"
                  label="Password"
                  placeholder="Create a strong password"
                />

                <!-- Terms -->

                <div class="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    class="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <label for="terms" class="text-xs leading-5 text-slate-500">
                    I agree to the

                    <a href="#" class="font-semibold text-blue-600">
                      Terms of Service
                    </a>

                    and

                    <a href="#" class="font-semibold text-blue-600">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <!-- Register button -->

                <button
                  type="submit"
                  :disabled="registerloading"
                  class="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    v-if="registerloading"
                    class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                  />

                  {{
                    registerloading
                      ? "Creating account..."
                      : "Create Free Account"
                  }}
                </button>

                <!-- Divider -->

                <div class="relative py-2">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200" />
                  </div>

                  <div class="relative flex justify-center">
                    <span class="bg-white px-4 text-xs text-slate-400">
                      or continue with
                    </span>
                  </div>
                </div>

                <!-- Google -->

                <button
                  type="button"
                  @click="handleloginwithGoogle"
                  :disabled="loginWithGoogle"
                  class="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <Icon name="logos:google-icon" class="h-5 w-5" />

                  {{
                    loginWithGoogle ? "Connecting..." : "Continue with Google"
                  }}
                </button>
              </form>

              <!-- Bottom -->

              <p class="mt-7 text-center text-sm text-slate-500">
                Already have an account?

                <button
                  type="button"
                  @click="goToLogin"
                  class="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>