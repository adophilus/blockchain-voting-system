import { createFileRoute } from '@tanstack/react-router'
import { ElectionResultsPage } from '@/features/election/results/ElectionResultsPage'
import Backend from '@/features/backend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/election/$id/results')({
  component: ElectionResultsPageRoute
})

function ElectionResultsPageRoute() {
  const { id: electionId } = Route.useParams()

  const {
    data: resultsData,
    isLoading,
    error
  } = Backend.Client.$api.useSuspenseQuery(
    'get',
    '/elections/{electionId}/results',
    {
      params: {
        path: { electionId }
      }
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    )
  }

  if (error || !resultsData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <BarChart3 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Results Not Available</CardTitle>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Unable to load election results at this time.
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return <ElectionResultsPage results={resultsData.data} />
}
