import { createFileRoute } from '@tanstack/react-router'
import { ElectionDetailsPage } from '@/features/dashboard/elections/ElectionDetailsPage'

export const Route = createFileRoute('/admin/_dashboard/dashboard/elections/$electionId/details')({
  component: ElectionDetailsRouteComponent
})

function ElectionDetailsRouteComponent() {
  const { electionId } = Route.useParams()
  return <ElectionDetailsPage electionId={electionId} />
}
