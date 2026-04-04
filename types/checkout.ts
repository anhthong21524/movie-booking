import type { AppLocale } from '~/constants/i18n'
import type { Booking, Movie, Seat, Showtime } from '~/types'

export interface BookingPricingBreakdown {
  seatCount: number
  unitPrice: number
  subtotal: number
  feeAmount: number
  discountAmount: number
  total: number
}

export type CheckoutValidationCode =
  | 'ok'
  | 'missing-booking'
  | 'booking-id-mismatch'
  | 'missing-showtime'
  | 'invalid-showtime'
  | 'empty-seats'
  | 'duplicate-seat'
  | 'missing-seat'
  | 'unavailable-seat'

export interface CheckoutValidationResult {
  valid: boolean
  code: CheckoutValidationCode
  message: string
  booking: Booking | null
  normalizedSeatIds: string[]
  selectedSeats: Seat[]
  pricing: BookingPricingBreakdown | null
}

export interface CheckoutLineItemVm {
  id: string
  label: string
  value: string
  emphasis?: boolean
}

export interface CheckoutSummaryVm {
  bookingId: string
  movieTitle: string
  roomName: string
  startsAtLabel: string
  bookingStatusLabel: string
  selectedSeats: Seat[]
  seatSummaryLabel: string
  pricingItems: CheckoutLineItemVm[]
  totalLabel: string
  guidance: string
  locale: AppLocale
  movie: Movie | null
  showtime: Showtime
}
