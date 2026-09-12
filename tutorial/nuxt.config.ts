import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: false,
  },

  modules: [
    "@nuxt/icon",
  ],

  // Tauri application
  ssr: false,

  nitro: {
    preset: "static",
  },

  css: [
    "~/assets/css/main.css",
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    baseURL: "./",
    pageTransition: {
      name: "page-sheet",
      mode: "out-in",
    },
  },

  runtimeConfig: {
    // Private variables - server only
  
    // Public variables - available to the client
    public: {
      projectName: "cbt lesson",
      apiUrl:
      
        "http://localhost:5000",
    },
  },
})