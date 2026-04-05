import type { AdminShowtimeBootstrapResponse } from '~/types/admin-showtime'
import { requireServerRole } from '~/server/utils/auth-session'
import { listAdminMovies } from '~/server/utils/admin-movies'
import {
  getAdminCinemaCatalog,
  listAdminShowtimes,
} from '~/server/utils/admin-showtimes'

export default defineEventHandler(async (event): Promise<AdminShowtimeBootstrapResponse> => {
  await requireServerRole(event, 'ADMIN')

  return {
    items: listAdminShowtimes(),
    movies: listAdminMovies(),
    cinemas: getAdminCinemaCatalog(),
  }
})

