<script setup lang="ts">
import { MOCK_SEATS_BY_SHOWTIME } from '~/mocks'
import { useBookingStore } from '~/stores/booking'
import { buildCheckoutSummaryVm, validateCheckoutBooking } from '~/utils/checkout'
import { buildBookingRoute } from '~/utils/routes'

const bookingStore = useBookingStore()
const { locale, t } = useI18n()
const route = useRoute()
const { localizedMovies, localizedShowtimes } = useCatalog()

const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const submitMessage = ref('Review your booking details before you confirm.')
const isCheckoutReady = ref(Boolean(bookingStore.booking))

const bookingId = computed(() =>
  typeof route.params.bookingId === 'string' ? route.params.bookingId : '',
)

const bookingDraft = computed(() => bookingStore.booking)

const showtime = computed(() => {
  if (!bookingDraft.value) {
    return null
  }

  return (
    localizedShowtimes.value.find((item) => item.id === bookingDraft.value?.showtimeId) ??
    null
  )
})

const movie = computed(() => {
  if (!showtime.value) {
    return null
  }

  return localizedMovies.value.find((item) => item.id === showtime.value?.movieId) ?? null
})

const validation = computed(() =>
  validateCheckoutBooking({
    bookingId: bookingId.value,
    booking: bookingDraft.value,
    showtime: showtime.value,
    seatRecords: bookingDraft.value
      ? MOCK_SEATS_BY_SHOWTIME[bookingDraft.value.showtimeId]
      : undefined,
  }),
)

const summary = computed(() => {
  if (!validation.value.valid || !validation.value.booking || !validation.value.pricing || !showtime.value) {
    return null
  }

  return buildCheckoutSummaryVm({
    booking: validation.value.booking,
    showtime: showtime.value,
    movie: movie.value,
    selectedSeats: validation.value.selectedSeats,
    pricing: validation.value.pricing,
    locale: locale.value,
  })
})

const backToSeatsRoute = computed(() => {
  if (bookingDraft.value?.showtimeId) {
    return buildBookingRoute(bookingDraft.value.showtimeId)
  }

  return '/movies'
})

const confirmDisabled = computed(() => {
  return !summary.value || !validation.value.valid || bookingDraft.value?.status === 'CONFIRMED'
})

onMounted(() => {
  bookingStore.hydrateBooking()
  isCheckoutReady.value = true
})

watch(
  [validation, bookingDraft],
  ([nextValidation, nextBooking]) => {
    if (submitState.value === 'submitting' || submitState.value === 'success') {
      return
    }

    if (nextBooking?.status === 'CONFIRMED' && nextValidation.valid) {
      submitState.value = 'success'
      submitMessage.value = 'Booking confirmed. Your summary is locked to the validated draft.'
      return
    }

    if (!nextValidation.valid) {
      submitState.value = 'error'
      submitMessage.value = nextValidation.message
      return
    }

    submitState.value = 'idle'
    submitMessage.value = 'Review your booking details before you confirm.'
  },
  { immediate: true },
)

const handleConfirmBooking = async () => {
  if (submitState.value === 'submitting' || submitState.value === 'success') {
    return
  }

  const nextValidation = validation.value

  if (!nextValidation.valid || !nextValidation.pricing) {
    submitState.value = 'error'
    submitMessage.value = nextValidation.message
    return
  }

  submitState.value = 'submitting'
  submitMessage.value = 'Revalidating your selected seats and confirming the booking.'

  try {
    const confirmedBooking = bookingStore.confirmBooking({
      seats: nextValidation.selectedSeats,
      seatIds: nextValidation.normalizedSeatIds,
      totalAmount: nextValidation.pricing.total,
      unitPrice: nextValidation.pricing.unitPrice,
    })

    if (!confirmedBooking) {
      throw new Error('Booking draft was not found.')
    }

    submitState.value = 'success'
    submitMessage.value = 'Booking confirmed. You can keep this page open while payment and ticket issuance are added.'
  } catch {
    submitState.value = 'error'
    submitMessage.value = 'We could not confirm the booking. Please retry or return to seat selection.'
  }
}
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('checkoutPage.heroTitle')"
      :description="t('checkoutPage.heroDescription')"
    />

    <section
      v-if="!isCheckoutReady"
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
      v-else-if="validation.code === 'missing-booking'"
      :title="t('checkoutPage.noBookingTitle')"
      :description="t('checkoutPage.noBookingDescription')"
      :action-label="t('checkoutPage.goToMovies')"
      action-to="/movies"
    />

    <section
      v-else
      class="card p-8"
    >
      <div class="mx-auto max-w-2xl text-center">
        <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600"
        >
          !
        </div>
        <h2 class="mt-6 text-2xl font-bold text-slate-950">
          Checkout validation failed
        </h2>
        <p class="mt-3 text-slate-600">
          {{ validation.message }}
        </p>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <NuxtLink :to="backToSeatsRoute" class="btn-primary">
            Back to seats
          </NuxtLink>
          <NuxtLink to="/movies" class="btn-secondary">
            Browse movies
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
