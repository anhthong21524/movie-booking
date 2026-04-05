import type { AdminMovieMutationResponse } from '~/types/admin-movie'
import type { Movie, MovieStatus } from '~/types'
import { requireServerRole } from '~/server/utils/auth-session'
import { createAdminMovie } from '~/server/utils/admin-movies'
import {
  hasMovieFieldErrors,
  validateMovieFormValues,
} from '~/utils/admin-movie-validation'

const normalizeMovieStatus = (status: unknown): MovieStatus => {
  return status === 'COMING_SOON' || status === 'ARCHIVED'
    ? status
    : 'NOW_SHOWING'
}

const toFormValues = (body: Partial<Omit<Movie, 'id'>>): {
  title: string
  durationMinutes: string
  genre: string
  description: string
  rating: string
  releaseDate: string
  basePrice: string
  posterUrl: string
  status: MovieStatus
} => ({
  title: typeof body.title === 'string' ? body.title : '',
  durationMinutes:
    body.durationMinutes === undefined ? '' : String(body.durationMinutes),
  genre: typeof body.genre === 'string' ? body.genre : '',
  description: typeof body.description === 'string' ? body.description : '',
  rating: typeof body.rating === 'string' ? body.rating : '',
  releaseDate: typeof body.releaseDate === 'string' ? body.releaseDate : '',
  basePrice: body.basePrice === undefined ? '' : String(body.basePrice),
  posterUrl: typeof body.posterUrl === 'string' ? body.posterUrl : '',
  status: normalizeMovieStatus(body.status),
})

export default defineEventHandler(
  async (event): Promise<AdminMovieMutationResponse> => {
    await requireServerRole(event, 'ADMIN')

    const body = await readBody<Partial<Omit<Movie, 'id'>>>(event)
    const fieldErrors = validateMovieFormValues(toFormValues(body))

    if (hasMovieFieldErrors(fieldErrors)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Movie form is invalid.',
        data: {
          validation: fieldErrors,
        },
      })
    }

    const item = createAdminMovie({
      title: body.title!.trim(),
      durationMinutes: Number(body.durationMinutes),
      genre: body.genre!.trim(),
      description: body.description!.trim(),
      rating: body.rating!.trim().toUpperCase(),
      releaseDate: body.releaseDate!.trim(),
      basePrice: Number(body.basePrice),
      posterUrl: typeof body.posterUrl === 'string' ? body.posterUrl.trim() : undefined,
      status: normalizeMovieStatus(body.status),
    })

    setResponseStatus(event, 201)

    return item
  },
)
