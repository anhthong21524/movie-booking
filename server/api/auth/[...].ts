import type { AuthOptions } from 'next-auth'
import CredentialsProviderModule from 'next-auth/providers/credentials'
import GoogleProviderModule from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import type { AuthRole, CredentialsSignInBody } from '~/types/auth'
import {
  authenticateUser,
  findOrCreateOAuthUser,
} from '~/server/utils/auth-users'

const CredentialsProvider = (
  'default' in CredentialsProviderModule
    ? CredentialsProviderModule.default
    : CredentialsProviderModule
) as typeof import('next-auth/providers/credentials').default

const GoogleProvider = (
  'default' in GoogleProviderModule
    ? GoogleProviderModule.default
    : GoogleProviderModule
) as typeof import('next-auth/providers/google').default

const toCredentialsPayload = (
  credentials: Record<string, unknown> | undefined,
): CredentialsSignInBody | null => {
  const email =
    typeof credentials?.email === 'string' ? credentials.email.trim() : ''
  const password =
    typeof credentials?.password === 'string' ? credentials.password : ''

  if (!email || !password) {
    return null
  }

  return {
    email,
    password,
  }
}

const authOptions: AuthOptions = {
  secret: process.env.NUXT_AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        const payload = toCredentialsPayload(credentials)

        if (!payload) {
          return null
        }

        return authenticateUser(payload)
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
        return true
      }

      if (!user.email) {
        return false
      }

      const oauthUser = await findOrCreateOAuthUser({
        email: user.email,
        name: user.name,
      })

      user.id = oauthUser.id
      user.name = oauthUser.name
      user.email = oauthUser.email
      user.role = oauthUser.role

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role === 'ADMIN' ? 'ADMIN' : 'USER'
      }

      return token
    },
    async session({ session, token }) {
      if (!session.user || typeof token.id !== 'string' || token.id.length === 0) {
        return {
          ...session,
          expires: new Date(0).toISOString(),
          user: undefined,
        }
      }

      session.user.id = token.id
      session.user.name = String(token.name ?? '')
      session.user.email = String(token.email ?? '')
      session.user.role = (token.role as AuthRole | undefined) === 'ADMIN' ? 'ADMIN' : 'USER'

      return session
    },
  },
}

export default NuxtAuthHandler(authOptions)
