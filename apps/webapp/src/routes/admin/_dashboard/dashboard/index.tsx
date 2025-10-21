import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
// import { DashboardOverview } from '@/features/dashboard/overview'

export const Route = createFileRoute('/admin/_dashboard/dashboard/')({
  component: DashboardOverviewPage,
  beforeLoad: () => {
    throw redirect({
      to: "/admin/dashboard/elections"
    })
  }
})

function DashboardOverviewPage() {
  // return <DashboardOverview />
  return null
}
