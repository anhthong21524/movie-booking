export type AuthRole = 'USER' | 'ADMIN'

export interface AuthSessionUser {
  id: string
  name: string
  email: string
  role: AuthRole
}

export interface CredentialsSignInBody {
  email: string
  password: string
}

export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterResponse {
  message: string
  user: AuthSessionUser
}

export interface StoredAuthUser extends AuthSessionUser {
  passwordHash: string
}
