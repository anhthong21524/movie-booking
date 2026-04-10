import type { AppLocale } from '~/constants/i18n'
import type { EmptyStateVm } from '~/types/empty-state'

const resolveLocale = (locale: AppLocale) => (locale === 'vi' ? 'vi' : 'en')

export const getMoviesEmptyState = (locale: AppLocale): EmptyStateVm => {
  if (resolveLocale(locale) === 'vi') {
    return {
      title: 'Chưa có phim nào',
      description:
        'Danh sách phim hiện đang trống. Hãy quay lại trang chủ hoặc thử lại sau khi danh mục được cập nhật.',
      icon: '○',
      actionLabel: 'Về trang chủ',
      actionTo: '/',
    }
  }

  return {
    title: 'No movies available',
    description:
      'The movie catalog is currently empty. Return home or check back when new releases are published.',
    icon: '○',
    actionLabel: 'Back home',
    actionTo: '/',
  }
}

export const getTicketsEmptyState = (locale: AppLocale): EmptyStateVm => {
  if (resolveLocale(locale) === 'vi') {
    return {
      title: 'Chưa có vé nào',
      description:
        'Khi bạn hoàn tất một đơn đặt vé, thông tin vé và mã tham chiếu sẽ xuất hiện tại đây.',
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
      title: 'Chưa có suất chiếu',
      description:
        'Phim này chưa có lịch chiếu khả dụng. Hãy thử một phim khác hoặc quay lại sau khi lịch được cập nhật.',
      icon: '◔',
      actionLabel: 'Xem phim khác',
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
