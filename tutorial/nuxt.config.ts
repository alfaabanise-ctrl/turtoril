
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

  // Website metadata and SEO
  site: {
    url: "https://www.examtips.abanise.com",
    name: "ExamTips",
  },

  app: {
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
        {
          charset: "utf-8",
        },
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
    urls: [],
  },

  // SPA / static deployment
  ssr: false,

  nitro: {
    preset: "static",
    prerender: {
      routes: [
        "/",
        "/sitemap.xml",
        "/robots.txt",
      ],
    },
  },

  css: ["~/assets/css/main.css"],

  // Vite configuration
  // Let Nuxt manage the dev server and HMR WebSocket automatically.
  vite: {
    plugins: [tailwindcss()],

    optimizeDeps: {
      include: ["@meforma/vue-toaster"],
    },
  },

  // Public runtime configuration
  runtimeConfig: {
    public: {
      projectName: "ExamTips",

      // Confirm that this environment variable contains your Paystack PUBLIC key.
      paystackPublicKey:
        process.env.NUXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",

      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        "http://localhost:5000",
    },
  },

  // Google Fonts
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
