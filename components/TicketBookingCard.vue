<script setup lang="ts">
import type { TicketBookingCardVm } from '~/types/tickets'

defineProps<{
  booking: TicketBookingCardVm
}>()
</script>

<template>
  <article class="card overflow-hidden p-6">
    <div class="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Booking reference
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-3">
          <h2 class="text-2xl font-bold text-slate-950">{{ booking.movieTitle }}</h2>
          <code
            class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
            :title="booking.id"
          >
            {{ booking.referenceId }}
          </code>
        </div>
      </div>

      <span
        class="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold"
        :class="{
          'bg-emerald-50 text-emerald-700': booking.status.tone === 'emerald',
          'bg-amber-50 text-amber-800': booking.status.tone === 'amber',
          'bg-slate-100 text-slate-700': booking.status.tone === 'slate',
        }"
      >
        {{ booking.status.label }}
      </span>
    </div>

    <div class="mt-6 grid gap-6 xl:grid-cols-[1fr_12rem]">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-[1.5rem] border border-border bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Showtime
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-950">
            {{ booking.startsAtLabel }}
          </p>
          <p class="mt-1 text-sm text-slate-600">{{ booking.roomName }}</p>
        </div>

        <div class="rounded-[1.5rem] border border-border bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Booked at
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-950">
            {{ booking.bookedAtLabel }}
          </p>
          <p class="mt-1 text-sm text-slate-600">Total {{ booking.totalLabel }}</p>
        </div>

        <div class="rounded-[1.5rem] border border-border bg-slate-50 p-4 sm:col-span-2">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Seats
          </p>
          <p class="mt-2 text-lg font-semibold text-slate-950">
            {{ booking.seatSummary }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="seatLabel in booking.seatLabels"
              :key="seatLabel"
              class="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-700"
            >
              {{ seatLabel }}
            </span>
          </div>
        </div>
      </div>

      <div class="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-4">
        <div class="flex h-full flex-col items-center justify-center rounded-[1.25rem] bg-white px-4 py-6 text-center">
          <div class="grid h-20 w-20 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            QR
          </div>
          <p class="mt-4 text-sm font-semibold text-slate-900">
            {{ booking.qrPlaceholderLabel }}
          </p>
          <p class="mt-2 text-xs leading-5 text-slate-500">
            {{ booking.qrPlaceholderHint }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
