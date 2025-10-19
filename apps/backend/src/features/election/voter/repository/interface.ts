import type { Result } from 'true-myth'
import type { Voter } from '@/types'

export type VoterRepositoryError =
  | 'ERR_UNEXPECTED'
  | 'ERR_DUPLICATE_ENTRY'
  | 'ERR_VOTER_NOT_FOUND'

export abstract class VoterRepository {
  public abstract createMany(
    payload: Voter.Insertable[]
  ): Promise<Result<Voter.Selectable[], VoterRepositoryError>>
  public abstract getByElectionId(
    electionId: string
  ): Promise<Result<Voter.Selectable[], VoterRepositoryError>>
  public abstract getByCode(
    electionId: string,
    code: string
  ): Promise<Result<Voter.Selectable | null, VoterRepositoryError>>
  public abstract markAsVoted(
    id: string
  ): Promise<Result<Voter.Selectable, VoterRepositoryError>>
}
