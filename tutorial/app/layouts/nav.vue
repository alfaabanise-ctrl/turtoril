<script setup lang="ts">
import type { UserRole } from "~/types/nav";

const role: UserRole = "admin";

const user = {
  firstName: "Alfa",
  lastName: "Abanise",
  email: "admin@example.com",
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Floating navigation -->
    <NavigationDashboardNav :role="'admin'" />
    <!-- Main area -->
    <main class="min-h-screen">
      <!-- Top header -->
      <NavigationDashboardHeader :role="role" :user="user" />

      <!-- Page content -->
      <div class="px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
