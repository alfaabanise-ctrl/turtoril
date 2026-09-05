<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()


</script>

<template>
  <NavigationNavbar  />
  <slot />

</template>