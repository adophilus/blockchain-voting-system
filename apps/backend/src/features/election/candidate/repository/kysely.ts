import type { KyselyClient } from '@/features/database/kysely'
import type { Candidate } from '@/types'
import { Result } from 'true-myth'
import {
  type CandidateRepository,
  type CandidateRepositoryError
} from './interface'
import type { Logger } from '@/features/logger'

export class KyselyCandidateRepository implements CandidateRepository {
  constructor(
    private db: KyselyClient,
    private logger: Logger
  ) {}

  async create(
    payload: Candidate.Insertable[]
  ): Promise<Result<Candidate.Selectable[], CandidateRepositoryError>> {
    try {
      const candidates = await this.db
        .insertInto('candidates')
        .values(payload)
        .returningAll()
        .execute()

      return Result.ok(candidates)
    } catch (error) {
      this.logger.error('Error creating candidates:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getByPositionIds(
    positionIds: string[]
  ): Promise<Result<Candidate.Selectable[], CandidateRepositoryError>> {
    try {
      const candidates = await this.db
        .selectFrom('candidates')
        .selectAll()
        .where('position_id', 'in', positionIds)
        .orderBy('created_at', 'asc')
        .execute()

      return Result.ok(candidates)
    } catch (error) {
      this.logger.error('Error fetching candidates by position IDs:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getById(
    id: string
  ): Promise<Result<Candidate.Selectable | null, CandidateRepositoryError>> {
    try {
      const candidate = await this.db
        .selectFrom('candidates')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()

      return Result.ok(candidate || null)
    } catch (error) {
      this.logger.error('Error fetching candidate by ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getByPositionId(
    positionId: string
  ): Promise<Result<Candidate.Selectable[], CandidateRepositoryError>> {
    try {
      const candidates = await this.db
        .selectFrom('candidates')
        .selectAll()
        .where('position_id', '=', positionId)
        .orderBy('created_at', 'asc')
        .execute()

      return Result.ok(candidates)
    } catch (error) {
      this.logger.error('Error fetching candidates by position ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
