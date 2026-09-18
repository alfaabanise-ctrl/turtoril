<script setup lang="ts">
import type { UserRole } from "~/types/nav";
const auth = useAuth()


const user = {
  firstName: "Alfa",
  lastName: "Abanise",
  email: "admin@example.com",
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Floating navigation -->
     
    <NavigationDashboardNav :role="auth?.user?.role || 'teacher' " />
    <!-- Main area0-->
    <main class="min-h-screen">
      <!-- Top header -->
      <NavigationDashboardHeader :role="auth?.user?.role || 'teacher'" :user="auth.user " />

      <!-- Page content -->
      <Container class="px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </Container>
    </main>
  </div>
</template>
