<script setup lang="ts">
import { computed, ref } from "vue"

interface Props {
  open: boolean
  balance: number
  minimumWithdrawal?: number
  endpoint?: string
}

const props = withDefaults(defineProps<Props>(), {
  minimumWithdrawal: 5000,
  endpoint: "/admin/wallet/withdraw",
})

const emit = defineEmits<{
  close: []
  success: [response: any]
  error: [error: any]
}>()

/* --------------------------------------------------
 * STATE
 * -------------------------------------------------- */

const amount = ref<number | null>(null)
const loading = ref(false)
const errorMessage = ref("")
const successMessage = ref("")

/* --------------------------------------------------
 * CURRENCY
 * -------------------------------------------------- */

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
})

/* --------------------------------------------------
 * HELPERS
 * -------------------------------------------------- */

const nairaToKobo = (value: number) => {
  return Math.round(value * 100)
}

const closeModal = () => {
  if (loading.value) return

  amount.value = null
  errorMessage.value = ""
  successMessage.value = ""

  emit("close")
}

/* --------------------------------------------------
 * VALIDATION
 * -------------------------------------------------- */

const enteredAmount = computed(() => {
  return Number(amount.value || 0)
})

const canSubmit = computed(() => {
  return (
    !loading.value &&
    enteredAmount.value >= props.minimumWithdrawal &&
    enteredAmount.value <= props.balance
  )
})

/* --------------------------------------------------
 * SUBMIT WITHDRAWAL
 * -------------------------------------------------- */

const submitWithdrawal = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  const withdrawalAmount = enteredAmount.value

  /* ----------------------------------------------
   * Validate amount
   * ---------------------------------------------- */

  if (!withdrawalAmount || withdrawalAmount <= 0) {
    errorMessage.value =
      "Please enter a withdrawal amount."
    return
  }

  if (
    withdrawalAmount <
    props.minimumWithdrawal
  ) {
    errorMessage.value =
      `Minimum withdrawal is ${currency.format(
        props.minimumWithdrawal,
      )}.`
    return
  }

  if (
    withdrawalAmount >
    props.balance
  ) {
    errorMessage.value =
      "Withdrawal amount cannot be greater than your available balance."
    return
  }

  /* ----------------------------------------------
   * Convert Naira → Kobo
   * ---------------------------------------------- */

  const amountInKobo =
    nairaToKobo(withdrawalAmount)

  loading.value = true

  try {
    const response = await useApiFetch(
      props.endpoint,
      {
        method: "POST",

        body: {
          amount: amountInKobo,
        },
      },
    )

    console.log(
      "WITHDRAWAL RESPONSE:",
      response,
    )

    if (!response?.success) {
      throw new Error(
        response?.message ||
          "Unable to submit withdrawal request.",
      )
    }

    successMessage.value =
      response?.message ||
      "Withdrawal request submitted successfully."

    /*
     * Send complete backend response
     * to parent
     */
    emit("success", response)

    /*
     * Close after successful request
     */
    setTimeout(() => {
      closeModal()
    }, 1000)

  } catch (error: any) {
    console.error(
      "Withdrawal error:",
      error,
    )

    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to submit withdrawal request."

    emit("error", error)

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
        >
          <div>
            <h2
              class="text-lg font-bold text-gray-900 dark:text-white"
            >
              Request Withdrawal
            </h2>

            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
              Withdraw your available commission balance.
            </p>
          </div>

          <button
            type="button"
            :disabled="loading"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
            @click="closeModal"
          >
            <Icon
              name="heroicons:x-mark"
              class="h-5 w-5"
            />
          </button>
        </div>

        <!-- Body -->
        <div class="space-y-5 p-5">

          <!-- Available Balance -->
          <div
            class="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10"
          >
            <div
              class="flex items-center justify-between"
            >
              <span
                class="text-sm font-medium text-indigo-700 dark:text-indigo-300"
              >
                Available Balance
              </span>

              <Icon
                name="heroicons:wallet"
                class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <p
              class="mt-2 text-2xl font-bold text-indigo-900 dark:text-white"
            >
              {{ currency.format(balance) }}
            </p>
          </div>

          <!-- Amount -->
          <div>
            <label
              for="withdrawal-amount"
              class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Withdrawal Amount
            </label>

            <div class="relative">
              <span
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 dark:text-gray-400"
              >
                ₦
              </span>

              <input
                id="withdrawal-amount"
                v-model.number="amount"
                type="number"
                min="0"
                :max="balance"
                :disabled="loading"
                placeholder="Enter amount"
                class="h-12 w-full rounded-xl border border-gray-300 bg-white pl-8 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                @keyup.enter="submitWithdrawal"
              />
            </div>

            <div
              class="mt-2 flex items-center justify-between text-xs"
            >
              <span
                class="text-gray-500 dark:text-gray-400"
              >
                Minimum:
                {{ currency.format(minimumWithdrawal) }}
              </span>

              <button
                type="button"
                :disabled="loading"
                class="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 dark:text-indigo-400"
                @click="
                  amount = balance
                "
              >
                Use all
              </button>
            </div>
          </div>

          <!-- Amount Preview -->
          <div
            v-if="enteredAmount > 0"
            class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div
              class="flex items-center justify-between"
            >
              <span
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                Withdrawal amount
              </span>

              <span
                class="text-sm font-bold text-gray-900 dark:text-white"
              >
                {{ currency.format(enteredAmount) }}
              </span>
            </div>

            <div
              class="mt-2 flex items-center justify-between"
            >
              <span
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                Balance after request
              </span>

              <span
                class="text-sm font-bold text-gray-900 dark:text-white"
              >
                {{
                  currency.format(
                    Math.max(
                      balance - enteredAmount,
                      0,
                    ),
                  )
                }}
              </span>
            </div>
          </div>

          <!-- Error -->
          <div
            v-if="errorMessage"
            class="flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400"
          >
            <Icon
              name="heroicons:exclamation-circle"
              class="mt-0.5 h-5 w-5 shrink-0"
            />

            <p>{{ errorMessage }}</p>
          </div>

          <!-- Success -->
          <div
            v-if="successMessage"
            class="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          >
            <Icon
              name="heroicons:check-circle"
              class="mt-0.5 h-5 w-5 shrink-0"
            />

            <p>{{ successMessage }}</p>
          </div>

          <!-- Information -->
          <div
            class="flex gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
          >
            <Icon
              name="heroicons:information-circle"
              class="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400"
            />

            <p
              class="text-xs leading-5 text-gray-500 dark:text-gray-400"
            >
              Your withdrawal will be sent to the bank account
              registered with your wallet.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex gap-3 border-t border-gray-200 p-5 dark:border-gray-800"
        >
          <button
            type="button"
            :disabled="loading"
            class="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="closeModal"
          >
            Cancel
          </button>

          <button
            type="button"
            :disabled="!canSubmit"
            class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            @click="submitWithdrawal"
          >
            <Icon
              v-if="loading"
              name="heroicons:arrow-path"
              class="h-4 w-4 animate-spin"
            />

            <Icon
              v-else
              name="heroicons:paper-airplane"
              class="h-4 w-4"
            />

            {{
              loading
                ? "Submitting..."
                : "Submit Request"
            }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>