
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: false,
  },

  modules: [
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxtjs/sitemap",
    "@vueuse/nuxt",
  ],

  optimizeDeps: {
    include: ["@meforma/vue-toaster"],
  },

  // SEO and website metadata
  site: {
    url: "https://www.examtips.abanise.com",
    name: "ExamTips",
  },

  app: {
    // Root URL for the hosted website.
    // Use a separate config for offline/relative-path builds if needed.
    baseURL: "/",

    head: {
      title: "ExamTips | JAMB & WAEC Past Questions",
      titleTemplate: "%s | ExamTips",

      htmlAttrs: {
        lang: "en",
      },

      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/images/icons.png",
        },
        {
          rel: "apple-touch-icon",
          href: "/images/icons.png",
        },
      ],

      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "description",
          content:
            "Prepare for JAMB and WAEC with ExamTips. Practise past questions, take CBT mock exams, and study exam-focused lessons.",
        },
      ],
    },

    pageTransition: {
      name: "page-sheet",
      mode: "out-in",
    },
  },

  // XML sitemap
  sitemap: {
    exclude: [
      "/super-admin/**",
      "/admin/**",
      "/student/**",
    ],

    discoverImages: false,

    // Add real dynamic page URLs here if needed.
    // Static Nuxt pages are discovered automatically.
    urls: [],
  },

  // SPA / static deployment
  ssr: false,

  nitro: {
    preset: "static",
    prerender: {
      routes: ["/", "/sitemap.xml", "/robots.txt"],
    },
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      projectName: "ExamTips",

      paystackPublicKey:
        process.env.NUXT_PAYSTACK_API_URL,

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
});
