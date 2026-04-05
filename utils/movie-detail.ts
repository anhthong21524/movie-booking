import type { AppLocale } from '~/constants/i18n'
import type { Movie, Showtime } from '~/types'
import type {
  MovieDetailPageVm,
  MovieDetailVm,
  MovieMetadataItemVm,
  ShowtimeCardVm,
  ShowtimeDateGroupVm,
} from '~/types/movie-detail'
import { formatCurrency } from '~/utils/format'

interface InternalShowtimeCardVm extends ShowtimeCardVm {
  groupSubheading: string
}

const resolveLocale = (locale: AppLocale) => (locale === 'vi' ? 'vi-VN' : 'en-US')

const formatReleaseDate = (value: string | null, locale: AppLocale) => {
  if (!value) {
    return locale === 'vi' ? 'Dang cap nhat' : 'Coming soon'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return locale === 'vi' ? 'Dang cap nhat' : 'Coming soon'
  }

  return new Intl.DateTimeFormat(resolveLocale(locale), {
    dateStyle: 'medium',
  }).format(date)
}

const formatGroupHeading = (value: Date, locale: AppLocale) => {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(value)
}

const formatGroupSubheading = (value: Date, locale: AppLocale) => {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    year: 'numeric',
  }).format(value)
}

const formatTimeLabel = (value: Date, locale: AppLocale) => {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

const formatDateKey = (value: Date, locale: AppLocale) => {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value)
}

const buildMovieMetadata = (
  movie: Movie,
  locale: AppLocale,
): MovieMetadataItemVm[] => {
  const missingValue = locale === 'vi' ? 'Dang cap nhat' : 'Not available'

  return [
    {
      id: 'duration',
      label: locale === 'vi' ? 'Thoi luong' : 'Duration',
      value:
        typeof movie.durationMinutes === 'number' && movie.durationMinutes > 0
          ? `${movie.durationMinutes} ${locale === 'vi' ? 'phut' : 'minutes'}`
          : missingValue,
    },
    {
      id: 'genre',
      label: locale === 'vi' ? 'The loai' : 'Genre',
      value: movie.genre?.trim() || missingValue,
    },
    {
      id: 'rating',
      label: locale === 'vi' ? 'Phan loai' : 'Rating',
      value: movie.rating?.trim() || missingValue,
    },
    {
      id: 'releaseDate',
      label: locale === 'vi' ? 'Khoi chieu' : 'Release date',
      value: formatReleaseDate(movie.releaseDate || null, locale),
    },
    {
      id: 'ticketPrice',
      label: locale === 'vi' ? 'Gia ve tu' : 'Ticket price',
      value:
        typeof movie.basePrice === 'number' && movie.basePrice > 0
          ? formatCurrency(movie.basePrice, 'USD', locale)
          : missingValue,
    },
  ]
}

export const toMovieDetailVm = (
  movie: Movie,
  locale: AppLocale,
): MovieDetailVm => {
  return {
    id: movie.id,
    title: movie.title?.trim() || (locale === 'vi' ? 'Phim dang cap nhat' : 'Untitled movie'),
    description:
      movie.description?.trim() ||
      (locale === 'vi'
        ? 'Noi dung phim dang duoc cap nhat.'
        : 'Movie description is being updated.'),
    genre: movie.genre?.trim() || (locale === 'vi' ? 'Dang cap nhat' : 'Unknown genre'),
    rating: movie.rating?.trim() || 'NR',
    durationMinutes:
      typeof movie.durationMinutes === 'number' && movie.durationMinutes > 0
        ? movie.durationMinutes
        : null,
    releaseDate: movie.releaseDate || null,
    posterUrl: movie.posterUrl || null,
    basePrice:
      typeof movie.basePrice === 'number' && movie.basePrice > 0
        ? movie.basePrice
        : null,
    metadata: buildMovieMetadata(movie, locale),
  }
}

