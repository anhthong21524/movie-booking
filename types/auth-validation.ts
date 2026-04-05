export type AuthValidationLocale = 'en' | 'vi'

export type LoginFormField = 'email' | 'password'
export type RegisterFormField =
  | 'name'
  | 'email'
  | 'password'
  | 'confirmPassword'

export type AuthFieldErrors<TField extends string> = Partial<
  Record<TField, string[]>
>

export interface PasswordPolicyRuleVm {
  id: 'min_length' | 'letter' | 'number' | 'not_blank'
  label: string
  valid: boolean
}

export interface AuthValidationMessages {
  requiredName: string
  requiredEmail: string
  requiredPassword: string
  requiredConfirmPassword: string
  invalidEmail: string
  passwordTooShort: string
  passwordRequiresLetter: string
  passwordRequiresNumber: string
  passwordCannotBeBlank: string
  passwordMismatch: string
  invalidCredentials: string
  genericLoginError: string
  genericRegisterError: string
  emailAlreadyExists: string
  googleUnavailable: string
  passwordHintTitle: string
  passwordHintDescription: string
  authFailureTitle: string
  registerFailureTitle: string
  validationFailureTitle: string
  retryLabel: string
}

export interface AuthServerErrorVm<TField extends string> {
  title: string
  description: string
  fieldErrors: AuthFieldErrors<TField>
  retryable: boolean
  retryLabel: string
}
