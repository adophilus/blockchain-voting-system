import { z } from 'zod'
import { type types, schema as apiSchema } from '@vs/api'

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Election_ById_Position_Create_Request_Body
  export type Body = z.infer<typeof body>

  export const params = z.object({
    electionId: z.string()
  })
  export type Params = z.infer<typeof params>
}

export namespace Response {
  type Endpoint = '/elections/{electionId}/positions'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'POSITIONS_LIST' }>
  export type Error = Exclude<Response, Success>
}
