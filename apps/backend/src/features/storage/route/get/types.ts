import { z } from 'zod'

export namespace Request {
  export const params = z.object({
    id: z.string()
  })
  export type Params = z.infer<typeof params>
}
