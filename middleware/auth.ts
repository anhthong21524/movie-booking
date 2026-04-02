export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()

  if (!userStore.isAuthenticated) {
    console.info(
      'Auth middleware stub: allow access or redirect once authentication is implemented.',
    )
  }
})
