import type {
  AdminShowtimeCreatePayload,
  AdminShowtimeFieldErrors,
  AdminShowtimeMutationResponse,
  CinemaLocation,
} from '~/types/admin-showtime'
import type { Movie, Showtime } from '~/types'
import { requireServerRole } from '~/server/utils/auth-session'
import { backendRequest } from '~/server/utils/backend-api'
import { getAdminCinemaCatalog } from '~/server/utils/admin-showtimes'
import {
  findCinemaById,
  findMovieById,
  findRoomByIdentifier,
  getBackendRoomName,
  hasShowtimeFieldErrors,
  toBackendIsoDateTime,
  validateShowtimeCreatePayload,
} from '~/utils/admin-showtime-validation'

const mapBackendShowtimeToAdminShowtime = (
  showtime: Showtime,
  movies: Movie[],
  cinemas: CinemaLocation[],
): AdminShowtimeMutationResponse | null => {
  const movie = movies.find((item) => item.id === showtime.movieId)

  if (!movie) {
    return null
  }

  const roomLookup = findRoomByIdentifier(cinemas, showtime.roomName)

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

export default defineEventHandler(async (event): Promise<AdminShowtimeMutationResponse> => {
  await requireServerRole(event, 'ADMIN')

  const body = await readBody<AdminShowtimeCreatePayload>(event)
  const moviesResponse = await backendRequest<{
    items: Movie[]
    page: number
    size: number
    totalItems: number
    totalPages: number
  }>(event, '/api/v1/movies', {
    query: {
      size: 200,
    },
  })
  const existingShowtimesResponse = await backendRequest<{
    items: Showtime[]
    page: number
    size: number
    totalItems: number
    totalPages: number
  }>(event, '/api/v1/admin/showtimes', {
    query: {
      size: 200,
    },
  })

  const movies = moviesResponse.items
  const cinemas = getAdminCinemaCatalog()
  const existingShowtimes = existingShowtimesResponse.items
    .map((showtime) =>
      mapBackendShowtimeToAdminShowtime(showtime, movies, cinemas),
    )
    .filter((item): item is AdminShowtimeMutationResponse => Boolean(item))
  const movie = findMovieById(movies, body?.movieId ?? '')
  const validation = validateShowtimeCreatePayload(body, {
    movies,
    cinemas,
    existingShowtimes,
  })

  const draft = validation.draft

  if (hasShowtimeFieldErrors(validation.errors) || !draft || !movie) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Showtime validation failed.',
      data: {
        validation: validation.errors satisfies AdminShowtimeFieldErrors,
      },
    })
  }

  const cinema = findCinemaById(cinemas, draft.cinemaId)

  if (!cinema) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Selected cinema is invalid.',
    })
  }

  const room = cinema.rooms.find((candidate) => candidate.id === draft.roomId)

  if (!room) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Selected room is invalid for this cinema.',
    })
  }

  const createdShowtime = await backendRequest<Showtime>(
    event,
    '/api/v1/admin/showtimes',
    {
      method: 'POST',
      body: {
        movieId: Number(movie.id),
        room: getBackendRoomName(room),
        startTime: toBackendIsoDateTime(draft.startsAt),
        endTime: toBackendIsoDateTime(draft.endsAt),
        totalSeats: room.capacity,
      },
    },
  )

  const mappedCreatedShowtime = mapBackendShowtimeToAdminShowtime(
    createdShowtime,
    movies,
    cinemas,
  )

  if (!mappedCreatedShowtime) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Created showtime could not be mapped for the admin view.',
    })
  }

  return mappedCreatedShowtime
})
