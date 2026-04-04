import {
  AUTH_SESSION_EXPIRY_SKEW_MS,
  AUTH_SESSION_REFRESH_INTERVAL_MS,
  AUTH_SYNC_STORAGE_KEY,
} from '~/constants/auth'

export default defineNuxtPlugin(async () => {
  const appAuth = useAppAuth()
  const userStore = useUserStore()
  let expiryTimer: ReturnType<typeof setTimeout> | null = null
  let refreshTimer: ReturnType<typeof setInterval> | null = null
  let lastBroadcastSignature = ''

  const clearExpiryTimer = () => {
    if (expiryTimer) {
      clearTimeout(expiryTimer)
      expiryTimer = null
    }
  }

  const syncBroadcast = () => {
    if (!import.meta.client || userStore.status === 'loading') {
      return
    }

    const signature = JSON.stringify({
      status: userStore.status,
      userId: userStore.profile?.id ?? null,
      expiresAt: userStore.expiresAt,
    })

    if (signature === lastBroadcastSignature) {
      return
    }

    lastBroadcastSignature = signature
    window.localStorage.setItem(AUTH_SYNC_STORAGE_KEY, `${Date.now()}:${signature}`)
  }

  const scheduleExpiry = () => {
    clearExpiryTimer()

    if (userStore.status !== 'authenticated' || !userStore.expiresAt) {
      return
    }

    const expiresOn = Date.parse(userStore.expiresAt)

    if (!Number.isFinite(expiresOn)) {
      void appAuth.handleExpiredSession()
      return
    }

    const timeoutMs = Math.max(expiresOn - Date.now() - AUTH_SESSION_EXPIRY_SKEW_MS, 0)

    expiryTimer = setTimeout(() => {
      void appAuth.handleExpiredSession()
    }, timeoutMs)
  }

  const startRefreshLoop = () => {
    if (!import.meta.client || refreshTimer) {
      return
    }

    refreshTimer = setInterval(() => {
      if (document.visibilityState !== 'visible') {
        return
      }

      if (userStore.status === 'authenticated') {
        void appAuth.refreshSession()
      }
    }, AUTH_SESSION_REFRESH_INTERVAL_MS)
  }

  watch(
    () => [appAuth.data.value, appAuth.authStatus.value] as const,
    () => {
      appAuth.syncFromSource()
    },
    {
      deep: true,
      immediate: true,
    },
  )

  if (!import.meta.client) {
    return
  }

  watch(
    () => [userStore.status, userStore.expiresAt, userStore.profile?.id] as const,
    () => {
      scheduleExpiry()
      syncBroadcast()
    },
    {
      immediate: true,
    },
  )

  startRefreshLoop()

  window.addEventListener('focus', () => {
    if (userStore.status === 'authenticated') {
      void appAuth.refreshSession()
    }
  })

  document.addEventListener('visibilitychange', () => {
    if (
      document.visibilityState === 'visible' &&
      userStore.status === 'authenticated'
    ) {
      void appAuth.refreshSession()
    }
  })

  window.addEventListener('storage', async (event) => {
    if (event.key !== AUTH_SYNC_STORAGE_KEY) {
      return
    }

    await appAuth.ensureResolved()
  })
})
