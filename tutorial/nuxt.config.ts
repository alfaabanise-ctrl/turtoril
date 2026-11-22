import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: { port: 3001 },
  devtools: {
    enabled: false,
  },

  // Render pages on the server so search engines can index them
  ssr: true,

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
      "/auth",
      "/buy",
      "/payments",
      "/settings",
      "/wallet",
      "/users",
      "/users/**",
      "/teacher",
      "/teacher/**",
      "/admin",
      "/admin/**",
      "/student",
      "/student/**",
      "/super-admin",
      "/super-admin/**",
    ],
    discoverImages: false,
    urls: [],
  },

  // No "preset" here: Nuxt detects Vercel automatically
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [
        "/",
        "/about",
        "/contact",
        "/privacy-policy",
        "/sitemap.xml",
        "/robots.txt",
      ],
    },
  },

  // Private pages do not need server rendering or SEO
  routeRules: {
    "/admin/**": { ssr: false },
    "/super-admin/**": { ssr: false },
    "/teacher/**": { ssr: false },
    "/student/**": { ssr: false },
  },

  css: ["~/assets/css/main.css"],

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],

    optimizeDeps: {
      include: ["@meforma/vue-toaster"],
    },
  },

  // Runtime configuration
  runtimeConfig: {
    // Private, server only
    geminiApiKey: process.env.GEMINI_API_KEY,

    // Public, available in the browser
    public: {
      projectName: "ExamTips",

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