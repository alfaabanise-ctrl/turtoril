
<script setup lang="ts">
import type { Paper } from '~/composables/useExamEditor'

definePageMeta({
  layout: 'nav',
  middleware: 'admin',
})

type BlockType =
  | 'instructions'
  | 'section'
  | 'passage'
  | 'question'
  | 'answer'
  | 'table'
  | 'image'

const BLOCK_TYPES: BlockType[] = [
  'instructions',
  'section',
  'passage',
  'question',
  'answer',
  'table',
  'image',
]

interface ExamBlock {
  type: BlockType
  number?: number
  title?: string
  text?: string
  options?: { label: string; text: string }[]
  answer?: string
  explanation?: string
  marks?: number
  rows?: string[][]
  url?: string
  caption?: string
}

interface ExamImportDraft {
  metadata: Pick<
    Paper,
    'examBody' | 'subject' | 'subjectId' | 'year' | 'paperType' | 'durationMinutes' | 'status'
  >
  title: string
  slug: string
  blocks: ExamBlock[]
  imageCount: number
}

interface SavedImport {
  paper: Paper
  questionCount: number
}

interface CorrectionResponse {
  success: boolean
  message: string
  blocks: ExamBlock[]
  correctedCount: number
}

const route = useRoute()
const { request } = useExamApi()

const paperId = computed(() => String(route.params.id ?? 'new'))
const isNew = computed(() => paperId.value === 'new')

const paper = ref<Paper>(blankPaper())
const inputMode = ref<'text' | 'json'>('text')
const importText = ref('')
const jsonText = ref('')
const images = ref<File[]>([])
const draft = ref<ExamImportDraft | null>(null)

const savedQuestionCount = ref(0)
const busy = ref(false)
const correcting = ref(false)

const error = ref('')
const message = ref('')

const fileInput = ref<HTMLInputElement | null>(null)
const jsonFileInput = ref<HTMLInputElement | null>(null)

const hasSource = computed(() =>
  inputMode.value === 'json'
    ? Boolean(jsonText.value.trim())
    : Boolean(importText.value.trim()) || images.value.length > 0,
)

const questionCount = computed(
  () => draft.value?.blocks.filter(block => block.type === 'question').length ?? 0,
)

const savedBlocks = computed<ExamBlock[]>(
  () => ((paper.value as unknown as { blocks?: ExamBlock[] }).blocks ?? []) as ExamBlock[],
)

const blockStyle: Record<BlockType, string> = {
  instructions: 'border-amber-200 bg-amber-50',
  section: 'border-slate-300 bg-slate-100',
  passage: 'border-sky-200 bg-sky-50',
  question: 'border-emerald-200 bg-white',
  answer: 'border-violet-200 bg-violet-50',
  table: 'border-slate-200 bg-white',
  image: 'border-slate-200 bg-white',
}

const blockLabel: Record<BlockType, string> = {
  instructions: 'Instructions',
  section: 'Section',
  passage: 'Passage',
  question: 'Question',
  answer: 'Answer',
  table: 'Table',
  image: 'Image',
}

watch(
  () => [
    paper.value.examBody,
    paper.value.subject,
    paper.value.subjectId,
    paper.value.year,
    paper.value.paperType,
    paper.value.durationMinutes,
    paper.value.status,
    inputMode.value,
    importText.value,
    jsonText.value,
    images.value,
  ],
  () => {
    draft.value = null
  },
)

