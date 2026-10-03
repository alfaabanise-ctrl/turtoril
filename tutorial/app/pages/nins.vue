```vue
<template>
  <div class="min-h-screen bg-slate-100 p-6">

    <!-- HEADER -->
    <div class="mx-auto mb-6 max-w-7xl">
      <div class="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 class="text-2xl font-bold">
              Demo Card Editor
            </h1>

            <p class="mt-1 text-sm text-slate-300">
              JSON-driven card editor for fictional/demo credentials.
            </p>
          </div>

          <div class="flex flex-wrap gap-2">

            <!-- JSON UPLOAD -->
            <label
              class="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Upload JSON

              <input
                type="file"
                accept=".json,application/json"
                class="hidden"
                @change="handleJsonUpload"
              />
            </label>

            <!-- EXPORT JSON -->
            <button
              type="button"
              class="rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
              @click="downloadJson"
            >
              Export JSON
            </button>

            <!-- ADD CARD -->
            <button
              type="button"
              class="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-amber-400"
              @click="addCard"
            >
              + Add Card
            </button>

          </div>
        </div>
      </div>
    </div>


    <!-- CARDS -->
    <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">

      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="overflow-hidden rounded-2xl bg-white shadow-lg"
      >

        <!-- EDITOR -->
        <div class="border-b bg-slate-50 p-5">

          <div class="mb-5 flex items-center justify-between">

            <div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Card {{ index + 1 }}
              </div>

              <h2 class="text-lg font-bold text-slate-900">
                {{ card.fullName || "Untitled Card" }}
              </h2>
            </div>

            <div class="flex gap-2">

              <!-- DUPLICATE -->
              <button
                type="button"
                class="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-white"
                @click="duplicateCard(index)"
              >
                Duplicate
              </button>

              <!-- DELETE -->
              <button
                type="button"
                class="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                @click="deleteCard(index)"
              >
                Delete
              </button>

            </div>
          </div>


          <!-- FORM -->
          <div class="grid gap-4 sm:grid-cols-2">

            <!-- FULL NAME -->
            <div class="sm:col-span-2">
              <label class="label">
                Full Name
              </label>

              <input
                v-model="card.fullName"
                class="input"
                placeholder="John Example"
              />
            </div>


            <!-- SURNAME -->
            <div>
              <label class="label">
                Surname
              </label>

              <input
                v-model="card.surname"
                class="input"
                placeholder="Example"
              />
            </div>


            <!-- GIVEN NAME -->
            <div>
              <label class="label">
                Given Names
              </label>

              <input
                v-model="card.givenNames"
                class="input"
                placeholder="John Michael"
              />
            </div>


            <!-- DOB -->
            <div>
              <label class="label">
                Date of Birth
              </label>

              <input
                v-model="card.dateOfBirth"
                type="date"
                class="input"
              />
            </div>


            <!-- COUNTRY CODE -->
            <div>
              <label class="label">
                Country / Region Code
              </label>

              <input
                v-model="card.countryCode"
                maxlength="3"
                class="input uppercase"
                placeholder="DEM"
              />
            </div>


            <!-- ID -->
            <div>
              <label class="label">
                Demo ID Number
              </label>

              <input
                v-model="card.idNumber"
                class="input"
                placeholder="DEMO-000000"
              />
            </div>


            <!-- STATUS -->
            <div>
              <label class="label">
                Status
              </label>

              <select
                v-model="card.status"
                class="input"
              >
                <option value="DEMO">DEMO</option>
                <option value="SAMPLE">SAMPLE</option>
                <option value="TEST">TEST</option>
              </select>
            </div>


            <!-- PHOTO -->
            <div class="sm:col-span-2">

              <label class="label">
                Photo
              </label>

              <div class="flex items-center gap-4">

                <div
                  class="flex h-24 w-20 items-center justify-center overflow-hidden rounded-xl border bg-slate-100"
                >
                  <img
                    v-if="card.photo"
                    :src="card.photo"
                    alt="Photo"
                    class="h-full w-full object-cover"
                  />

                  <span
                    v-else
                    class="text-xs text-slate-400"
                  >
                    No photo
                  </span>
                </div>

                <label
                  class="cursor-pointer rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"
                >
                  Upload Photo

                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handlePhotoUpload($event, card)"
                  />
                </label>

              </div>

            </div>

          </div>
        </div>


        <!-- CARD PREVIEW -->
        <div class="p-6">

          <div
            class="relative mx-auto aspect-[1.586/1] max-w-[600px] overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-inner"
          >

            <!-- DEMO WATERMARK -->
            <div
              class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            >
              <div
                class="-rotate-12 text-4xl font-black tracking-widest text-red-500/20 md:text-5xl"
              >
                DEMO • NOT VALID
              </div>
            </div>


            <!-- TOP -->
            <div class="relative z-10 flex items-center justify-between border-b-2 border-slate-200 px-5 py-3">

              <div>
                <div class="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Fictional Identity Card
                </div>

                <div class="text-lg font-black text-slate-900">
                  DEMO CARD
                </div>
              </div>

              <div class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-black text-white">
                {{ card.countryCode || "DEM" }}
              </div>

            </div>


            <!-- BODY -->
            <div class="relative z-10 grid grid-cols-[90px_1fr] gap-4 p-5">

              <!-- PHOTO -->
              <div
                class="h-[115px] w-[90px] overflow-hidden rounded-lg border-2 border-slate-300 bg-slate-100"
              >
                <img
                  v-if="card.photo"
                  :src="card.photo"
                  alt=""
                  class="h-full w-full object-cover"
                />

                <div
                  v-else
                  class="flex h-full items-center justify-center text-center text-[9px] font-bold text-slate-400"
                >
                  PHOTO
                </div>
              </div>


              <!-- INFORMATION -->
              <div class="space-y-2">

                <div>
                  <div class="text-[8px] font-bold uppercase text-slate-400">
                    Surname
                  </div>

                  <div class="text-sm font-bold text-slate-900">
                    {{ card.surname || "EXAMPLE" }}
                  </div>
                </div>


                <div>
                  <div class="text-[8px] font-bold uppercase text-slate-400">
                    Given Names
                  </div>

                  <div class="text-sm font-bold text-slate-900">
                    {{ card.givenNames || "JOHN MICHAEL" }}
                  </div>
                </div>


                <div class="flex gap-8">

                  <div>
                    <div class="text-[8px] font-bold uppercase text-slate-400">
                      Date of Birth
                    </div>

                    <div class="text-xs font-bold text-slate-900">
                      {{ formatDate(card.dateOfBirth) }}
                    </div>
                  </div>

                  <div>
                    <div class="text-[8px] font-bold uppercase text-slate-400">
                      Status
                    </div>

                    <div class="text-xs font-bold text-slate-900">
                      {{ card.status }}
                    </div>
                  </div>

                </div>

              </div>

            </div>


            <!-- ID -->
            <div class="relative z-10 border-t bg-slate-50 px-5 py-3">

              <div class="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                Demo Identification Number
              </div>

              <div class="font-mono text-xl font-black tracking-[0.2em] text-slate-900">
                {{ card.idNumber || "DEMO-000000" }}
              </div>

            </div>


            <!-- FOOTER -->
            <div class="absolute bottom-0 left-0 right-0 z-10 bg-slate-900 px-5 py-2 text-center">

              <span class="text-[8px] font-black uppercase tracking-widest text-white">
                FICTIONAL SAMPLE • NOT A GOVERNMENT DOCUMENT
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>


<script setup lang="ts">

import { ref } from "vue"


// ============================================================
// TYPES
// ============================================================

interface DemoCard {
  id: string
  fullName: string
  surname: string
  givenNames: string
  dateOfBirth: string
  countryCode: string
  idNumber: string
  status: string
  photo: string
}


// ============================================================
// CREATE CARD
// ============================================================

function createCard(
  data: Partial<DemoCard> = {}
): DemoCard {

  return {

    id:
      data.id ||
      crypto.randomUUID(),

    fullName:
      data.fullName ||
      "",

    surname:
      data.surname ||
      "",

    givenNames:
      data.givenNames ||
      "",

    dateOfBirth:
      data.dateOfBirth ||
      "",

    countryCode:
      data.countryCode ||
      "DEM",

    idNumber:
      data.idNumber ||
      `DEMO-${Math.floor(
        100000 +
        Math.random() * 900000
      )}`,

    status:
      data.status ||
      "DEMO",

    photo:
      data.photo ||
      ""

  }

}


// ============================================================
// STATE
// ============================================================

const cards = ref<DemoCard[]>([
  createCard({
    surname: "EXAMPLE",
    givenNames: "JOHN MICHAEL",
    fullName: "JOHN MICHAEL EXAMPLE",
    countryCode: "DEM",
    idNumber: "DEMO-123456"
  })
])


// ============================================================
// ADD CARD
// ============================================================

function addCard() {

  cards.value.push(
    createCard()
  )

}


// ============================================================
// DUPLICATE CARD
// ============================================================

function duplicateCard(index: number) {

  const original = cards.value[index]

  const copy = createCard({

    ...original,

    id: undefined,

    idNumber:
      `DEMO-${Math.floor(
        100000 +
        Math.random() * 900000
      )}`

  })

  cards.value.splice(
    index + 1,
    0,
    copy
  )

}


// ============================================================
// DELETE CARD
// ============================================================

function deleteCard(index: number) {

  if (cards.value.length === 1) {

    alert(
      "At least one demo card must remain."
    )

    return

  }

  cards.value.splice(
    index,
    1
  )

}


// ============================================================
// PHOTO UPLOAD
// ============================================================

function handlePhotoUpload(
  event: Event,
  card: DemoCard
) {

  const input =
    event.target as HTMLInputElement

  const file =
    input.files?.[0]

  if (!file) return

  if (!file.type.startsWith("image/")) {

    alert(
      "Please select an image file."
    )

    return

  }

  const reader =
    new FileReader()

  reader.onload = () => {

    card.photo =
      String(reader.result)

  }

  reader.readAsDataURL(file)

}


// ============================================================
// JSON UPLOAD
// ============================================================

function handleJsonUpload(
  event: Event
) {

  const input =
    event.target as HTMLInputElement

  const file =
    input.files?.[0]

  if (!file) return

  const reader =
    new FileReader()

  reader.onload = () => {

    try {

      const parsed =
        JSON.parse(
          String(reader.result)
        )

      const incoming =
        Array.isArray(parsed)
          ? parsed
          : parsed.cards

      if (!Array.isArray(incoming)) {

        alert(
          "JSON must contain a cards array."
        )

        return

      }

      cards.value =
        incoming.map(
          (item: Partial<DemoCard>) =>
            createCard(item)
        )

    } catch (error) {

      console.error(error)

      alert(
        "Invalid JSON file."
      )

    }

  }

  reader.readAsText(file)

  // Allows selecting the same file again.
  input.value = ""

}


// ============================================================
// EXPORT JSON
// ============================================================

function downloadJson() {

  const data =
    JSON.stringify(
      {
        version: "1.0",
        type: "fictional-demo-cards",
        cards: cards.value
      },
      null,
      2
    )

  const blob =
    new Blob(
      [data],
      {
        type: "application/json"
      }
    )

  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement("a")

  link.href = url

  link.download =
    "demo-cards.json"

  link.click()

  URL.revokeObjectURL(url)

}


// ============================================================
// DATE
// ============================================================

function formatDate(
  value: string
) {

  if (!value) {
    return "YYYY-MM-DD"
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value
  }

  return date
    .toISOString()
    .slice(0, 10)

}

</script>


<style scoped>

.label {
  @apply mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500;
}

.input {
  @apply w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10;
}

</style>
```

### JSON format

Your demo data can then look like this:

```json
{
  "version": "1.0",
  "type": "fictional-demo-cards",
  "cards": [
    {
      "fullName": "JOHN MICHAEL EXAMPLE",
      "surname": "EXAMPLE",
      "givenNames": "JOHN MICHAEL",
      "dateOfBirth": "2009-02-14",
      "countryCode": "DEM",
      "idNumber": "DEMO-123456",
      "status": "DEMO",
      "photo": ""
    },
    {
      "fullName": "JANE SAMPLE",
      "surname": "SAMPLE",
      "givenNames": "JANE",
      "dateOfBirth": "2010-05-20",
      "countryCode": "TST",
      "idNumber": "DEMO-654321",
      "status": "SAMPLE",
      "photo": ""
    }
  ]
}
``