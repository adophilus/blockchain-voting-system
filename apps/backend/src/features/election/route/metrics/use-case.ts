import type { Logger } from '@/features/logger'
import type { Response } from './types'
import { Result } from 'true-myth'
import type { ElectionRepository } from '@/features/election/repository/interface'

export class GetPlatformElectionMetricsUseCase {
  constructor(
    private electionRepository: ElectionRepository,
    private logger: Logger
  ) {}

  async execute(): Promise<Result<Response.Success, Response.Error>> {
    const totalElectionsResult = await this.electionRepository.countAll()
    const activeElectionsResult =
      await this.electionRepository.countByStatus('ONGOING')
    const completedElectionsResult =
      await this.electionRepository.countByStatus('COMPLETED')

    if (totalElectionsResult.isErr) {
      this.logger.error(
        'Error fetching total elections:',
        totalElectionsResult.error
      )
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    if (activeElectionsResult.isErr) {
      this.logger.error(
        'Error fetching active elections:',
        activeElectionsResult.error
      )
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    if (completedElectionsResult.isErr) {
      this.logger.error(
        'Error fetching completed elections:',
        completedElectionsResult.error
      )
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'ELECTION_METRICS',
      data: {
        total_elections: totalElectionsResult.value,
        active_elections: activeElectionsResult.value,
        completed_elections: completedElectionsResult.value
      }
    })
  }
}