function getErrorMessage(value: unknown, fallback: string) {
  const err = value as {
    data?: { message?: string; statusMessage?: string }
    message?: string
  }

  return (
    err?.data?.message ||
    err?.data?.statusMessage ||
    err?.message ||
    fallback
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function loadPaper() {
  error.value = ''
  message.value = ''
  draft.value = null
  savedQuestionCount.value = 0

  if (isNew.value) {
    paper.value = blankPaper()
    importText.value = ''
    jsonText.value = ''
    images.value = []
    return
  }

  try {
    paper.value = await request<Paper>(
      `/admin/exams/papers/${encodeURIComponent(paperId.value)}`,
    )

    savedQuestionCount.value =
      paper.value.questionCount ??
      paper.value.blocks?.filter(block => block.type === 'question').length ??
      0
  } catch (loadError) {
    error.value = getErrorMessage(
      loadError,
      'Could not load this exam paper.',
    )
  }
}

onMounted(loadPaper)
watch(paperId, loadPaper)

function onImagesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const selected = Array.from(input.files ?? [])

  input.value = ''

  const availableSlots = Math.max(5 - images.value.length, 0)

  if (selected.length > availableSlots) {
    error.value = 'You can upload up to five images for one paper.'
  }

  images.value = [
    ...images.value,
    ...selected.slice(0, availableSlots),
  ]
}

function removeImage(index: number) {
  images.value = images.value.filter(
    (_, imageIndex) => imageIndex !== index,
  )
}

async function onJsonFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  input.value = ''

  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    error.value = 'The JSON file must be under 2 MB.'
    return
  }

  error.value = ''
  jsonText.value = await file.text()
}

function appendMetadata(form: FormData) {
  form.append('examBody', paper.value.examBody)
  form.append('subject', paper.value.subject)
  form.append('subjectId', paper.value.subjectId ?? '')
  form.append('year', String(paper.value.year))
  form.append('paperType', paper.value.paperType)
  form.append('durationMinutes', String(paper.value.durationMinutes || 0))
  form.append('status', paper.value.status)

  if (!isNew.value) {
    form.append('paperId', paperId.value)
  }

  if (inputMode.value === 'text') {
    for (const image of images.value) {
      form.append('images', image, image.name)
    }
  }
}

function buildDraftFromJson(): ExamImportDraft {
  let parsed: any

  try {
    parsed = JSON.parse(jsonText.value)
  } catch {
    throw new Error(
      'Invalid JSON. Check for missing commas, quotes, or brackets.',
    )
  }

  const rawBlocks = Array.isArray(parsed) ? parsed : parsed?.blocks

  if (!Array.isArray(rawBlocks) || !rawBlocks.length) {
    throw new Error('The JSON needs a non-empty "blocks" array.')
  }

  const blocks: ExamBlock[] = rawBlocks.map((raw: any, index: number) => {
    const at = `Block ${index + 1}`

    if (!raw || typeof raw !== 'object') {
      throw new Error(`${at} must be an object.`)
    }

    if (!BLOCK_TYPES.includes(raw.type)) {
      throw new Error(
        `${at}: unknown type "${raw.type}". Use one of: ${BLOCK_TYPES.join(', ')}.`,
      )
    }

    if (raw.type === 'question') {
      if (!String(raw.text ?? '').trim()) {
        throw new Error(`${at} (question) needs "text".`)
      }

      if (raw.options !== undefined) {
        if (
          !Array.isArray(raw.options) ||
          raw.options.some((option: any) => !option?.label || !option?.text)
        ) {
          throw new Error(
            `${at}: every option needs "label" and "text".`,
          )
        }
      }
    }

    if (raw.type === 'answer' && !String(raw.answer ?? '').trim()) {
      throw new Error(`${at} (answer) needs "answer".`)
    }

    if (raw.type === 'section' && !String(raw.title ?? '').trim()) {
      throw new Error(`${at} (section) needs "title".`)
    }

    if (
      (raw.type === 'instructions' || raw.type === 'passage') &&
      !String(raw.text ?? '').trim()
    ) {
      throw new Error(`${at} (${raw.type}) needs "text".`)
    }

    if (raw.type === 'table' && (!Array.isArray(raw.rows) || !raw.rows.length)) {
      throw new Error(`${at} (table) needs a "rows" array.`)
    }

    return raw as ExamBlock
  })

  const title =
    parsed?.title ||
    `${paper.value.examBody} ${paper.value.subject} ${paper.value.year}`.trim()

  return {
    metadata: {
      examBody: paper.value.examBody,
      subject: paper.value.subject,
      subjectId: paper.value.subjectId,
      year: paper.value.year,
      paperType: paper.value.paperType,
      durationMinutes: paper.value.durationMinutes,
      status: paper.value.status,
    },
    title,
    slug: parsed?.slug || slugify(title),
    blocks,
    imageCount: 0,
  }
}

