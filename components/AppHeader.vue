<script setup lang="ts">
import {
  DEFAULT_AUTH_REDIRECT,
  LOGIN_PATH,
  REDIRECT_QUERY_KEY,
  REGISTER_PATH,
} from '~/constants/auth'
import { MAIN_NAVIGATION } from '~/constants/navigation'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'
import { canViewNavigationItem } from '~/utils/authz'

const appAuth = useAppAuth()
const route = useRoute()
const userStore = useUserStore()
const { locale, setLocale, t } = useI18n()

const authCopy = computed(() => {
  if (locale.value === 'vi') {
    return {
      login: t('authPages.loginSubmit'),
      register: t('authPages.registerSeoTitle'),
      logout: 'Đăng xuất',
      loggingOut: 'Đang đăng xuất...',
      welcome: 'Xin chào',
    }
  }

  return {
    login: t('authPages.loginSubmit'),
    register: t('authPages.registerSeoTitle'),
    logout: 'Logout',
    loggingOut: 'Signing out...',
    welcome: 'Hello',
  }
})

const publicNavigation = computed(() =>
  MAIN_NAVIGATION.filter(
    (item) =>
      !item.requiresAuth &&
      !item.requiresAdmin &&
      canViewNavigationItem(item, {
        isAuthenticated: false,
        role: 'USER',
      }),
  ).map((item) => ({
    ...item,
    label: t(`nav.${item.key}`),
  })),
)

const protectedPrimaryNavigation = computed(() =>
  MAIN_NAVIGATION.filter((item) => item.requiresAuth && !item.requiresAdmin).map((item) => ({
    ...item,
    label: t(`nav.${item.key}`),
  })),
)

const adminNavigationItem = computed(() => ({
  to: '/admin/movies',
  label: t('nav.admin'),
  isActive: route.path === '/admin' || route.path.startsWith('/admin/'),
}))

const isNavigationItemActive = (to: string) => {
  if (to === '/movies') {
    return route.path === '/movies' || route.path.startsWith('/movies/')
  }

  if (to === '/tickets') {
    return route.path === '/tickets' || route.path.startsWith('/tickets/')
  }

  return route.path === to || route.path.startsWith(`${to}/`)
}

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

const isLoggingOut = computed(() => userStore.status === 'logging_out')
const greetingClass = computed(() =>
  userStore.isAdmin ? 'text-primary-700' : 'text-slate-900',
)

const handleLogout = async () => {
  await appAuth.logout()
  await navigateTo(DEFAULT_AUTH_REDIRECT)
}
</script>

<template>
  <header class="border-b border-border/80 bg-white/80 backdrop-blur">
    <div class="container-shell py-3">
      <div class="flex min-h-18 flex-wrap items-center justify-between gap-4">
        <NuxtLink to="/" class="font-display text-xl font-bold text-slate-950">
          MovieHub
        </NuxtLink>

        <nav class="hidden flex-wrap items-center gap-6 md:flex">
          <NuxtLink
            v-for="item in publicNavigation"
            :key="item.to"
            :to="item.to"
            class="relative inline-flex items-center border-b-2 pb-2 text-sm font-medium transition-colors"
            :class="
              isNavigationItemActive(item.to)
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-slate-600 hover:border-primary-200 hover:text-primary-600'
            "
          >
            {{ item.label }}
          </NuxtLink>

          <NuxtLink
            v-for="item in protectedPrimaryNavigation"
            :key="item.to"
            :to="item.to"
            class="relative inline-flex items-center border-b-2 pb-2 text-sm font-medium transition-colors"
            :class="
              isNavigationItemActive(item.to)
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-slate-600 hover:border-primary-200 hover:text-primary-600'
            "
          >
            {{ item.label }}
          </NuxtLink>

          <AuthUiGuard when="admin">
            <NuxtLink
              :to="adminNavigationItem.to"
              class="relative inline-flex items-center border-b-2 pb-2 text-sm font-medium transition-colors hover:text-primary-600"
              :class="
                adminNavigationItem.isActive
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-slate-600 hover:border-primary-200'
              "
            >
              {{ adminNavigationItem.label }}
            </NuxtLink>
          </AuthUiGuard>
        </nav>

        <div class="flex flex-wrap items-center justify-end gap-3">
          <AuthUiGuard when="resolved">
            <div
              v-if="userStore.isAuthenticated && userStore.profile"
              class="flex items-center gap-3"
            >
              <NuxtLink
                to="/profile"
                class="hidden items-center rounded-2xl border border-border bg-white px-5 py-3 transition-colors hover:border-primary-200 hover:bg-primary-50 sm:flex"
              >
                <p class="truncate text-sm font-semibold text-slate-900">
                  {{ authCopy.welcome }},
                  <span :class="greetingClass">
                    {{ userStore.profile.name }}
                  </span>
                </p>
              </NuxtLink>

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
    </div>
  </header>
</template>
