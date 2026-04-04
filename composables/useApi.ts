import type { ApiRequestOptions } from '~/services/api'
import { apiService } from '~/services/api'

export const useApi = () => {
  const request = <T>(path: string, options?: ApiRequestOptions) =>
    apiService.request<T>(path, options)
  const requestLocal = <T>(path: string, options?: ApiRequestOptions) =>
    apiService.requestLocal<T>(path, options)

  return {
    request,
    requestLocal,
  }
}
