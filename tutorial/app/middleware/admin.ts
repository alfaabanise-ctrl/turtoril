import type { AuthUser } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  const config = useRuntimeConfig()

  if (!auth.value.checked) {
    try {
      const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined
      const response = await $fetch<{
        success: boolean
        data?: AuthUser
      }>(`${config.public.apiUrl}/auth/protected`, {
        credentials: 'include',
        headers,
        timeout: 8000,
        retry: 0,
      })

      auth.value.user = response.data || null
      auth.value.authenticated = Boolean(response.data)
      auth.value.serverError = false
    } catch {
      auth.value.user = null
      auth.value.authenticated = false
      auth.value.serverError = false
    } finally {
      auth.value.checked = true
    }
  }

  if (!auth.value.authenticated) {
    return navigateTo('/auth')
  }

  const user = auth.value.user
  if (!user || !['admin', 'superadmin'].includes(user.role || '')) {
    return navigateTo('/')
  }
})
