<script setup lang="ts">
import { formatCurrency, formatDateTime } from '~/utils/format'

const route = useRoute()
const { locale, t } = useAppLocale()
const { localizedMovies, localizedShowtimes } = useCatalog()

const movie = computed(() =>
  localizedMovies.value.find((item) => item.id === route.params.id),
)
const showtimes = computed(() =>
  localizedShowtimes.value.filter(
    (showtime) => showtime.movieId === route.params.id,
  ),
)

if (!movie.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t('moviesPage.movieNotFound'),
  })
}
</script>

<template>
  <div v-if="movie" class="space-y-8">
    <section class="card overflow-hidden">
      <div class="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div
          class="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 p-8 text-white"
        >
          <p
            class="text-sm font-semibold uppercase tracking-[0.2em] text-white/80"
          >
            {{ movie.genre }}
          </p>
          <h1 class="mt-4 text-4xl font-bold">{{ movie.title }}</h1>
          <p class="mt-4 max-w-2xl text-white/85">{{ movie.description }}</p>
        </div>
        <div class="space-y-4 p-8">
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">{{ t('moviesPage.duration') }}</p>
            <p class="mt-1 text-lg font-semibold">
              {{ movie.durationMinutes }} {{ t('common.minutesLong') }}
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">
              {{ t('moviesPage.ticketPrice') }}
            </p>
            <p class="mt-1 text-lg font-semibold">
              {{ formatCurrency(movie.basePrice, 'USD', locale) }}
            </p>
          </div>
          <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">{{ t('moviesPage.rating') }}</p>
            <p class="mt-1 text-lg font-semibold">{{ movie.rating }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <h2 class="text-2xl font-bold">{{ t('moviesPage.showtimesTitle') }}</h2>
        <p class="mt-1 text-slate-600">
          {{ t('moviesPage.showtimesDescription') }}
        </p>
      </div>

      <div
        v-if="showtimes.length"
        class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <article
          v-for="showtime in showtimes"
          :key="showtime.id"
          class="card p-5"
        >
          <p class="text-sm text-slate-500">{{ showtime.roomName }}</p>
          <h3 class="mt-2 text-lg font-semibold">
            {{ formatDateTime(showtime.startsAt, locale) }}
          </h3>
          <p class="mt-2 text-sm text-slate-600">
            {{ t('moviesPage.startsFrom') }}
            {{ formatCurrency(showtime.price, 'USD', locale) }}
          </p>
          <NuxtLink
            :to="`/booking/${showtime.id}`"
            class="btn-primary mt-5 w-full"
          >
            {{ t('moviesPage.selectSeats') }}
          </NuxtLink>
        </article>
      </div>

      <EmptyState
        v-else
        :title="t('moviesPage.noShowtimesTitle')"
        :description="t('moviesPage.noShowtimesDescription')"
      />
    </section>
  </div>
</template>
