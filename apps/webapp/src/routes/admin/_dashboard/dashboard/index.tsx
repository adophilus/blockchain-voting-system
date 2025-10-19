import { createFileRoute } from '@tanstack/react-router'
import { DashboardOverview } from '@/features/dashboard/overview'

export const Route = createFileRoute('/admin/_dashboard/dashboard/')({
  component: DashboardOverviewPage
})

function DashboardOverviewPage() {
  return <DashboardOverview />
}
