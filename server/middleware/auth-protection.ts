import { sendRedirect } from 'h3'
import { getServerSessionUser } from '~/server/utils/auth-session'
import {
  classifyRouteAccess,
  resolveRouteRedirect,
  shouldSkipServerRouteProtection,
} from '~/utils/auth-routing'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  if (shouldSkipServerRouteProtection(url.pathname)) {
    return
  }

  const access = classifyRouteAccess(url.pathname)

  if (access === 'public') {
    return
  }

  const sessionUser = await getServerSessionUser(event)
  const redirectTarget = resolveRouteRedirect({
    access,
    fullPath: `${url.pathname}${url.search}`,
    isAuthenticated: Boolean(sessionUser?.id),
    isAdmin: sessionUser?.role === 'ADMIN',
  })

  if (!redirectTarget) {
    return
  }

  return sendRedirect(event, redirectTarget, 302)
})
