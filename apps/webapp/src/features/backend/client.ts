import { env } from '@/lib/env'
import { createClient, createReactQueryClient } from '@vs/api'

namespace BackendClient {
  export const client = createClient(env.VITE_BACKEND_URL)
  export const $api = createReactQueryClient(client)
}

export default BackendClient
