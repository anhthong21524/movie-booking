import type { AppLocale } from '~/constants/i18n'

const resolveLocale = (locale: AppLocale) =>
  locale === 'vi' ? 'vi-VN' : 'en-US'

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale: AppLocale = 'en',
) =>
  new Intl.NumberFormat(resolveLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)

export const formatDateTime = (value: string, locale: AppLocale = 'en') =>
  new Intl.DateTimeFormat(resolveLocale(locale), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
