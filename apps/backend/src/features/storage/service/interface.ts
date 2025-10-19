import type { Result, Unit } from 'true-myth'
import type { File } from '@/types'

export type StorageServiceError = 'ERR_UNEXPECTED'

abstract class StorageService {
  public abstract create(
    payload: File.Insertable
  ): Promise<Result<File.Selectable, StorageServiceError>>
  public abstract createMany(
    payload: File.Insertable[]
  ): Promise<Result<File.Selectable[], StorageServiceError>>
  public abstract findById(
    id: string
  ): Promise<Result<File.Selectable, StorageServiceError>>
  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, StorageServiceError>>
}

export default StorageService
