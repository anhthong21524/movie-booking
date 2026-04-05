import type { MaybeRefOrGetter } from 'vue'
import type { Movie, Seat, Showtime } from '~/types'

interface MoviesResponse {
  items: Movie[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

interface ShowtimesResponse {
  items: Showtime[]
}

interface ShowtimeSeatsResponse {
  showtimeId: string
  capacity: number
  remainingSeats: number
  seats: Seat[]
}

export const useMovies = () => {
  const { request } = useApi()

  const {
    data,
    status,
    error,
    execute,
    retry,
  } = useRetryableRequest(() =>
    request<MoviesResponse>('/api/v1/movies', {
      query: {
        status: 'NOW_SHOWING',
        size: 100,
      },
    }),
  )

  const movies = computed(() => data.value?.items ?? [])

  return {
    movies,
    status,
    error,
    execute,
    retry,
  }
}

export const useMovieDetail = (movieId: MaybeRefOrGetter<string>) => {
  const { request } = useApi()

  const {
    data,
    status,
    error,
    execute,
    retry,
  } = useRetryableRequest(async () => {
    const resolvedMovieId = toValue(movieId)

    if (!resolvedMovieId) {
      return {
        movie: null,
        showtimes: [],
      }
    }

    const [movie, showtimesResponse] = await Promise.all([
      request<Movie>(`/api/v1/movies/${resolvedMovieId}`),
      request<ShowtimesResponse>('/api/v1/showtimes', {
        query: {
          movieId: resolvedMovieId,
        },
      }),
    ])

    return {
      movie,
      showtimes: showtimesResponse.items ?? [],
    }
  })

  const movie = computed(() => data.value?.movie ?? null)
  const showtimes = computed(() => data.value?.showtimes ?? [])

  return {
    movie,
    showtimes,
    status,
    error,
    execute,
    retry,
  }
}

export const useShowtimeSeats = (showtimeId: MaybeRefOrGetter<string>) => {
  const { request } = useApi()

  const {
    data,
    status,
    error,
    execute,
    retry,
  } = useRetryableRequest(async () => {
    const resolvedShowtimeId = toValue(showtimeId)

    if (!resolvedShowtimeId) {
      return {
        showtime: null,
        seats: [],
        capacity: 0,
        remainingSeats: 0,
      }
    }

    const [showtime, seatsResponse] = await Promise.all([
      request<Showtime>(`/api/v1/showtimes/${resolvedShowtimeId}`),
      request<ShowtimeSeatsResponse>(`/api/v1/showtimes/${resolvedShowtimeId}/seats`),
    ])

    return {
      showtime,
      seats: seatsResponse.seats ?? [],
      capacity: seatsResponse.capacity ?? 0,
      remainingSeats: seatsResponse.remainingSeats ?? 0,
    }
  })

  const showtime = computed(() => data.value?.showtime ?? null)
  const seats = computed(() => data.value?.seats ?? [])
  const capacity = computed(() => data.value?.capacity ?? 0)
  const remainingSeats = computed(() => data.value?.remainingSeats ?? 0)

  return {
    showtime,
    seats,
    capacity,
    remainingSeats,
    status,
    error,
    execute,
    retry,
  }
}
