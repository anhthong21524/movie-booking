import type {
  AdminScheduledShowtime,
} from '~/types/admin-showtime'
import type { Movie, Showtime } from '~/types'
import { requireServerRole } from '~/server/utils/auth-session'
import { backendRequest } from '~/server/utils/backend-api'
import {
  getAdminCinemaCatalog,
} from '~/server/utils/admin-showtimes'
import { findRoomByIdentifier } from '~/utils/admin-showtime-validation'

const mapBackendShowtimeToAdminShowtime = (
  showtime: Showtime,
  movies: Movie[],
): AdminScheduledShowtime | null => {
  const movie = movies.find((item) => item.id === showtime.movieId)

  if (!movie) {
    return null
  }

  const cinemaCatalog = getAdminCinemaCatalog()
  const roomLookup = findRoomByIdentifier(cinemaCatalog, showtime.roomName)

  if (!roomLookup) {
    return null
  }

  const now = Date.now()
  const startsAtMs = Date.parse(showtime.startsAt)
  const endsAtMs = Date.parse(showtime.endsAt)
  const status =
    Number.isFinite(startsAtMs) && Number.isFinite(endsAtMs)
      ? now < startsAtMs
        ? 'SCHEDULED'
        : now >= startsAtMs && now < endsAtMs
          ? 'ONGOING'
          : 'COMPLETED'
      : 'SCHEDULED'

  return {
    id: showtime.id,
    movieId: movie.id,
    movieTitle: movie.title,
    cinemaId: roomLookup.cinema.id,
    cinemaName: roomLookup.cinema.name,
    roomId: roomLookup.room.id,
    roomName: roomLookup.room.name,
    startsAt: showtime.startsAt,
    endsAt: showtime.endsAt,
    durationMinutes: movie.durationMinutes,
    price: showtime.price,
    capacity: showtime.capacity ?? roomLookup.room.capacity,
    status,
  }
}

export default defineEventHandler(async (event): Promise<{
  items: AdminScheduledShowtime[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}> => {
  await requireServerRole(event, 'ADMIN')
  const query = getQuery(event)
  const [showtimesResponse, moviesResponse] = await Promise.all([
    backendRequest<{
      items: Showtime[]
      page: number
      size: number
      totalItems: number
      totalPages: number
    }>(event, '/api/v1/admin/showtimes', {
      query: {
        page: typeof query.page === 'string' ? query.page : undefined,
        size: typeof query.size === 'string' ? query.size : undefined,
        sort: typeof query.sort === 'string' ? query.sort : undefined,
        movieId: typeof query.movieId === 'string' ? query.movieId : undefined,
        fromTime: typeof query.fromTime === 'string' ? query.fromTime : undefined,
        toTime: typeof query.toTime === 'string' ? query.toTime : undefined,
      },
    }),
    backendRequest<{
      items: Movie[]
      page: number
      size: number
      totalItems: number
      totalPages: number
    }>(event, '/api/v1/movies', {
      query: {
        size: 200,
      },
    }),
  ])

  const items = showtimesResponse.items
    .map((showtime) =>
      mapBackendShowtimeToAdminShowtime(showtime, moviesResponse.items),
    )
    .filter((item): item is AdminScheduledShowtime => Boolean(item))

  return {
    items,
    page: showtimesResponse.page,
    size: showtimesResponse.size,
    totalItems: showtimesResponse.totalItems,
    totalPages: showtimesResponse.totalPages,
  }
})

