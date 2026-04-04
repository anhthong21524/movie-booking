import type { Seat, SeatStatus } from '~/types'

export interface RawSeatRecord {
  id?: unknown
  label?: unknown
  row?: unknown
  number?: unknown
  status?: unknown
}

export interface NormalizedSeatData {
  seats: Seat[]
  malformedSeatCount: number
}

export type SeatPresentationState =
  | 'available'
  | 'selected'
  | 'held'
  | 'booked'

export interface SeatGridSeatVm {
  id: string
  label: string
  rowLabel: string
  number: number
  backendStatus: SeatStatus
  presentationState: SeatPresentationState
  isSelected: boolean
  isDisabled: boolean
  stateLabel: string
  assistiveLabel: string
}

export interface SeatGridRowVm {
  rowKey: string
  rowLabel: string
  seats: SeatGridSeatVm[]
}

export interface SeatSelectionValidation {
  valid: boolean
  nextSelectedIds: string[]
  selectedSeats: Seat[]
  code: 'ok' | 'empty' | 'selection-limit'
  message: string
}

export interface SeatSelectionSummaryVm {
  selectedSeats: Array<Pick<Seat, 'id' | 'label' | 'row' | 'number'>>
  selectedCount: number
  availableCount: number
  unavailableCount: number
  maxSelectableSeats: number
  subtotal: number
  formattedSubtotal: string
  canContinue: boolean
  guidance: string
  statusMessage: string
}

export interface SeatToggleResult {
  changed: boolean
  nextSelectedIds: string[]
  validation: SeatSelectionValidation
  message: string
}
