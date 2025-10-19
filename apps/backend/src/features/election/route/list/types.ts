import type { z } from 'zod'
import type { types } from '@blockchain-voting-system/api'
import { Pagination } from '@/features/pagination'

export namespace Request {
  export const query = Pagination.schema
  export type Query = z.infer<typeof query>
}

export namespace Response {
  type Endpoint = '/elections'

  type Method = 'get'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ELECTIONS_LIST' }>
  export type Error = Exclude<Response, Success>
}
