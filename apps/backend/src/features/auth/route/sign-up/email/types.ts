import { schema as apiSchema, type types } from '@blockchain-voting-system/api'
import type { z } from 'zod'

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Authentication_SignUp_Email_Request_Body

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/auth/sign-up/email'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'SIGN_UP_SUCCESSFUL' }>
  export type Error = Exclude<Response, Success>
}
