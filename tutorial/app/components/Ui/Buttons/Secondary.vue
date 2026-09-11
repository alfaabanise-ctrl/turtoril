<template>
  <NuxtLink v-if="url"
    :to="url"
    :class="linkClasses"
    class="py-2 px-5 font-normal text-base 2xl:text-lg justify-center border outline-none "
    :style="disabled ? '' : 'transition: color 500ms ease-in-out, border-color 500ms ease-in-out;'"
  >
    <slot />
  </NuxtLink>

  <button v-else
    @click="!disabled && $emit('clicked')"
    :class="buttonClasses"
    class="py-2 px-5 font-normal text-base 2xl:text-lg justify-center border outline-none "
    :style="disabled ? '' : 'transition: color 500ms ease-in-out, border-color 500ms ease-in-out;'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    flexdisplay: {
      default: false,
      type: Boolean
    },
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: Object,
      default: null
    },

    // ✅ NEW PROP
    color: {
      type: String,
      default: null // null = use default theme colors
    }
  },

  computed: {
    baseClasses() {
      return [
        this.flexdisplay ? 'flex w-full text-center gap-3 items-center' : 'w-fit text-left'
      ].filter(Boolean).join(' ')
    },

    // ✅ Build color classes when color prop is given
    colorClasses() {
      if (!this.color) return ''
      return `text-${this.color} border-${this.color}`
    },

    buttonClasses() {
      if (this.disabled) {
        return [
          this.baseClasses,
          'text-accent-400 border-accent-200 cursor-not-allowed'
        ].join(' ')
      }

      return [
        this.baseClasses,

        // ✅ Use custom color if passed, else default
        this.color ? this.colorClasses : 'text-secondary border-secondary',

        // Hover effects remain
        'hover:text-primary hover:border-primary focus:border-primary focus:text-primary active:text-secondary'
      ].join(' ')
    },

    linkClasses() {
      if (this.disabled) {
        return [
          this.baseClasses,
          'text-accent-400 border-accent-200 cursor-not-allowed pointer-events-none'
        ].join(' ')
      }

      return [
        this.baseClasses,

        // ✅ Use custom color if passed, else default
        this.color ? this.colorClasses : 'text-secondary border-secondary',

        // Hover effects remain
        'hover:text-primary hover:border-primary focus:border-primary focus:text-primary active:text-secondary'
      ].join(' ')
    }
  }
}
</script>
