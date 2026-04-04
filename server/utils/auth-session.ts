import { getServerSession } from '#auth'
import type { H3Event } from 'h3'
import type { AuthRole, AuthSessionUser } from '~/types/auth'

const normalizeRole = (role: unknown): AuthRole => {
  return role === 'ADMIN' ? 'ADMIN' : 'USER'
}

export const getServerSessionUser = async (
  event: H3Event,
): Promise<AuthSessionUser | null> => {
  const session = await getServerSession(event)
  const sessionUser = session?.user

  if (!sessionUser?.id) {
    return null
  }

  return {
    id: sessionUser.id,
    name: typeof sessionUser.name === 'string' ? sessionUser.name : '',
    email: typeof sessionUser.email === 'string' ? sessionUser.email : '',
    role: normalizeRole(sessionUser.role),
  }
}

export const requireServerSessionUser = async (event: H3Event) => {
  const user = await getServerSessionUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required.',
    })
  }

  return user
}

export const requireServerRole = async (event: H3Event, role: AuthRole) => {
  const user = await requireServerSessionUser(event)

  if (user.role !== role) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Insufficient permissions.',
    })
  }

  return user
}
