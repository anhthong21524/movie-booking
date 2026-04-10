import type { Showtime } from '~/types'
import { normalizeRoomDisplayName } from '~/utils/admin-showtime-validation'

export const normalizeShowtime = (showtime: Showtime): Showtime => {
  return {
    ...showtime,
    roomName: normalizeRoomDisplayName(showtime.roomName),
  }
}

export const normalizeShowtimes = (showtimes: Showtime[]) => {
  return showtimes.map(normalizeShowtime)
}
