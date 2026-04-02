<script setup lang="ts">
import { formatCurrency } from '~/utils/format'
import { useBookingStore } from '~/stores/booking'

definePageMeta({
  middleware: ['auth'],
})

const bookingStore = useBookingStore()
</script>

<template>
  <div class="space-y-8">
    <PageHero
      title="Checkout"
      description="Minimal state-driven checkout placeholder backed by the booking Pinia store."
    />

    <section
      v-if="bookingStore.booking"
      class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div class="card p-6">
        <h2 class="text-2xl font-bold">Selected seats</h2>
        <div class="mt-5 flex flex-wrap gap-3">
          <span
            v-for="seat in bookingStore.booking.seats"
            :key="seat.id"
            class="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700"
          >
            {{ seat.label }}
          </span>
        </div>
      </div>

      <aside class="card p-6">
        <h2 class="text-xl font-bold">Payment summary</h2>
        <div class="mt-5 flex items-center justify-between gap-3">
          <span class="text-slate-500">Total</span>
          <span class="text-2xl font-bold">{{
            formatCurrency(bookingStore.totalAmount)
          }}</span>
        </div>
      </aside>
    </section>

    <EmptyState
      v-else
      title="No booking in progress"
      description="Start from a showtime and select seats to populate checkout state."
      action-label="Go to movies"
      action-to="/movies"
    />
  </div>
</template>
