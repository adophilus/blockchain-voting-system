import type { Result } from 'true-myth'
import type { Position } from '@/types'

export type PositionRepositoryError = 'ERR_UNEXPECTED'

export abstract class PositionRepository {
  public abstract create(
    payload: Position.Insertable[]
  ): Promise<Result<Position.Selectable[], PositionRepositoryError>>
  public abstract getById(
    id: string
  ): Promise<Result<Position.Selectable | null, PositionRepositoryError>>
  public abstract getByElectionId(
    electionId: string
  ): Promise<Result<Position.Selectable[], PositionRepositoryError>>
}
