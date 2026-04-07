import type { Movie } from '~/types'
import type {
  AdminScheduledShowtime,
  AdminShowtimeCreatePayload,
  AdminShowtimeFieldErrors,
  AdminShowtimeFormField,
  AdminShowtimeFormValues,
  CinemaLocation,
  CinemaRoom,
  ShowtimeDraftPreview,
  ShowtimeOverlapConflict,
} from '~/types/admin-showtime'

export const ADMIN_SHOWTIME_BUFFER_MINUTES = 0

export const ADMIN_CINEMA_CATALOG: CinemaLocation[] = [
  {
    id: 'cinema-downtown',
    name: 'Downtown Cinema',
    rooms: [
      { id: 'room-a', cinemaId: 'cinema-downtown', name: 'Auditorium A', capacity: 120 },
      { id: 'room-b', cinemaId: 'cinema-downtown', name: 'Auditorium B', capacity: 140 },
      { id: 'room-c', cinemaId: 'cinema-downtown', name: 'Auditorium C', capacity: 96 },
    ],
  },
  {
    id: 'cinema-harbor',
    name: 'Harbor Cinema',
    rooms: [
      { id: 'room-d', cinemaId: 'cinema-harbor', name: 'Auditorium D', capacity: 90 },
      { id: 'room-premium', cinemaId: 'cinema-harbor', name: 'Premium Hall', capacity: 80 },
      { id: 'room-family', cinemaId: 'cinema-harbor', name: 'Family Hall', capacity: 110 },
    ],
  },
]

const ADMIN_ROOM_BACKEND_NAMES: Record<string, string> = {
  'room-a': 'AUDITORIUM_A',
  'room-b': 'AUDITORIUM_B',
  'room-c': 'AUDITORIUM_C',
  'room-d': 'AUDITORIUM_D',
  'room-premium': 'PREMIUM_HALL',
  'room-family': 'FAMILY_HALL',
}

const pushFieldError = (
  errors: AdminShowtimeFieldErrors,
  field: AdminShowtimeFormField,
  message: string,
) => {
  errors[field] = [...(errors[field] ?? []), message]
}

export const createEmptyShowtimeFormValues = (): AdminShowtimeFormValues => ({
  movieId: '',
  date: '',
  time: '',
  cinemaId: '',
  roomId: '',
  price: '',
})

export const createFollowUpShowtimeFormValues = (
  values: AdminShowtimeFormValues,
): AdminShowtimeFormValues => ({
  movieId: values.movieId,
  date: values.date,
  time: '',
  cinemaId: values.cinemaId,
  roomId: values.roomId,
  price: values.price,
})

export const normalizeShowtimeFormValues = (
  values: AdminShowtimeFormValues,
): AdminShowtimeFormValues => ({
  movieId: values.movieId.trim(),
  date: values.date.trim(),
  time: values.time.trim(),
  cinemaId: values.cinemaId.trim(),
  roomId: values.roomId.trim(),
  price: values.price.trim(),
})

export const findMovieById = (movies: Movie[], movieId: string) => {
  return movies.find((movie) => movie.id === movieId) ?? null
}

export const findCinemaById = (cinemas: CinemaLocation[], cinemaId: string) => {
  return cinemas.find((cinema) => cinema.id === cinemaId) ?? null
}

export const findRoomById = (cinemas: CinemaLocation[], roomId: string) => {
  for (const cinema of cinemas) {
    const room = cinema.rooms.find((candidate) => candidate.id === roomId)

    if (room) {
      return {
        cinema,
        room,
      }
    }
  }

  return null
}

export const getRoomsForCinema = (
  cinemas: CinemaLocation[],
  cinemaId: string,
): CinemaRoom[] => {
  return findCinemaById(cinemas, cinemaId)?.rooms ?? []
}

export const getBackendRoomName = (
  room: Pick<CinemaRoom, 'id' | 'name'>,
) => {
  return ADMIN_ROOM_BACKEND_NAMES[room.id] ?? room.name
}

export const isMatchingRoomIdentifier = (
  room: Pick<CinemaRoom, 'id' | 'name'>,
  value: string,
) => {
  if (!value) {
    return false
  }

  return room.name === value || getBackendRoomName(room) === value
}

