<script setup lang="ts">
import type {
  AdminScheduledShowtime,
  AdminShowtimeFieldErrors,
  AdminShowtimeFormValues,
  AdminShowtimeMutationResponse,
  CinemaLocation,
} from '~/types/admin-showtime'
import type { AppError } from '~/types/app-error'
import type { Movie } from '~/types'
import {
  buildShowtimePreview,
  createEmptyShowtimeFormValues,
  createFollowUpShowtimeFormValues,
  formatAdminCurrency,
  formatAdminDateTime,
  getRoomsForCinema,
  hasShowtimeFieldErrors,
  toShowtimePayload,
  validateShowtimeFormValues,
} from '~/utils/admin-showtime-validation'

const { request } = useApi()
const { normalize, getMessage } = useApiError()

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Admin Showtimes',
})

const movies = ref<Movie[]>([])
const cinemas = ref<CinemaLocation[]>([])
const showtimes = ref<AdminScheduledShowtime[]>([])
const formValues = ref<AdminShowtimeFormValues>(createEmptyShowtimeFormValues())
const fieldErrors = ref<AdminShowtimeFieldErrors>({})
const pageStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const pageError = ref<AppError | null>(null)
const actionError = ref<AppError | null>(null)
const successMessage = ref('')
const submitPending = ref(false)

const pageErrorMessage = computed(() =>
  pageError.value ? getMessage(pageError.value, 'page') : null,
)
const actionErrorMessage = computed(() =>
  actionError.value ? getMessage(actionError.value, 'action') : null,
)
const roomOptions = computed(() =>
  getRoomsForCinema(cinemas.value, formValues.value.cinemaId),
)
const movieOptions = computed(() =>
  movies.value.map((movie) => ({
    value: movie.id,
    label: `${movie.title} · ${movie.durationMinutes} min`,
  })),
)
const draftEvaluation = computed(() =>
  validateShowtimeFormValues(formValues.value, {
    movies: movies.value,
    cinemas: cinemas.value,
    existingShowtimes: showtimes.value,
  }),
)
const overlapMessage = computed(() => draftEvaluation.value.errors.schedule?.[0] ?? '')
const preview = computed(() => buildShowtimePreview(draftEvaluation.value.draft))
const canSubmit = computed(() => !hasShowtimeFieldErrors(draftEvaluation.value.errors))

const sortedShowtimes = computed(() => {
  return [...showtimes.value].sort((left, right) => {
    return Date.parse(left.startsAt) - Date.parse(right.startsAt)
  })
})

const loadShowtimeData = async () => {
  pageStatus.value = 'loading'
  pageError.value = null

  try {
    const [moviesResponse, cinemasResponse, showtimesResponse] = await Promise.all([
      request<{ items: Movie[] }>('/api/v1/admin/movies', {
        query: {
          size: 100,
        },
      }),
      request<{ items: CinemaLocation[] }>('/api/v1/admin/cinemas'),
      request<{
        items: AdminScheduledShowtime[]
        page: number
        size: number
        totalItems: number
        totalPages: number
      }>('/api/v1/admin/showtimes', {
        query: {
          size: 100,
        },
      }),
    ])

    movies.value = moviesResponse.items
    cinemas.value = cinemasResponse.items
    showtimes.value = showtimesResponse.items
    pageStatus.value = 'ready'
  } catch (error) {
    pageError.value = normalize(error)
    pageStatus.value = 'error'
  }
}

const resetForm = () => {
  formValues.value = createEmptyShowtimeFormValues()
  fieldErrors.value = {}
  actionError.value = null
  successMessage.value = ''
}

const updateFormValues = (value: AdminShowtimeFormValues) => {
  const nextValues = { ...value }
  const availableRooms = getRoomsForCinema(cinemas.value, nextValues.cinemaId)

  if (
    nextValues.roomId &&
    !availableRooms.some((room) => room.id === nextValues.roomId)
  ) {
    nextValues.roomId = ''
  }

  formValues.value = nextValues
  fieldErrors.value = draftEvaluation.value.errors
  actionError.value = null
  successMessage.value = ''
}

const syncServerFieldErrors = (error: AppError | null) => {
  fieldErrors.value = (error?.validation as AdminShowtimeFieldErrors | undefined) ?? {}
}

