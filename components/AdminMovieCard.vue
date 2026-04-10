<script setup lang="ts">
import type { Movie } from '~/types'
import { formatCurrency } from '~/utils/format'

const props = defineProps<{
  movie: Movie
  selected?: boolean
  deletePending?: boolean
}>()

defineEmits<{
  edit: [movie: Movie]
  delete: [movie: Movie]
}>()

const { t, locale } = useI18n()

const posterAlt = computed(() =>
  t('adminMovieCard.posterAlt').replace('{title}', props.movie.title),
)
</script>

<template>
  <article
    class="overflow-hidden rounded-[1.75rem] border bg-white transition"
    :class="
      selected
        ? 'border-primary-300 shadow-md ring-2 ring-primary-100'
        : 'border-border shadow-sm hover:border-primary-200 hover:shadow-md'
    "
  >
    <div class="grid gap-0 md:grid-cols-[7.5rem_1fr]">
      <div class="relative min-h-[12rem] bg-slate-100">
        <img
          v-if="props.movie.posterUrl"
          :src="props.movie.posterUrl"
          :alt="posterAlt"
          class="absolute inset-0 h-full w-full object-cover"
        >
        <div
          v-else
          class="flex h-full items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
        >
          {{ t('adminMovieCard.noPoster') }}
        </div>
      </div>

      <div class="p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-xl font-bold text-slate-950">{{ props.movie.title }}</h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ props.movie.genre }} | {{ props.movie.rating }} |
              {{ props.movie.durationMinutes }} {{ t('common.minutesShort') }}
            </p>
          </div>
          <span class="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-700">
            {{ formatCurrency(props.movie.basePrice, 'USD', locale) }}
          </span>
        </div>

        <p class="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
          {{ props.movie.description }}
        </p>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" class="btn-secondary" @click="$emit('edit', props.movie)">
            {{ t('adminMovieCard.edit') }}
          </button>
          <button
            type="button"
            class="btn-secondary border-rose-200 text-rose-700 hover:bg-rose-50"
            :disabled="deletePending"
            @click="$emit('delete', props.movie)"
          >
            {{ deletePending ? t('adminMovieCard.deleting') : t('adminMovieCard.delete') }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
