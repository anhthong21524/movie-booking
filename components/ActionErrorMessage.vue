<script setup lang="ts">
defineProps<{
  title: string
  description: string
  retryable?: boolean
  retryLabel?: string
  retryDisabled?: boolean
  retryPending?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
    <p class="font-semibold">{{ title }}</p>
    <p class="mt-2 leading-6">{{ description }}</p>
    <button
      v-if="retryable"
      type="button"
      class="btn-secondary mt-4"
      :disabled="retryDisabled || retryPending"
      :aria-disabled="retryDisabled || retryPending"
      @click="$emit('retry')"
    >
      {{ retryPending ? 'Retrying...' : retryLabel || 'Try again' }}
    </button>
  </div>
</template>
