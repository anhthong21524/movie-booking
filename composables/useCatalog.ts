import { MOCK_MOVIES, MOCK_SEATS, MOCK_SHOWTIMES } from '~/mocks'
import type { Movie, Showtime } from '~/types'

export const useCatalog = () => {
  const { tm } = useAppLocale()

  const localizeMovie = (movie: Movie): Movie => {
    const localized = tm<
      Partial<Pick<Movie, 'title' | 'description' | 'genre'>>
    >(`catalog.movies.${movie.id}`)

    return {
      ...movie,
      title: localized?.title ?? movie.title,
      description: localized?.description ?? movie.description,
      genre: localized?.genre ?? movie.genre,
    }
  }

  const localizeShowtime = (showtime: Showtime): Showtime => {
    const localized = tm<Partial<Pick<Showtime, 'roomName'>>>(
      `catalog.showtimes.${showtime.id}`,
    )

    return {
      ...showtime,
      roomName: localized?.roomName ?? showtime.roomName,
    }
  }

  const localizedMovies = computed(() => MOCK_MOVIES.map(localizeMovie))
  const localizedShowtimes = computed(() =>
    MOCK_SHOWTIMES.map(localizeShowtime),
  )
  const seats = computed(() => MOCK_SEATS)

  return {
    localizedMovies,
    localizedShowtimes,
    seats,
    localizeMovie,
    localizeShowtime,
  }
}
