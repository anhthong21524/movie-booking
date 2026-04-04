import type { Booking, Seat } from '~/types'

export const useBookingStore = defineStore('booking', () => {
  const booking = ref<Booking | null>(null)

  const totalAmount = computed(() => booking.value?.totalAmount ?? 0)

  const createDraftBookingId = (showtimeId: string) => {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return `draft-${showtimeId}-${crypto.randomUUID()}`
    }

    return `draft-${showtimeId}-${Date.now()}`
  }

  const startBooking = (showtimeId: string, seats: Seat[], unitPrice: number) => {
    booking.value = {
      id: createDraftBookingId(showtimeId),
      showtimeId,
      seats,
      unitPrice,
      status: 'PENDING',
      totalAmount: seats.length * unitPrice,
      createdAt: new Date().toISOString(),
    }

    return booking.value
  }

  const clearBooking = () => {
    booking.value = null
  }

  return {
    booking,
    totalAmount,
    startBooking,
    clearBooking,
  }
})
