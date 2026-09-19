import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: false,
  },

  modules: [
    "@nuxt/icon","@nuxt/fonts", "@vueuse/nuxt"
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
      paystackPublicKey: process.env.NUXT_PAYSTACK_API_URL,
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        "http://localhost:5000",
      
       
    },
  },
  fonts: {
    families: [
      {
        name: "Poppins",
        provider: "google",
        weights: [400, 500, 600, 700, 800],
      },
    ],
  },
  
})