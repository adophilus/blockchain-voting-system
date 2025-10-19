import type { Result, Unit } from 'true-myth'
import type { Election } from '@/types'

export type ElectionRepositoryError = 'ERR_UNEXPECTED'

export abstract class ElectionRepository {
  public abstract listElections(options: {
    page: number
    per_page: number
  }): Promise<
    Result<
      {
        data: Election.Selectable[]
        total: number
      },
      ElectionRepositoryError
    >
  >

  public abstract create(
    payload: Election.Insertable
  ): Promise<Result<Election.Selectable, ElectionRepositoryError>>

  public abstract getById(
    id: string
  ): Promise<Result<Election.Selectable | null, ElectionRepositoryError>>

  public abstract countAll(): Promise<Result<number, ElectionRepositoryError>>
  public abstract countByStatus(
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  ): Promise<Result<number, ElectionRepositoryError>>

  public abstract updateStatus(
    id: string,
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  ): Promise<Result<Election.Selectable, ElectionRepositoryError>>

  public abstract updateStatusAndEndDate(
    id: string,
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED',
    endDate: string
  ): Promise<Result<Election.Selectable, ElectionRepositoryError>>

  public abstract delete(
    id: string
  ): Promise<Result<Unit, ElectionRepositoryError>>
}
