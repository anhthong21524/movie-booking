const authOrigin = (process.env.AUTH_ORIGIN || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
  ],
  css: ['~/assets/css/main.css'],
  auth: {
    originEnvKey: '',
    baseURL: `${authOrigin}/api/auth`,
    provider: {
      type: 'authjs',
      trustHost: true,
    },
    sessionRefresh: {
      enableOnWindowFocus: true,
      enablePeriodically: false,
    },
    globalAppMiddleware: {
      isEnabled: false,
    },
  },
  typescript: {
    strict: true,
    typeCheck: 'build',
  },
  runtimeConfig: {
    apiProxyTarget:
      process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080',
    public: {
      apiBaseUrl: '',
    },
  },
  app: {
    head: {
      title: 'Movie Booking',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
      ],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          name: 'description',
          content: 'Nuxt 3 movie booking starter project.',
        },
      ],
    },
  },
})
