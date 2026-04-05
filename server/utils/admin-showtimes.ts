import { MOCK_MOVIES, MOCK_SHOWTIMES } from '~/mocks'
import type { Movie } from '~/types'
import type { AdminScheduledShowtime, CinemaLocation } from '~/types/admin-showtime'
import {
  ADMIN_CINEMA_CATALOG,
  computeShowtimeEndIso,
  findMovieById,
} from '~/utils/admin-showtime-validation'

const cloneCinemaCatalog = () => structuredClone(ADMIN_CINEMA_CATALOG)

const buildInitialShowtimes = (): AdminScheduledShowtime[] => {
  const catalog = cloneCinemaCatalog()

  return MOCK_SHOWTIMES.map<AdminScheduledShowtime | null>((showtime) => {
    const roomLookup = catalog
      .flatMap((cinema) => cinema.rooms.map((room) => ({ cinema, room })))
      .find((entry) => entry.room.name === showtime.roomName)

    if (!roomLookup) {
      return null
    }

    const movie = findMovieById(MOCK_MOVIES satisfies Movie[], showtime.movieId)

    if (!movie) {
      return null
    }

    const endsAt = computeShowtimeEndIso(showtime.startsAt, movie.durationMinutes)

    if (!endsAt) {
      return null
    }

    return {
      id: showtime.id,
      movieId: movie.id,
      movieTitle: movie.title,
      cinemaId: roomLookup.cinema.id,
      cinemaName: roomLookup.cinema.name,
      roomId: roomLookup.room.id,
      roomName: roomLookup.room.name,
      startsAt: showtime.startsAt,
      endsAt,
      durationMinutes: movie.durationMinutes,
      price: showtime.price,
      capacity: roomLookup.room.capacity,
      status: 'SCHEDULED',
    }
  }).filter((item): item is AdminScheduledShowtime => Boolean(item))
}

const adminShowtimesStore = buildInitialShowtimes()

export const listAdminShowtimes = () => {
  return [...adminShowtimesStore].sort((left, right) => {
    return Date.parse(left.startsAt) - Date.parse(right.startsAt)
  })
}

export const getAdminCinemaCatalog = (): CinemaLocation[] => {
  return cloneCinemaCatalog()
}

export const createAdminShowtime = (
  payload: {
    movie: Movie
    cinema: CinemaLocation
    roomId: string
    startsAt: string
    price: number
  },
) => {
  const room = payload.cinema.rooms.find((candidate) => candidate.id === payload.roomId)

  if (!room) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Selected room is invalid for this cinema.',
    })
  }

  const endsAt = computeShowtimeEndIso(payload.startsAt, payload.movie.durationMinutes)

  if (!endsAt) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Showtime duration could not be calculated.',
    })
  }

  const createdShowtime: AdminScheduledShowtime = {
    id: `showtime-${Date.now()}`,
    movieId: payload.movie.id,
    movieTitle: payload.movie.title,
    cinemaId: payload.cinema.id,
    cinemaName: payload.cinema.name,
    roomId: room.id,
    roomName: room.name,
    startsAt: payload.startsAt,
    endsAt,
    durationMinutes: payload.movie.durationMinutes,
    price: payload.price,
    capacity: room.capacity,
    status: 'SCHEDULED',
  }

  adminShowtimesStore.push(createdShowtime)
  return createdShowtime
}
