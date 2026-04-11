<script setup lang="ts">
import { buildMovieDetailPageVm } from '~/utils/movie-detail'
import { getShowtimesEmptyState } from '~/utils/empty-state'

const route = useRoute()
const { locale, t } = useI18n()
const movieId = computed(() => {
  return typeof route.params.id === 'string' ? route.params.id : ''
})
const {
  movie,
  showtimes,
  status: pageStatus,
  error: pageError,
  execute,
  retry,
} = useMovieDetail(movieId)

useSeoMeta({
  title: () => {
    return movie.value ? `${movie.value.title} | ${t('moviesPage.seoTitle')}` : t('moviesPage.seoTitle')
  },
})

const pageState = computed(() => {
  if (!movie.value) {
    return null
  }

  if (!movie.value.id || !movie.value.title?.trim()) {
    return { kind: 'malformed-movie' } as const
  }

  return {
    kind: 'ready',
    vm: buildMovieDetailPageVm(movie.value, showtimes.value, locale.value),
  } as const
})

const showtimesEmptyState = computed(() => getShowtimesEmptyState(locale.value))
const malformedShowtimeMessage = computed(() => {
  if (pageState.value?.kind !== 'ready' || !pageState.value.vm.malformedShowtimeCount) {
    return ''
  }

  return t('movieDetailPage.malformedShowtimes')
    .replace('{count}', String(pageState.value.vm.malformedShowtimeCount))
    .replace('{suffix}', pageState.value.vm.malformedShowtimeCount === 1 ? '' : 's')
})

onMounted(async () => {
  await execute()
})

watch(movieId, async () => {
  await execute()
})
</script>

<template>
  <div class="space-y-8">
    <section
      v-if="pageStatus === 'idle' || pageStatus === 'loading'"
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

    <FullPageErrorState
      v-else-if="pageError"
      :title="t('movieDetailPage.loadErrorTitle')"
      :description="t('movieDetailPage.loadErrorDescription')"
      :retry-label="t('common.retry')"
      :retry-disabled="false"
      @retry="retry"
    />

    <EmptyState
      v-else-if="pageStatus === 'success' && !movie"
      :title="t('moviesPage.movieNotFound')"
      :description="t('movieDetailPage.notFoundDescription')"
      :action-label="t('movieDetailPage.backToMovies')"
      action-to="/movies"
    />

    <EmptyState
      v-else-if="pageState?.kind === 'malformed-movie'"
      :title="t('movieDetailPage.malformedTitle')"
      :description="t('movieDetailPage.malformedDescription')"
      :action-label="t('movieDetailPage.backToMovies')"
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
              <p class="text-sm font-semibold text-primary-700">
                {{ t('movieDetailPage.bookingEntryTitle') }}
              </p>
              <p class="mt-1 text-sm text-slate-600">
                {{ t('movieDetailPage.bookingEntryDescription') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <div>
            <h2 class="text-2xl font-bold text-slate-950">
              {{ t('moviesPage.showtimesTitle') }}
            </h2>
            <p class="mt-1 whitespace-nowrap text-slate-600">
              {{ t('movieDetailPage.showtimesIntro') }}
            </p>
          </div>
        </div>

        <div
          v-if="pageState.vm.malformedShowtimeCount"
          class="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"
        >
          {{ malformedShowtimeMessage }}
        </div>

        <SectionEmptyState
          v-if="!pageState.vm.showtimeGroups.length"
          :title="showtimesEmptyState.title"
          :description="showtimesEmptyState.description"
          :icon="showtimesEmptyState.icon"
          :action-label="showtimesEmptyState.actionLabel"
          :action-to="showtimesEmptyState.actionTo"
        />

        <template v-else>
          <div
            v-if="!pageState.vm.hasAvailableShowtimes"
            class="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700"
          >
            {{ t('movieDetailPage.unavailableBanner') }}
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
