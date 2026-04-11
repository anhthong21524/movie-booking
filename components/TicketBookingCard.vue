<script setup lang="ts">
import type { TicketBookingCardVm } from '~/types/tickets'

defineProps<{
  booking: TicketBookingCardVm
}>()

const { t } = useI18n()
</script>

<template>
  <article class="card overflow-hidden shadow-soft">
    <!-- Status accent stripe -->
    <div
      class="h-1 w-full"
      :class="{
        'bg-emerald-500': booking.status.tone === 'emerald',
        'bg-amber-400': booking.status.tone === 'amber',
        'bg-slate-300': booking.status.tone === 'slate',
      }"
    />

    <div class="p-6 sm:p-7">
      <!-- Header -->
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {{ t('ticketsPage.movieTicket') }}
          </p>
          <h2 class="mt-1.5 truncate text-2xl font-bold text-slate-950">
            {{ booking.movieTitle }}
          </h2>
          <div class="mt-2 flex items-center gap-2">
            <code
              class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500"
              :title="booking.id"
            >
              #{{ booking.referenceId }}
            </code>
          </div>
        </div>

        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold"
          :class="{
            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200': booking.status.tone === 'emerald',
            'bg-amber-50 text-amber-800 ring-1 ring-amber-200': booking.status.tone === 'amber',
            'bg-slate-100 text-slate-600 ring-1 ring-slate-200': booking.status.tone === 'slate',
          }"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="{
              'bg-emerald-500': booking.status.tone === 'emerald',
              'bg-amber-500': booking.status.tone === 'amber',
              'bg-slate-400': booking.status.tone === 'slate',
            }"
          />
          {{ booking.status.label }}
        </span>
      </div>

      <!-- Perforated divider -->
      <div class="relative my-6 flex items-center">
        <div class="w-full border-t-2 border-dashed border-slate-200" />
        <div class="absolute -left-7 h-5 w-5 rounded-full bg-background sm:-left-8" />
        <div class="absolute -right-7 h-5 w-5 rounded-full bg-background sm:-right-8" />
      </div>

      <!-- Body: info columns + QR -->
      <div class="grid gap-6 xl:grid-cols-[1fr_9rem]">
        <!-- Info -->
        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Showtime -->
          <div
            class="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-4"
          >
            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {{ t('ticketsPage.showtime') }}
              </p>
              <p class="mt-1 text-sm font-semibold leading-snug text-slate-900">
                {{ booking.startsAtLabel }}
              </p>
              <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                {{ booking.roomName }}
              </p>
            </div>
          </div>

          <!-- Booked at -->
          <div
            class="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-4"
          >
            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {{ t('ticketsPage.booked') }}
              </p>
              <p class="mt-1 text-sm font-semibold leading-snug text-slate-900">
                {{ booking.bookedAtLabel }}
              </p>
              <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                {{ t('ticketsPage.total') }} {{ booking.totalLabel }}
              </p>
            </div>
          </div>

          <!-- Seats -->
          <div
            class="flex items-start gap-3 rounded-2xl border border-border bg-slate-50 p-4 sm:col-span-2"
          >
            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                {{ t('ticketsPage.seatsReserved').replace('{count}', String(booking.seatLabels.length)) }}
              </p>
              <div class="mt-2.5 flex flex-wrap gap-2">
                <span
                  v-for="seatLabel in booking.seatLabels"
                  :key="seatLabel"
                  class="rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-bold tracking-wide text-primary-700"
                >
                  {{ seatLabel }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- QR placeholder -->
        <div
          class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center"
        >
          <!-- Fake QR grid -->
          <div class="relative h-20 w-20">
            <div class="grid h-full w-full grid-cols-5 grid-rows-5 gap-[2px] rounded-lg p-1.5"
              :class="booking.status.tone === 'slate' ? 'bg-slate-200' : 'bg-white shadow-sm border border-slate-200'"
            >
              <div
                v-for="cell in 25"
                :key="cell"
                class="rounded-[1px]"
                :class="[
                  [1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25].includes(cell) ? (booking.status.tone === 'slate' ? 'bg-slate-400' : 'bg-slate-800') : (booking.status.tone === 'slate' ? 'bg-slate-100' : 'bg-slate-100'),
                ]"
              />
            </div>
            <!-- Corner squares overlay for real QR look -->
            <div class="absolute left-1.5 top-1.5 h-5 w-5 rounded-sm border-[3px]"
              :class="booking.status.tone === 'slate' ? 'border-slate-400' : 'border-slate-800'"
            />
            <div class="absolute right-1.5 top-1.5 h-5 w-5 rounded-sm border-[3px]"
              :class="booking.status.tone === 'slate' ? 'border-slate-400' : 'border-slate-800'"
            />
            <div class="absolute bottom-1.5 left-1.5 h-5 w-5 rounded-sm border-[3px]"
              :class="booking.status.tone === 'slate' ? 'border-slate-400' : 'border-slate-800'"
            />
          </div>

          <div>
            <p class="text-xs font-semibold text-slate-700">
              {{ booking.status.tone === 'slate' ? t('ticketsPage.cancelledStatus') : t('ticketsPage.scanAtEntrance') }}
            </p>
            <p class="mt-1 text-[10px] leading-4 text-slate-400">
              {{ booking.status.tone === 'slate' ? t('ticketsPage.ticketNoLongerValid') : t('ticketsPage.qrComingSoon') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
