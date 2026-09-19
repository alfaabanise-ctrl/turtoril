<script setup lang="ts">
import type { UserRole } from "~/types/nav";

const props = defineProps<{
    role: string;
    user?: {
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
        avatar?: string;
    };
}>();

const route = useRoute();

const isUserMenuOpen = ref(false);
const isSearchOpen = ref(false);
const search = ref("");

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

const userName = computed(() => {
    if (props.user?.name) {
        return props.user.name;
    }

    const name = [props.user?.firstName, props.user?.lastName].filter(Boolean).join(" ");

    return name || "User";
});

const userInitials = computed(() => {
    const name = userName.value.trim();

    if (!name) return "U";

    return name
        .split(" ")
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
});

/*
|--------------------------------------------------------------------------
| Page title
|--------------------------------------------------------------------------
*/

const pageTitle = computed(() => {
    const path = route.path;

    if (path === "/dashboard" || path === "/") {
        return "Dashboard";
    }

    const lastSegment = path.split("/").filter(Boolean).pop();

    if (!lastSegment) {
        return "Dashboard";
    }

    return lastSegment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
});

/*
|--------------------------------------------------------------------------
| Greeting
|--------------------------------------------------------------------------
*/

const greeting = computed(() => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 18) {
        return "Good afternoon";
    }

    return "Good evening";
});

/*
|--------------------------------------------------------------------------
| Role label
|--------------------------------------------------------------------------
*/

const roleLabel = computed(() => {
    const role = String(props.role);

    return role.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
});

/*
|--------------------------------------------------------------------------
| Close menu
|--------------------------------------------------------------------------
*/

const closeUserMenu = () => {
    isUserMenuOpen.value = false;
};

const toggleUserMenu = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value;
};

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

const logout = async () => {
  isUserMenuOpen.value = false;

  try {
    await useApiFetch('/auth/logout', { method: 'POST' });
  } catch (e) {
    console.error('Logout failed', e);
  }

  await navigateTo('/auth');
};

/*
|--------------------------------------------------------------------------
| Keyboard
|--------------------------------------------------------------------------
*/

const handleKeydown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        isSearchOpen.value = true;
    }
};

onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
    <header
        class="sticky top-0 z-30 w-full border-b border-gray-200/70 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <div class="flex min-h-[72px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            <!-- =================================================
           LEFT
      ================================================== -->

            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                    <h1 class="truncate text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
                        {{ pageTitle }}
                    </h1>
                </div>

                <p class="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
                    {{ greeting }},

                    <span class="font-medium text-gray-700 dark:text-gray-200">
                        {{ userName }}
                    </span>
                </p>
            </div>

            <!-- =================================================
           SEARCH
      ================================================== -->

            <div class="hidden w-full max-w-xs md:block">
                <div class="relative">
                    <Icon name="heroicons:magnifying-glass"
                        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input v-model="search" type="text" placeholder="Search..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-14 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:bg-gray-900" />
                    
                    <kbd
                        class="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 lg:block dark:border-gray-700 dark:bg-gray-800">
                        ⌘ K
                    </kbd>
                </div>
            </div>

            <!-- =================================================
           RIGHT ACTIONS
      ================================================== -->

            <div class="flex items-center gap-1.5 sm:gap-2">
                <!-- Mobile search -->

                <button type="button"
                    class="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 md:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    @click="isSearchOpen = !isSearchOpen">
                    <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
                </button>

                <!-- Notifications -->

                <button type="button"
                    class="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
                    <Icon name="heroicons:bell" class="h-5 w-5" />

                    <!-- Notification dot -->

                    <span
                        class="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
                </button>

                <!-- Divider -->

                <div class="mx-1 hidden h-8 w-px bg-gray-200 sm:block dark:bg-gray-800" />

                <!-- =================================================
             USER MENU
        ================================================== -->

                <div class="relative">
                    <button type="button"
                        class="flex items-center gap-2 rounded-xl p-1 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                        @click.stop="toggleUserMenu">
                        <!-- Avatar -->

                        <div v-if="user?.avatar" class="h-9 w-9 overflow-hidden rounded-xl">
                            <img :src="user.avatar" :alt="userName" class="h-full w-full object-cover" />
                        </div>

                        <div v-else
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-sm">
                            {{ userInitials }}
                        </div>

                        <!-- User information -->

                        <div class="hidden min-w-0 text-left lg:block">
                            <p class="max-w-[120px] truncate text-sm font-semibold text-gray-900 dark:text-white">
                                {{ userName }}
                            </p>

                            <p class="max-w-[120px] truncate text-[11px] text-gray-400">
                                {{ roleLabel }}
                            </p>
                        </div>

                        <Icon name="heroicons:chevron-down" class="hidden h-4 w-4 text-gray-400 lg:block"
                            :class="isUserMenuOpen ? 'rotate-180' : ''" />
                    </button>

                    <!-- =================================================
               DROPDOWN
          ================================================== -->

                    <Transition enter-active-class="
              transition
              duration-150
              ease-out
            " enter-from-class="
              opacity-0
              scale-95
              -translate-y-1
            " enter-to-class="
              opacity-100
              scale-100
              translate-y-0
            " leave-active-class="
              transition
              duration-100
              ease-in
            " leave-from-class="
              opacity-100
              scale-100
              translate-y-0
            " leave-to-class="
              opacity-0
              scale-95
              -translate-y-1
            ">
                        <div v-if="isUserMenuOpen"
                            class="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10 dark:border-gray-800 dark:bg-gray-900"
                            @click.stop>
                            <!-- User info -->

                            <div class="border-b border-gray-100 px-4 py-4 dark:border-gray-800">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                                        {{ userInitials }}
                                    </div>

                                    <div class="min-w-0">
                                        <p class="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                            {{ userName }}
                                        </p>

                                        <p class="truncate text-xs text-gray-400">
                                            {{ user?.email || "No email available" }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Menu -->

                            <div class="p-2">
                                <NuxtLink to="/settings"
                                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    @click="closeUserMenu">
                                    <Icon name="heroicons:user-circle" class="h-5 w-5 text-gray-400" />

                                    My Profile
                                </NuxtLink>

                                <NuxtLink to="/settings"
                                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                    @click="closeUserMenu">
                                    <Icon name="heroicons:cog-6-tooth" class="h-5 w-5 text-gray-400" />

                                    Settings
                                </NuxtLink>
                            </div>

                            <!-- Logout -->

                            <div class="border-t border-gray-100 p-2 dark:border-gray-800">
                                <button type="button"
                                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                    @click="logout">
                                    <Icon name="heroicons:arrow-left-on-rectangle" class="h-5 w-5" />

                                    Sign out
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <!-- =====================================================
         MOBILE SEARCH
    ====================================================== -->

        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
            <div v-if="isSearchOpen" class="border-t border-gray-100 px-4 py-3 md:hidden dark:border-gray-800">
                <div class="relative">
                    <Icon name="heroicons:magnifying-glass"
                        class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input v-model="search" autofocus type="text" placeholder="Search dashboard..."
                        class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
                </div>
            </div>
        </Transition>
    </header>
</template>
