<script setup lang="ts">
import type { SeatSelectionSummaryVm } from '~/types/seat-selection'

defineProps<{
  roomName: string
  startsAtLabel: string
  unitPriceLabel: string
  summary: SeatSelectionSummaryVm
  actionLabel: string
  actionDisabled: boolean
  actionPending: boolean
}>()

defineEmits<{
  continue: []
}>()
</script>

<template>
  <aside class="card p-6">
    <h2 class="text-xl font-bold">Booking summary</h2>

    <dl class="mt-5 space-y-4 text-sm">
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500">Showtime</dt>
        <dd class="text-right font-semibold">{{ roomName }}</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500">Starts</dt>
        <dd class="text-right font-semibold">{{ startsAtLabel }}</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500">Seat price</dt>
        <dd class="text-right font-semibold">{{ unitPriceLabel }}</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500">Selected</dt>
        <dd class="text-right font-semibold">{{ summary.selectedCount }}</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500">Available now</dt>
        <dd class="text-right font-semibold">{{ summary.availableCount }}</dd>
      </div>
      <div class="flex items-center justify-between gap-3">
        <dt class="text-slate-500">Unavailable</dt>
        <dd class="text-right font-semibold">{{ summary.unavailableCount }}</dd>
      </div>
    </dl>

    <div class="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
      <p class="text-sm font-semibold text-slate-900">{{ summary.statusMessage }}</p>
      <p class="mt-2 text-sm leading-6 text-slate-600">{{ summary.guidance }}</p>
    </div>

    <div class="mt-5">
      <p class="text-sm font-semibold text-slate-900">Selected seats</p>
      <div v-if="summary.selectedSeats.length" class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="seat in summary.selectedSeats"
          :key="seat.id"
          class="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700"
        >
          {{ seat.label }}
        </span>
      </div>
      <p v-else class="mt-3 text-sm text-slate-500">
        Pick at least one available seat to continue.
      </p>
    </div>

    <div class="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
      <div>
        <p class="text-sm text-slate-500">Subtotal</p>
        <p class="text-2xl font-bold text-slate-950">{{ summary.formattedSubtotal }}</p>
      </div>
      <LoadingButton
        :label="actionLabel"
        :loading="actionPending"
        loading-label="Opening checkout..."
        :disabled="actionDisabled"
        @click="$emit('continue')"
      />
    </div>
  </aside>
</template>
