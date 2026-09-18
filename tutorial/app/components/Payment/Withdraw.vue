<script setup lang="ts">
import { computed, onMounted, ref } from "vue"

const auth = useAuth()

/* --------------------------------------------------
 * STATE
 * -------------------------------------------------- */

const show = ref(false)
const loadingAccount = ref(false)
const submitting = ref(false)

const accountDetails = ref<any>(null)
const amount = ref("")

const errorMessage = ref("")
const successMessage = ref("")

/* --------------------------------------------------
 * EVENTS
 * -------------------------------------------------- */

const emit = defineEmits<{
  success: [response: any]
  error: [error: any]
  "edit-account": []
}>()

/* --------------------------------------------------
 * QUICK AMOUNTS
 * -------------------------------------------------- */

const quickAmount = [
  5000,
  10000,
  25000,
  50000,
  100000,
  250000,
]

/* --------------------------------------------------
 * MINIMUM WITHDRAWAL
 * -------------------------------------------------- */

const minimumWithdrawal = 5000

/* --------------------------------------------------
 * CURRENCY
 * -------------------------------------------------- */

const formatMoney = (value: unknown) => {
  const amountInKobo = Number(value || 0)

  return (amountInKobo / 100).toLocaleString(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    },
  )
}

/* --------------------------------------------------
 * GET WALLET BALANCE
 * -------------------------------------------------- */

const walletBalanceKobo = computed(() => {
  return Number(
    auth.value?.user?.wallet?.balance ||
      auth.value?.user?.wallet?.availableBalance ||
      0,
  )
})

const walletBalanceNaira = computed(() => {
  return Math.floor(
    walletBalanceKobo.value / 100,
  )
})

/* --------------------------------------------------
 * MAX WITHDRAWAL
 * -------------------------------------------------- */

const maxWithdrawal = computed(() => {
  return walletBalanceNaira.value
})

/* --------------------------------------------------
 * REMAINING BALANCE
 * -------------------------------------------------- */

const remainingBalance = computed(() => {
  const balance = walletBalanceKobo.value

  const withdrawal =
    Number(amount.value || 0) * 100

  return Math.max(
    balance - withdrawal,
    0,
  )
})

/* --------------------------------------------------
 * CHECK ACCOUNT
 * -------------------------------------------------- */

const hasAccount = computed(() => {
  return Boolean(
    accountDetails.value?.accountNumber,
  )
})

const accountIsPending = computed(() => {
  return (
    accountDetails.value?.status ===
    "PENDING"
  )
})

const accountIsRejected = computed(() => {
  return (
    accountDetails.value?.status ===
    "REJECTED"
  )
})

const accountIsApproved = computed(() => {
  return (
    accountDetails.value?.status ===
    "APPROVED"
  )
})

/* --------------------------------------------------
 * VALIDATION
 * -------------------------------------------------- */

const withdrawalAmount = computed(() => {
  return Number(amount.value || 0)
})

const canWithdraw = computed(() => {
  const value = withdrawalAmount.value

  return (
    !submitting.value &&
    hasAccount.value &&
    accountIsApproved.value &&
    value >= minimumWithdrawal &&
    value <= maxWithdrawal.value
  )
})

/* --------------------------------------------------
 * OPEN MODAL
 * -------------------------------------------------- */

const openWithdrawal = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  amount.value = ""

  show.value = true

  await loadBankAccount()
}

/* --------------------------------------------------
 * CLOSE MODAL
 * -------------------------------------------------- */

const close = () => {
  if (submitting.value) {
    return
  }

  show.value = false
  errorMessage.value = ""
  successMessage.value = ""
  amount.value = ""
}

/* --------------------------------------------------
 * SANITIZE AMOUNT
 * -------------------------------------------------- */

const sanitizeAmount = (
  event: Event,
) => {
  const input =
    event.target as HTMLInputElement

  let value =
    input.value.replace(/\D/g, "")

  value =
    value.replace(
      /^0+(?=\d)/,
      "",
    )

  let number =
    Number(value || 0)

  if (
    number >
    maxWithdrawal.value
  ) {
    number =
      maxWithdrawal.value
  }

  amount.value =
    number > 0
      ? String(number)
      : ""
}

