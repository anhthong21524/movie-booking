<script setup lang="ts">
import type { Movie } from '~/types'
import { getMoviesEmptyState } from '~/utils/empty-state'

const { locale, t } = useI18n()
const { localizedMovies } = useCatalog()
const { getMessage } = useApiError()

useSeoMeta({
  title: t('moviesPage.seoTitle'),
})

const loadMovies = async (): Promise<Movie[]> => {
  return localizedMovies.value
}

const {
  data: movies,
  error: pageError,
  status: pageStatus,
  canRetry,
  execute,
  retry,
} = useRetryableRequest(loadMovies)

const pageErrorMessage = computed(() =>
  pageError.value ? getMessage(pageError.value, 'page') : null,
)

const moviesEmptyState = computed(() => getMoviesEmptyState(locale.value))
const hasContent = computed(() => Array.isArray(movies.value) && movies.value.length > 0)

onMounted(async () => {
  await execute()
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('moviesPage.heroTitle')"
      :description="t('moviesPage.heroDescription')"
    />

    <MovieListSkeleton v-if="pageStatus === 'idle' || pageStatus === 'loading'" />

    <FullPageErrorState
      v-else-if="pageError && pageErrorMessage"
      :title="pageErrorMessage.title"
      :description="pageErrorMessage.description"
      :retry-label="pageErrorMessage.retryLabel"
      :retry-disabled="!canRetry"
      @retry="retry"
    />

    <PageEmptyState
      v-else-if="!hasContent"
      :title="moviesEmptyState.title"
      :description="moviesEmptyState.description"
      :icon="moviesEmptyState.icon"
      :action-label="moviesEmptyState.actionLabel"
      :action-to="moviesEmptyState.actionTo"
    />

    <section v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
      />
    </section>
  </div>
</template>
