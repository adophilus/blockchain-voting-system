import { createFileRoute } from '@tanstack/react-router'
import { ElectionListContainer } from '@/features/dashboard/elections/ElectionListContainer'

export const Route = createFileRoute('/admin/_dashboard/dashboard/elections/')({
  component: DashboardElectionsPage
})

function DashboardElectionsPage() {
  return <ElectionListContainer />
}