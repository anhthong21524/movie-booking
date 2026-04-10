<script setup lang="ts">
import type {
  AdminMovieFieldErrors,
  AdminMovieFormValues,
  AdminMovieMutationResponse,
  AdminMoviesResponse,
  PosterUploadPayload,
  PosterUploadResponse,
} from '~/types/admin-movie'
import type { AppError } from '~/types/app-error'
import type { Movie } from '~/types'
import {
  createEmptyMovieFormValues,
  hasMovieFieldErrors,
  toMovieFormValues,
  toMoviePayload,
  validateMovieFormValues,
} from '~/utils/admin-movie-validation'

const { requestLocal } = useApi()
const { normalize, getMessage } = useApiError()
const { t } = useI18n()

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: t('adminMoviesPage.seoTitle'),
})

const movies = ref<Movie[]>([])
const pageError = ref<AppError | null>(null)
const actionError = ref<AppError | null>(null)
const successMessage = ref('')
const pageStatus = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const submitPending = ref(false)
const uploadPending = ref(false)
const deletePendingMovieId = ref<string | null>(null)
const selectedMovieId = ref<string | null>(null)
const deleteTarget = ref<Movie | null>(null)
const formValues = ref<AdminMovieFormValues>(createEmptyMovieFormValues())
const fieldErrors = ref<AdminMovieFieldErrors>({})

const isEditing = computed(() => Boolean(selectedMovieId.value))

const pageErrorMessage = computed(() =>
  pageError.value ? getMessage(pageError.value, 'page') : null,
)
const actionErrorMessage = computed(() =>
  actionError.value ? getMessage(actionError.value, 'action') : null,
)

const formTitle = computed(() =>
  isEditing.value ? t('adminMoviesPage.formEditTitle') : t('adminMoviesPage.formCreateTitle'),
)
const formDescription = computed(() =>
  isEditing.value
    ? t('adminMoviesPage.formEditDescription')
    : t('adminMoviesPage.formCreateDescription'),
)
const deleteDialogTitle = computed(() => {
  if (!deleteTarget.value) {
    return t('adminMoviesPage.deleteDialogTitleFallback')
  }

  return t('adminMoviesPage.deleteDialogTitle').replace('{title}', deleteTarget.value.title)
})

const updateFormValues = (value: AdminMovieFormValues) => {
  formValues.value = value
  fieldErrors.value = validateMovieFormValues(value)
}

const loadMovies = async () => {
  pageStatus.value = 'loading'
  pageError.value = null

  try {
    const response = await requestLocal<AdminMoviesResponse>('/api/admin/movies', {
      query: {
        size: 100,
      },
    })
    movies.value = response.items
    pageStatus.value = 'ready'
  } catch (error) {
    pageError.value = normalize(error)
    pageStatus.value = 'error'
  }
}

const resetForm = () => {
  selectedMovieId.value = null
  formValues.value = createEmptyMovieFormValues()
  fieldErrors.value = {}
  actionError.value = null
  successMessage.value = ''
}

const startEditingMovie = (movie: Movie) => {
  selectedMovieId.value = movie.id
  formValues.value = toMovieFormValues(movie)
  fieldErrors.value = {}
  actionError.value = null
  successMessage.value = ''
}

const validateForm = () => {
  fieldErrors.value = validateMovieFormValues(formValues.value)
  return !hasMovieFieldErrors(fieldErrors.value)
}

const syncServerFieldErrors = (error: AppError | null) => {
  fieldErrors.value = (error?.validation as AdminMovieFieldErrors | undefined) ?? {}
}

const submitMovie = async () => {
  actionError.value = null
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  submitPending.value = true

  try {
    const payload = toMoviePayload(formValues.value)
    const response = selectedMovieId.value
      ? await requestLocal<AdminMovieMutationResponse>(
          `/api/admin/movies/${selectedMovieId.value}`,
          {
            method: 'PATCH',
            body: payload,
          },
        )
      : await requestLocal<AdminMovieMutationResponse>('/api/admin/movies', {
          method: 'POST',
          body: payload,
        })

    successMessage.value = selectedMovieId.value
      ? t('adminMoviesPage.updateSuccess')
      : t('adminMoviesPage.createSuccess')
    await loadMovies()

    if (selectedMovieId.value) {
      startEditingMovie(response)
    } else {
      resetForm()
      successMessage.value = t('adminMoviesPage.createSuccess')
    }
  } catch (error) {
    actionError.value = normalize(error)
    syncServerFieldErrors(actionError.value)
  } finally {
    submitPending.value = false
  }
}

