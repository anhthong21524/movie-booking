import type { Movie } from '~/types'

export type AdminShowtimeStatus = 'SCHEDULED'

export interface CinemaRoom {
  id: string
  cinemaId: string
  name: string
  capacity: number
}

export interface CinemaLocation {
  id: string
  name: string
  rooms: CinemaRoom[]
}

export interface AdminScheduledShowtime {
  id: string
  movieId: string
  movieTitle: string
  cinemaId: string
  cinemaName: string
  roomId: string
  roomName: string
  startsAt: string
  endsAt: string
  durationMinutes: number
  price: number
  capacity: number
  status: AdminShowtimeStatus
}

export interface AdminShowtimeFormValues {
  movieId: string
  date: string
  time: string
  cinemaId: string
  roomId: string
  price: string
}

export type AdminShowtimeFormField =
  | 'movieId'
  | 'date'
  | 'time'
  | 'cinemaId'
  | 'roomId'
  | 'price'
  | 'schedule'

export type AdminShowtimeFieldErrors = Partial<
  Record<AdminShowtimeFormField, string[]>
>

export interface AdminShowtimeCreatePayload {
  movieId: string
  cinemaId: string
  roomId: string
  startsAt: string
  price: number
}

export interface AdminShowtimeBootstrapResponse {
  items: AdminScheduledShowtime[]
  movies: Movie[]
  cinemas: CinemaLocation[]
}

export interface AdminShowtimeMutationResponse {
  item: AdminScheduledShowtime
  message: string
}

export interface ShowtimeDraftPreview {
  movieTitle: string
  cinemaName: string
  roomName: string
  startsAtLabel: string
  endsAtLabel: string
  durationLabel: string
  priceLabel: string
  capacityLabel: string
}

export interface ShowtimeOverlapConflict {
  conflictingShowtimeId: string
  movieTitle: string
  roomName: string
  cinemaName: string
  startsAt: string
  endsAt: string
}

