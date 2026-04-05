import type { AuthRole, AuthStatus } from '~/types/auth'
import type { NavigationItem } from '~/constants/navigation'

export const AUTH_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const

export const normalizeAuthRole = (role: unknown): AuthRole => {
  return role === AUTH_ROLES.ADMIN ? AUTH_ROLES.ADMIN : AUTH_ROLES.USER
}

export const isAuthenticatedStatus = (status: AuthStatus) => {
  return status === 'authenticated'
}

export const isAdminRole = (role: unknown) => {
  return normalizeAuthRole(role) === AUTH_ROLES.ADMIN
}

export const canViewAdminNavigation = (role: unknown, isAuthenticated: boolean) => {
  return isAuthenticated && isAdminRole(role)
}

export const canAccessAdminRoute = (role: unknown, isAuthenticated: boolean) => {
  return isAuthenticated && isAdminRole(role)
}

export const canAccessAuthenticatedRoute = (isAuthenticated: boolean) => {
  return isAuthenticated
}

export const canAccessGuestRoute = (isAuthenticated: boolean) => {
  return !isAuthenticated
}

export const canViewNavigationItem = (
  item: NavigationItem,
  context: {
    isAuthenticated: boolean
    role: unknown
  },
) => {
  if (item.requiresAdmin) {
    return canViewAdminNavigation(context.role, context.isAuthenticated)
  }

  if (item.requiresAuth) {
    return canAccessAuthenticatedRoute(context.isAuthenticated)
  }

  return true
}

