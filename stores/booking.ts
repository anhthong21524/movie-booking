import type { Booking, Seat } from '~/types'
import type { RawTicketBookingDto } from '~/types/tickets'

const BOOKING_STORAGE_KEY = 'movie-booking:draft'
const BOOKING_HISTORY_STORAGE_KEY = 'movie-booking:history'

const isSeatRecord = (value: unknown): value is Seat => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const seat = value as Partial<Seat>

  return (
    typeof seat.id === 'string' &&
    typeof seat.label === 'string' &&
    typeof seat.row === 'string' &&
    typeof seat.number === 'number' &&
    (seat.status === 'AVAILABLE' ||
      seat.status === 'HELD' ||
      seat.status === 'BOOKED')
  )
}

const parseStoredBooking = (value: string | null) => {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<Booking>

    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.showtimeId !== 'string' ||
      !Array.isArray(parsed.seatIds) ||
      !Array.isArray(parsed.seats) ||
      typeof parsed.unitPrice !== 'number' ||
      typeof parsed.totalAmount !== 'number' ||
      typeof parsed.createdAt !== 'string' ||
      typeof parsed.status !== 'string'
    ) {
      return null
    }

    if (
      !parsed.seatIds.every((seatId) => typeof seatId === 'string') ||
      !parsed.seats.every(isSeatRecord)
    ) {
      return null
    }

    return parsed as Booking
  } catch {
    return null
  }
}

const parseStoredBookingHistory = (value: string | null) => {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value) as RawTicketBookingDto[]

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((item) => parseStoredBooking(JSON.stringify(item)))
      .filter((item): item is Booking => Boolean(item))
  } catch {
    return []
  }
}

export const useBookingStore = defineStore('booking', () => {
  const booking = ref<Booking | null>(null)
  const bookingHistory = ref<Booking[]>([])
  const hasHydrated = ref(false)

  const totalAmount = computed(() => booking.value?.totalAmount ?? 0)

  const persistBooking = () => {
    if (!import.meta.client) {
      return
    }

    if (!booking.value) {
      window.localStorage.removeItem(BOOKING_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking.value))
  }

  const persistBookingHistory = () => {
    if (!import.meta.client) {
      return
    }

    if (!bookingHistory.value.length) {
      window.localStorage.removeItem(BOOKING_HISTORY_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(
      BOOKING_HISTORY_STORAGE_KEY,
      JSON.stringify(bookingHistory.value),
    )
  }

  const hydrateBooking = () => {
    if (!import.meta.client || hasHydrated.value) {
      return
    }

    booking.value = parseStoredBooking(window.localStorage.getItem(BOOKING_STORAGE_KEY))
    bookingHistory.value = parseStoredBookingHistory(
      window.localStorage.getItem(BOOKING_HISTORY_STORAGE_KEY),
    )
    hasHydrated.value = true
  }

  const createDraftBookingId = (showtimeId: string) => {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return `draft-${showtimeId}-${crypto.randomUUID()}`
    }

    return `draft-${showtimeId}-${Date.now()}`
  }

  const replaceBooking = (nextBooking: Booking) => {
    booking.value = nextBooking
    persistBooking()
    return booking.value
  }

  const upsertHistoryBooking = (nextBooking: Booking) => {
    bookingHistory.value = [
      nextBooking,
      ...bookingHistory.value.filter((item) => item.id !== nextBooking.id),
    ]
    persistBookingHistory()
  }

  const startBooking = (showtimeId: string, seats: Seat[], unitPrice: number) => {
    return replaceBooking({
      id: createDraftBookingId(showtimeId),
      showtimeId,
      seatIds: seats.map((seat) => seat.id),
      seats,
      unitPrice,
      status: 'PENDING',
      totalAmount: seats.length * unitPrice,
      createdAt: new Date().toISOString(),
    })
  }

  const confirmBooking = (payload: {
    seats: Seat[]
    seatIds: string[]
    totalAmount: number
    unitPrice: number
  }) => {
    if (!booking.value) {
      return null
    }

    const confirmedBooking = {
      ...booking.value,
      seatIds: payload.seatIds,
      seats: payload.seats,
      unitPrice: payload.unitPrice,
      totalAmount: payload.totalAmount,
      status: 'CONFIRMED' as const,
      confirmedAt: new Date().toISOString(),
    }

    replaceBooking(confirmedBooking)
    upsertHistoryBooking(confirmedBooking)

    return booking.value
  }

  const clearBooking = () => {
    booking.value = null
    persistBooking()
  }

  if (import.meta.client) {
    hydrateBooking()

    watch(
      booking,
      () => {
        persistBooking()
      },
      { deep: true },
    )

    watch(
      bookingHistory,
      () => {
        persistBookingHistory()
      },
      { deep: true },
    )
  }

  return {
    booking,
    bookingHistory,
    hasHydrated,
    totalAmount,
    hydrateBooking,
    startBooking,
    confirmBooking,
    clearBooking,
  }
})
