
<script setup lang="ts" generic="T extends Record<string, any>">

interface Column {
  key: string;
  label: string;
  class?: string;
  headerClass?: string;
}

interface Stat {
  label: string;
  value: string | number;
  icon?: string;
  color?: "indigo" | "green" | "amber" | "rose" | "blue" | "gray";
}

/*
|--------------------------------------------------------------------------
| PROPS
|--------------------------------------------------------------------------
*/

const props = withDefaults(
  defineProps<{
    /*
    |--------------------------------------------------------------------------
    | DATA
    |--------------------------------------------------------------------------
    */

    items: T[];
    columns: Column[];
    rowKey: keyof T;

    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    title?: string;
    subtitle?: string;

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    searchable?: boolean;
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];

    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */

    stats?: Stat[];
    showTotalStat?: boolean;
    showSummaryCards?: boolean;

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    loading?: boolean;
    emptyText?: string;
    error?: any;

    /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    pagination?: boolean;
    currentPage?: number;
    totalPages?: number;
    totalItems?: number;
    pageSize?: number;
  }>(),
  {
    searchable: true,
    searchPlaceholder: "Search records...",
    showTotalStat: true,
    showSummaryCards: true,
    loading: false,
    emptyText: "No records found",

    pagination: false,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
  }
);


/*
|--------------------------------------------------------------------------
| EMITS
|--------------------------------------------------------------------------
*/

const emit = defineEmits<{
  retry: [];
  pageChange: [page: number];
}>();


/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/

const search = ref("");

const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query || props.searchable === false) {
    return props.items;
  }

  const keys =
    props.searchKeys ??
    (props.columns.map(
      (column) => column.key
    ) as (keyof T)[]);

  return props.items.filter((item) => {
    return keys.some((key) => {
      return String(item[key] ?? "")
        .toLowerCase()
        .includes(query);
    });
  });
});


const clearSearch = () => {
  search.value = "";
};


/*
|--------------------------------------------------------------------------
| STATS
|--------------------------------------------------------------------------
*/

const colorMap: Record<string, string> = {
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",

  green:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",

  amber:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",

  rose:
    "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",

  blue:
    "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",

  gray:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
};


const allStats = computed<Stat[]>(() => {
  const total: Stat = {
    label: "Total",
    value:
      props.totalItems ||
      props.items.length,

    icon: "heroicons:squares-2x2",
    color: "indigo",
  };

  if (props.showTotalStat === false) {
    return props.stats ?? [];
  }

  return [
    total,
    ...(props.stats ?? []),
  ];
});


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const getRowValue = (
  item: T,
  key: string
) => {
  return item[key];
};


/*
|--------------------------------------------------------------------------
| ROW ACTIONS
|--------------------------------------------------------------------------
*/

const openMenuId = ref<string | number | null>(null);

const toggleMenu = (
  id: string | number
) => {
  openMenuId.value =
    openMenuId.value === id
      ? null
      : id;
};

const closeMenu = () => {
  openMenuId.value = null;
};


onMounted(() => {
  window.addEventListener(
    "click",
    closeMenu
  );
});


onUnmounted(() => {
  window.removeEventListener(
    "click",
    closeMenu
  );
});


/*
|--------------------------------------------------------------------------
| PAGINATION
|--------------------------------------------------------------------------
*/

const hasPagination = computed(() => {
  return (
    props.pagination &&
    props.totalPages > 1
  );
});


const canGoPrevious = computed(() => {
  return props.currentPage > 1;
});


const canGoNext = computed(() => {
  return (
    props.currentPage <
    props.totalPages
  );
});


function previousPage() {
  if (!canGoPrevious.value) {
    return;
  }

  emit(
    "pageChange",
    props.currentPage - 1
  );
}


function nextPage() {
  if (!canGoNext.value) {
    return;
  }

  emit(
    "pageChange",
    props.currentPage + 1
  );
}


