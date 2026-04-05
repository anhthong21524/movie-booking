import { DEFAULT_AUTH_REDIRECT } from '~/constants/auth'
import {
  classifyRouteAccess,
  resolveRouteRedirect,
} from '~/utils/auth-routing'

export default defineNuxtRouteMiddleware(async (to) => {
  const access = classifyRouteAccess(to.path)

  if (access === 'public') {
    return
  }

  const appAuth = useAppAuth()
  const userStore = useUserStore()

  await appAuth.ensureResolved()

  const redirectTarget = resolveRouteRedirect({
    access,
    fullPath: to.fullPath,
    isAuthenticated: userStore.isAuthenticated,
    isAdmin: userStore.isAdmin,
  })

  if (redirectTarget === DEFAULT_AUTH_REDIRECT) {
    return navigateTo(DEFAULT_AUTH_REDIRECT)
  }

  if (redirectTarget) {
    return navigateTo(redirectTarget)
  }
})
