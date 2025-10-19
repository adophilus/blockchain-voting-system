import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { CandidateRepository } from '@/features/election/candidate/repository'
import { ulid } from 'ulidx'

export class CreateCandidateUseCase {
  constructor(private candidateRepository: CandidateRepository) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const candidatesToInsert = payload.candidates.map((candidate) => ({
      id: ulid(),
      ...candidate
    }))

    const result = await this.candidateRepository.create(candidatesToInsert)

    if (result.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'CANDIDATES_LIST',
      data: result.value
    })
  }
}
