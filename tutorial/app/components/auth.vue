<script setup>
// definePageMeta({
//   layout: 'main',
//   fixed: false
// })

import { ref, reactive, watch } from 'vue'
import { useRouter, useRoute, useRuntimeConfig } from '#app'

const { $toast } = useNuxtApp()
const auth = useAuth()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

/* =========================
   STATES
========================= */

const otpverify = ref(false)
// const password = ref('')
// const ispassword = ref(false)

const loading = ref(false)
const registerloading = ref(false)
const loginloading = ref(false)
const resetpassword = ref(false)
const isregisterpage = ref(false)
const loginWithGoogle = ref(false)
const registerData = reactive({
  full_name: '',
  email: '',
  password: '',
  confirm_pwd: '',
  phone: ''
})

const loginData = reactive({
  email: '',
  password: ''
})

/* =========================
   SYNC QUERY STATE
========================= */

const syncFromQuery = () => {
  resetpassword.value = route.query.forgetpage === 'true'
  isregisterpage.value = route.query.type === 'register-page'
}

syncFromQuery()

/* =========================
   REMOVE FORGET PAGE
========================= */

const handleforgetPage = () => {
  const newQuery = { ...route.query }
  delete newQuery.forgetpage
  router.replace({ query: newQuery })
}

/* =========================
   CHANGE LOGIN / REGISTER
========================= */

const handlechangepage = () => {
  const newQuery = { ...route.query }

  newQuery.type =
    newQuery.type === 'register-page'
      ? 'login-page'
      : 'register-page'

  router.replace({ query: newQuery })
}

/* =========================
   SHOW FORGET PAGE
========================= */

const showforgetPage = () => {
  const newQuery = { ...route.query }
  newQuery.forgetpage = 'true'
  router.replace({ query: newQuery })
}

/* =========================
   REGISTER USER
========================= */

const handleregister = async () => {

  registerloading.value = true

  try {
    /* Validate full name */
    const fullNameValid =
      registerData.full_name.trim().split(/\s+/).length >= 2

    if (!fullNameValid) {
      $toast.error('Invalid name. Please enter your full name')
      registerloading.value = false
      return
    }

    /* Validate password */
    if (registerData.password.length < 6) {
      $toast.error('Password must be at least 6 characters')
      registerloading.value = false
      return
    }

    /* Confirm password */
    // if (registerData.password !== registerData.confirm_pwd) {
    //   $toast.error('Passwords do not match')
    //   registerloading.value = false
    //   return
    // }

    /* API REQUEST */
    console.log( registerData.full_name.split(' ')[0], fullNameValid, fullNameValid[1]);
    
    const response = await fetch(`${config.public.api_url}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        firstName:  registerData.full_name.split(' ')[0],
        lastName: registerData.full_name.split(' ')[1],
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone
        
      })
    })

    const data = await response.json()

    if (!response.ok) {
      $toast.error(data.message || 'Registration failed')
     
        registerloading.value = false

      return
    }

    /* SUCCESS */

    $toast.success(data.message || 'Registration successful')
    console.log(data);
    
    setTimeout(() => {
      console.log('otp processed');
      
     otpverify.value = true
    }, 800)

  } catch (err) {
    console.error('Registration failed:', err)
    registerloading.value = false
    $toast.error(err.message || 'An error occurred')
  } finally {
    registerloading.value = false
  }
}

/* =========================
   Login USER
========================= */

const handlelogin = async () => {

  loginloading.value = true
  try {
    const response = await fetch(`${config.public.api_url}/auth/login/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        emaillOrPhone: loginData.email,
        pwd: loginData.password,
        
      })
    })

    const data = await response.json()

    if (!response.ok) {
      $toast.error(data.message || 'Login failed')
      
      
      if (response.status === 403) {
         otpverify.value = true
      }
        loginloading.value = false
        

      return
    }
    
     auth.value.user = data?.data || null
    auth.value.authenticated = true
    auth.value.checked = true
    auth.value.serverError = false
    /* SUCCESS */

    $toast.success(data.message || 'Login successful')
    
    
    setTimeout(() => {
      console.log('otp processed');
       router.push('/search')
    }, 800)

  } catch (err) {
    
    loginloading.value = false
    $toast.error(err.message || 'An error occurred')
  } finally {
    loginloading.value = false
  }
}

