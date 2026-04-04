import { randomUUID } from 'node:crypto'

import type {
  AuthSessionUser,
  CredentialsSignInBody,
  StoredAuthUser,
} from '~/types/auth'
import { hashPassword, hashPasswordSync, verifyPassword } from './auth-password'

const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase()
}

const toAuthSessionUser = (user: StoredAuthUser): AuthSessionUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

const users: StoredAuthUser[] = [
  {
    id: 'user-seed-1',
    name: 'Movie Fan',
    email: 'user@moviehub.test',
    passwordHash: hashPasswordSync('Password123!'),
    role: 'USER',
  },
  {
    id: 'admin-seed-1',
    name: 'Cinema Admin',
    email: 'admin@moviehub.test',
    passwordHash: hashPasswordSync('Admin123!'),
    role: 'ADMIN',
  },
]

export const emailExists = (email: string) => {
  return users.some((user) => user.email === normalizeEmail(email))
}

export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === normalizeEmail(email)) ?? null
}

export const authenticateUser = async (
  credentials: CredentialsSignInBody,
): Promise<AuthSessionUser | null> => {
  const user = findUserByEmail(credentials.email)

  if (!user || !user.passwordHash) {
    return null
  }

  const isValidPassword = await verifyPassword(
    credentials.password,
    user.passwordHash,
  )

  if (!isValidPassword) {
    return null
  }

  return toAuthSessionUser(user)
}

export const registerUser = async (input: {
  name: string
  email: string
  password: string
}): Promise<AuthSessionUser> => {
  const newUser: StoredAuthUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    passwordHash: await hashPassword(input.password),
    role: 'USER',
  }

  users.push(newUser)

  return toAuthSessionUser(newUser)
}

export const findOrCreateOAuthUser = async (input: {
  name?: string | null
  email: string
}): Promise<AuthSessionUser> => {
  const existingUser = findUserByEmail(input.email)

  if (existingUser) {
    return toAuthSessionUser(existingUser)
  }

  const fallbackName = input.email.split('@')[0] ?? 'Movie User'
  const newUser: StoredAuthUser = {
    id: randomUUID(),
    name: input.name?.trim() || fallbackName,
    email: normalizeEmail(input.email),
    passwordHash: '',
    role: 'USER',
  }

  users.push(newUser)

  return toAuthSessionUser(newUser)
}
