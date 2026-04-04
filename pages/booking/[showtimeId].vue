<script setup lang="ts">
import { MOCK_SEATS_BY_SHOWTIME } from '~/mocks'
import { useBookingStore } from '~/stores/booking'
import {
  buildSeatGridRows,
  buildSeatSelectionSummary,
  normalizeSeatRecords,
  toggleSeatSelection,
  validateSeatSelection,
} from '~/utils/seat-selection'
import { buildCheckoutRoute } from '~/utils/routes'
import { formatCurrency } from '~/utils/format'

const route = useRoute()
const bookingStore = useBookingStore()
const { locale, t } = useI18n()
const { localizedShowtimes } = useCatalog()

const isNavigatingToCheckout = ref(false)
const interactionMessage = ref('Select an available seat to start your booking.')
const selectedSeatIds = ref<string[]>([])

const showtime = computed(() =>
  localizedShowtimes.value.find((item) => item.id === route.params.showtimeId),
)

if (!showtime.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t('bookingPage.showtimeNotFound'),
  })
}

const showtimeStartsAtLabel = computed(() => {
  if (!showtime.value) {
    return ''
  }

  const parsed = new Date(showtime.value.startsAt)

  if (Number.isNaN(parsed.getTime())) {
    return 'Schedule unavailable'
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
})

const {
  data: seatState,
  error: seatError,
  status: seatStatus,
} = await useAsyncData(
  () => `booking-seats:${showtime.value!.id}`,
  async () => {
    const records = MOCK_SEATS_BY_SHOWTIME[showtime.value!.id]

    if (!records) {
      return {
        kind: 'empty',
      } as const
    }

    const normalized = normalizeSeatRecords(records)

    if (!normalized.seats.length && normalized.malformedSeatCount > 0) {
      return {
        kind: 'malformed',
        malformedSeatCount: normalized.malformedSeatCount,
      } as const
    }

    if (!normalized.seats.length) {
      return {
        kind: 'empty',
      } as const
    }

    return {
      kind: 'ready',
      normalized,
    } as const
  },
  {
    watch: [showtime],
  },
)

const normalizedSeats = computed(() =>
  seatState.value?.kind === 'ready' ? seatState.value.normalized.seats : [],
)

const seatGridRows = computed(() =>
  buildSeatGridRows(normalizedSeats.value, selectedSeatIds.value),
)

const selectionSummary = computed(() =>
  buildSeatSelectionSummary(
    normalizedSeats.value,
    selectedSeatIds.value,
    showtime.value?.price ?? 0,
    locale.value,
  ),
)

watch(normalizedSeats, (seats) => {
  if (!seats.length) {
    selectedSeatIds.value = []
    return
  }

  const validation = validateSeatSelection(seats, selectedSeatIds.value)
  selectedSeatIds.value = validation.nextSelectedIds
})

const handleSeatToggle = (seatId: string) => {
  const result = toggleSeatSelection(
    normalizedSeats.value,
    selectedSeatIds.value,
    seatId,
  )

  selectedSeatIds.value = result.nextSelectedIds
  interactionMessage.value = result.message
}

const handleContinueToCheckout = async () => {
  if (!showtime.value || isNavigatingToCheckout.value) {
    return
  }

  const validation = validateSeatSelection(normalizedSeats.value, selectedSeatIds.value)

  selectedSeatIds.value = validation.nextSelectedIds
  interactionMessage.value = validation.message

  if (!validation.valid) {
    return
  }

  isNavigatingToCheckout.value = true

  try {
    const draftBooking = bookingStore.startBooking(
      showtime.value.id,
      validation.selectedSeats,
      showtime.value.price,
    )

    await navigateTo(buildCheckoutRoute(draftBooking.id))
  } finally {
    isNavigatingToCheckout.value = false
  }
}

const unitPriceLabel = computed(() =>
  formatCurrency(showtime.value?.price ?? 0, 'USD', locale.value),
)

const malformedSeatCount = computed(() =>
  seatState.value?.kind === 'ready' ? seatState.value.normalized.malformedSeatCount : 0,
)

const hasAnyAvailableSeat = computed(() =>
  normalizedSeats.value.some((seat) => seat.status === 'AVAILABLE'),
)

const canContinue = computed(() =>
  seatState.value?.kind === 'ready' &&
  selectionSummary.value.canContinue &&
  hasAnyAvailableSeat.value,
)
</script>

<template>
  <div v-if="showtime" class="space-y-8">
    <PageHero
      :title="t('bookingPage.heroTitle')"
      :description="t('bookingPage.heroDescription')"
    />

    <section
      v-if="seatStatus === 'pending'"
      class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]"
      aria-busy="true"
      aria-live="polite"
    >
      <div class="card p-6">
        <div class="mb-6 h-12 animate-pulse rounded-2xl bg-slate-200" />
        <div class="space-y-3">
          <div
            v-for="row in 6"
            :key="row"
            class="grid grid-cols-[3rem_1fr] items-center gap-3"
          >
            <div class="h-11 animate-pulse rounded-full bg-slate-200" />
            <div class="grid grid-cols-10 gap-2">
              <div
                v-for="seat in 10"
                :key="`${row}-${seat}`"
                class="h-11 animate-pulse rounded-xl bg-slate-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
        <div class="mt-5 space-y-3">
          <div
            v-for="item in 6"
            :key="item"
            class="h-5 animate-pulse rounded-full bg-slate-100"
          />
        </div>
      </div>
    </section>

    <EmptyState
      v-else-if="seatError"
      title="We could not load the seat map"
      description="Refresh the page to retry. If the issue persists, return to the movie detail page and choose the session again."
      action-label="Back to movies"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="seatState?.kind === 'malformed'"
      title="Seat layout is temporarily unavailable"
      description="The seat map data for this session is malformed, so booking cannot continue until it is corrected."
      action-label="Back to movies"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="seatState?.kind === 'empty'"
      title="Seat map not published"
      description="This session does not have a seat layout yet. Choose another showtime or come back later."
      action-label="Back to movies"
      action-to="/movies"
    />

    <section v-else class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div class="space-y-4">
        <div
          v-if="malformedSeatCount"
          class="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"
        >
          {{
            `${malformedSeatCount} malformed seat ${malformedSeatCount === 1 ? 'record was' : 'records were'} hidden before rendering.`
          }}
        </div>

        <div
          v-if="!hasAnyAvailableSeat"
          class="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700"
        >
          All seats for this session are currently unavailable. You can review the layout, but checkout is disabled.
        </div>

        <SeatGrid
          :rows="seatGridRows"
          :interaction-message="interactionMessage"
          @toggle="handleSeatToggle"
        />
      </div>

      <SeatSelectionSummary
        :room-name="showtime.roomName"
        :starts-at-label="showtimeStartsAtLabel"
        :unit-price-label="unitPriceLabel"
        :summary="selectionSummary"
        :action-label="t('bookingPage.continueToCheckout')"
        :action-disabled="!canContinue"
        :action-pending="isNavigatingToCheckout"
        @continue="handleContinueToCheckout"
      />
    </section>
  </div>
</template>
