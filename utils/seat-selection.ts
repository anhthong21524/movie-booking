import type { AppLocale } from '~/constants/i18n'
import type { Seat } from '~/types'
import type {
  NormalizedSeatData,
  RawSeatRecord,
  SeatGridRowVm,
  SeatSelectionSummaryVm,
  SeatSelectionValidation,
  SeatToggleResult,
} from '~/types/seat-selection'
import { formatCurrency } from '~/utils/format'

export const DEFAULT_MAX_SELECTED_SEATS = 6

const getSeatSelectionCopy = (locale: AppLocale, maxSelectableSeats: number) => {
  if (locale === 'vi') {
    return {
      emptySelection: 'Hãy chọn ít nhất một ghế còn trống để tiếp tục.',
      selectionLimit: `Bạn chỉ có thể chọn tối đa ${maxSelectableSeats} ghế trong một lần đặt vé.`,
      selectedSeats: (count: number) =>
        `${count} ghế đã được chọn.`,
      stateSelected: 'Đã chọn',
      stateBooked: 'Đã đặt',
      stateUnavailable: 'Không khả dụng',
      stateAvailable: 'Còn trống',
      assistiveSelected: 'đã chọn',
      assistiveBooked: 'đã được đặt',
      assistiveHeld: 'tạm thời không khả dụng',
      assistiveAvailable: 'còn trống',
      seatNoLongerAvailable: 'Ghế này không còn khả dụng.',
      seatAlreadyBooked: (label: string) => `${label} đã được đặt.`,
      seatTemporarilyUnavailable: (label: string) =>
        `${label} tạm thời không khả dụng.`,
      seatRemoved: (label: string) => `Đã bỏ ${label} khỏi lựa chọn của bạn.`,
      seatAdded: (label: string) => `Đã thêm ${label} vào lựa chọn của bạn.`,
      guidance:
        `Bạn có thể chọn tối đa ${maxSelectableSeats} ghế. Không thể chọn các ghế đã đặt hoặc không khả dụng.`,
      noAvailableSeats: 'Hiện không có ghế trống cho suất chiếu này.',
    }
  }

  return {
    emptySelection: 'Select at least one available seat to continue.',
    selectionLimit: `You can select up to ${maxSelectableSeats} seats in one booking.`,
    selectedSeats: (count: number) =>
      `${count} seat${count === 1 ? '' : 's'} selected.`,
    stateSelected: 'Selected',
    stateBooked: 'Booked',
    stateUnavailable: 'Unavailable',
    stateAvailable: 'Available',
    assistiveSelected: 'selected',
    assistiveBooked: 'booked',
    assistiveHeld: 'temporarily unavailable',
    assistiveAvailable: 'available',
    seatNoLongerAvailable: 'This seat is no longer available.',
    seatAlreadyBooked: (label: string) => `${label} has already been booked.`,
    seatTemporarilyUnavailable: (label: string) =>
      `${label} is temporarily unavailable.`,
    seatRemoved: (label: string) => `${label} removed from your selection.`,
    seatAdded: (label: string) => `${label} added to your selection.`,
    guidance:
      `Select up to ${maxSelectableSeats} seats. Booked and unavailable seats cannot be chosen.`,
    noAvailableSeats:
      'This session does not have any available seats right now.',
  }
}

const isSeatStatus = (value: unknown): value is Seat['status'] => {
  return value === 'AVAILABLE' || value === 'HELD' || value === 'BOOKED'
}

const normalizeSeatRow = (value: unknown) => {
  if (typeof value !== 'string') {
    return null
  }

  const row = value.trim().toUpperCase()

  if (!row || !/^[A-Z0-9]{1,3}$/.test(row)) {
    return null
  }

  return row
}

const normalizeSeatNumber = (value: unknown) => {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : null
}

const normalizeSeatId = (value: unknown) => {
  if (typeof value !== 'string') {
    return null
  }

  const id = value.trim()

  return id.length ? id : null
}

const buildSeatLabel = (row: string, number: number, value: unknown) => {
  if (typeof value === 'string' && value.trim().length) {
    return value.trim().toUpperCase()
  }

  return `${row}${number}`
}

