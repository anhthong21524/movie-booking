import type { AppError } from '~/types/app-error'
import type {
  AuthFieldErrors,
  AuthServerErrorVm,
  LoginFormField,
  RegisterFormField,
} from '~/types/auth-validation'
import { normalizeApiError } from '~/utils/app-error'
import { getAuthValidationMessages } from '~/utils/auth-validation'

const CREDENTIAL_ERROR_CODES = new Set([
  'CredentialsSignin',
  'CallbackRouteError',
  'AccessDenied',
])

const toFieldErrors = <TField extends string>(
  value: AppError['validation'],
): AuthFieldErrors<TField> => {
  if (!value) {
    return {}
  }

  return Object.entries(value).reduce<AuthFieldErrors<TField>>(
    (accumulator, [field, messages]) => {
      if (messages?.length) {
        accumulator[field as TField] = [...messages]
      }

      return accumulator
    },
    {},
  )
}

const isCredentialFailure = (error: unknown) => {
  if (typeof error !== 'string') {
    return false
  }

  return CREDENTIAL_ERROR_CODES.has(error) || error.includes('CredentialsSignin')
}

export const normalizeLoginServerError = (
  error: unknown,
  locale: string,
): AuthServerErrorVm<LoginFormField> => {
  const messages = getAuthValidationMessages(locale)

  if (isCredentialFailure(error)) {
    return {
      title: messages.authFailureTitle,
      description: messages.invalidCredentials,
      fieldErrors: {},
      retryable: false,
      retryLabel: messages.retryLabel,
    }
  }

  const normalized = normalizeApiError(error)

  if (
    normalized.category === 'unauthorized' ||
    normalized.category === 'forbidden'
  ) {
    return {
      title: messages.authFailureTitle,
      description: messages.invalidCredentials,
      fieldErrors: {},
      retryable: false,
      retryLabel: messages.retryLabel,
    }
  }

  return {
    title: messages.authFailureTitle,
    description: messages.genericLoginError,
    fieldErrors: {},
    retryable: normalized.retryable,
    retryLabel: messages.retryLabel,
  }
}

export const normalizeRegisterServerError = (
  error: unknown,
  locale: string,
): AuthServerErrorVm<RegisterFormField> => {
  const messages = getAuthValidationMessages(locale)
  const normalized = normalizeApiError(error)
  const fieldErrors = toFieldErrors<RegisterFormField>(normalized.validation)

  if (normalized.category === 'validation') {
    return {
      title: messages.validationFailureTitle,
      description: messages.genericRegisterError,
      fieldErrors,
      retryable: false,
      retryLabel: messages.retryLabel,
    }
  }

  if (normalized.category === 'conflict') {
    return {
      title: messages.registerFailureTitle,
      description: messages.emailAlreadyExists,
      fieldErrors: Object.keys(fieldErrors).length
        ? fieldErrors
        : { email: [messages.emailAlreadyExists] },
      retryable: false,
      retryLabel: messages.retryLabel,
    }
  }

  return {
    title: messages.registerFailureTitle,
    description: messages.genericRegisterError,
    fieldErrors,
    retryable: normalized.retryable,
    retryLabel: messages.retryLabel,
  }
}
