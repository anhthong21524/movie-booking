<script setup lang="ts">
import type { Booking, Movie, Showtime } from '~/types'
import { useBookingStore } from '~/stores/booking'
import { buildCheckoutSummaryVm, calculateBookingPricing } from '~/utils/checkout'
import { buildBookingRoute } from '~/utils/routes'
import { normalizeShowtime } from '~/utils/showtime-api'

const bookingStore = useBookingStore()
const { locale, t } = useI18n()
const route = useRoute()
const { request } = useApi()
const { getMessage } = useApiError()

const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const submitMessage = ref('Review your booking details before you confirm.')

const bookingId = computed(() =>
  typeof route.params.bookingId === 'string' ? route.params.bookingId : '',
)

const loadCheckout = async (): Promise<{
  booking: Booking | null
  showtime: Showtime | null
  movie: Movie | null
}> => {
  bookingStore.hydrateBooking()

  if (!bookingId.value) {
    return {
      booking: null,
      showtime: null,
      movie: null,
    }
  }

  const cachedBooking =
    bookingStore.booking?.id === bookingId.value ? bookingStore.booking : null
  const booking =
    cachedBooking ??
    await request<Booking>(`/api/v1/bookings/${bookingId.value}`)

  const showtime = normalizeShowtime(
    await request<Showtime>(`/api/v1/showtimes/${booking.showtimeId}`),
  )
  const movie = await request<Movie>(`/api/v1/movies/${showtime.movieId}`)

  return {
    booking,
    showtime,
    movie,
  }
}

const {
  data: checkoutData,
  error: pageError,
  status: pageStatus,
  execute,
  retry,
} = useRetryableRequest(loadCheckout)

const pageErrorMessage = computed(() =>
  pageError.value ? getMessage(pageError.value, 'page') : null,
)

const booking = computed(() => checkoutData.value?.booking ?? null)
const showtime = computed(() => checkoutData.value?.showtime ?? null)
const movie = computed(() => checkoutData.value?.movie ?? null)

const summary = computed(() => {
  if (!booking.value || !showtime.value) {
    return null
  }

  return buildCheckoutSummaryVm({
    booking: booking.value,
    showtime: showtime.value,
    movie: movie.value,
    selectedSeats: booking.value.seats,
    pricing: calculateBookingPricing(booking.value.unitPrice, booking.value.seats.length),
    locale: locale.value,
  })
})

const backToSeatsRoute = computed(() => {
  if (booking.value?.showtimeId) {
    return buildBookingRoute(booking.value.showtimeId)
  }

  return '/movies'
})

const confirmDisabled = computed(() => {
  return !summary.value || !booking.value || booking.value.status === 'CONFIRMED'
})

watch(
  booking,
  (nextBooking) => {
    if (!nextBooking) {
      submitState.value = 'error'
      submitMessage.value = 'No booking draft was found. Return to seat selection and choose your seats again.'
      return
    }

    if (nextBooking.status === 'CONFIRMED') {
      submitState.value = 'success'
      submitMessage.value = 'Booking confirmed. You can keep this page open while payment and ticket issuance are added.'
      return
    }

    if (submitState.value !== 'submitting') {
      submitState.value = 'idle'
      submitMessage.value = 'Review your booking details before you confirm.'
    }
  },
  { immediate: true },
)

const handleConfirmBooking = async () => {
  if (!booking.value || submitState.value === 'submitting' || submitState.value === 'success') {
    return
  }

  submitState.value = 'submitting'
  submitMessage.value = 'Confirming your booking and locking the selected seats.'

  try {
    const confirmedBooking = await request<Booking>(
      `/api/v1/bookings/${booking.value.id}/confirm`,
      {
        method: 'PATCH',
      },
    )

    bookingStore.setBooking(confirmedBooking)

    checkoutData.value = {
      booking: confirmedBooking,
      showtime: showtime.value,
      movie: movie.value,
    }

    submitState.value = 'success'
    submitMessage.value = 'Booking confirmed. You can keep this page open while payment and ticket issuance are added.'
  } catch {
    submitState.value = 'error'
    submitMessage.value = 'We could not confirm the booking. Please retry or return to seat selection.'
  }
}

onMounted(async () => {
  await execute()
})

watch(bookingId, async () => {
  await execute()
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('checkoutPage.heroTitle')"
      :description="t('checkoutPage.heroDescription')"
    />

    <section
      v-if="pageStatus === 'idle' || pageStatus === 'loading'"
      class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      aria-busy="true"
      aria-live="polite"
    >
      <div class="card p-6">
        <div class="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div
            v-for="item in 4"
            :key="item"
            class="h-28 animate-pulse rounded-[1.5rem] bg-slate-100"
          />
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

    <FullPageErrorState
      v-else-if="pageError && pageErrorMessage"
      :title="pageErrorMessage.title"
      :description="pageErrorMessage.description"
      :retry-label="pageErrorMessage.retryLabel"
      :retry-disabled="false"
      @retry="retry"
    />

    <section
      v-else-if="summary"
      class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <CheckoutBookingSummary :summary="summary" />

      <CheckoutConfirmationPanel
        :summary="summary"
        :submit-state="submitState"
        :submit-message="submitMessage"
        :confirm-disabled="confirmDisabled"
        :back-to-seats-to="backToSeatsRoute"
        @confirm="handleConfirmBooking"
      />
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
