"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, UserCheck, Settings, Vote, BarChart3, Plus } from "lucide-react"
import { toast } from "sonner"

export default function Dashboard() {
  const [elections] = useState([
    {
      id: "1",
      title: "2024 Presidential Election",
      description: "National presidential election to elect the next President",
      status: "Active",
      voterCount: 1245,
      candidateCount: 3,
      endDate: "2024-02-25T18:00",
    },
    {
      id: "2",
      title: "Lagos State Gubernatorial Election",
      description: "Election for the Governor of Lagos State",
      status: "Draft",
      voterCount: 0,
      candidateCount: 0,
      endDate: "2024-03-15T18:00",
    },
  ])

  const handleQuickAction = (action: string) => {
    toast.success(`${action} initiated successfully`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Dashboard</h1>
          <p className="text-gray-600">Manage Your Elections</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Elections</p>
                  <p className="text-3xl font-bold text-blue-600">{elections.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Elections</p>
                  <p className="text-3xl font-bold text-green-600">
                    {elections.filter((e) => e.status === "Active").length}
                  </p>
                </div>
                <Vote className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Voters</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {elections.reduce((sum, e) => sum + e.voterCount, 0)}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {elections.reduce((sum, e) => sum + e.candidateCount, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/admin/election-management">
                <Button className="w-full h-20 flex flex-col space-y-2" variant="outline">
                  <Settings className="h-6 w-6" />
                  <span>Manage Elections</span>
                </Button>
              </Link>
              <Link href="/voting">
                <Button className="w-full h-20 flex flex-col space-y-2" variant="outline">
                  <Vote className="h-6 w-6" />
                  <span>Test Voting</span>
                </Button>
              </Link>
              <Link href="/admin/results-dashboard">
                <Button className="w-full h-20 flex flex-col space-y-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Results</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Elections Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Elections Overview</CardTitle>
              <CardDescription>Manage and monitor your elections</CardDescription>
            </div>
            <Link href="/admin/election-management">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Election
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {elections.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No elections yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first election</p>
                <Link href="/admin/election-management">
                  <Button>Create Your First Election</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {elections.map((election) => (
                  <div key={election.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{election.title}</h3>
                          <Badge variant={election.status === "Active" ? "default" : "outline"}>
                            {election.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{election.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <UserCheck className="h-4 w-4" />
                            <span>{election.voterCount} voters</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{election.candidateCount} candidates</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Ends {new Date(election.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/admin/election-management`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                        {election.status === "Active" && (
                          <Link href={`/voting`}>
                            <Button size="sm">Vote</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
