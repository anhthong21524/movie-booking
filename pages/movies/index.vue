<script setup lang="ts">
import { MOCK_MOVIES } from '~/constants/mock-data'

useSeoMeta({
  title: 'Movies',
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      title="Now showing"
      description="A route-ready listing page with typed cards, consistent spacing, and clean placeholders for real API data."
    />

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <MovieCard v-for="movie in MOCK_MOVIES" :key="movie.id" :movie="movie" />
    </section>
  </div>
</template>