function goToPage(page: number) {
  if (
    page < 1 ||
    page > props.totalPages ||
    page === props.currentPage
  ) {
    return;
  }

  emit("pageChange", page);
}


/*
|--------------------------------------------------------------------------
| PAGE NUMBERS
|--------------------------------------------------------------------------
*/

const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, index) => index + 1
    );
  }

  const pages: number[] = [];

  pages.push(1);

  if (current > 4) {
    pages.push(-1);
  }

  const start = Math.max(
    2,
    current - 1
  );

  const end = Math.min(
    total - 1,
    current + 1
  );

  for (
    let page = start;
    page <= end;
    page++
  ) {
    pages.push(page);
  }

  if (
    current <
    total - 3
  ) {
    pages.push(-2);
  }

  pages.push(total);

  return pages;
});


/*
|--------------------------------------------------------------------------
| SHOWING TEXT
|--------------------------------------------------------------------------
*/

const showingFrom = computed(() => {
  if (!props.totalItems) {
    return 0;
  }

  return (
    (props.currentPage - 1) *
      props.pageSize +
    1
  );
});


const showingTo = computed(() => {
  if (!props.totalItems) {
    return 0;
  }

  return Math.min(
    props.currentPage *
      props.pageSize,
    props.totalItems
  );
});

</script>


