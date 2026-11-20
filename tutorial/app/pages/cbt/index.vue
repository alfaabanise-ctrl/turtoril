<script setup lang="ts">
definePageMeta({ layout: "main" })

const auth = useAuth()
const subjects = ref<CbtPaperSummary[]>([])
const loading = ref(true)
const error = ref("")
const deletingId = ref("")

onMounted(async () => {
  await loadCurriculum()
})

async function loadCurriculum() {
  loading.value = true
  error.value = ""

  try {
    subjects.value = await getCbtCurriculum()
    console.log(subjects.value);
  } catch (err: any) {
    error.value =
      err?.data?.statusMessage ||
      err?.message ||
      "Unable to load CBT subjects."
  } finally {
    loading.value = false
  }
}

// Edit: goes to the importer, which loads this subject into the draft
function editLink(subject: CbtPaperSummary) {
  return {
    path: "/admin/cbt",
    query: {
      subjectId: subject.id,
      action: "edit"
    }
  }
}

async function deleteSubject(subject: CbtPaperSummary) {
  const confirmed = window.confirm(
    `Are you sure you want to permanently delete "${subject.name}" (${subject.year || "General"})?`
  )

  if (!confirmed) return

  deletingId.value = subject.id

  try {
    await deleteCbtSubject(subject.id)

    // Remove from the screen immediately
    subjects.value = subjects.value.filter((s) => s.id !== subject.id)
  } catch (err: any) {
    window.alert(
      err?.data?.statusMessage ||
      err?.message ||
      "Unable to delete this subject."
    )
  } finally {
    deletingId.value = ""
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-16">
    <NavigationNavbar />

    <main class="mx-auto max-w-6xl px-4 pt-28 sm:px-6">

      <!-- Page heading -->
      <div class="mb-8 rounded-2xl bg-[#0794bd] p-6 text-white shadow-lg sm:p-8">
        <p class="text-sm font-semibold uppercase tracking-widest text-cyan-100">
          Past Questions & Mock Exams
        </p>

        <h1 class="mt-2 text-3xl font-bold sm:text-4xl">
          Choose an exam paper
        </h1>

        <p class="mt-3 max-w-2xl text-sm leading-6 text-cyan-50">
          Practise WAEC, NECO, NABTEB or JAMB past questions.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="h-44 animate-pulse rounded-2xl bg-white"
        ></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
      >
        {{ error }}

        <button
          type="button"
          @click="loadCurriculum"
          class="mt-3 block font-semibold underline"
        >
          Try again
        </button>
      </div>

      <!-- Subject cards -->
      <div
        v-else
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="subject in subjects"
          :key="subject.id"
          class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-[#0794bd]"
            >
              <Icon name="lucide:graduation-cap" class="h-6 w-6" />
            </div>

            <span
              class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {{ subject.year || "General" }}
            </span>
          </div>

          <p class="mt-5 text-xs font-bold uppercase tracking-wider text-[#0794bd]">
            {{ subject.board || "Custom" }}
          </p>

          <h2 class="mt-1 text-xl font-bold text-slate-900">
            {{ subject.name }}
          </h2>

          <p class="mt-2 text-sm text-slate-500">
            {{ subject.paper || "Past Question" }}
            · {{ subject.year || "General" }}
            · {{ subject.questionCount }} questions
          </p>

          <NuxtLink
            :to="`/cbt/${encodeURIComponent(subject.id)}`"
            class="mt-5 flex items-center gap-2 text-sm font-semibold text-[#0794bd] hover:text-cyan-800"
          >
            Start practice
            <Icon name="lucide:arrow-right" class="h-4 w-4" />
          </NuxtLink>
          {{subject}}
          <!-- Edit and Delete -->
          <div v-if="['admin', 'superadmin'].includes(auth?.user?.role || '')" class="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
            <NuxtLink
              :to="editLink(subject)"
              class="flex items-center justify-center gap-2 rounded-lg bg-[#0794bd] px-3 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              <Icon name="lucide:pencil" class="h-4 w-4" />
              Edit
            </NuxtLink>

            <button
              type="button"
              :disabled="deletingId === subject.id"
              @click="deleteSubject(subject)"
              class="flex items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="lucide:trash-2" class="h-4 w-4" />
              {{ deletingId === subject.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="!loading && !error && !subjects.length"
        class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"
      >
        <Icon name="lucide:database" class="mx-auto h-10 w-10 text-slate-300" />

        <h2 class="mt-4 text-lg font-bold text-slate-800">
          No CBT content yet
        </h2>

        <p class="mt-2 text-sm text-slate-500">
          Import a curriculum from the CBT content manager.
        </p>

        <NuxtLink
          to="/admin/cbt"
          class="mt-5 inline-flex rounded-lg bg-[#0794bd] px-4 py-2 text-sm font-semibold text-white"
        >
          Import curriculum
        </NuxtLink>
      </div>
    </main>
  </div>
</template>