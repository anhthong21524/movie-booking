import { DEFAULT_AUTH_REDIRECT } from '~/constants/auth'

export default defineNuxtRouteMiddleware(async () => {
  const { data, getSession, status } = useAuth()

  if (status.value === 'loading') {
    await getSession()
  }

  if (status.value === 'authenticated' && data.value?.user?.id) {
    return navigateTo(DEFAULT_AUTH_REDIRECT)
  }
})
