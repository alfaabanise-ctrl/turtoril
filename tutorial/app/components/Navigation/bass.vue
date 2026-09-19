<script setup lang="ts">
import type { UserRole } from "~/types/nav";

const props = defineProps<{
  role: UserRole;
}>();

const route = useRoute();

const { getVisibleItems } = useNavItems();

const visibleItems = computed(() =>
  getVisibleItems(props.role)
);

/* ================================================================
 * SIDEBAR STATE
 * ================================================================ */

const isExpanded = ref(false);
const isHidden = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function toggleHidden() {
  isHidden.value = !isHidden.value;
}

/* ================================================================
 * ACTIVE MENU
 * ================================================================ */

/*
 * Find every menu item that matches the current URL.
 *
 * Example:
 *
 * /teacher
 * /teacher/payments
 *
 * When current route is:
 * /teacher/payments
 *
 * both can technically match.
 *
 * We choose the LONGEST matching path,
 * so only the most specific menu becomes active.
 */
const activeItemPath = computed(() => {
  const currentPath = route.path;

  const matches = visibleItems.value.filter((item) => {
    const itemPath = item.to;

    return (
      currentPath === itemPath ||
      currentPath.startsWith(itemPath + "/")
    );
  });

  if (!matches.length) {
    return null;
  }

  return matches.reduce((longest, item) => {
    return item.to.length > longest.to.length
      ? item
      : longest;
  }).to;
});

/* ================================================================
 * CHECK ACTIVE
 * ================================================================ */

function isItemActive(to: string) {
  return activeItemPath.value === to;
}
</script>

<template>
  <div>

    <!-- ===========================================================
         HIDE / SHOW BUTTON
    ============================================================ -->

    <button
      type="button"
      @click="toggleHidden"
      class="fixed left-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 bg-gray-900 text-gray-300 shadow-xl transition-all duration-300 ease-in-out hover:bg-gray-800 hover:text-white"
      :aria-label="
        isHidden
          ? 'Show navigation'
          : 'Hide navigation'
      "
    >

      <!-- Menu icon -->
      <Icon
        name="i-heroicons-bars-3"
        class="absolute h-5 w-5 transition-all duration-300"
        :class="
          isHidden
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-75 rotate-90 opacity-0'
        "
      />

      <!-- Close icon -->
      <Icon
        name="i-heroicons-x-mark"
        class="absolute h-5 w-5 transition-all duration-300"
        :class="
          isHidden
            ? 'scale-75 -rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        "
      />

    </button>


    <!-- ===========================================================
         SIDEBAR
    ============================================================ -->

    <aside
      class="fixed left-3 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center rounded-3xl border border-gray-800 bg-gray-900/95 py-5 shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out"
      :class="[
        isExpanded
          ? 'w-52 px-4'
          : 'w-16 px-2',

        isHidden
          ? '-translate-x-[150%] pointer-events-none opacity-0'
          : 'translate-x-0 opacity-100',
      ]"
    >

      <!-- =========================================================
           EXPAND / COLLAPSE BUTTON
      ========================================================== -->

      <button
        type="button"
        @click="toggleExpand"
        class="mb-4 flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        :class="
          isExpanded
            ? 'self-end'
            : 'self-center'
        "
        :aria-label="
          isExpanded
            ? 'Collapse navigation'
            : 'Expand navigation'
        "
      >

        <Icon
          name="i-heroicons-chevron-right"
          class="h-5 w-5 transition-transform duration-300"
          :class="
            isExpanded
              ? 'rotate-180'
              : ''
          "
        />

      </button>


      <!-- =========================================================
           NAVIGATION
      ========================================================== -->

      <nav class="w-full">

        <ul class="flex w-full flex-col gap-2">

          <li
            v-for="item in visibleItems"
            :key="item.to"
            class="group relative w-full"
          >

            <!-- ===================================================
                 LINK
            ==================================================== -->

            <NuxtLink
              :to="item.to"
              class="flex overflow-hidden rounded-2xl text-sm font-medium transition-all duration-200"
              :class="[
                isExpanded
                  ? 'w-full justify-start gap-3 px-3 py-2.5'
                  : 'mx-auto h-11 w-11 justify-center',

                isItemActive(item.to)
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              ]"
            >

              <!-- Icon -->

              <Icon
                :name="item.icon"
                class="h-5 w-5 shrink-0"
              />

              <!-- Label -->

              <span
                class="whitespace-nowrap transition-all duration-200"
                :class="
                  isExpanded
                    ? 'max-w-[140px] opacity-100'
                    : 'max-w-0 overflow-hidden opacity-0'
                "
              >
                {{ item.label }}
              </span>

            </NuxtLink>


            <!-- ===================================================
                 TOOLTIP
            ==================================================== -->

            <span
              v-if="!isExpanded"
              class="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
            >
              {{ item.label }}
            </span>

          </li>

        </ul>

      </nav>

    </aside>

  </div>
</template>