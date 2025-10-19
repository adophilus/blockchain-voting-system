import { z } from 'zod'
import { type types, schema as apiSchema } from '@blockchain-voting-system/api'

export namespace Request {
  export const body = apiSchema.schemas.Api_Election_Create_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/elections'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ELECTION_CREATED' }>
  export type Error = Exclude<Response, Success>
}
