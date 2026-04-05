<script setup lang="ts">
import type { Movie } from '~/types'

defineProps<{
  movies: Movie[]
  selectedMovieId?: string
  deletePendingMovieId?: string | null
}>()

defineEmits<{
  edit: [movie: Movie]
  delete: [movie: Movie]
}>()
</script>

<template>
  <div class="space-y-4">
    <AdminMovieCard
      v-for="movie in movies"
      :key="movie.id"
      :movie="movie"
      :selected="selectedMovieId === movie.id"
      :delete-pending="deletePendingMovieId === movie.id"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>
