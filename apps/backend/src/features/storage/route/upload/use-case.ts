import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { StorageRepository } from '../../repository'
import { ulid } from 'ulidx'
import type { MediaDescription } from '@/types'

export class UploadUseCase {
  constructor(private storageRepository: StorageRepository) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const uploadedFiles: MediaDescription[] = []

    for (const file of payload.files) {
      const arrayBuffer = await file.arrayBuffer()

      const result = await this.storageRepository.create({
        id: ulid(),
        original_name: file.name,
        mime_type: file.type,
        file_data: Buffer.from(arrayBuffer)
      })

      if (result.isErr)
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })

      uploadedFiles.push({
        id: result.value.id,
        source: 'sqlite'
      })
    }

    return Result.ok({
      code: 'MEDIA_UPLOADED',
      data: uploadedFiles
    })
  }
}
