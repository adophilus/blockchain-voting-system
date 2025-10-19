import type { Response } from './types'
import { Result } from 'true-myth'
import type { ElectionRepository } from '@/features/election/repository/interface'
import type { Logger } from '@/features/logger'

export class DeleteElectionUseCase {
  constructor(
    private electionRepository: ElectionRepository,
    private logger: Logger
  ) {}

  async execute(
    electionId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const electionResult = await this.electionRepository.getById(electionId)

    if (electionResult.isErr) {
      this.logger.error(
        'Error getting election for deletion:',
        electionResult.error
      )
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const election = electionResult.value

    if (!election) {
      return Result.err({ code: 'ERR_ELECTION_NOT_FOUND' })
    }

    const deleteResult = await this.electionRepository.delete(electionId)

    if (deleteResult.isErr) {
      this.logger.error('Error deleting election:', deleteResult.error)
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({
      code: 'ELECTION_DELETED',
      data: {
        id: electionId
      }
    })
  }
}
