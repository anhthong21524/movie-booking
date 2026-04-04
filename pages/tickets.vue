<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import { buildTicketHistoryState } from '~/utils/tickets'

const { locale, t } = useI18n()
const { localizedMovies, localizedShowtimes } = useCatalog()
const bookingStore = useBookingStore()

const isPageReady = ref(false)
const pageError = ref<Error | null>(null)

onMounted(() => {
  try {
    bookingStore.hydrateBooking()
    isPageReady.value = true
  } catch (error) {
    pageError.value =
      error instanceof Error ? error : new Error('Unable to load tickets page.')
    isPageReady.value = true
  }
})

const ticketHistoryState = computed(() =>
  buildTicketHistoryState({
    bookings: bookingStore.bookingHistory,
    movies: localizedMovies.value,
    showtimes: localizedShowtimes.value,
    locale: locale.value,
  }),
)
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('ticketsPage.heroTitle')"
      :description="t('ticketsPage.heroDescription')"
    />

    <section
      v-if="!isPageReady"
      class="space-y-5"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        v-for="item in 2"
        :key="item"
        class="card p-6"
      >
        <div class="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_12rem]">
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="block in 3"
              :key="block"
              class="h-28 animate-pulse rounded-[1.5rem] bg-slate-100"
            />
          </div>
          <div class="h-56 animate-pulse rounded-[1.75rem] bg-slate-100" />
        </div>
      </div>
    </section>

    <EmptyState
      v-else-if="pageError"
      title="We could not load your bookings"
      description="Refresh the page to retry. If the issue persists, return to the movie list and check your bookings again later."
      action-label="Browse movies"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="ticketHistoryState.kind === 'malformed'"
      title="Booking history is temporarily unavailable"
      description="All saved bookings were malformed or linked to invalid showtimes, so tickets could not be rendered safely."
      action-label="Browse movies"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="ticketHistoryState.kind === 'empty'"
      :title="t('ticketsPage.emptyTitle')"
      :description="t('ticketsPage.emptyDescription')"
      :action-label="t('ticketsPage.action')"
      action-to="/movies"
    />

    <section v-else class="space-y-5">
      <div
        v-if="ticketHistoryState.malformedCount"
        class="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"
      >
        {{
          `${ticketHistoryState.malformedCount} malformed booking ${ticketHistoryState.malformedCount === 1 ? 'record was' : 'records were'} hidden because required ticket data was missing or invalid.`
        }}
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-950">Your bookings</h2>
          <p class="mt-1 text-slate-600">
            Upcoming and recent booking references with status, seats, and QR placeholder space.
          </p>
        </div>
        <p class="text-sm text-slate-500">
          {{ ticketHistoryState.items.length }}
          {{ ticketHistoryState.items.length === 1 ? 'booking' : 'bookings' }}
        </p>
      </div>

      <div class="space-y-5">
        <TicketBookingCard
          v-for="booking in ticketHistoryState.items"
          :key="booking.id"
          :booking="booking"
        />
      </div>
    </section>
  </div>
</template>
