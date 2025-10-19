import type { Result } from 'true-myth'
import type { Candidate } from '@/types'

export type CandidateRepositoryError = 'ERR_UNEXPECTED'

export abstract class CandidateRepository {
  public abstract create(
    candidates: Candidate.Insertable[]
  ): Promise<Result<Candidate.Selectable[], CandidateRepositoryError>>
  public abstract getById(
    id: string
  ): Promise<Result<Candidate.Selectable | null, CandidateRepositoryError>>
  public abstract getByPositionId(
    positionId: string
  ): Promise<Result<Candidate.Selectable[], CandidateRepositoryError>>
  public abstract getByPositionIds(
    positionIds: string[]
  ): Promise<Result<Candidate.Selectable[], CandidateRepositoryError>>
}
