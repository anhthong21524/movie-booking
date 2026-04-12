import type {
  AuthRole,
  AuthSessionUser,
  CredentialsSignInBody,
} from '~/types/auth'

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const backendUrl = () =>
  process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080'

const decodeJwtExpiry = (token: string): number | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'))
    return typeof decoded.exp === 'number' ? decoded.exp : null
  } catch {
    return null
  }
}

interface BackendAuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    email: string
    role: string
  }
}

interface BackendRefreshResponse {
  accessToken: string
  refreshToken: string
}

export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string; accessTokenExpiresAt: number } | null> => {
  try {
    const data = await $fetch<BackendRefreshResponse>(
      `${backendUrl()}/api/v1/auth/refresh`,
      {
        method: 'POST',
        body: { refreshToken },
      },
    )

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpiresAt: decodeJwtExpiry(data.accessToken) ?? 0,
    }
  } catch {
    return null
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
): Promise<(AuthSessionUser & { accessToken: string; refreshToken: string; accessTokenExpiresAt: number }) | null> => {
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
      refreshToken: data.refreshToken,
      accessTokenExpiresAt: decodeJwtExpiry(data.accessToken) ?? 0,
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
}): Promise<AuthSessionUser & { accessToken: string; refreshToken: string; accessTokenExpiresAt: number }> => {
  const normalizedEmail = normalizeEmail(input.email)

  const data = await $fetch<BackendAuthResponse>(
    `${backendUrl()}/api/v1/auth/oauth`,
    {
      method: 'POST',
      body: { email: normalizedEmail },
    },
  )

  const nameFromEmail = data.user.email.split('@')[0] ?? 'User'

  return {
    id: String(data.user.id),
    name: input.name?.trim() || nameFromEmail,
    email: data.user.email,
    role: (data.user.role === 'ADMIN' ? 'ADMIN' : 'USER') as AuthRole,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessTokenExpiresAt: decodeJwtExpiry(data.accessToken) ?? 0,
  }
}
