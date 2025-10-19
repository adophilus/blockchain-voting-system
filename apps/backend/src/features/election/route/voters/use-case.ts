import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { Request, Response } from './types'
import type { Voter } from '@/types'

class GenerateVotersUseCase {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async execute(
    electionId: string,
    payload: Request.Body
  ): Promise<Result<Response.Response, Response.Response>> {
    try {
      // Check if election exists
      const election = await this.client
        .selectFrom('elections')
        .selectAll()
        .where('id', '=', electionId)
        .executeTakeFirst()

      if (!election) {
        return Result.err({
          code: 'ERR_ELECTION_NOT_FOUND',
          message: 'Election not found'
        })
      }

      // Generate voter codes
      const voters = []
      const batchSize = 100
      let remainingCount = payload.count

      while (remainingCount > 0) {
        const currentBatchSize = Math.min(remainingCount, batchSize)
        const batchVoters = []

        for (let i = 0; i < currentBatchSize; i++) {
          // Generate a unique voter code (8-character alphanumeric)
          const code = Math.random().toString(36).substring(2, 10).toUpperCase()

          batchVoters.push({
            id: crypto.randomUUID(),
            election_id: electionId,
            code: code,
            status: 'NOT_VOTED',
            voted_at: null
          } satisfies Voter.Insertable)
        }

        // Insert batch
        const insertedVoters = await this.client
          .insertInto('voters')
          .values(batchVoters)
          .returningAll()
          .execute()

        voters.push(...insertedVoters)
        remainingCount -= currentBatchSize
      }

      return Result.ok({
        code: 'VOTERS_GENERATED',
        data: voters
      })
    } catch (error) {
      this.logger.error('Error generating voters:', error)
      return Result.err({
        code: 'ERR_UNEXPECTED',
        message: 'Failed to generate voter codes'
      })
    }
  }
}

export default GenerateVotersUseCase
