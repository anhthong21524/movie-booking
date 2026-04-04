<script setup lang="ts">
import {
  AUTH_EMAIL_PATTERN,
  DEFAULT_AUTH_REDIRECT,
  REDIRECT_QUERY_KEY,
  REGISTER_PATH,
  REGISTER_SUCCESS_QUERY_KEY,
} from '~/constants/auth'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'
import type { CredentialsSignInBody } from '~/types/auth'

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

const isSubmitting = ref(false)
const isGoogleSubmitting = ref(false)
const errorMessage = ref('')
const providers = ref<Record<string, unknown> | null>(null)

const copy = computed(() => {
  if (locale.value === 'vi') {
    return {
      eyebrow: 'Tài khoản',
      title: 'Đăng nhập để tiếp tục đặt vé',
      description:
        'Sử dụng email và mật khẩu hoặc Google để tiếp tục tới phiên đặt vé của bạn.',
      emailLabel: 'Email',
      passwordLabel: 'Mật khẩu',
      submit: 'Đăng nhập',
      google: 'Tiếp tục với Google',
      googleUnavailable: 'Google sign-in chưa được cấu hình.',
      noAccount: 'Chưa có tài khoản?',
      register: 'Tạo tài khoản',
      required: 'Email và mật khẩu là bắt buộc.',
      invalidEmail: 'Vui lòng nhập đúng định dạng email.',
      invalidCredentials: 'Email hoặc mật khẩu không hợp lệ.',
      genericError: 'Không thể đăng nhập. Vui lòng thử lại.',
      registeredSuccess: 'Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.',
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
    googleUnavailable: 'Google sign-in is not configured yet.',
    noAccount: "Don't have an account?",
    register: 'Create one',
    required: 'Email and password are required.',
    invalidEmail: 'Please enter a valid email address.',
    invalidCredentials: 'Invalid email or password.',
    genericError: 'Unable to sign in right now. Please try again.',
    registeredSuccess: 'Registration successful. You can sign in now.',
  }
})

const redirectTarget = computed(() => {
  return sanitizeRedirectTarget(route.query[REDIRECT_QUERY_KEY]) || DEFAULT_AUTH_REDIRECT
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

onMounted(async () => {
  providers.value = await getProviders()
})

const validateCredentials = () => {
  if (!form.email.trim() || !form.password) {
    return copy.value.required
  }

  if (!AUTH_EMAIL_PATTERN.test(form.email.trim())) {
    return copy.value.invalidEmail
  }

  return ''
}

const handleCredentialsLogin = async () => {
  errorMessage.value = ''

  const validationMessage = validateCredentials()

  if (validationMessage) {
    errorMessage.value = validationMessage
    return
  }

  isSubmitting.value = true

  try {
    const result = await signIn('credentials', {
      email: form.email.trim(),
      password: form.password,
      callbackUrl: redirectTarget.value,
      redirect: false,
    })

    if (result?.error) {
      errorMessage.value = copy.value.invalidCredentials
      return
    }

    await navigateTo(result?.url || redirectTarget.value)
  } catch {
    errorMessage.value = copy.value.genericError
  } finally {
    isSubmitting.value = false
  }
}

const handleGoogleLogin = async () => {
  errorMessage.value = ''

  if (!hasGoogleProvider.value) {
    errorMessage.value = copy.value.googleUnavailable
    return
  }

  isGoogleSubmitting.value = true

  try {
    await signIn('google', {
      callbackUrl: redirectTarget.value,
    })
  } catch {
    errorMessage.value = copy.value.genericError
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
          <div v-if="successMessage" class="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            {{ successMessage }}
          </div>

          <div v-if="errorMessage" class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {{ errorMessage }}
          </div>

          <form class="mt-6 space-y-5" @submit.prevent="handleCredentialsLogin">
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
                autocomplete="current-password"
                class="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-400"
              />
            </label>

            <button class="btn-primary w-full" :disabled="isSubmitting">
              {{ isSubmitting ? `${copy.submit}...` : copy.submit }}
            </button>
          </form>

          <button
            class="btn-secondary mt-4 w-full"
            :disabled="!hasGoogleProvider || isGoogleSubmitting"
            @click="handleGoogleLogin"
          >
            {{ isGoogleSubmitting ? `${copy.google}...` : copy.google }}
          </button>

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
