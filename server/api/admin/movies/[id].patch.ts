import type { AdminMovieMutationResponse } from '~/types/admin-movie'
import type { Movie } from '~/types'
import { requireServerRole } from '~/server/utils/auth-session'
import { updateAdminMovie } from '~/server/utils/admin-movies'
import {
  hasMovieFieldErrors,
  validateMovieFormValues,
} from '~/utils/admin-movie-validation'

const toFormValues = (body: Partial<Omit<Movie, 'id'>>) => ({
  title: typeof body.title === 'string' ? body.title : '',
  durationMinutes:
    body.durationMinutes === undefined ? '' : String(body.durationMinutes),
  genre: typeof body.genre === 'string' ? body.genre : '',
  description: typeof body.description === 'string' ? body.description : '',
  rating: typeof body.rating === 'string' ? body.rating : '',
  releaseDate: typeof body.releaseDate === 'string' ? body.releaseDate : '',
  basePrice: body.basePrice === undefined ? '' : String(body.basePrice),
  posterUrl: typeof body.posterUrl === 'string' ? body.posterUrl : '',
})

export default defineEventHandler(
  async (event): Promise<AdminMovieMutationResponse> => {
    await requireServerRole(event, 'ADMIN')

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Movie id is required.',
      })
    }

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

    const item = updateAdminMovie(id, {
      title: body.title!.trim(),
      durationMinutes: Number(body.durationMinutes),
      genre: body.genre!.trim(),
      description: body.description!.trim(),
      rating: body.rating!.trim().toUpperCase(),
      releaseDate: body.releaseDate!.trim(),
      basePrice: Number(body.basePrice),
      posterUrl: typeof body.posterUrl === 'string' ? body.posterUrl.trim() : undefined,
    })

    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Movie not found.',
      })
    }

    return {
      item,
      message: 'Movie updated successfully.',
    }
  },
)
