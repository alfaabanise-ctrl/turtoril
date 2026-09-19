<script setup lang="ts">
import type { UserRole } from '~/types/nav'

const props = defineProps<{ role: UserRole }>()
const route = useRoute();
const { isHidden, isMobile } = useNavVisibility()


const {
  getVisibleItems,
  isRouteAuthorized,
  getDashboard,
} = useNavItems();


watch(
  () => [route.path, props.role],
  async () => {
    if (!props.role) {
      return;
    }

    const allowed =
      isRouteAuthorized(
        route.path,
        props.role
      );

    if (!allowed) {
      await navigateTo(
        getDashboard(props.role)
      );
    }
  },
  {
    immediate: true,
  }
);
const visibleItems = computed(() => getVisibleItems(props.role))


const isExpanded = ref(false)
const toggleExpand = () => (isExpanded.value = !isExpanded.value)


const toggleHidden = () => (isHidden.value = !isHidden.value)
const showLabels = computed(() => isExpanded.value || isMobile.value)
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


  <!-- The nav itself -->
  <aside
    class="fixed left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 rounded-3xl bg-gray-900/90 backdrop-blur-md border border-gray-800 shadow-2xl py-5 transition-all duration-300 ease-in-out z-40"
    :class="[
      showLabels ? 'w-52 px-4' : 'w-16 px-2',
      isHidden  ? '-translate-x-[150%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100',
    ]"
  >
    <!-- spacer so nav items don't sit under the fixed toggle button -->
   

    <!-- Expand/collapse toggle -->
    <button  v-if="!isMobile"
      @click="toggleExpand"
      class="mb-4 flex items-center justify-center w-10 h-10 rounded-full text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
      :class="showLabels  ? 'self-end' : ''"
    >
      <Icon
        name="i-heroicons-chevron-right"
        class="w-5 h-5 transition-transform duration-300"
        :class="showLabels  ? 'rotate-180' : ''"
      />
    </button>

    <!-- Nav items -->
    <nav class="w-full">
      <ul class="flex flex-col gap-2 w-full">
        <li v-for="item in visibleItems" :key="item.to" class="group relative w-full">
          <NuxtLink
            :to="item.to"
            class="flex items-center rounded-2xl text-sm font-medium transition-all duration-200 overflow-hidden"
            :class="[
              showLabels  ? 'gap-3 px-3 py-2.5 w-full justify-start' : 'justify-center w-11 h-11 mx-auto',
                isItemActive(item.to)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white',
            ]"
          >
            <Icon :name="item.icon" class="text-xl shrink-0" />
            <span
              class="whitespace-nowrap transition-all duration-200"
              :class="showLabels  ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 overflow-hidden'"
            >
              {{ item.label }}
            </span>
          </NuxtLink>

          <span
            v-if="!showLabels "
            class="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-md bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50"
          >
            {{ item.label }}
          </span>
        </li>
      </ul>
    </nav>
  </aside>
</div>
</template>