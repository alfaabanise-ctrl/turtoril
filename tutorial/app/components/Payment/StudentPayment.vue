```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
```vue
<script setup>
const props = defineProps({
  email: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  reference: {
    type: String,
    required: true
  },

  metadata: {
    type: Object,
    default: () => ({})
  },

  buttonText: {
    type: String,
    default: "Pay with Paystack"
  },

  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "success",
  "cancel",
  "error"
]);

const { pay } = usePaystack();

const loading = ref(false);

const startPayment = async () => {
  if (loading.value || props.disabled) return;

  loading.value = true;

  try {
    await pay({
      email: props.email,
      amount: props.amount,
      reference: props.reference,
      metadata: props.metadata,

      onSuccess: (transaction) => {
        loading.value = false;
        emit("success", transaction);
      },

      onCancel: () => {
        loading.value = false;
        emit("cancel");
      }
    });
  } catch (error) {
    loading.value = false;
    emit("error", error);
    console.error("Paystack payment error:", error);
  }
};
</script>

<template>
  <button
    type="button"
    :disabled="disabled || loading"
    class="paystack-button"
    @click="startPayment"
  >
    <span v-if="loading">
      Processing...
    </span>

    <span v-else>
      {{ buttonText }}
    </span>
  </button>
</template>

<style scoped>
.paystack-button {
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: #00c3a5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.paystack-button:hover:not(:disabled) {
  background: #00a98f;
}

.paystack-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

### Your `usePaystack.js`

Your composable is basically correct. I would make one small improvement: convert the amount to the value Paystack expects. Paystack Inline typically expects the amount in the currency's **smallest unit** (for NGN, kobo).

```js
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

    const { default: PaystackPop } =
      await import("@paystack/inline-js");

    const config = useRuntimeConfig();

    const popup = new PaystackPop();

    popup.newTransaction({
      key: config.public.paystackPublicKey,

      email,

      // NGN 5,000 => 500000 kobo
      amount: Math.round(Number(amount) * 100),

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

  return {
    pay
  };
};
```

### Use the component

For example:

```vue
<PaystackPayment
  email="student@example.com"
  :amount="5000"
  reference="PAY-20260915-001"
  :metadata="{
    studentId: '12345',
    paymentType: 'school-fee'
  }"
  button-text="Pay ₦5,000"
  @success="handlePaymentSuccess"
  @cancel="handlePaymentCancel"
  @error="handlePaymentError"
/>
```

Then in your page:

```vue
<script setup>
const handlePaymentSuccess = (transaction) => {
  console.log("Payment successful:", transaction);

  // Call your backend here to verify payment
};

const handlePaymentCancel = () => {
  console.log("Payment cancelled");
};

const handlePaymentError = (error) => {
  console.error("Payment failed:", error);
};
</script>
```

The flow becomes:

**Your button → Paystack Inline popup/template → payment → `success` event → backend verification.**

One important point: **do not rely on the frontend `onSuccess` alone to mark a payment as successful.** Your backend should verify the Paystack transaction before updating your payment record.
