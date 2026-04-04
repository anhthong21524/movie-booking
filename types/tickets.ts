import type { AppLocale } from '~/constants/i18n'
import type { Booking, Movie, Showtime } from '~/types'

export interface RawTicketBookingDto {
  id?: unknown
  showtimeId?: unknown
  seatIds?: unknown
  seats?: unknown
  unitPrice?: unknown
  status?: unknown
  totalAmount?: unknown
  createdAt?: unknown
  confirmedAt?: unknown
}

export interface TicketStatusVm {
  code: 'upcoming' | 'pending' | 'cancelled'
  label: string
  tone: 'emerald' | 'amber' | 'slate'
}

export interface TicketBookingCardVm {
  id: string
  referenceId: string
  movieTitle: string
  roomName: string
  startsAtLabel: string
  bookedAtLabel: string
  seatSummary: string
  seatLabels: string[]
  totalLabel: string
  status: TicketStatusVm
  qrPlaceholderLabel: string
  qrPlaceholderHint: string
}

export interface TicketHistoryStateReady {
  kind: 'ready'
  items: TicketBookingCardVm[]
  malformedCount: number
  locale: AppLocale
}

export interface TicketHistoryStateEmpty {
  kind: 'empty'
  malformedCount: number
}

export interface TicketHistoryStateMalformed {
  kind: 'malformed'
  malformedCount: number
}

export type TicketHistoryState =
  | TicketHistoryStateReady
  | TicketHistoryStateEmpty
  | TicketHistoryStateMalformed

export interface TicketHistoryMappingContext {
  bookings: Booking[]
  movies: Movie[]
  showtimes: Showtime[]
  locale: AppLocale
}
