import type { types } from '@vs/api'

export namespace Request {}

export namespace Response {
  type Endpoint = '/auth/profile'
  type Method = 'get'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'USER_PROFILE' }>
  export type Error = Exclude<Response, Success>
}
