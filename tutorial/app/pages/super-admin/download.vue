
<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "nav",
});

interface DownloadStats {
  downloadClicks: {
    total: number;
    byPlatform: Record<string, number>;
  };
  confirmedInstalls: {
    total: number;
    byPlatform: Record<string, number>;
  };
  accountsCreated: {
    total: number;
    byPlatform: Record<string, number>;
  };
}

const emptyPlatformCounts = () => ({
  windows: 0,
  android: 0,
  ios: 0,
  macos: 0,
  linux: 0,
  other: 0,
});

const stats = ref<DownloadStats>({
  downloadClicks: { total: 0, byPlatform: emptyPlatformCounts() },
  confirmedInstalls: { total: 0, byPlatform: emptyPlatformCounts() },
  accountsCreated: { total: 0, byPlatform: emptyPlatformCounts() },
});

const platforms = [
  { id: "windows", name: "Windows", icon: "lucide:monitor" },
  { id: "android", name: "Android", icon: "lucide:smartphone" },
  { id: "ios", name: "iPhone / iPad", icon: "lucide:smartphone" },
  { id: "macos", name: "macOS", icon: "lucide:monitor" },
  { id: "linux", name: "Linux", icon: "lucide:monitor" },
  { id: "other", name: "Other", icon: "lucide:monitor" },
];

const isLoading = ref(false);
const errorMessage = ref("");

async function fetchDownloadStats() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response: any = await useApiFetch(
      "api/analytics/software/summary",
      { method: "GET" }
    );

    if (response?.success === false) {
      throw new Error(
        response.message || "Failed to load download statistics."
      );
    }

    const data = response?.data?.data ?? response?.data ?? response;
    const normalizeCounts = (counts: Record<string, unknown> = {}) => ({
      windows: Number(counts.windows ?? 0),
      android: Number(counts.android ?? 0),
      ios: Number(counts.ios ?? 0),
      macos: Number(counts.macos ?? 0),
      linux: Number(counts.linux ?? 0),
      other: Number(counts.other ?? 0),
    });

    stats.value = data.downloadClicks
      ? {
          downloadClicks: {
            total: Number(data.downloadClicks.total ?? 0),
            byPlatform: normalizeCounts(data.downloadClicks.byPlatform),
          },
          confirmedInstalls: {
            total: Number(data.confirmedInstalls?.total ?? 0),
            byPlatform: normalizeCounts(
              data.confirmedInstalls?.byPlatform,
            ),
          },
          accountsCreated: {
            total: Number(data.accountsCreated?.total ?? 0),
            byPlatform: normalizeCounts(data.accountsCreated?.byPlatform),
          },
        }
      : {
          downloadClicks: {
            total: Number(data.totalDownloads ?? 0),
            byPlatform: {
              ...emptyPlatformCounts(),
              windows: Number(data.windowsDownloads ?? 0),
              android: Number(data.androidDownloads ?? 0),
            },
          },
          confirmedInstalls: {
            total: 0,
            byPlatform: emptyPlatformCounts(),
          },
          accountsCreated: {
            total: 0,
            byPlatform: emptyPlatformCounts(),
          },
        };
  } catch (error: any) {
    console.error("Download statistics error:", error);
    errorMessage.value =
      error?.message || "Unable to load download statistics.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchDownloadStats);
</script>

<template>
  <Container class="mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Software Downloads
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Track download-button clicks, confirmed app opens, and account creation by device.
        </p>
      </div>

      <button
        @click="fetchDownloadStats"
        :disabled="isLoading"
        class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ isLoading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in [
          {
            title: 'Download Button Clicks',
            value: stats.downloadClicks.total,
            icon: 'lucide:download',
            color: 'bg-indigo-100 text-indigo-600',
          },
          {
            title: 'Confirmed App Opens',
            value: stats.confirmedInstalls.total,
            icon: 'lucide:badge-check',
            color: 'bg-emerald-100 text-emerald-600',
          },
          {
            title: 'Accounts Created',
            value: stats.accountsCreated.total,
            icon: 'lucide:users',
            color: 'bg-blue-100 text-blue-600',
          },
        ]"
        :key="item.title"
        class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl"
            :class="item.color"
          >
            <Icon :name="item.icon" class="h-6 w-6" />
          </div>
          <Icon
            name="lucide:trending-up"
            class="h-5 w-5 text-gray-400"
          />
        </div>

        <p class="mt-5 text-sm text-gray-500">
          {{ item.title }}
        </p>

        <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {{ item.value.toLocaleString() }}
        </p>
      </div>
    </div>

    <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Device breakdown
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Clicks are unique browser visitors per device type. A confirmed app open means the app launched after installation.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800">
            <tr>
              <th class="px-5 py-3">Device</th>
              <th class="px-5 py-3">Button clicks</th>
              <th class="px-5 py-3">Confirmed app opens</th>
              <th class="px-5 py-3">Accounts created</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="platform in platforms"
              :key="platform.id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <th class="flex items-center gap-2 px-5 py-3 font-medium text-gray-800 dark:text-gray-200">
                <Icon :name="platform.icon" class="h-4 w-4 text-gray-500" />
                {{ platform.name }}
              </th>
              <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
                {{ stats.downloadClicks.byPlatform[platform.id].toLocaleString() }}
              </td>
              <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
                {{ stats.confirmedInstalls.byPlatform[platform.id].toLocaleString() }}
              </td>
              <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
                {{ stats.accountsCreated.byPlatform[platform.id].toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </Container>
</template>
