import { getToken } from '#auth'
import type { H3Event } from 'h3'

const toBackendUrl = (event: H3Event, path: string) => {
  const config = useRuntimeConfig(event)
  return new URL(path, config.apiProxyTarget).toString()
}

export const requireBackendAccessToken = async (event: H3Event) => {
  const token = await getToken({ event })

  if (!token?.accessToken || typeof token.accessToken !== 'string') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Backend access token is missing.',
    })
  }

  return token.accessToken
}

export const backendRequest = async <TResponse>(
  event: H3Event,
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    query?: Record<string, string | number | boolean | undefined>
    body?: BodyInit | Record<string, unknown>
    headers?: HeadersInit
  } = {},
): Promise<TResponse> => {
  const accessToken = await requireBackendAccessToken(event)

  try {
    return await $fetch<TResponse>(toBackendUrl(event, path), {
      method: options.method ?? 'GET',
      query: options.query,
      body: options.body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
        ...options.headers,
      },
    })
  } catch (error: unknown) {
    const response = (error as { response?: { status?: number; _data?: unknown } }).response
    const statusCode = response?.status ?? 500
    const responseData = response?._data
    const statusMessage =
      typeof responseData === 'object' &&
      responseData &&
      'detail' in responseData &&
      typeof (responseData as { detail?: unknown }).detail === 'string'
        ? (responseData as { detail: string }).detail
        : 'Backend request failed.'

    throw createError({
      statusCode,
      statusMessage,
      data: responseData,
    })
  }
}
