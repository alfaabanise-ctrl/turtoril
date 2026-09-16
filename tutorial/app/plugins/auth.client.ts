export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
   const route = useRoute()
  const auth = useAuth()

  // Don't run on the home page
  if (route.path === '/') {
    auth.value.checked = true
    return
  }
  // Skip all routes inside /ogimage
if (route.path.startsWith('/ogProfile')) {
  auth.value.checked = true
  return
}

  if (auth.value.checked) return

  try {
    const headers = process.server
      ? useRequestHeaders(['cookie'])
      : undefined

    const response = await $fetch(
      `${config.public.apiUrl}/auth/protected`,
      {
        credentials: 'include',
        headers,
        timeout: 8000,
        retry: 0,
      }
    )

    auth.value.user = response?.data || null
    auth.value.authenticated = true
    console.log(auth.value);
    
    auth.value.serverError = false

  } catch (error: any) {

    // 👇 IMPORTANT: handle 401 separately
    if (error?.statusCode === 401) {
      auth.value.user = null
      auth.value.authenticated = false
      auth.value.serverError = false
    } else {
      // real server issue (Render sleep, network, etc)
      auth.value.serverError = true

      // DO NOT break app flow
      auth.value.user = null
      auth.value.authenticated = false
    }

  } finally {
    auth.value.checked = true
  }
})