interface AIProcessResponse {
  success: boolean
  message: string
  blocks: ExamBlock[]
  correctedCount: number
}

async function processExamWithAI() {
  if (busy.value) return

  if (!paper.value.subjectId) {
    error.value = 'Select an existing curriculum subject first.'
    return
  }

  if (
    inputMode.value === 'text' &&
    !importText.value.trim()
  ) {
    error.value = 'Paste the examination text first.'
    return
  }

  if (
    inputMode.value === 'json' &&
    !jsonText.value.trim()
  ) {
    error.value = 'Paste or upload your examination JSON first.'
    return
  }

  busy.value = true
  correcting.value = true
  error.value = ''
  message.value = ''

  try {
    const result = await $fetch<AIProcessResponse>(
      '/api/admin/exams/process',
      {
        method: 'POST',
        credentials: 'include',
        body: {
          mode: inputMode.value,
          text: inputMode.value === 'text'
            ? importText.value
            : undefined,
          json: inputMode.value === 'json'
            ? jsonText.value
            : undefined,
          metadata: {
            examBody: paper.value.examBody,
            subject: paper.value.subject,
            subjectId: paper.value.subjectId,
            year: paper.value.year,
            paperType: paper.value.paperType,
            durationMinutes: paper.value.durationMinutes,
            status: paper.value.status,
          },
        },
      },
    )

    if (!result.success || !Array.isArray(result.blocks)) {
      throw new Error('AI returned invalid examination blocks.')
    }

    const title =
      `${paper.value.examBody} ${paper.value.subject} ${paper.value.year}`.trim()

    draft.value = {
      metadata: {
        examBody: paper.value.examBody,
        subject: paper.value.subject,
        subjectId: paper.value.subjectId,
        year: paper.value.year,
        paperType: paper.value.paperType,
        durationMinutes: paper.value.durationMinutes,
        status: paper.value.status,
      },
      title,
      slug: slugify(title),
      blocks: result.blocks,
      imageCount: 0,
    }

    message.value =
      `AI processing completed. ${result.correctedCount} corrections made. Review your ${result.blocks.length} blocks before saving.`

  } catch (err) {
    error.value = getErrorMessage(
      err,
      'AI could not process this examination.',
    )
  } finally {
    busy.value = false
    correcting.value = false
  }
}
/**
 * AI CORRECTION
 *
 * This function communicates directly with the Nuxt server API.
 * It does not use useExamApi() or the Express backend request wrapper.
 *
 * Nuxt endpoint:
 * server/api/admin/exams/correct-blocks.post.ts
 *
 * URL:
 * /api/admin/exams/correct-blocks
 */
async function correctDraftBlocks() {
  if (!draft.value || busy.value) return

  busy.value = true
  correcting.value = true
  error.value = ''
  message.value = 'Sending examination blocks to the Nuxt AI correction server...'

  try {
    console.log('[AI CORRECTION] Sending directly to Nuxt server')

    const result = await $fetch<CorrectionResponse>(
      '/api/admin/exams/correct-blocks',
      {
        method: 'POST',
        credentials: 'include',
        body: {
          blocks: draft.value.blocks,
        },
      },
    )

    if (!result.success || !Array.isArray(result.blocks)) {
      throw new Error('The Nuxt AI server returned an invalid response.')
    }

    // Update only the current frontend draft.
    // No Express save endpoint is called here.
    draft.value = {
      ...draft.value,
      blocks: result.blocks,
    }

    message.value =
      `AI correction completed successfully. ${result.correctedCount} text fields corrected. Please review before saving.`

    console.log('[AI CORRECTION] Nuxt server response:', result)
  } catch (err) {
    console.error('[AI CORRECTION] Request failed:', err)

    error.value = getErrorMessage(
      err,
      'Could not correct the examination blocks.',
    )

    message.value = ''
  } finally {
    busy.value = false
    correcting.value = false
  }
}

