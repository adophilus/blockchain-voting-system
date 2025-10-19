import { createClient, type Middleware } from '@blockchain-voting-system/api'
import { config } from '@/features/config'
import { app } from './bootstrap'

export const client = createClient(config.server.url)
export type Client = typeof client

export const bodySerializer = (body: any) => {
  const fd = new FormData()
  for (const name in body) {
    const val = body[name]
    if (Array.isArray(val)) {
      for (const value of val) {
        if (value instanceof File) {
          fd.append(name, value)
        } else {
          if (value !== null) {
            fd.append(name, JSON.stringify(value))
          } else {
            fd.append(name, value)
          }
        }
      }
    } else {
      fd.append(name, val)
    }
  }
  return fd
}

let authTokens: { access_token: string; refresh_token: string } | null = null

export const setTokens = (tokens: {
  access_token: string
  refresh_token: string
}) => {
  authTokens = tokens
}

const appMiddleware: Middleware = {
  onRequest: ({ request }) => {
    if (authTokens) {
      request.headers.set('Authorization', `Bearer ${authTokens.access_token}`)
    }
    return app.request(request)
  }
}

client.use(appMiddleware)
