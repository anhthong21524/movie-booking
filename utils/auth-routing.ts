import {
  ADMIN_PATH_PREFIXES,
  AUTH_ONLY_PATH_PREFIXES,
  AUTH_ONLY_PATHS,
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_PUBLIC_REDIRECT,
  GUEST_ONLY_PATHS,
  LOGIN_PATH,
  REDIRECT_QUERY_KEY,
} from '~/constants/auth'
import {
  canAccessAdminRoute,
  canAccessAuthenticatedRoute,
  canAccessGuestRoute,
} from '~/utils/authz'

export type AppRouteAccess = 'public' | 'auth' | 'admin' | 'guest'
export interface RouteAccessContext {
  access: AppRouteAccess
  fullPath: string
  isAuthenticated: boolean
  isAdmin: boolean
}

const hasPathMatch = (path: string, candidate: string) => {
  return path === candidate || path.startsWith(`${candidate}/`)
}

export const classifyRouteAccess = (path: string): AppRouteAccess => {
  if ((GUEST_ONLY_PATHS as readonly string[]).includes(path)) {
    return 'guest'
  }

  if ((AUTH_ONLY_PATHS as readonly string[]).includes(path)) {
    return 'auth'
  }

  if (AUTH_ONLY_PATH_PREFIXES.some((prefix) => hasPathMatch(path, prefix))) {
    return 'auth'
  }

  if (ADMIN_PATH_PREFIXES.some((prefix) => hasPathMatch(path, prefix))) {
    return 'admin'
  }

  return 'public'
}

export const sanitizeRedirectTarget = (value: unknown) => {
  if (typeof value !== 'string' || value.length === 0 || !value.startsWith('/')) {
    return DEFAULT_PUBLIC_REDIRECT
  }

  if (value.startsWith('//') || value.startsWith('/\\')) {
    return DEFAULT_PUBLIC_REDIRECT
  }

  try {
    const normalized = new URL(value, 'http://localhost')

    if (normalized.origin !== 'http://localhost') {
      return DEFAULT_PUBLIC_REDIRECT
    }

    return `${normalized.pathname}${normalized.search}${normalized.hash}`
  } catch {
    return DEFAULT_PUBLIC_REDIRECT
  }
}

export const buildLoginRedirectLocation = (target: string) => {
  return {
    path: LOGIN_PATH,
    query: {
      [REDIRECT_QUERY_KEY]: sanitizeRedirectTarget(target),
    },
  }
}

export const buildLoginRedirectPath = (target: string) => {
  const redirectTarget = sanitizeRedirectTarget(target)

  if (redirectTarget === DEFAULT_PUBLIC_REDIRECT) {
    return LOGIN_PATH
  }

  const searchParams = new URLSearchParams({
    [REDIRECT_QUERY_KEY]: redirectTarget,
  })

  return `${LOGIN_PATH}?${searchParams.toString()}`
}

export const resolveRouteRedirect = ({
  access,
  fullPath,
  isAuthenticated,
  isAdmin,
}: RouteAccessContext) => {
  if (access === 'public') {
    return null
  }

  if (access === 'guest') {
    return canAccessGuestRoute(isAuthenticated) ? null : DEFAULT_AUTH_REDIRECT
  }

  if (!canAccessAuthenticatedRoute(isAuthenticated)) {
    return buildLoginRedirectPath(fullPath)
  }

  if (access === 'admin' && !canAccessAdminRoute(isAdmin ? 'ADMIN' : 'USER', isAuthenticated)) {
    return DEFAULT_AUTH_REDIRECT
  }

  return null
}

export const shouldSkipServerRouteProtection = (path: string) => {
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/__nuxt_error') ||
    path.startsWith('/__vite_ping')
  ) {
    return true
  }

  return path.includes('.')
}
