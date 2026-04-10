import { normalizeApiError } from '~/utils/app-error'
import { isAppError } from '~/utils/app-error'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod
  query?: Record<string, string | number | boolean | undefined>
  body?: TBody
  headers?: HeadersInit
  baseURL?: string
  timeoutMs?: number
}

class ApiService {
  async request<TResponse>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return this.runRequest<TResponse>(path, options)
  }

  async requestLocal<TResponse>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    return this.runRequest<TResponse>(path, {
      ...options,
      baseURL: '',
    })
  }

  private async runRequest<TResponse>(
    path: string,
    options: ApiRequestOptions,
  ): Promise<TResponse> {
    const config = useRuntimeConfig()
    const resolvedBaseUrl =
      options.baseURL ??
      (path.startsWith('/api/v1/') ? '' : config.public.apiBaseUrl)

    try {
      return await $fetch<TResponse>(path, {
        baseURL: resolvedBaseUrl,
        method: options.method || 'GET',
        query: options.query,
        body: options.body as
          | BodyInit
          | Record<string, unknown>
          | null
          | undefined,
        timeout: options.timeoutMs ?? 10000,
        headers: {
          Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
          ...options.headers,
        },
      })
    } catch (error) {
      const normalizedError = normalizeApiError(error)

      if (import.meta.client && isAppError(normalizedError) && normalizedError.category === 'unauthorized') {
        const appAuth = useAppAuth()
        void appAuth.handleExpiredSession()
      }

      throw normalizedError
    }
  }
}

export const apiService = new ApiService()
