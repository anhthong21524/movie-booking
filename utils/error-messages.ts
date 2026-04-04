import type { AppErrorMessageVm, AppErrorSurface } from '~/types/app-error'
import { normalizeApiError } from '~/utils/app-error'

export const getUserMessageForError = (
  error: unknown,
  surface: AppErrorSurface,
): AppErrorMessageVm => {
  const normalized = normalizeApiError(error)
  const retryLabel = surface === 'action' ? 'Try again' : 'Retry'

  switch (normalized.category) {
    case 'network':
      return {
        title: surface === 'page' ? 'Connection issue' : 'Unable to connect',
        description:
          'Check your connection and try again. Nothing was changed on the server.',
        retryLabel,
      }
    case 'timeout':
      return {
        title: 'Request timed out',
        description:
          'The server took too long to respond. Retry when the connection is stable.',
        retryLabel,
      }
    case 'unauthorized':
      return {
        title: 'Sign in required',
        description:
          'Your session is missing or expired. Sign in again before retrying this action.',
        retryLabel: 'Sign in again',
      }
    case 'forbidden':
      return {
        title: 'Action not allowed',
        description:
          'Your account does not have permission to perform this action.',
        retryLabel,
      }
    case 'not_found':
      return {
        title: 'Requested data was not found',
        description:
          'The item may have been removed or is no longer available. Return to the previous page and try another option.',
        retryLabel,
      }
    case 'validation':
      return {
        title: surface === 'action' ? 'Check the form' : 'Submitted data is invalid',
        description:
          normalized.validation
            ? 'Fix the highlighted fields and try again.'
            : 'Some submitted values were not accepted. Review the form and try again.',
        retryLabel,
      }
    case 'conflict':
      return {
        title: 'This item was changed',
        description:
          'The latest server state conflicts with your request. Refresh the data and try again.',
        retryLabel,
      }
    case 'rate_limited':
      return {
        title: 'Too many attempts',
        description:
          'Please wait a moment before retrying to avoid sending repeated requests.',
        retryLabel: 'Try later',
      }
    case 'server':
      return {
        title: 'Server problem',
        description:
          'The server could not complete your request. Retry in a moment. If it keeps failing, come back later.',
        retryLabel,
      }
    default:
      return {
        title: 'Unexpected error',
        description:
          'Something went wrong while processing your request. Retry if this looks temporary.',
        retryLabel,
      }
  }
}
