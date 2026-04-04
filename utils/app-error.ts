import { AppError } from '~/types/app-error'
import type {
  AppErrorCategory,
  AppErrorInit,
  AppErrorValidationMap,
} from '~/types/app-error'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

const toStringOrUndefined = (value: unknown) => {
  return typeof value === 'string' && value.trim().length ? value.trim() : undefined
}

const isHtmlLike = (value: string) => {
  return /<\/?[a-z][\s\S]*>/i.test(value)
}

const isAbortLike = (error: unknown) => {
  if (!isRecord(error)) {
    return false
  }

  return (
    error.name === 'AbortError' ||
    error.name === 'TimeoutError' ||
    toStringOrUndefined(error.message)?.toLowerCase().includes('timeout') ||
    toStringOrUndefined(error.message)?.toLowerCase().includes('aborted')
  )
}

const isOffline = () => {
  return import.meta.client && typeof navigator !== 'undefined' && navigator.onLine === false
}

const normalizeValidationMap = (value: unknown): AppErrorValidationMap | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const validation = Object.entries(value).reduce<AppErrorValidationMap>(
    (accumulator, [field, fieldValue]) => {
      if (Array.isArray(fieldValue)) {
        const messages = fieldValue
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter(Boolean)

        if (messages.length) {
          accumulator[field] = messages
        }
      } else if (typeof fieldValue === 'string' && fieldValue.trim()) {
        accumulator[field] = [fieldValue.trim()]
      }

      return accumulator
    },
    {},
  )

  return Object.keys(validation).length ? validation : undefined
}

const normalizeStatusCategory = (statusCode?: number): AppErrorCategory => {
  if (!statusCode) {
    return 'unknown'
  }

  if (statusCode === 401) {
    return 'unauthorized'
  }

  if (statusCode === 403) {
    return 'forbidden'
  }

  if (statusCode === 404) {
    return 'not_found'
  }

  if (statusCode === 409) {
    return 'conflict'
  }

  if (statusCode === 429) {
    return 'rate_limited'
  }

  if (statusCode >= 400 && statusCode < 500) {
    return statusCode === 400 || statusCode === 422 ? 'validation' : 'unknown'
  }

  if (statusCode >= 500) {
    return 'server'
  }

  return 'unknown'
}

const isRetryableCategory = (category: AppErrorCategory) => {
  return (
    category === 'network' ||
    category === 'timeout' ||
    category === 'rate_limited' ||
    category === 'server' ||
    category === 'unknown'
  )
}

const extractPayloadDetails = (value: unknown) => {
  if (typeof value === 'string') {
    return {
      message: isHtmlLike(value) ? undefined : value.trim(),
      details: value,
    }
  }

  if (!isRecord(value)) {
    return {
      message: undefined,
      details: value,
    }
  }

  const message =
    toStringOrUndefined(value.userMessage) ||
    toStringOrUndefined(value.message) ||
    toStringOrUndefined(value.error) ||
    toStringOrUndefined(value.statusMessage)

  return {
    message,
    details: value,
    code: toStringOrUndefined(value.code),
    requestId:
      toStringOrUndefined(value.requestId) ||
      toStringOrUndefined(value.request_id) ||
      toStringOrUndefined(value.traceId),
    validation:
      normalizeValidationMap(value.validation) ||
      normalizeValidationMap(value.errors) ||
      normalizeValidationMap(value.fieldErrors),
  }
}

const buildUnknownError = (init: Partial<AppErrorInit> = {}) => {
  return new AppError({
    category: init.category ?? 'unknown',
    message: init.message ?? 'Unexpected application error.',
    retryable: init.retryable ?? true,
    statusCode: init.statusCode,
    code: init.code,
    details: init.details,
    requestId: init.requestId,
    validation: init.validation,
  })
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

export const normalizeApiError = (error: unknown) => {
  if (isAppError(error)) {
    return error
  }

  if (isOffline()) {
    return new AppError({
      category: 'network',
      message: 'You appear to be offline.',
      retryable: true,
      details: error,
    })
  }

  if (isAbortLike(error)) {
    return new AppError({
      category: 'timeout',
      message: 'The request timed out before the server responded.',
      retryable: true,
      details: error,
    })
  }

  if (typeof error === 'string') {
    return buildUnknownError({
      message: isHtmlLike(error) ? 'Unexpected server response.' : error,
      details: error,
    })
  }

  if (!isRecord(error)) {
    return buildUnknownError({ details: error })
  }

  const response = isRecord(error.response) ? error.response : undefined
  const statusCode =
    typeof error.statusCode === 'number'
      ? error.statusCode
      : typeof error.status === 'number'
        ? error.status
        : typeof response?.status === 'number'
          ? response.status
          : undefined
  const responseData = response?._data ?? error.data ?? error.responseData
  const payload = extractPayloadDetails(responseData)
  const directMessage =
    payload.message ||
    toStringOrUndefined(error.statusMessage) ||
    toStringOrUndefined(error.message) ||
    toStringOrUndefined(response?.statusText)
  const category = normalizeStatusCategory(statusCode)

  if (!statusCode && directMessage?.toLowerCase().includes('fetch')) {
    return new AppError({
      category: 'network',
      message: directMessage,
      retryable: true,
      details: error,
    })
  }

  return new AppError({
    category,
    statusCode,
    message:
      directMessage ||
      (category === 'server'
        ? 'The server could not complete the request.'
        : 'Unexpected application error.'),
    retryable: isRetryableCategory(category),
    code: payload.code,
    details: payload.details ?? error,
    requestId: payload.requestId,
    validation: payload.validation,
  })
}

export const getSafeErrorMessage = (error: unknown) => {
  return normalizeApiError(error).message
}
