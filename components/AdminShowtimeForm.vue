<script setup lang="ts">
import type {
  AdminShowtimeFieldErrors,
  AdminShowtimeFormField,
  AdminShowtimeFormValues,
  CinemaLocation,
  CinemaRoom,
  ShowtimeDraftPreview,
} from '~/types/admin-showtime'
import { getShowtimeFieldError } from '~/utils/admin-showtime-validation'

const props = defineProps<{
  values: AdminShowtimeFormValues
  errors: AdminShowtimeFieldErrors
  cinemas: CinemaLocation[]
  rooms: CinemaRoom[]
  movieOptions: Array<{ value: string; label: string }>
  overlapMessage: string
  preview: ShowtimeDraftPreview | null
  submitPending: boolean
}>()

const emit = defineEmits<{
  'update:values': [value: AdminShowtimeFormValues]
  submit: []
  reset: []
}>()

const { t } = useI18n()

const touched = reactive<Record<AdminShowtimeFormField, boolean>>({
  movieId: false,
  date: false,
  time: false,
  cinemaId: false,
  roomId: false,
  price: false,
  schedule: false,
})

const hasSubmitted = ref(false)

const updateField = (
  field: keyof AdminShowtimeFormValues,
  value: string,
) => {
  emit('update:values', {
    ...props.values,
    [field]: value,
  })
}

const markFieldTouched = (field: AdminShowtimeFormField) => {
  touched[field] = true
}

const markAllTouched = () => {
  touched.movieId = true
  touched.date = true
  touched.time = true
  touched.cinemaId = true
  touched.roomId = true
  touched.price = true
  touched.schedule = true
}

const getVisibleFieldError = (field: AdminShowtimeFormField) => {
  if (!touched[field] && !hasSubmitted.value) {
    return ''
  }

  return getShowtimeFieldError(props.errors, field)
}

const isFieldInvalid = (field: AdminShowtimeFormField) => {
  return Boolean(getVisibleFieldError(field))
}

const getInputClass = (field: AdminShowtimeFormField) => [
  'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
  isFieldInvalid(field)
    ? 'border-rose-300 focus:border-rose-400'
    : 'border-border focus:border-primary-400',
]

const roomPlaceholder = computed(() =>
  props.values.cinemaId ? t('adminShowtimeForm.selectRoom') : t('adminShowtimeForm.selectCinemaFirst'),
)

const handleSubmit = () => {
  hasSubmitted.value = true
  markAllTouched()
  emit('submit')
}
</script>

