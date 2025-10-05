"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Calendar, Copy, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "Draft" | "Active" | "Ended"
  voterRegistrationLink: string
  candidateRegistrationLink: string
  voterCount: number
  candidateCount: number
}

export default function ElectionManagement() {
  const [elections, setElections] = useState<Election[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  const [simulateEnded, setSimulateEnded] = useState<Record<string, boolean>>({})

  // Load mock data
  useEffect(() => {
    const mockElections: Election[] = [
      {
        id: "1",
        title: "2024 Presidential Election",
        description: "National presidential election to elect the next President",
        startDate: "2024-02-25T08:00",
        endDate: "2024-02-25T18:00",
        status: "Active",
        voterRegistrationLink: "https://blockvote.example/voter/register?election=1",
        candidateRegistrationLink: "https://blockvote.example/candidate/register?election=1",
        voterCount: 1245,
        candidateCount: 3,
      },
      {
        id: "2",
        title: "Lagos State Gubernatorial Election",
        description: "Election for the Governor of Lagos State",
        startDate: "2024-03-15T08:00",
        endDate: "2024-03-15T18:00",
        status: "Draft",
        voterRegistrationLink: "https://blockvote.example/voter/register?election=2",
        candidateRegistrationLink: "https://blockvote.example/candidate/register?election=2",
        voterCount: 0,
        candidateCount: 0,
      },
    ]
    setElections(mockElections)

    // Initialize simulation states
    const initialSimulationState: Record<string, boolean> = {}
    mockElections.forEach((election) => {
      initialSimulationState[election.id] = false
    })
    setSimulateEnded(initialSimulationState)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newElection: Election = {
      id: Date.now().toString(),
      ...formData,
      status: "Draft",
      voterRegistrationLink: `https://blockvote.example/voter/register?election=${Date.now()}`,
      candidateRegistrationLink: `https://blockvote.example/candidate/register?election=${Date.now()}`,
      voterCount: 0,
      candidateCount: 0,
    }
    setElections([...elections, newElection])
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    })
    setSimulateEnded({ ...simulateEnded, [newElection.id]: false })
    toast.success(`${formData.title} has been created successfully.`)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} link has been copied to clipboard.`)
  }

  const toggleElectionStatus = (id: string, ended: boolean) => {
    setSimulateEnded({ ...simulateEnded, [id]: ended })
    toast.success(ended ? "Election has been marked as ended." : "Election has been marked as active.")
  }

  const deleteElection = (id: string) => {
    setElections(elections.filter((election) => election.id !== id))
    toast.success("The election has been deleted successfully.")
  }

  const getElectionStatus = (election: Election) => {
    if (simulateEnded[election.id]) {
      return "Ended"
    }
    return election.status
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

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Election Management</h1>
        </div>

        <Tabs defaultValue="elections">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="elections">Manage Elections</TabsTrigger>
            <TabsTrigger value="create">Create New Election</TabsTrigger>
          </TabsList>

          <TabsContent value="elections">
            {elections.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg text-gray-500">No elections created yet</p>
                  <p className="text-sm text-gray-400 mb-4">Create your first election to get started</p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Election
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {elections.map((election) => (
                  <Card
                    key={election.id}
                    className={simulateEnded[election.id] ? "border-orange-300 bg-orange-50" : ""}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{election.title}</CardTitle>
                          <CardDescription>{election.description}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            getElectionStatus(election) === "Active"
                              ? "default"
                              : getElectionStatus(election) === "Ended"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {getElectionStatus(election)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Election Period</div>
                            <div className="text-sm text-gray-600">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {new Date(election.startDate).toLocaleDateString()} -{" "}
                              {new Date(election.endDate).toLocaleDateString()}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-1">Registration Stats</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-blue-50 p-2 rounded-md">
                                <div className="text-xs text-gray-500">Voters</div>
                                <div className="text-lg font-semibold">{election.voterCount}</div>
                              </div>
                              <div className="bg-purple-50 p-2 rounded-md">
                                <div className="text-xs text-gray-500">Candidates</div>
                                <div className="text-lg font-semibold">{election.candidateCount}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium mb-3 flex items-center space-x-2">
                              <span>Election-Specific Registration Links</span>
                              <Badge variant="outline" className="text-xs">
                                Share these links
                              </Badge>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-medium text-purple-700">Candidate Registration</div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(election.candidateRegistrationLink, "Candidate registration")
                                    }
                                    className="text-purple-600 hover:text-purple-800"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="text-xs text-purple-600 font-mono bg-white p-2 rounded border">
                                  {election.candidateRegistrationLink}
                                </div>
                                <p className="text-xs text-purple-600 mt-1">
                                  Share this link with potential candidates
                                </p>
                              </div>

                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-sm font-medium text-green-700">Voter Registration</div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(election.voterRegistrationLink, "Voter registration")
                                    }
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="text-xs text-green-600 font-mono bg-white p-2 rounded border">
                                  {election.voterRegistrationLink}
                                </div>
                                <p className="text-xs text-green-600 mt-1">Share this link with eligible voters</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">Simulate Election Ended:</div>
                        <Switch
                          checked={simulateEnded[election.id]}
                          onCheckedChange={(checked) => toggleElectionStatus(election.id, checked)}
                        />
                      </div>
                      <div className="flex space-x-2">
                        {simulateEnded[election.id] && (
                          <Link href={`/admin/results-dashboard?election=${election.id}`}>
                            <Button variant="outline" size="sm">
                              View Results
                            </Button>
                          </Link>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Election</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this election? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {}}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={() => deleteElection(election.id)}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Election</CardTitle>
                <CardDescription>Set up a new election and generate registration links</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Election Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="e.g., 2024 Presidential Election"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Describe the purpose and scope of this election"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date & Time *</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date & Time *</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Election
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
