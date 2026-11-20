<script setup lang="ts">
definePageMeta({
  layout: 'nav',
  middleware: 'admin',
})

interface PaperRow {
  _id: string
  title: string
  examBody: string
  subject: string
  subjectId?: string
  year: number
  paperType: string
  status: string
}

const { request } = useExamApi()
const papers = ref<PaperRow[]>([])
const pending = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    papers.value = await request<PaperRow[]>('/admin/exams/papers')
  } catch (requestError) {
    const fetchError = requestError as { data?: { message?: string }; message?: string }
    error.value = fetchError.data?.message || fetchError.message || 'Could not load exam papers.'
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div class="mx-auto max-w-5xl p-4">
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-slate-900">Exam papers</h1>
      <NuxtLink
        to="/admin/exams/new"
        class="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        <Icon name="lucide:plus" /> New paper
      </NuxtLink>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-slate-500">
          <tr>
            <th class="px-4 py-2 font-medium">Title</th>
            <th class="px-4 py-2 font-medium">Exam</th>
            <th class="px-4 py-2 font-medium">Subject</th>
            <th class="px-4 py-2 font-medium">Year</th>
            <th class="px-4 py-2 font-medium">Type</th>
            <th class="px-4 py-2 font-medium">Status</th>
            <th class="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="7" class="px-4 py-8 text-center text-slate-400">Loading papers…</td>
          </tr>
          <tr v-else-if="!papers.length">
            <td v-if="error" colspan="7" class="px-4 py-8 text-center text-red-600">
              {{ error }}
            </td>
            <td v-else colspan="7" class="px-4 py-8 text-center text-slate-400">
              No papers yet. Select New paper to add your first one.
            </td>
          </tr>
          <tr v-for="p in papers" :key="p._id" class="border-t border-slate-100 hover:bg-slate-50">
            <td class="px-4 py-2 font-medium text-slate-900">{{ p.title }}</td>
            <td class="px-4 py-2">{{ p.examBody }}</td>
            <td class="px-4 py-2">{{ p.subject }}</td>
            <td class="px-4 py-2">{{ p.year }}</td>
            <td class="px-4 py-2 capitalize">{{ p.paperType }}</td>
            <td class="px-4 py-2">
              <span
                class="rounded-full px-2 py-0.5 text-xs font-medium"
                :class="p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
              >
                {{ p.status }}
              </span>
            </td>
            <td class="px-4 py-2 text-right">
              <NuxtLink :to="`/admin/exams/${p._id}`" class="font-medium text-emerald-700 hover:underline">Edit</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
