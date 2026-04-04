<script setup lang="ts">
import { formatCurrency } from '~/utils/format'
import { useBookingStore } from '~/stores/booking'

const bookingStore = useBookingStore()
const { locale, t } = useI18n()
const route = useRoute()

const activeBooking = computed(() => {
  const bookingId =
    typeof route.params.bookingId === 'string' ? route.params.bookingId : ''

  if (!bookingStore.booking || bookingStore.booking.id !== bookingId) {
    return null
  }

  return bookingStore.booking
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('checkoutPage.heroTitle')"
      :description="t('checkoutPage.heroDescription')"
    />

    <section
      v-if="activeBooking"
      class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <div class="card p-6">
        <h2 class="text-2xl font-bold">
          {{ t('checkoutPage.selectedSeats') }}
        </h2>
        <div class="mt-5 flex flex-wrap gap-3">
          <span
            v-for="seat in activeBooking.seats"
            :key="seat.id"
            class="rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700"
          >
            {{ seat.label }}
          </span>
        </div>
      </div>

      <aside class="card p-6">
        <h2 class="text-xl font-bold">
          {{ t('checkoutPage.paymentSummary') }}
        </h2>
        <div class="mt-5 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">Seat price</span>
            <span class="font-semibold">{{
              formatCurrency(activeBooking.unitPrice, 'USD', locale)
            }}</span>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">{{ t('checkoutPage.total') }}</span>
            <span class="text-2xl font-bold">{{
              formatCurrency(bookingStore.totalAmount, 'USD', locale)
            }}</span>
          </div>
        </div>
      </aside>
    </section>

    <EmptyState
      v-else
      :title="t('checkoutPage.noBookingTitle')"
      :description="t('checkoutPage.noBookingDescription')"
      :action-label="t('checkoutPage.goToMovies')"
      action-to="/movies"
    />
  </div>
</template>
