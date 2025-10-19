import type { types } from '@blockchain-voting-system/api'
import { Storage } from '@/features/storage'
import { ElectionHeader } from '@/features/election/voting/ElectionHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { User } from 'lucide-react'

type ElectionResults =
  types.paths['/elections/{electionId}/results']['get']['responses']['200']['content']['application/json']['data']

interface ElectionResultsPageProps {
  results: ElectionResults
}

export function ElectionResultsPage({ results }: ElectionResultsPageProps) {
  const { election, total_votes, total_voters, positions } = results

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <ElectionHeader election={election} />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Voters
              </p>
              <p className="text-3xl font-bold">{total_voters}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Votes Cast
              </p>
              <p className="text-3xl font-bold">{total_votes}</p>
            </div>
          </CardContent>
        </Card>

        {positions.map((position) => (
          <Card key={position.id} className="mb-6">
            <CardHeader>
              <CardTitle>{position.title}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Votes for this position: {position.total_votes}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {position.candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate) => (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {candidate.image ? (
                            <img
                              src={Storage.resolve(candidate.image.id)}
                              alt={candidate.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {candidate.votes} votes
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {candidate.percentage.toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={candidate.percentage} />
                  </div>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
