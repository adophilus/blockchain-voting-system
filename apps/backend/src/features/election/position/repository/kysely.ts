import type { KyselyClient } from '@/features/database/kysely'
import type { Position } from '@/types'
import { Result } from 'true-myth'
import type { PositionRepository, PositionRepositoryError } from './interface'
import type { Logger } from '@/features/logger'

export class KyselyPositionRepository implements PositionRepository {
  constructor(
    private db: KyselyClient,
    private logger: Logger
  ) {}

  async create(
    payload: Position.Insertable[]
  ): Promise<Result<Position.Selectable[], PositionRepositoryError>> {
    try {
      const positions = await this.db
        .insertInto('positions')
        .values(payload)
        .returningAll()
        .execute()

      return Result.ok(positions)
    } catch (error) {
      this.logger.error('Error creating positions:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getByElectionId(
    electionId: string
  ): Promise<Result<Position.Selectable[], PositionRepositoryError>> {
    try {
      const positions = await this.db
        .selectFrom('positions')
        .selectAll()
        .where('election_id', '=', electionId)
        .orderBy('created_at', 'asc')
        .execute()

      return Result.ok(positions)
    } catch (error) {
      this.logger.error('Error fetching positions by election ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getById(
    id: string
  ): Promise<Result<Position.Selectable | null, PositionRepositoryError>> {
    try {
      const position = await this.db
        .selectFrom('positions')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()

      return Result.ok(position || null)
    } catch (error) {
      this.logger.error('Error fetching position by ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
