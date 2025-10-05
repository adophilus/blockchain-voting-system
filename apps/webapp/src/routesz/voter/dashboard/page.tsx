"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, UserCheck, Vote, BarChart3, AlertCircle } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function VoterDashboard() {
  // In a real application, this would come from the backend
  // For now, we'll simulate the voter verification status
  const [voterStatus] = useState<"pending" | "approved" | "rejected">("approved")
  
  const [elections] = useState([
    {
      id: "1",
      title: "2024 Presidential Election",
      description: "National presidential election to elect the next President",
      status: "Active",
      voterCount: 1245,
      candidateCount: 3,
      endDate: "2024-02-25T18:00",
      hasVoted: true,
    },
    {
      id: "2",
      title: "Lagos State Gubernatorial Election",
      description: "Election for the Governor of Lagos State",
      status: "Active",
      voterCount: 0,
      candidateCount: 0,
      endDate: "2024-03-15T18:00",
      hasVoted: false,
    },
  ])

  if (voterStatus === "pending") {
    return (
      <ProtectedRoute requiredRole="voter">
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Dashboard</h1>
              <p className="text-gray-600">Your voting account is pending verification</p>
            </div>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Account Pending Verification</h2>
                <p className="text-gray-600 text-center mb-4">
                  Your voter registration is currently being reviewed by the election administrator.
                </p>
                <p className="text-gray-600 text-center mb-6">
                  You will receive a notification once your account has been verified.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                  <h3 className="font-medium text-yellow-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                    <li>Your registration details are being verified</li>
                    <li>This process typically takes 1-2 business days</li>
                    <li>You'll receive an email notification when approved</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }
  
  if (voterStatus === "rejected") {
    return (
      <ProtectedRoute requiredRole="voter">
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Dashboard</h1>
              <p className="text-gray-600">Your voter registration has been rejected</p>
            </div>
            
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Registration Rejected</h2>
                <p className="text-gray-600 text-center mb-4">
                  Unfortunately, your voter registration has been rejected by the election administrator.
                </p>
                <p className="text-gray-600 text-center mb-6">
                  Please contact the election administrator for more information or to appeal this decision.
                </p>
                <Button>Contact Administrator</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="voter">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voter Dashboard</h1>
            <p className="text-gray-600">Participate in Active Elections</p>
          </div>

          {/* Active Elections */}
          <Card>
            <CardHeader>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>Participate in ongoing elections</CardDescription>
            </CardHeader>
            <CardContent>
              {elections.filter(e => e.status === "Active").length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active elections</h3>
                  <p className="text-gray-600">There are currently no active elections you can participate in</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {elections.filter(e => e.status === "Active").map((election) => (
                    <div key={election.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{election.title}</h3>
                            <Badge variant={election.hasVoted ? "secondary" : "default"}>
                              {election.hasVoted ? "Voted" : "Open"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{election.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Ends {new Date(election.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {election.hasVoted ? (
                            <Link href={`/voter/results?election=${election.id}`}>
                              <Button variant="outline" size="sm">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Results
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/voting?election=${election.id}`}>
                              <Button size="sm">
                                <Vote className="h-4 w-4 mr-2" />
                                Vote Now
                              </Button>
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

          {/* Upcoming Elections */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Elections</CardTitle>
              <CardDescription>View elections scheduled for the future</CardDescription>
            </CardHeader>
            <CardContent>
              {elections.filter(e => e.status === "Draft").length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No upcoming elections at this time
                </div>
              ) : (
                <div className="space-y-4">
                  {elections.filter(e => e.status === "Draft").map((election) => (
                    <div key={election.id} className="border rounded-lg p-4 opacity-75">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{election.title}</h3>
                          <p className="text-gray-600 mb-2">{election.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Scheduled for {new Date(election.endDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}