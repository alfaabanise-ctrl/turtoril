// composables/usePaystack.js

export const usePaystack = () => {

  const pay = async ({
    email,
    amount,
    reference,
    metadata = {},
    onSuccess,
    onCancel
  }) => {

    // Browser only
    if (!import.meta.client) return;

    const { default: PaystackPop } = await import("@paystack/inline-js");

    const popup = new PaystackPop();
  
    popup.newTransaction({
      key: useRuntimeConfig().public.paystackPublicKey,

      email,
      amount:  amount,
      reference,
      metadata,

      onSuccess(transaction) {
        onSuccess?.(transaction);
      },

      onCancel() {
        onCancel?.();
      }
    });

  };

  return { pay };

};