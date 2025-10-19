import { createFileRoute, redirect } from '@tanstack/react-router'
import { ElectionVotingPage } from '@/features/election/voting/ElectionVotingPage'
import Backend from '@/features/backend'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Auth from '@/features/auth'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/election/$id/vote/')({
  beforeLoad: ({ params }) => {
    const authState = Auth.Store.store.state
    if (authState.status !== 'authenticated') {
      throw redirect({
        to: '/election/$id',
        params
      })
    }
    const user = authState.user
    if (user.role !== 'voter' || user.election_id !== params.id) {
      Auth.Store.logout()
      throw redirect({
        to: '/election/$id',
        params
      })
    }
  },
  component: Component
})

function ElectionVotingPageComponent() {
  const { id: electionId } = Route.useParams()

  const { data: electionData, error } = Backend.Client.$api.useSuspenseQuery(
    'get',
    '/elections/{electionId}',
    {
      params: {
        path: { electionId }
      }
    }
  )

  if (error || !electionData?.data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Election Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              The requested election could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <ElectionVotingPage
      election={electionData.data.election}
      positions={electionData.data.positions}
      electionId={electionId}
    />
  )
}

function Component() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
              <Card className="w-full max-w-md text-center">
                <CardHeader>
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <CardTitle>Error Loading Election</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    There was an error loading the election: {error.message}
                  </p>
                  <Button
                    onClick={() => resetErrorBoundary()}
                    className="mt-4 w-full"
                  >
                    Try again
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        >
          <ElectionVotingPageComponent />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
