<script setup lang="ts">
import type {
  AdminMovieDeleteResponse,
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

definePageMeta({
  layout: 'admin',
})

useSeoMeta({
  title: 'Admin Movies',
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
  isEditing.value ? 'Edit movie' : 'Create movie',
)
const formDescription = computed(() =>
  isEditing.value
    ? 'Update movie metadata, poster artwork, and pricing details without leaving the list.'
    : 'Add a new movie with complete metadata and optional poster artwork.',
)

const updateFormValues = (value: AdminMovieFormValues) => {
  formValues.value = value
  fieldErrors.value = validateMovieFormValues(value)
}

const loadMovies = async () => {
  pageStatus.value = 'loading'
  pageError.value = null

  try {
    const response = await requestLocal<AdminMoviesResponse>('/api/admin/movies')
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

    successMessage.value = response.message
    await loadMovies()

    if (selectedMovieId.value) {
      startEditingMovie(response.item)
    } else {
      resetForm()
      successMessage.value = response.message
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
    const response = await requestLocal<AdminMovieDeleteResponse>(
      `/api/admin/movies/${deleteTarget.value.id}`,
      {
        method: 'DELETE',
      },
    )

    if (selectedMovieId.value === deleteTarget.value.id) {
      resetForm()
    }

    deleteTarget.value = null
    successMessage.value = response.message
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
      title="Admin: Movies"
      description="Create, edit, delete, and maintain movie catalog entries with poster artwork and validation guardrails."
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
            <h2 class="text-2xl font-bold text-slate-950">Movie catalog</h2>
            <p class="mt-1 text-sm leading-6 text-slate-600">
              Manage current movie records, poster artwork, pricing, and metadata from one place.
            </p>
          </div>
          <button type="button" class="btn-secondary" @click="resetForm">
            Create new movie
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
          title="No movies in the admin catalog"
          description="Create the first movie to start building the booking catalog. New entries will appear here immediately after save."
          icon="◌"
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
          :submit-label="isEditing ? 'Save changes' : 'Create movie'"
          :submit-loading-label="isEditing ? 'Saving changes...' : 'Creating movie...'"
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
      :title="deleteTarget ? `Delete ${deleteTarget.title}?` : 'Delete movie?'"
      :description="
        deleteTarget
          ? 'This removes the movie from the admin catalog. Use this only when the record should no longer be managed here.'
          : ''
      "
      :pending="Boolean(deletePendingMovieId)"
      confirm-label="Delete movie"
      @cancel="closeDeleteDialog"
      @confirm="deleteMovie"
    />
  </div>
</template>
