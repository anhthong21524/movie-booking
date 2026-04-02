import type { Movie, Seat, Showtime } from '~/types'

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
    startsAt: '2026-04-03T18:30:00Z',
    roomName: 'Auditorium A',
    price: 12.5,
  },
  {
    id: 'showtime-2',
    movieId: 'movie-1',
    startsAt: '2026-04-03T21:00:00Z',
    roomName: 'Auditorium B',
    price: 14,
  },
  {
    id: 'showtime-3',
    movieId: 'movie-2',
    startsAt: '2026-04-04T17:45:00Z',
    roomName: 'Auditorium C',
    price: 11,
  },
]

export const MOCK_SEATS: Seat[] = [
  { id: 'seat-a1', label: 'A1', row: 'A', number: 1, status: 'AVAILABLE' },
  { id: 'seat-a2', label: 'A2', row: 'A', number: 2, status: 'AVAILABLE' },
  { id: 'seat-a3', label: 'A3', row: 'A', number: 3, status: 'HELD' },
  { id: 'seat-a4', label: 'A4', row: 'A', number: 4, status: 'BOOKED' },
  { id: 'seat-b1', label: 'B1', row: 'B', number: 1, status: 'AVAILABLE' },
  { id: 'seat-b2', label: 'B2', row: 'B', number: 2, status: 'AVAILABLE' },
  { id: 'seat-b3', label: 'B3', row: 'B', number: 3, status: 'HELD' },
  { id: 'seat-b4', label: 'B4', row: 'B', number: 4, status: 'AVAILABLE' },
]
