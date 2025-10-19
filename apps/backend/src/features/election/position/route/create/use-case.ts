import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { PositionRepository } from '@/features/election/position/repository/interface'
import { ulid } from 'ulidx'

export class CreatePositionUseCase {
  constructor(private positionRepository: PositionRepository) {}

  async execute(
    payload: Request.Body,
    electionId: string
  ): Promise<Result<Response.Success, Response.Error>> {
    const positionsToInsert = payload.positions.map((p) => ({
      id: ulid(),
      election_id: electionId,
      title: p.title,
      description: p.description
    }))

    const result = await this.positionRepository.create(positionsToInsert)

    if (result.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'POSITIONS_LIST',
      data: result.value
    })
  }
}
