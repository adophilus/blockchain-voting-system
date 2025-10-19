import openapiFetchCreateClient from 'openapi-fetch'
import { default as openapiFetchCreateReactQueryClient } from 'openapi-react-query'
import type { paths } from './types'

export const createClient = (baseUrl: string) =>
  openapiFetchCreateClient<paths>({ baseUrl })

type Client = ReturnType<typeof createClient>
export const createReactQueryClient = (client: Client) =>
  openapiFetchCreateReactQueryClient(client)