async function saveDraft() {
  if (!draft.value || busy.value) return

  busy.value = true
  error.value = ''
  message.value = ''

  try {
    const form = new FormData()

    appendMetadata(form)
    form.append('draft', JSON.stringify(draft.value))

    // Existing Express backend: saving remains unchanged.
    const saved = await request<SavedImport>(
      '/admin/exams/import/save',
      {
        method: 'POST',
        body: form,
      },
    )

    paper.value = saved.paper
    savedQuestionCount.value = saved.questionCount

    draft.value = null
    importText.value = ''
    jsonText.value = ''
    images.value = []

    message.value = `Paper saved with ${saved.questionCount} questions.`

    if (isNew.value && saved.paper._id) {
      await navigateTo(`/admin/exams/${saved.paper._id}`, {
        replace: true,
      })
    }
  } catch (requestError) {
    error.value = getErrorMessage(
      requestError,
      'Could not save this paper.',
    )
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <NuxtLink
          to="/admin/exams"
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          aria-label="Back to exam papers"
        >
          <Icon name="lucide:arrow-left" />
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <h1 class="truncate text-base font-bold text-slate-900">
            {{ isNew ? 'Create exam paper' : paper.title || 'Edit exam paper' }}
          </h1>

          <p class="mt-0.5 text-xs text-slate-500">
            {{
              isNew
                ? 'Choose a curriculum subject, then paste text or upload JSON.'
                : `${savedQuestionCount} questions · ${savedBlocks.length} blocks`
            }}
          </p>
        </div>

        <span
          v-if="!isNew"
          class="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700"
        >
          {{ paper.status }}
        </span>
      </div>
    </header>

    <main class="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <div
        v-if="error || message"
        class="flex items-start gap-2 rounded-xl border px-4 py-3 text-sm"
        :class="error
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
        role="status"
      >
        <Icon
          :name="error ? 'lucide:alert-circle' : 'lucide:check-circle'"
          class="mt-0.5 shrink-0"
        />
        <span>{{ error || message }}</span>
      </div>

      <AdminPaperForm v-model="paper" />

      <!-- EXAM SOURCE -->
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-bold text-slate-900">Exam paper source</h2>
            <p class="mt-1 text-xs leading-5 text-slate-500">
              Paste plain text and AI builds the blocks, or upload ready-made JSON blocks.
              The original source is not stored.
            </p>
          </div>

          <div class="inline-flex rounded-lg border border-slate-300 p-0.5 text-xs font-semibold">
            <button
              type="button"
              class="rounded-md px-3 py-1.5"
              :class="inputMode === 'text'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'"
              @click="inputMode = 'text'"
            >
              Plain text (AI)
            </button>

            <button
              type="button"
              class="rounded-md px-3 py-1.5"
              :class="inputMode === 'json'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'"
              @click="inputMode = 'json'"
            >
              JSON
            </button>
          </div>
        </div>

        <!-- TEXT MODE -->
        <template v-if="inputMode === 'text'">
          <label for="exam-source" class="sr-only">
            Paste exam paper text
          </label>

          <textarea
            id="exam-source"
            v-model="importText"
            rows="12"
            maxlength="200000"
            placeholder="Paste the full question paper here, including instructions, questions, options, and any printed answer key."
            class="w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />

          <div class="mt-1 flex justify-end text-[11px] text-slate-400">
            {{ importText.length.toLocaleString() }} / 200,000 characters
          </div>

          <div class="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-800">Paper images</p>
                <p class="mt-1 text-xs text-slate-500">
                  PNG, JPG, or WebP. Up to 5 images, 5 MB each (20 MB combined).
                </p>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                :disabled="images.length >= 5 || busy"
                @click="fileInput?.click()"
              >
                <Icon name="lucide:image-plus" />
                Upload images
              </button>

              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                class="hidden"
                @change="onImagesSelected"
              />
            </div>

            <ul
              v-if="images.length"
              class="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white"
            >
              <li
                v-for="(image, index) in images"
                :key="`${image.name}-${image.lastModified}-${index}`"
                class="flex items-center gap-3 px-3 py-2"
              >
                <Icon name="lucide:image" class="shrink-0 text-slate-400" />

                <span class="min-w-0 flex-1 truncate text-xs text-slate-700">
                  {{ image.name }}
                </span>

                <span class="text-[11px] text-slate-400">
                  {{ (image.size / 1024 / 1024).toFixed(1) }} MB
                </span>

                <button
                  type="button"
                  class="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  :aria-label="`Remove ${image.name}`"
                  :disabled="busy"
                  @click="removeImage(index)"
                >
                  <Icon name="lucide:x" />
                </button>
              </li>
            </ul>
          </div>
        </template>

        <!-- JSON MODE -->
        <template v-else>
          <div class="mb-2 flex flex-wrap items-center justify-between gap-3">
            <p class="text-xs leading-5 text-slate-500">
              Paste JSON or upload a .json file. Block types: instructions, section, passage,
              question, answer, table, image.
            </p>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
              :disabled="busy"
              @click="jsonFileInput?.click()"
            >
              <Icon name="lucide:file-json" />
              Upload .json
            </button>

            <input
              ref="jsonFileInput"
              type="file"
              accept="application/json,.json"
              class="hidden"
              @change="onJsonFileSelected"
            />
          </div>

          <label for="exam-json" class="sr-only">
            Paste exam paper JSON
          </label>

          <textarea
            id="exam-json"
            v-model="jsonText"
            rows="14"
            spellcheck="false"
            placeholder='{ "title": "NABTEB Geography 2026", "blocks": [ { "type": "question", "number": 1, "text": "...", "options": [ { "label": "A", "text": "..." } ], "answer": "A" } ] }'
            class="w-full resize-y rounded-xl border border-slate-300 px-3 py-3 font-mono text-xs leading-5 text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </template>

        <div
          v-if="!isNew"
          class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900"
        >
          Saving replaces this paper's blocks with the new import.
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-[11px] text-slate-500">
            Review the blocks before saving.
          </p>

          <button
  type="button"
  class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
  :disabled="busy || !hasSource || !paper.subjectId"
  @click="processExamWithAI"
>
  <Icon
    :name="busy ? 'lucide:loader-circle' : 'lucide:sparkles'"
    :class="busy ? 'animate-spin' : ''"
  />

  {{ busy ? 'AI Processing...' : 'Generate & Correct Blocks' }}
</button>
        </div>
      </section>

      <!-- DRAFT REVIEW -->
      <section
        v-if="draft"
        class="space-y-4 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="text-sm font-bold text-slate-900">
              Review blocks
            </h2>

            <p class="mt-1 text-xs text-slate-500">
              {{ draft.title }} · {{ draft.blocks.length }} blocks ·
              {{ questionCount }} questions
            </p>

            <p class="mt-1 text-xs text-slate-500">
              Slug: {{ draft.slug }} · Subject: {{ draft.metadata.subject }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- DIRECT NUXT AI CORRECTION -->
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="busy || !draft.blocks.length"
              @click="correctDraftBlocks"
            >
              <Icon
                :name="correcting ? 'lucide:loader-circle' : 'lucide:sparkles'"
                :class="correcting ? 'animate-spin' : ''"
              />

              {{ correcting ? 'Correcting with AI...' : 'AI Correct Blocks' }}
            </button>

            <!-- EXPRESS SAVE -->
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="busy"
              @click="saveDraft"
            >
              <Icon name="lucide:save" />

              {{ busy
                ? 'Processing...'
                : isNew
                  ? 'Save paper'
                  : 'Replace paper blocks' }}
            </button>
          </div>
        </div>

        <div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Check every block carefully. AI can misread scans; it does not invent answers when none
          are printed.
        </div>

        <div class="space-y-3">
          <div
            v-for="(block, index) in draft.blocks"
            :key="index"
            class="rounded-xl border p-3 text-sm"
            :class="blockStyle[block.type]"
          >
            <span
              class="mb-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-white"
            >
              {{ blockLabel[block.type] }}
              <template v-if="block.number"> {{ block.number }}</template>
            </span>

            <h3 v-if="block.title" class="font-bold text-slate-900">
              {{ block.title }}
            </h3>

            <p v-if="block.text" class="whitespace-pre-line leading-6">
              {{ block.text }}
            </p>

            <ul v-if="block.options?.length" class="mt-2 space-y-1">
              <li
                v-for="option in block.options"
                :key="option.label"
                class="rounded-lg border px-2 py-1"
                :class="block.answer === option.label
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-200'"
              >
                <b>{{ option.label }}.</b> {{ option.text }}
              </li>
            </ul>

            <p v-if="block.answer || block.marks" class="mt-2 text-xs text-slate-700">
              <span v-if="block.answer">
                <b>Answer:</b> {{ block.answer }}
              </span>

              <span v-if="block.answer && block.marks"> · </span>

              <span v-if="block.marks">
                {{ block.marks }} mark(s)
              </span>
            </p>

            <p v-if="block.explanation" class="mt-1 text-xs text-slate-600">
              {{ block.explanation }}
            </p>

            <div
              v-if="block.type === 'table' && block.rows"
              class="mt-2 overflow-x-auto"
            >
              <table class="w-full border-collapse text-xs">
                <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex">
                  <td
                    v-for="(cell, cellIndex) in row"
                    :key="cellIndex"
                    class="border border-slate-300 p-1.5"
                  >
                    {{ cell }}
                  </td>
                </tr>
              </table>
            </div>

            <p
              v-if="block.type === 'image' && block.caption"
              class="mt-1 text-xs text-slate-600"
            >
              {{ block.caption }}
            </p>
          </div>
        </div>
      </section>

      <!-- SAVED PAPER -->
      <section
        v-else-if="savedBlocks.length"
        class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <h2 class="text-sm font-bold text-slate-900">
          Saved paper blocks
        </h2>

        <div class="space-y-3">
          <div
            v-for="(block, index) in savedBlocks"
            :key="index"
            class="rounded-xl border p-3 text-sm"
            :class="blockStyle[block.type] || 'border-slate-200 bg-white'"
          >
            <span
              class="mb-2 inline-block rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-white"
            >
              {{ blockLabel[block.type] || block.type }}
              <template v-if="block.number"> {{ block.number }}</template>
            </span>

            <h3 v-if="block.title" class="font-bold text-slate-900">
              {{ block.title }}
            </h3>

            <p v-if="block.text" class="whitespace-pre-line leading-6">
              {{ block.text }}
            </p>

            <ul v-if="block.options?.length" class="mt-2 space-y-1">
              <li
                v-for="option in block.options"
                :key="option.label"
                class="rounded-lg border px-2 py-1"
                :class="block.answer === option.label
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-200'"
              >
                <b>{{ option.label }}.</b> {{ option.text }}
              </li>
            </ul>

            <p v-if="block.answer" class="mt-2 text-xs text-slate-700">
              <b>Answer:</b> {{ block.answer }}
            </p>

            <p v-if="block.explanation" class="mt-1 text-xs text-slate-600">
              {{ block.explanation }}
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
