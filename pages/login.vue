<script setup lang="ts">
import {
  DEFAULT_AUTH_REDIRECT,
  REDIRECT_QUERY_KEY,
  REGISTER_PATH,
  REGISTER_SUCCESS_QUERY_KEY,
} from '~/constants/auth'
import type { CredentialsSignInBody } from '~/types/auth'
import type { AuthServerErrorVm, LoginFormField } from '~/types/auth-validation'
import { normalizeLoginServerError } from '~/utils/auth-error-messages'
import {
  getAuthValidationMessages,
  getFirstAuthFieldError,
  hasAuthFieldErrors,
  normalizeAuthEmail,
  validateLoginFields,
} from '~/utils/auth-validation'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'

const route = useRoute()
const { getProviders, signIn } = useAuth()
const { locale } = useI18n()

useSeoMeta({
  title: 'Login',
})

const form = reactive<CredentialsSignInBody>({
  email: '',
  password: '',
})

const touched = reactive<Record<LoginFormField, boolean>>({
  email: false,
  password: false,
})
const dirty = reactive<Record<LoginFormField, boolean>>({
  email: false,
  password: false,
})

const submitState = ref<
  'pristine' | 'submitting' | 'submit_failed' | 'submit_succeeded'
>('pristine')
const isSubmitting = ref(false)
const isGoogleSubmitting = ref(false)
const providers = ref<Record<string, unknown> | null>(null)
const serverError = ref<AuthServerErrorVm<LoginFormField> | null>(null)

const validationMessages = computed(() => {
  return getAuthValidationMessages(locale.value)
})

const copy = computed(() => {
  if (locale.value === 'vi') {
    return {
      eyebrow: 'Tai khoan',
      title: 'Dang nhap de tiep tuc dat ve',
      description:
        'Su dung email va mat khau hoac Google de quay lai luong dat ve cua ban.',
      emailLabel: 'Email',
      passwordLabel: 'Mat khau',
      submit: 'Dang nhap',
      google: 'Tiep tuc voi Google',
      noAccount: 'Chua co tai khoan?',
      register: 'Tao tai khoan',
      registeredSuccess:
        'Dang ky thanh cong. Ban co the dang nhap ngay bay gio.',
    }
  }

  return {
    eyebrow: 'Account',
    title: 'Sign in to continue booking',
    description:
      'Use your email and password or continue with Google to return to your booking flow.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    submit: 'Login',
    google: 'Continue with Google',
    noAccount: "Don't have an account?",
    register: 'Create one',
    registeredSuccess: 'Registration successful. You can sign in now.',
  }
})

const redirectTarget = computed(() => {
  return (
    sanitizeRedirectTarget(route.query[REDIRECT_QUERY_KEY]) ||
    DEFAULT_AUTH_REDIRECT
  )
})

const successMessage = computed(() => {
  return route.query[REGISTER_SUCCESS_QUERY_KEY] === '1'
    ? copy.value.registeredSuccess
    : ''
})

const registerLink = computed(() => {
  if (redirectTarget.value === DEFAULT_AUTH_REDIRECT) {
    return REGISTER_PATH
  }

  return {
    path: REGISTER_PATH,
    query: {
      [REDIRECT_QUERY_KEY]: redirectTarget.value,
    },
  }
})

const hasGoogleProvider = computed(() => Boolean(providers.value?.google))

const clientFieldErrors = computed(() => {
  return validateLoginFields(form, locale.value)
})

const hasSubmitted = computed(() => submitState.value !== 'pristine')

const markFieldTouched = (field: LoginFormField) => {
  touched[field] = true
}

const markAllTouched = () => {
  touched.email = true
  touched.password = true
}

const clearServerError = () => {
  if (serverError.value) {
    serverError.value = null
  }
}

const handleFieldInput = (field: LoginFormField) => {
  dirty[field] = true
  clearServerError()
}

const getVisibleFieldError = (field: LoginFormField) => {
  if (!touched[field] && !hasSubmitted.value) {
    return ''
  }

  return getFirstAuthFieldError(clientFieldErrors.value, field)
}

const isFieldInvalid = (field: LoginFormField) => {
  return Boolean(getVisibleFieldError(field))
}

const getFieldInputClass = (field: LoginFormField) => {
  return [
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
    isFieldInvalid(field)
      ? 'border-rose-300 focus:border-rose-400'
      : 'border-border focus:border-primary-400',
  ]
}

onMounted(async () => {
  providers.value = await getProviders()
})

const handleCredentialsLogin = async () => {
  clearServerError()
  markAllTouched()

  if (hasAuthFieldErrors(clientFieldErrors.value)) {
    submitState.value = 'submit_failed'
    return
  }

  submitState.value = 'submitting'
  isSubmitting.value = true

  try {
    const result = await signIn('credentials', {
      email: normalizeAuthEmail(form.email),
      password: form.password,
      callbackUrl: redirectTarget.value,
      redirect: false,
    })

    if (result?.error) {
      submitState.value = 'submit_failed'
      serverError.value = normalizeLoginServerError(result.error, locale.value)
      return
    }

    submitState.value = 'submit_succeeded'
    await navigateTo(result?.url || redirectTarget.value)
  } catch (error) {
    submitState.value = 'submit_failed'
    serverError.value = normalizeLoginServerError(error, locale.value)
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleLogin = async () => {
  clearServerError()

  if (!hasGoogleProvider.value) {
    submitState.value = 'submit_failed'
    serverError.value = {
      title: validationMessages.value.authFailureTitle,
      description: validationMessages.value.googleUnavailable,
      fieldErrors: {},
      retryable: false,
      retryLabel: validationMessages.value.retryLabel,
    }
    return
  }

  isGoogleSubmitting.value = true

  try {
    await signIn('google', {
      callbackUrl: redirectTarget.value,
    })
  } catch (error) {
    submitState.value = 'submit_failed'
    serverError.value = normalizeLoginServerError(error, locale.value)
    isGoogleSubmitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <section class="card overflow-hidden">
      <div class="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div
          class="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8 text-white"
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
          <div
            v-if="successMessage"
            class="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {{ successMessage }}
          </div>

          <FormErrorBanner
            v-if="serverError"
            class="mt-4"
            :title="serverError.title"
            :description="serverError.description"
          />

          <form class="mt-6 space-y-5" novalidate @submit.prevent="handleCredentialsLogin">
            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.emailLabel }}</span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                :class="getFieldInputClass('email')"
                :aria-invalid="isFieldInvalid('email')"
                :aria-describedby="getVisibleFieldError('email') ? 'login-email-error' : undefined"
                @input="handleFieldInput('email')"
                @blur="markFieldTouched('email')"
              />
              <FieldErrorText
                id="login-email-error"
                :message="getVisibleFieldError('email')"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.passwordLabel }}</span>
              <input
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                :class="getFieldInputClass('password')"
                :aria-invalid="isFieldInvalid('password')"
                :aria-describedby="
                  getVisibleFieldError('password') ? 'login-password-error' : undefined
                "
                @input="handleFieldInput('password')"
                @blur="markFieldTouched('password')"
              />
              <FieldErrorText
                id="login-password-error"
                :message="getVisibleFieldError('password')"
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

          <LoadingButton
            class="mt-4"
            variant="secondary"
            block
            :label="copy.google"
            :loading="isGoogleSubmitting"
            :loading-label="`${copy.google}...`"
            :disabled="!hasGoogleProvider"
            @click="handleGoogleLogin"
          />

          <p class="mt-6 text-sm text-slate-600">
            {{ copy.noAccount }}
            <NuxtLink :to="registerLink" class="font-semibold text-primary-600">
              {{ copy.register }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
