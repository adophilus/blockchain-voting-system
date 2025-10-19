import { Result, Unit } from 'true-myth'
import type StorageService from './interface'
import type { StorageServiceError } from './interface'
import type { File } from '@/types'
import { ulid } from 'ulidx'

class MockStorageService implements StorageService {
  // In-memory storage for mock files
  private files: Record<string, File.Selectable> = {}

  public async create(
    payload: File.Insertable
  ): Promise<Result<File.Selectable, StorageServiceError>> {
    try {
      const now = new Date().toISOString()
      const file: File.Selectable = {
        ...payload,
        created_at: now,
        updated_at: null
      }

      this.files[payload.id] = file
      return Result.ok(file)
    } catch (error) {
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async createMany(
    payloads: File.Insertable[]
  ): Promise<Result<File.Selectable[], StorageServiceError>> {
    try {
      const now = new Date().toISOString()
      const files: File.Selectable[] = []

      for (const payload of payloads) {
        const file: File.Selectable = {
          ...payload,
          created_at: now,
          updated_at: null
        }

        this.files[payload.id] = file
        files.push(file)
      }

      return Result.ok(files)
    } catch (error) {
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<Result<File.Selectable, StorageServiceError>> {
    try {
      const file = this.files[id]
      if (!file) {
        return Result.err('ERR_UNEXPECTED')
      }

      return Result.ok(file)
    } catch (error) {
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(id: string): Promise<Result<Unit, StorageServiceError>> {
    try {
      if (!this.files[id]) {
        return Result.err('ERR_UNEXPECTED')
      }

      delete this.files[id]
      return Result.ok(Unit)
    } catch (error) {
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default MockStorageService
