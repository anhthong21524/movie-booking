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

const { t } = useI18n()

const fileInput = ref<HTMLInputElement | null>(null)
const localError = ref('')

const previewUrl = computed(() => props.modelValue || '')

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }

    reader.onerror = () => reject(new Error(t('posterUpload.readError')))
    reader.readAsDataURL(file)
  })

const validateFile = (file: File) => {
  if (!ADMIN_POSTER_ALLOWED_TYPES.includes(file.type as never)) {
    return t('posterUpload.invalidType')
  }

  if (file.size > ADMIN_POSTER_MAX_SIZE_BYTES) {
    return t('posterUpload.maxSize')
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
        : t('posterUpload.uploadFailed')

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
        :alt="t('posterUpload.previewAlt')"
        class="h-full min-h-[16rem] w-full object-cover"
      >
      <div v-else class="px-6 text-center text-slate-500">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          {{ t('posterUpload.previewTitle') }}
        </p>
        <p class="mt-3 text-sm leading-6">
          {{ t('posterUpload.previewDescription') }}
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
        {{ uploadPending ? t('posterUpload.uploadingButton') : t('posterUpload.uploadButton') }}
      </label>

      <button
        v-if="previewUrl"
        type="button"
        class="btn-secondary"
        :disabled="disabled || uploadPending"
        @click="removePoster"
      >
        {{ t('posterUpload.removeButton') }}
      </button>
    </div>

    <FieldErrorText
      id="poster-upload-error"
      :message="localError || errorMessage"
    />
  </div>
</template>