export const findRoomByIdentifier = (
  cinemas: CinemaLocation[],
  value: string,
) => {
  for (const cinema of cinemas) {
    const room = cinema.rooms.find((candidate) =>
      isMatchingRoomIdentifier(candidate, value),
    )

    if (room) {
      return {
        cinema,
        room,
      }
    }
  }

  return null
}

export const normalizeRoomDisplayName = (
  value: string,
  cinemas: CinemaLocation[] = ADMIN_CINEMA_CATALOG,
) => {
  const roomLookup = findRoomByIdentifier(cinemas, value)
  return roomLookup?.room.name ?? value
}

const parseDateParts = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

const parseTimeParts = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (hour > 23 || minute > 59) {
    return null
  }

  return {
    hour,
    minute,
  }
}

export const buildShowtimeStartIso = (date: string, time: string) => {
  const dateParts = parseDateParts(date)
  const timeParts = parseTimeParts(time)

  if (!dateParts || !timeParts) {
    return ''
  }

  const localDate = new Date(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    timeParts.hour,
    timeParts.minute,
    0,
    0,
  )

  if (
    localDate.getFullYear() !== dateParts.year ||
    localDate.getMonth() !== dateParts.month - 1 ||
    localDate.getDate() !== dateParts.day ||
    localDate.getHours() !== timeParts.hour ||
    localDate.getMinutes() !== timeParts.minute
  ) {
    return ''
  }

  return localDate.toISOString()
}

export const computeShowtimeEndIso = (
  startsAt: string,
  durationMinutes: number,
  bufferMinutes = ADMIN_SHOWTIME_BUFFER_MINUTES,
) => {
  const startMs = Date.parse(startsAt)

  if (!Number.isFinite(startMs) || !Number.isFinite(durationMinutes)) {
    return ''
  }

  const endMs = startMs + (durationMinutes + bufferMinutes) * 60 * 1000
  return new Date(endMs).toISOString()
}

export const toBackendIsoDateTime = (value: string) => {
  return value.replace(/\.\d{3}Z$/, 'Z')
}

export const formatAdminDateTime = (value: string) => {
  const parsed = Date.parse(value)

  if (!Number.isFinite(parsed)) {
    return 'Invalid schedule'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(parsed))
}

export const formatAdminCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export const findShowtimeOverlap = (
  candidate: Pick<AdminScheduledShowtime, 'roomId' | 'startsAt' | 'endsAt'>,
  existingShowtimes: AdminScheduledShowtime[],
): ShowtimeOverlapConflict | null => {
  const candidateStartMs = Date.parse(candidate.startsAt)
  const candidateEndMs = Date.parse(candidate.endsAt)

  if (!Number.isFinite(candidateStartMs) || !Number.isFinite(candidateEndMs)) {
    return null
  }

  for (const current of existingShowtimes) {
    if (current.roomId !== candidate.roomId || current.status !== 'SCHEDULED') {
      continue
    }

    const currentStartMs = Date.parse(current.startsAt)
    const currentEndMs = Date.parse(current.endsAt)

    if (!Number.isFinite(currentStartMs) || !Number.isFinite(currentEndMs)) {
      continue
    }

    const overlaps =
      candidateStartMs < currentEndMs &&
      candidateEndMs > currentStartMs

    if (overlaps) {
      return {
        conflictingShowtimeId: current.id,
        movieTitle: current.movieTitle,
        roomName: current.roomName,
        cinemaName: current.cinemaName,
        startsAt: current.startsAt,
        endsAt: current.endsAt,
      }
    }
  }

  return null
}

export const buildShowtimeOverlapMessage = (
  conflict: ShowtimeOverlapConflict | null,
) => {
  if (!conflict) {
    return ''
  }

  return `This room is already scheduled for ${conflict.movieTitle} from ${formatAdminDateTime(conflict.startsAt)} to ${formatAdminDateTime(conflict.endsAt)}. Choose a different time or room.`
}

