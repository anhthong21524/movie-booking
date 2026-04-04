import type { AuthSessionUser } from '~/types/auth'

export const useUserStore = defineStore('user', () => {
  const profile = ref<AuthSessionUser | null>(null)

  const isAuthenticated = computed(() => Boolean(profile.value?.id))
  const isAdmin = computed(() => profile.value?.role === 'ADMIN')

  const setUser = (user: AuthSessionUser) => {
    profile.value = user
  }

  const clearUser = () => {
    profile.value = null
  }

  return {
    profile,
    isAuthenticated,
    isAdmin,
    setUser,
    clearUser,
  }
})
