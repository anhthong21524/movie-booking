<script setup lang="ts">
import type {
  AdminMovieFieldErrors,
  AdminMovieFormField,
  AdminMovieFormValues,
  PosterUploadPayload,
} from '~/types/admin-movie'
import {
  getMovieFieldError,
} from '~/utils/admin-movie-validation'

const props = defineProps<{
  values: AdminMovieFormValues
  errors: AdminMovieFieldErrors
  submitPending?: boolean
  uploadPending?: boolean
  submitLabel: string
  submitLoadingLabel: string
  formTitle: string
  formDescription: string
  onPosterUpload: (payload: PosterUploadPayload) => Promise<string>
}>()

const emit = defineEmits<{
  'update:values': [value: AdminMovieFormValues]
  submit: []
  reset: []
}>()

const touched = reactive<Record<AdminMovieFormField, boolean>>({
  title: false,
  durationMinutes: false,
  genre: false,
  description: false,
  rating: false,
  releaseDate: false,
  basePrice: false,
  posterUrl: false,
})

const updateField = (field: AdminMovieFormField, value: string) => {
  emit('update:values', {
    ...props.values,
    [field]: value,
  })
}

const markAllTouched = () => {
  touched.title = true
  touched.durationMinutes = true
  touched.genre = true
  touched.description = true
  touched.rating = true
  touched.releaseDate = true
  touched.basePrice = true
  touched.posterUrl = true
}

const getInputClass = (field: AdminMovieFormField) => {
  const hasError = Boolean(touched[field] && getMovieFieldError(props.errors, field))

  return [
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition',
    hasError
      ? 'border-rose-300 focus:border-rose-400'
      : 'border-border focus:border-primary-400',
  ]
}

const getVisibleError = (field: AdminMovieFormField) => {
  if (!touched[field]) {
    return ''
  }

  return getMovieFieldError(props.errors, field)
}
</script>

<template>
  <section class="card p-6 sm:p-8">
    <div class="flex flex-col gap-2 border-b border-border pb-5">
      <h2 class="text-2xl font-bold text-slate-950">{{ formTitle }}</h2>
      <p class="text-sm leading-6 text-slate-600">{{ formDescription }}</p>
    </div>

    <form
      class="mt-6 space-y-5"
      novalidate
      @submit.prevent="
        () => {
          markAllTouched()
          $emit('submit')
        }
      "
    >
      <div class="grid gap-5 lg:grid-cols-2">
        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">Title</span>
          <input
            :value="values.title"
            type="text"
            :class="getInputClass('title')"
            @input="updateField('title', ($event.target as HTMLInputElement).value)"
            @blur="touched.title = true"
          >
          <FieldErrorText id="movie-title-error" :message="getVisibleError('title')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">Genre</span>
          <input
            :value="values.genre"
            type="text"
            :class="getInputClass('genre')"
            @input="updateField('genre', ($event.target as HTMLInputElement).value)"
            @blur="touched.genre = true"
          >
          <FieldErrorText id="movie-genre-error" :message="getVisibleError('genre')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">Duration (minutes)</span>
          <input
            :value="values.durationMinutes"
            type="number"
            min="45"
            max="360"
            :class="getInputClass('durationMinutes')"
            @input="updateField('durationMinutes', ($event.target as HTMLInputElement).value)"
            @blur="touched.durationMinutes = true"
          >
          <FieldErrorText
            id="movie-duration-error"
            :message="getVisibleError('durationMinutes')"
          />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">Rating</span>
          <input
            :value="values.rating"
            type="text"
            placeholder="PG-13"
            :class="getInputClass('rating')"
            @input="updateField('rating', ($event.target as HTMLInputElement).value)"
            @blur="touched.rating = true"
          >
          <FieldErrorText id="movie-rating-error" :message="getVisibleError('rating')" />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">Release date</span>
          <input
            :value="values.releaseDate"
            type="date"
            :class="getInputClass('releaseDate')"
            @input="updateField('releaseDate', ($event.target as HTMLInputElement).value)"
            @blur="touched.releaseDate = true"
          >
          <FieldErrorText
            id="movie-release-date-error"
            :message="getVisibleError('releaseDate')"
          />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-medium text-slate-700">Base ticket price</span>
          <input
            :value="values.basePrice"
            type="number"
            min="1"
            max="100"
            step="0.01"
            :class="getInputClass('basePrice')"
            @input="updateField('basePrice', ($event.target as HTMLInputElement).value)"
            @blur="touched.basePrice = true"
          >
          <FieldErrorText id="movie-price-error" :message="getVisibleError('basePrice')" />
        </label>
      </div>

      <label class="block space-y-2">
        <span class="text-sm font-medium text-slate-700">Description</span>
        <textarea
          :value="values.description"
          rows="5"
          :class="getInputClass('description')"
          @input="updateField('description', ($event.target as HTMLTextAreaElement).value)"
          @blur="touched.description = true"
        />
        <FieldErrorText
          id="movie-description-error"
          :message="getVisibleError('description')"
        />
      </label>

      <div class="space-y-2">
        <span class="text-sm font-medium text-slate-700">Poster</span>
        <PosterUpload
          :model-value="values.posterUrl"
          :upload-pending="uploadPending"
          :error-message="getVisibleError('posterUrl')"
          :on-upload="onPosterUpload"
          @update:model-value="
            (value) => {
              touched.posterUrl = true
              updateField('posterUrl', value)
            }
          "
          @error="
            () => {
              touched.posterUrl = true
            }
          "
        />
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" class="btn-secondary" @click="$emit('reset')">
          Reset form
        </button>
        <LoadingButton
          type="submit"
          :label="submitLabel"
          :loading="submitPending"
          :loading-label="submitLoadingLabel"
        />
      </div>
    </form>
  </section>
</template>
