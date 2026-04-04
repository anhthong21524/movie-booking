export const AUTH_PASSWORD_MIN_LENGTH = 8

export const AUTH_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const DEFAULT_AUTH_REDIRECT = '/movies'
export const DEFAULT_PUBLIC_REDIRECT = '/'
export const LOGIN_PATH = '/login'
export const REGISTER_PATH = '/register'
export const REDIRECT_QUERY_KEY = 'redirect'
export const REGISTER_SUCCESS_QUERY_KEY = 'registered'
export const AUTH_SYNC_STORAGE_KEY = 'moviehub.auth.sync'

export const AUTH_ONLY_PATH_PREFIXES = ['/booking', '/checkout'] as const
export const AUTH_ONLY_PATHS = ['/tickets'] as const
export const ADMIN_PATH_PREFIXES = ['/admin'] as const
export const GUEST_ONLY_PATHS = [LOGIN_PATH, REGISTER_PATH] as const
