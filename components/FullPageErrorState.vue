<script setup lang="ts">
defineProps<{
  title: string
  description: string
  retryLabel?: string
  retryDisabled?: boolean
  retryPending?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="card p-8">
    <div class="mx-auto max-w-2xl text-center">
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600"
      >
        !
      </div>
      <h2 class="mt-6 text-2xl font-bold text-slate-950">{{ title }}</h2>
      <p class="mt-3 text-slate-600">{{ description }}</p>
      <div class="mt-6 flex justify-center">
        <button
          type="button"
          class="btn-primary"
          :disabled="retryDisabled || retryPending"
          :aria-disabled="retryDisabled || retryPending"
          @click="$emit('retry')"
        >
          {{ retryPending ? 'Retrying...' : retryLabel || 'Retry' }}
        </button>
      </div>
    </div>
  </section>
</template>
