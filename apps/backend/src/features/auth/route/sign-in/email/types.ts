import { schema as apiSchema, type types } from '@vs/api'
import type { z } from 'zod'

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Authentication_SignIn_Email_Request_Body

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/auth/sign-in/email'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'SIGN_IN_SUCCESSFUL' }>
  export type Error = Exclude<Response, Success>
}
