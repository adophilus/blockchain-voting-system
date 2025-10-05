"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Vote, Clock, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"
import { toast } from "sonner"

interface Candidate {
  id: string
  name: string
  party: string
  position: string
  biography: string
  imageUrl: string
}

interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "Active" | "Ended"
  positions: string[]
  candidates: Candidate[]
}

interface UserVote {
  electionId: string
  position: string
  candidateId: string
  timestamp: string
}

export default function VotingInterface() {
  const [election, setElection] = useState<Election | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string>("")
  const [votes, setVotes] = useState<UserVote[]>([])
  const [simulateEnded, setSimulateEnded] = useState(false)

  // Load mock election data
  useEffect(() => {
    const mockElection: Election = {
      id: "1",
      title: "2024 Presidential Election",
      description: "National presidential election to elect the next President",
      startDate: "2024-02-25T08:00",
      endDate: "2024-02-25T18:00",
      status: "Active",
      positions: ["President"],
      candidates: [
        {
          id: "c1",
          name: "John Adebayo",
          party: "All Progressives Congress (APC)",
          position: "President",
          biography: "Former Governor with 20 years of public service experience",
          imageUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "c2",
          name: "Sarah Okafor",
          party: "Peoples Democratic Party (PDP)",
          position: "President",
          biography: "Senator and former Minister of Education",
          imageUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: "c3",
          name: "Michael Emeka",
          party: "Labour Party (LP)",
          position: "President",
          biography: "Business leader and anti-corruption advocate",
          imageUrl: "/placeholder.svg?height=100&width=100",
        },
      ],
    }
    setElection(mockElection)
    setSelectedPosition(mockElection.positions[0])
  }, [])

  const hasVotedInPosition = (electionId: string, position: string) => {
    return votes.some((vote) => vote.electionId === electionId && vote.position === position)
  }

  const getCandidatesForPosition = (position: string) => {
    if (!election) return []
    return election.candidates.filter((candidate) => candidate.position === position)
  }

  const handleVote = (candidateId: string) => {
    if (!election || !selectedPosition) return

    if (hasVotedInPosition(election.id, selectedPosition)) {
      toast.error("You have already cast your vote for this position in this election.")
      return
    }

    const newVote: UserVote = {
      electionId: election.id,
      position: selectedPosition,
      candidateId,
      timestamp: new Date().toISOString(),
    }

    setVotes([...votes, newVote])

    const candidate = election.candidates.find((c) => c.id === candidateId)
    toast.success(`Your vote for ${candidate?.name} has been recorded on the blockchain.`)
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Election Not Found</h2>
            <p className="text-gray-600 text-center mb-6">
              The election you're trying to access is not available or has been removed.
            </p>
            <Link href="/dashboard">
              <Button>Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (simulateEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">This Election Has Ended</h2>
              <p className="text-gray-600 text-center mb-2">Voting for this election has concluded.</p>
              <p className="text-gray-500 text-sm text-center mb-6">{election.title}</p>
              <Link href={`/admin/results-dashboard?election=${election.id}`}>
                <Button>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Election Results
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm">Simulation Controls</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm">Simulate Election Ended:</div>
              <Switch checked={simulateEnded} onCheckedChange={setSimulateEnded} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="mb-6 border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Vote className="h-6 w-6 text-blue-600" />
                  <span>Voting for: {election.title}</span>
                </CardTitle>
                <CardDescription className="text-base mt-1">{election.description}</CardDescription>
              </div>
              <Badge variant="default" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-gray-500">Election Period</div>
                <div className="font-medium text-blue-700">
                  {new Date(election.startDate).toLocaleDateString()} -{" "}
                  {new Date(election.endDate).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-gray-500">Positions Available</div>
                <div className="font-medium text-purple-700">{election.positions.length}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-gray-500">Candidates</div>
                <div className="font-medium text-green-700">{election.candidates.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Position Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Position</CardTitle>
              <CardDescription>Choose the position you want to vote for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {election.positions.map((position) => {
                  const hasVoted = hasVotedInPosition(election.id, position)

                  return (
                    <div
                      key={position}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPosition === position
                          ? "border-blue-500 bg-blue-50"
                          : hasVoted
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => !hasVoted && setSelectedPosition(position)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{position}</h3>
                          {hasVoted && <p className="text-sm text-green-600 mt-1">✓ Vote Cast</p>}
                        </div>
                        {hasVoted && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Candidate Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
                <CardDescription>Select your preferred candidate for {selectedPosition}</CardDescription>
              </CardHeader>
              <CardContent>
                {hasVotedInPosition(election.id, selectedPosition) ? (
                  <div className="text-center py-8 text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-medium">Vote Already Cast</p>
                    <p className="text-sm text-gray-600 mt-2">
                      You have already voted for {selectedPosition} in this election
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getCandidatesForPosition(selectedPosition).map((candidate) => (
                      <div key={candidate.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <img
                            src={candidate.imageUrl || "/placeholder.svg"}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <p className="text-sm text-blue-600 mb-2">{candidate.party}</p>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{candidate.biography}</p>
                            <Button onClick={() => handleVote(candidate.id)} className="w-full" size="sm">
                              Vote for {candidate.name}
                            </Button>
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

        {/* Voting History */}
        {votes.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Voting History</CardTitle>
              <CardDescription>Record of your votes cast in this election</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {votes.map((vote, index) => {
                  const candidate = election.candidates.find((c) => c.id === vote.candidateId)

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">{vote.position}</p>
                        <p className="text-sm text-gray-600">
                          Voted for: <span className="font-medium">{candidate?.name}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                        <p className="text-xs text-gray-500 mt-1">{new Date(vote.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm">Simulation Controls</div>
          <div className="flex items-center space-x-2">
            <div className="text-sm">Simulate Election Ended:</div>
            <Switch checked={simulateEnded} onCheckedChange={setSimulateEnded} />
          </div>
        </div>
      </div>
    </div>
  )
}
