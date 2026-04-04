import {
  AUTH_EMAIL_PATTERN,
  AUTH_PASSWORD_MIN_LENGTH,
} from '~/constants/auth'
import type { RegisterRequestBody, RegisterResponse } from '~/types/auth'
import { emailExists, registerUser } from '~/server/utils/auth-users'

const normalizeField = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
  const body = await readBody<Partial<RegisterRequestBody>>(event)

  const name = normalizeField(body.name)
  const email = normalizeField(body.email).toLowerCase()
  const password = typeof body.password === 'string' ? body.password : ''
  const confirmPassword =
    typeof body.confirmPassword === 'string' ? body.confirmPassword : ''

  if (!name || !email || !password || !confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'All fields are required.',
    })
  }

  if (!AUTH_EMAIL_PATTERN.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please enter a valid email address.',
    })
  }

  if (password.length < AUTH_PASSWORD_MIN_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters long.`,
    })
  }

  if (password !== confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password and confirm password must match.',
    })
  }

  if (emailExists(email)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'An account with this email already exists.',
    })
  }

  const user = await registerUser({
    name,
    email,
    password,
  })

  setResponseStatus(event, 201)

  return {
    message: 'Registration successful. Please sign in.',
    user,
  }
})
