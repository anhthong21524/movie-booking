import type {
  AuthRole,
  AuthSessionUser,
  CredentialsSignInBody,
} from '~/types/auth'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const backendUrl = () =>
  process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080'

interface BackendAuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    role: string
  }
}

interface BackendRegisterResponse {
  accessToken: string
  user: {
    id: number
    email: string
    name: string
    role: string
  }
}

export const authenticateUser = async (
  credentials: CredentialsSignInBody,
): Promise<(AuthSessionUser & { accessToken: string }) | null> => {
  try {
    const data = await $fetch<BackendAuthResponse>(
      `${backendUrl()}/api/v1/auth/login`,
      {
        method: 'POST',
        body: { email: credentials.email, password: credentials.password },
      },
    )

    const nameFromEmail = data.user.email.split('@')[0] ?? 'User'

    return {
      id: String(data.user.id),
      name: nameFromEmail,
      email: data.user.email,
      role: (data.user.role === 'ADMIN' ? 'ADMIN' : 'USER') as AuthRole,
      accessToken: data.accessToken,
    }
  } catch {
    return null
  }
}

export const registerUser = async (input: {
  name: string
  email: string
  password: string
}): Promise<AuthSessionUser & { accessToken: string }> => {
  const data = await $fetch<BackendRegisterResponse>(
    `${backendUrl()}/api/v1/auth/register`,
    {
      method: 'POST',
      body: {
        name: input.name.trim(),
        email: normalizeEmail(input.email),
        password: input.password,
      },
    },
  )

  return {
    id: String(data.user.id),
    name: data.user.name,
    email: data.user.email,
    role: (data.user.role === 'ADMIN' ? 'ADMIN' : 'USER') as AuthRole,
    accessToken: data.accessToken,
  }
}

export const findOrCreateOAuthUser = async (input: {
  name?: string | null
  email: string
}): Promise<AuthSessionUser> => {
  const fallbackName =
    input.name?.trim() || input.email.split('@')[0] || 'Movie User'

  return {
    id: normalizeEmail(input.email),
    name: fallbackName,
    email: normalizeEmail(input.email),
    role: 'USER' as AuthRole,
  }
}
