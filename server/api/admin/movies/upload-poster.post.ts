import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PosterUploadPayload, PosterUploadResponse } from '~/types/admin-movie'
import { requireServerRole } from '~/server/utils/auth-session'
import { validatePosterUploadPayload } from '~/utils/admin-movie-validation'

const extensionByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

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

    const base64Payload = payload.dataUrl.split(',', 2)[1] ?? ''

    if (!base64Payload) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Poster upload payload is malformed.',
      })
    }

    const extension = extensionByMimeType[payload.mimeType] ?? '.img'
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'movie-posters')
    const fileName = `${randomUUID()}${extension}`
    const filePath = join(uploadsDir, fileName)

    await mkdir(uploadsDir, { recursive: true })
    await writeFile(filePath, Buffer.from(base64Payload, 'base64'))

    return {
      posterUrl: `/uploads/movie-posters/${fileName}`,
    }
  },
)
