import type { AppError } from '~/types/app-error'
import { normalizeApiError } from '~/utils/app-error'

type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRetryableRequest = <T>(
  executor: () => Promise<T>,
  options: {
    retryCooldownMs?: number
  } = {},
) => {
  const data = ref<T | null>(null)
  const error = ref<AppError | null>(null)
  const status = ref<RequestStatus>('idle')
  const lastAttemptedAt = ref(0)
  const retryCooldownMs = options.retryCooldownMs ?? 1200

  const canRetry = computed(() => {
    if (!error.value?.retryable || status.value === 'loading') {
      return false
    }

    return Date.now() - lastAttemptedAt.value >= retryCooldownMs
  })

  const execute = async () => {
    if (status.value === 'loading') {
      return data.value
    }

    status.value = 'loading'
    error.value = null
    lastAttemptedAt.value = Date.now()

    try {
      const result = await executor()
      data.value = result
      status.value = 'success'
      return result
    } catch (caughtError) {
      error.value = normalizeApiError(caughtError)
      status.value = 'error'
      return null
    }
  }

  const retry = async () => {
    if (!canRetry.value) {
      return data.value
    }

    return execute()
  }

  return {
    data,
    error,
    status,
    canRetry,
    execute,
    retry,
  }
}
