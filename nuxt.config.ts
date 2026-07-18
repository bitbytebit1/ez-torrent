export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    'nuxt-security',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Cipher Tasks',
      meta: [
        {
          name: 'description',
          content: 'An end-to-end encrypted to-do application built with Nuxt and Nuxt UI.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    },
  },

  runtimeConfig: {
    basicAuthCookie: {
      enabled: process.env.NUXT_BASIC_AUTH_COOKIE_ENABLED || true,
      users: process.env.NUXT_BASIC_AUTH_COOKIE_USERS || '',
    },

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

  buildCache: true,

  // pwa,

  eslint: {
    config: {
      standalone: false,
    },
  },

  devtools: {
    enabled: true,
  },

  routeRules: {
    '/api/gettorrents': {
      security: {
        rateLimiter: false,
      },
    },
  },
})
