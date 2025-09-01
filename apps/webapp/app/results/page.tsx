"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RealTimeResults } from "@/components/real-time-results"
import { BarChart3 } from "lucide-react"

// Mock data for elections
const mockElections = [
  {
    id: "1",
    title: "2024 Presidential Election",
  },
  {
    id: "2",
    title: "Lagos State Gubernatorial Election",
  },
]

export default function PublicResultsPage() {
  const [selectedElection, setSelectedElection] = useState<string>("1")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Results</h1>
          <p className="text-gray-600">Real-time voting results</p>
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
                  {mockElections.map((election) => (
                    <SelectItem key={election.id} value={election.id}>
                      {election.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <RealTimeResults electionId={selectedElection} />
      </div>
    </div>
  )
}