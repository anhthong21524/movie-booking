<script setup lang="ts">
import type { PosterUploadPayload } from '~/types/admin-movie'
import {
  ADMIN_POSTER_ALLOWED_TYPES,
  ADMIN_POSTER_MAX_SIZE_BYTES,
} from '~/utils/admin-movie-validation'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
  uploadPending?: boolean
  errorMessage?: string
  onUpload: (payload: PosterUploadPayload) => Promise<string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  error: [message: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const localError = ref('')

const previewUrl = computed(() => props.modelValue || '')

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }

    reader.onerror = () => reject(new Error('Poster file could not be read.'))
    reader.readAsDataURL(file)
  })

const validateFile = (file: File) => {
  if (!ADMIN_POSTER_ALLOWED_TYPES.includes(file.type as never)) {
    return 'Upload a JPG, PNG, or WebP image.'
  }

  if (file.size > ADMIN_POSTER_MAX_SIZE_BYTES) {
    return 'Poster image must be 2 MB or smaller.'
  }

  return ''
}

const resetInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleFileChange = async (event: Event) => {
  localError.value = ''

  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]

  if (!file) {
    return
  }

  const validationMessage = validateFile(file)

  if (validationMessage) {
    localError.value = validationMessage
    emit('error', validationMessage)
    resetInput()
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    const posterUrl = await props.onUpload({
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      dataUrl,
    })

    emit('update:modelValue', posterUrl)
    resetInput()
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : 'Poster upload failed. Try again.'

    localError.value = message
    emit('error', message)
    resetInput()
  }
}

const removePoster = () => {
  localError.value = ''
  emit('update:modelValue', '')
  resetInput()
}
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed border-border bg-slate-50"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="Poster preview"
        class="h-full min-h-[16rem] w-full object-cover"
      >
      <div v-else class="px-6 text-center text-slate-500">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Poster preview
        </p>
        <p class="mt-3 text-sm leading-6">
          Upload JPG, PNG, or WebP artwork up to 2 MB. A placeholder will be used if no poster is provided.
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row">
      <label class="btn-secondary cursor-pointer text-center">
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          :disabled="disabled || uploadPending"
          @change="handleFileChange"
        >
        {{ uploadPending ? 'Uploading poster...' : 'Upload poster' }}
      </label>

      <button
        v-if="previewUrl"
        type="button"
        class="btn-secondary"
        :disabled="disabled || uploadPending"
        @click="removePoster"
      >
        Remove poster
      </button>
    </div>

    <FieldErrorText
      id="poster-upload-error"
      :message="localError || errorMessage"
    />
  </div>
</template>
