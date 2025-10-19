import { Result, type Unit } from 'true-myth'
import type { File } from '@/types'

export type StorageRepositoryError = 'ERR_UNEXPECTED'

export abstract class StorageRepository {
  public abstract create(
    payload: File.Insertable
  ): Promise<Result<File.Selectable, StorageRepositoryError>>
  public abstract createMany(
    payloads: File.Insertable[]
  ): Promise<Result<File.Selectable[], StorageRepositoryError>>
  public abstract findById(
    id: string
  ): Promise<Result<File.Selectable | null, StorageRepositoryError>>
  public abstract deleteById(
    id: string
  ): Promise<Result<Unit, StorageRepositoryError>>
}
