import _ from 'lodash'
import { z } from 'zod'

namespace Pagination {
  export const fields = ['page', 'per_page'] as const
  export const paginatedFields = [...fields, 'total'] as const

  export const defaults = {
    page: 1,
    per_page: 20
  }

  export const schema = z.object({
    page: z
      .string()
      .pipe(z.coerce.number().min(1))
      .optional()
      .default(defaults.page.toString()),
    per_page: z
      .string()
      .pipe(z.coerce.number().max(50).min(1))
      .optional()
      .default(defaults.per_page.toString())
  })

  export type Schema = z.infer<typeof schema>

  export type Options = z.infer<typeof schema>

  export type Paginated<T> = {
    data: T[]
    meta: {
      page: number
      per_page: number
      total: number
    }
  }

  type MetaOptions = Options & {
    total: number
  }

  export const paginate = <T>(
    data: T[],
    options: MetaOptions
  ): Paginated<T> => {
    return {
      data,
      meta: _.pick(options, paginatedFields)
    }
  }

  export type Single<T> = {
    data: T
  }

  export function single<T>(data: T): Single<T> {
    return {
      data
    }
  }
}

export default Pagination
