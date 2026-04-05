import type { Movie, Showtime } from '~/types'

export interface MovieDetailDto {
  movie: Movie | null
  showtimes: Showtime[]
}

export interface MovieMetadataItemVm {
  id: 'duration' | 'genre' | 'rating' | 'releaseDate' | 'ticketPrice'
  label: string
  value: string
}

export interface MovieDetailVm {
  id: string
  title: string
  description: string
  genre: string
  rating: string
  durationMinutes: number | null
  releaseDate: string | null
  posterUrl: string | null
  basePrice: number | null
  metadata: MovieMetadataItemVm[]
}

export interface ShowtimeActionVm {
  label: string
  helperText: string
  disabled: boolean
  disabledReason?: string
}

export interface ShowtimeCardVm {
  id: string
  movieId: string
  roomName: string
  startsAt: string
  startsAtMs: number
  dateKey: string
  dayLabel: string
  timeLabel: string
  isoLabel: string
  priceLabel: string
  availabilityLabel: string
  action: ShowtimeActionVm
}

export interface ShowtimeDateGroupVm {
  dateKey: string
  heading: string
  subheading: string
  showtimes: ShowtimeCardVm[]
}

export interface MovieDetailPageVm {
  movie: MovieDetailVm
  showtimeGroups: ShowtimeDateGroupVm[]
  hasAvailableShowtimes: boolean
  malformedShowtimeCount: number
}
