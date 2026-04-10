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
const appAuth = useAppAuth()
const userStore = useUserStore()
const { getProviders, signIn } = useAuth()
const { locale, t } = useI18n()

useSeoMeta({
  title: t('authPages.loginSeoTitle'),
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

const redirectTarget = computed(() => {
  return (
    sanitizeRedirectTarget(route.query[REDIRECT_QUERY_KEY]) ||
    DEFAULT_AUTH_REDIRECT
  )
})

const successMessage = computed(() => {
  return route.query[REGISTER_SUCCESS_QUERY_KEY] === '1'
    ? t('authPages.registeredSuccess')
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

const clearSubmitFailureState = () => {
  if (submitState.value === 'submit_failed') {
    submitState.value = 'pristine'
  }
}

const handleFieldInput = (field: LoginFormField) => {
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

const handleCredentialsLogin = async () => {
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

  if (await redirectAuthenticatedUser()) {
    return
  }

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
          >{{ t('authPages.loginEyebrow') }}</p>
          <h1 class="mt-4 text-4xl font-bold">{{ t('authPages.loginTitle') }}</h1>
          <p class="mt-4 max-w-md text-white/85">
            {{ t('authPages.loginDescription') }}
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
              <span class="text-sm font-medium text-slate-700">{{ t('authPages.emailLabel') }}</span>
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
              <span class="text-sm font-medium text-slate-700">{{ t('authPages.passwordLabel') }}</span>
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
              :label="t('authPages.loginSubmit')"
              :loading="isSubmitting"
              :loading-label="`${t('authPages.loginSubmit')}...`"
            />
          </form>

          <LoadingButton
            class="mt-4"
            variant="secondary"
            block
            :label="t('authPages.continueWithGoogle')"
            :loading="isGoogleSubmitting"
            :loading-label="`${t('authPages.continueWithGoogle')}...`"
            :disabled="!hasGoogleProvider"
            @click="handleGoogleLogin"
          />

          <p class="mt-6 text-sm text-slate-600">
            {{ t('authPages.noAccount') }}
            <NuxtLink :to="registerLink" class="font-semibold text-primary-600">
              {{ t('authPages.createAccount') }}
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
