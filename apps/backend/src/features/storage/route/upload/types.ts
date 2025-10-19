import { z } from 'zod'
import type { types } from '@blockchain-voting-system/api'

export namespace Request {
  export const body = z.object({
    files: z.array(z.custom<File>())
  })
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/storage/upload'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'MEDIA_UPLOADED' }>
  export type Error = Exclude<Response, Success>
}