const handleloginwithGoogle = async () => {

  loginWithGoogle.value = true
  try {
    const response = await fetch(`${config.public.api_url}/auth/login/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      $toast.error(data.message || 'Login failed')
    
        

      return
    }

  
   
    console.log(data.url,'hhhh');
    
    
     window.location.href = data.url

  } catch (err) {
    
    loginWithGoogle.value = false
    $toast.error(err.message || 'An error occurred')
  } finally {
    loginWithGoogle.value = false
  }
}

/* =========================
   WATCH QUERY CHANGES
========================= */

watch(
  () => route.query,
  syncFromQuery,
  { deep: true }
)
</script>
<template>
  <div class="min-h-screen  bg-[url('/images/hero.jpg')] bg-no-repeat  bg-cover fr bg-gray-50 ">
  
    <div v-if="resetpassword" class="relative  z-50" >
     <Forgetpage @close="handleforgetPage" />
    </div>
   <div class=" w-full min-h-screen bg-no-repeat bg-cover  bg-top bg-[url('/images/hero-students.jpg')]   pb-6 l   bg-black/80 ">
      <div class=" w-full min-h-screen bg-no-repeat bg-co     pb-6 l   bg-black/80 ">
          
        
        <div class="  h-full flex justify-end bg  items-center ">
        <div v-if="!isregisterpage" class=" sm:max-w-xl  w-full px3 h-dvh  bg-white rounded-sm shadow-lg p-2 sm:p-8">
          <NavigationBackArrow/>
            <div  v-if="!otpverify" >
            <div class=" flex mb-3 justify-center it ">
              <NavigationLogo  />
            </div>
            

              <div class=" flex flex-col justify-center items-center">
                  
                <p class="text-xl font-semibold   ">
                  Sign in to your account
                  </p>
                  <p class=" mb-8 text-gray-600 text-sm">
                    Don’t have an account?  
                
                    <button @click="handlechangepage" class=" text-left  underline cursor-pointer  hover:text-primary text-sm ">
                      Join here
                    </button>
                    </p>
                </div>
            
            

              <!-- Form -->
              <form @submit.prevent="handlelogin"  class="space-y-7">

                <!-- Email -->
                <div >
                  <FormInput type="email"  v-model:inputValue="loginData.email" :usePlaceholder=true  label="username or email">
                      <template #prefix>
                      <Icon name="heroicons:user" class="w-5 h-5 text-gray-500" />
                      </template>
                  </FormInput>
                </div>

                <!-- passwords -->
                <div  class="">
                  <FormInput type="password" v-model:inputValue="loginData.password"  class=" "  label="Password"></FormInput>
                </div>
                

                <!-- Password -->
                

                <!-- Button -->
                <div >
                  <div class="">
                    <button :disabled="loginloading" @click="SubmiteEmail" class="w-full bg-slate-800 text-white py-2  text-sm  font-medium hover:bg-slate-600 rounded-sm transition disabled:opacity-60" >
                      {{ loginloading ? 'Logging in...' : 'Login ' }}
                    </button>
                  </div>

                
                  
                    
                        <div class=" flex justify-end w-full ">
                          <button type="button" @click="showforgetPage" class=" text-left text-sm text-blue-600">
                            Forgot password?
                          </button>
                        </div>
                  </div> 
                <div>

                
                <div class=" p">
                    <div class=" w-full flex justify-center -top-1.5 relative">
                        <UiTypographyP class=" text-center h-1 px-3 w-fit bg-white r">  <span class=" bg-white h-6 w-20 "> or</span> </UiTypographyP>
                    </div>
                    <div class=" w-full  h-[1px] bg-slate-300"></div>
                </div>
                  <button type="button" @click="handleloginwithGoogle"
                  
                    class="w-full bg-blue-600 gap-3 flex justify-center items-center mt-4 px-5 text-white py-2 rounded-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
                  >
                  <Icon name="logos:google-icon" class="w-5 h-5 bg-white rounded-full p-0.5" />
                    {{ loginWithGoogle? `loading....`: ' Google'}} 
                  </button>
                </div>  
              </form>

            

              <!-- Links -->
              <div class="text-center text-sm mt-2 space-y-2">
                <p>
                  Don't have account?
                  <button @click="handlechangepage" class="text-blue-600 font-semibold">
                    Sign up
                  </button>
                </p>
              </div>
            </div>

            <div v-if="otpverify" class="  sm:max-w-xl  w-full px3  min-h-screen flex justify-center    items-center " >
              <AuthEmailVerifcation :email=" loginData.email " />
            </div>
        </div>

        <div v-if="isregisterpage" class=" sm:max-w-xl  h-dvh   w-full px3  p-2 sm:p-8 bg-white rounded-sm shadow-lg ">
          <NavigationBackArrow/>
          <div v-if="!otpverify" class="">
                

            <div class=" flex justify-center items-center  flex-col">
              <div class=" flex mb-3 justify-center ">
              <NavigationLogo />
            </div>

                <p class="text-xl font-semibold   ">
                  Create a new account
                </p>
                  <p class=" mb-8 text-gray-600 text-sm">
                Already have an account? 
                
                <button @click="handlechangepage" class=" text-left  underline cursor-pointer  hover:text-primary text-sm ">
                      Sign in
                    </button>
              </p>
            </div>
          
            

              <!-- Form -->
              <form @submit.prevent="handleregister(1)" class="space-y-7">
                <div  class="">
                  
                  <FormInput  type="text" v-model:inputValue="registerData.full_name"  :required="true" :usePlaceholder=true   class=" "  label="Full name">
                      <template #prefix>
                    <Icon name="heroicons:user"  class="w-5 h-5 text-gray-500"/>
                      </template>
                  </FormInput>
                </div>
              
                <!-- Email -->
                <div >
                  <FormInput type="email" :required="true" v-model:inputValue="registerData.email"  :usePlaceholder=true  label="email">
                      <template #prefix>
                    <Icon   name="heroicons:envelope" class="w-5 h-5 text-gray-500"/>
                      </template>
                  </FormInput>
                </div>
                <div >
                  <FormInput type="email" :required="true" v-model:inputValue="registerData.phone"  :usePlaceholder=true  label="Phone No:">
                      <template #prefix>
                      <Icon  name="heroicons:device-phone-mobile"  class="w-5 h-5 text-gray-500" />
                      </template>
                  </FormInput>
                </div>
                <!-- passwords -->
                
                <div  class="">
                  <FormInput type="password" v-model:inputValue="registerData.password"   class=" "  label="Password"></FormInput>
                </div>
                
                

                <!-- Password -->
                

                <!-- Button -->
                <div >
                  <div  class="">
                    <button :disabled="registerloading" :loading="registerloading" class="w-full bg-slate-800 text-white py-2  text-sm  font-medium hover:bg-slate-600 rounded-sm transition disabled:opacity-60" >
                      {{ registerloading ? 'Creating account...' : 'Sign up' }}
                    </button>
                  </div>
                
                
                  
                    
                        
                  </div> 
                <div>

                
                <div class=" p">
                    <div class=" w-full flex justify-center -top-1.5 relative">
                        <UiTypographyP class=" text-center h-1 px-3 w-fit bg-white r">  <span class=" bg-white h-6 w-20 "> or</span> </UiTypographyP>
                    </div>
                    <div class=" w-full  h-[1px] bg-slate-300"></div>
                </div>
                  <button type="button" @click="handleloginwithGoogle"
                  
                    class="w-full bg-blue-600 gap-3 flex justify-center items-center mt-4 px-5 text-white py-2 rounded-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
                  >
                  <Icon name="logos:google-icon" class="w-5 h-5 bg-white rounded-full p-0.5" />
                    {{ loginWithGoogle? `loading....`: ' Google'}} 
                  </button>
                </div>  
              </form>

            

              <!-- Links -->
              <div class=" text-sm mt-2 space-y-2">
                <div class="  flex  text-[12px] mt-1  justify-end w-full ">
                          By joining, you agree to the Abanise Terms of Service and to occasionally receive emails from us. Please read our Privacy Policy to learn how we use your personal data.
                  </div>
              </div>
          </div>

        <div v-if="otpverify" class="  sm:max-w-xl  w-full px3  min-h-screen flex justify-center    items-center ">
        <AuthEmailVerifcation :email=" registerData.email " />
        </div>
          <!-- Title -->
        

        </div>
      </div>

      </div>
    </div>
  </div>
</template>