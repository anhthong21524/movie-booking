import type { Movie, Seat, Showtime } from '~/types'
import type { RawSeatRecord } from '~/types/seat-selection'

export const MOCK_MOVIES: Movie[] = [
  {
    id: 'movie-1',
    title: 'The Last Projection',
    description:
      'A cinema archivist discovers a reel that can replay lost memories with dangerous accuracy.',
    durationMinutes: 118,
    genre: 'Sci-Fi Thriller',
    rating: 'PG-13',
    releaseDate: '2026-03-14',
    basePrice: 12.5,
  },
  {
    id: 'movie-2',
    title: 'Midnight Harbor',
    description:
      'A storm-bound ferry becomes the setting for a tightly wound mystery between strangers.',
    durationMinutes: 102,
    genre: 'Mystery',
    rating: 'PG',
    releaseDate: '2026-02-28',
    basePrice: 11,
  },
  {
    id: 'movie-3',
    title: 'Paper Satellites',
    description:
      'Two siblings turn a small-town science fair project into an improbable shot at orbit.',
    durationMinutes: 95,
    genre: 'Drama',
    rating: 'G',
    releaseDate: '2026-01-09',
    basePrice: 10,
  },
]

export const MOCK_SHOWTIMES: Showtime[] = [
  {
    id: 'showtime-1',
    movieId: 'movie-1',
    startsAt: '2026-04-05T18:30:00Z',
    endsAt: '2026-04-05T20:28:00Z',
    roomName: 'Auditorium A',
    price: 12.5,
    capacity: 120,
    remainingSeats: 42,
  },
  {
    id: 'showtime-2',
    movieId: 'movie-1',
    startsAt: '2026-04-05T21:00:00Z',
    endsAt: '2026-04-05T22:58:00Z',
    roomName: 'Auditorium B',
    price: 14,
    capacity: 140,
    remainingSeats: 0,
  },
  {
    id: 'showtime-3',
    movieId: 'movie-2',
    startsAt: '2026-04-06T17:45:00Z',
    endsAt: '2026-04-06T19:27:00Z',
    roomName: 'Auditorium C',
    price: 11,
    capacity: 96,
    remainingSeats: 24,
  },
  {
    id: 'showtime-4',
    movieId: 'movie-1',
    startsAt: '2026-04-06T15:30:00Z',
    endsAt: '2026-04-06T17:28:00Z',
    roomName: 'Premium Hall',
    price: 15.5,
    capacity: 80,
    remainingSeats: 9,
  },
  {
    id: 'showtime-5',
    movieId: 'movie-1',
    startsAt: '2026-04-07T00:15:00Z',
    endsAt: '2026-04-07T02:13:00Z',
    roomName: 'Auditorium A',
    price: 12.5,
    capacity: 120,
    remainingSeats: 68,
  },
  {
    id: 'showtime-6',
    movieId: 'movie-2',
    startsAt: 'invalid-date',
    endsAt: 'invalid-date',
    roomName: 'Auditorium D',
    price: 11,
    capacity: 90,
    remainingSeats: 12,
  },
  {
    id: 'showtime-7',
    movieId: 'movie-3',
    startsAt: '2026-04-08T11:00:00Z',
    endsAt: '2026-04-08T12:35:00Z',
    roomName: 'Family Hall',
    price: 10,
    capacity: 110,
    remainingSeats: 76,
  },
]

const createSeatLayout = (
  showtimeId: string,
  rows: string[],
  seatsPerRow: number,
  options: {
    booked?: string[]
    held?: string[]
    malformed?: RawSeatRecord[]
  } = {},
): RawSeatRecord[] => {
  const booked = new Set(options.booked ?? [])
  const held = new Set(options.held ?? [])
  const seats: RawSeatRecord[] = []

  for (const row of rows) {
    for (let number = 1; number <= seatsPerRow; number += 1) {
      const label = `${row}${number}`

      seats.push({
        id: `${showtimeId}-${row.toLowerCase()}${number}`,
        label,
        row,
        number,
        status: booked.has(label)
          ? 'BOOKED'
          : held.has(label)
            ? 'HELD'
            : 'AVAILABLE',
      })
    }
  }

  return [...seats, ...(options.malformed ?? [])]
}

export const MOCK_SEATS: Seat[] = [
  {
    id: 'legacy-seat-a1',
    label: 'A1',
    row: 'A',
    number: 1,
    status: 'AVAILABLE',
  },
]

export const MOCK_SEATS_BY_SHOWTIME: Record<string, RawSeatRecord[]> = {
  'showtime-1': createSeatLayout(
    'showtime-1',
    ['A', 'B', 'C', 'D', 'E', 'F'],
    10,
    {
      booked: ['A4', 'A5', 'B7', 'C3', 'D8', 'E2', 'F10'],
      held: ['A6', 'B6', 'C6', 'D2', 'E7'],
    },
  ),
  'showtime-2': createSeatLayout(
    'showtime-2',
    ['A', 'B', 'C', 'D', 'E', 'F'],
    10,
    {
      booked: [
        'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
        'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
        'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10',
        'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10',
        'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10',
      ],
    },
  ),
  'showtime-3': createSeatLayout(
    'showtime-3',
    ['A', 'B', 'C', 'D', 'E'],
    8,
    {
      booked: ['A8', 'B4', 'C5'],
      held: ['B5', 'C6', 'D2'],
      malformed: [
        { id: '', row: 'Z', number: 2, status: 'AVAILABLE' },
        { id: 'showtime-3-bad-row', row: '', number: 5, status: 'AVAILABLE' },
        {
          id: 'showtime-3-bad-number',
          row: 'C',
          number: 0,
          status: 'AVAILABLE',
        },
        { id: 'showtime-3-a1', row: 'A', number: 1, status: 'AVAILABLE' },
        { id: 'showtime-3-bad-status', row: 'D', number: 9, status: 'BROKEN' },
      ],
    },
  ),
  'showtime-4': createSeatLayout(
    'showtime-4',
    ['A', 'B', 'C', 'D', 'E'],
    8,
    {
      booked: ['A1', 'A2', 'B8', 'C4', 'D7'],
      held: ['A8', 'B3', 'D3', 'E1'],
    },
  ),
  'showtime-5': createSeatLayout(
    'showtime-5',
    ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    9,
    {
      booked: ['A9', 'B1', 'B2', 'C8', 'D5', 'E9', 'F4'],
      held: ['A4', 'C3', 'E2', 'F7', 'G5'],
    },
  ),
  'showtime-7': createSeatLayout(
    'showtime-7',
    ['A', 'B', 'C', 'D', 'E', 'F'],
    10,
    {
      booked: ['A10', 'B10'],
      held: ['C1', 'D1'],
    },
  ),
}
