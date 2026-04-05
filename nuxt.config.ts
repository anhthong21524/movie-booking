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
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.example.com',
    },
  },
  app: {
    head: {
      title: 'Movie Booking',
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
