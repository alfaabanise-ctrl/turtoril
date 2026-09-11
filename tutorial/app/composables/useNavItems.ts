import type { NavItem, UserRole } from '~/types/nav'

export const useNavItems = () => {
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-home',
      to: '/dashboard',
      roles: ['all'], // everyone sees this
    },
    {
      label: 'Students',
      icon: 'i-heroicons-academic-cap',
      to: '/students',
      roles: ['teacher', 'admin', 'superadmin'],
    },
    {
      label: 'Teachers',
      icon: 'i-heroicons-user-group',
      to: '/teachers',
      roles: ['admin', 'superadmin'],
    },
    {
      label: 'Admin Profile',
      icon: 'i-heroicons-identification',
      to: '/admin/profile',
      roles: ['admin', 'superadmin'],
    },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings',
      roles: ['all'], // everyone sees this
    },
    {
      label: 'All Admins',
      icon: 'i-heroicons-shield-check',
      to: '/admins',
      roles: ['superadmin'], // only super admin
    },
  ]

  const getVisibleItems = (role: UserRole): NavItem[] => {
    return navItems.filter(
      (item) => item.roles.includes('all') || item.roles.includes(role)
    )
  }

  return { navItems, getVisibleItems }
}