const sortSeats = (
  left: Pick<Seat, 'row' | 'number'>,
  right: Pick<Seat, 'row' | 'number'>,
) => {
  return (
    left.row.localeCompare(right.row, 'en', { numeric: true }) ||
    left.number - right.number
  )
}

const createSeatMap = (seats: readonly Seat[]) => {
  return new Map(seats.map((seat) => [seat.id, seat]))
}

export const normalizeSeatRecords = (
  records: readonly RawSeatRecord[],
): NormalizedSeatData => {
  const seatIds = new Set<string>()
  const seats: Seat[] = []
  let malformedSeatCount = 0

  for (const record of records) {
    const id = normalizeSeatId(record.id)
    const row = normalizeSeatRow(record.row)
    const number = normalizeSeatNumber(record.number)
    const status = isSeatStatus(record.status) ? record.status : null

    if (!id || !row || !number || !status || seatIds.has(id)) {
      malformedSeatCount += 1
      continue
    }

    seatIds.add(id)

    seats.push({
      id,
      row,
      number,
      status,
      label: buildSeatLabel(row, number, record.label),
    })
  }

  seats.sort(sortSeats)

  return {
    seats,
    malformedSeatCount,
  }
}

export const validateSeatSelection = (
  seats: readonly Seat[],
  selectedSeatIds: readonly string[],
  maxSelectableSeats = DEFAULT_MAX_SELECTED_SEATS,
  locale: AppLocale = 'en',
): SeatSelectionValidation => {
  const copy = getSeatSelectionCopy(locale, maxSelectableSeats)
  const seatMap = createSeatMap(seats)
  const sanitizedSelectedIds: string[] = []

  for (const seatId of selectedSeatIds) {
    const seat = seatMap.get(seatId)

    if (
      !seat ||
      seat.status !== 'AVAILABLE' ||
      sanitizedSelectedIds.includes(seatId)
    ) {
      continue
    }

    sanitizedSelectedIds.push(seatId)
  }

  const isOverLimit = sanitizedSelectedIds.length > maxSelectableSeats
  const nextSelectedIds = sanitizedSelectedIds.slice(0, maxSelectableSeats)
  const selectedSeats = nextSelectedIds
    .map((seatId) => seatMap.get(seatId))
    .filter((seat): seat is Seat => Boolean(seat))
    .sort(sortSeats)

  if (!selectedSeats.length) {
    return {
      valid: false,
      nextSelectedIds,
      selectedSeats,
      code: 'empty',
      message: copy.emptySelection,
    }
  }

  if (isOverLimit) {
    return {
      valid: false,
      nextSelectedIds,
      selectedSeats,
      code: 'selection-limit',
      message: copy.selectionLimit,
    }
  }

  return {
    valid: true,
    nextSelectedIds,
    selectedSeats,
    code: 'ok',
    message: copy.selectedSeats(selectedSeats.length),
  }
}

export const buildSeatGridRows = (
  seats: readonly Seat[],
  selectedSeatIds: readonly string[],
  locale: AppLocale = 'en',
): SeatGridRowVm[] => {
  const copy = getSeatSelectionCopy(locale, DEFAULT_MAX_SELECTED_SEATS)
  const selectedSet = new Set(selectedSeatIds)
  const rows = new Map<string, SeatGridRowVm>()

  for (const seat of seats) {
    const isSelected = seat.status === 'AVAILABLE' && selectedSet.has(seat.id)
    const presentationState = isSelected
      ? 'selected'
      : seat.status === 'BOOKED'
        ? 'booked'
        : seat.status === 'HELD'
          ? 'held'
          : 'available'
    const row = rows.get(seat.row) ?? {
      rowKey: seat.row,
      rowLabel: seat.row,
      seats: [],
    }

    row.seats.push({
      id: seat.id,
      label: seat.label,
      rowLabel: seat.row,
      number: seat.number,
      backendStatus: seat.status,
      presentationState,
      isSelected,
      isDisabled: seat.status !== 'AVAILABLE',
      stateLabel:
        presentationState === 'selected'
          ? copy.stateSelected
          : presentationState === 'booked'
            ? copy.stateBooked
            : presentationState === 'held'
              ? copy.stateUnavailable
              : copy.stateAvailable,
      assistiveLabel: `${seat.label}, ${
        presentationState === 'selected'
          ? copy.assistiveSelected
          : presentationState === 'booked'
            ? copy.assistiveBooked
            : presentationState === 'held'
              ? copy.assistiveHeld
              : copy.assistiveAvailable
      }`,
    })

    rows.set(seat.row, row)
  }

  return Array.from(rows.values()).sort((left, right) =>
    left.rowLabel.localeCompare(right.rowLabel, 'en', { numeric: true }),
  )
}

