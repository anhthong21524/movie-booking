import { requireServerRole } from '~/server/utils/auth-session'
import { backendRequest } from '~/server/utils/backend-api'

export default defineEventHandler(
  async (event): Promise<void> => {
    await requireServerRole(event, 'ADMIN')

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Movie id is required.',
      })
    }

    await backendRequest<null>(event, `/api/v1/admin/movies/${id}`, {
      method: 'DELETE',
    })
  },
)
