export const buildMovieDetailRoute = (movieId: string) => {
  return `/movies/${encodeURIComponent(movieId)}`
}

export const buildBookingRoute = (showtimeId: string) => {
  return `/booking/${encodeURIComponent(showtimeId)}`
}

export const buildCheckoutRoute = (bookingId: string) => {
  return `/checkout/${encodeURIComponent(bookingId)}`
}
