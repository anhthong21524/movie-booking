const AVATAR_KEY_PREFIX = 'movie-booking:avatar:'
const AVATAR_SIZE = 200
const AVATAR_QUALITY = 0.85
const MAX_FILE_SIZE_MB = 5

const resizeToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const canvas = document.createElement('canvas')
      canvas.width = AVATAR_SIZE
      canvas.height = AVATAR_SIZE

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context unavailable'))
        return
      }

      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2

      ctx.drawImage(img, sx, sy, size, size, 0, 0, AVATAR_SIZE, AVATAR_SIZE)
      resolve(canvas.toDataURL('image/jpeg', AVATAR_QUALITY))
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = objectUrl
  })
}

export const useUserAvatar = () => {
  const userStore = useUserStore()

  const storageKey = computed(() =>
    userStore.profile ? `${AVATAR_KEY_PREFIX}${userStore.profile.id}` : null,
  )

  const avatarUrl = ref<string | null>(null)
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)

  const load = () => {
    if (!import.meta.client || !storageKey.value) return
    avatarUrl.value = localStorage.getItem(storageKey.value)
  }

  const upload = async (file: File) => {
    if (!storageKey.value) return

    uploadError.value = null

    if (!file.type.startsWith('image/')) {
      uploadError.value = 'Please select an image file.'
      return
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      uploadError.value = `File must be smaller than ${MAX_FILE_SIZE_MB} MB.`
      return
    }

    isUploading.value = true

    try {
      const dataUrl = await resizeToDataUrl(file)
      localStorage.setItem(storageKey.value, dataUrl)
      avatarUrl.value = dataUrl
    } catch {
      uploadError.value = 'Could not process the image. Please try another file.'
    } finally {
      isUploading.value = false
    }
  }

  const remove = () => {
    if (!storageKey.value) return
    localStorage.removeItem(storageKey.value)
    avatarUrl.value = null
  }

  if (import.meta.client) {
    load()
    watch(storageKey, load)
  }

  return { avatarUrl, isUploading, uploadError, upload, remove }
}
