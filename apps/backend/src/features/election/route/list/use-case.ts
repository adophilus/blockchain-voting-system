import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ElectionRepository } from '@/features/election/repository/interface'
import { Pagination } from '@/features/pagination'

export class ListElectionsUseCase {
  constructor(
    private electionRepository: ElectionRepository
  ) {}

  async execute(
    query: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.electionRepository.listElections({
      page: query.page,
      per_page: query.per_page
    })

    if (result.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const { data, total } = result.value

    return Result.ok({
      code: 'ELECTIONS_LIST',
      data: Pagination.paginate(data, {
        page: query.page,
        per_page: query.per_page,
        total
      })
    })
  }
}