<template>

  <div class="w-full">

    <!-- =====================================================
         MAIN CONTAINER
    ====================================================== -->

    <div
      class="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >

      <!-- ===================================================
           HEADER
      ==================================================== -->

      <div
        class="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between dark:border-gray-800"
      >

        <div>

          <h2
            v-if="title"
            class="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            {{ title }}
          </h2>

          <p
            v-if="subtitle"
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {{ subtitle }}
          </p>

          <p
            v-else
            class="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            View and manage your records.
          </p>

        </div>


        <div
          v-if="$slots.headerAction"
          class="flex items-center gap-2"
        >
          <slot name="headerAction" />
        </div>

      </div>


      <!-- ===================================================
           CONTENT
      ==================================================== -->

      <div class="p-5 sm:p-6">


        <!-- =================================================
             SUMMARY CARDS
        ================================================== -->

        <div
          v-if="
            showSummaryCards &&
            allStats.length
          "
          class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
        >

          <div
            v-for="stat in allStats"
            :key="stat.label"
            class="group relative overflow-hidden rounded-xl border border-gray-200/70 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >

            <div class="flex items-center gap-3">

              <div
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                :class="
                  colorMap[
                    stat.color ?? 'gray'
                  ]
                "
              >

                <Icon
                  :name="
                    stat.icon ??
                    'heroicons:chart-bar'
                  "
                  class="h-5 w-5"
                />

              </div>


              <div class="min-w-0">

                <p
                  class="truncate text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {{ stat.label }}
                </p>

                <p
                  class="mt-0.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
                >
                  {{ stat.value }}
                </p>

              </div>

            </div>

          </div>

        </div>


        <!-- =================================================
             TOOLBAR
        ================================================== -->

        <div
          class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"
        >

          <!-- SEARCH -->

          <div
            v-if="searchable"
            class="relative w-full sm:max-w-sm"
          >

            <Icon
              name="heroicons:magnifying-glass"
              class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />

            <input
              v-model="search"
              type="text"
              :placeholder="
                searchPlaceholder
              "
              class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />

            <button
              v-if="search"
              type="button"
              class="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              @click="clearSearch"
            >

              <Icon
                name="heroicons:x-mark"
                class="h-4 w-4"
              />

            </button>

          </div>


          <!-- FILTERS -->

          <div
            v-if="$slots.filters"
            class="flex flex-wrap items-center gap-2"
          >
            <slot name="filters" />
          </div>


          <!-- ACTIONS -->

          <div
            v-if="$slots.actions"
            class="flex items-center gap-2 sm:ml-auto"
          >
            <slot name="actions" />
          </div>

        </div>


        <!-- =================================================
             RESULT COUNT
        ================================================== -->

        <div
          v-if="!loading && !error"
          class="mb-3 flex items-center justify-between"
        >

          <p
            class="text-xs text-gray-500 dark:text-gray-400"
          >

            Showing

            <span
              class="font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ filteredItems.length }}
            </span>

            of

            <span
              class="font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ totalItems || items.length }}
            </span>

            records

          </p>

        </div>


        <!-- =================================================
             ERROR
        ================================================== -->

        <div
          v-if="error"
          class="rounded-2xl border border-red-100 bg-red-50/50 p-8 dark:border-red-900/30 dark:bg-red-950/20"
        >

          <slot
            name="error"
            :error="error"
          >

            <div
              class="flex flex-col items-center justify-center text-center"
            >

              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500 dark:bg-red-500/10"
              >

                <Icon
                  name="heroicons:exclamation-triangle"
                  class="h-7 w-7"
                />

              </div>

              <h3
                class="mt-4 font-semibold text-gray-900 dark:text-white"
              >
                Something went wrong
              </h3>

              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
              >
                We couldn't load the records.
              </p>

              <button
                type="button"
                class="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
                @click="emit('retry')"
              >

                <Icon
                  name="heroicons:arrow-path"
                  class="h-4 w-4"
                />

                Try again

              </button>

            </div>

          </slot>

        </div>


        <!-- =================================================
             LOADING
        ================================================== -->

        <div
          v-else-if="loading"
          class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800"
        >

          <div class="hidden md:block">

            <div
              class="h-12 bg-gray-50 dark:bg-gray-800"
            />

            <div
              v-for="n in 7"
              :key="n"
              class="flex h-16 items-center gap-6 border-t border-gray-100 px-5 dark:border-gray-800"
            >

              <div
                class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              />

              <div
                class="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              />

              <div
                class="h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              />

              <div
                class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"
              />

              <div
                class="ml-auto h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
              />

            </div>

          </div>


          <div class="space-y-3 p-3 md:hidden">

            <div
              v-for="n in 5"
              :key="n"
              class="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
            />

          </div>

        </div>


        <!-- =================================================
             EMPTY
        ================================================== -->

        <div
          v-else-if="!filteredItems.length"
          class="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-6 text-center dark:border-gray-700 dark:bg-gray-800/20"
        >

          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800"
          >

            <Icon
              :name="
                search
                  ? 'heroicons:magnifying-glass'
                  : 'heroicons:inbox'
              "
              class="h-8 w-8 text-gray-400"
            />

          </div>

          <h3
            class="mt-4 text-sm font-semibold text-gray-900 dark:text-white"
          >
            {{
              search
                ? "No matching records"
                : "No records found"
            }}
          </h3>

          <p
            class="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400"
          >
            {{
              search
                ? "Try adjusting your search or clearing the search field."
                : emptyText
            }}
          </p>

          <button
            v-if="search"
            type="button"
            class="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
            @click="clearSearch"
          >
            Clear search
          </button>

        </div>


        <!-- =================================================
             TABLE
        ================================================== -->

        <template v-else>

          <!-- DESKTOP -->

          <div
            class="hidden overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 md:block"
          >

            <div class="overflow-x-auto">

              <table
                class="w-full min-w-[900px] text-sm"
              >

                <thead>

                  <tr
                    class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50"
                  >

                    <th
                      v-for="column in columns"
                      :key="column.key"
                      class="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      :class="
                        column.headerClass ??
                        column.class
                      "
                    >
                      {{ column.label }}
                    </th>

                    <th
                      v-if="$slots.rowActions"
                      class="w-20 px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  <tr
                    v-for="item in filteredItems"
                    :key="
                      String(
                        item[rowKey]
                      )
                    "
                    class="group border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70 dark:border-gray-800 dark:hover:bg-gray-800/40"
                  >

                    <td
                      v-for="column in columns"
                      :key="column.key"
                      class="px-5 py-4 align-middle text-gray-700 dark:text-gray-200"
                      :class="column.class"
                    >

                      <slot
                        :name="
                          `cell-${column.key}`
                        "
                        :item="item"
                        :value="
                          getRowValue(
                            item,
                            column.key
                          )
                        "
                      >

                        {{
                          getRowValue(
                            item,
                            column.key
                          )
                        }}

                      </slot>

                    </td>


                    <td
                      v-if="$slots.rowActions"
                      class="px-5 py-4 text-right"
                    >

                      <slot
                        name="rowActions"
                        :item="item"
                      />

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>


          <!-- =================================================
               MOBILE
          ================================================== -->

          <div
            class="space-y-3 md:hidden"
          >

            <div
              v-for="item in filteredItems"
              :key="
                String(
                  item[rowKey]
                )
              "
              class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >

              <div
                class="divide-y divide-gray-100 dark:divide-gray-800"
              >

                <div
                  v-for="column in columns"
                  :key="column.key"
                  class="flex items-start justify-between gap-4 px-4 py-3"
                >

                  <span
                    class="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500"
                  >
                    {{ column.label }}
                  </span>

                  <span
                    class="min-w-0 text-right text-sm font-medium text-gray-800 dark:text-gray-200"
                  >

                    <slot
                      :name="
                        `cell-${column.key}`
                      "
                      :item="item"
                      :value="
                        getRowValue(
                          item,
                          column.key
                        )
                      "
                    >

                      {{
                        getRowValue(
                          item,
                          column.key
                        )
                      }}

                    </slot>

                  </span>

                </div>

              </div>


              <div
                v-if="$slots.rowActions"
                class="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30"
              >

                <slot
                  name="rowActions"
                  :item="item"
                />

              </div>

            </div>

          </div>

        </template>


        <!-- =================================================
             PAGINATION
        ================================================== -->

        <div
          v-if="
            hasPagination &&
            !loading &&
            !error
          "
          class="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
        >

          <!-- SHOWING -->

          <p
            class="text-sm text-gray-500 dark:text-gray-400"
          >

            Showing

            <span
              class="font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ showingFrom }}
            </span>

            -

            <span
              class="font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ showingTo }}
            </span>

            of

            <span
              class="font-semibold text-gray-700 dark:text-gray-200"
            >
              {{ totalItems }}
            </span>

            records

          </p>


          <!-- PAGINATION BUTTONS -->

          <div
            class="flex items-center gap-1"
          >

            <!-- PREVIOUS -->

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              :disabled="
                !canGoPrevious ||
                loading
              "
              @click="previousPage"
            >

              <Icon
                name="heroicons:chevron-left"
                class="h-4 w-4"
              />

              Previous

            </button>


            <!-- PAGE NUMBERS -->

            <template
              v-for="page in visiblePages"
              :key="page"
            >

              <span
                v-if="page < 0"
                class="px-2 text-gray-400"
              >
                ...
              </span>


              <button
                v-else
                type="button"
                class="min-w-9 rounded-xl border px-2 py-2 text-sm font-medium transition"
                :class="
                  page === currentPage
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                "
                :disabled="loading"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>

            </template>


            <!-- NEXT -->

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              :disabled="
                !canGoNext ||
                loading
              "
              @click="nextPage"
            >

              Next

              <Icon
                name="heroicons:chevron-right"
                class="h-4 w-4"
              />

            </button>

          </div>

        </div>


        <!-- =================================================
             FOOTER SLOT
        ================================================== -->

        <div
          v-if="$slots.footer"
          class="mt-4"
        >

          <slot
            name="footer"
            :items="filteredItems"
            :total="
              totalItems ||
              items.length
            "
          />

        </div>

      </div>

    </div>

  </div>

</template>


