import type { PosterUploadPayload, PosterUploadResponse } from '~/types/admin-movie'
import { requireServerRole } from '~/server/utils/auth-session'
import { validatePosterUploadPayload } from '~/utils/admin-movie-validation'

export default defineEventHandler(
  async (event): Promise<PosterUploadResponse> => {
    await requireServerRole(event, 'ADMIN')

    const body = await readBody<Partial<PosterUploadPayload>>(event)

    const payload: PosterUploadPayload = {
      fileName: typeof body.fileName === 'string' ? body.fileName : '',
      mimeType: typeof body.mimeType === 'string' ? body.mimeType : '',
      size: typeof body.size === 'number' ? body.size : 0,
      dataUrl: typeof body.dataUrl === 'string' ? body.dataUrl : '',
    }

    const validationMessage = validatePosterUploadPayload(payload)

    if (validationMessage) {
      throw createError({
        statusCode: 400,
        statusMessage: validationMessage,
        data: {
          validation: {
            posterUrl: [validationMessage],
          },
        },
      })
    }

    return {
      posterUrl: payload.dataUrl,
    }
  },
)
