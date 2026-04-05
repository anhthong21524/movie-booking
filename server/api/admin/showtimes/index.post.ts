import type {
  AdminShowtimeCreatePayload,
  AdminShowtimeFieldErrors,
  AdminShowtimeMutationResponse,
} from '~/types/admin-showtime'
import { requireServerRole } from '~/server/utils/auth-session'
import { listAdminMovies } from '~/server/utils/admin-movies'
import {
  createAdminShowtime,
  getAdminCinemaCatalog,
  listAdminShowtimes,
} from '~/server/utils/admin-showtimes'
import {
  findCinemaById,
  findMovieById,
  hasShowtimeFieldErrors,
  validateShowtimeCreatePayload,
} from '~/utils/admin-showtime-validation'

export default defineEventHandler(async (event): Promise<AdminShowtimeMutationResponse> => {
  await requireServerRole(event, 'ADMIN')

  const body = await readBody<AdminShowtimeCreatePayload>(event)
  const movies = listAdminMovies()
  const cinemas = getAdminCinemaCatalog()
  const existingShowtimes = listAdminShowtimes()
  const movie = findMovieById(movies, body?.movieId ?? '')
  const validation = validateShowtimeCreatePayload(body, {
    movies,
    cinemas,
    existingShowtimes,
  })

  if (hasShowtimeFieldErrors(validation.errors) || !validation.draft || !movie) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Showtime validation failed.',
      data: {
        validation: validation.errors satisfies AdminShowtimeFieldErrors,
      },
    })
  }

  const cinema = findCinemaById(cinemas, validation.draft.cinemaId)

  if (!cinema) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Selected cinema is invalid.',
    })
  }

  const createdShowtime = createAdminShowtime({
    movie,
    cinema,
    roomId: validation.draft.roomId,
    startsAt: validation.draft.startsAt,
    price: validation.draft.price,
  })

  return {
    item: createdShowtime,
    message: 'Showtime created successfully.',
  }
})
