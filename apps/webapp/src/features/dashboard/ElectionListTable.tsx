import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import TablePagination from '@/components/ui/table-pagination'
import { format } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'
import type { types } from '@blockchain-voting-system/api'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Edit,
  Flag,
  Link as LinkIcon,
  Eye,
  TrashIcon,
  BarChart
} from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import Backend from '@/features/backend'
import { useQueryClient } from '@tanstack/react-query'

interface ElectionListTableProps {
  elections: types.components['schemas']['Api.Election.Election'][]
  meta: types.components['schemas']['Api.Pagination.Meta']
  page: number
  setPage: Dispatch<SetStateAction<number>>
  perPage: number
  setPerPage: Dispatch<SetStateAction<number>>
  totalPages: number
}

export function ElectionListTable({
  elections,
  meta,
  page,
  setPage,
  perPage,
  setPerPage,
  totalPages
}: ElectionListTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const deleteElectionMutation = Backend.Client.$api.useMutation(
    'delete',
    '/elections/{electionId}'
  )

  const handleDeleteElection = async (electionId: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this election? This action cannot be undone.'
      )
    ) {
      return
    }

    let status: 'SUCCESS' | 'ERROR'
    toast.promise(
      deleteElectionMutation.mutateAsync({
        params: { path: { electionId } }
      }),
      {
        loading: 'Deleting election...',
        error: (err) => {
          status = 'ERROR'
          return err.message || 'Failed to delete election. Please try again.'
        },
        success: () => {
          status = 'SUCCESS'
          // Invalidate queries to refetch the list of elections
          return 'Election deleted successfully!'
        },
        finally: () => {
          // Optional: any cleanup or further actions
          queryClient.invalidateQueries()
        }
      }
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return 'default' // or a custom green variant
      case 'UPCOMING':
        return 'secondary' // or a custom blue variant
      case 'COMPLETED':
        return 'outline' // or a custom gray variant
      default:
        return 'outline'
    }
  }

  const handleCopyLink = (electionId: string) => {
    const voteLink = `${window.location.origin}/election/${electionId}`
    navigator.clipboard.writeText(voteLink)
    toast.success('Voting link copied to clipboard!')
  }

  const handleEndElection = async (electionId: string) => {
    try {
      const response = await Backend.Client.client.request(
        'post',
        '/elections/{electionId}/end',
        {
          params: {
            path: { electionId }
          }
        }
      )

      if (response.data?.code === 'ELECTION_ENDED') {
        toast.success('Election ended successfully!')
        // Refresh the page or update the election status in the list
        window.location.reload()
      } else {
        toast.error('Failed to end election')
      }
    } catch (error) {
      toast.error('Failed to end election')
      console.error('Error ending election:', error)
    }
  }

  const handleViewDetails = (electionId: string) => {
    navigate({
      to: '/admin/dashboard/elections/$electionId/details',
      params: { electionId }
    })
  }

  const handleViewResults = (electionId: string) => {
    window.open(`/election/${electionId}/results`, '_blank')
  }

  return (
    <>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {elections.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No elections found.
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {elections.map((election) => (
              <TableRow key={election.id}>
                <TableCell>{election.title}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(election.status)}>
                    {election.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(election.start_timestamp), 'PPP')}
                </TableCell>
                <TableCell>
                  {format(new Date(election.end_timestamp), 'PPP')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(election.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewResults(election.id)}
                      >
                        <BarChart className="mr-2 h-4 w-4" /> View Results
                      </DropdownMenuItem>
                      {election.status === 'ONGOING' && (
                        <DropdownMenuItem
                          onClick={() => handleEndElection(election.id)}
                        >
                          <Flag className="mr-2 h-4 w-4" /> End
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleCopyLink(election.id)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteElection(election.id)}
                        disabled={deleteElectionMutation.isPending}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <TablePagination
        page={page}
        setPage={setPage}
        rowsPerPage={perPage}
        setRowsPerPage={setPerPage}
        TOTAL_ITEMS={meta?.total || 0}
      />
    </>
  )
}