const toShowtimeCardVm = (
  showtime: Showtime,
  locale: AppLocale,
): InternalShowtimeCardVm | null => {
  if (!showtime.id || !showtime.movieId) {
    return null
  }

  const startsAtDate = new Date(showtime.startsAt)

  if (Number.isNaN(startsAtDate.getTime())) {
    return null
  }

  const remainingSeats = Math.max(showtime.remainingSeats ?? 0, 0)
  const isSoldOut = remainingSeats === 0
  const isPast = startsAtDate.getTime() <= Date.now()
  const isUnavailable = isSoldOut || isPast

  return {
    id: showtime.id,
    movieId: showtime.movieId,
    roomName: showtime.roomName?.trim() || (locale === 'vi' ? 'Phong chieu dang cap nhat' : 'Room pending'),
    startsAt: showtime.startsAt,
    startsAtMs: startsAtDate.getTime(),
    dateKey: formatDateKey(startsAtDate, locale),
    dayLabel: formatGroupHeading(startsAtDate, locale),
    groupSubheading: formatGroupSubheading(startsAtDate, locale),
    timeLabel: formatTimeLabel(startsAtDate, locale),
    isoLabel: startsAtDate.toISOString(),
    priceLabel: formatCurrency(showtime.price, 'USD', locale),
    availabilityLabel: isSoldOut
      ? locale === 'vi'
        ? 'Da het cho'
        : 'Sold out'
      : locale === 'vi'
        ? `${remainingSeats} ghe con trong`
        : `${remainingSeats} seats left`,
    action: {
      label: locale === 'vi' ? 'Chon suat nay' : 'Choose this showtime',
      helperText: isUnavailable
        ? isPast
          ? locale === 'vi'
            ? 'Suat chieu da bat dau hoac ket thuc.'
            : 'This showtime has already started or ended.'
          : locale === 'vi'
            ? 'Suat chieu tam thoi khong kha dung.'
            : 'This showtime is currently unavailable.'
        : locale === 'vi'
          ? 'Tiep tuc den buoc chon ghe.'
          : 'Continue to seat selection.',
      disabled: isUnavailable,
      disabledReason: isPast
        ? locale === 'vi'
          ? 'Da qua gio chieu'
          : 'Showtime passed'
        : isSoldOut
          ? locale === 'vi'
            ? 'Het ghe trong'
            : 'Sold out'
          : undefined,
    },
  }
}

export const groupShowtimesByDate = (
  showtimes: Showtime[],
  locale: AppLocale,
) => {
  const malformed: Showtime[] = []
  const grouped = new Map<string, ShowtimeDateGroupVm>()

  for (const showtime of showtimes) {
    const vm = toShowtimeCardVm(showtime, locale)

    if (!vm) {
      malformed.push(showtime)
      continue
    }

    const existing = grouped.get(vm.dateKey)

    if (existing) {
      existing.showtimes.push(vm)
      continue
    }

    grouped.set(vm.dateKey, {
      dateKey: vm.dateKey,
      heading: vm.dayLabel,
      subheading: vm.groupSubheading,
      showtimes: [vm],
    })
  }

  const groups = Array.from(grouped.values())
    .sort((left, right) => left.showtimes[0]!.startsAtMs - right.showtimes[0]!.startsAtMs)
    .map((group) => ({
      ...group,
      showtimes: [...group.showtimes].sort(
        (left, right) => left.startsAtMs - right.startsAtMs,
      ),
    }))

  return {
    groups,
    malformed,
  }
}

export const buildMovieDetailPageVm = (
  movie: Movie,
  showtimes: Showtime[],
  locale: AppLocale,
): MovieDetailPageVm => {
  const { groups, malformed } = groupShowtimesByDate(showtimes, locale)

  return {
    movie: toMovieDetailVm(movie, locale),
    showtimeGroups: groups,
    hasAvailableShowtimes: groups.some((group) =>
      group.showtimes.some((showtime) => !showtime.action.disabled),
    ),
    malformedShowtimeCount: malformed.length,
  }
}
