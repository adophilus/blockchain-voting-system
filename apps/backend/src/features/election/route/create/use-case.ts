import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ElectionRepository } from '@/features/election/repository/interface'
import { ulid } from 'ulidx'
import { compareAsc } from 'date-fns'

export class CreateElectionUseCase {
  constructor(private electionRepository: ElectionRepository) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const isValidDate = compareAsc(
      new Date(payload.start_timestamp),
      new Date(payload.end_timestamp)
    )

    if (isValidDate === 1) {
      return Result.err({
        code: 'ERR_INVALID_DATE_RANGE'
      })
    }

    const isActive =
      new Date() >= new Date(payload.start_timestamp) &&
      new Date() <= new Date(payload.end_timestamp)

    const isInThePast = new Date() > new Date(payload.end_timestamp)

    if (isInThePast) {
      return Result.err({
        code: 'ERR_INVALID_DATE_RANGE'
      })
    }

    const result = await this.electionRepository.create({
      ...payload,
      id: ulid(),
      status: isActive ? 'ONGOING' : 'UPCOMING'
    })

    if (result.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'ELECTION_CREATED',
      data: {
        id: result.value.id
      }
    })
  }
}