/* --------------------------------------------------
 * SET QUICK AMOUNT
 * -------------------------------------------------- */

const setQuickAmount = (
  value: number,
) => {
  if (
    value > maxWithdrawal.value
  ) {
    amount.value =
      String(maxWithdrawal.value)
    return
  }

  amount.value =
    String(value)
}

/* --------------------------------------------------
 * LOAD BANK ACCOUNT
 * -------------------------------------------------- */

const loadBankAccount = async () => {
  loadingAccount.value = true

  try {
    const response =
      await useApiFetch(
        "/payout/bank-details",
        {
          method: "GET",
        },
      )

    console.log(
      "BANK ACCOUNT RESPONSE:",
      response,
    )

    if (
      !response?.success
    ) {
      accountDetails.value =
        null

      return
    }

    const data =
      response.data?.data ??
      response.data ??
      null

    accountDetails.value =
      data

  } catch (error) {
    console.error(
      "Unable to load bank account:",
      error,
    )

    accountDetails.value =
      null
  } finally {
    loadingAccount.value = false
  }
}

/* --------------------------------------------------
 * SUBMIT WITHDRAWAL
 * -------------------------------------------------- */

const submit = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  const nairaAmount =
    Number(amount.value || 0)

  /* ----------------------------------------------
   * VALIDATE BANK ACCOUNT
   * ---------------------------------------------- */

  if (!hasAccount.value) {
    errorMessage.value =
      "Please add a withdrawal bank account first."

    return
  }

  if (accountIsPending.value) {
    errorMessage.value =
      "Your bank account is still pending verification."

    return
  }

  if (accountIsRejected.value) {
    errorMessage.value =
      "Your bank account was rejected. Please update your bank account details."

    return
  }

  if (!accountIsApproved.value) {
    errorMessage.value =
      "Your bank account is not approved for withdrawal."

    return
  }

  /* ----------------------------------------------
   * VALIDATE AMOUNT
   * ---------------------------------------------- */

  if (
    !nairaAmount ||
    nairaAmount <= 0
  ) {
    errorMessage.value =
      "Please enter a withdrawal amount."

    return
  }

  if (
    nairaAmount <
    minimumWithdrawal
  ) {
    errorMessage.value =
      `Minimum withdrawal is ${formatMoney(
        minimumWithdrawal * 100,
      )}.`

    return
  }

  if (
    nairaAmount >
    maxWithdrawal.value
  ) {
    errorMessage.value =
      "Withdrawal amount cannot be greater than your available balance."

    return
  }

  /* ----------------------------------------------
   * CONVERT NAIRA TO KOBO
   * ---------------------------------------------- */

  const amountInKobo =
    Math.round(
      nairaAmount * 100,
    )

  submitting.value = true

  try {
    const response =
      await useApiFetch(
        "/admin/wallet/withdraw",
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

    if (
      !response?.success
    ) {
      throw new Error(
        response?.message ||
          "Unable to submit withdrawal request.",
      )
    }

    successMessage.value =
      response?.message ||
      "Withdrawal request submitted successfully."

    emit(
      "success",
      response,
    )

    /*
     * Refresh bank/account data
     * in case backend returns updated details.
     */
    await loadBankAccount()

    /*
     * Refresh auth user if your
     * auth composable supports it.
     */
    try {
      if (
        typeof auth.refresh ===
        "function"
      ) {
        await auth.refresh()
      }
    } catch {
      // Ignore auth refresh errors
    }

    setTimeout(() => {
      close()
    }, 1200)

  } catch (error: any) {
    console.error(
      "Withdrawal error:",
      error,
    )

    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to submit withdrawal request."

    emit(
      "error",
      error,
    )

  } finally {
    submitting.value = false
  }
}

/* --------------------------------------------------
 * INITIAL LOAD
 * -------------------------------------------------- */

onMounted(() => {
  loadBankAccount()
})
</script>

