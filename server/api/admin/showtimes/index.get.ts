import type {
  AdminScheduledShowtime,
} from '~/types/admin-showtime'
import { requireServerRole } from '~/server/utils/auth-session'
import { listAdminShowtimes } from '~/server/utils/admin-showtimes'

export default defineEventHandler(async (event): Promise<{
  items: AdminScheduledShowtime[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}> => {
  await requireServerRole(event, 'ADMIN')

  const items = listAdminShowtimes()

  return {
    items,
    page: 0,
    size: items.length,
    totalItems: items.length,
    totalPages: items.length ? 1 : 0,
  }
})

