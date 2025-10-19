import { z } from 'zod'
import { type types, schema as apiSchema } from '@vs/api'

export namespace Request {
  export const path = z.object({
    electionId: z.string()
  })
  export type Path = z.infer<typeof path>

  export const body =
    apiSchema.schemas.Api_Election_ById_Voter_Create_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/elections/{electionId}/voters'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'VOTERS_GENERATED' }>
  export type Error = Exclude<Response, Success>
}
