<script setup lang="ts">
defineProps<{
  title: string
  description: string
  retryLabel?: string
  showRetry?: boolean
  retryDisabled?: boolean
  retryPending?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="rounded-[1.5rem] border border-border bg-slate-50 p-5">
    <h2 class="text-lg font-bold text-slate-950">{{ title }}</h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">{{ description }}</p>
    <button
      v-if="showRetry !== false"
      type="button"
      class="btn-secondary mt-4"
      :disabled="retryDisabled || retryPending"
      :aria-disabled="retryDisabled || retryPending"
      @click="$emit('retry')"
    >
      {{ retryPending ? 'Retrying...' : retryLabel || 'Retry' }}
    </button>
  </div>
</template>
