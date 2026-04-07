import type { AdminMoviesResponse } from '~/types/admin-movie'
import { requireServerRole } from '~/server/utils/auth-session'
import { backendRequest } from '~/server/utils/backend-api'

export default defineEventHandler(async (event): Promise<AdminMoviesResponse> => {
  await requireServerRole(event, 'ADMIN')
  const query = getQuery(event)

  return backendRequest<AdminMoviesResponse>(event, '/api/v1/movies', {
    query: {
      page: typeof query.page === 'string' ? query.page : undefined,
      size: typeof query.size === 'string' ? query.size : undefined,
      sort: typeof query.sort === 'string' ? query.sort : undefined,
      keyword: typeof query.keyword === 'string' ? query.keyword : undefined,
      status: typeof query.status === 'string' ? query.status : undefined,
    },
  })
})
