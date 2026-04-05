import {
  AUTH_EMAIL_PATTERN,
  AUTH_PASSWORD_LETTER_PATTERN,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_PASSWORD_NUMBER_PATTERN,
} from '~/constants/auth'
import type {
  AuthFieldErrors,
  AuthValidationLocale,
  AuthValidationMessages,
  LoginFormField,
  PasswordPolicyRuleVm,
  RegisterFormField,
} from '~/types/auth-validation'

const authValidationMessages: Record<
  AuthValidationLocale,
  AuthValidationMessages
> = {
  en: {
    requiredName: 'Enter your full name.',
    requiredEmail: 'Enter your email address.',
    requiredPassword: 'Enter your password.',
    requiredConfirmPassword: 'Confirm your password.',
    invalidEmail: 'Enter a valid email address.',
    passwordTooShort: `Use at least ${AUTH_PASSWORD_MIN_LENGTH} characters.`,
    passwordRequiresLetter: 'Include at least one letter.',
    passwordRequiresNumber: 'Include at least one number.',
    passwordCannotBeBlank: 'Password cannot be only spaces.',
    passwordMismatch: 'Confirm password must match your password.',
    invalidCredentials: 'Invalid email or password.',
    genericLoginError: 'Unable to sign in right now. Please try again.',
    genericRegisterError: 'Unable to create your account right now. Please try again.',
    emailAlreadyExists: 'An account with this email already exists.',
    googleUnavailable: 'Google sign-in is not configured yet.',
    passwordHintTitle: 'Password requirements',
    passwordHintDescription:
      'Use a password that is easy for you to remember and hard for others to guess.',
    authFailureTitle: 'Unable to sign in',
    registerFailureTitle: 'Unable to create account',
    validationFailureTitle: 'Check the highlighted fields',
    retryLabel: 'Try again',
  },
  vi: {
    requiredName: 'Vui long nhap ho va ten.',
    requiredEmail: 'Vui long nhap dia chi email.',
    requiredPassword: 'Vui long nhap mat khau.',
    requiredConfirmPassword: 'Vui long xac nhan mat khau.',
    invalidEmail: 'Vui long nhap dung dinh dang email.',
    passwordTooShort: `Mat khau phai co it nhat ${AUTH_PASSWORD_MIN_LENGTH} ky tu.`,
    passwordRequiresLetter: 'Mat khau phai co it nhat mot chu cai.',
    passwordRequiresNumber: 'Mat khau phai co it nhat mot chu so.',
    passwordCannotBeBlank: 'Mat khau khong duoc chi gom khoang trang.',
    passwordMismatch: 'Mat khau xac nhan phai trung voi mat khau.',
    invalidCredentials: 'Email hoac mat khau khong hop le.',
    genericLoginError: 'Khong the dang nhap luc nay. Vui long thu lai.',
    genericRegisterError: 'Khong the tao tai khoan luc nay. Vui long thu lai.',
    emailAlreadyExists: 'Email nay da duoc su dung cho mot tai khoan khac.',
    googleUnavailable: 'Dang nhap bang Google chua duoc cau hinh.',
    passwordHintTitle: 'Yeu cau mat khau',
    passwordHintDescription:
      'Hay dung mat khau de nho voi ban va kho doan voi nguoi khac.',
    authFailureTitle: 'Khong the dang nhap',
    registerFailureTitle: 'Khong the tao tai khoan',
    validationFailureTitle: 'Hay kiem tra lai cac truong da danh dau',
    retryLabel: 'Thu lai',
  },
}

const pushFieldError = <TField extends string>(
  errors: AuthFieldErrors<TField>,
  field: TField,
  message: string,
) => {
  if (!message.trim()) {
    return
  }

  errors[field] = [...(errors[field] ?? []), message]
}

export const resolveAuthValidationLocale = (
  locale: string,
): AuthValidationLocale => {
  return locale === 'vi' ? 'vi' : 'en'
}

