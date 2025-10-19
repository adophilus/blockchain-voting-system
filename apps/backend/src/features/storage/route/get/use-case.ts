import type { Logger } from '@/features/logger'
import type { Request } from './types'
import { Result } from 'true-myth'
import type { StorageRepository } from '../../repository'
import type { File as DbFile } from '@/types'

export class GetFileUseCase {
  constructor(
    private readonly storageRepository: StorageRepository,
    private readonly logger: Logger
  ) {}

  async execute(
    payload: Request.Params
  ): Promise<Result<DbFile.Selectable, 'ERR_NOT_FOUND' | 'ERR_UNEXPECTED'>> {
    const result = await this.storageRepository.findById(payload.id)

    if (result.isErr) {
      this.logger.error('Error getting file:', result.error)
      return Result.err('ERR_UNEXPECTED')
    }

    if (!result.value) {
      return Result.err('ERR_NOT_FOUND')
    }

    return Result.ok(result.value)
  }
}
