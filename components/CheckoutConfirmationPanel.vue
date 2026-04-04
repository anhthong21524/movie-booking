<script setup lang="ts">
import type { CheckoutSummaryVm } from '~/types/checkout'

defineProps<{
  summary: CheckoutSummaryVm
  submitState: 'idle' | 'submitting' | 'success' | 'error'
  submitMessage: string
  confirmDisabled: boolean
  backToSeatsTo: string
}>()

defineEmits<{
  confirm: []
}>()
</script>

<template>
  <aside class="card p-6">
    <h2 class="text-xl font-bold text-slate-950">Confirmation</h2>

    <div class="mt-5 space-y-3">
      <div
        v-for="item in summary.pricingItems"
        :key="item.id"
        class="flex items-center justify-between gap-3 text-sm"
      >
        <span class="text-slate-500">{{ item.label }}</span>
        <span class="font-semibold text-slate-900">{{ item.value }}</span>
      </div>
    </div>

    <div class="mt-5 border-t border-border pt-5">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-slate-500">Total</span>
        <span class="text-2xl font-bold text-slate-950">{{ summary.totalLabel }}</span>
      </div>
    </div>

    <div
      class="mt-5 rounded-[1.5rem] border px-4 py-4 text-sm"
      :class="{
        'border-slate-200 bg-slate-50 text-slate-700': submitState === 'idle' || submitState === 'submitting',
        'border-emerald-200 bg-emerald-50 text-emerald-900': submitState === 'success',
        'border-rose-200 bg-rose-50 text-rose-900': submitState === 'error',
      }"
      aria-live="polite"
    >
      <p class="font-semibold">{{ submitMessage }}</p>
      <p
        v-if="submitState === 'idle' || submitState === 'submitting'"
        class="mt-2 leading-6"
      >
        {{ summary.guidance }}
      </p>
    </div>

    <div class="mt-6 space-y-3">
      <button
        type="button"
        class="btn-primary w-full"
        :disabled="confirmDisabled || submitState === 'submitting' || submitState === 'success'"
        :aria-disabled="confirmDisabled || submitState === 'submitting' || submitState === 'success'"
        @click="$emit('confirm')"
      >
        {{
          submitState === 'submitting'
            ? 'Confirming booking...'
            : submitState === 'success'
              ? 'Booking confirmed'
              : 'Confirm booking'
        }}
      </button>

      <NuxtLink :to="backToSeatsTo" class="btn-secondary w-full text-center">
        Back to seats
      </NuxtLink>
    </div>
  </aside>
</template>
