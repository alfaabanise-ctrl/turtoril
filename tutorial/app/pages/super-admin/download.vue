
<script setup lang="ts">
import { ref, onMounted } from "vue";

definePageMeta({
  layout: "nav",
});

interface DownloadStats {
  totalDownloads: number;
  windowsDownloads: number;
  androidDownloads: number;
}

const stats = ref<DownloadStats>({
  totalDownloads: 0,
  windowsDownloads: 0,
  androidDownloads: 0,
});

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

    const data = response?.data?.data ?? response;
    console.log(data);
    
    stats.value = {
      totalDownloads: Number(data.totalDownloads ?? 0),
      windowsDownloads: Number(data.windowsDownloads ?? 0),
      androidDownloads: Number(data.androidDownloads ?? 0),
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
          Track ExamTips Windows and Android download clicks.
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
            title: 'Total Downloads',
            value: stats.totalDownloads,
            icon: 'lucide:download',
            color: 'bg-indigo-100 text-indigo-600',
          },
          {
            title: 'Windows Downloads',
            value: stats.windowsDownloads,
            icon: 'lucide:monitor',
            color: 'bg-blue-100 text-blue-600',
          },
          {
            title: 'Android Downloads',
            value: stats.androidDownloads,
            icon: 'lucide:smartphone',
            color: 'bg-emerald-100 text-emerald-600',
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
  </Container>
</template>
