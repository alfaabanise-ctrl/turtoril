<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Paper } from '~/composables/useExamEditor'

const paper = defineModel<Paper>({ required: true })
const { request } = useExamApi()

const bodies = ['WAEC', 'NECO', 'NABTEB', 'JAMB', 'OTHER']
const subjects = ref<{ subjectId: string; name: string }[]>([])
const subjectError = ref('')
const field =
  'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'

watch(
  subjects,
  (items) => {
    if (!paper.value.subjectId && paper.value.subject) {
      const match = items.find(
        (subject) => subject.name.toLowerCase() === paper.value.subject.toLowerCase(),
      )
      if (match) paper.value.subjectId = match.subjectId
    }
    const selected = items.find((subject) => subject.subjectId === paper.value.subjectId)
    if (selected) paper.value.subject = selected.name
  },
  { immediate: true },
)

watch(
  () => paper.value.subjectId,
  (subjectId) => {
    const selected = subjects.value.find((subject) => subject.subjectId === subjectId)
    if (selected) paper.value.subject = selected.name
  },
)

onMounted(async () => {
  try {
    subjects.value = await request<{ subjectId: string; name: string }[]>(
      '/admin/exams/subjects',
    )
  } catch (error) {
    const requestError = error as { data?: { message?: string }; message?: string }
    subjectError.value =
      requestError.data?.message || requestError.message || 'Could not load curriculum subjects.'
  }
})
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div class="mb-4">
      <h2 class="text-sm font-bold text-slate-900">Paper details</h2>
      <p class="mt-1 text-xs text-slate-500">
        Choose the existing curriculum subject. Imported paper content is stored as HTML.
      </p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <label class="text-xs font-medium text-slate-600">
        Exam body
        <select v-model="paper.examBody" :class="field">
          <option v-for="body in bodies" :key="body" :value="body">{{ body }}</option>
        </select>
      </label>

      <label class="text-xs font-medium text-slate-600">
        Subject
        <select v-model="paper.subjectId" :class="field" :disabled="!subjects.length">
          <option value="" disabled>
            {{ subjects.length ? 'Select a subject' : 'No curriculum subjects found' }}
          </option>
          <option v-for="subject in subjects" :key="subject.subjectId" :value="subject.subjectId">
            {{ subject.name }}
          </option>
        </select>
      </label>

      <label class="text-xs font-medium text-slate-600">
        Year
        <input v-model.number="paper.year" type="number" min="1900" :class="field" />
      </label>

      <label class="text-xs font-medium text-slate-600">
        Paper type
        <select v-model="paper.paperType" :class="field">
          <option value="objective">Objective</option>
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
          <option value="mixed">Mixed</option>
        </select>
      </label>

      <label class="text-xs font-medium text-slate-600">
        Duration (minutes)
        <input v-model.number="paper.durationMinutes" type="number" min="0" :class="field" />
      </label>

      <label class="text-xs font-medium text-slate-600">
        Status
        <select v-model="paper.status" :class="field">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
    </div>
    <p v-if="subjectError" class="mt-3 text-xs text-red-600">{{ subjectError }}</p>
    <p v-else-if="!subjects.length" class="mt-3 text-xs text-amber-700">
      Add a subject to the learning curriculum before importing an exam paper.
    </p>
  </section>
</template>
