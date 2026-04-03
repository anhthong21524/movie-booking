export const SUPPORTED_LOCALES = ['en', 'vi'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'vi'
