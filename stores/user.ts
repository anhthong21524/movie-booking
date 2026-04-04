import type { AuthSessionUser, AuthRole, AuthStatus } from '~/types/auth'

interface SessionSnapshot {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  user?: Partial<AuthSessionUser> | null
}

const normalizeRole = (role: unknown): AuthRole => {
  return role === 'ADMIN' ? 'ADMIN' : 'USER'
}

const normalizeSessionUser = (
  user: Partial<AuthSessionUser> | null | undefined,
): AuthSessionUser | null => {
  if (!user || typeof user.id !== 'string' || user.id.length === 0) {
    return null
  }

  return {
    id: user.id,
    name: typeof user.name === 'string' ? user.name : '',
    email: typeof user.email === 'string' ? user.email : '',
    role: normalizeRole(user.role),
  }
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<AuthSessionUser | null>(null)
  const status = ref<AuthStatus>('loading')
  const hasResolved = ref(false)

  const isResolved = computed(() => status.value !== 'loading')
  const isAuthenticated = computed(() => status.value === 'authenticated')
  const isAdmin = computed(() => profile.value?.role === 'ADMIN')

  const setUser = (user: AuthSessionUser) => {
    profile.value = user
    status.value = 'authenticated'
    hasResolved.value = true
  }

  const clearUser = (nextStatus: Exclude<AuthStatus, 'authenticated' | 'loading'> = 'unauthenticated') => {
    profile.value = null
    status.value = nextStatus
    hasResolved.value = true
  }

  const setLoading = () => {
    status.value = 'loading'
  }

  const beginLogout = () => {
    profile.value = null
    status.value = 'logging_out'
    hasResolved.value = true
  }

  const syncFromSession = (snapshot: SessionSnapshot) => {
    if (snapshot.status === 'loading') {
      setLoading()
      return
    }

    const normalizedUser = normalizeSessionUser(snapshot.user)

    if (snapshot.status === 'authenticated' && normalizedUser) {
      setUser(normalizedUser)
      return
    }

    clearUser(hasResolved.value && status.value === 'authenticated' ? 'expired' : 'unauthenticated')
  }

  return {
    profile,
    status,
    hasResolved,
    isResolved,
    isAuthenticated,
    isAdmin,
    setUser,
    clearUser,
    setLoading,
    beginLogout,
    syncFromSession,
  }
})
