import { z } from 'zod'
import { type types, schema } from '@blockchain-voting-system/api'

export namespace Request {
  export const body =
    schema.schemas.Api_Authentication_SignIn_VotersCode_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/auth/sign-in/voter-code'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'SIGN_IN_SUCCESSFUL' }>
  export type Error = Exclude<Response, Success>
}
