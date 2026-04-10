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

const { requestLocal } = useApi()
const { normalize, getMessage } = useApiError()
const { t } = useI18n()

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: t('adminShowtimesPage.seoTitle'),
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
    label: `${movie.title} · ${movie.durationMinutes} ${t('common.minutesShort')}`,
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
      requestLocal<{ items: Movie[] }>('/api/admin/movies', {
        query: {
          size: 100,
        },
      }),
      requestLocal<{ items: CinemaLocation[] }>('/api/admin/cinemas'),
      requestLocal<{
        items: AdminScheduledShowtime[]
        page: number
        size: number
        totalItems: number
        totalPages: number
      }>('/api/admin/showtimes', {
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
    const response = await requestLocal<AdminShowtimeMutationResponse>(
      '/api/admin/showtimes',
      {
        method: 'POST',
        body: toShowtimePayload(draftEvaluation.value.draft),
      },
    )

    showtimes.value = [response, ...showtimes.value]
    successMessage.value = t('adminShowtimesPage.createSuccess')
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
      :title="t('adminShowtimesPage.heroTitle')"
      :description="t('adminShowtimesPage.heroDescription')"
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
          <h2 class="text-2xl font-bold text-slate-950">{{ t('adminShowtimesPage.sectionTitle') }}</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ t('adminShowtimesPage.sectionDescription') }}
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
          :title="t('adminShowtimesPage.noMoviesTitle')"
          :description="t('adminShowtimesPage.noMoviesDescription')"
          :action-label="t('adminShowtimesPage.noMoviesAction')"
          action-to="/admin/movies"
        />

        <PageEmptyState
          v-else-if="!cinemas.length"
          :title="t('adminShowtimesPage.noCinemasTitle')"
          :description="t('adminShowtimesPage.noCinemasDescription')"
        />

        <PageEmptyState
          v-else-if="!sortedShowtimes.length"
          :title="t('adminShowtimesPage.noShowtimesTitle')"
          :description="t('adminShowtimesPage.noShowtimesDescription')"
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
                    {{ t('adminShowtimesPage.runtime') }}
                  </p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">
                    {{ showtime.durationMinutes }} {{ t('common.minutesShort') }}
                  </p>
                </div>
                <div class="rounded-[1.25rem] border border-border bg-slate-50 px-4 py-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {{ t('adminShowtimesPage.ticketPrice') }}
                  </p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">
                    {{ formatAdminCurrency(showtime.price) }}
                  </p>
                </div>
                <div class="rounded-[1.25rem] border border-border bg-slate-50 px-4 py-3 sm:col-span-2">
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {{ t('adminShowtimesPage.timeWindow') }}
                  </p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">
                    {{ formatAdminDateTime(showtime.startsAt) }} {{ t('adminShowtimesPage.to') }}
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
          :title="t('adminShowtimesPage.noRoomsTitle')"
          :description="t('adminShowtimesPage.noRoomsDescription')"
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
