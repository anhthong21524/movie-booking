import type { AppLocale } from '~/constants/i18n'
import type { Booking, Movie, Seat, Showtime } from '~/types'
import type {
  BookingPricingBreakdown,
  CheckoutSummaryVm,
  CheckoutValidationResult,
} from '~/types/checkout'
import { formatCurrency, formatDateTime } from '~/utils/format'
import { normalizeSeatRecords } from '~/utils/seat-selection'
import type { RawSeatRecord } from '~/types/seat-selection'

export const calculateBookingPricing = (
  unitPrice: number,
  seatCount: number,
  options: {
    feeAmount?: number
    discountAmount?: number
  } = {},
): BookingPricingBreakdown => {
  const subtotal = seatCount * unitPrice
  const feeAmount = options.feeAmount ?? 0
  const discountAmount = options.discountAmount ?? 0

  return {
    seatCount,
    unitPrice,
    subtotal,
    feeAmount,
    discountAmount,
    total: subtotal + feeAmount - discountAmount,
  }
}

const sanitizeSeatIds = (seatIds: readonly string[]) => {
  return seatIds.filter((seatId, index) => {
    return typeof seatId === 'string' && seatId.length > 0 && seatIds.indexOf(seatId) === index
  })
}

export const validateCheckoutBooking = (params: {
  bookingId: string
  booking: Booking | null
  showtime: Showtime | null
  seatRecords: RawSeatRecord[] | undefined
}): CheckoutValidationResult => {
  const { bookingId, booking, showtime, seatRecords } = params

  if (!booking) {
    return {
      valid: false,
      code: 'missing-booking',
      message: 'No booking draft was found. Return to seat selection and choose your seats again.',
      booking: null,
      normalizedSeatIds: [],
      selectedSeats: [],
      pricing: null,
    }
  }

  if (booking.id !== bookingId) {
    return {
      valid: false,
      code: 'booking-id-mismatch',
      message: 'This checkout link does not match the current booking draft.',
      booking,
      normalizedSeatIds: [],
      selectedSeats: [],
      pricing: null,
    }
  }

  if (!showtime) {
    return {
      valid: false,
      code: 'missing-showtime',
      message: 'The selected showtime could not be found.',
      booking,
      normalizedSeatIds: [],
      selectedSeats: [],
      pricing: null,
    }
  }

  if (Number.isNaN(new Date(showtime.startsAt).getTime())) {
    return {
      valid: false,
      code: 'invalid-showtime',
      message: 'This showtime has invalid schedule data and cannot be confirmed.',
      booking,
      normalizedSeatIds: [],
      selectedSeats: [],
      pricing: null,
    }
  }

  const canonicalSeatIds = sanitizeSeatIds(booking.seatIds)

  if (!canonicalSeatIds.length) {
    return {
      valid: false,
      code: 'empty-seats',
      message: 'Select at least one seat before continuing to checkout.',
      booking,
      normalizedSeatIds: [],
      selectedSeats: [],
      pricing: null,
    }
  }

  if (canonicalSeatIds.length !== booking.seatIds.length) {
    return {
      valid: false,
      code: 'duplicate-seat',
      message: 'The booking draft contains duplicate or invalid seat selections.',
      booking,
      normalizedSeatIds: canonicalSeatIds,
      selectedSeats: [],
      pricing: null,
    }
  }

  const normalizedSeatData = normalizeSeatRecords(seatRecords ?? [])
  const seatMap = new Map(normalizedSeatData.seats.map((seat) => [seat.id, seat]))
  const selectedSeats: Seat[] = []

  for (const seatId of canonicalSeatIds) {
    const seat = seatMap.get(seatId)

    if (!seat) {
      return {
        valid: false,
        code: 'missing-seat',
        message: 'One or more selected seats are no longer present in this seat map. Please reselect your seats.',
        booking,
        normalizedSeatIds: canonicalSeatIds,
        selectedSeats,
        pricing: null,
      }
    }

    if (seat.status !== 'AVAILABLE') {
      return {
        valid: false,
        code: 'unavailable-seat',
        message: `${seat.label} is no longer available. Please return to seat selection and choose another seat.`,
        booking,
        normalizedSeatIds: canonicalSeatIds,
        selectedSeats,
        pricing: null,
      }
    }

    selectedSeats.push(seat)
  }

  const pricing = calculateBookingPricing(showtime.price, selectedSeats.length)

  return {
    valid: true,
    code: 'ok',
    message: 'Booking is valid and ready to confirm.',
    booking,
    normalizedSeatIds: canonicalSeatIds,
    selectedSeats,
    pricing,
  }
}

export const buildCheckoutSummaryVm = (params: {
  booking: Booking
  showtime: Showtime
  movie: Movie | null
  selectedSeats: Seat[]
  pricing: BookingPricingBreakdown
  locale: AppLocale
}): CheckoutSummaryVm => {
  const { booking, showtime, movie, selectedSeats, pricing, locale } = params

  return {
    bookingId: booking.id,
    movieTitle: movie?.title ?? 'Selected movie',
    roomName: showtime.roomName,
    startsAtLabel: formatDateTime(showtime.startsAt, locale),
    bookingStatusLabel: booking.status === 'CONFIRMED' ? 'Confirmed' : 'Pending confirmation',
    selectedSeats,
    seatSummaryLabel: `${selectedSeats.length} seat${selectedSeats.length === 1 ? '' : 's'} selected`,
    pricingItems: [
      {
        id: 'seat-count',
        label: 'Seats',
        value: `${pricing.seatCount}`,
      },
      {
        id: 'unit-price',
        label: 'Seat price',
        value: formatCurrency(pricing.unitPrice, 'USD', locale),
      },
      {
        id: 'subtotal',
        label: 'Subtotal',
        value: formatCurrency(pricing.subtotal, 'USD', locale),
      },
      {
        id: 'fees',
        label: 'Fees',
        value: formatCurrency(pricing.feeAmount, 'USD', locale),
      },
      {
        id: 'discounts',
        label: 'Discounts',
        value: formatCurrency(pricing.discountAmount, 'USD', locale),
      },
    ],
    totalLabel: formatCurrency(pricing.total, 'USD', locale),
    guidance:
      booking.status === 'CONFIRMED'
        ? 'This booking has already been confirmed. Keep this page open until payment and ticket issuance are added.'
        : 'Review the booking carefully before confirming. Totals are recalculated from the active showtime price and current seat availability.',
    locale,
    movie,
    showtime,
  }
}
