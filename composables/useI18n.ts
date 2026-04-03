import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from '~/constants/i18n'
import { en } from '~/locales/en'
import { vi } from '~/locales/vi'

interface MessageObject {
  [key: string]: MessageNode
}

type MessageNode = string | MessageObject

const messages = { en, vi }

const resolveMessage = (
  source: MessageNode,
  segments: string[],
): MessageNode | undefined => {
  return segments.reduce<MessageNode | undefined>((current, segment) => {
    if (!current || typeof current === 'string') {
      return undefined
    }

    return current[segment]
  }, source)
}

export const useAppLocale = () => {
  const localeCookie = useCookie<AppLocale>('moviehub-locale', {
    default: () => DEFAULT_LOCALE,
  })

  const locale = computed<AppLocale>({
    get: () =>
      SUPPORTED_LOCALES.includes(localeCookie.value as AppLocale)
        ? (localeCookie.value as AppLocale)
        : DEFAULT_LOCALE,
    set: (value) => {
      localeCookie.value = value
    },
  })

  const currentMessages = computed(() => messages[locale.value])

  const getNode = (path: string) => {
    const segments = path.split('.')

    return (
      resolveMessage(currentMessages.value, segments) ||
      resolveMessage(messages[DEFAULT_LOCALE], segments)
    )
  }

  const t = (path: string) => {
    const resolved = getNode(path)
    return typeof resolved === 'string' ? resolved : path
  }

  const tm = <T>(path: string) => getNode(path) as T | undefined

  const setLocale = (value: AppLocale) => {
    locale.value = value
  }

  return {
    locale,
    supportedLocales: SUPPORTED_LOCALES,
    t,
    tm,
    setLocale,
  }
}
