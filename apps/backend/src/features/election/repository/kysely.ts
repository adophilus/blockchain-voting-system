import type { KyselyClient } from '@/features/database/kysely'
import type { Election } from '@/types'
import { Result, Unit } from 'true-myth'
import type { ElectionRepository, ElectionRepositoryError } from './interface'
import type { Logger } from '@/features/logger'

export class KyselyElectionRepository implements ElectionRepository {
  constructor(
    private db: KyselyClient,
    private logger: Logger
  ) {}

  async listElections(options: { page: number; per_page: number }): Promise<
    Result<
      {
        data: Election.Selectable[]
        total: number
      },
      ElectionRepositoryError
    >
  > {
    try {
      const offset = (options.page - 1) * options.per_page

      const elections = await this.db
        .selectFrom('elections')
        .selectAll()
        .orderBy('created_at', 'desc')
        .limit(options.per_page)
        .offset(offset)
        .execute()

      const countResult = await this.db
        .selectFrom('elections')
        .select(this.db.fn.count('id').as('count'))
        .executeTakeFirst()

      const total = countResult ? parseInt(countResult.count as string, 10) : 0

      return Result.ok({
        data: elections,
        total
      })
    } catch (error) {
      this.logger.error('Error listing elections:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async create(
    payload: Election.Insertable
  ): Promise<Result<Election.Selectable, ElectionRepositoryError>> {
    try {
      const election = await this.db
        .insertInto('elections')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(election)
    } catch (error) {
      this.logger.error('Error creating election:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getById(
    id: string
  ): Promise<Result<Election.Selectable | null, ElectionRepositoryError>> {
    try {
      const election = await this.db
        .selectFrom('elections')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()

      return Result.ok(election || null)
    } catch (error) {
      this.logger.error('Error fetching election by ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async countAll(): Promise<Result<number, ElectionRepositoryError>> {
    try {
      const countResult = await this.db
        .selectFrom('elections')
        .select(this.db.fn.count('id').as('count'))
        .executeTakeFirst()

      const total = countResult ? parseInt(countResult.count as string, 10) : 0
      return Result.ok(total)
    } catch (error) {
      this.logger.error('Error counting all elections:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async countByStatus(
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  ): Promise<Result<number, ElectionRepositoryError>> {
    try {
      const countResult = await this.db
        .selectFrom('elections')
        .select(this.db.fn.count('id').as('count'))
        .where('status', '=', status)
        .executeTakeFirst()

      const total = countResult ? parseInt(countResult.count as string, 10) : 0
      return Result.ok(total)
    } catch (error) {
      this.logger.error(`Error counting elections by status ${status}:`, error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async updateStatus(
    id: string,
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  ): Promise<Result<Election.Selectable, ElectionRepositoryError>> {
    try {
      const election = await this.db
        .updateTable('elections')
        .set({ status })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(election)
    } catch (error) {
      this.logger.error('Error updating election status:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async updateStatusAndEndDate(
    id: string,
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED',
    endDate: string
  ): Promise<Result<Election.Selectable, ElectionRepositoryError>> {
    try {
      const election = await this.db
        .updateTable('elections')
        .set({ status, end_timestamp: endDate })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(election)
    } catch (error) {
      this.logger.error('Error updating election status and end date:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async delete(id: string): Promise<Result<Unit, ElectionRepositoryError>> {
    try {
      await this.db.deleteFrom('elections').where('id', '=', id).execute()
      return Result.ok(Unit)
    } catch (error) {
      this.logger.error('Error deleting election:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
