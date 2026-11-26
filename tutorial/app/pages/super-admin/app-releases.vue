<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

definePageMeta({
  layout: "nav",
});

interface Release {
  _id: string;
  platform: string;
  versionCode: number;
  versionName: string;
  apkUrl: string;
  notes: string;
  force: boolean;
  createdAt: string;
}

const releases = ref<Release[]>([]);
const isLoading = ref(false);
const isSaving = ref(false);
const deletingId = ref<string | null>(null);
const errorMessage = ref("");
const successMessage = ref("");

const editingId = ref<string | null>(null);

const emptyForm = () => ({
  platform: "android",
  versionCode: "" as number | "",
  versionName: "",
  apkUrl: "",
  notes: "",
  force: false,
});
const form = ref(emptyForm());

const isEditing = computed(() => editingId.value !== null);

const latestId = computed(() => {
  const android = releases.value.filter((r) => r.platform === "android");
  if (!android.length) return null;
  return android.reduce((a, b) => (b.versionCode > a.versionCode ? b : a))._id;
});

function showSuccess(message: string) {
  successMessage.value = message;
  setTimeout(() => (successMessage.value = ""), 4000);
}

function unwrap(response: any) {
  if (response?.success === false) {
    throw new Error(response.message || "Request failed.");
  }
  return response;
}

async function fetchReleases() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response: any = await useApiFetch("api/app/releases", {
      method: "GET",
    });
    unwrap(response);

    const data = Array.isArray(response)
      ? response
      : response?.data?.data ?? response?.data ?? [];

    releases.value = Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("Releases error:", error);
    errorMessage.value = error?.message || "Unable to load releases.";
  } finally {
    isLoading.value = false;
  }
}

function startEdit(release: Release) {
  editingId.value = release._id;
  form.value = {
    platform: release.platform,
    versionCode: release.versionCode,
    versionName: release.versionName,
    apkUrl: release.apkUrl,
    notes: release.notes || "",
    force: release.force,
  };
  errorMessage.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  editingId.value = null;
  form.value = emptyForm();
  errorMessage.value = "";
}

function validate(): string | null {
  const f = form.value;
  if (!isEditing.value) {
    if (!Number.isInteger(Number(f.versionCode)) || Number(f.versionCode) < 1) {
      return "Version code must be a whole number (1, 2, 3...).";
    }
  }
  if (!f.versionName.trim()) return "Version name is required (e.g. 1.0.1).";
  if (!/^https:\/\//.test(f.apkUrl.trim())) {
    return "APK link must start with https://";
  }
  return null;
}

async function saveRelease() {
  errorMessage.value = "";
  const problem = validate();
  if (problem) {
    errorMessage.value = problem;
    return;
  }

  isSaving.value = true;
  try {
    const f = form.value;

    if (isEditing.value) {
      const response: any = await useApiFetch(
        `api/app/release/${editingId.value}`,
        {
          method: "PUT",
          body: {
            versionName: f.versionName.trim(),
            apkUrl: f.apkUrl.trim(),
            notes: f.notes.trim(),
            force: f.force,
          },
        }
      );
      unwrap(response);
      showSuccess("Release updated.");
    } else {
      const response: any = await useApiFetch("api/app/release", {
        method: "POST",
        body: {
          platform: f.platform,
          versionCode: Number(f.versionCode),
          versionName: f.versionName.trim(),
          apkUrl: f.apkUrl.trim(),
          notes: f.notes.trim(),
          force: f.force,
        },
      });
      unwrap(response);
      showSuccess("New version published.");
    }

    cancelEdit();
    await fetchReleases();
  } catch (error: any) {
    console.error("Save release error:", error);
    errorMessage.value = error?.message || "Unable to save release.";
  } finally {
    isSaving.value = false;
  }
}

