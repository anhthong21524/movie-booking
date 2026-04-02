<script setup lang="ts">
import type { Movie } from '~/types'

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <article class="card overflow-hidden">
    <div
      class="h-44 bg-gradient-to-br from-primary-500 via-primary-400 to-accent-500"
    />
    <div class="space-y-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-xl font-bold">{{ movie.title }}</h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ movie.genre }} • {{ movie.durationMinutes }} mins
          </p>
        </div>
        <span
          class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
        >
          {{ movie.rating }}
        </span>
      </div>
      <p class="line-clamp-3 text-sm text-slate-600">{{ movie.description }}</p>
      <NuxtLink :to="`/movies/${movie.id}`" class="btn-secondary w-full">
        View details
      </NuxtLink>
    </div>
  </article>
</template>