const uploadPoster = async (payload: PosterUploadPayload) => {
  actionError.value = null
  successMessage.value = ''
  uploadPending.value = true

  try {
    const response = await requestLocal<PosterUploadResponse>(
      '/api/admin/movies/upload-poster',
      {
        method: 'POST',
        body: payload,
        timeoutMs: 20000,
      },
    )

    return response.posterUrl
  } catch (error) {
    actionError.value = normalize(error)
    syncServerFieldErrors(actionError.value)
    throw error
  } finally {
    uploadPending.value = false
  }
}

const confirmDeleteMovie = (movie: Movie) => {
  deleteTarget.value = movie
  actionError.value = null
  successMessage.value = ''
}

const closeDeleteDialog = () => {
  if (deletePendingMovieId.value) {
    return
  }

  deleteTarget.value = null
}

const deleteMovie = async () => {
  if (!deleteTarget.value) {
    return
  }

  deletePendingMovieId.value = deleteTarget.value.id
  actionError.value = null
  successMessage.value = ''

  try {
    await requestLocal<null>(
      `/api/admin/movies/${deleteTarget.value.id}`,
      {
        method: 'DELETE',
      },
    )

    if (selectedMovieId.value === deleteTarget.value.id) {
      resetForm()
    }

    deleteTarget.value = null
    successMessage.value = t('adminMoviesPage.deleteSuccess')
    await loadMovies()
  } catch (error) {
    actionError.value = normalize(error)
  } finally {
    deletePendingMovieId.value = null
  }
}

onMounted(async () => {
  await loadMovies()
})
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('adminMoviesPage.heroTitle')"
      :description="t('adminMoviesPage.heroDescription')"
    />

    <FullPageErrorState
      v-if="pageStatus === 'error' && pageError && pageErrorMessage"
      :title="pageErrorMessage.title"
      :description="pageErrorMessage.description"
      :retry-label="pageErrorMessage.retryLabel"
      :retry-disabled="false"
      @retry="loadMovies"
    />

    <div v-else class="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <section class="space-y-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-950">{{ t('adminMoviesPage.sectionTitle') }}</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              {{ t('adminMoviesPage.sectionDescription') }}
            </p>
          </div>
          <button type="button" class="btn-secondary" @click="resetForm">
            {{ t('adminMoviesPage.createNew') }}
          </button>
        </div>

        <section
          v-if="pageStatus === 'loading' || pageStatus === 'idle'"
          class="space-y-4"
          aria-busy="true"
          aria-live="polite"
        >
          <div
            v-for="item in 3"
            :key="item"
            class="card h-48 animate-pulse bg-slate-100"
          />
        </section>

        <PageEmptyState
          v-else-if="!movies.length"
          :title="t('adminMoviesPage.emptyTitle')"
          :description="t('adminMoviesPage.emptyDescription')"
          icon="○"
        />

        <AdminMovieList
          v-else
          :movies="movies"
          :selected-movie-id="selectedMovieId || undefined"
          :delete-pending-movie-id="deletePendingMovieId"
          @edit="startEditingMovie"
          @delete="confirmDeleteMovie"
        />
      </section>

      <div class="space-y-5">
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

        <MovieForm
          :values="formValues"
          :errors="fieldErrors"
          :submit-pending="submitPending"
          :upload-pending="uploadPending"
          :submit-label="isEditing ? t('adminMoviesPage.saveChanges') : t('adminMoviesPage.createNew')"
          :submit-loading-label="isEditing ? t('adminMoviesPage.savingChanges') : `${t('adminMoviesPage.createNew')}...`"
          :form-title="formTitle"
          :form-description="formDescription"
          :on-poster-upload="uploadPoster"
          @update:values="updateFormValues"
          @submit="submitMovie"
          @reset="resetForm"
        />
      </div>
    </div>

    <DeleteConfirmationDialog
      :open="Boolean(deleteTarget)"
      :title="deleteDialogTitle"
      :description="deleteTarget ? t('adminMoviesPage.deleteDialogDescription') : ''"
      :pending="Boolean(deletePendingMovieId)"
      :confirm-label="t('adminMoviesPage.deleteConfirm')"
      :cancel-label="t('adminMoviesPage.cancel')"
      :heading="t('adminMoviesPage.deleteHeading')"
      @cancel="closeDeleteDialog"
      @confirm="deleteMovie"
    />
  </div>
</template>
