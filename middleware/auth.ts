import { LOGIN_PATH, REDIRECT_QUERY_KEY } from '~/constants/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { data, getSession, status } = useAuth()

  if (status.value === 'loading') {
    await getSession()
  }

  if (status.value !== 'authenticated' || !data.value?.user?.id) {
    return navigateTo({
      path: LOGIN_PATH,
      query: {
        [REDIRECT_QUERY_KEY]: to.fullPath,
      },
    })
  }
})
