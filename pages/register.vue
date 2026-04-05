<script setup lang="ts">
import {
  DEFAULT_AUTH_REDIRECT,
  LOGIN_PATH,
  REDIRECT_QUERY_KEY,
  REGISTER_SUCCESS_QUERY_KEY,
} from '~/constants/auth'
import type { RegisterRequestBody, RegisterResponse } from '~/types/auth'
import type { AuthServerErrorVm, RegisterFormField } from '~/types/auth-validation'
import { normalizeRegisterServerError } from '~/utils/auth-error-messages'
import {
  getAuthValidationMessages,
  getFirstAuthFieldError,
  getPasswordPolicyRules,
  hasAuthFieldErrors,
  normalizeAuthEmail,
  normalizeAuthName,
  validateRegisterFields,
} from '~/utils/auth-validation'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'

const route = useRoute()
const appAuth = useAppAuth()
const userStore = useUserStore()
const { locale } = useI18n()
const { requestLocal } = useApi()

useSeoMeta({
  title: 'Register',
})

const form = reactive<RegisterRequestBody>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const touched = reactive<Record<RegisterFormField, boolean>>({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})
const dirty = reactive<Record<RegisterFormField, boolean>>({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})

const submitState = ref<
  'pristine' | 'submitting' | 'submit_failed' | 'submit_succeeded'
>('pristine')
const isSubmitting = ref(false)
const serverError = ref<AuthServerErrorVm<RegisterFormField> | null>(null)

const validationMessages = computed(() => {
  return getAuthValidationMessages(locale.value)
})

const copy = computed(() => {
  if (locale.value === 'vi') {
    return {
      eyebrow: 'Dang ky',
      title: 'Tao tai khoan MovieHub',
      description:
        'Dang ky nhanh de luu ve, tiep tuc thanh toan va mo rong tai khoan sau nay.',
      nameLabel: 'Ho va ten',
      emailLabel: 'Email',
      passwordLabel: 'Mat khau',
      confirmPasswordLabel: 'Xac nhan mat khau',
      submit: 'Tao tai khoan',
      hasAccount: 'Da co tai khoan?',
      login: 'Dang nhap',
    }
  }

  return {
    eyebrow: 'Register',
    title: 'Create your MovieHub account',
    description:
      'Sign up to save tickets, continue checkout, and grow this authentication flow later with a real backend.',
    nameLabel: 'Full name',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm password',
    submit: 'Create account',
    hasAccount: 'Already have an account?',
    login: 'Login',
  }
})

const redirectTarget = computed(() => {
  return (
    sanitizeRedirectTarget(route.query[REDIRECT_QUERY_KEY]) ||
    DEFAULT_AUTH_REDIRECT
  )
})

const loginLink = computed(() => {
  if (redirectTarget.value === DEFAULT_AUTH_REDIRECT) {
    return LOGIN_PATH
  }

  return {
    path: LOGIN_PATH,
    query: {
      [REDIRECT_QUERY_KEY]: redirectTarget.value,
    },
  }
})

const clientFieldErrors = computed(() => {
  return validateRegisterFields(form, locale.value)
})

const passwordRules = computed(() => {
  return getPasswordPolicyRules(form.password, locale.value)
})

const hasSubmitted = computed(() => submitState.value !== 'pristine')

const markFieldTouched = (field: RegisterFormField) => {
  touched[field] = true
}

const markAllTouched = () => {
  touched.name = true
  touched.email = true
  touched.password = true
  touched.confirmPassword = true
}

const clearServerError = () => {
  if (serverError.value) {
    serverError.value = null
  }
}

const clearSubmitFailureState = () => {
  if (submitState.value === 'submit_failed') {
    submitState.value = 'pristine'
  }
}

const handleFieldInput = (field: RegisterFormField) => {
  dirty[field] = true
  clearServerError()
}

const redirectAuthenticatedUser = async () => {
  await appAuth.ensureResolved()

  if (!userStore.isAuthenticated) {
    return false
  }

  clearServerError()
  clearSubmitFailureState()
  await navigateTo(redirectTarget.value, {
    replace: true,
  })
  return true
}

onMounted(async () => {
  await redirectAuthenticatedUser()
})

watch(
  () => userStore.isAuthenticated,
  async (isAuthenticated) => {
    if (!isAuthenticated) {
      return
    }

    await redirectAuthenticatedUser()
  },
)

const getVisibleFieldError = (field: RegisterFormField) => {
  if (!touched[field] && !hasSubmitted.value) {
    return ''
  }

  return (
    getFirstAuthFieldError(clientFieldErrors.value, field) ||
    serverError.value?.fieldErrors[field]?.[0] ||
    ''
  )
}

const hasServerFieldErrors = computed(() => {
  return Boolean(
    serverError.value &&
      Object.values(serverError.value.fieldErrors).some((messages) => messages?.length),
  )
})

const shouldShowServerBanner = computed(() => {
  return Boolean(serverError.value && (!hasServerFieldErrors.value || serverError.value.retryable))
})

