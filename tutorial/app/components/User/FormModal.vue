<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

type UserType = 'student' | 'teacher' | 'admin'

interface UserForm {
  fullName: string
  email: string
  phone: string
  password: string
}

const props = withDefaults(
  defineProps<{
    type: UserType
    buttonText: string
    user?: Partial<UserForm>
  }>(),
  {
    buttonText: '',
  },
)

const emit = defineEmits<{
  submit: [data: UserForm & { type: UserType }]
}>()

/* --------------------------------
   MODAL STATE
-------------------------------- */

const isOpen = ref(false)
const loading = ref(false)

/* --------------------------------
   FORM
-------------------------------- */

const form = reactive<UserForm>({
  fullName: '',
  email: '',
  phone: '',
  password: '',
})

/* --------------------------------
   TYPE LABEL
-------------------------------- */

const typeLabel = computed(() => {
  const labels: Record<UserType, string> = {
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Admin',
  }

  return labels[props.type]
})

/* --------------------------------
   DESCRIPTION
-------------------------------- */

const description = computed(() => {
  const descriptions: Record<UserType, string> = {
    student: 'Create a JAMB student account.',
    teacher: 'Create a teacher account for managing students.',
    admin: 'Create an administrator account.',
  }

  return descriptions[props.type]
})

/* --------------------------------
   EMAIL PLACEHOLDER
-------------------------------- */

const placeholderEmail = computed(() => {
  const placeholders: Record<UserType, string> = {
    student: 'student@example.com',
    teacher: 'teacher@example.com',
    admin: 'admin@example.com',
  }

  return placeholders[props.type]
})

/* --------------------------------
   OPEN MODAL
-------------------------------- */

const openModal = () => {
  resetForm()
  isOpen.value = true
}

/* --------------------------------
   CLOSE MODAL
-------------------------------- */

const closeModal = () => {
  if (loading.value) return

  isOpen.value = false
}

/* --------------------------------
   RESET FORM
-------------------------------- */

const resetForm = () => {
  form.fullName = props.user?.fullName || ''
  form.email = props.user?.email || ''
  form.phone = props.user?.phone || ''
  form.password = ''
}

/* --------------------------------
   WATCH USER
-------------------------------- */

watch(
  () => props.user,
  () => {
    if (isOpen.value) {
      resetForm()
    }
  },
  {
    deep: true,
  },
)

/* --------------------------------
   SUBMIT
-------------------------------- */

const submit = async () => {
  if (loading.value) return

  loading.value = true

  try {
    emit('submit', {
      ...form,
      type: props.type,
    })

    isOpen.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- =====================================
       TRIGGER BUTTON
       THIS BUTTON BELONGS TO COMPONENT
  ====================================== -->

  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
    @click="openModal"
  >
    <Icon
      name="lucide:plus"
      class="h-5 w-5"
    />

    {{ buttonText }}
  </button>

  <!-- =====================================
       MODAL
  ====================================== -->

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-['Poppins']"
      >
        <!-- BACKDROP -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeModal"
        />

        <!-- MODAL CONTAINER -->
        <div
          class="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900"
        >
          <!-- =====================================
               HEADER
          ====================================== -->

          <div
            class="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800"
          >
            <div class="flex items-center gap-4">
              <!-- ROLE ICON -->
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                :class="{
                  'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400':
                    type === 'student',

                  'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400':
                    type === 'teacher',

                  'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400':
                    type === 'admin',
                }"
              >
                <Icon
                  v-if="type === 'student'"
                  name="lucide:graduation-cap"
                  class="h-6 w-6"
                />

                <Icon
                  v-else-if="type === 'teacher'"
                  name="lucide:book-open"
                  class="h-6 w-6"
                />

                <Icon
                  v-else
                  name="lucide:shield-check"
                  class="h-6 w-6"
                />
              </div>

              <!-- TITLE -->
              <div>
                <h2
                  class="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  Create {{ typeLabel }}
                </h2>

                <p
                  class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ description }}
                </p>
              </div>
            </div>

            <!-- CLOSE -->
            <button
              type="button"
              :disabled="loading"
              class="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              @click="closeModal"
            >
              <Icon
                name="lucide:x"
                class="h-5 w-5"
              />
            </button>
          </div>

          <!-- =====================================
               FORM
          ====================================== -->

          <form
            class="space-y-5 px-6 py-6"
            @submit.prevent="submit"
          >
            <!-- FULL NAME -->
            <div>
              <label
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>

              <div class="relative">
                <Icon
                  name="lucide:user"
                  class="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />

                <input
                  v-model="form.fullName"
                  type="text"
                  required
                  placeholder="Enter full name"
                  class="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- EMAIL -->
            <div>
              <label
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>

              <div class="relative">
                <Icon
                  name="lucide:mail"
                  class="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />

                <input
                  v-model="form.email"
                  type="email"
                  required
                  :placeholder="placeholderEmail"
                  class="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <!-- PHONE -->
            <div>
              <label
                class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number
              </label>

              <div class="relative">
                <Icon
                  name="lucide:phone"
                  class="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                />

                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="08012345678"
                  class="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

           

            <!-- ROLE INFO -->
            <div
              class="flex items-center gap-3 rounded-2xl border p-4"
              :class="{
                'border-blue-100 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-500/5':
                  type === 'student',

                'border-purple-100 bg-purple-50/70 dark:border-purple-500/20 dark:bg-purple-500/5':
                  type === 'teacher',

                'border-orange-100 bg-orange-50/70 dark:border-orange-500/20 dark:bg-orange-500/5':
                  type === 'admin',
              }"
            >
              <Icon
                name="lucide:info"
                class="h-5 w-5 shrink-0"
                :class="{
                  'text-blue-600': type === 'student',
                  'text-purple-600': type === 'teacher',
                  'text-orange-600': type === 'admin',
                }"
              />

              <p
                class="text-sm text-gray-600 dark:text-gray-300"
              >
                This account will be created as a
                <span class="font-semibold">
                  {{ typeLabel }} and phone number is password
                </span>.
              </p>
            </div>

            <!-- =====================================
                 ACTION BUTTONS
            ====================================== -->

            <div class="flex gap-3 pt-2">
              <!-- CANCEL -->
              <button
                type="button"
                :disabled="loading"
                class="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="closeModal"
              >
                Cancel
              </button>

              <!-- CREATE -->
              <button
                type="submit"
                :disabled="loading"
                class="h-12 flex-1 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                <span
                  v-if="loading"
                  class="flex items-center justify-center gap-2"
                >
                  <Icon
                    name="lucide:loader-2"
                    class="h-5 w-5 animate-spin"
                  />

                  Creating...
                </span>

                <span v-else>
                  {{ buttonText }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>