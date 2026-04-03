<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const bookingStore = useBookingStore()
const { t } = useAppLocale()
const { localizedShowtimes, seats } = useCatalog()

const showtime = computed(() =>
  localizedShowtimes.value.find((item) => item.id === route.params.showtimeId),
)

if (!showtime.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t('bookingPage.showtimeNotFound'),
  })
}

const selectableSeats = computed(() =>
  seats.value.filter((seat) => seat.status === 'AVAILABLE'),
)

const handleSeatSelection = () => {
  bookingStore.startBooking(
    showtime.value!.id,
    selectableSeats.value.slice(0, 2),
  )
  navigateTo(`/checkout/${bookingStore.booking?.id ?? 'draft-booking'}`)
}
</script>

<template>
  <div v-if="showtime" class="space-y-8">
    <PageHero
      :title="t('bookingPage.heroTitle')"
      :description="t('bookingPage.heroDescription')"
    />

    <section class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div class="card p-6">
        <div
          class="mb-6 rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/80"
        >
          {{ t('bookingPage.screen') }}
        </div>
        <div class="grid grid-cols-4 gap-3 sm:grid-cols-6">
          <div
            v-for="seat in seats"
            :key="seat.id"
            class="rounded-xl px-3 py-4 text-center text-sm font-semibold"
            :class="{
              'bg-emerald-50 text-emerald-700': seat.status === 'AVAILABLE',
              'bg-amber-50 text-amber-700': seat.status === 'HELD',
              'bg-rose-50 text-rose-700': seat.status === 'BOOKED',
            }"
          >
            {{ seat.label }}
          </div>
        </div>
      </div>

      <aside class="card p-6">
        <h2 class="text-xl font-bold">{{ t('bookingPage.summaryTitle') }}</h2>
        <dl class="mt-5 space-y-4 text-sm">
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500">{{ t('bookingPage.showtime') }}</dt>
            <dd class="font-semibold">{{ showtime.roomName }}</dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-slate-500">
              {{ t('bookingPage.selectableSeats') }}
            </dt>
            <dd class="font-semibold">{{ selectableSeats.length }}</dd>
          </div>
        </dl>
        <button class="btn-primary mt-6 w-full" @click="handleSeatSelection">
          {{ t('bookingPage.continueToCheckout') }}
        </button>
      </aside>
    </section>
  </div>
</template>
