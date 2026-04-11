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

const getCheckoutCopy = (locale: AppLocale) => {
  if (locale === 'vi') {
    return {
      selectedMovie: 'Phim đã chọn',
      confirmed: 'Đã xác nhận',
      pendingConfirmation: 'Chờ xác nhận',
      seatSummary: (count: number) => `${count} ghế đã chọn`,
      seats: 'Ghế',
      seatPrice: 'Giá ghế',
      subtotal: 'Tạm tính',
      fees: 'Phí',
      discounts: 'Giảm giá',
      confirmedGuidance:
        'Đơn đặt vé này đã được xác nhận. Hãy giữ trang này mở cho đến khi tính năng thanh toán và xuất vé được bổ sung.',
      pendingGuidance:
        'Hãy kiểm tra kỹ đơn đặt vé trước khi xác nhận. Tổng tiền được tính lại theo giá suất chiếu hiện tại và tình trạng ghế mới nhất.',
    }
  }

  return {
    selectedMovie: 'Selected movie',
    confirmed: 'Confirmed',
    pendingConfirmation: 'Pending confirmation',
    seatSummary: (count: number) => `${count} seat${count === 1 ? '' : 's'} selected`,
    seats: 'Seats',
    seatPrice: 'Seat price',
    subtotal: 'Subtotal',
    fees: 'Fees',
    discounts: 'Discounts',
    confirmedGuidance:
      'This booking has already been confirmed. Keep this page open until payment and ticket issuance are added.',
    pendingGuidance:
      'Review the booking carefully before confirming. Totals are recalculated from the active showtime price and current seat availability.',
  }
}

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
  const copy = getCheckoutCopy(locale)

  return {
    bookingId: booking.id,
    movieTitle: movie?.title ?? copy.selectedMovie,
    roomName: showtime.roomName,
    startsAtLabel: formatDateTime(showtime.startsAt, locale),
    bookingStatusLabel:
      booking.status === 'CONFIRMED' ? copy.confirmed : copy.pendingConfirmation,
    selectedSeats,
    seatSummaryLabel: copy.seatSummary(selectedSeats.length),
    pricingItems: [
      {
        id: 'seat-count',
        label: copy.seats,
        value: `${pricing.seatCount}`,
      },
      {
        id: 'unit-price',
        label: copy.seatPrice,
        value: formatCurrency(pricing.unitPrice, 'USD', locale),
      },
      {
        id: 'subtotal',
        label: copy.subtotal,
        value: formatCurrency(pricing.subtotal, 'USD', locale),
      },
      {
        id: 'fees',
        label: copy.fees,
        value: formatCurrency(pricing.feeAmount, 'USD', locale),
      },
      {
        id: 'discounts',
        label: copy.discounts,
        value: formatCurrency(pricing.discountAmount, 'USD', locale),
      },
    ],
    totalLabel: formatCurrency(pricing.total, 'USD', locale),
    guidance:
      booking.status === 'CONFIRMED'
        ? copy.confirmedGuidance
        : copy.pendingGuidance,
    locale,
    movie,
    showtime,
  }
}
