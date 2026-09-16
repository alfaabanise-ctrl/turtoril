// composables/usePaystack.js

export const usePaystack = () => {
  /**
   * Open Paystack inline checkout.
   * @param {Object} opts
   * @param {string} opts.email
   * @param {number} opts.amount   - amount in KOBO (smallest unit)
   * @param {string} opts.reference
   * @param {Object} [opts.metadata]
   * @param {(tx: any) => void} [opts.onSuccess]
   * @param {() => void} [opts.onCancel]
   */
  const pay = async ({
    email,
    amount,
    reference,
    metadata = {},
    onSuccess,
    onCancel,
  }) => {
    // Browser only
    if (!import.meta.client) return

    const { default: PaystackPop } = await import("@paystack/inline-js")

    return new Promise((resolve, reject) => {
      const popup = new PaystackPop()

      popup.newTransaction({
        key: useRuntimeConfig().public.paystackPublicKey,
        email,
        amount, // KOBO
        reference,
        metadata,

        async onSuccess(transaction) {
          try {
            await onSuccess?.(transaction)
            resolve(transaction)
          } catch (err) {
            reject(err)
          }
        },

        onCancel() {
          onCancel?.()
          resolve(null)
        },

        onError(error) {
          reject(error)
        },
      })
    })
  }

  return { pay }
}