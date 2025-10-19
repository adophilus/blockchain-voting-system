import type { KyselyClient } from '@/features/database/kysely'
import type { File } from '@/types'
import { Result, Unit } from 'true-myth'
import type { StorageRepository, StorageRepositoryError } from './interface'
import type { Logger } from '@/features/logger'

export class KyselyStorageRepository implements StorageRepository {
  constructor(
    private db: KyselyClient,
    private logger: Logger
  ) {}

  async create(
    payload: File.Insertable
  ): Promise<Result<File.Selectable, StorageRepositoryError>> {
    try {
      const file = await this.db
        .insertInto('files')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(file)
    } catch (error) {
      this.logger.error('Error creating file:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    publicId: string
  ): Promise<Result<File.Selectable | null, StorageRepositoryError>> {
    try {
      const file = await this.db
        .selectFrom('files')
        .where('id', '=', publicId)
        .selectAll()
        .executeTakeFirst()
      return Result.ok(file || null)
    } catch (error) {
      this.logger.error('Error finding file by public ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async createMany(
    payloads: File.Insertable[]
  ): Promise<Result<File.Selectable[], StorageRepositoryError>> {
    try {
      const files = await this.db
        .insertInto('files')
        .values(payloads)
        .returningAll()
        .execute()
      return Result.ok(files)
    } catch (error) {
      this.logger.error('Error creating many files:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(id: string): Promise<Result<Unit, StorageRepositoryError>> {
    try {
      await this.db.deleteFrom('files').where('id', '=', id).executeTakeFirst()

      return Result.ok(Unit)
    } catch (error) {
      this.logger.error('Error deleting file by ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
