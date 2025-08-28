"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Vote, Clock, MapPin, Users, CheckCircle, AlertCircle } from "lucide-react"
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
  type: string
  startDate: string
  endDate: string
  positions: string[]
  eligibleStates: string[]
  status: "Active" | "Upcoming" | "Ended"
  candidates: Candidate[]
}

interface UserVote {
  electionId: string
  position: string
  candidateId: string
  timestamp: string
}

export default function VotingInterface() {
  const [elections, setElections] = useState<Election[]>([])
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string>("")
  const [votes, setVotes] = useState<UserVote[]>([])
  const [voterState, setVoterState] = useState<string>("lagos") // Mock voter state

  // Mock data - in real implementation, this would come from your blockchain/backend
  useEffect(() => {
    const mockElections: Election[] = [
      {
        id: "1",
        title: "2024 Presidential Election",
        description: "National presidential election to elect the next President of Nigeria",
        type: "federal",
        startDate: "2024-02-25T08:00",
        endDate: "2024-02-25T18:00",
        positions: ["President"],
        eligibleStates: ["Lagos", "Abuja", "Kano", "Rivers", "Ogun"],
        status: "Active",
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
      },
      {
        id: "2",
        title: "Lagos State Gubernatorial Election",
        description: "Election for the Governor of Lagos State",
        type: "state",
        startDate: "2024-03-15T08:00",
        endDate: "2024-03-15T18:00",
        positions: ["Governor", "Deputy Governor"],
        eligibleStates: ["Lagos"],
        status: "Upcoming",
        candidates: [
          {
            id: "c4",
            name: "Adebola Tinubu",
            party: "All Progressives Congress (APC)",
            position: "Governor",
            biography: "Former Commissioner for Commerce and Industry",
            imageUrl: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "c5",
            name: "Funmi Adeola",
            party: "Peoples Democratic Party (PDP)",
            position: "Governor",
            biography: "Former House of Representatives member",
            imageUrl: "/placeholder.svg?height=100&width=100",
          },
        ],
      },
    ]
    setElections(mockElections)
  }, [])

  const getEligibleElections = () => {
    return elections.filter(
      (election) =>
        election.status === "Active" &&
        election.eligibleStates.some((state) => state.toLowerCase() === voterState.toLowerCase()),
    )
  }

  const hasVotedInPosition = (electionId: string, position: string) => {
    return votes.some((vote) => vote.electionId === electionId && vote.position === position)
  }

  const getCandidatesForPosition = (position: string) => {
    if (!selectedElection) return []
    return selectedElection.candidates.filter((candidate) => candidate.position === position)
  }

  const handleVote = (candidateId: string) => {
    if (!selectedElection || !selectedPosition) return

    if (hasVotedInPosition(selectedElection.id, selectedPosition)) {
      toast.error("You have already cast your vote for this position in this election.")
      return
    }

    const newVote: UserVote = {
      electionId: selectedElection.id,
      position: selectedPosition,
      candidateId,
      timestamp: new Date().toISOString(),
    }

    setVotes([...votes, newVote])

    const candidate = selectedElection.candidates.find((c) => c.id === candidateId)
    toast.success(`Your vote for ${candidate?.name} has been recorded on the blockchain.`)
  }

  const getVoteStatus = (electionId: string, position: string) => {
    const vote = votes.find((v) => v.electionId === electionId && v.position === position)
    if (vote) {
      const candidate = selectedElection?.candidates.find((c) => c.id === vote.candidateId)
      return candidate?.name
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Election Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Vote className="h-6 w-6 text-blue-600" />
                <CardTitle>Select Election</CardTitle>
              </div>
              <CardDescription>Choose an active election to participate in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Your registered state: <span className="font-medium capitalize">{voterState}</span>
                </div>

                {getEligibleElections().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active elections available for your state</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getEligibleElections().map((election) => (
                      <div
                        key={election.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedElection?.id === election.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedElection(election)
                          setSelectedPosition("")
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-sm">{election.title}</h3>
                            <p className="text-xs text-gray-600 mt-1">{election.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {election.status}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {election.positions.length} positions
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Position Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Position</CardTitle>
              <CardDescription>Choose the position you want to vote for</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedElection ? (
                <div className="text-center py-8 text-gray-500">
                  <Vote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an election first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedElection.positions.map((position) => {
                    const hasVoted = hasVotedInPosition(selectedElection.id, position)
                    const votedFor = getVoteStatus(selectedElection.id, position)

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
                            {hasVoted && votedFor && (
                              <p className="text-sm text-green-600 mt-1">✓ Voted for: {votedFor}</p>
                            )}
                          </div>
                          {hasVoted && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidate Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Cast Your Vote</CardTitle>
              <CardDescription>Select your preferred candidate</CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedElection || !selectedPosition ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an election and position first</p>
                </div>
              ) : hasVotedInPosition(selectedElection.id, selectedPosition) ? (
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
                    <div key={candidate.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={candidate.imageUrl || "/placeholder.svg"}
                          alt={candidate.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-blue-600">{candidate.party}</p>
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{candidate.biography}</p>
                          <Button onClick={() => handleVote(candidate.id)} className="mt-3 w-full" size="sm">
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

        {/* Voting History */}
        {votes.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Voting History</CardTitle>
              <CardDescription>Record of your votes cast in this session</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {votes.map((vote, index) => {
                  const election = elections.find((e) => e.id === vote.electionId)
                  const candidate = election?.candidates.find((c) => c.id === vote.candidateId)

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">{election?.title}</p>
                        <p className="text-sm text-gray-600">
                          {vote.position}: <span className="font-medium">{candidate?.name}</span>
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
      </div>
    </div>
  )
}
