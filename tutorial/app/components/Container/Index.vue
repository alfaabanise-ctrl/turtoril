<template>
  <div
    class="w-full max-w-7xl mx-auto px-2 sm:px-6"
    :class="[addTopBottomPadding ? 'py-10 lg:py-10' : '']"
  >
    <slot />
  </div>
</template>


<script setup lang="ts">
defineProps({
  addTopBottomPadding: {
    type: Boolean,
    default: true,
  },
});
</script>
