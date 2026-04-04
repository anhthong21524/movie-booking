<script setup lang="ts">
defineProps<{
  title: string
  description: string
  showRetry?: boolean
  retryLabel?: string
  retryDisabled?: boolean
  retryPending?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <RetryPanel
    :title="title"
    :description="description"
    :show-retry="showRetry"
    :retry-label="retryLabel"
    :retry-disabled="retryDisabled"
    :retry-pending="retryPending"
    @retry="$emit('retry')"
  />
</template>
