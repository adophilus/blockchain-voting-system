import { Result, type Unit } from 'true-myth'
import type StorageService from './interface'
import type { StorageServiceError } from './interface'
import type { StorageRepository } from '../repository/interface'
import type { File } from '@/types'

class SqliteStorageService implements StorageService {
  constructor(private readonly repository: StorageRepository) {}

  public async create(
    payload: File.Insertable
  ): Promise<Result<File.Selectable, StorageServiceError>> {
    return this.repository.create(payload)
  }

  public async createMany(
    payload: File.Insertable[]
  ): Promise<Result<File.Selectable[], StorageServiceError>> {
    return this.repository.createMany(payload)
  }

  async findById(
    id: string
  ): Promise<Result<File.Selectable, StorageServiceError>> {
    const result = await this.repository.findById(id)
    if (result.isErr) {
      return Result.err(result.error)
    }
    const file = result.value
    if (!file) {
      return Result.err('ERR_UNEXPECTED')
    }
    return Result.ok(file)
  }

  async deleteById(id: string): Promise<Result<Unit, StorageServiceError>> {
    return this.repository.deleteById(id)
  }
}

export default SqliteStorageService
