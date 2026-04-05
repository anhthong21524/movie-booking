import type { RegisterRequestBody, RegisterResponse } from '~/types/auth'
import { getAuthValidationMessages, hasAuthFieldErrors, normalizeAuthEmail, normalizeAuthName, validateRegisterFields } from '~/utils/auth-validation'
import { registerUser } from '~/server/utils/auth-users'

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
  const body = await readBody<Partial<RegisterRequestBody>>(event)
  const messages = getAuthValidationMessages('en')

  const name = normalizeAuthName(body.name)
  const email = normalizeAuthEmail(body.email)
  const password = typeof body.password === 'string' ? body.password : ''
  const confirmPassword =
    typeof body.confirmPassword === 'string' ? body.confirmPassword : ''
  const fieldErrors = validateRegisterFields(
    {
      name,
      email,
      password,
      confirmPassword,
    },
    'en',
  )

  if (hasAuthFieldErrors(fieldErrors)) {
    throw createError({
      statusCode: 400,
      statusMessage: messages.validationFailureTitle,
      data: {
        validation: fieldErrors,
      },
    })
  }

  try {
    const user = await registerUser({ name, email, password })

    setResponseStatus(event, 201)

    return {
      message: 'Registration successful. Please sign in.',
      user,
    }
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status

    if (status === 409) {
      throw createError({
        statusCode: 409,
        statusMessage: messages.emailAlreadyExists,
        data: {
          code: 'EMAIL_EXISTS',
          validation: {
            email: [messages.emailAlreadyExists],
          },
        },
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed. Please try again.',
    })
  }
})
