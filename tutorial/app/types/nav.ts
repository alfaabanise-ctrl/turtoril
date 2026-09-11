export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin'

export interface NavItem {
  label: string
  icon: string        // icon name (e.g. from heroicons/nuxt-icon)
  to: string           // route path
  roles: (UserRole | 'all')[]  // who can see this item
}