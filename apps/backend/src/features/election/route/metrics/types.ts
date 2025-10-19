import type { types } from '@vs/api'

export namespace Request {
  // No path or query parameters for platform-wide metrics
}

export namespace Response {
  type Endpoint = '/elections/metrics'
  type Method = 'get'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ELECTION_METRICS' }>
  export type Error = Exclude<Response, Success>
}
