import { DEFAULT_AUTH_REDIRECT } from '~/constants/auth'

export default defineNuxtRouteMiddleware(async () => {
  const appAuth = useAppAuth()
  const userStore = useUserStore()

  await appAuth.ensureResolved()

  if (userStore.isAuthenticated) {
    return navigateTo(DEFAULT_AUTH_REDIRECT)
  }
})
