export interface NavigationItem {
  key: 'movies' | 'tickets' | 'adminMovies' | 'adminShowtimes'
  to: string
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  { key: 'movies', to: '/movies' },
  { key: 'tickets', to: '/tickets', requiresAuth: true },
  { key: 'adminMovies', to: '/admin/movies', requiresAdmin: true },
  { key: 'adminShowtimes', to: '/admin/showtimes', requiresAdmin: true },
]
