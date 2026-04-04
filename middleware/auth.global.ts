import { DEFAULT_AUTH_REDIRECT } from '~/constants/auth'
import {
  buildLoginRedirectLocation,
  classifyRouteAccess,
} from '~/utils/auth-routing'

export default defineNuxtRouteMiddleware(async (to) => {
  const access = classifyRouteAccess(to.path)

  if (access === 'public') {
    return
  }

  const appAuth = useAppAuth()
  const userStore = useUserStore()

  await appAuth.ensureResolved()

  if (access === 'guest') {
    if (userStore.isAuthenticated) {
      return navigateTo(DEFAULT_AUTH_REDIRECT)
    }

    return
  }

  if (!userStore.isAuthenticated) {
    return navigateTo(buildLoginRedirectLocation(to.fullPath))
  }

  if (access === 'admin' && !userStore.isAdmin) {
    return navigateTo(DEFAULT_AUTH_REDIRECT)
  }
})
