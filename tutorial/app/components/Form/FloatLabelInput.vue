<template>
  <div class="w-full relative">

    <!-- ================= WRAPPER ================= -->
    <div class="relative flex items-center">

      <!-- PREFIX -->
      <div
        v-if="$slots.prefix"
        class="absolute left-3 flex items-center text-gray-400 z-10"
      >
        <slot name="prefix" />
      </div>

      <!-- INPUT -->
      <input
        ref="input"
        :id="inputId"
        :type="computedType"
        :value="inputValue"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete || 'off'"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="usePlaceholder ? label : ''"
        :class="[
          baseInputClasses,
          hasPrefix ? 'pl-10' : 'px-4',
          hasRight ? 'pr-10' : ''
        ]"
      />

      <!-- PASSWORD TOGGLE -->
      <button
        v-if="type === 'password'"
        type="button"
        class="absolute right-3 z-10"
        @click="toggleReveal"
      >
        <UiIconsEye v-if="isHidden" class="w-5 h-5" />
        <UiIconsEyeOff v-else class="w-5 h-5" />
      </button>

      <!-- SUFFIX -->
      <div
        v-else-if="$slots.suffix"
        class="absolute right-3 flex items-center text-gray-400 z-10"
      >
        <slot name="suffix" />
      </div>

    </div>

    <!-- ================= FLOATING LABEL ================= -->
    <!-- IMPORTANT: MUST BE absolute -->
    <label
      v-if="!usePlaceholder"
      :for="inputId"
      :class="[
        'absolute left-4 bg-white px-1 text-sm transition-all duration-200 pointer-events-none',

        isFocused || inputValue
          ? '-top-2 text-xs'
          : 'top-3 text-gray-500'
      ]"
    >
      {{ label }}
    </label>

    <!-- ERROR -->
    <p v-if="error" class="text-xs text-red-500 mt-1">
      {{ error }}
    </p>

  </div>
</template>

<script>
export default {
  name: "FloatLabelInput",

  props: {
    label: { type: String, required: true },
    inputValue: String,
    type: String,
    error: [Boolean, String],
    required: Boolean,
    disabled: Boolean,
    autocomplete: String,

    /* ⭐ THIS controls placeholder vs floating */
    usePlaceholder: Boolean
  },

  data() {
    return {
      isFocused: false,
      isHidden: true,
      inputId: `input-${Math.random().toString(36).slice(2)}`
    }
  },

  computed: {
    computedType() {
      if (this.type === 'password') {
        return this.isHidden ? 'password' : 'text'
      }
      return this.type || 'text'
    },

    hasPrefix() {
      return !!this.$slots.prefix
    },

    hasRight() {
      return this.type === 'password' || !!this.$slots.suffix
    },

    baseInputClasses() {
      return [
        'w-full py-3 rounded-xl border outline-none text-sm  bg-white',
        'focus:ring-2 focus:ring-blue-500',
        this.error ? 'border-red-600' : 'border-gray-300'
      ].join(' ')
    }
  },

  methods: {
    toggleReveal() {
      this.isHidden = !this.isHidden
    },

    handleInput(e) {
      this.$emit('update:inputValue', e.target.value)
    }
  }
}
</script>
<style>
.fb{
    background: #525252;
}
</style>
