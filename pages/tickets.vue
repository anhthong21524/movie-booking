<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import type { TicketHistoryState } from '~/types/tickets'
import type { Movie, Showtime } from '~/types'
import { getTicketsEmptyState } from '~/utils/empty-state'
import { buildTicketHistoryState } from '~/utils/tickets'

const { locale, t } = useI18n()
const bookingStore = useBookingStore()
const { getMessage } = useApiError()
const { request } = useApi()

const loadTicketHistory = async (): Promise<TicketHistoryState> => {
  bookingStore.hydrateBooking()

  if (!bookingStore.bookingHistory.length) {
    return buildTicketHistoryState({
      bookings: [],
      movies: [],
      showtimes: [],
      locale: locale.value,
    })
  }

  const uniqueShowtimeIds = Array.from(
    new Set(bookingStore.bookingHistory.map((booking) => booking.showtimeId)),
  )
  const showtimes = await Promise.all(
    uniqueShowtimeIds.map((showtimeId) =>
      request<Showtime>(`/api/v1/showtimes/${showtimeId}`),
    ),
  )
  const uniqueMovieIds = Array.from(
    new Set(showtimes.map((showtime) => showtime.movieId)),
  )
  const movies = await Promise.all(
    uniqueMovieIds.map((movieId) => request<Movie>(`/api/v1/movies/${movieId}`)),
  )

  return buildTicketHistoryState({
    bookings: bookingStore.bookingHistory,
    movies,
    showtimes,
    locale: locale.value,
  })
}

const {
  data: ticketHistoryState,
  error: pageError,
  status: pageStatus,
  canRetry,
  execute,
  retry,
} = useRetryableRequest(loadTicketHistory)

const pageErrorMessage = computed(() =>
  pageError.value ? getMessage(pageError.value, 'page') : null,
)
const ticketsEmptyState = computed(() => getTicketsEmptyState(locale.value))

onMounted(async () => {
  await execute()
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('ticketsPage.heroTitle')"
      :description="t('ticketsPage.heroDescription')"
    />

    <section
      v-if="pageStatus === 'loading' || pageStatus === 'idle'"
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

    <FullPageErrorState
      v-else-if="pageError && pageErrorMessage"
      :title="pageErrorMessage.title"
      :description="pageErrorMessage.description"
      :retry-label="pageErrorMessage.retryLabel"
      :retry-disabled="!canRetry"
      :retry-pending="false"
      @retry="retry"
    />

    <PageEmptyState
      v-else-if="ticketHistoryState?.kind === 'malformed'"
      title="Booking history is temporarily unavailable"
      description="All saved bookings were malformed or linked to invalid showtimes, so tickets could not be rendered safely."
      action-label="Browse movies"
      action-to="/movies"
    />

    <PageEmptyState
      v-else-if="ticketHistoryState?.kind === 'empty'"
      :title="ticketsEmptyState.title"
      :description="ticketsEmptyState.description"
      :icon="ticketsEmptyState.icon"
      :action-label="ticketsEmptyState.actionLabel"
      :action-to="ticketsEmptyState.actionTo"
    />

    <section v-else-if="ticketHistoryState?.kind === 'ready'" class="space-y-5">
      <SectionErrorState
        v-if="ticketHistoryState.malformedCount"
        title="Some bookings were hidden"
        :description="
          `${ticketHistoryState.malformedCount} malformed booking ${ticketHistoryState.malformedCount === 1 ? 'record was' : 'records were'} hidden because required ticket data was missing or invalid.`
        "
        :show-retry="false"
      />

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
