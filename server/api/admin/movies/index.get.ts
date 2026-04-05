import type { AdminMoviesResponse } from '~/types/admin-movie'
import { requireServerRole } from '~/server/utils/auth-session'
import { listAdminMovies } from '~/server/utils/admin-movies'

export default defineEventHandler(async (event): Promise<AdminMoviesResponse> => {
  await requireServerRole(event, 'ADMIN')

  return {
    items: listAdminMovies(),
  }
})