export const getAuthValidationMessages = (locale: string) => {
  return authValidationMessages[resolveAuthValidationLocale(locale)]
}

export const normalizeAuthEmail = (value: unknown) => {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

export const normalizeAuthName = (value: unknown) => {
  return typeof value === 'string' ? value.trim() : ''
}

export const getPasswordPolicyRules = (
  password: string,
  locale: string,
): PasswordPolicyRuleVm[] => {
  const messages = getAuthValidationMessages(locale)
  const safePassword = typeof password === 'string' ? password : ''

  return [
    {
      id: 'min_length',
      label: messages.passwordTooShort,
      valid: safePassword.length >= AUTH_PASSWORD_MIN_LENGTH,
    },
    {
      id: 'letter',
      label: messages.passwordRequiresLetter,
      valid: AUTH_PASSWORD_LETTER_PATTERN.test(safePassword),
    },
    {
      id: 'number',
      label: messages.passwordRequiresNumber,
      valid: AUTH_PASSWORD_NUMBER_PATTERN.test(safePassword),
    },
    {
      id: 'not_blank',
      label: messages.passwordCannotBeBlank,
      valid: safePassword.trim().length > 0,
    },
  ]
}

export const validatePassword = (
  password: string,
  locale: string,
): string[] => {
  const rules = getPasswordPolicyRules(password, locale)

  return rules.filter((rule) => !rule.valid).map((rule) => rule.label)
}

export const validateLoginFields = (
  input: {
    email: string
    password: string
  },
  locale: string,
): AuthFieldErrors<LoginFormField> => {
  const messages = getAuthValidationMessages(locale)
  const errors: AuthFieldErrors<LoginFormField> = {}
  const email = normalizeAuthEmail(input.email)

  if (!email) {
    pushFieldError(errors, 'email', messages.requiredEmail)
  } else if (!AUTH_EMAIL_PATTERN.test(email)) {
    pushFieldError(errors, 'email', messages.invalidEmail)
  }

  if (!input.password) {
    pushFieldError(errors, 'password', messages.requiredPassword)
  } else if (!input.password.trim()) {
    pushFieldError(errors, 'password', messages.passwordCannotBeBlank)
  }

  return errors
}

export const validateRegisterFields = (
  input: {
    name: string
    email: string
    password: string
    confirmPassword: string
  },
  locale: string,
): AuthFieldErrors<RegisterFormField> => {
  const messages = getAuthValidationMessages(locale)
  const errors: AuthFieldErrors<RegisterFormField> = {}
  const name = normalizeAuthName(input.name)
  const email = normalizeAuthEmail(input.email)

  if (!name) {
    pushFieldError(errors, 'name', messages.requiredName)
  }

  if (!email) {
    pushFieldError(errors, 'email', messages.requiredEmail)
  } else if (!AUTH_EMAIL_PATTERN.test(email)) {
    pushFieldError(errors, 'email', messages.invalidEmail)
  }

  if (!input.password) {
    pushFieldError(errors, 'password', messages.requiredPassword)
  } else {
    validatePassword(input.password, locale).forEach((message) => {
      pushFieldError(errors, 'password', message)
    })
  }

  if (!input.confirmPassword) {
    pushFieldError(errors, 'confirmPassword', messages.requiredConfirmPassword)
  } else if (input.password !== input.confirmPassword) {
    pushFieldError(errors, 'confirmPassword', messages.passwordMismatch)
  }

  return errors
}

export const hasAuthFieldErrors = <TField extends string>(
  errors: AuthFieldErrors<TField>,
) => {
  return Object.values(errors).some((messages) => {
    return Array.isArray(messages) && messages.length > 0
  })
}

export const getFirstAuthFieldError = <TField extends string>(
  errors: AuthFieldErrors<TField>,
  field: TField,
) => {
  return errors[field]?.[0] ?? ''
}
