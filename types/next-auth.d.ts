import type { DefaultSession, DefaultUser } from 'next-auth'
import type { JWT as DefaultJWT } from 'next-auth/jwt'
import type { AuthRole } from '~/types/auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: AuthRole
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    name: string
    email: string
    role: AuthRole
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string
    name?: string | null
    email?: string | null
    role?: AuthRole
    accessToken?: string
  }
}
