import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger as honoLogger } from 'hono/logger'
import { StatusCodes } from '@/features/http'
import type { Logger } from '@/features/logger'
import AuthRouter from '@/features/auth/route'
import type App from './interface'
import ElectionRouter from '@/features/election/route'
import StorageRouter from '@/features/storage/route'
import { serveStatic } from '@hono/node-server/serve-static'

class HonoApp implements App {
  constructor(private logger: Logger) {}

  create() {
    const ApiRouter = new Hono()
      .route('/auth', AuthRouter)
      .route('/elections', ElectionRouter)
      .route('/storage', StorageRouter)

    return (
      new Hono()
        .use(compress())
        .use(cors())
        .use(honoLogger())
        .route('/api', ApiRouter)
        .get('/', (c) => c.json({ message: 'Welcome to the API' }))
        // .use('*', serveStatic({ root: './storage/dist' }))
        .notFound((c) => c.json({ error: 'NOT_FOUND' }, StatusCodes.NOT_FOUND))
        .onError((err, c) => {
          this.logger.error('An unexpected error occurred:', err)
          return c.json(
            { code: 'ERR_UNEXPECTED' },
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        })
    )
  }
}

export default HonoApp
