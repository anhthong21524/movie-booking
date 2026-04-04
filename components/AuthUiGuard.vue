<script setup lang="ts">
type AuthUiVisibility = 'resolved' | 'authenticated' | 'guest' | 'admin'

const props = withDefaults(
  defineProps<{
    when?: AuthUiVisibility
    showFallbackWhilePending?: boolean
  }>(),
  {
    when: 'resolved',
    showFallbackWhilePending: true,
  },
)

const userStore = useUserStore()

const isPending = computed(() => {
  return userStore.status === 'loading' || userStore.status === 'logging_out'
})

const shouldRender = computed(() => {
  switch (props.when) {
    case 'authenticated':
      return userStore.isAuthenticated
    case 'guest':
      return !userStore.isAuthenticated && userStore.isResolved
    case 'admin':
      return userStore.isAuthenticated && userStore.isAdmin
    case 'resolved':
    default:
      return userStore.isResolved
  }
})

const shouldShowFallback = computed(() => {
  return props.showFallbackWhilePending && isPending.value
})
</script>

<template>
  <slot v-if="shouldRender" />
  <slot v-else-if="shouldShowFallback" name="fallback" />
</template>
