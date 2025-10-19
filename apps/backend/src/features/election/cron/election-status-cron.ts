import type { CronJob } from '@/features/cron/service'
import { isAfter, isBefore } from 'date-fns'
import type { ElectionRepository } from '../repository/interface'
import type { Logger } from '@/features/logger'

export class ElectionStatusCronJob implements CronJob {
  constructor(
    private electionRepository: ElectionRepository,
    private logger: Logger
  ) {}

  public getName(): string {
    return 'ElectionStatusCronJob'
  }

  async run() {
    // Get all elections
    const electionsResult = await this.electionRepository.listElections({
      page: 1,
      per_page: 1000 // Adjust as needed
    })

    if (electionsResult.isErr) {
      this.logger.error(
        'Error fetching elections for cron job:',
        electionsResult.error
      )
      return
    }

    const now = new Date()

    for (const election of electionsResult.value.data) {
      const startDate = new Date(election.start_timestamp)
      const endDate = new Date(election.end_timestamp)

      // Update status based on current time
      let newStatus: 'UPCOMING' | 'ONGOING' | 'COMPLETED' = election.status

      if (isBefore(now, startDate)) {
        newStatus = 'UPCOMING'
      } else if (isAfter(now, endDate)) {
        newStatus = 'COMPLETED'
      } else {
        newStatus = 'ONGOING'
      }

      // Only update if status changed
      if (newStatus !== election.status) {
        const updateResult = await this.electionRepository.updateStatus(
          election.id,
          newStatus
        )
        if (updateResult.isOk) {
          this.logger.info(
            `Election ${election.id} status changed from ${election.status} to ${newStatus}`
          )
        } else {
          this.logger.error(
            `Failed to update election ${election.id} status to ${newStatus}:`,
            updateResult.error
          )
        }
      }
    }
  }
}
