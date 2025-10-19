import type { Logger } from '@/features/logger'
import type { Response } from './types'
import { Result } from 'true-myth'
import type { ElectionRepository } from '@/features/election/repository/interface'
import type { PositionRepository } from '@/features/election/position/repository/interface'
import type { CandidateRepository } from '@/features/election/candidate/repository/interface'

export class GetElectionByIdUseCase {
  constructor(
    private electionRepository: ElectionRepository,
    private positionRepository: PositionRepository,
    private candidateRepository: CandidateRepository,
    private logger: Logger
  ) {}

  async execute(
    electionId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const electionResult = await this.electionRepository.getById(electionId)

    if (electionResult.isErr) {
      this.logger.error('Error fetching election:', electionResult.error)
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

    const positionsResult = await this.positionRepository.getByElectionId(
      election.id
    )

    if (positionsResult.isErr) {
      this.logger.error('Error fetching positions:', positionsResult.error)
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const positions = positionsResult.value
    const positionIds = positions.map((p) => p.id)

    let candidates: any[] = []
    if (positionIds.length > 0) {
      const candidatesResult =
        await this.candidateRepository.getByPositionIds(positionIds)

      if (candidatesResult.isErr) {
        this.logger.error('Error fetching candidates:', candidatesResult.error)
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }
      candidates = candidatesResult.value
    }

    const formattedPositions = positions.map((position) => ({
      ...position,
      candidates: candidates.filter((c) => c.position_id === position.id)
    }))

    return Result.ok({
      code: 'ELECTION_DETAILS',
      data: {
        election,
        positions: formattedPositions
      }
    })
  }
}
