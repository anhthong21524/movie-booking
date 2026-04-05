import type {
  AuthSessionSnapshot,
  AuthSessionUser,
  AuthStatus,
} from '~/types/auth'
import { isAdminRole, normalizeAuthRole } from '~/utils/authz'

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
    role: normalizeAuthRole(user.role),
  }
}

export const useUserStore = defineStore('user', () => {
  const profile = ref<AuthSessionUser | null>(null)
  const status = ref<AuthStatus>('loading')
  const hasResolved = ref(false)
  const expiresAt = ref<string | null>(null)

  const isResolved = computed(() => status.value !== 'loading')
  const isAuthenticated = computed(() => status.value === 'authenticated')
  const isAdmin = computed(() => isAdminRole(profile.value?.role))

  const setUser = (user: AuthSessionUser, nextExpiresAt?: string | null) => {
    profile.value = user
    expiresAt.value = nextExpiresAt ?? null
    status.value = 'authenticated'
    hasResolved.value = true
  }

  const clearUser = (nextStatus: Exclude<AuthStatus, 'authenticated' | 'loading'> = 'unauthenticated') => {
    profile.value = null
    expiresAt.value = null
    status.value = nextStatus
    hasResolved.value = true
  }

  const setLoading = () => {
    status.value = 'loading'
  }

  const beginLogout = () => {
    profile.value = null
    expiresAt.value = null
    status.value = 'logging_out'
    hasResolved.value = true
  }

  const markExpired = () => {
    clearUser('expired')
  }

  const syncFromSession = (snapshot: AuthSessionSnapshot) => {
    if (snapshot.status === 'loading') {
      setLoading()
      return
    }

    const normalizedUser = normalizeSessionUser(snapshot.user)
    const expiresOn =
      typeof snapshot.expiresAt === 'string' && snapshot.expiresAt.length > 0
        ? Date.parse(snapshot.expiresAt)
        : Number.NaN

    if (
      snapshot.status === 'authenticated' &&
      normalizedUser &&
      Number.isFinite(expiresOn) &&
      expiresOn > Date.now()
    ) {
      setUser(normalizedUser, snapshot.expiresAt ?? null)
      return
    }

    clearUser(hasResolved.value && status.value === 'authenticated' ? 'expired' : 'unauthenticated')
  }

  return {
    profile,
    status,
    hasResolved,
    expiresAt,
    isResolved,
    isAuthenticated,
    isAdmin,
    setUser,
    clearUser,
    setLoading,
    beginLogout,
    markExpired,
    syncFromSession,
  }
})
