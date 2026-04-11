<script setup lang="ts">
import type { Movie } from '~/types'
import { buildMovieDetailRoute } from '~/utils/routes'

const props = defineProps<{
  movie: Movie
}>()

const { t } = useI18n()

const posterAlt = computed(() =>
  t('adminMovieCard.posterAlt').replace('{title}', props.movie.title),
)
</script>

<template>
  <article class="card overflow-hidden">
    <div class="relative h-44 overflow-hidden bg-slate-100">
      <img
        v-if="movie.posterUrl"
        :src="movie.posterUrl"
        :alt="posterAlt"
        class="h-full w-full object-cover"
      >
      <div
        v-else
        class="h-full bg-gradient-to-br from-primary-500 via-primary-400 to-accent-500"
      />
    </div>
    <div class="space-y-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-xl font-bold">{{ movie.title }}</h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ movie.genre }} &middot; {{ movie.durationMinutes }}
            {{ t('common.minutesShort') }}
          </p>
        </div>
        <span
          class="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700"
        >
          {{ movie.rating }}
        </span>
      </div>
      <p class="line-clamp-3 text-sm text-slate-600">{{ movie.description }}</p>
      <NuxtLink :to="buildMovieDetailRoute(movie.id)" class="btn-secondary w-full">
        {{ t('common.viewDetails') }}
      </NuxtLink>
    </div>
  </article>
</template>
