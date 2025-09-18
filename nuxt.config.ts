export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    // '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    transmission: {
      host: process.env.NUXT_TRANSMISSION_HOST,
      port: process.env.NUXT_TRANSMISSION_PORT,
      username: process.env.NUXT_TRANSMISSION_USERNAME,
      password: process.env.NUXT_TRANSMISSION_PASSWORD,
      directory: process.env.NUXT_TRANSMISSION_DIRECTORY,
    },

    public: {
      transmission: {
        webui: process.env.NUXT_PUBLIC_TRANSMISSION_WEBUI,
      },
    },
  },

  // pwa,

  eslint: {
    config: {
      standalone: false,
    },
  },

  devtools: {
    enabled: true,
  },
})
