import { env } from '@/lib/env'
import { createClient, createReactQueryClient } from '@blockchain-voting-system/api'

namespace BackendClient {
  export const client = createClient(env.VITE_BACKEND_URL)
  // export const $api = createReactQueryClient(client)
}

export default BackendClient
