<script setup>



import { ref } from 'vue'


const { $toast } = useNuxtApp()
const config = useRuntimeConfig()



const email = ref('')
const loading = ref(false)
const emit = defineEmits(['close'])


const cancelPage = () => {
  emit('close')
}

const submitForm = async () => {
  if (!email.value) {
    $toast.error('Please enter your email address')
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${config.public.apiUrl}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (!response.ok) {
      $toast.error(data.message || 'Failed to send reset link')
      return
    }

    $toast.success(data.message || 'Reset link sent successfully')
    cancelPage()
  } catch (err) {
    $toast.error(err.message || 'An error occurred')
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <div class="min-h-screen  fixed inset-0 z-30 backdrop-blur-sm ">
   
    <div class=" w-full min-h-screen fixed flex justify-center pt-28  pb-6 l  px-4 bg-black/40 ">

    
      
      <div class="w-full max-w-md  pt-7 bg-white rounded-xl shadow-lg p-8">
        <button  type="button" @click="cancelPage" class="flex gap-1 text-lg font items-center">
            <Icon name="heroicons:arrow-left" class="w-5 h-5" /> <p class="font-medium text-md">Back</p>
        </button>
        <!-- Title -->
        <p class="text-xl font-semibold pt-10  ">
       Reset password
        </p>
        <P class=" md:w-3/4 w-full mb-8 text-gray-600 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </P>

        <!-- Form -->
        <form  @submit.prevent="submitForm"  class="space-y-7">

          <!-- Email -->
          <div >
            <FormInput type="email"  v-model:inputValue="email"  :usePlaceholder=true  label="Email">
                <template #prefix>
                <Icon name="heroicons:envelope" class="w-5 h-5 text-gray-500" />
                </template>
            </FormInput>
          </div>

          <!-- passwords -->
          
          

          <!-- Password -->
          

          <!-- Button -->
          <div >
           
            <div>
              <button  :disabled="loading"  class="w-full mt-5 bg-slate-800 text-white py-2  text-sm  font-medium hover:bg-slate-600 rounded-sm transition disabled:opacity-60" >
                {{ loading ? 'loading....' : 'Reset password' }}
              </button>
            </div>
          
            
              
                  
            </div> 
          <div>

          
          
           
          </div>  
        </form>

      

        <!-- Links -->
       

      </div>
    </div>
  </div>
</template>