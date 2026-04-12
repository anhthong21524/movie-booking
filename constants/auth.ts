export const AUTH_PASSWORD_MIN_LENGTH = 8
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24
export const AUTH_SESSION_UPDATE_AGE_SECONDS = 60 * 60
export const AUTH_SESSION_REFRESH_INTERVAL_MS = 5 * 60 * 1000
export const AUTH_SESSION_EXPIRY_SKEW_MS = 5 * 1000
export const AUTH_ACCESS_TOKEN_REFRESH_BUFFER_SECONDS = 5 * 60

export const AUTH_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const AUTH_PASSWORD_LETTER_PATTERN = /[A-Za-z]/
export const AUTH_PASSWORD_NUMBER_PATTERN = /\d/

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