const submitShowtime = async () => {
  actionError.value = null
  successMessage.value = ''
  fieldErrors.value = draftEvaluation.value.errors

  if (!draftEvaluation.value.draft || !canSubmit.value) {
    return
  }

  submitPending.value = true

  try {
    const response = await request<AdminShowtimeMutationResponse>(
      '/api/v1/admin/showtimes',
      {
        method: 'POST',
        body: toShowtimePayload(draftEvaluation.value.draft),
      },
    )

    showtimes.value = [response, ...showtimes.value]
    successMessage.value = 'Showtime created successfully.'
    formValues.value = createFollowUpShowtimeFormValues(formValues.value)
    fieldErrors.value = {}
  } catch (error) {
    actionError.value = normalize(error)
    syncServerFieldErrors(actionError.value)
  } finally {
    submitPending.value = false
  }
}

onMounted(async () => {
  await loadShowtimeData()
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      title="Admin: Showtimes"
      description="Schedule screenings by movie, cinema, and room with overlap protection before the schedule goes live."
    />

    <FullPageErrorState
      v-if="pageStatus === 'error' && pageError && pageErrorMessage"
      :title="pageErrorMessage.title"
      :description="pageErrorMessage.description"
      :retry-label="pageErrorMessage.retryLabel"
      :retry-disabled="false"
      @retry="loadShowtimeData"
    />

    <div v-else class="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
      <section class="space-y-5">
        <div>
          <h2 class="text-2xl font-bold text-slate-950">Current schedule</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Review the existing room schedule before adding another screening. Overlap checks are enforced against this schedule on every create.
          </p>
        </div>

        <section
          v-if="pageStatus === 'loading' || pageStatus === 'idle'"
          class="space-y-4"
          aria-busy="true"
          aria-live="polite"
        >
          <div
            v-for="item in 4"
            :key="item"
            class="card h-36 animate-pulse bg-slate-100"
          />
        </section>

        <PageEmptyState
          v-else-if="!movies.length"
          title="No movies available for scheduling"
          description="Create at least one movie in the admin catalog before scheduling a showtime."
          action-label="Go to admin movies"
          action-to="/admin/movies"
        />

        <PageEmptyState
          v-else-if="!cinemas.length"
          title="No cinemas available"
          description="Add a cinema and room catalog before creating showtimes for this admin workspace."
        />

        <PageEmptyState
          v-else-if="!sortedShowtimes.length"
          title="No showtimes scheduled yet"
          description="Use the form to create the first screening. It will appear here immediately after save."
        />

        <div v-else class="space-y-4">
          <article
            v-for="showtime in sortedShowtimes"
            :key="showtime.id"
            class="card p-5 sm:p-6"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600">
                  {{ showtime.cinemaName }}
                </p>
                <h3 class="mt-2 text-xl font-bold text-slate-950">
                  {{ showtime.movieTitle }}
                </h3>
                <p class="mt-2 text-sm text-slate-600">
                  {{ showtime.roomName }} · {{ formatAdminDateTime(showtime.startsAt) }}
                </p>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-[1.25rem] border border-border bg-slate-50 px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Runtime
                  </p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">
                    {{ showtime.durationMinutes }} min
                  </p>
                </div>
                <div class="rounded-[1.25rem] border border-border bg-slate-50 px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Ticket price
                  </p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">
                    {{ formatAdminCurrency(showtime.price) }}
                  </p>
                </div>
                <div class="rounded-[1.25rem] border border-border bg-slate-50 px-4 py-3 sm:col-span-2">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Time window
                  </p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">
                    {{ formatAdminDateTime(showtime.startsAt) }} to
                    {{ formatAdminDateTime(showtime.endsAt) }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="space-y-5">
        <div
          v-if="successMessage"
          class="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800"
        >
          {{ successMessage }}
        </div>

        <FormErrorBanner
          v-if="actionError && actionErrorMessage"
          :title="actionErrorMessage.title"
          :description="actionErrorMessage.description"
        />

        <SectionEmptyState
          v-if="pageStatus === 'ready' && movies.length && cinemas.length && formValues.cinemaId && !roomOptions.length"
          title="No rooms available for this cinema"
          description="Choose a different cinema or add rooms to this location before scheduling the showtime."
        />

        <AdminShowtimeForm
          :values="formValues"
          :errors="fieldErrors"
          :cinemas="cinemas"
          :rooms="roomOptions"
          :movie-options="movieOptions"
          :overlap-message="overlapMessage"
          :preview="preview"
          :submit-pending="submitPending"
          @update:values="updateFormValues"
          @submit="submitShowtime"
          @reset="resetForm"
        />
      </section>
    </div>
  </div>
</template>
