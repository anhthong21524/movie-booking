<script setup lang="ts">
import { buildMovieDetailPageVm } from '~/utils/movie-detail'
import { buildBookingRoute } from '~/utils/routes'

const route = useRoute()
const { locale, t } = useI18n()
const { localizedMovies, localizedShowtimes } = useCatalog()

useSeoMeta({
  title: () => {
    const movie = localizedMovies.value.find((item) => item.id === route.params.id)
    return movie ? `${movie.title} | ${t('moviesPage.seoTitle')}` : t('moviesPage.seoTitle')
  },
})

const movieId = computed(() => {
  return typeof route.params.id === 'string' ? route.params.id : ''
})

const movie = computed(() =>
  localizedMovies.value.find((item) => item.id === movieId.value) ?? null,
)

const movieShowtimes = computed(() =>
  localizedShowtimes.value.filter((showtime) => showtime.movieId === movieId.value),
)

const {
  data: pageState,
  error: pageError,
  status: pageStatus,
} = await useAsyncData(
  () => `movie-detail:${movieId.value}:${locale.value}`,
  async () => {
    if (!movie.value) {
      throw createError({
        statusCode: 404,
        statusMessage: t('moviesPage.movieNotFound'),
      })
    }

    if (!movie.value.id || !movie.value.title?.trim()) {
      return { kind: 'malformed-movie' } as const
    }

    return {
      kind: 'ready',
      vm: buildMovieDetailPageVm(movie.value, movieShowtimes.value, locale.value),
    } as const
  },
  {
    watch: [movieId, locale],
  },
)

if (pageError.value) {
  throw pageError.value
}

const bookingRouteExample = computed(() => {
  if (pageState.value?.kind !== 'ready') {
    return ''
  }

  const firstAvailable = pageState.value.vm.showtimeGroups
    .flatMap((group) => group.showtimes)
    .find((showtime) => !showtime.action.disabled)

  return firstAvailable ? buildBookingRoute(firstAvailable.id) : ''
})
</script>

<template>
  <div class="space-y-8">
    <section
      v-if="pageStatus === 'pending'"
      class="card overflow-hidden p-8"
      aria-busy="true"
      aria-live="polite"
    >
      <div class="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div class="min-h-[320px] animate-pulse rounded-[2rem] bg-slate-200" />
        <div class="space-y-4">
          <div class="h-8 w-40 animate-pulse rounded-full bg-slate-200" />
          <div class="h-14 w-4/5 animate-pulse rounded-[1.5rem] bg-slate-200" />
          <div class="h-24 animate-pulse rounded-[1.5rem] bg-slate-200" />
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div
              v-for="item in 5"
              :key="item"
              class="h-28 animate-pulse rounded-[1.5rem] bg-slate-100"
            />
          </div>
        </div>
      </div>
    </section>

    <EmptyState
      v-else-if="pageError"
      title="We could not load this movie"
      description="Try refreshing the page. If the issue persists, return to the movie list and retry."
      action-label="Back to movies"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="pageState?.kind === 'malformed-movie'"
      title="Movie details are temporarily unavailable"
      description="Some required movie fields are missing. Refresh the page or return to the movie list."
      action-label="Back to movies"
      action-to="/movies"
    />

    <template v-else-if="pageState?.kind === 'ready'">
      <section class="card overflow-hidden">
        <div class="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
          <div class="relative min-h-[320px] overflow-hidden bg-slate-950">
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_42%),linear-gradient(160deg,_rgba(15,23,42,1),_rgba(30,41,59,0.92)_48%,_rgba(14,116,144,0.76))]"
            />
            <div class="relative flex h-full flex-col justify-end p-8 text-white">
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
                {{ pageState.vm.movie.genre }}
              </p>
              <h1 class="mt-4 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
                {{ pageState.vm.movie.title }}
              </h1>
              <p class="mt-4 max-w-xl text-sm leading-7 text-white/82 sm:text-base">
                {{ pageState.vm.movie.description }}
              </p>
            </div>
          </div>

          <div class="bg-white p-8">
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="item in pageState.vm.movie.metadata"
                :key="item.id"
                class="rounded-[1.5rem] border border-border bg-slate-50 p-4"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {{ item.label }}
                </p>
                <p class="mt-3 text-lg font-semibold text-slate-950">
                  {{ item.value }}
                </p>
              </article>
            </div>

            <div class="mt-6 rounded-[1.5rem] border border-primary-100 bg-primary-50/60 p-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-semibold text-primary-700">
                    Booking entry point
                  </p>
                  <p class="mt-1 text-sm text-slate-600">
                    Choose a valid showtime below to continue to seat selection.
                  </p>
                </div>
                <code
                  v-if="bookingRouteExample"
                  class="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  {{ bookingRouteExample }}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-950">
              {{ t('moviesPage.showtimesTitle') }}
            </h2>
            <p class="mt-1 max-w-2xl text-slate-600">
              Browse upcoming sessions grouped by date. Disabled times are unavailable or invalid and cannot be selected.
            </p>
          </div>
          <p class="text-sm text-slate-500">
            {{ pageState.vm.showtimeGroups.length }}
            {{ pageState.vm.showtimeGroups.length === 1 ? 'date group' : 'date groups' }}
          </p>
        </div>

        <div
          v-if="pageState.vm.malformedShowtimeCount"
          class="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"
        >
          {{
            `${pageState.vm.malformedShowtimeCount} malformed showtime${pageState.vm.malformedShowtimeCount === 1 ? '' : 's'} were hidden because their schedule data was invalid.`
          }}
        </div>

        <EmptyState
          v-if="!pageState.vm.showtimeGroups.length"
          :title="t('moviesPage.noShowtimesTitle')"
          :description="t('moviesPage.noShowtimesDescription')"
        />

        <template v-else>
          <div
            v-if="!pageState.vm.hasAvailableShowtimes"
            class="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700"
          >
            All listed showtimes are currently unavailable. Check another date or come back later for new sessions.
          </div>

          <div class="space-y-5">
            <ShowtimeGroupSection
              v-for="group in pageState.vm.showtimeGroups"
              :key="group.dateKey"
              :group="group"
            />
          </div>
        </template>
      </section>
    </template>
  </div>
</template>
