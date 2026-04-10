<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  description: string
  heading?: string
  confirmLabel?: string
  cancelLabel?: string
  pending?: boolean
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4"
    >
      <div class="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
          {{ heading }}
        </p>
        <h2 class="mt-3 text-2xl font-bold text-slate-950">{{ title }}</h2>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ description }}</p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="btn-secondary"
            :disabled="pending"
            @click="$emit('cancel')"
          >
            {{ cancelLabel || '' }}
          </button>
          <LoadingButton
            variant="primary"
            :label="confirmLabel || ''"
            :loading="pending"
            :loading-label="`${confirmLabel || ''}...`"
            @click="$emit('confirm')"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
