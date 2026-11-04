<!-- InstallButton.vue -->
<script setup lang="ts">
const { isIos, isInstalled, canInstall, install } = useInstallPrompt()
const showIosHelp = ref(false)
</script>

<template>
  <div v-if="!isInstalled">
    <!-- Android / Chrome: real one-click install -->
    <button v-if="canInstall" @click="install">Install app</button>

    <!-- iOS: guided instructions -->
    <template v-else-if="isIos">
      <button @click="showIosHelp = true">Install app</button>
      <div v-if="showIosHelp" class="modal">
        <p>1. Tap the <strong>Share</strong> icon in Safari</p>
        <p>2. Choose <strong>Add to Home Screen</strong></p>
        <p>3. Tap <strong>Add</strong></p>
        <button @click="showIosHelp = false">Got it</button>
      </div>
    </template>
  </div>
</template>