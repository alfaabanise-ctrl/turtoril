<script setup lang="ts">
definePageMeta({
  layout: "nav",
});

const auth = useAuth()

const subjects = ref<CbtPaperSummary[]>([])
const loading = ref(true)
const error = ref("")
const deletingId = ref("")
const copiedId = ref("")
const revealed = ref<Set<string>>(new Set())

const isAdmin = computed(() =>
  ["admin", "superadmin"].includes(auth?.value?.user?.role || "")
)

onMounted(() => {
  loadCurriculum()
})

async function loadCurriculum() {
  loading.value = true
  error.value = ""

  try {
    const curriculum = await getCbtCurriculum()

    // The API returns { version, subjects }
    const papers = curriculum?.subjects || []

    subjects.value = papers.map((paper: any) => ({
      ...paper,
      id: String(paper.id || paper.paperId || ""),
      paperId: String(paper.paperId || paper.id || ""),
      accesscode: paper.accesscode || "",
      name: paper.name || "Untitled Subject",
      code: paper.code || "",
      board: paper.board || "Custom",
      year: paper.year || "General",
      paper: paper.paper || "Past Question",
      questionCount: Number(paper.questionCount || 0),
    })).filter((paper: CbtPaperSummary) => paper.id)
  } catch (err: any) {
    console.error("Load CBT curriculum error:", err)

    error.value =
      err?.data?.statusMessage ||
      err?.message ||
      "Unable to load CBT subjects."
  } finally {
    loading.value = false
  }
}

function editLink(subject: CbtPaperSummary) {
  return {
    path: "/admin/cbt",
    query: {
      subjectId: subject.id,
      action: "edit",
    },
  }
}

function toggleReveal(id: string) {
  const next = new Set(revealed.value)

  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }

  revealed.value = next
}

