import type { Movie, MovieStatus } from '~/types'

export interface AdminMovieFormValues {
  title: string
  durationMinutes: string
  genre: string
  description: string
  rating: string
  releaseDate: string
  basePrice: string
  posterUrl: string
  status: MovieStatus
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
  | 'status'

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
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type AdminMovieMutationResponse = Movie
