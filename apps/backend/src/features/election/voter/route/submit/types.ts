import { z } from 'zod'
import type { types } from '@blockchain-voting-system/api'

export namespace Request {
  export const body = z.object({
    election_id: z.string(),
    voter_code: z.string(),
    votes: z.array(
      z.object({
        position_id: z.string(),
        candidate_id: z.string()
      })
    )
  })

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/elections/{electionId}/voters/submit'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'VOTE_SUBMITTED' }>
  export type Error = Exclude<Response, Success>
}
