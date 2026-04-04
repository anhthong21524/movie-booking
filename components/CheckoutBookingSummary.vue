<script setup lang="ts">
import type { CheckoutSummaryVm } from '~/types/checkout'

defineProps<{
  summary: CheckoutSummaryVm
}>()
</script>

<template>
  <section class="card p-6">
    <div class="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Booking summary
        </p>
        <h2 class="mt-2 text-2xl font-bold text-slate-950">
          {{ summary.movieTitle }}
        </h2>
      </div>
      <span class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
        {{ summary.bookingStatusLabel }}
      </span>
    </div>

    <dl class="mt-6 grid gap-4 md:grid-cols-2">
      <div class="rounded-[1.5rem] border border-border bg-slate-50 p-4">
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Room
        </dt>
        <dd class="mt-2 text-lg font-semibold text-slate-950">
          {{ summary.roomName }}
        </dd>
      </div>
      <div class="rounded-[1.5rem] border border-border bg-slate-50 p-4">
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Starts
        </dt>
        <dd class="mt-2 text-lg font-semibold text-slate-950">
          {{ summary.startsAtLabel }}
        </dd>
      </div>
      <div class="rounded-[1.5rem] border border-border bg-slate-50 p-4 md:col-span-2">
        <dt class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Selected seats
        </dt>
        <dd class="mt-2">
          <p class="text-sm font-semibold text-slate-700">{{ summary.seatSummaryLabel }}</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="seat in summary.selectedSeats"
              :key="seat.id"
              class="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700"
            >
              {{ seat.label }}
            </span>
          </div>
        </dd>
      </div>
    </dl>
  </section>
</template>
