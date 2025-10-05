"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock } from "lucide-react"

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

// Mock data for real-time results
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

export function RealTimeResults({ electionId }: { electionId: string }) {
  const [election, setElection] = useState<Election | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const selectedElection = mockElections.find(e => e.id === electionId) || mockElections[0]
    setElection(selectedElection)

    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      // In a real implementation, this would fetch updated data from your backend
      // For demo purposes, we'll just update the timestamp
      setLastUpdated(new Date())
      
      // Randomly update vote counts for demo
      if (selectedElection.candidates.length > 0) {
        const updatedCandidates = selectedElection.candidates.map(candidate => ({
          ...candidate,
          votes: candidate.votes + Math.floor(Math.random() * 5)
        }))
        
        const updatedTotalVotes = updatedCandidates.reduce((sum, candidate) => sum + candidate.votes, 0)
        
        setElection({
          ...selectedElection,
          candidates: updatedCandidates,
          totalVotes: updatedTotalVotes
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [electionId])

  const calculatePercentage = (votes: number) => {
    if (!election || election.totalVotes === 0) return 0
    return (votes / election.totalVotes) * 100
  }

  if (!election) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading election results...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{election.title}</CardTitle>
              <CardDescription>{election.description}</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Live</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Total Votes</span>
              </div>
              <div className="text-3xl font-bold text-blue-700">{election.totalVotes}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Election Period</span>
              </div>
              <div className="text-lg font-medium text-green-700">
                {new Date(election.startDate).toLocaleDateString()} -{" "}
                {new Date(election.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-medium text-purple-700">
                {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results Breakdown</CardTitle>
          <CardDescription>Vote distribution among candidates</CardDescription>
        </CardHeader>
        <CardContent>
          {election.candidates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No candidates or votes recorded for this election</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={election.candidates}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, Math.max(...election.candidates.map(c => c.votes)) * 1.1]} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      width={90}
                    />
                    <Tooltip 
                      formatter={(value) => [value, "Votes"]}
                      labelFormatter={(name) => `Candidate: ${name}`}
                    />
                    <Bar dataKey="votes" name="Votes">
                      {election.candidates.map((candidate, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            index === 0 ? "#3b82f6" : 
                            index === 1 ? "#10b981" : 
                            index === 2 ? "#8b5cf6" : 
                            "#f59e0b"
                          } 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {election.candidates.map((candidate, index) => (
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
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}