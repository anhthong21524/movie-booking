import type { Movie } from '~/types'

export interface AdminMovieFormValues {
  title: string
  durationMinutes: string
  genre: string
  description: string
  rating: string
  releaseDate: string
  basePrice: string
  posterUrl: string
}

export type AdminMovieFormField =
  | 'title'
  | 'durationMinutes'
  | 'genre'
  | 'description'
  | 'rating'
  | 'releaseDate'
  | 'basePrice'
  | 'posterUrl'

export type AdminMovieFieldErrors = Partial<
  Record<AdminMovieFormField, string[]>
>

export interface PosterUploadPayload {
  fileName: string
  mimeType: string
  size: number
  dataUrl: string
}

export interface PosterUploadResponse {
  posterUrl: string
}

export interface AdminMoviesResponse {
  items: Movie[]
}

export interface AdminMovieMutationResponse {
  item: Movie
  message: string
}

export interface AdminMovieDeleteResponse {
  id: string
  message: string
}
