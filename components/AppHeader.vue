<script setup lang="ts">
import {
  LOGIN_PATH,
  REGISTER_PATH,
} from '~/constants/auth'
import { MAIN_NAVIGATION } from '~/constants/navigation'

const appAuth = useAppAuth()
const userStore = useUserStore()
const { locale, setLocale, t } = useI18n()

const authCopy = computed(() => {
  if (locale.value === 'vi') {
    return {
      login: 'Đăng nhập',
      register: 'Đăng ký',
      logout: 'Đăng xuất',
      welcome: 'Xin chào',
    }
  }

  return {
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    welcome: 'Hello',
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

const showAuthControls = computed(() => userStore.isResolved)

const handleLogout = async () => {
  await appAuth.logout()
  await navigateTo('/')
}
</script>

<template>
  <header class="border-b border-border/80 bg-white/80 backdrop-blur">
    <div class="container-shell flex min-h-18 flex-wrap items-center justify-between gap-4 py-3">
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

        <div
          v-if="showAuthControls && userStore.isAuthenticated && userStore.profile"
          class="flex items-center gap-3"
        >
          <span class="text-sm font-medium text-slate-600">
            {{ authCopy.welcome }}, {{ userStore.profile.name }}
          </span>
          <button class="btn-secondary" @click="handleLogout">
            {{ authCopy.logout }}
          </button>
        </div>

        <div v-else-if="showAuthControls" class="flex items-center gap-3">
          <NuxtLink :to="LOGIN_PATH" class="btn-secondary">
            {{ authCopy.login }}
          </NuxtLink>
          <NuxtLink :to="REGISTER_PATH" class="btn-primary">
            {{ authCopy.register }}
          </NuxtLink>
        </div>

        <div v-else class="h-10 w-36 animate-pulse rounded-2xl bg-slate-200" />

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
