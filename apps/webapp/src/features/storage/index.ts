import { env } from '@/lib/env'

export namespace Storage {
  export const resolve = (id: string) => {
    return `${env.VITE_BACKEND_URL}/storage/${id}`
  }
}
