import type { AppLocale } from '~/constants/i18n'
import type { EmptyStateVm } from '~/types/empty-state'

const resolveLocale = (locale: AppLocale) => (locale === 'vi' ? 'vi' : 'en')

export const getMoviesEmptyState = (locale: AppLocale): EmptyStateVm => {
  if (resolveLocale(locale) === 'vi') {
    return {
      title: 'Chua co phim nao',
      description:
        'Danh sach phim hien dang trong. Hay quay lai trang chu hoac thu lai sau khi catalog duoc cap nhat.',
      icon: '◌',
      actionLabel: 'Ve trang chu',
      actionTo: '/',
    }
  }

  return {
    title: 'No movies available',
    description:
      'The movie catalog is currently empty. Return home or check back when new releases are published.',
    icon: '◌',
    actionLabel: 'Back home',
    actionTo: '/',
  }
}

export const getTicketsEmptyState = (locale: AppLocale): EmptyStateVm => {
  if (resolveLocale(locale) === 'vi') {
    return {
      title: 'Chua co ve nao',
      description:
        'Khi ban hoan tat mot don dat ve, thong tin ve va ma tham chieu se xuat hien tai day.',
      icon: '◍',
      actionLabel: 'Xem phim',
      actionTo: '/movies',
    }
  }

  return {
    title: 'No tickets yet',
    description:
      'Once you complete a booking, your ticket references and future QR access will appear here.',
    icon: '◍',
    actionLabel: 'Browse movies',
    actionTo: '/movies',
  }
}

export const getShowtimesEmptyState = (locale: AppLocale): EmptyStateVm => {
  if (resolveLocale(locale) === 'vi') {
    return {
      title: 'Chua co suat chieu',
      description:
        'Phim nay chua co lich chieu kha dung. Hay thu mot phim khac hoac quay lai sau khi lich duoc cap nhat.',
      icon: '◔',
      actionLabel: 'Xem phim khac',
      actionTo: '/movies',
    }
  }

  return {
    title: 'No showtimes available',
    description:
      'This movie does not have any available sessions yet. Try another movie or check back when the schedule is updated.',
    icon: '◔',
    actionLabel: 'Browse other movies',
    actionTo: '/movies',
  }
}
