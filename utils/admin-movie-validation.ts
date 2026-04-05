import type {
  AdminMovieFieldErrors,
  AdminMovieFormField,
  AdminMovieFormValues,
  PosterUploadPayload,
} from '~/types/admin-movie'
import type { Movie } from '~/types'

export const ADMIN_POSTER_MAX_SIZE_BYTES = 2 * 1024 * 1024
export const ADMIN_POSTER_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

const RATING_PATTERN = /^[A-Z0-9+\- ]{1,12}$/

const pushFieldError = (
  errors: AdminMovieFieldErrors,
  field: AdminMovieFormField,
  message: string,
) => {
  errors[field] = [...(errors[field] ?? []), message]
}

export const createEmptyMovieFormValues = (): AdminMovieFormValues => ({
  title: '',
  durationMinutes: '',
  genre: '',
  description: '',
  rating: '',
  releaseDate: '',
  basePrice: '',
  posterUrl: '',
})

export const toMovieFormValues = (movie: Movie): AdminMovieFormValues => ({
  title: movie.title,
  durationMinutes: String(movie.durationMinutes),
  genre: movie.genre,
  description: movie.description,
  rating: movie.rating,
  releaseDate: movie.releaseDate,
  basePrice: String(movie.basePrice),
  posterUrl: movie.posterUrl ?? '',
})

export const normalizeMovieFormValues = (
  values: AdminMovieFormValues,
): AdminMovieFormValues => ({
  title: values.title.trim(),
  durationMinutes: values.durationMinutes.trim(),
  genre: values.genre.trim(),
  description: values.description.trim(),
  rating: values.rating.trim().toUpperCase(),
  releaseDate: values.releaseDate.trim(),
  basePrice: values.basePrice.trim(),
  posterUrl: values.posterUrl.trim(),
})

export const validateMovieFormValues = (
  values: AdminMovieFormValues,
): AdminMovieFieldErrors => {
  const normalized = normalizeMovieFormValues(values)
  const errors: AdminMovieFieldErrors = {}
  const duration = Number(normalized.durationMinutes)
  const basePrice = Number(normalized.basePrice)

  if (!normalized.title) {
    pushFieldError(errors, 'title', 'Enter a movie title.')
  }

  if (!normalized.genre) {
    pushFieldError(errors, 'genre', 'Enter a genre.')
  }

  if (!normalized.description) {
    pushFieldError(errors, 'description', 'Enter a description.')
  } else if (normalized.description.length < 20) {
    pushFieldError(
      errors,
      'description',
      'Use at least 20 characters so the description is useful.',
    )
  }

  if (!normalized.rating) {
    pushFieldError(errors, 'rating', 'Enter a rating such as PG or PG-13.')
  } else if (!RATING_PATTERN.test(normalized.rating)) {
    pushFieldError(
      errors,
      'rating',
      'Use a short rating label such as G, PG, PG-13, or R.',
    )
  }

  if (!normalized.releaseDate) {
    pushFieldError(errors, 'releaseDate', 'Choose a release date.')
  } else if (Number.isNaN(new Date(normalized.releaseDate).getTime())) {
    pushFieldError(errors, 'releaseDate', 'Enter a valid release date.')
  }

  if (!normalized.durationMinutes) {
    pushFieldError(errors, 'durationMinutes', 'Enter the duration in minutes.')
  } else if (!Number.isFinite(duration) || duration < 45 || duration > 360) {
    pushFieldError(
      errors,
      'durationMinutes',
      'Use a duration between 45 and 360 minutes.',
    )
  }

  if (!normalized.basePrice) {
    pushFieldError(errors, 'basePrice', 'Enter a base ticket price.')
  } else if (!Number.isFinite(basePrice) || basePrice < 1 || basePrice > 100) {
    pushFieldError(
      errors,
      'basePrice',
      'Use a price between 1 and 100.',
    )
  }

  if (normalized.posterUrl) {
    const isHttpLike =
      /^https?:\/\//i.test(normalized.posterUrl) ||
      normalized.posterUrl.startsWith('data:image/')

    if (!isHttpLike) {
      pushFieldError(
        errors,
        'posterUrl',
        'Poster URL must be an image URL or uploaded image.',
      )
    }
  }

  return errors
}

export const hasMovieFieldErrors = (errors: AdminMovieFieldErrors) => {
  return Object.values(errors).some(
    (messages) => Array.isArray(messages) && messages.length > 0,
  )
}

export const getMovieFieldError = (
  errors: AdminMovieFieldErrors,
  field: AdminMovieFormField,
) => {
  return errors[field]?.[0] ?? ''
}

export const toMoviePayload = (values: AdminMovieFormValues) => {
  const normalized = normalizeMovieFormValues(values)

  return {
    title: normalized.title,
    durationMinutes: Number(normalized.durationMinutes),
    genre: normalized.genre,
    description: normalized.description,
    rating: normalized.rating,
    releaseDate: normalized.releaseDate,
    basePrice: Number(normalized.basePrice),
    posterUrl: normalized.posterUrl || undefined,
  }
}

export const validatePosterUploadPayload = (payload: PosterUploadPayload) => {
  if (
    !ADMIN_POSTER_ALLOWED_TYPES.includes(
      payload.mimeType as (typeof ADMIN_POSTER_ALLOWED_TYPES)[number],
    )
  ) {
    return 'Upload a JPG, PNG, or WebP image.'
  }

  if (payload.size <= 0 || payload.size > ADMIN_POSTER_MAX_SIZE_BYTES) {
    return 'Poster image must be 2 MB or smaller.'
  }

  if (!payload.dataUrl.startsWith(`data:${payload.mimeType};base64,`)) {
    return 'Poster upload payload is malformed.'
  }

  return ''
}
