import { createFileRoute } from '@tanstack/react-router'
import { CreateElectionForm } from '@/features/dashboard/create-election/CreateElectionForm'

export const Route = createFileRoute('/admin/_dashboard/dashboard/create-election')({
  component: CreateElectionPage
})

function CreateElectionPage() {
  return <CreateElectionForm />
}