import { Badge } from "@/components/ui/badge"
import { Vote, Calendar, Clock } from "lucide-react"
import { format } from 'date-fns'
import type { Election } from '@vs/backend/types'

interface ElectionHeaderProps {
  election: Election.Selectable
}

export function ElectionHeader({ election }: ElectionHeaderProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'secondary'
      case 'ONGOING':
        return 'default'
      case 'COMPLETED':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-blue-600 rounded-full">
          <Vote className="h-8 w-8 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{election.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{election.description}</p>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(election.start_timestamp), 'PPP')} - {format(new Date(election.end_timestamp), 'PPP')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>
            {format(new Date(election.start_timestamp), 'p')} - {format(new Date(election.end_timestamp), 'p')}
          </span>
        </div>
        <Badge variant={getStatusVariant(election.status)}>
          {election.status}
        </Badge>
      </div>
    </div>
  )
}