async function copyCode(subject: CbtPaperSummary) {
  if (!subject.accesscode) return

  try {
    await navigator.clipboard.writeText(subject.accesscode)
    copiedId.value = subject.id

    setTimeout(() => {
      if (copiedId.value === subject.id) {
        copiedId.value = ""
      }
    }, 2000)
  } catch (err) {
    console.error("Copy access code error:", err)
    window.alert("Unable to copy access code.")
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

    subjects.value = subjects.value.filter(
      (item) => item.id !== subject.id
    )
  } catch (err: any) {
    console.error("Delete CBT paper error:", err)

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

    <main class="mx-auto max-w-7xl px-2 pt-28 sm:px-6">
      <!-- Page heading -->
      <div class="mb-8 rounded-2xl bg-[#0794bd] p-6 text-white shadow-lg sm:p-8">
        <p class="text-sm font-semibold uppercase tracking-widest text-cyan-100">
          Past Questions & Mock Exams
        </p>

        <h1 class="mt-2 text-3xl font-bold sm:text-4xl">
          Choose an exam paper
        </h1>

        <p class="mt-3 max-w-2xl text-sm leading-6 text-cyan-50">
          Practise WAEC, NECO, NABTEB or JAMB past questions and improve
          your examination performance.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="flex animate-pulse items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0"
        >
          <div class="h-10 w-10 rounded-xl bg-slate-200" />
          <div class="h-4 w-1/4 rounded bg-slate-200" />
          <div class="h-4 w-1/6 rounded bg-slate-200" />
          <div class="ml-auto h-8 w-24 rounded-lg bg-slate-200" />
        </div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
      >
        <div class="flex items-center gap-2 font-semibold">
          <Icon name="lucide:alert-circle" class="h-5 w-5" />
          Unable to load exam papers
        </div>

        <p class="mt-2 text-sm">{{ error }}</p>

        <button
          type="button"
          @click="loadCurriculum"
          class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>

      <!-- Subjects table -->
      <div
        v-else-if="subjects.length"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" class="px-5 py-3">Subject</th>
                <th scope="col" class="px-5 py-3">Board</th>
                <th scope="col" class="px-5 py-3">Year</th>
                <th scope="col" class="px-5 py-3">Paper</th>
                <th scope="col" class="px-5 py-3 text-right">Questions</th>
                <th scope="col" class="px-5 py-3">Type</th>
                <th scope="col" class="px-5 py-3">Duration</th>
                <th v-if="isAdmin" scope="col" class="px-5 py-3">Access code</th>
                <th scope="col" class="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="subject in subjects"
                :key="subject.id"
                class="transition hover:bg-cyan-50/40"
              >
                <!-- Subject -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[#0794bd]"
                    >
                      <Icon name="lucide:graduation-cap" class="h-5 w-5" />
                    </div>

                    <div class="min-w-0">
                      <p class="font-semibold text-slate-900">
                        {{ subject.name }}
                      </p>
                      <p
                        v-if="subject.code"
                        class="text-xs text-slate-400"
                      >
                        Code: {{ subject.code }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Board -->
                <td class="whitespace-nowrap px-5 py-4 font-semibold text-[#0794bd]">
                  {{ subject.board || "Custom" }}
                </td>

                <!-- Year -->
                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {{ subject.year || "General" }}
                  </span>
                </td>

                <!-- Paper -->
                <td class="whitespace-nowrap px-5 py-4 text-slate-600">
                  {{ subject.paper || "Past Question" }}
                </td>

                <!-- Questions -->
                <td class="whitespace-nowrap px-5 py-4 text-right font-medium text-slate-700">
                  {{ subject.questionCount }}
                </td>

                <!-- Type -->
                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {{ subject.examType || "objective" }}
                  </span>
                </td>

                <!-- Duration -->
                <td class="whitespace-nowrap px-5 py-4">
                  <span
                    v-if="subject.durationMinutes"
                    class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                  >
                    <Icon name="lucide:clock" class="h-3 w-3" />
                    {{ subject.durationMinutes }} min
                  </span>
                  <span v-else class="text-slate-300">—</span>
                </td>

                <!-- Access code: admin only -->
                <td v-if="isAdmin" class="whitespace-nowrap px-5 py-4">
                  <div v-if="subject.accesscode" class="flex items-center gap-1">
                    <span class="mr-1 font-mono text-base font-bold tracking-widest text-slate-900">
                      {{ revealed.has(subject.id) ? subject.accesscode : "••••" }}
                    </span>

                    <button
                      type="button"
                      :title="revealed.has(subject.id) ? 'Hide code' : 'Show code'"
                      @click="toggleReveal(subject.id)"
                      class="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-[#0794bd]"
                    >
                      <Icon
                        :name="revealed.has(subject.id) ? 'lucide:eye-off' : 'lucide:eye'"
                        class="h-4 w-4"
                      />
                    </button>

                    <button
                      type="button"
                      :title="copiedId === subject.id ? 'Copied' : 'Copy code'"
                      @click="copyCode(subject)"
                      class="rounded-lg p-1.5 transition"
                      :class="
                        copiedId === subject.id
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-[#0794bd]'
                      "
                    >
                      <Icon
                        :name="copiedId === subject.id ? 'lucide:check' : 'lucide:copy'"
                        class="h-4 w-4"
                      />
                    </button>
                  </div>

                  <span v-else class="text-xs text-slate-400">No code</span>
                </td>

                <!-- Actions -->
                <td class="whitespace-nowrap px-5 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <NuxtLink
                      :to="`/cbt/${encodeURIComponent(subject.id)}`"
                      class="inline-flex items-center gap-1.5 rounded-lg bg-[#0794bd] px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Start practice
                      <Icon name="lucide:arrow-right" class="h-3.5 w-3.5" />
                    </NuxtLink>

                    <template v-if="isAdmin">
                      <NuxtLink
                        :to="editLink(subject)"
                        title="Edit"
                        class="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-[#0794bd] hover:text-white"
                      >
                        <Icon name="lucide:pencil" class="h-4 w-4" />
                      </NuxtLink>

                      <button
                        type="button"
                        title="Delete"
                        :disabled="deletingId === subject.id"
                        @click="deleteSubject(subject)"
                        class="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Icon
                          :name="deletingId === subject.id ? 'lucide:loader-2' : 'lucide:trash-2'"
                          class="h-4 w-4"
                          :class="{ 'animate-spin': deletingId === subject.id }"
                        />
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
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
          v-if="isAdmin"
          to="/admin/cbt"
          class="mt-5 inline-flex rounded-lg bg-[#0794bd] px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          Import curriculum
        </NuxtLink>
      </div>
    </main>
  </div>
</template>