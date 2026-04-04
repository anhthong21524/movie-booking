import { AUTH_SYNC_STORAGE_KEY } from '~/constants/auth'

export default defineNuxtPlugin(async () => {
  const appAuth = useAppAuth()

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

  window.addEventListener('storage', async (event) => {
    if (event.key !== AUTH_SYNC_STORAGE_KEY) {
      return
    }

    await appAuth.ensureResolved()
  })
})
