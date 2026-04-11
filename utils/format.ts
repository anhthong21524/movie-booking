import type { AppLocale } from '~/constants/i18n'

const resolveLocale = (locale: AppLocale) =>
  locale === 'vi' ? 'vi-VN' : 'en-US'

const USD_TO_VND_RATE = 25000

export const formatCurrency = (
  value: number,
  currency = 'USD',
  locale: AppLocale = 'en',
) => {
  if (locale === 'vi' && currency === 'USD') {
    const convertedValue = value * USD_TO_VND_RATE
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(convertedValue)

    return `${formattedNumber} VNĐ`
  }

  if (locale === 'vi' && currency === 'VND') {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(value)

    return `${formattedNumber} VNĐ`
  }

  return new Intl.NumberFormat(resolveLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatDateTime = (value: string, locale: AppLocale = 'en') =>
  new Intl.DateTimeFormat(resolveLocale(locale), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
