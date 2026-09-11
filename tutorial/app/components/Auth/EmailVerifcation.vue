<script setup>
import { ref } from 'vue'

import { useRuntimeConfig } from '#app'
import { useRouter } from 'vue-router'


const { $toast } = useNuxtApp()
const router = useRouter()
const auth = useAuth()

const props = defineProps({
  email: {
    type: String,
    required: true
  },

  redirect: {
    type: Boolean,
    default: true
  }
})

const config = useRuntimeConfig()

const loading = ref(false)
const code = ref(['', '', '', '', '', ''])
const message = ref('') // success or error message
const emit = defineEmits(['close'])
/* =============================
   Move cursor automatically
============================= */
const moveNext = (index, event) => {
  if (event.inputType === 'deleteContentBackward') {
    if (index > 0 && !code.value[index]) {
      document.querySelectorAll('.otp-input')[index - 1].focus()
    }
    return
  }

  if (code.value[index] && index < 5) {
    document.querySelectorAll('.otp-input')[index + 1].focus()
  }
}

/* =============================
   Allow paste full code
============================= */
const handlePaste = (event) => {
  const paste = event.clipboardData.getData('text').slice(0, 6)
  paste.split('').forEach((digit, i) => {
    code.value[i] = digit
  })
}

/* =============================
   Verify Code
============================= */
const verifyCode = async () => {
  const otp = code.value.join('')

  if (otp.length !== 6) {
    message.value = 'Please enter the 6 digit code'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`${config.public.api_url}/auth/verify-email`, {
      method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       credentials: 'include',
      body: JSON.stringify({
        email: props.email,
        code: otp
      })
    })

    const data = await response.json()

    if (!response.ok) {
     
      $toast.error(data.message || 'Registration failed')
      return
    }
    $toast.success(data.message || 'Email verified successfully')
    auth.value.user = data?.data || null
    auth.value.authenticated = true
    auth.value.checked = true
    auth.value.serverError = false
    auth.value.showLoginModal = false
    if(props.redirect){
    setTimeout(() => {
      console.log('otp processed');
      router.push('/user/dashboard')
    }, 800)
    
    }else{
      // emit event to parent to close modal
      emit('close')
    }
 
    // clear OTP
    code.value = ['', '', '', '', '', '']

  } catch (err) {
    console.error(err)
    message.value = 'Verification failed. Please try again'
  } finally {
    loading.value = false
  }
}

/* =============================
   Resend Code
============================= */
const resendCode = async () => {
  loading.value = true
  message.value = ''

  try {
    const response = await fetch(`${config.public.api_url}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: props.email })
    })

    const data = await response.json()

    if (!response.ok) {
        $toast.error(data.message || 'Registration failed')
     
      return
    }

    message.value = 'OTP sent successfully ✅'
    $toast.success(data.message || 'OTP sent successfully')
    // clear code
    code.value = ['', '', '', '', '', '']

  } catch (err) {
    console.error(err)
    message.value = 'Failed to resend OTP. Try again'
  } finally {
    loading.value = false
  }
}
</script>

<template>
<div class="max-w-md mx-auto h-fit bg-white p-8 rounded-lg shadow">

  <h2 class="text-xl font-semibold">
    Confirm your email
  </h2>

  <p class="text-gray-600 text-sm mt-1">
    Enter the verification code sent to:
  </p>

  <p class="text-sm font-medium underline mt-1 mb-4">
    {{ email }}
  </p>

  <form @submit.prevent="verifyCode" class="space-y-4">
    <!-- OTP INPUTS -->
    <div
      class="flex justify-center gap-3"
      @paste.prevent="handlePaste"
    >
      <input
        v-for="(digit, index) in code"
        :key="index"
        v-model="code[index]"
        maxlength="1"
        type="text"
        inputmode="numeric"
        class="otp-input w-12 h-12 border rounded text-center text-lg font-semibold focus:ring-2 focus:ring-black"
        @input="moveNext(index, $event)"
      />
    </div>

    <!-- Message -->
    <p v-if="message" class="text-center text-sm text-red-600">{{ message }}</p>

    <!-- Button -->
    <button
      :disabled="loading"
      class="w-full bg-slate-800 text-white py-2 text-sm font-medium hover:bg-slate-700 rounded transition disabled:opacity-60"
    >
      {{ loading ? 'Processing...' : 'Verify Email' }}
    </button>
  </form>

  <div class="text-xs text-gray-500 mt-4 text-right">
    Didn’t receive the code?
    <button
      @click="resendCode"
      class="underline ml-1"
    >
      Resend
    </button>
  </div>

</div>
</template>