import type { Booking } from '~/types'
import type {
  TicketBookingCardVm,
  TicketHistoryMappingContext,
  TicketHistoryState,
  TicketStatusVm,
} from '~/types/tickets'
import { formatCurrency, formatDateTime } from '~/utils/format'

const statusOrder: Record<Booking['status'], number> = {
  CONFIRMED: 0,
  PENDING: 1,
  CANCELLED: 2,
}

const normalizeTicketStatus = (status: Booking['status']): TicketStatusVm => {
  if (status === 'CONFIRMED') {
    return {
      code: 'upcoming',
      label: 'Upcoming',
      tone: 'emerald',
    }
  }

  if (status === 'CANCELLED') {
    return {
      code: 'cancelled',
      label: 'Cancelled',
      tone: 'slate',
    }
  }

  return {
    code: 'pending',
    label: 'Pending',
    tone: 'amber',
  }
}

const sortBookings = (left: Booking, right: Booking) => {
  const leftDate = new Date(left.confirmedAt ?? left.createdAt).getTime()
  const rightDate = new Date(right.confirmedAt ?? right.createdAt).getTime()

  return (
    rightDate - leftDate ||
    statusOrder[left.status] - statusOrder[right.status] ||
    left.id.localeCompare(right.id)
  )
}

const summarizeSeats = (seatLabels: string[]) => {
  if (seatLabels.length <= 3) {
    return seatLabels.join(', ')
  }

  return `${seatLabels.slice(0, 3).join(', ')} +${seatLabels.length - 3} more`
}

const shortenBookingId = (id: string) => {
  return id.length <= 24 ? id : `${id.slice(0, 12)}...${id.slice(-8)}`
}

const mapBookingToTicketCard = (
  booking: Booking,
  context: TicketHistoryMappingContext,
): TicketBookingCardVm | null => {
  const showtime = context.showtimes.find((item) => item.id === booking.showtimeId)

  if (!showtime || Number.isNaN(new Date(showtime.startsAt).getTime())) {
    return null
  }

  const movie = context.movies.find((item) => item.id === showtime.movieId)
  const seatLabels = booking.seats
    .map((seat) => seat.label)
    .filter((label) => typeof label === 'string' && label.length > 0)
    .sort((left, right) => left.localeCompare(right, 'en', { numeric: true }))

  if (!booking.id || !seatLabels.length) {
    return null
  }

  const status = normalizeTicketStatus(booking.status)

  return {
    id: booking.id,
    referenceId: shortenBookingId(booking.id),
    movieTitle: movie?.title ?? 'Movie unavailable',
    roomName: showtime.roomName,
    startsAtLabel: formatDateTime(showtime.startsAt, context.locale),
    bookedAtLabel: formatDateTime(
      booking.confirmedAt ?? booking.createdAt,
      context.locale,
    ),
    seatSummary: summarizeSeats(seatLabels),
    seatLabels,
    totalLabel: formatCurrency(booking.totalAmount, 'USD', context.locale),
    status,
    qrPlaceholderLabel: 'QR code placeholder',
    qrPlaceholderHint: 'Ticket QR will appear here once delivery and scanning are implemented.',
  }
}

export const buildTicketHistoryState = (
  context: TicketHistoryMappingContext,
): TicketHistoryState => {
  const dedupedBookings = new Map<string, Booking>()

  for (const booking of context.bookings) {
    if (!booking.id || dedupedBookings.has(booking.id)) {
      continue
    }

    dedupedBookings.set(booking.id, booking)
  }

  const sortedBookings = Array.from(dedupedBookings.values()).sort(sortBookings)
  const items: TicketBookingCardVm[] = []
  let malformedCount = 0

  for (const booking of sortedBookings) {
    const mapped = mapBookingToTicketCard(booking, context)

    if (!mapped) {
      malformedCount += 1
      continue
    }

    items.push(mapped)
  }

  if (!items.length && malformedCount > 0) {
    return {
      kind: 'malformed',
      malformedCount,
    }
  }

  if (!items.length) {
    return {
      kind: 'empty',
      malformedCount,
    }
  }

  return {
    kind: 'ready',
    items,
    malformedCount,
    locale: context.locale,
  }
}
