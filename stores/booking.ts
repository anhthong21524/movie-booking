import type { Booking, Seat } from '~/types'

const BOOKING_STORAGE_KEY = 'movie-booking:draft'

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

    return parsed as Booking
  } catch {
    return null
  }
}

export const useBookingStore = defineStore('booking', () => {
  const booking = ref<Booking | null>(null)
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

  const hydrateBooking = () => {
    if (!import.meta.client || hasHydrated.value) {
      return
    }

    booking.value = parseStoredBooking(window.localStorage.getItem(BOOKING_STORAGE_KEY))
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

    return replaceBooking({
      ...booking.value,
      seatIds: payload.seatIds,
      seats: payload.seats,
      unitPrice: payload.unitPrice,
      totalAmount: payload.totalAmount,
      status: 'CONFIRMED',
      confirmedAt: new Date().toISOString(),
    })
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
  }

  return {
    booking,
    hasHydrated,
    totalAmount,
    hydrateBooking,
    startBooking,
    confirmBooking,
    clearBooking,
  }
})