const isFieldInvalid = (field: RegisterFormField) => {
  return Boolean(getVisibleFieldError(field))
}

const getFieldInputClass = (field: RegisterFormField) => {
  return [
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
    isFieldInvalid(field)
      ? 'border-rose-300 focus:border-rose-400'
      : 'border-border focus:border-primary-400',
  ]
}

const handleRegister = async () => {
  clearServerError()
  markAllTouched()

  if (await redirectAuthenticatedUser()) {
    return
  }

  if (hasAuthFieldErrors(clientFieldErrors.value)) {
    submitState.value = 'submit_failed'
    return
  }

  submitState.value = 'submitting'
  isSubmitting.value = true

  try {
    await requestLocal<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: {
        name: normalizeAuthName(form.name),
        email: normalizeAuthEmail(form.email),
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
      timeoutMs: 10000,
    })

    submitState.value = 'submit_succeeded'

    const query =
      redirectTarget.value === DEFAULT_AUTH_REDIRECT
        ? { [REGISTER_SUCCESS_QUERY_KEY]: '1' }
        : {
            [REGISTER_SUCCESS_QUERY_KEY]: '1',
            [REDIRECT_QUERY_KEY]: redirectTarget.value,
          }

    await navigateTo({
      path: LOGIN_PATH,
      query,
    })
  } catch (error) {
    submitState.value = 'submit_failed'
    serverError.value = normalizeRegisterServerError(error, locale.value)
  } finally {
    isSubmitting.value = false
  }
}

const retryRegister = async () => {
  if (!serverError.value?.retryable || isSubmitting.value) {
    return
  }

  await handleRegister()
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <section class="card overflow-hidden">
      <div class="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div
          class="bg-gradient-to-br from-slate-950 via-slate-900 to-primary-700 p-8 text-white"
        >
          <p
            class="text-sm font-semibold uppercase tracking-[0.24em] text-white/80"
          >
            {{ copy.eyebrow }}
          </p>
          <h1 class="mt-4 text-4xl font-bold">{{ copy.title }}</h1>
          <p class="mt-4 max-w-md text-white/85">
            {{ copy.description }}
          </p>
        </div>

        <div class="p-8">
          <FormErrorBanner
            v-if="serverError && shouldShowServerBanner"
            :title="serverError.title"
            :description="serverError.description"
            :retryable="serverError.retryable"
            :retry-label="serverError.retryLabel"
            :retry-pending="isSubmitting"
            :retry-disabled="isSubmitting"
            @retry="retryRegister"
          />

          <form class="mt-6 space-y-5" novalidate @submit.prevent="handleRegister">
            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.nameLabel }}</span>
              <input
                v-model="form.name"
                type="text"
                autocomplete="name"
                :class="getFieldInputClass('name')"
                :aria-invalid="isFieldInvalid('name')"
                :aria-describedby="getVisibleFieldError('name') ? 'register-name-error' : undefined"
                @input="handleFieldInput('name')"
                @blur="markFieldTouched('name')"
              />
              <FieldErrorText
                id="register-name-error"
                :message="getVisibleFieldError('name')"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.emailLabel }}</span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                :class="getFieldInputClass('email')"
                :aria-invalid="isFieldInvalid('email')"
                :aria-describedby="getVisibleFieldError('email') ? 'register-email-error' : undefined"
                @input="handleFieldInput('email')"
                @blur="markFieldTouched('email')"
              />
              <FieldErrorText
                id="register-email-error"
                :message="getVisibleFieldError('email')"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.passwordLabel }}</span>
              <input
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                :class="getFieldInputClass('password')"
                :aria-invalid="isFieldInvalid('password')"
                :aria-describedby="getVisibleFieldError('password') ? 'register-password-error' : undefined"
                @input="handleFieldInput('password')"
                @blur="markFieldTouched('password')"
              />
              <FieldErrorText
                id="register-password-error"
                :message="getVisibleFieldError('password')"
              />
            </label>

            <PasswordRulesHint
              :title="validationMessages.passwordHintTitle"
              :description="validationMessages.passwordHintDescription"
              :rules="passwordRules"
            />

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">
                {{ copy.confirmPasswordLabel }}
              </span>
              <input
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                :class="getFieldInputClass('confirmPassword')"
                :aria-invalid="isFieldInvalid('confirmPassword')"
                :aria-describedby="
                  getVisibleFieldError('confirmPassword')
                    ? 'register-confirm-password-error'
                    : undefined
                "
                @input="handleFieldInput('confirmPassword')"
                @blur="markFieldTouched('confirmPassword')"
              />
              <FieldErrorText
                id="register-confirm-password-error"
                :message="getVisibleFieldError('confirmPassword')"
              />
            </label>

            <LoadingButton
              type="submit"
              block
              :label="copy.submit"
              :loading="isSubmitting"
              :loading-label="`${copy.submit}...`"
            />
          </form>

          <p class="mt-6 text-sm text-slate-600">
            {{ copy.hasAccount }}
            <NuxtLink :to="loginLink" class="font-semibold text-primary-600">
              {{ copy.login }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
