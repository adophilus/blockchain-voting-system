import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ElectionRepository } from '@/features/election/repository/interface'

export class EndElectionUseCase {
  constructor(private electionRepository: ElectionRepository) {}

  async execute(
    electionId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    // Get the election to check if it exists
    const electionResult = await this.electionRepository.getById(electionId)

    if (electionResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const election = electionResult.value

    if (!election) {
      return Result.err({
        code: 'ERR_ELECTION_NOT_FOUND'
      })
    }

    // Update the election status to COMPLETED and set end_timestamp to now
    const updateResult = await this.electionRepository.updateStatusAndEndDate(
      electionId,
      'COMPLETED',
      new Date().toISOString()
    )

    if (updateResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'ELECTION_ENDED',
      data: {
        id: updateResult.value.id
      }
    })
  }
}