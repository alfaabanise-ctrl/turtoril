<template>
  <p :class="[  small_text ? '  text-xs lg:text-base' : 'text-sm sm:text-sm md:text-md']" class="font-normal">
    <slot/>
  </p>
</template>
<script>
  export default {
    props: {
      color: String,
      small_text: Boolean
    }
  }
</script>