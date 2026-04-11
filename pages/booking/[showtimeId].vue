<script setup lang="ts">
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
const showtimeId = computed(() =>
  typeof route.params.showtimeId === 'string' ? route.params.showtimeId : '',
)
const {
  showtime,
  seats,
  status: seatStatus,
  error: seatError,
  execute,
} = useShowtimeSeats(showtimeId)

const isNavigatingToCheckout = ref(false)
const selectedSeatIds = ref<string[]>([])
const interactionMessage = ref(t('bookingPage.emptySelectedSeats'))

const showtimeStartsAtLabel = computed(() => {
  if (!showtime.value) {
    return ''
  }

  const parsed = new Date(showtime.value.startsAt)

  if (Number.isNaN(parsed.getTime())) {
    return t('bookingPage.scheduleUnavailable')
  }

  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
})

const normalizedSeatData = computed(() => normalizeSeatRecords(seats.value))
const normalizedSeats = computed(() => normalizedSeatData.value.seats)

const seatGridRows = computed(() =>
  buildSeatGridRows(normalizedSeats.value, selectedSeatIds.value, locale.value),
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

  const validation = validateSeatSelection(
    seats,
    selectedSeatIds.value,
    undefined,
    locale.value,
  )
  selectedSeatIds.value = validation.nextSelectedIds
})

const handleSeatToggle = (seatId: string) => {
  const result = toggleSeatSelection(
    normalizedSeats.value,
    selectedSeatIds.value,
    seatId,
    undefined,
    locale.value,
  )

  selectedSeatIds.value = result.nextSelectedIds
  interactionMessage.value = result.message
}

const handleContinueToCheckout = async () => {
  if (!showtime.value || isNavigatingToCheckout.value) {
    return
  }

  const localizedValidation = validateSeatSelection(
    normalizedSeats.value,
    selectedSeatIds.value,
    undefined,
    locale.value,
  )

  selectedSeatIds.value = localizedValidation.nextSelectedIds
  interactionMessage.value = localizedValidation.message

  if (!localizedValidation.valid) {
    return
  }

  isNavigatingToCheckout.value = true

  try {
    const draftBooking = await bookingStore.startBooking(
      showtime.value.id,
      localizedValidation.nextSelectedIds,
      {
        seats: localizedValidation.selectedSeats,
        unitPrice: showtime.value.price,
      },
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
  normalizedSeatData.value.malformedSeatCount,
)

const malformedSeatsBanner = computed(() =>
  t('bookingPage.malformedSeatsBanner').replace(
    '{count}',
    String(malformedSeatCount.value),
  ),
)

const hasAnyAvailableSeat = computed(() =>
  normalizedSeats.value.some((seat) => seat.status === 'AVAILABLE'),
)

const canContinue = computed(() =>
  Boolean(showtime.value) &&
  selectionSummary.value.canContinue &&
  hasAnyAvailableSeat.value,
)

onMounted(async () => {
  await execute()
})

watch(showtimeId, async () => {
  selectedSeatIds.value = []
  await execute()
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('bookingPage.heroTitle')"
      :description="t('bookingPage.heroDescription')"
    />

    <section
      v-if="seatStatus === 'idle' || seatStatus === 'loading'"
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
      v-else-if="!showtime && !seatError"
      :title="t('bookingPage.unavailableTitle')"
      :description="t('bookingPage.unavailableDescription')"
      :action-label="t('bookingPage.backToMovies')"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="seatError"
      :title="t('bookingPage.seatLoadErrorTitle')"
      :description="t('bookingPage.seatLoadErrorDescription')"
      :action-label="t('bookingPage.backToMovies')"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="!normalizedSeats.length && malformedSeatCount > 0"
      :title="t('bookingPage.malformedSeatLayoutTitle')"
      :description="t('bookingPage.malformedSeatLayoutDescription')"
      :action-label="t('bookingPage.backToMovies')"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="!normalizedSeats.length"
      :title="t('bookingPage.unpublishedSeatMapTitle')"
      :description="t('bookingPage.unpublishedSeatMapDescription')"
      :action-label="t('bookingPage.backToMovies')"
      action-to="/movies"
    />

    <section v-else-if="showtime" class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div class="space-y-4">
        <div
          v-if="malformedSeatCount"
          class="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"
        >
          {{ malformedSeatsBanner }}
        </div>

        <div
          v-if="!hasAnyAvailableSeat"
          class="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700"
        >
          {{ t('bookingPage.noAvailableSeatsBanner') }}
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

    <EmptyState
      v-else
      :title="t('bookingPage.unavailableTitle')"
      :description="t('bookingPage.bookingPreparationDescription')"
      :action-label="t('bookingPage.backToMovies')"
      action-to="/movies"
    />
  </div>
</template>
