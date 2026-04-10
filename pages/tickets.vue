<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'
import type { TicketHistoryState } from '~/types/tickets'
import type { Movie, Showtime } from '~/types'
import { getTicketsEmptyState } from '~/utils/empty-state'
import { normalizeShowtime } from '~/utils/showtime-api'
import { buildTicketHistoryState } from '~/utils/tickets'

const { locale, t } = useI18n()
const bookingStore = useBookingStore()
const { getMessage } = useApiError()
const { request } = useApi()

const loadTicketHistory = async (): Promise<TicketHistoryState> => {
  await bookingStore.fetchBookingHistory()

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
      request<Showtime>(`/api/v1/showtimes/${showtimeId}`).then(normalizeShowtime),
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

const confirmedCount = computed(() => {
  if (ticketHistoryState.value?.kind !== 'ready') return 0
  return ticketHistoryState.value.items.filter((b) => b.status.code === 'upcoming').length
})

const cancelledCount = computed(() => {
  if (ticketHistoryState.value?.kind !== 'ready') return 0
  return ticketHistoryState.value.items.filter((b) => b.status.code === 'cancelled').length
})

const totalCount = computed(() => {
  if (ticketHistoryState.value?.kind !== 'ready') return 0
  return ticketHistoryState.value.items.length
})

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

    <!-- Loading skeletons -->
    <section
      v-if="pageStatus === 'loading' || pageStatus === 'idle'"
      class="space-y-5"
      aria-busy="true"
      aria-live="polite"
    >
      <!-- Stats skeleton -->
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="item in 3"
          :key="item"
          class="card h-20 animate-pulse bg-slate-100 p-5"
        />
      </div>

      <!-- Card skeletons -->
      <div
        v-for="item in 2"
        :key="item"
        class="card overflow-hidden"
      >
        <div class="h-1 w-full animate-pulse bg-slate-200" />
        <div class="p-6 sm:p-7">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-2">
              <div class="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
              <div class="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
              <div class="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div class="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div class="my-6 border-t-2 border-dashed border-slate-200" />
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_9rem]">
            <div class="grid gap-4 sm:grid-cols-2">
              <div
                v-for="block in 3"
                :key="block"
                class="h-24 animate-pulse rounded-2xl bg-slate-100"
                :class="{ 'sm:col-span-2': block === 3 }"
              />
            </div>
            <div class="h-48 animate-pulse rounded-2xl bg-slate-100 xl:h-auto" />
          </div>
        </div>
      </div>
    </section>

    <!-- Error -->
    <FullPageErrorState
      v-else-if="pageError && pageErrorMessage"
      :title="pageErrorMessage.title"
      :description="pageErrorMessage.description"
      :retry-label="pageErrorMessage.retryLabel"
      :retry-disabled="!canRetry"
      :retry-pending="false"
      @retry="retry"
    />

    <!-- All malformed -->
    <PageEmptyState
      v-else-if="ticketHistoryState?.kind === 'malformed'"
      title="Booking history is temporarily unavailable"
      description="All saved bookings were malformed or linked to invalid showtimes, so tickets could not be rendered safely."
      action-label="Browse movies"
      action-to="/movies"
    />

    <!-- Empty -->
    <PageEmptyState
      v-else-if="ticketHistoryState?.kind === 'empty'"
      :title="ticketsEmptyState.title"
      :description="ticketsEmptyState.description"
      :icon="ticketsEmptyState.icon"
      :action-label="ticketsEmptyState.actionLabel"
      :action-to="ticketsEmptyState.actionTo"
    />

    <!-- Ready -->
    <template v-else-if="ticketHistoryState?.kind === 'ready'">
      <!-- Stats row -->
      <div class="grid grid-cols-3 gap-4">
        <div class="card flex items-center gap-4 p-5">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12.5C2 7.81 5.81 4 10.5 4a8.5 8.5 0 016.147 2.627M22 11.5C22 16.19 18.19 20 13.5 20a8.5 8.5 0 01-6.147-2.627"/>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0"/>
            </svg>
          </span>
          <div>
            <p class="text-2xl font-bold text-slate-950">{{ totalCount }}</p>
            <p class="text-xs font-medium text-slate-500">Total bookings</p>
          </div>
        </div>

        <div class="card flex items-center gap-4 p-5">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </span>
          <div>
            <p class="text-2xl font-bold text-slate-950">{{ confirmedCount }}</p>
            <p class="text-xs font-medium text-slate-500">Confirmed</p>
          </div>
        </div>

        <div class="card flex items-center gap-4 p-5">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </span>
          <div>
            <p class="text-2xl font-bold text-slate-950">{{ cancelledCount }}</p>
            <p class="text-xs font-medium text-slate-500">Cancelled</p>
          </div>
        </div>
      </div>

      <!-- Malformed warning -->
      <SectionErrorState
        v-if="ticketHistoryState.malformedCount"
        title="Some bookings were hidden"
        :description="`${ticketHistoryState.malformedCount} malformed booking ${ticketHistoryState.malformedCount === 1 ? 'record was' : 'records were'} hidden because required ticket data was missing or invalid.`"
        :show-retry="false"
      />

      <!-- List header -->
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-slate-950">
          Your bookings
        </h2>
        <p class="text-sm text-slate-500">
          {{ totalCount }} {{ totalCount === 1 ? 'booking' : 'bookings' }}
        </p>
      </div>

      <!-- Ticket cards -->
      <div class="space-y-5">
        <TicketBookingCard
          v-for="booking in ticketHistoryState.items"
          :key="booking.id"
          :booking="booking"
        />
      </div>
    </template>
  </div>
</template>
