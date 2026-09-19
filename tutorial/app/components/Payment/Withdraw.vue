<script setup lang="ts">
import { computed, ref } from "vue"


/* --------------------------------------------------
 * STATE
 * -------------------------------------------------- */

const open = ref(false)
const loading = ref(false)
const fetchingWallet = ref(false)

const amount = ref<number | null>(null)

const balance = ref(0)

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
 * CONSTANTS
 * -------------------------------------------------- */

const minimumWithdrawal = 2000

const withdrawalEndpoint =
  "/wallet/withdraw"


/* --------------------------------------------------
 * HELPERS
 * -------------------------------------------------- */

const nairaToKobo = (value: number) => {
  return Math.round(value * 100)
}


/* --------------------------------------------------
 * AMOUNT
 * -------------------------------------------------- */

const enteredAmount = computed(() => {
  const value = Number(amount.value)

  return Number.isFinite(value)
    ? value
    : 0
})


const canSubmit = computed(() => {
  return (
    !loading.value &&
    !fetchingWallet.value &&
    enteredAmount.value >= minimumWithdrawal &&
    enteredAmount.value <= balance.value
  )
})


/* --------------------------------------------------
 * FETCH WALLET
 * -------------------------------------------------- */

const fetchWallet = async () => {
  fetchingWallet.value = true
  errorMessage.value = ""

  try {
    const response = await useApiFetch(
      "/admin/wallet",
      {
        method: "GET",
      },
    )

    console.log(
      "WALLET RESPONSE:",
      response,
    )


    if (!response?.success) {
      throw new Error(
        response?.message ||
        response?.error ||
        "Unable to load wallet balance.",
      )
    }


    /*
     * Supports response like:
     *
     * {
     *   success: true,
     *   data: {
     *     wallet: {
     *       availableBalance: 500000
     *     }
     *   }
     * }
     *
     * OR
     *
     * {
     *   success: true,
     *   wallet: {
     *     availableBalance: 500000
     *   }
     * }
     */

    const wallet =
      response?.data?.wallet ||
      response?.wallet ||
      response?.data


    /*
     * Backend stores money in KOBO.
     *
     * Convert Kobo → Naira for display.
     */
    const availableBalance =
      Number(
        wallet?.availableBalance ?? 0,
      )


    balance.value =
      availableBalance / 100


  } catch (error: any) {
    console.error(
      "WALLET FETCH ERROR:",
      error,
    )

    errorMessage.value =
      error?.data?.message ||
      error?.data?.error ||
      error?.message ||
      "Unable to load wallet balance."

  } finally {
    fetchingWallet.value = false
  }
}


/* --------------------------------------------------
 * OPEN MODAL
 * -------------------------------------------------- */

const openModal = async () => {
  open.value = true

  amount.value = null

  errorMessage.value = ""

  successMessage.value = ""

  await fetchWallet()
}


/* --------------------------------------------------
 * CLOSE MODAL
 * -------------------------------------------------- */

const closeModal = () => {
  if (loading.value) {
    return
  }

  open.value = false

  amount.value = null

  errorMessage.value = ""

  successMessage.value = ""
}


/* --------------------------------------------------
 * USE ALL BALANCE
 * -------------------------------------------------- */

const useAllBalance = () => {
  if (loading.value) {
    return
  }

  amount.value = balance.value
}


/* --------------------------------------------------
 * SUBMIT WITHDRAWAL
 * -------------------------------------------------- */

