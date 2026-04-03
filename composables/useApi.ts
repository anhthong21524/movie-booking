type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod
  query?: Record<string, string | number | boolean | undefined>
  body?: TBody
  headers?: HeadersInit
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const request = async <TResponse>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<TResponse> => {
    try {
      return await $fetch<TResponse>(path, {
        baseURL: config.public.apiBaseUrl,
        method: options.method ?? 'GET',
        query: options.query,
        body: options.body as
          | BodyInit
          | Record<string, unknown>
          | null
          | undefined,
        headers: {
          ...(userStore.token
            ? { Authorization: `Bearer ${userStore.token}` }
            : {}),
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
      if (error && typeof error === 'object' && 'statusMessage' in error) {
        throw error
      }
      throw createError({
        statusCode: 500,
        statusMessage: 'Unexpected API error',
        data: error,
      })
    }
  }

  return { request }
}
