import { z } from 'zod'
import type { types } from '@vs/api'

export namespace Request {
  export const params = z.object({
    electionId: z.string()
  })

  export type Params = z.infer<typeof params>
}

export namespace Response {
  type Endpoint = '/elections/{electionId}/voters'
  type Method = 'get'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'VOTERS_LIST' }>
  export type Error = Exclude<Response, Success>
}