export const buildShowtimeDraft = (
  values: AdminShowtimeFormValues,
  movies: Movie[],
  cinemas: CinemaLocation[],
) => {
  const normalized = normalizeShowtimeFormValues(values)
  const movie = findMovieById(movies, normalized.movieId)
  const cinema = findCinemaById(cinemas, normalized.cinemaId)
  const room = cinema?.rooms.find((candidate) => candidate.id === normalized.roomId) ?? null
  const startsAt = buildShowtimeStartIso(normalized.date, normalized.time)
  const price = Number(normalized.price)

  if (
    !movie ||
    !cinema ||
    !room ||
    !startsAt ||
    !Number.isFinite(price)
  ) {
    return null
  }

  const endsAt = computeShowtimeEndIso(startsAt, movie.durationMinutes)

  if (!endsAt) {
    return null
  }

  return {
    movieId: movie.id,
    movieTitle: movie.title,
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    roomId: room.id,
    roomName: room.name,
    startsAt,
    endsAt,
    durationMinutes: movie.durationMinutes,
    price,
    capacity: room.capacity,
    status: 'SCHEDULED' as const,
  }
}

export const buildShowtimeDraftFromPayload = (
  payload: AdminShowtimeCreatePayload,
  movies: Movie[],
  cinemas: CinemaLocation[],
) => {
  const movie = findMovieById(movies, payload.movieId)
  const cinema = findCinemaById(cinemas, payload.cinemaId)
  const room = cinema?.rooms.find((candidate) => candidate.id === payload.roomId) ?? null
  const startMs = Date.parse(payload.startsAt)

  if (
    !movie ||
    !cinema ||
    !room ||
    !Number.isFinite(startMs) ||
    !Number.isFinite(payload.price)
  ) {
    return null
  }

  const endsAt = computeShowtimeEndIso(payload.startsAt, movie.durationMinutes)

  if (!endsAt) {
    return null
  }

  return {
    movieId: movie.id,
    movieTitle: movie.title,
    cinemaId: cinema.id,
    cinemaName: cinema.name,
    roomId: room.id,
    roomName: room.name,
    startsAt: payload.startsAt,
    endsAt,
    durationMinutes: movie.durationMinutes,
    price: payload.price,
    capacity: room.capacity,
    status: 'SCHEDULED' as const,
  }
}

export const validateShowtimeFormValues = (
  values: AdminShowtimeFormValues,
  context: {
    movies: Movie[]
    cinemas: CinemaLocation[]
    existingShowtimes: AdminScheduledShowtime[]
  },
) => {
  const normalized = normalizeShowtimeFormValues(values)
  const errors: AdminShowtimeFieldErrors = {}
  const movie = findMovieById(context.movies, normalized.movieId)
  const cinema = findCinemaById(context.cinemas, normalized.cinemaId)
  const roomMatch = findRoomById(context.cinemas, normalized.roomId)
  const price = Number(normalized.price)

  if (!normalized.movieId) {
    pushFieldError(errors, 'movieId', 'Choose a movie.')
  } else if (!movie) {
    pushFieldError(errors, 'movieId', 'Choose a movie from the current catalog.')
  }

  if (!normalized.date) {
    pushFieldError(errors, 'date', 'Choose a show date.')
  } else if (!parseDateParts(normalized.date)) {
    pushFieldError(errors, 'date', 'Enter a valid show date.')
  }

  if (!normalized.time) {
    pushFieldError(errors, 'time', 'Choose a start time.')
  } else if (!parseTimeParts(normalized.time)) {
    pushFieldError(errors, 'time', 'Enter a valid start time.')
  }

  if (!normalized.cinemaId) {
    pushFieldError(errors, 'cinemaId', 'Choose a cinema.')
  } else if (!cinema) {
    pushFieldError(errors, 'cinemaId', 'Choose a cinema from the current list.')
  }

  if (!normalized.roomId) {
    pushFieldError(errors, 'roomId', 'Choose a room.')
  } else if (!roomMatch) {
    pushFieldError(errors, 'roomId', 'Choose a room from the current cinema list.')
  } else if (roomMatch.cinema.id !== normalized.cinemaId) {
    pushFieldError(errors, 'roomId', 'Choose a room that belongs to the selected cinema.')
  }

  if (!normalized.price) {
    pushFieldError(errors, 'price', 'Enter the ticket price for this showtime.')
  } else if (!Number.isFinite(price) || price < 1 || price > 100) {
    pushFieldError(errors, 'price', 'Use a ticket price between 1 and 100.')
  }

  const startsAt = buildShowtimeStartIso(normalized.date, normalized.time)

  if (normalized.date && normalized.time && !startsAt) {
    pushFieldError(errors, 'time', 'Use a valid date and time combination.')
  }

  if (movie && movie.durationMinutes <= 0) {
    pushFieldError(errors, 'movieId', 'This movie is missing a valid runtime.')
  }

  const draft = buildShowtimeDraft(normalized, context.movies, context.cinemas)
  const overlap = draft ? findShowtimeOverlap(draft, context.existingShowtimes) : null

  if (overlap) {
    pushFieldError(errors, 'schedule', buildShowtimeOverlapMessage(overlap))
  }

  return {
    errors,
    draft,
    overlap,
  }
}