<template>
  <div>
  <!-- ==================================================
       OPEN WITHDRAWAL BUTTON
  =================================================== -->

  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
    @click="openWithdrawal"
  >
    <Icon
      name="heroicons:arrow-up-right"
      class="h-5 w-5"
    />

    Request Withdrawal
  </button>

  <!-- ==================================================
       MODAL
  =================================================== -->

  <Transition
    enter-active-class="duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-1 backdrop-blur-sm sm:p-4"
      @click.self="close"
    >
      <div
        class="h-[80%] w-full max-w-md overflow-y-auto overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900"
      >

        <!-- ==================================================
             HEADER
        =================================================== -->

        <div
          class="bg-primary px-2 py-5 text-white sm:px-6"
        >
          <div
            class="flex items-center justify-between"
          >
            <div>
              <h2 class="text-xl font-bold">
                Withdrawal Account
              </h2>

              <p
                class="text-sm text-indigo-100"
              >
                Withdraw directly to your linked bank account.
              </p>
            </div>

            <div
              class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl"
            >
              💼
            </div>
          </div>
        </div>

        <!-- ==================================================
             CONTENT
        =================================================== -->

        <div class="p-2 sm:p-6">

          <!-- Loading -->
          <div
            v-if="loadingAccount"
            class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div class="flex items-center gap-3">
              <Icon
                name="heroicons:arrow-path"
                class="h-5 w-5 animate-spin text-indigo-600"
              />

              <span
                class="text-sm text-gray-600 dark:text-gray-300"
              >
                Loading withdrawal account...
              </span>
            </div>
          </div>

          <!-- ==================================================
               NO ACCOUNT
          =================================================== -->

          <div
            v-else-if="!hasAccount"
            class="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4"
          >
            <p
              class="font-semibold text-blue-800"
            >
              No withdrawal account found.
            </p>

            <p
              class="mt-1 text-sm text-blue-700"
            >
              Please set up your bank account before requesting a withdrawal.
            </p>

            <button
              type="button"
              class="mt-3 text-sm font-semibold text-blue-700 underline"
              @click="emit('edit-account')"
            >
              Set up bank account
            </button>
          </div>

          <!-- ==================================================
               PENDING
          =================================================== -->

          <div
            v-else-if="accountIsPending"
            class="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4"
          >
            <p
              class="font-semibold text-yellow-800"
            >
              Bank account verification is pending.
            </p>

            <p
              class="mt-1 text-sm text-yellow-700"
            >
              Your bank account is currently under review. Withdrawals will be available once it has been approved.
            </p>
          </div>

          <!-- ==================================================
               REJECTED
          =================================================== -->

          <div
            v-else-if="accountIsRejected"
            class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p
              class="font-semibold text-red-800"
            >
              Bank account verification was rejected.
            </p>

            <p
              class="mt-1 text-sm text-red-700"
            >
              Please update your bank account details and submit them again for verification before you can withdraw funds.
            </p>
          </div>

          <!-- ==================================================
               BANK CARD
          =================================================== -->

          <div
            v-if="hasAccount"
            class="rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/50 sm:p-5"
          >
            <div class="space-y-4">

              <!-- Account Name -->
              <div
                class="flex items-start justify-between"
              >
                <div>
                  <p
                    class="text-xs text-gray-500 dark:text-gray-400"
                  >
                    Account Name
                  </p>

                  <h3
                    class="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {{
                      accountDetails?.accountName ||
                      "Not available"
                    }}
                  </h3>
                </div>

                <span
                  :class="[
                    'rounded-full px-3 py-1 text-xs font-semibold',

                    accountDetails?.status ===
                    'APPROVED'
                      ? 'bg-green-100 text-green-700'

                      : accountDetails?.status ===
                        'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'

                      : accountDetails?.status ===
                        'REJECTED'
                      ? 'bg-red-100 text-red-700'

                      : 'bg-gray-100 text-gray-700',
                  ]"
                >
                  {{
                    accountDetails?.status ||
                    "UNKNOWN"
                  }}
                </span>
              </div>

              <!-- Bank -->
              <div>
                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Bank
                </p>

                <p
                  class="text-md font-medium text-gray-900 dark:text-white"
                >
                  {{
                    accountDetails?.bankName ||
                    "Not available"
                  }}
                </p>
              </div>

              <!-- Account Number -->
              <div>
                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Account Number
                </p>

                <p
                  class="font-medium text-gray-900 dark:text-white"
                >
                  {{
                    accountDetails?.accountNumber ||
                    "Not available"
                  }}
                </p>
              </div>

              <!-- Balance -->
              <div
                class="border-t pt-2 dark:border-gray-700"
              >
                <p
                  class="text-xs text-gray-500 dark:text-gray-400"
                >
                  Available Balance
                </p>

                <h2
                  class="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                >
                  {{
                    formatMoney(
                      walletBalanceKobo,
                    )
                  }}
                </h2>
              </div>

            </div>
          </div>

          <!-- ==================================================
               AMOUNT
          =================================================== -->

          <div
            v-if="hasAccount"
            class="mt-6"
          >
            <label
              class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Withdrawal Amount
            </label>

            <div
              class="flex items-center rounded-xl border border-gray-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 dark:border-gray-700"
            >
              <span
                class="px-4 text-lg font-semibold text-gray-500"
              >
                ₦
              </span>

              <input
                :value="amount"
                type="text"
                inputmode="numeric"
                placeholder="0"
                :disabled="submitting"
                class="w-full py-3 pr-4 text-lg font-semibold outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-transparent dark:text-white"
                @input="sanitizeAmount"
              />
            </div>

            <div
              class="mt-2 flex items-center justify-between"
            >
              <span
                class="text-xs text-gray-500 dark:text-gray-400"
              >
                Minimum:
                {{ formatMoney(minimumWithdrawal * 100) }}
              </span>

              <span
                class="text-sm font-semibold"
                :class="
                  remainingBalance < 0
                    ? 'text-red-600'
                    : 'text-gray-500 dark:text-gray-400'
                "
              >
                Remaining
                {{
                  amount
                    ? formatMoney(
                        remainingBalance,
                      )
                    : "—"
                }}
              </span>
            </div>
          </div>

          <!-- ==================================================
               QUICK AMOUNTS
          =================================================== -->

          <div
            v-if="hasAccount"
            class="mt-5 grid grid-cols-3 gap-2"
          >
            <button
              v-for="item in quickAmount"
              :key="item"
              type="button"
              :disabled="
                submitting ||
                item > maxWithdrawal
              "
              class="rounded-xl border border-gray-200 py-2 text-sm font-medium transition hover:border-indigo-500 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-indigo-500/10"
              @click="setQuickAmount(item)"
            >
              ₦{{ item.toLocaleString() }}
            </button>
          </div>

          <!-- ==================================================
               ERROR
          =================================================== -->

          <div
            v-if="errorMessage"
            class="mt-5 rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <div class="flex gap-3">
              <Icon
                name="heroicons:exclamation-circle"
                class="h-5 w-5 shrink-0 text-red-600"
              />

              <p
                class="text-sm text-red-700"
              >
                {{ errorMessage }}
              </p>
            </div>
          </div>

          <!-- ==================================================
               SUCCESS
          =================================================== -->

          <div
            v-if="successMessage"
            class="mt-5 rounded-xl border border-green-200 bg-green-50 p-4"
          >
            <div class="flex gap-3">
              <Icon
                name="heroicons:check-circle"
                class="h-5 w-5 shrink-0 text-green-600"
              />

              <p
                class="text-sm text-green-700"
              >
                {{ successMessage }}
              </p>
            </div>
          </div>

          <!-- ==================================================
               BUTTONS
          =================================================== -->

          <div class="mt-6 space-y-3">

            <button
              type="button"
              :disabled="!canWithdraw"
              class="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
              @click="submit"
            >
              <span
                v-if="submitting"
                class="inline-flex items-center gap-2"
              >
                <Icon
                  name="heroicons:arrow-path"
                  class="h-5 w-5 animate-spin"
                />

                Submitting...
              </span>

              <span
                v-else
              >
                Withdraw Funds
              </span>
            </button>

            <button
              type="button"
              class="w-full rounded-xl border border-gray-300 py-3 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="emit('edit-account')"
            >
              Edit Bank Account
            </button>

            <button
              type="button"
              :disabled="submitting"
              class="w-full py-2 text-gray-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              @click="close"
            >
              Cancel
            </button>

          </div>

        </div>
      </div>
    </div>
  </Transition>
</div>
</template>