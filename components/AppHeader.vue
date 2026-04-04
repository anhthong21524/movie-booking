<script setup lang="ts">
import {
  DEFAULT_AUTH_REDIRECT,
  LOGIN_PATH,
  REGISTER_PATH,
} from '~/constants/auth'
import { MAIN_NAVIGATION } from '~/constants/navigation'
import type { AuthSessionUser } from '~/types/auth'

const { data, signOut, status } = useAuth()
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

watchEffect(() => {
  const sessionUser = data.value?.user

  if (
    status.value === 'authenticated' &&
    sessionUser?.id &&
    sessionUser.name &&
    sessionUser.email &&
    sessionUser.role
  ) {
    const profile: AuthSessionUser = {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
    }

    userStore.setUser(profile)
    return
  }

  if (status.value !== 'loading') {
    userStore.clearUser()
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

const handleLogout = async () => {
  userStore.clearUser()

  await signOut({
    callbackUrl: DEFAULT_AUTH_REDIRECT,
    redirect: false,
  })

  await navigateTo(DEFAULT_AUTH_REDIRECT)
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
          v-if="userStore.isAuthenticated && userStore.profile"
          class="flex items-center gap-3"
        >
          <span class="text-sm font-medium text-slate-600">
            {{ authCopy.welcome }}, {{ userStore.profile.name }}
          </span>
          <button class="btn-secondary" @click="handleLogout">
            {{ authCopy.logout }}
          </button>
        </div>

        <div v-else class="flex items-center gap-3">
          <NuxtLink :to="LOGIN_PATH" class="btn-secondary">
            {{ authCopy.login }}
          </NuxtLink>
          <NuxtLink :to="REGISTER_PATH" class="btn-primary">
            {{ authCopy.register }}
          </NuxtLink>
        </div>

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
