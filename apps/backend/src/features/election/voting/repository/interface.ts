import type { Result } from 'true-myth'
import type { Vote } from '@/types'

export type VoteRepositoryError = 'ERR_UNEXPECTED'

export abstract class VoteRepository {
  public abstract createMany(
    payload: Vote.Insertable[]
  ): Promise<Result<Vote.Selectable[], VoteRepositoryError>>
  public abstract countByElectionId(
    electionId: string
  ): Promise<Result<number, VoteRepositoryError>>
  public abstract countByCandidateId(
    candidateId: string
  ): Promise<Result<number, VoteRepositoryError>>
  public abstract findByElectionId(
    electionId: string
  ): Promise<Result<Vote.Selectable[], VoteRepositoryError>>
}
