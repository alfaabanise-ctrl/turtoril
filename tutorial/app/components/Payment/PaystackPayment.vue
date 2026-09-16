<script setup lang="ts">
interface Props {
  amount: number
  email: string
  paymentPurpose?: string
  metadata?: Record<string, any>
  label?: string
  loadingLabel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  paymentPurpose: "PIN_PURCHASE",
  metadata: () => ({}),
  label: "Pay Now",
  loadingLabel: "Processing...",
  disabled: false,
})

const emit = defineEmits<{
  success: [payment: any]
  cancel: []
  error: [error: any]
  initialized: [payment: any]
}>()

const { pay } = usePaystack()

const processing = ref(false)
const errorMessage = ref("")

const startPayment = async () => {
  if (processing.value || props.disabled) return

  processing.value = true
  errorMessage.value = ""

  try {
    // ------------------------------------------------------------
    // 1. INITIALIZE PAYMENT (server generates txRef, amount, etc.)
    // ------------------------------------------------------------
    const response = await useApiFetch("/payments/initialize", {
      method: "POST",
      body: {
        amount: props.amount,
        email: props.email,
        paymentPurpose: props.paymentPurpose,
        metadata: props.metadata,
      },
    })

    if (!response?.success) {
      throw new Error(
        response?.message || "Unable to initialize payment."
      )
    }

    const data = response.data?.data ?? response.data
    const payment = data?.payment ?? data

    // ------------------------------------------------------------
    // 2. VALIDATE SERVER RESPONSE
    // ------------------------------------------------------------
    if (!payment?.txRef && !payment?.reference) {
      throw new Error("Payment reference was not returned.")
    }

    const reference = payment.txRef ?? payment.reference

    const amountInKobo = Number(payment.amount)

    if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
      throw new Error("Invalid payment amount.")
    }

    const customerEmail =
      payment?.email ||
      data?.email ||
      data?.payer?.email ||
      props.email

    if (!customerEmail) {
      throw new Error("Customer email is required.")
    }

    emit("initialized", payment)

    // ------------------------------------------------------------
    // 3. OPEN PAYSTACK
    //    Paystack inline expects amount in KOBO.
    // ------------------------------------------------------------
    await pay({
      email: customerEmail,
      amount: amountInKobo, // kobo — straight from server
      reference,
      metadata: {
        ...props.metadata,
        paymentId: payment._id || payment.id,
        paymentPurpose: props.paymentPurpose,
      },

      async onSuccess(transaction) {
        try {
          // ------------------------------------------------------------
          // 4. VERIFY PAYMENT ON SERVER
          // ------------------------------------------------------------
          const verification = await useApiFetch("/payments/verify", {
            method: "POST",
            body: { ref: transaction.reference },
          })

          if (!verification?.success) {
            throw new Error(
              verification?.message || "Payment verification failed."
            )
          }

          emit("success", verification.data)
        } catch (error: any) {
          console.error("Verification error:", error)

          errorMessage.value =
            error?.data?.message ||
            error?.message ||
            "Unable to verify payment."

          emit("error", error)
        } finally {
          processing.value = false
        }
      },

      onCancel() {
        processing.value = false
        emit("cancel")
      },
    })
  } catch (error: any) {
    console.error("Payment error:", error)

    errorMessage.value =
      error?.data?.message ||
      error?.message ||
      "Unable to process payment."

    emit("error", error)
    processing.value = false
  }
}
</script>

<template>
  <div>
    <button
      type="button"
      :disabled="props.disabled || processing"
      class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      @click="startPayment"
    >
      <Icon
        v-if="processing"
        name="heroicons:arrow-path"
        class="h-4 w-4 animate-spin"
      />

      <Icon
        v-else
        name="heroicons:credit-card"
        class="h-4 w-4"
      />

      {{ processing ? props.loadingLabel : props.label }}
    </button>

    <p
      v-if="errorMessage"
      class="mt-2 text-sm text-red-600 dark:text-red-400"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>