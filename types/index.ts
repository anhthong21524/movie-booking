export type SeatStatus = 'AVAILABLE' | 'HELD' | 'BOOKED'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type PaymentMethod = 'CARD' | 'EWALLET' | 'BANK_TRANSFER' | 'CASH'

export interface Movie {
  id: string
  title: string
  description: string
  durationMinutes: number
  genre: string
  rating: string
  posterUrl?: string
  releaseDate: string
  basePrice: number
}

export interface Showtime {
  id: string
  movieId: string
  startsAt: string
  roomName: string
  price: number
  capacity?: number
  remainingSeats?: number
}

export interface Seat {
  id: string
  label: string
  row: string
  number: number
  status: SeatStatus
}

export interface Booking {
  id: string
  showtimeId: string
  seats: Seat[]
  status: BookingStatus
  totalAmount: number
  createdAt: string
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  paidAt?: string
}

export interface Ticket {
  id: string
  bookingId: string
  showtimeId: string
  seatId: string
  code: string
  issuedAt: string
}
