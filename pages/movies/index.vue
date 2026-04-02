<script setup lang="ts">
const { t } = useI18n()
const { localizedMovies } = useCatalog()

useSeoMeta({
  title: t('moviesPage.seoTitle'),
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('moviesPage.heroTitle')"
      :description="t('moviesPage.heroDescription')"
    />

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <MovieCard
        v-for="movie in localizedMovies"
        :key="movie.id"
        :movie="movie"
      />
    </section>
  </div>
</template>
