interface UserProfile {
  id: string
  name: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  const setUser = (user: UserProfile, accessToken: string) => {
    profile.value = user
    token.value = accessToken
  }

  const clearUser = () => {
    profile.value = null
    token.value = null
  }

  return {
    profile,
    token,
    isAuthenticated,
    setUser,
    clearUser,
  }
})