const submitWithdrawal = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  const withdrawalAmount =
    enteredAmount.value


  /* ----------------------------------------------
   * VALIDATE
   * ---------------------------------------------- */

  if (!withdrawalAmount) {
    errorMessage.value =
      "Please enter a withdrawal amount."

    return
  }


  if (
    withdrawalAmount >
    minimumWithdrawal
  ) {
    errorMessage.value =
      `Minimum withdrawal is ${currency.format(
        minimumWithdrawal,
      )}.`

    return
  }


  if (
    withdrawalAmount >
    balance.value
  ) {
    errorMessage.value =
      "Withdrawal amount cannot be greater than your available balance."

    return
  }


  /* ----------------------------------------------
   * NAIRA → KOBO
   * ---------------------------------------------- */

  const amountInKobo =
    nairaToKobo(withdrawalAmount)


  loading.value = true


  try {

    /* --------------------------------------------
     * API
     * -------------------------------------------- */

    const response =
      await useApiFetch(
        withdrawalEndpoint,
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


    /* --------------------------------------------
     * CHECK RESPONSE
     * -------------------------------------------- */

    if (!response) {
      throw new Error(
        "No response received from server.",
      )
    }


    if (!response.success) {
      throw new Error(
        response.message ||
        response.error ||
        "Unable to submit withdrawal request.",
      )
    }


    /* --------------------------------------------
     * SUCCESS
     * -------------------------------------------- */

    successMessage.value =
      response.message ||
      "Withdrawal request submitted successfully."


    /*
     * Refresh wallet immediately.
     *
     * Backend has already reserved
     * the money.
     */
    await fetchWallet()


    /*
     * Clear amount
     */
    amount.value = null


    /*
     * Close after a moment
     */
    setTimeout(() => {
      if (!loading.value) {
        closeModal()
      }
    }, 1500)


  } catch (error: any) {

    console.error(
      "WITHDRAWAL ERROR:",
      error,
    )


    errorMessage.value =
      error?.data?.message ||
      error?.data?.error ||
      error?.message ||
      "Unable to submit withdrawal request."


  } finally {
    loading.value = false
  }
}
</script>


<template>

  <!-- ==================================================
       OPEN BUTTON
  =================================================== -->
<div>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
    @click="openModal"
  >
    <Icon
      name="heroicons:banknotes"
      class="h-5 w-5"
    />

    Request Withdrawal
  </button>


  <!-- ==================================================
       MODAL
  =================================================== -->

  <Teleport to="body">

    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >

      <div
        class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
      >

        <!-- ============================================
             HEADER
        ============================================= -->

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


        <!-- ============================================
             BODY
        ============================================= -->

        <div
          class="space-y-5 p-5"
        >

          <!-- ==========================================
               LOADING WALLET
          =========================================== -->

          <div
            v-if="fetchingWallet"
            class="flex items-center justify-center rounded-xl bg-gray-50 p-6 dark:bg-gray-800/50"
          >

            <div
              class="flex items-center gap-3 text-sm text-gray-500"
            >

              <Icon
                name="heroicons:arrow-path"
                class="h-5 w-5 animate-spin"
              />

              Loading wallet balance...

            </div>

          </div>


          <!-- ==========================================
               AVAILABLE BALANCE
          =========================================== -->

          <div
            v-else
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


          <!-- ==========================================
               AMOUNT
          =========================================== -->

          <div>

            <label
              for="withdrawal-amount"
              class="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Withdrawal Amount
            </label>


            <div
              class="relative"
            >

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
                :disabled="
                  loading ||
                  fetchingWallet
                "
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
                :disabled="
                  loading ||
                  fetchingWallet ||
                  balance <= 0
                "
                class="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 dark:text-indigo-400"
                @click="useAllBalance"
              >
                Use all
              </button>

            </div>

          </div>


          <!-- ==========================================
               PREVIEW
          =========================================== -->

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


          <!-- ==========================================
               ERROR
          =========================================== -->

          <div
            v-if="errorMessage"
            class="flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400"
          >

            <Icon
              name="heroicons:exclamation-circle"
              class="mt-0.5 h-5 w-5 shrink-0"
            />


            <p>
              {{ errorMessage }}
            </p>

          </div>


          <!-- ==========================================
               SUCCESS
          =========================================== -->

          <div
            v-if="successMessage"
            class="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          >

            <Icon
              name="heroicons:check-circle"
              class="mt-0.5 h-5 w-5 shrink-0"
            />


            <p>
              {{ successMessage }}
            </p>

          </div>


          <!-- ==========================================
               INFORMATION
          =========================================== -->

          <div
            class="flex gap-3 hidden rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50"
          >

            <Icon
              name="heroicons:information-circle"
              class="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400"
            />


            <!-- <p
              class="text-xs leading-5 text-gray-500 dark:text-gray-400"
            >
              Your withdrawal will be sent to the bank
              account registered with your wallet. Your
              request will first be reviewed by the Super Admin.
            </p> -->

          </div>

        </div>


        <!-- ============================================
             FOOTER
        ============================================= -->

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
            class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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
</div>
</template>