export const validateShowtimeCreatePayload = (
  payload: Partial<AdminShowtimeCreatePayload> | null | undefined,
  context: {
    movies: Movie[]
    cinemas: CinemaLocation[]
    existingShowtimes: AdminScheduledShowtime[]
  },
) => {
  const errors: AdminShowtimeFieldErrors = {}
  const movie = findMovieById(context.movies, payload?.movieId ?? '')
  const cinema = findCinemaById(context.cinemas, payload?.cinemaId ?? '')
  const roomLookup = findRoomById(context.cinemas, payload?.roomId ?? '')
  const startMs = typeof payload?.startsAt === 'string' ? Date.parse(payload.startsAt) : Number.NaN
  const price =
    typeof payload?.price === 'number'
      ? payload.price
      : Number.NaN

  if (!payload?.movieId) {
    pushFieldError(errors, 'movieId', 'Choose a movie.')
  } else if (!movie) {
    pushFieldError(errors, 'movieId', 'Choose a movie from the current catalog.')
  }

  if (!payload?.cinemaId) {
    pushFieldError(errors, 'cinemaId', 'Choose a cinema.')
  } else if (!cinema) {
    pushFieldError(errors, 'cinemaId', 'Choose a cinema from the current list.')
  }

  if (!payload?.roomId) {
    pushFieldError(errors, 'roomId', 'Choose a room.')
  } else if (!roomLookup) {
    pushFieldError(errors, 'roomId', 'Choose a room from the current cinema list.')
  } else if (roomLookup.cinema.id !== payload.cinemaId) {
    pushFieldError(errors, 'roomId', 'Choose a room that belongs to the selected cinema.')
  }

  if (!payload?.startsAt || !Number.isFinite(startMs)) {
    pushFieldError(errors, 'time', 'Use a valid showtime start date and time.')
  }

  if (!Number.isFinite(price) || price < 1 || price > 100) {
    pushFieldError(errors, 'price', 'Use a ticket price between 1 and 100.')
  }

  const draft = payload
    ? buildShowtimeDraftFromPayload(payload as AdminShowtimeCreatePayload, context.movies, context.cinemas)
    : null
  const overlap = draft ? findShowtimeOverlap(draft, context.existingShowtimes) : null

  if (movie && movie.durationMinutes <= 0) {
    pushFieldError(errors, 'movieId', 'This movie is missing a valid runtime.')
  }

  if (overlap) {
    pushFieldError(errors, 'schedule', buildShowtimeOverlapMessage(overlap))
  }

  return {
    errors,
    draft,
    overlap,
  }
}

export const hasShowtimeFieldErrors = (errors: AdminShowtimeFieldErrors) => {
  return Object.values(errors).some(
    (messages) => Array.isArray(messages) && messages.length > 0,
  )
}

export const getShowtimeFieldError = (
  errors: AdminShowtimeFieldErrors,
  field: AdminShowtimeFormField,
) => {
  return errors[field]?.[0] ?? ''
}

export const buildShowtimePreview = (
  draft: ReturnType<typeof buildShowtimeDraft>,
): ShowtimeDraftPreview | null => {
  if (!draft) {
    return null
  }

  return {
    movieTitle: draft.movieTitle,
    cinemaName: draft.cinemaName,
    roomName: draft.roomName,
    startsAtLabel: formatAdminDateTime(draft.startsAt),
    endsAtLabel: formatAdminDateTime(draft.endsAt),
    durationLabel: `${draft.durationMinutes} min`,
    priceLabel: formatAdminCurrency(draft.price),
    capacityLabel: `${draft.capacity} seats`,
  }
}

export const toShowtimePayload = (
  draft: NonNullable<ReturnType<typeof buildShowtimeDraft>>,
): AdminShowtimeCreatePayload => ({
  movieId: draft.movieId,
  cinemaId: draft.cinemaId,
  roomId: draft.roomId,
  startsAt: draft.startsAt,
  price: draft.price,
})