async function deleteRelease(release: Release) {
  const ok = window.confirm(
    `Delete version ${release.versionName} (code ${release.versionCode})? This cannot be undone.`
  );
  if (!ok) return;

  deletingId.value = release._id;
  errorMessage.value = "";

  try {
    const response: any = await useApiFetch(`api/app/release/${release._id}`, {
      method: "DELETE",
    });
    unwrap(response);

    if (editingId.value === release._id) cancelEdit();
    showSuccess("Release deleted.");
    await fetchReleases();
  } catch (error: any) {
    console.error("Delete release error:", error);
    errorMessage.value = error?.message || "Unable to delete release.";
  } finally {
    deletingId.value = null;
  }
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

onMounted(fetchReleases);
</script>

<template>
  <Container class="mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          App Releases
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Publish new app versions. The app checks the latest one and offers the download.
        </p>
      </div>

      <button
        @click="fetchReleases"
        :disabled="isLoading"
        class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {{ isLoading ? "Loading..." : "Refresh" }}
      </button>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="text-sm text-emerald-600">
      {{ successMessage }}
    </p>

    <!-- Publish / edit form -->
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
    >
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ isEditing ? "Edit release" : "Publish new version" }}
      </h2>

      <form class="mt-4 grid gap-4 sm:grid-cols-2" @submit.prevent="saveRelease">
        <div>
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-300">
            Platform
          </label>
          <select
            v-model="form.platform"
            :disabled="isEditing"
            class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="android">Android</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-300">
            Version code (whole number, must be higher than the last one)
          </label>
          <input
            v-model.number="form.versionCode"
            :disabled="isEditing"
            type="number"
            min="1"
            step="1"
            placeholder="2"
            class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-300">
            Version name
          </label>
          <input
            v-model="form.versionName"
            type="text"
            placeholder="1.0.1"
            class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-300">
            APK download link (https)
          </label>
          <input
            v-model="form.apkUrl"
            type="url"
            placeholder="https://your-cdn.com/examtips-1.0.1.apk"
            class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="mb-1 block text-sm text-gray-600 dark:text-gray-300">
            What's new
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="New classroom page, bug fixes"
            class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <label
          class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2"
        >
          <input v-model="form.force" type="checkbox" class="h-4 w-4 rounded" />
          Force update (users cannot skip it)
        </label>

        <div class="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            :disabled="isSaving"
            class="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {{
              isSaving
                ? "Saving..."
                : isEditing
                ? "Save changes"
                : "Publish version"
            }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            @click="cancelEdit"
            class="rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <!-- Releases list -->
    <section
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          All versions
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          The highest version code is the one the app downloads.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[820px] text-left text-sm">
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800"
          >
            <tr>
              <th class="px-5 py-3">Version</th>
              <th class="px-5 py-3">Code</th>
              <th class="px-5 py-3">Platform</th>
              <th class="px-5 py-3">Notes</th>
              <th class="px-5 py-3">Published</th>
              <th class="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!isLoading && releases.length === 0">
              <td colspan="6" class="px-5 py-8 text-center text-gray-500">
                No releases yet. Publish your first version above.
              </td>
            </tr>

            <tr
              v-for="release in releases"
              :key="release._id"
              class="border-t border-gray-100 dark:border-gray-800"
            >
              <td class="px-5 py-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span
                    class="font-medium text-gray-800 dark:text-gray-200"
                  >
                    {{ release.versionName }}
                  </span>
                  <span
                    v-if="release._id === latestId"
                    class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                  >
                    Latest
                  </span>
                  <span
                    v-if="release.force"
                    class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700"
                  >
                    Forced
                  </span>
                </div>
                <a
                  :href="release.apkUrl"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 block max-w-[240px] truncate text-xs text-indigo-600 hover:underline"
                >
                  {{ release.apkUrl }}
                </a>
              </td>
              <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
                {{ release.versionCode }}
              </td>
              <td class="px-5 py-3 capitalize text-gray-600 dark:text-gray-300">
                {{ release.platform }}
              </td>
              <td
                class="max-w-[240px] px-5 py-3 text-gray-600 dark:text-gray-300"
              >
                <span class="line-clamp-2">{{ release.notes || "-" }}</span>
              </td>
              <td class="px-5 py-3 text-gray-600 dark:text-gray-300">
                {{ formatDate(release.createdAt) }}
              </td>
              <td class="px-5 py-3">
                <div class="flex gap-2">
                  <button
                    @click="startEdit(release)"
                    class="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteRelease(release)"
                    :disabled="deletingId === release._id"
                    class="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {{ deletingId === release._id ? "Deleting..." : "Delete" }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </Container>
</template>