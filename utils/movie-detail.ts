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

const getCopy = (locale: AppLocale) => {
  if (locale === 'vi') {
    return {
      updating: 'Đang cập nhật',
      comingSoon: 'Sắp cập nhật',
      duration: 'Thời lượng',
      genre: 'Thể loại',
      rating: 'Phân loại',
      releaseDate: 'Khởi chiếu từ ngày',
      ticketPrice: 'Giá vé',
      minutes: 'phút',
      untitledMovie: 'Phim đang cập nhật',
      descriptionPending: 'Nội dung phim đang được cập nhật.',
      unknownGenre: 'Đang cập nhật',
      roomPending: 'Phòng chiếu đang cập nhật',
      soldOut: 'Đã hết chỗ',
      seatsLeft: (count: number) => `${count} ghế còn trống`,
      chooseShowtime: 'Chọn suất này',
      unavailablePast: 'Suất chiếu đã bắt đầu hoặc kết thúc.',
      unavailableGeneric: 'Suất chiếu tạm thời không khả dụng.',
      continueSeats: 'Tiếp tục đến bước chọn ghế.',
      passed: 'Đã qua giờ chiếu',
      noSeats: 'Hết ghế trống',
    }
  }

  return {
    updating: 'Not available',
    comingSoon: 'Coming soon',
    duration: 'Duration',
    genre: 'Genre',
    rating: 'Rating',
    releaseDate: 'Release date',
    ticketPrice: 'Ticket price',
    minutes: 'minutes',
    untitledMovie: 'Untitled movie',
    descriptionPending: 'Movie description is being updated.',
    unknownGenre: 'Unknown genre',
    roomPending: 'Room pending',
    soldOut: 'Sold out',
    seatsLeft: (count: number) => `${count} seats left`,
    chooseShowtime: 'Choose this showtime',
    unavailablePast: 'This showtime has already started or ended.',
    unavailableGeneric: 'This showtime is currently unavailable.',
    continueSeats: 'Continue to seat selection.',
    passed: 'Showtime passed',
    noSeats: 'Sold out',
  }
}

const formatReleaseDate = (value: string | null, locale: AppLocale) => {
  const copy = getCopy(locale)

  if (!value) {
    return locale === 'vi' ? copy.updating : copy.comingSoon
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return locale === 'vi' ? copy.updating : copy.comingSoon
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
  const copy = getCopy(locale)
  const missingValue = copy.updating

  return [
    {
      id: 'duration',
      label: copy.duration,
      value:
        typeof movie.durationMinutes === 'number' && movie.durationMinutes > 0
          ? `${movie.durationMinutes} ${copy.minutes}`
          : missingValue,
    },
    {
      id: 'genre',
      label: copy.genre,
      value: movie.genre?.trim() || missingValue,
    },
    {
      id: 'rating',
      label: copy.rating,
      value: movie.rating?.trim() || missingValue,
    },
    {
      id: 'releaseDate',
      label: copy.releaseDate,
      value: formatReleaseDate(movie.releaseDate || null, locale),
    },
    {
      id: 'ticketPrice',
      label: copy.ticketPrice,
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
  const copy = getCopy(locale)

  return {
    id: movie.id,
    title: movie.title?.trim() || copy.untitledMovie,
    description: movie.description?.trim() || copy.descriptionPending,
    genre: movie.genre?.trim() || copy.unknownGenre,
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

  const copy = getCopy(locale)
  const remainingSeats = Math.max(showtime.remainingSeats ?? 0, 0)
  const isSoldOut = remainingSeats === 0
  const isPast = startsAtDate.getTime() <= Date.now()
  const isUnavailable = isSoldOut || isPast

  return {
    id: showtime.id,
    movieId: showtime.movieId,
    roomName: showtime.roomName?.trim() || copy.roomPending,
    startsAt: showtime.startsAt,
    startsAtMs: startsAtDate.getTime(),
    dateKey: formatDateKey(startsAtDate, locale),
    dayLabel: formatGroupHeading(startsAtDate, locale),
    groupSubheading: formatGroupSubheading(startsAtDate, locale),
    timeLabel: formatTimeLabel(startsAtDate, locale),
    isoLabel: startsAtDate.toISOString(),
    priceLabel: formatCurrency(showtime.price, 'USD', locale),
    availabilityLabel: isSoldOut ? copy.soldOut : copy.seatsLeft(remainingSeats),
    action: {
      label: copy.chooseShowtime,
      helperText: isUnavailable
        ? isPast
          ? copy.unavailablePast
          : copy.unavailableGeneric
        : copy.continueSeats,
      disabled: isUnavailable,
      disabledReason: isPast
        ? copy.passed
        : isSoldOut
          ? copy.noSeats
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
