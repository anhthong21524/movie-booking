export const buildMovieDetailRoute = (movieId: string) => {
  return `/movies/${encodeURIComponent(movieId)}`
}

export const buildBookingRoute = (showtimeId: string) => {
  return `/booking/${encodeURIComponent(showtimeId)}`
}
