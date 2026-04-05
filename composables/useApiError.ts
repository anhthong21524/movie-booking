import type { AppErrorSurface } from '~/types/app-error'
import { normalizeApiError } from '~/utils/app-error'
import { getUserMessageForError } from '~/utils/error-messages'

export const useApiError = () => {
  const normalize = (error: unknown) => normalizeApiError(error)
  const getMessage = (error: unknown, surface: AppErrorSurface = 'action') =>
    getUserMessageForError(normalize(error), surface)
  const isRetryable = (error: unknown) => normalize(error).retryable

  return {
    normalize,
    getMessage,
    isRetryable,
  }
}
