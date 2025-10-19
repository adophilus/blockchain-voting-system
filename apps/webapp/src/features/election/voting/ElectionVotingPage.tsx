import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Vote, AlertCircle, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import type { Election, Position } from '@blockchain-voting-system/backend/types'
import { ElectionVotingBallot } from './ElectionVotingBallot'
import { ElectionVotingSuccess } from './ElectionVotingSuccess'
import { useState } from 'react'
import Auth from '@/features/auth'
import { ElectionHeader } from './ElectionHeader'

interface ElectionVotingPageProps {
  election: Election.Selectable
  positions: Position.Selectable[]
  electionId: string
}

export function ElectionVotingPage({
  election,
  positions,
  electionId
}: ElectionVotingPageProps) {
  const [voted, setVoted] = useState(false)

  const authState = Auth.Store.store.state
  const voterCode =
    authState.status === 'authenticated' && authState.user.role === 'voter'
      ? authState.user.code
      : ''

  const handleVoteSubmitted = () => {
    setVoted(true)
  }

  if (election.status !== 'ONGOING') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Election Not Active</CardTitle>
            <CardDescription>
              This election is not currently accepting votes.
              {election.status === 'UPCOMING' && ' It will start on '}
              {election.status === 'COMPLETED' && ' It ended on '}
              {election.status !== 'ONGOING' && (
                <span className="font-medium">
                  {format(
                    new Date(
                      election.status === 'UPCOMING'
                        ? election.start_timestamp
                        : election.end_timestamp
                    ),
                    'PPP'
                  )}
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <ElectionHeader election={election} />

        {voted ? (
          <ElectionVotingSuccess election={election} electionId={electionId} />
        ) : (
          <ElectionVotingBallot
            election={election}
            positions={positions}
            voterCode={voterCode}
            electionId={electionId}
            onVoteSubmitted={handleVoteSubmitted}
          />
        )}
      </div>
    </div>
  )
}
