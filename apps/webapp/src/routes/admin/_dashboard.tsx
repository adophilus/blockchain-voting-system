import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/features/dashboard/dashboard-layout'
import Auth from '@/features/auth'

export const Route = createFileRoute('/admin/_dashboard')({
  beforeLoad: () => {
    const authState = Auth.Store.store.state
    if (authState.status !== 'authenticated') {
      throw redirect({
        to: '/admin/login'
      })
    }

    if (authState.user.role !== 'admin') {
      throw redirect({
        to: '/'
      })
    }
  },
  component: DashboardLayoutPage
})

function DashboardLayoutPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
