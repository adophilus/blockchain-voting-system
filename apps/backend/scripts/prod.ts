import { bootstrap } from '@vs/backend'
import { serve } from '@hono/node-server'

const { app, logger, config, cronService } = await bootstrap()

// Start cron service
cronService.start()

serve(
  {
    fetch: app.create().fetch,
    port: config.server.port
  },
  (info) => {
    logger.info(`Server is running on http://${info.address}:${info.port}`)
  }
)
