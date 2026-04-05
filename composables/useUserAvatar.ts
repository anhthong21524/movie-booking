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
  const avatarUrl = ref<string | null>(null)
  const isLoading = ref(false)
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)

  const load = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<{ avatar?: string | null }>('/api/v1/users/me')
      avatarUrl.value = data.avatar ?? null
    } catch {
      avatarUrl.value = null
    } finally {
      isLoading.value = false
    }
  }

  const upload = async (file: File) => {
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
      const data = await $fetch<{ avatar?: string | null }>('/api/v1/users/me/avatar', {
        method: 'PUT',
        body: { avatar: dataUrl },
      })
      avatarUrl.value = data.avatar ?? dataUrl
    } catch {
      uploadError.value = 'Could not save the avatar. Please try again.'
    } finally {
      isUploading.value = false
    }
  }

  const remove = async () => {
    try {
      await $fetch('/api/v1/users/me/avatar', { method: 'DELETE' })
      avatarUrl.value = null
    } catch {
      uploadError.value = 'Could not remove the avatar. Please try again.'
    }
  }

  if (import.meta.client) {
    load()
  }

  return { avatarUrl, isLoading, isUploading, uploadError, upload, remove }
}
