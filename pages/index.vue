<script setup lang="ts">
import { MOCK_MOVIES } from '~/mocks'

const featuredMovies = MOCK_MOVIES.slice(0, 3)
</script>

<template>
  <div class="space-y-10">
    <PageHero
      title="Book movies with a clean Nuxt foundation"
      description="This starter includes routing, shared state, API utilities, and a lightweight design system so feature work can begin immediately."
    />

    <section class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold">Featured movies</h2>
          <p class="mt-1 text-slate-600">
            Starter content wired to typed mock data.
          </p>
        </div>
        <NuxtLink to="/movies" class="btn-secondary"
          >Browse all movies</NuxtLink
        >
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
