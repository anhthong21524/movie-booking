import { AUTH_SYNC_STORAGE_KEY, DEFAULT_AUTH_REDIRECT } from '~/constants/auth'
import type {
  AuthSessionSnapshot,
  AuthSessionUser,
  AuthStatus,
} from '~/types/auth'

const toSessionSnapshot = (
  status: 'loading' | 'authenticated' | 'unauthenticated',
  user: Partial<AuthSessionUser> | null | undefined,
  expiresAt?: string | null,
): AuthSessionSnapshot => ({
  status,
  expiresAt: expiresAt ?? null,
  user: user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    : null,
})

export const useAppAuth = () => {
  const auth = useAuth()
  const userStore = useUserStore()
  const bookingStore = useBookingStore()

  const syncFromSource = () => {
    userStore.syncFromSession(
      toSessionSnapshot(
        auth.status.value,
        (auth.data.value?.user as Partial<AuthSessionUser> | undefined) ?? null,
        auth.data.value?.expires,
      ),
    )

    if (!userStore.isAuthenticated) {
      bookingStore.clearBooking()
    }

    return userStore.status
  }

  const ensureResolved = async () => {
    if (auth.status.value === 'loading') {
      await auth.getSession()
    }

    return syncFromSource()
  }

  const invalidateClientState = (nextStatus: Extract<AuthStatus, 'expired' | 'logging_out' | 'unauthenticated'>) => {
    bookingStore.clearBooking()
    userStore.clearUser(nextStatus)
  }

  const broadcastAuthSync = () => {
    if (!import.meta.client) {
      return
    }

    window.localStorage.setItem(AUTH_SYNC_STORAGE_KEY, `${Date.now()}`)
  }

  const logout = async () => {
    userStore.beginLogout()
    bookingStore.clearBooking()

    try {
      await auth.signOut({
        callbackUrl: DEFAULT_AUTH_REDIRECT,
        redirect: false,
      })
    } finally {
      invalidateClientState('unauthenticated')
      broadcastAuthSync()
    }
  }

  const handleExpiredSession = async () => {
    if (userStore.status !== 'authenticated') {
      invalidateClientState('expired')
      broadcastAuthSync()
      return
    }

    try {
      await auth.signOut({
        callbackUrl: DEFAULT_AUTH_REDIRECT,
        redirect: false,
      })
    } finally {
      invalidateClientState('expired')
      broadcastAuthSync()
    }
  }

  const refreshSession = async () => {
    try {
      await auth.getSession()
    } catch {
      invalidateClientState(userStore.hasResolved ? 'expired' : 'unauthenticated')
      broadcastAuthSync()
    }

    return syncFromSource()
  }

  return {
    data: auth.data,
    authStatus: auth.status,
    status: computed(() => userStore.status),
    ensureResolved,
    syncFromSource,
    invalidateClientState,
    refreshSession,
    handleExpiredSession,
    logout,
  }
}
