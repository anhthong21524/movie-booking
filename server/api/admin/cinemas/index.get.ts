import type { CinemaLocation } from '~/types/admin-showtime'
import { requireServerRole } from '~/server/utils/auth-session'
import { getAdminCinemaCatalog } from '~/server/utils/admin-showtimes'

export default defineEventHandler(
  async (event): Promise<{ items: CinemaLocation[] }> => {
    await requireServerRole(event, 'ADMIN')

    return {
      items: getAdminCinemaCatalog(),
    }
  },
)