export const toggleSeatSelection = (
  seats: readonly Seat[],
  selectedSeatIds: readonly string[],
  seatId: string,
  maxSelectableSeats = DEFAULT_MAX_SELECTED_SEATS,
  locale: AppLocale = 'en',
): SeatToggleResult => {
  const copy = getSeatSelectionCopy(locale, maxSelectableSeats)
  const seatMap = createSeatMap(seats)
  const currentSelection = validateSeatSelection(
    seats,
    selectedSeatIds,
    maxSelectableSeats,
    locale,
  ).nextSelectedIds
  const seat = seatMap.get(seatId)

  if (!seat) {
    const validation = validateSeatSelection(
      seats,
      currentSelection,
      maxSelectableSeats,
      locale,
    )

    return {
      changed: false,
      nextSelectedIds: validation.nextSelectedIds,
      validation,
      message: copy.seatNoLongerAvailable,
    }
  }

  if (seat.status !== 'AVAILABLE') {
    const validation = validateSeatSelection(
      seats,
      currentSelection,
      maxSelectableSeats,
      locale,
    )

    return {
      changed: false,
      nextSelectedIds: validation.nextSelectedIds,
      validation,
      message:
        seat.status === 'BOOKED'
          ? copy.seatAlreadyBooked(seat.label)
          : copy.seatTemporarilyUnavailable(seat.label),
    }
  }

  const nextSelection = currentSelection.includes(seatId)
    ? currentSelection.filter((item) => item !== seatId)
    : [...currentSelection, seatId]

  if (
    !currentSelection.includes(seatId) &&
    currentSelection.length >= maxSelectableSeats
  ) {
    const validation = validateSeatSelection(
      seats,
      currentSelection,
      maxSelectableSeats,
      locale,
    )

    return {
      changed: false,
      nextSelectedIds: validation.nextSelectedIds,
      validation,
      message: copy.selectionLimit,
    }
  }

  const validation = validateSeatSelection(
    seats,
    nextSelection,
    maxSelectableSeats,
    locale,
  )

  return {
    changed: true,
    nextSelectedIds: validation.nextSelectedIds,
    validation,
    message: currentSelection.includes(seatId)
      ? copy.seatRemoved(seat.label)
      : copy.seatAdded(seat.label),
  }
}

export const buildSeatSelectionSummary = (
  seats: readonly Seat[],
  selectedSeatIds: readonly string[],
  unitPrice: number,
  locale: AppLocale,
  maxSelectableSeats = DEFAULT_MAX_SELECTED_SEATS,
): SeatSelectionSummaryVm => {
  const validation = validateSeatSelection(
    seats,
    selectedSeatIds,
    maxSelectableSeats,
    locale,
  )
  const copy = getSeatSelectionCopy(locale, maxSelectableSeats)
  const availableCount = seats.filter(
    (seat) => seat.status === 'AVAILABLE',
  ).length
  const unavailableCount = seats.length - availableCount
  const subtotal = validation.selectedSeats.length * unitPrice

  return {
    selectedSeats: validation.selectedSeats.map((seat) => ({
      id: seat.id,
      label: seat.label,
      row: seat.row,
      number: seat.number,
    })),
    selectedCount: validation.selectedSeats.length,
    availableCount,
    unavailableCount,
    maxSelectableSeats,
    subtotal,
    formattedSubtotal: formatCurrency(subtotal, 'USD', locale),
    canContinue: validation.valid,
    guidance: copy.guidance,
    statusMessage:
      availableCount === 0
        ? copy.noAvailableSeats
        : validation.message,
  }
}
