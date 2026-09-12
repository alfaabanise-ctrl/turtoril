import type { NavItem, UserRole } from '~/types/nav'

export const useNavItems = () => {
  const navItems: NavItem[] = [

    /// super admine 
    {
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/super-admin',
      roles: ['superadmin'],
    },
    {
      label: 'Admins',
      icon: 'i-heroicons-shield-check',
      to: '/super-admin/admins',
      roles: ['superadmin'],
    },
    {
      label: 'Teachers',
      icon: 'i-heroicons-user-group',
      to: '/super-admin/teachers',
      roles: ['superadmin'],
    },
    {
      label: 'Students',
      icon: 'i-heroicons-academic-cap',
      to: '/super-admin/students',
      roles: ['superadmin'],
    },
    {
      label: 'Subscriptions',
      icon: 'i-heroicons-rectangle-stack',
      to: '/super-admin/subscriptions',
      roles: ['superadmin'],
    },
    {
      label: 'Payments',
      icon: 'i-heroicons-banknotes',
      to: '/super-admin/payments',
      roles: ['superadmin'],
    },
    {
      label: 'Wallets',
      icon: 'i-heroicons-wallet',
      to: '/super-admin/wallets',
      roles: ['superadmin'],
    },
    {
      label: 'Reports',
      icon: 'i-heroicons-chart-bar-square',
      to: '/super-admin/reports',
      roles: ['superadmin'],
    },



    {
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/admin',
      roles: ['admin'],
    },
    {
      label: 'Teachers',
      icon: 'i-heroicons-user-group',
      to: '/admin/teachers',
      roles: ['admin'],
    },
    {
      label: 'Students',
      icon: 'i-heroicons-academic-cap',
      to: '/admin/students',
      roles: ['admin'],
    },
    {
      label: 'Subscriptions',
      icon: 'i-heroicons-rectangle-stack',
      to: '/admin/subscriptions',
      roles: ['admin'],
    },
    {
      label: 'Payments',
      icon: 'i-heroicons-banknotes',
      to: '/admin/payments',
      roles: ['admin'],
    },
    {
      label: 'Wallet',
      icon: 'i-heroicons-wallet',
      to: '/admin/wallet',
      roles: ['admin'],
    },
    {
      label: 'Reports',
      icon: 'i-heroicons-chart-bar-square',
      to: '/admin/reports',
      roles: ['admin'],
    },


      {
    label: 'Dashboard',
    icon: 'i-heroicons-squares-2x2',
    to: '/teacher',
    roles: ['teacher'],
  },

  {
    label: 'Students',
    icon: 'i-heroicons-user-group',
    to: '/teacher/students',
    roles: ['teacher'],
  },

  {
    label: 'Performance',
    icon: 'i-heroicons-chart-bar-square',
    to: '/teacher/performance',
    roles: ['teacher'],
  },

  {
    label: 'Reports',
    icon: 'i-heroicons-document-chart-bar',
    to: '/teacher/reports',
    roles: ['teacher'],
  },

  {
    label: 'Access',
    icon: 'i-heroicons-key',
    to: '/teacher/access',
    roles: ['teacher'],
  },

  {
    label: 'Payments',
    icon: 'i-heroicons-banknotes',
    to: '/teacher/payments',
    roles: ['teacher'],
  },

  {
    label: 'Wallet',
    icon: 'i-heroicons-wallet',
    to: '/teacher/wallet',
    roles: ['teacher'],
  },

  {
    label: 'Referrals',
    icon: 'i-heroicons-user-plus',
    to: '/teacher/referrals',
    roles: ['teacher'],
  },

  {
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/teacher/profile',
    roles: ['teacher'],
  },

  ]

  const getVisibleItems = (role: UserRole): NavItem[] => {
    return navItems.filter(
      (item) => item.roles.includes('all') || item.roles.includes(role)
    )
  }

  return { navItems, getVisibleItems }
}