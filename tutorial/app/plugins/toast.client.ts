import { defineNuxtPlugin } from "#app";
import Toaster from "@meforma/vue-toaster";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toaster, {
    position: "top",
    duration: 3000,
    dismissible: true,
    pauseOnHover: true,
  });

  nuxtApp.provide("toast", nuxtApp.vueApp.config.globalProperties.$toast);
});
