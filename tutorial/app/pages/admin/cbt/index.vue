<script setup lang="ts">
const route = useRoute()

const jsonText = ref("")
const fileInput = ref<HTMLInputElement | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)
const selectedImageUrl = ref("")
const busy = ref(false)
const message = ref("")
const error = ref("")
const skipNextLoad = ref(false)

const board = ref("NABTEB")
const subjectName = ref("Geography")
const examYear = ref("2026")
const paperName = ref("Paper II")
const durationMinutes = ref(120)

// The paper id lives in the URL: /admin/cbt?action=edit&subjectId=...
const subjectId = computed(() => String(route.query.subjectId || ""))
const isEdit = computed(() => route.query.action === "edit" && !!subjectId.value)

function slug(value: string) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function blankTemplate() {
  const id = slug(subjectName.value)
  return {
    version: 1,
    subjects: [{
      id: [slug(board.value), id, slug(examYear.value), slug(paperName.value)].filter(Boolean).join("-"),
      name: subjectName.value,
      code: id.slice(0, 8).toUpperCase(),
      board: board.value,
      year: examYear.value,
      paper: paperName.value,
      durationMinutes: durationMinutes.value,
      instructions: "Answer according to the instructions in each section.",
      examType: "mixed",
      sections: [
        {
          id: "section-a",
          name: "Section A: Objective",
          blocks: [{
            id: "objective-1",
            type: "question",
            questionType: "objective",
            text: "Write the objective question here.",
            options: ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
            answer: "A. First option",
            explanation: "Explain the correct answer.",
            marks: 1,
          }],
        },
        {
          id: "section-b",
          name: "Section B: Theory / Practical",
          blocks: [
            { id: "instruction-1", type: "instruction", text: "Add a general instruction here." },
            { id: "image-1", type: "image", src: "/cbt/images/example.png", alt: "Exam diagram or map", caption: "Figure 1" },
            {
              id: "theory-1",
              type: "question",
              questionType: "theory",
              text: "Write the theory or practical question here.",
              answer: "Write the complete model answer here.",
              explanation: "Optional marking guide.",
              marks: 10,
            },
          ],
        },
      ],
    }],
  }
}

function createExamTemplate() {
  jsonText.value = JSON.stringify(blankTemplate(), null, 2)
  message.value = "Template created. Edit the JSON, then click Publish."
  error.value = ""
}

async function loadSubject(id: string) {
  busy.value = true
  message.value = ""
  error.value = ""
  try {
    const found = await getCbtSubject(id)
    jsonText.value = JSON.stringify({ version: 1, subjects: [found] }, null, 2)
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.data?.message || err?.message || "Unable to load exam paper."
  } finally {
    busy.value = false
  }
}

async function readJsonFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const text = await file.text()
  try {
    JSON.parse(text)
    jsonText.value = text
    message.value = `Loaded ${file.name}. Click ${isEdit.value ? "Save changes" : "Publish"} to save it.`
    error.value = ""
  } catch (err: any) {
    error.value = `Invalid JSON in ${file.name}: ${err.message}`
  }
  input.value = ""
}

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  busy.value = true
  error.value = ""
  try {
    const response = await uploadCbtImage(file)
    selectedImageUrl.value = response.data.src
    message.value = `Image uploaded: ${response.data.src}`
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.data?.message || err?.message || "Image upload failed."
  } finally {
    busy.value = false
    input.value = ""
  }
}


async function importJson() {
  busy.value = true
  message.value = ""
  error.value = ""

  try {
    const parsed = JSON.parse(jsonText.value)

    // Publish new paper or update existing paper
    const response = isEdit.value
      ? await publishSubjects(parsed, subjectId.value)
      : await publishSubjects(parsed)

    console.log("Full publish response:", response)

    message.value =
      response?.message || "Exam paper saved successfully."

    // Handle both possible backend response structures
    const savedPaper =
      response?.data?.subjects?.[0] ||
      response?.data?.subject ||
      response?.data

    console.log("Saved paper:", savedPaper)

    // Get saved MongoDB ID
    const mongoId = savedPaper?._id

    // Get creator / updater user ID
    const userId =
      savedPaper?.createdBy ||
      savedPaper?.updatedBy ||
      ""

    // Access code
    const accessCode = savedPaper?.accesscode || ""

    console.log("MongoDB Paper ID:", mongoId)
    console.log("User ID:", userId)
    console.log("Access Code:", accessCode)

    // Switch new paper to edit mode using MongoDB ID
    if (!isEdit.value && mongoId) {
      skipNextLoad.value = true

      await navigateTo(
        {
          query: {
            action: "edit",
            subjectId: String(mongoId),
          },
        },
        {
          replace: true,
        }
      )
    }
  } catch (err: any) {
    error.value =
      err instanceof SyntaxError
        ? `Invalid JSON: ${err.message}`
        : err?.data?.statusMessage ||
          err?.data?.message ||
          err?.message ||
          "Import failed."
  } finally {
    busy.value = false
  }
}


