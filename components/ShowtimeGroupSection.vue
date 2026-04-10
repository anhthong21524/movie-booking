<script setup lang="ts">
import { buildBookingRoute } from '~/utils/routes'
import type { ShowtimeDateGroupVm } from '~/types/movie-detail'

const props = defineProps<{
  group: ShowtimeDateGroupVm
}>()

const { t } = useI18n()
const isNavigatingTo = ref<string | null>(null)

const showtimeCountLabel = computed(() =>
  props.group.showtimes.length === 1
    ? t('movieDetailPage.showtimeSingular')
    : t('movieDetailPage.showtimePlural'),
)

const handleSelectShowtime = async (showtimeId: string, disabled: boolean) => {
  if (disabled || isNavigatingTo.value) {
    return
  }

  isNavigatingTo.value = showtimeId

  try {
    await navigateTo(buildBookingRoute(showtimeId))
  } finally {
    isNavigatingTo.value = null
  }
}
</script>

<template>
  <section class="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
    <div class="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 class="text-xl font-bold text-slate-950">{{ props.group.heading }}</h3>
        <p class="text-sm text-slate-500">{{ props.group.subheading }}</p>
      </div>
      <p class="text-sm text-slate-500">
        {{ props.group.showtimes.length }}
        {{ showtimeCountLabel }}
      </p>
    </div>

    <div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="showtime in props.group.showtimes"
        :key="showtime.id"
        class="flex h-full flex-col rounded-[1.5rem] border p-4 transition"
        :class="
          showtime.action.disabled
            ? 'border-slate-200 bg-slate-50 text-slate-500'
            : 'border-primary-100 bg-primary-50/45 text-slate-900 hover:border-primary-300 hover:shadow-sm'
        "
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-slate-500">{{ showtime.roomName }}</p>
            <p class="mt-2 text-2xl font-bold">{{ showtime.timeLabel }}</p>
          </div>
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="
              showtime.action.disabled
                ? 'bg-slate-200 text-slate-600'
                : 'bg-emerald-100 text-emerald-700'
            "
          >
            {{ showtime.availabilityLabel }}
          </span>
        </div>

        <div class="mt-5 space-y-2 text-sm">
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">{{ t('movieDetailPage.starts') }}</span>
            <time :datetime="showtime.isoLabel" class="font-medium text-slate-700">
              {{ showtime.dayLabel }}
            </time>
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-slate-500">{{ t('movieDetailPage.price') }}</span>
            <span class="font-semibold text-slate-950">{{ showtime.priceLabel }}</span>
          </div>
        </div>

        <p class="mt-4 text-sm text-slate-500">
          {{
            showtime.action.disabledReason
              ? `${showtime.action.helperText} ${showtime.action.disabledReason}.`
              : showtime.action.helperText
          }}
        </p>

        <button
          class="btn-primary mt-5 w-full"
          :class="showtime.action.disabled ? 'cursor-not-allowed opacity-60' : ''"
          :disabled="showtime.action.disabled || isNavigatingTo === showtime.id"
          :aria-disabled="showtime.action.disabled"
          @click="handleSelectShowtime(showtime.id, showtime.action.disabled)"
        >
          {{
            isNavigatingTo === showtime.id
              ? t('movieDetailPage.openingBooking')
              : showtime.action.disabledReason || showtime.action.label
          }}
        </button>
      </article>
    </div>
  </section>
</template>
