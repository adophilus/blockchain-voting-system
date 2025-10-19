'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Users,
  Vote,
  UserPlus,
  Settings,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Copy,
  BarChart3,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { Election, Position, Candidate, Voter } from '@blockchain-voting-system/backend/types'

interface AdminDashboardProps {
  user: {
    id: string
    email: string
    name: string
    role: string
    is_super_admin: boolean
    created_at: string
  }
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // In a real app, you would call your auth service to logout
    navigate({ to: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vote className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {user.name || user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate({ to: '/' })}>
                Back to Home
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Elections
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                8 active, 4 completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Positions
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                Across all elections
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Candidates
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">
                Running for positions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Generated Voter Codes
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground">
                Ready for distribution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="voters">Voter Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="elections">
            <ElectionsTab />
          </TabsContent>

          <TabsContent value="positions">
            <PositionsTab />
          </TabsContent>

          <TabsContent value="candidates">
            <CandidatesTab />
          </TabsContent>

          <TabsContent value="voters">
            <VoterCodesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DashboardTab() {
  // Mock data for recent activity
  const recentElections = [
    {
      id: 1,
      title: 'Student Council Election 2024',
      status: 'active',
      startDate: '2024-12-01',
      endDate: '2024-12-15'
    },
    {
      id: 2,
      title: 'Department Representative Election',
      status: 'completed',
      startDate: '2024-11-01',
      endDate: '2024-11-15'
    },
    {
      id: 3,
      title: 'Faculty Board Election',
      status: 'upcoming',
      startDate: '2025-01-10',
      endDate: '2025-01-25'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'New candidate registered',
      target: 'John Smith for President',
      time: '2 hours ago'
    },
    {
      id: 2,
      action: 'Voter codes generated',
      target: '50 codes for Council Election',
      time: '5 hours ago'
    },
    {
      id: 3,
      action: 'Election created',
      target: 'Faculty Board Election',
      time: '1 day ago'
    },
    {
      id: 4,
      action: 'Position updated',
      target: 'Vice President requirements',
      time: '2 days ago'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Elections */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Elections</CardTitle>
              <CardDescription>
                Overview of your most recent elections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentElections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div>
                      <h3 className="font-medium">{election.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {election.startDate} to {election.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          election.status === 'active'
                            ? 'default'
                            : election.status === 'completed'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {election.status.charAt(0).toUpperCase() +
                          election.status.slice(1)}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.target}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1 items-center justify-center"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">New Election</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1 items-center justify-center"
              >
                <UserPlus className="h-5 w-5" />
                <span className="text-xs">Voter Codes</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1 items-center justify-center"
              >
                <Users className="h-5 w-5" />
                <span className="text-xs">Candidates</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1 items-center justify-center"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Reports</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Election Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Election Statistics</CardTitle>
          <CardDescription>
            Overview of participation and voting trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">
                Average Participation
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">1,842</p>
              <p className="text-sm text-muted-foreground">Total Votes Cast</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">4.2%</p>
              <p className="text-sm text-muted-foreground">Invalid Ballots</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ElectionsTab() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [elections, setElections] = useState<Election.Selectable[]>([
    {
      id: '1',
      title: 'Student Council Election 2024',
      description: 'Annual student council election',
      start_timestamp: '2024-12-01T09:00:00Z',
      end_timestamp: '2024-12-15T17:00:00Z',
      status: 'ONGOING',
      created_at: '2024-11-01T10:00:00Z',
      updated_at: null
    },
    {
      id: '2',
      title: 'Department Representative Election',
      description: 'Elect department representatives',
      start_timestamp: '2024-11-01T09:00:00Z',
      end_timestamp: '2024-11-15T17:00:00Z',
      status: 'ONGOING',
      created_at: '2024-10-01T10:00:00Z',
      updated_at: null
    }
  ])

  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit this to your API
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Elections Management</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Election
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Election</CardTitle>
            <CardDescription>
              Set up a new election for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateElection} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="election-title">Election Title</Label>
                  <Input
                    id="election-title"
                    placeholder="e.g., Student Council Election 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="election-description">Description</Label>
                  <Input
                    id="election-description"
                    placeholder="Brief description of the election"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="datetime-local" required />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Election</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {elections.map((election) => (
          <Card key={election.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{election.title}</CardTitle>
                  <CardDescription>{election.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      election.status === 'ONGOING' ? 'default' : 'secondary'
                    }
                  >
                    {election.status === 'ONGOING' ? 'Active' : 'Completed'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-muted-foreground">
                    {new Date(election.start_timestamp).toLocaleDateString()}{' '}
                    {new Date(election.start_timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-muted-foreground">
                    {new Date(election.end_timestamp).toLocaleDateString()}{' '}
                    {new Date(election.end_timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Positions</p>
                  <p className="text-muted-foreground">5 positions</p>
                </div>
                <div>
                  <p className="font-medium">Registered Voters</p>
                  <p className="text-muted-foreground">89 students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PositionsTab() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [positions, setPositions] = useState<Position.Selectable[]>([
    {
      id: '1',
      election_id: '1',
      title: 'President',
      description: 'Lead the student council and represent student interests',
      created_at: '2024-11-01T10:00:00Z',
      updated_at: null
    },
    {
      id: '2',
      election_id: '1',
      title: 'Vice President',
      description: 'Assist the president and oversee committees',
      created_at: '2024-11-01T10:00:00Z',
      updated_at: null
    }
  ])

  const handleCreatePosition = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit this to your API
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Positions Management</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Position
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Position</CardTitle>
            <CardDescription>Add a position to an election</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePosition} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position-election">Election</Label>
                  <select
                    id="position-election"
                    className="w-full p-2 border rounded-md"
                  >
                    <option>Student Council Election 2024</option>
                    <option>Department Representative Election</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position-title">Position Title</Label>
                  <Input
                    id="position-title"
                    placeholder="e.g., President, Vice President"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="position-description">Description</Label>
                  <Input
                    id="position-description"
                    placeholder="Role description and responsibilities"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Position</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {positions.map((position) => (
          <Card key={position.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{position.title}</CardTitle>
                  <CardDescription>
                    Student Council Election 2024
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">3 Candidates</Badge>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {position.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CandidatesTab() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [candidates, setCandidates] = useState<Candidate.Selectable[]>([
    {
      id: '1',
      position_id: '1',
      name: 'John Smith',
      bio: 'Third-year Computer Science student with experience in student leadership and community organizing.',
      image: null,
      created_at: '2024-11-05T10:00:00Z',
      updated_at: null
    },
    {
      id: '2',
      position_id: '1',
      name: 'Sarah Johnson',
      bio: 'Second-year Business Administration student passionate about improving campus life and student services.',
      image: null,
      created_at: '2024-11-06T10:00:00Z',
      updated_at: null
    }
  ])

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit this to your API
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Candidates Management</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Candidate</CardTitle>
            <CardDescription>
              Register a candidate for a position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCandidate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-position">Position</Label>
                  <select
                    id="candidate-position"
                    className="w-full p-2 border rounded-md"
                  >
                    <option>President - Student Council Election 2024</option>
                    <option>
                      Vice President - Student Council Election 2024
                    </option>
                    <option>Secretary - Student Council Election 2024</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-name">Candidate Name</Label>
                  <Input
                    id="candidate-name"
                    placeholder="Full name of the candidate"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="candidate-bio">Biography</Label>
                  <textarea
                    id="candidate-bio"
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Brief biography and qualifications"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-image">Profile Image URL</Label>
                  <Input
                    id="candidate-image"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Candidate</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>
                      President - Student Council Election 2024
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{candidate.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function VoterCodesTab() {
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [voters, setVoters] = useState<Voter.Selectable[]>([
    {
      id: '1',
      election_id: '1',
      code: 'VT-2024-XYZ12',
      status: 'NOT_VOTED',
      voted_at: null,
      created_at: '2024-11-10T10:00:00Z',
      updated_at: null
    },
    {
      id: '2',
      election_id: '1',
      code: 'VT-2024-ABC34',
      status: 'VOTED',
      voted_at: '2024-12-05T14:30:00Z',
      created_at: '2024-11-10T10:00:00Z',
      updated_at: '2024-12-05T14:30:00Z'
    }
  ])

  const generateVoterCodes = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call your API to generate codes
    const mockCodes = [
      'VT-2024-XYZ12',
      'VT-2024-ABC34',
      'VT-2024-DEF56',
      'VT-2024-GHI78',
      'VT-2024-JKL90'
    ]
    setGeneratedCodes(mockCodes)
    setShowGenerateForm(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Voter Codes Management</h2>
        <Button onClick={() => setShowGenerateForm(!showGenerateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Voter Codes
        </Button>
      </div>

      {showGenerateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Voter Codes</CardTitle>
            <CardDescription>
              Create unique voter codes for an election
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateVoterCodes} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="voter-election">Election</Label>
                  <select
                    id="voter-election"
                    className="w-full p-2 border rounded-md"
                  >
                    <option>Student Council Election 2024</option>
                    <option>Department Representative Election</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-of-voters">Number of Voters</Label>
                  <Input
                    id="number-of-voters"
                    type="number"
                    placeholder="e.g., 100"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Generate Codes</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGenerateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {generatedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Voter Codes</CardTitle>
            <CardDescription>
              Distribute these codes to eligible voters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedCodes.map((code, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded dark:bg-gray-800"
                >
                  <span className="font-mono text-sm">{code}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(code)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => copyToClipboard(generatedCodes.join('\n'))}
              >
                Copy All Codes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const blob = new Blob([generatedCodes.join('\n')], {
                    type: 'text/plain'
                  })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'voter-codes.txt'
                  a.click()
                }}
              >
                Download as File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Student Council Election 2024 - Voter Codes</CardTitle>
            <CardDescription>89 codes generated, 23 used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="font-medium">Voter Code</span>
                <span className="font-medium">Status</span>
              </div>
              {voters.map((voter) => (
                <div
                  key={voter.id}
                  className="flex items-center justify-between py-2"
                >
                  <span className="font-mono text-sm">{voter.code}</span>
                  <Badge
                    variant={voter.status === 'VOTED' ? 'default' : 'secondary'}
                  >
                    {voter.status === 'VOTED' ? 'Used' : 'Not Used'}
                  </Badge>
                </div>
              ))}
              <div className="text-center py-4">
                <Button variant="outline" size="sm">
                  Load More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
