import {
  ADMIN_PATH_PREFIXES,
  AUTH_ONLY_PATH_PREFIXES,
  AUTH_ONLY_PATHS,
  DEFAULT_PUBLIC_REDIRECT,
  GUEST_ONLY_PATHS,
  LOGIN_PATH,
  REDIRECT_QUERY_KEY,
} from '~/constants/auth'

export type AppRouteAccess = 'public' | 'auth' | 'admin' | 'guest'

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
