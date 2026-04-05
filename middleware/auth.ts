import { buildLoginRedirectLocation } from '~/utils/auth-routing'

export default defineNuxtRouteMiddleware(async (to) => {
  const appAuth = useAppAuth()
  const userStore = useUserStore()

  await appAuth.ensureResolved()

  if (!userStore.isAuthenticated) {
    return navigateTo(buildLoginRedirectLocation(to.fullPath))
  }
})
