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
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/teacher',
      roles: ['teacher'],
    },

    {
      label: 'Students',
      icon: 'i-heroicons-users',
      to: '/teacher/students',
      roles: ['teacher'],
    },

    {
      label: 'Payments',
      icon: 'i-heroicons-banknotes',
      to: '/payments',
      roles: ['admin', 'teacher'],
    },
    {
      label: 'Wallet',
      icon: 'i-heroicons-wallet',
      to: '/wallet',
      roles: ['admin', 'teacher'],
    },










    {
      label: "Dashboard",
      icon: "heroicons:squares-2x2",
      to: "/student",
      roles: ["student"],
    },
    {
      label: "Subscription",
      icon: "heroicons:credit-card",
      to: "/student/subscription",
      roles: ["student"],
    },
    {
      label: "Payments",
      icon: "heroicons:banknotes",
      to: "/student/payments",
      roles: ["student"],
    },







    {
      label: "Settings",
      icon: "heroicons:cog-6-tooth",
      to: "/settings",
      roles: ["student", "teacher", "admin"]
    }
  ]

  const getVisibleItems = (role: UserRole): NavItem[] => {
    return navItems.filter(
      (item) => item.roles.includes('all') || item.roles.includes(role)
    )
  }

  return { navItems, getVisibleItems }
}