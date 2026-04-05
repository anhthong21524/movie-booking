export interface NavigationItem {
  key: 'movies' | 'tickets' | 'admin'
  to: string
  requiresAuth?: boolean
  requiresAdmin?: boolean
}

export interface AdminNavigationItem {
  key: 'adminMovies' | 'adminShowtimes'
  to: string
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  { key: 'movies', to: '/movies' },
  { key: 'tickets', to: '/tickets', requiresAuth: true },
  { key: 'admin', to: '/admin/movies', requiresAdmin: true },
]

export const ADMIN_NAVIGATION: AdminNavigationItem[] = [
  { key: 'adminMovies', to: '/admin/movies' },
  { key: 'adminShowtimes', to: '/admin/showtimes' },
]
