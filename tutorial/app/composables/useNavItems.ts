import type {
  NavItem,
  UserRole,
} from "~/types/nav";

export const useNavItems = () => {
  const navItems: NavItem[] = [

    /* ============================================================
     * SUPER ADMIN
     * ============================================================ */

    {
      label: "Dashboard",
      icon: "i-heroicons-squares-2x2",
      to: "/super-admin",
      roles: ["superadmin"],
    },

    {
      label: "Admins",
      icon: "i-heroicons-shield-check",
      to: "/super-admin/admins",
      roles: ["superadmin"],
    },

    {
      label: "Teachers",
      icon: "i-heroicons-user-group",
      to: "/super-admin/teachers",
      roles: ["superadmin"],
    },

    {
      label: "Students",
      icon: "i-heroicons-academic-cap",
      to: "/super-admin/students",
      roles: ["superadmin"],
    },

    {
      label: "Subscriptions",
      icon: "i-heroicons-rectangle-stack",
      to: "/super-admin/subscriptions",
      roles: ["superadmin"],
    },

    {
      label: "Payments",
      icon: "i-heroicons-banknotes",
      to: "/super-admin/payments",
      roles: ["superadmin"],
    },

    {
      label: "Wallets",
      icon: "i-heroicons-wallet",
      to: "/super-admin/wallets",
      roles: ["superadmin"],
    },

    {
      label: "Ledger",
      icon: "i-heroicons-document-text",
      to: "/super-admin/ledger",
      roles: ["superadmin"],
    },

    


    /* ============================================================
     * ADMIN
     * ============================================================ */

    {
      label: "Dashboard",
      icon: "i-heroicons-squares-2x2",
      to: "/admin",
      roles: ["admin"],
    },

    {
      label: "Teachers",
      icon: "i-heroicons-user-group",
      to: "/admin/teachers",
      roles: ["admin"],
    },

    {
      label: "Students",
      icon: "i-heroicons-academic-cap",
      to: "/admin/students",
      roles: ["admin"],
    },


    /* ============================================================
     * TEACHER
     * ============================================================ */

    {
      label: "Dashboard",
      icon: "i-heroicons-squares-2x2",
      to: "/teacher",
      roles: ["teacher"],
    },

    {
      label: "Students",
      icon: "i-heroicons-users",
      to: "/teacher/students",
      roles: ["teacher"],
    },


    /* ============================================================
     * SHARED ADMIN / TEACHER
     * ============================================================ */

    {
      label: "Payments",
      icon: "i-heroicons-banknotes",
      to: "/payments",
      roles: ["admin", "teacher"],
    },

    {
      label: "Wallet",
      icon: "i-heroicons-wallet",
      to: "/wallet",
      roles: ["admin", "teacher"],
    },


    /* ============================================================
     * STUDENT
     * ============================================================ */

    {
      label: "Dashboard",
      icon: "i-heroicons-squares-2x2",
      to: "/student",
      roles: ["student"],
    },

    {
      label: "Subscription",
      icon: "i-heroicons-credit-card",
      to: "/student/subscription",
      roles: ["student"],
    },

    {
      label: "Payments",
      icon: "i-heroicons-banknotes",
      to: "/student/payments",
      roles: ["student"],
    },


    /* ============================================================
     * SETTINGS
     * ============================================================ */

    {
      label: "Settings",
      icon: "i-heroicons-cog-6-tooth",
      to: "/settings",
      roles: [
        "student",
        "teacher",
        "admin",
        "superadmin",
      ],
    },
  ];


  /* ================================================================
   * VISIBLE MENU ITEMS
   * ================================================================ */

  const getVisibleItems = (
    role: UserRole
  ): NavItem[] => {
    return navItems.filter(
      (item) =>
        item.roles.includes("all") ||
        item.roles.includes(role)
    );
  };


  /* ================================================================
   * FIND MATCHING ROUTES
   * ================================================================ */

  const getMatchingItems = (
    path: string
  ): NavItem[] => {
    return navItems.filter(
      (item) =>
        path === item.to ||
        path.startsWith(item.to + "/")
    );
  };


  /* ================================================================
   * ROUTE AUTHORIZATION
   * ================================================================ */

  const isRouteAuthorized = (
    path: string,
    role: UserRole
  ): boolean => {

    /*
     * Public routes.
     */
    const publicRoutes = [
      "/",
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/unauthorized",
    ];

    if (publicRoutes.includes(path)) {
      return true;
    }


    /*
     * Find routes matching the current URL.
     */
    const matches =
      getMatchingItems(path);


    /*
     * If the route is directly represented
     * by the navigation, use its roles.
     */
    if (matches.length) {

      /*
       * Pick the most specific route.
       *
       * Example:
       *
       * /teacher
       * /teacher/students
       *
       * /teacher/students should win.
       */
      const mostSpecific =
        matches.reduce(
          (longest, item) =>
            item.to.length >
            longest.to.length
              ? item
              : longest
        );


      return (
        mostSpecific.roles.includes("all") ||
        mostSpecific.roles.includes(role)
      );
    }


    /*
     * Protect entire private sections even
     * when a deeper page is not listed above.
     */
    if (
      path === "/super-admin" ||
      path.startsWith("/super-admin/")
    ) {
      return role === "superadmin";
    }

    if (
      path === "/admin" ||
      path.startsWith("/admin/")
    ) {
      return role === "admin";
    }

    if (
      path === "/teacher" ||
      path.startsWith("/teacher/")
    ) {
      return role === "teacher";
    }

    if (
      path === "/student" ||
      path.startsWith("/student/")
    ) {
      return role === "student";
    }


    /*
     * Shared routes.
     */
    if (
      path === "/payments" ||
      path.startsWith("/payments/")
    ) {
      return (
        role === "admin" ||
        role === "teacher"
      );
    }

    if (
      path === "/wallet" ||
      path.startsWith("/wallet/")
    ) {
      return (
        role === "admin" ||
        role === "teacher"
      );
    }

    if (
      path === "/settings" ||
      path.startsWith("/settings/")
    ) {
      return (
        role === "student" ||
        role === "teacher" ||
        role === "admin"
      );
    }


    /*
     * Routes not defined above.
     *
     * Change this to false if you want
     * every unlisted route protected.
     */
    return true;
  };


  /* ================================================================
   * DASHBOARD BY ROLE
   * ================================================================ */

  const getDashboard = (
    role: UserRole
  ): string => {
    switch (role) {

      case "superadmin":
        return "/super-admin";

      case "admin":
        return "/admin";

      case "teacher":
        return "/teacher";

      case "student":
        return "/student";

      default:
        return "/login";
    }
  };


  return {
    navItems,
    getVisibleItems,
    isRouteAuthorized,
    getDashboard,
  };
};