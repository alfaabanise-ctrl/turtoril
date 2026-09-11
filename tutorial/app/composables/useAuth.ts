// composables/useAuth.ts

export const useAuth = () => useState('auth', () => ({
  user: null,
  authenticated: false,
  checked: false,
  showLoginModal: false,
  serverError: false,
  csrfToken: null,
}))