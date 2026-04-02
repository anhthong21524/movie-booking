import type { Booking, Seat } from '~/types'

export const useBookingStore = defineStore('booking', () => {
  const booking = ref<Booking | null>(null)

  const totalAmount = computed(() => booking.value?.totalAmount ?? 0)

  const startBooking = (showtimeId: string, seats: Seat[]) => {
    booking.value = {
      id: 'draft-booking',
      showtimeId,
      seats,
      status: 'PENDING',
      totalAmount: seats.length * 12.5,
      createdAt: new Date().toISOString(),
    }
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