<template>
  <section class="card space-y-5 p-5 sm:p-6">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-primary-600">
        {{ t('adminShowtimeForm.eyebrow') }}
      </p>
      <h2 class="mt-3 text-2xl font-bold text-slate-950">{{ t('adminShowtimeForm.title') }}</h2>
      <p class="mt-2 text-sm leading-6 text-slate-600">
        {{ t('adminShowtimeForm.description') }}
      </p>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <div class="grid gap-5 lg:grid-cols-2">
        <label class="block space-y-2 lg:col-span-2">
          <span class="text-sm font-medium text-slate-700">{{ t('adminShowtimeForm.movie') }}</span>
          <select
            :value="values.movieId"
            :class="getInputClass('movieId')"
            :aria-invalid="isFieldInvalid('movieId')"
            :aria-describedby="getVisibleFieldError('movieId') ? 'showtime-movie-error' : undefined"
            @change="updateField('movieId', ($event.target as HTMLSelectElement).value)"
            @blur="markFieldTouched('movieId')"
          >
            <option value="">{{ t('adminShowtimeForm.selectMovie') }}</option>
            <option
              v-for="option in movieOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <FieldErrorText id="showtime-movie-error" :message="getVisibleFieldError('movieId')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">{{ t('adminShowtimeForm.date') }}</span>
          <input
            :value="values.date"
            type="date"
            :class="getInputClass('date')"
            :aria-invalid="isFieldInvalid('date')"
            :aria-describedby="getVisibleFieldError('date') ? 'showtime-date-error' : undefined"
            @input="updateField('date', ($event.target as HTMLInputElement).value)"
            @blur="markFieldTouched('date')"
          />
          <FieldErrorText id="showtime-date-error" :message="getVisibleFieldError('date')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">{{ t('adminShowtimeForm.startTime') }}</span>
          <input
            :value="values.time"
            type="time"
            :class="getInputClass('time')"
            :aria-invalid="isFieldInvalid('time')"
            :aria-describedby="getVisibleFieldError('time') ? 'showtime-time-error' : undefined"
            @input="updateField('time', ($event.target as HTMLInputElement).value)"
            @blur="markFieldTouched('time')"
          />
          <FieldErrorText id="showtime-time-error" :message="getVisibleFieldError('time')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">{{ t('adminShowtimeForm.cinema') }}</span>
          <select
            :value="values.cinemaId"
            :class="getInputClass('cinemaId')"
            :aria-invalid="isFieldInvalid('cinemaId')"
            :aria-describedby="getVisibleFieldError('cinemaId') ? 'showtime-cinema-error' : undefined"
            @change="updateField('cinemaId', ($event.target as HTMLSelectElement).value)"
            @blur="markFieldTouched('cinemaId')"
          >
            <option value="">{{ t('adminShowtimeForm.selectCinema') }}</option>
            <option
              v-for="cinema in cinemas"
              :key="cinema.id"
              :value="cinema.id"
            >
              {{ cinema.name }}
            </option>
          </select>
          <FieldErrorText id="showtime-cinema-error" :message="getVisibleFieldError('cinemaId')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">{{ t('adminShowtimeForm.room') }}</span>
          <select
            :value="values.roomId"
            :class="getInputClass('roomId')"
            :aria-invalid="isFieldInvalid('roomId')"
            :aria-describedby="getVisibleFieldError('roomId') ? 'showtime-room-error' : undefined"
            :disabled="!values.cinemaId || !rooms.length"
            @change="updateField('roomId', ($event.target as HTMLSelectElement).value)"
            @blur="markFieldTouched('roomId')"
          >
            <option value="">
              {{ roomPlaceholder }}
            </option>
            <option
              v-for="room in rooms"
              :key="room.id"
              :value="room.id"
            >
              {{ room.name }} - {{ t('adminShowtimeForm.seatsLabel').replace('{count}', String(room.capacity)) }}
            </option>
          </select>
          <FieldErrorText id="showtime-room-error" :message="getVisibleFieldError('roomId')" />
        </label>

        <label class="block space-y-2 lg:col-span-2">
          <span class="text-sm font-medium text-slate-700">{{ t('adminShowtimeForm.ticketPrice') }}</span>
          <input
            :value="values.price"
            type="number"
            min="1"
            max="100"
            step="0.5"
            inputmode="decimal"
            :class="getInputClass('price')"
            :aria-invalid="isFieldInvalid('price')"
            :aria-describedby="getVisibleFieldError('price') ? 'showtime-price-error' : undefined"
            @input="updateField('price', ($event.target as HTMLInputElement).value)"
            @blur="markFieldTouched('price')"
          />
          <FieldErrorText id="showtime-price-error" :message="getVisibleFieldError('price')" />
        </label>
      </div>

      <ShowtimeOverlapWarning :message="overlapMessage || getVisibleFieldError('schedule')" />

      <ShowtimeSummaryPreview :preview="preview" />

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" class="btn-secondary" @click="$emit('reset')">
          {{ t('adminShowtimeForm.reset') }}
        </button>
        <LoadingButton
          type="submit"
          :label="t('adminShowtimeForm.create')"
          :loading="submitPending"
          :loading-label="t('adminShowtimeForm.creating')"
        />
      </div>
    </form>
  </section>
</template>
