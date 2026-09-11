<template>
  <h2
    :class="color==='secondary'
      ? 'text-secondary'
      : color==='white'
      ? 'text-white'
      : color==='primary'
      ? 'text-primary'
      : 'text-neutral-800'"
    class="text-xl md:text-2xl 2xl:text-3xl"
  >
    <slot/>
  </h2>
</template>

<script>
export default {
  props: {
    color: String
  }
}
</script>