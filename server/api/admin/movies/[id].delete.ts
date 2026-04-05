import type { AdminMovieDeleteResponse } from '~/types/admin-movie'
import { requireServerRole } from '~/server/utils/auth-session'
import { deleteAdminMovie } from '~/server/utils/admin-movies'

export default defineEventHandler(
  async (event): Promise<AdminMovieDeleteResponse> => {
    await requireServerRole(event, 'ADMIN')

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Movie id is required.',
      })
    }

    const deleted = deleteAdminMovie(id)

    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Movie not found.',
      })
    }

    return {
      id,
      message: 'Movie deleted successfully.',
    }
  },
)
