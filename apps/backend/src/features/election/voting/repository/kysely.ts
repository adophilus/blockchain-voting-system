import type { KyselyClient } from '@/features/database/kysely'
import type { Vote } from '@/types'
import { Result } from 'true-myth'
import type { VoteRepository, VoteRepositoryError } from './interface'
import type { Logger } from '@/features/logger'

export class KyselyVoteRepository implements VoteRepository {
  constructor(
    private db: KyselyClient,
    private logger: Logger
  ) {}

  async createMany(
    payload: Vote.Insertable[]
  ): Promise<Result<Vote.Selectable[], VoteRepositoryError>> {
    try {
      const votes = await this.db
        .insertInto('votes')
        .values(payload)
        .returningAll()
        .execute()

      return Result.ok(votes)
    } catch (error) {
      this.logger.error('Error creating votes:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async countByElectionId(
    electionId: string
  ): Promise<Result<number, VoteRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('votes')
        .select(this.db.fn.count('id').as('count'))
        .where('election_id', '=', electionId)
        .executeTakeFirst()

      const count = result ? parseInt(result.count as string, 10) : 0
      return Result.ok(count)
    } catch (error) {
      this.logger.error('Error counting votes by election ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async countByCandidateId(
    candidateId: string
  ): Promise<Result<number, VoteRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('votes')
        .select(this.db.fn.count('id').as('count'))
        .where('candidate_id', '=', candidateId)
        .executeTakeFirst()

      const count = result ? parseInt(result.count as string, 10) : 0
      return Result.ok(count)
    } catch (error) {
      this.logger.error('Error counting votes by candidate ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findByElectionId(
    electionId: string
  ): Promise<Result<Vote.Selectable[], VoteRepositoryError>> {
    try {
      const votes = await this.db
        .selectFrom('votes')
        .selectAll()
        .where('election_id', '=', electionId)
        .execute()

      return Result.ok(votes)
    } catch (error) {
      this.logger.error('Error finding votes by election ID:', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
