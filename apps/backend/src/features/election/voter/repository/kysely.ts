import type { KyselyClient } from '@/features/database/kysely'
import type { Voter } from '@/types'
import { Result } from 'true-myth'
import type { VoterRepository, VoterRepositoryError } from './interface'
import type { Logger } from '@/features/logger'

export class KyselyVoterRepository implements VoterRepository {
  constructor(
    private db: KyselyClient,
    private logger: Logger
  ) {}

  async createMany(
    payload: Voter.Insertable[]
  ): Promise<Result<Voter.Selectable[], VoterRepositoryError>> {
    try {
      const voters = await this.db
        .insertInto('voters')
        .values(payload)
        .returningAll()
        .execute()

      return Result.ok(voters)
    } catch (error: any) {
      this.logger.error('error.code:', error.code)
      this.logger.error('Error creating voters:', error)
      // Check for unique constraint violation error code (SQLite specific, adjust for other DBs)
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return Result.err('ERR_DUPLICATE_ENTRY')
      }
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getByElectionId(
    electionId: string
  ): Promise<Result<Voter.Selectable[], VoterRepositoryError>> {
    try {
      const voters = await this.db
        .selectFrom('voters')
        .selectAll()
        .where('election_id', '=', electionId)
        .execute()

      return Result.ok(voters)
    } catch (error) {
      this.logger.error('Error fetching voters by election ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getByCode(
    electionId: string,
    code: string
  ): Promise<Result<Voter.Selectable | null, VoterRepositoryError>> {
    try {
      const voter = await this.db
        .selectFrom('voters')
        .selectAll()
        .where('election_id', '=', electionId)
        .where('code', '=', code)
        .executeTakeFirst()

      return Result.ok(voter || null)
    } catch (error) {
      this.logger.error('Error fetching voter by code:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async markAsVoted(
    id: string
  ): Promise<Result<Voter.Selectable, VoterRepositoryError>> {
    try {
      const voter = await this.db
        .updateTable('voters')
        .set({
          status: 'VOTED',
          voted_at: new Date().toISOString()
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(voter)
    } catch (error) {
      this.logger.error('Error marking voter as voted:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
