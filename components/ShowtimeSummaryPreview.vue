<script setup lang="ts">
import type { ShowtimeDraftPreview } from '~/types/admin-showtime'

defineProps<{
  preview: ShowtimeDraftPreview | null
}>()

const { t } = useI18n()
</script>

<template>
  <section class="rounded-[2rem] border border-border bg-slate-50/80 p-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600">
          {{ t('showtimePreview.eyebrow') }}
        </p>
        <h3 class="mt-2 text-lg font-semibold text-slate-950">
          {{ preview ? preview.movieTitle : t('showtimePreview.emptyTitle') }}
        </h3>
      </div>
    </div>

    <div
      v-if="preview"
      class="mt-4 grid gap-3 sm:grid-cols-2"
    >
      <div class="rounded-[1.35rem] border border-border bg-white px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ t('showtimePreview.starts') }}
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-900">{{ preview.startsAtLabel }}</p>
      </div>
      <div class="rounded-[1.35rem] border border-border bg-white px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ t('showtimePreview.ends') }}
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-900">{{ preview.endsAtLabel }}</p>
      </div>
      <div class="rounded-[1.35rem] border border-border bg-white px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ t('showtimePreview.cinemaRoom') }}
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-900">
          {{ preview.cinemaName }} / {{ preview.roomName }}
        </p>
      </div>
      <div class="rounded-[1.35rem] border border-border bg-white px-4 py-3">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ t('showtimePreview.runtimeCapacity') }}
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-900">
          {{ preview.durationLabel }} / {{ preview.capacityLabel }}
        </p>
      </div>
      <div class="rounded-[1.35rem] border border-border bg-white px-4 py-3 sm:col-span-2">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ t('showtimePreview.ticketPrice') }}
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-900">{{ preview.priceLabel }}</p>
      </div>
    </div>

    <p v-else class="mt-4 text-sm leading-6 text-slate-600">
      {{ t('showtimePreview.emptyDescription') }}
    </p>
  </section>
</template>
