<script setup lang="ts">
const { t } = useI18n()
const { localizedMovies } = useCatalog()

const featuredMovies = computed(() => localizedMovies.value.slice(0, 3))
</script>

<template>
  <div class="space-y-10">
    <PageHero
      :title="t('home.heroTitle')"
      :description="t('home.heroDescription')"
    />

    <section class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold">{{ t('home.featuredTitle') }}</h2>
          <p class="mt-1 text-slate-600">
            {{ t('home.featuredDescription') }}
          </p>
        </div>
        <NuxtLink to="/movies" class="btn-secondary">
          {{ t('home.browseAll') }}
        </NuxtLink>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <MovieCard
          v-for="movie in featuredMovies"
          :key="movie.id"
          :movie="movie"
        />
      </div>
    </section>
  </div>
</template>
