type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod
  query?: Record<string, string | number | boolean | undefined>
  body?: TBody
  headers?: HeadersInit
}

class ApiService {
  async request<TResponse>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<TResponse> {
    const config = useRuntimeConfig()

    try {
      return await $fetch<TResponse>(path, {
        baseURL: config.public.apiBaseUrl,
        method: options.method || 'GET',
        query: options.query,
        body: options.body as
          | BodyInit
          | Record<string, unknown>
          | null
          | undefined,
        headers: {
          ...options.headers,
        },
        onResponseError: ({ response }) => {
          throw createError({
            statusCode: response.status,
            statusMessage:
              response._data?.message ||
              response.statusText ||
              'API request failed',
            data: response._data,
          })
        },
      })
    } catch (error) {
      throw this.normalizeError(error)
    }
  }

  private normalizeError(error: unknown) {
    if (error && typeof error === 'object' && 'statusMessage' in error) {
      return error
    }

    return createError({
      statusCode: 500,
      statusMessage: 'Unexpected API error',
      data: error,
    })
  }
}

export const apiService = new ApiService()