async function copyImageUrl() {
  if (!selectedImageUrl.value) return
  await navigator.clipboard.writeText(selectedImageUrl.value)
  message.value = "Image URL copied."
}

watch(
  () => [route.query.action, route.query.subjectId],
  () => {
    if (skipNextLoad.value) {
      skipNextLoad.value = false
      return
    }
    if (isEdit.value) loadSubject(subjectId.value)
    else createExamTemplate()
  },
  { immediate: true }
)
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p class="text-sm font-semibold text-[#0794bd]">Content manager</p>
        <h1 class="mt-1 text-2xl font-bold text-slate-900">
          {{ isEdit ? "Edit Exam Paper" : "Exam Paper Importer" }}
        </h1>
        <p class="mt-2 text-sm text-slate-500">Upload complete past-question papers section by section, with text, images, objectives and theory answers.</p>
      </div>
      <NuxtLink to="/cbt" class="text-sm font-bold text-[#0794bd]">← All subjects</NuxtLink>
    </div>

    <div v-if="busy && isEdit" class="mb-5 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
      Loading exam paper...
    </div>
    <div v-if="message" class="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{{ message }}</div>
    <div v-if="error" class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{{ error }}</div>

    <section v-if="!isEdit" class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="font-bold text-slate-900">Generate a blank exam-paper template</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label class="text-xs font-semibold text-slate-600">Exam board
          <select v-model="board" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800">
            <option>WAEC</option><option>NECO</option><option>NABTEB</option><option>JAMB</option><option>Custom</option>
          </select>
        </label>
        <label class="text-xs font-semibold text-slate-600">Subject
          <input v-model="subjectName" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800" />
        </label>
        <label class="text-xs font-semibold text-slate-600">Year
          <input v-model="examYear" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800" />
        </label>
        <label class="text-xs font-semibold text-slate-600">Paper
          <input v-model="paperName" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800" />
        </label>
        <label class="text-xs font-semibold text-slate-600">Duration (minutes)
          <input v-model.number="durationMinutes" type="number" min="1" class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800" />
        </label>
      </div>
      <div class="mt-4">
        <button type="button" class="rounded-lg bg-[#0794bd] px-4 py-2 text-sm font-bold text-white" @click="createExamTemplate">
          Generate blank template
        </button>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-bold text-slate-900">{{ isEdit ? "Editing paper" : "New paper" }} (JSON)</h2>
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700" @click="fileInput?.click()">
            Choose JSON file
          </button>
          <input ref="fileInput" type="file" accept=".json,application/json" class="hidden" @change="readJsonFile" />
        </div>
        <textarea
          v-model="jsonText"
          class="h-[520px] w-full rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-cyan-400"
          spellcheck="false"
        />
        <button type="button" :disabled="busy || !jsonText" class="mt-4 w-full rounded-xl bg-[#0794bd] px-4 py-3 font-bold text-white disabled:opacity-60" @click="importJson">
          {{ busy ? "Working..." : isEdit ? "Save changes" : "Publish paper" }}
        </button>
      </section>

      <aside class="space-y-5">
        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-bold text-slate-900">Upload block image</h2>
          <p class="mt-2 text-sm leading-6 text-slate-500">The uploaded URL can be placed in a block with <code>type: "image"</code>.</p>
          <button type="button" class="mt-4 w-full rounded-lg border border-dashed border-cyan-300 px-3 py-6 text-sm font-semibold text-[#0794bd]" @click="imageInput?.click()">
            Choose image
          </button>
          <input ref="imageInput" type="file" accept="image/png,image/jpeg,image/gif,image/webp" class="hidden" @change="uploadImage" />
          <div v-if="selectedImageUrl" class="mt-4">
            <img :src="selectedImageUrl" alt="Uploaded block" class="max-h-48 w-full rounded-lg border border-slate-200 object-contain" />
            <button type="button" class="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white" @click="copyImageUrl">Copy image URL</button>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-bold text-slate-900">Supported block types</h2>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="type in ['heading', 'paragraph', 'instruction', 'image', 'question', 'answer', 'table']" :key="type" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{ type }}</span>
          </div>
          <NuxtLink to="/cbt" class="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0794bd]">Open CBT <Icon name="lucide:arrow-right" class="h-4 w-4" /></NuxtLink>
        </section>
      </aside>
    </div>
  </div>
</template>