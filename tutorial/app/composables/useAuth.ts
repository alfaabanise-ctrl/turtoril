// composables/useAuth.ts

import type { UserRole } from '~/types/nav'

export interface AuthUser {
  _id?: string
  role?: UserRole
  firstName?: string
  lastName?: string | null
  email?: string
  avatar?: string | null
  [key: string]: unknown
}

interface AuthState {
  user: AuthUser | null
  authenticated: boolean
  checked: boolean
  LoginModal: boolean
  serverError: boolean
  csrfToken: string | null
}

export const useAuth = () =>
  useState<AuthState>('auth', () => ({
    user: null,
    authenticated: false,
    checked: false,
    LoginModal: false,
    serverError: false,
    csrfToken: null,
  }))