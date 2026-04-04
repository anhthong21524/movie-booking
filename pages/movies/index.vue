<script setup lang="ts">
import type { Movie } from '~/types'

const { t } = useI18n()
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

const hasContent = computed(() => Boolean(movies.value?.length))

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

    <EmptyState
      v-else-if="!hasContent"
      :title="t('moviesPage.noShowtimesTitle')"
      description="Movies will appear here as soon as the catalog is available."
      action-label="Refresh movies"
      action-to="/movies"
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
