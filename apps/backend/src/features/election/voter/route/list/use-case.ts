import type { Logger } from '@/features/logger'
import type { Response } from './types'
import { Result } from 'true-myth'
import type { VoterRepository } from '@/features/election/voter/repository/interface'

export class ListVotersUseCase {
  constructor(
    private voterRepository: VoterRepository,
    private logger: Logger
  ) {}

  async execute(
    electionId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.voterRepository.getByElectionId(electionId)

    if (result.isErr) {
      this.logger.error('Error fetching voters:', result.error)
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'VOTERS_LIST',
      data: result.value
    })
  }
}
