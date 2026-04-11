<script setup lang="ts">
import type { SeatGridRowVm } from '~/types/seat-selection'

defineProps<{
  rows: SeatGridRowVm[]
  interactionMessage?: string | null
}>()

defineEmits<{
  toggle: [seatId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <section class="card overflow-hidden p-6">
    <div
      class="mb-6 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
    >
      {{ t('bookingPage.screen') }}
    </div>

    <SeatLegend />

    <p class="sr-only" aria-live="polite">
      {{ interactionMessage }}
    </p>

    <div class="mt-6 overflow-x-auto pb-2">
      <div class="min-w-[680px] space-y-3">
        <div
          v-for="row in rows"
          :key="row.rowKey"
          class="grid items-center gap-3"
          :style="{ gridTemplateColumns: '3rem minmax(0, 1fr)' }"
        >
          <div
            class="flex h-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600"
          >
            {{ row.rowLabel }}
          </div>

          <div
            class="grid gap-2"
            :style="{ gridTemplateColumns: `repeat(${row.seats.length}, minmax(0, 1fr))` }"
          >
            <button
              v-for="seat in row.seats"
              :key="seat.id"
              type="button"
              class="flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              :class="{
                'border-slate-300 bg-white text-slate-800 hover:border-primary-400 hover:bg-primary-50': seat.presentationState === 'available',
                'border-primary-500 bg-primary-500 text-white shadow-sm': seat.presentationState === 'selected',
                'cursor-not-allowed border-slate-400 bg-slate-400 text-white opacity-85': seat.presentationState === 'booked',
                'cursor-not-allowed border-amber-300 bg-amber-200 text-amber-900 opacity-90': seat.presentationState === 'held',
              }"
              :disabled="seat.isDisabled"
              :aria-disabled="seat.isDisabled"
              :aria-pressed="seat.isSelected"
              :aria-label="seat.assistiveLabel"
              @click="$emit('toggle', seat.id)"
            >
              {{ seat.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
