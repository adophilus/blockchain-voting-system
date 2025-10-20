import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: '',
  client: {},
  server: {
    NODE_ENV: z.enum(['production', 'staging', 'development', 'test']),
    PORT: z.coerce.number().min(0).max(65535),
    DATABASE_URL: z.string(),
    BACKEND_URL: z.string(),
    AUTH_TOKEN_SECRET: z.string().min(32),
  },
  runtimeEnv: process.env
})
