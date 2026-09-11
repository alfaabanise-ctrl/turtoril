<template>
  <h1 :class="color==='secondary' ? 'text-secondary' : color==='white' ? 'text-white' : color === 'primary' ? 'text-primary': 'text-neutral-800'" class="text-3xl md:text-4xl xl:text-4xl"><slot/></h1>
</template>
<script>
  export default {
    props: {
      color: String
    }
  }
</script>