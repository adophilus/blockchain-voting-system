import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import { generateTokens } from '@/features/auth/utils/token'
import type { Request, Response } from './types'

class SignInWithVoterCodeUseCase {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Response, Response.Response>> {
    try {
      // Check if election exists and is active
      const election = await this.client
        .selectFrom('elections')
        .selectAll()
        .where('id', '=', payload.election_id)
        .executeTakeFirst()

      if (!election) {
        return Result.err({
          code: 'ERR_ELECTION_NOT_FOUND',
          message: 'Election not found'
        })
      }

      if (election.status !== 'ONGOING') {
        return Result.err({
          code: 'ERR_ELECTION_NOT_ACTIVE',
          message: 'Election is not currently active'
        })
      }

      // Check if voter exists with the provided code
      const voter = await this.client
        .selectFrom('voters')
        .selectAll()
        .where('election_id', '=', payload.election_id)
        .where('code', '=', payload.voter_code.toUpperCase())
        .executeTakeFirst()

      if (!voter) {
        return Result.err({
          code: 'ERR_VOTER_NOT_FOUND',
          message: 'Invalid voter code'
        })
      }

      // Check if voter has already voted
      if (voter.status === 'VOTED') {
        return Result.err({
          code: 'ERR_VOTER_ALREADY_VOTED',
          message: 'You have already voted in this election'
        })
      }

      // Generate tokens for the voter
      const tokens = await generateTokens(voter.id)

      return Result.ok({
        code: 'SIGN_IN_SUCCESSFUL',
        data: {
          voter,
          tokens
        }
      })
    } catch (error) {
      this.logger.error('Error signing in with voter code:', error)
      return Result.err({
        code: 'ERR_VOTER_NOT_FOUND',
        message: 'Invalid voter code'
      })
    }
  }
}

export default SignInWithVoterCodeUseCase
