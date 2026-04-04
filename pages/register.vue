<script setup lang="ts">
import {
  AUTH_EMAIL_PATTERN,
  AUTH_PASSWORD_MIN_LENGTH,
  DEFAULT_AUTH_REDIRECT,
  LOGIN_PATH,
  REDIRECT_QUERY_KEY,
  REGISTER_SUCCESS_QUERY_KEY,
} from '~/constants/auth'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'
import type { RegisterRequestBody, RegisterResponse } from '~/types/auth'
import type { AppError } from '~/types/app-error'

const route = useRoute()
const { locale } = useI18n()
const { requestLocal } = useApi()
const { normalize, getMessage, isRetryable } = useApiError()

useSeoMeta({
  title: 'Register',
})

const form = reactive<RegisterRequestBody>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validationMessage = ref('')
const actionError = ref<AppError | null>(null)
const isSubmitting = ref(false)

const copy = computed(() => {
  if (locale.value === 'vi') {
    return {
      eyebrow: 'Đăng ký',
      title: 'Tạo tài khoản MovieHub',
      description:
        'Đăng ký nhanh để lưu vé, tiếp tục thanh toán và mở rộng tài khoản sau này.',
      nameLabel: 'Họ và tên',
      emailLabel: 'Email',
      passwordLabel: 'Mật khẩu',
      confirmPasswordLabel: 'Xác nhận mật khẩu',
      submit: 'Tạo tài khoản',
      hasAccount: 'Đã có tài khoản?',
      login: 'Đăng nhập',
      required: 'Tất cả các trường là bắt buộc.',
      invalidEmail: 'Vui lòng nhập đúng định dạng email.',
      shortPassword: `Mật khẩu phải có ít nhất ${AUTH_PASSWORD_MIN_LENGTH} ký tự.`,
      passwordMismatch: 'Mật khẩu xác nhận chưa khớp.',
      genericError: 'Không thể đăng ký lúc này. Vui lòng thử lại.',
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
    required: 'All fields are required.',
    invalidEmail: 'Please enter a valid email address.',
    shortPassword: `Password must be at least ${AUTH_PASSWORD_MIN_LENGTH} characters long.`,
    passwordMismatch: 'Password and confirm password must match.',
    genericError: 'Unable to register right now. Please try again.',
  }
})

const redirectTarget = computed(() => {
  return sanitizeRedirectTarget(route.query[REDIRECT_QUERY_KEY]) || DEFAULT_AUTH_REDIRECT
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

const validateForm = () => {
  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.confirmPassword
  ) {
    return copy.value.required
  }

  if (!AUTH_EMAIL_PATTERN.test(form.email.trim())) {
    return copy.value.invalidEmail
  }

  if (form.password.length < AUTH_PASSWORD_MIN_LENGTH) {
    return copy.value.shortPassword
  }

  if (form.password !== form.confirmPassword) {
    return copy.value.passwordMismatch
  }

  return ''
}

const handleRegister = async () => {
  validationMessage.value = ''
  actionError.value = null

  const validationError = validateForm()

  if (validationError) {
    validationMessage.value = validationError
    return
  }

  isSubmitting.value = true

  try {
    await requestLocal<RegisterResponse>('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      },
      timeoutMs: 10000,
    })

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
    actionError.value = normalize(error)
  } finally {
    isSubmitting.value = false
  }
}

const actionErrorMessage = computed(() => {
  return actionError.value ? getMessage(actionError.value, 'action') : null
})

const actionErrorDescription = computed(() => {
  if (!actionError.value || !actionErrorMessage.value) {
    return ''
  }

  if (actionError.value.category !== 'validation' || !actionError.value.validation) {
    return actionErrorMessage.value.description
  }

  const validationMessages = Object.values(actionError.value.validation)
    .flat()
    .filter(Boolean)

  return validationMessages.length
    ? validationMessages.join(' ')
    : actionErrorMessage.value.description
})

const retryRegister = async () => {
  if (!actionError.value || !isRetryable(actionError.value) || isSubmitting.value) {
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
          <div
            v-if="validationMessage"
            class="rounded-2xl bg-amber-50 p-4 text-sm text-amber-700"
          >
            {{ validationMessage }}
          </div>

          <ActionErrorMessage
            v-if="actionError && actionErrorMessage"
            class="mt-4"
            :title="actionErrorMessage.title"
            :description="actionErrorDescription"
            :retryable="actionError.retryable"
            :retry-pending="isSubmitting"
            :retry-disabled="isSubmitting"
            :retry-label="actionErrorMessage.retryLabel"
            @retry="retryRegister"
          />

          <form class="mt-6 space-y-5" @submit.prevent="handleRegister">
            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.nameLabel }}</span>
              <input
                v-model="form.name"
                type="text"
                autocomplete="name"
                class="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-400"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.emailLabel }}</span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-400"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">{{ copy.passwordLabel }}</span>
              <input
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-400"
              />
            </label>

            <label class="block space-y-2">
              <span class="text-sm font-medium text-slate-700">
                {{ copy.confirmPasswordLabel }}
              </span>
              <input
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-400"
              />
            </label>

            <button class="btn-primary w-full" :disabled="isSubmitting">
              {{ isSubmitting ? `${copy.submit}...` : copy.submit }}
            </button>
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
