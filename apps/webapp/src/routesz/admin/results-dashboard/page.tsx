"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, Download, Share2 } from "lucide-react"

interface Candidate {
  id: string
  name: string
  party: string
  position: string
  votes: number
}

interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  totalVotes: number
  candidates: Candidate[]
}

export default function ResultsDashboard() {
  const [elections, setElections] = useState<Election[]>([])
  const [selectedElection, setSelectedElection] = useState<string>("")

  // Load mock data
  useEffect(() => {
    const mockElections: Election[] = [
      {
        id: "1",
        title: "2024 Presidential Election",
        description: "National presidential election to elect the next President",
        startDate: "2024-02-25T08:00",
        endDate: "2024-02-25T18:00",
        totalVotes: 1245,
        candidates: [
          {
            id: "c1",
            name: "John Adebayo",
            party: "All Progressives Congress (APC)",
            position: "President",
            votes: 523,
          },
          {
            id: "c2",
            name: "Sarah Okafor",
            party: "Peoples Democratic Party (PDP)",
            position: "President",
            votes: 489,
          },
          {
            id: "c3",
            name: "Michael Emeka",
            party: "Labour Party (LP)",
            position: "President",
            votes: 233,
          },
        ],
      },
      {
        id: "2",
        title: "Lagos State Gubernatorial Election",
        description: "Election for the Governor of Lagos State",
        startDate: "2024-03-15T08:00",
        endDate: "2024-03-15T18:00",
        totalVotes: 0,
        candidates: [],
      },
    ]
    setElections(mockElections)

    // Set default selected election (from URL or first in list)
    const urlParams = new URLSearchParams(window.location.search)
    const electionId = urlParams.get("election")
    if (electionId && mockElections.some((e) => e.id === electionId)) {
      setSelectedElection(electionId)
    } else if (mockElections.length > 0) {
      setSelectedElection(mockElections[0].id)
    }
  }, [])

  const getSelectedElection = () => {
    return elections.find((e) => e.id === selectedElection)
  }

  const calculatePercentage = (votes: number) => {
    const election = getSelectedElection()
    if (!election || election.totalVotes === 0) return 0
    return (votes / election.totalVotes) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link
            href="/admin/election-management"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Election Management
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Election Results</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="font-medium">Select Election:</div>
              <Select value={selectedElection} onValueChange={setSelectedElection}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select an election" />
                </SelectTrigger>
                <SelectContent>
                  {elections.map((election) => (
                    <SelectItem key={election.id} value={election.id}>
                      {election.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {getSelectedElection() && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{getSelectedElection()?.title}</CardTitle>
                <CardDescription>{getSelectedElection()?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Total Votes Cast</div>
                    <div className="text-3xl font-bold text-blue-700">{getSelectedElection()?.totalVotes}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Election Period</div>
                    <div className="text-lg font-medium text-green-700">
                      {new Date(getSelectedElection()?.startDate || "").toLocaleDateString()} -{" "}
                      {new Date(getSelectedElection()?.endDate || "").toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Candidates</div>
                    <div className="text-3xl font-bold text-purple-700">{getSelectedElection()?.candidates.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <CardTitle>Results Breakdown</CardTitle>
                </div>
                <CardDescription>Vote distribution among candidates</CardDescription>
              </CardHeader>
              <CardContent>
                {getSelectedElection()?.candidates.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No candidates or votes recorded for this election</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {getSelectedElection()?.candidates.map((candidate, index) => (
                      <div key={candidate.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.party}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{candidate.votes} votes</div>
                            <div className="text-sm text-gray-500">
                              {calculatePercentage(candidate.votes).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${
                              index === 0
                                ? "bg-blue-600"
                                : index === 1
                                  ? "bg-green-600"
                                  : index === 2
                                    ? "bg-purple-600"
                                    : "bg-orange-600"
                            }`}
                            style={{ width: `${calculatePercentage(candidate.votes)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
