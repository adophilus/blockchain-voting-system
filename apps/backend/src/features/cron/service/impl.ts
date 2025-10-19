import { Logger } from '@/features/logger'
import cron from 'node-cron'
import type { CronJob } from './interface'

export class CronService {
  constructor(
    private jobs: CronJob[],
    private logger: Logger
  ) {}

  start() {
    cron.schedule('* * * * *', async () => {
      for (const job of this.jobs) {
        try {
          this.logger.info(`Running cron job: ${job.getName()}`)
          await job.run()
        } catch (error) {
          this.logger.error(`Error running cron job ${job.getName()}:`, error)
        }
      }
    })

    this.logger.info('Cron service started')
  }
}
