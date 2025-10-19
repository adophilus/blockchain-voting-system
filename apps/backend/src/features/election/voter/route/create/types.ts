import { z } from 'zod'
import { type types, schema as apiSchema } from '@vs/api'

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Election_ById_Voter_Create_Request_Body
  export type Body = z.infer<typeof body>

  export const params = z.object({
    electionId: z.string()
  })

  export type Params = z.infer<typeof params>
}

export namespace Response {
  type Endpoint = '/elections/{electionId}/voters'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'VOTERS_GENERATED' }>
  export type Error = Exclude<Response, Success>
}
