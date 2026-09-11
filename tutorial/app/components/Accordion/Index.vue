<template>
  <ul class="accordion max-w-2xl mx-auto mt-16" role="list" aria-roledescription="accordion">
    <slot></slot>
  </ul>
</template>

<script>
export default {
  props: {
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    firstItemActive: {
      type: Boolean,
      default:false,
    }
  },
  data() {
    return {
      Items: [],
    };
  },

  provide() {
    return { 
      Items: this.Items,
      allowMultiple: this.allowMultiple,
    };
  },

};
</script>

<style>
.accordion {
    list-style: none;
  }
</style>