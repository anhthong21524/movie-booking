<script setup lang="ts">
import {
  DEFAULT_AUTH_REDIRECT,
  LOGIN_PATH,
  REDIRECT_QUERY_KEY,
  REGISTER_PATH,
} from '~/constants/auth'
import { MAIN_NAVIGATION } from '~/constants/navigation'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'

const appAuth = useAppAuth()
const route = useRoute()
const userStore = useUserStore()
const { locale, setLocale, t } = useI18n()

const authCopy = computed(() => {
  if (locale.value === 'vi') {
    return {
      login: 'Dang nhap',
      register: 'Dang ky',
      logout: 'Dang xuat',
      loggingOut: 'Dang dang xuat...',
      welcome: 'Xin chao',
      admin: 'Quan tri',
      account: 'Tai khoan',
    }
  }

  return {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loggingOut: 'Signing out...',
    welcome: 'Hello',
    admin: 'Admin',
    account: 'Account',
  }
})

const navigation = computed(() =>
  MAIN_NAVIGATION.filter((item) => {
    if (item.requiresAdmin) {
      return userStore.isAdmin
    }

    if (item.requiresAuth) {
      return userStore.isAuthenticated
    }

    return true
  }).map((item) => ({
    ...item,
    label: t(`nav.${item.key}`),
  })),
)

const loginLink = computed(() => ({
  path: LOGIN_PATH,
  query: {
    [REDIRECT_QUERY_KEY]: sanitizeRedirectTarget(route.fullPath),
  },
}))

const registerLink = computed(() => ({
  path: REGISTER_PATH,
  query: {
    [REDIRECT_QUERY_KEY]: sanitizeRedirectTarget(route.fullPath),
  },
}))

const initials = computed(() => {
  const name = userStore.profile?.name?.trim()

  if (!name) {
    return 'MH'
  }

  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')
})

const isLoggingOut = computed(() => userStore.status === 'logging_out')

const handleLogout = async () => {
  await appAuth.logout()
  await navigateTo(DEFAULT_AUTH_REDIRECT)
}
</script>

<template>
  <header class="border-b border-border/80 bg-white/80 backdrop-blur">
    <div
      class="container-shell flex min-h-18 flex-wrap items-center justify-between gap-4 py-3"
    >
      <NuxtLink to="/" class="font-display text-xl font-bold text-slate-950">
        MovieHub
      </NuxtLink>

      <div class="flex flex-wrap items-center justify-end gap-3">
        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-slate-600 hover:text-primary-600"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <AuthUiGuard when="resolved">
          <div
            v-if="userStore.isAuthenticated && userStore.profile"
            class="flex items-center gap-3"
          >
            <div
              class="hidden items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 sm:flex"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700"
              >
                {{ initials }}
              </div>

              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">
                  {{ authCopy.welcome }}, {{ userStore.profile.name }}
                </p>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <span>{{ authCopy.account }}</span>
                  <span
                    v-if="userStore.isAdmin"
                    class="rounded-full bg-slate-900 px-2 py-0.5 font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    {{ authCopy.admin }}
                  </span>
                </div>
              </div>
            </div>

            <button
              class="btn-secondary"
              :disabled="isLoggingOut"
              @click="handleLogout"
            >
              {{ isLoggingOut ? authCopy.loggingOut : authCopy.logout }}
            </button>
          </div>

          <div v-else class="flex items-center gap-3">
            <NuxtLink :to="loginLink" class="btn-secondary">
              {{ authCopy.login }}
            </NuxtLink>
            <NuxtLink :to="registerLink" class="btn-primary">
              {{ authCopy.register }}
            </NuxtLink>
          </div>

          <template #fallback>
            <div class="flex items-center gap-3">
              <div
                class="hidden h-12 w-52 animate-pulse rounded-2xl bg-slate-200 sm:block"
              />
              <div class="h-10 w-24 animate-pulse rounded-2xl bg-slate-200" />
              <div class="h-10 w-28 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </template>
        </AuthUiGuard>

        <div
          class="flex items-center rounded-full border border-border bg-white p-1"
        >
          <button
            class="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            :class="
              locale === 'en'
                ? 'bg-primary-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            "
            @click="setLocale('en')"
          >
            EN
          </button>
          <button
            class="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            :class="
              locale === 'vi'
                ? 'bg-primary-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            "
            @click="setLocale('vi')"
          >
            VI
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
