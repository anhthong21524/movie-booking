<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    retryable?: boolean
    retryLabel?: string
    retryPending?: boolean
    retryDisabled?: boolean
  }>(),
  {
    retryable: false,
    retryLabel: 'Try again',
    retryPending: false,
    retryDisabled: false,
  },
)

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
    <p class="text-sm font-semibold">{{ title }}</p>
    <p class="mt-2 text-sm leading-6">{{ description }}</p>

    <LoadingButton
      v-if="retryable"
      class="mt-4"
      variant="secondary"
      :label="retryLabel"
      :loading="retryPending"
      :loading-label="`${retryLabel}...`"
      :disabled="retryDisabled"
      @click="$emit('retry')"
    />
  </div>
</template>
