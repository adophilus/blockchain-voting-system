"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Candidate {
  id: string
  name: string
  party: string
  position: string
  biography: string
  imageUrl: string
}

export default function CandidateRegistration() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    position: "",
    biography: "",
    imageUrl: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      ...formData,
    }
    setCandidates([...candidates, newCandidate])
    setFormData({
      name: "",
      party: "",
      position: "",
      biography: "",
      imageUrl: "",
    })
    toast.success(`${formData.name} has been registered as a candidate.`)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const removeCandidate = (id: string) => {
    setCandidates(candidates.filter((c) => c.id !== id))
    toast.success("Candidate has been removed from the list.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <CardTitle>Register New Candidate</CardTitle>
              </div>
              <CardDescription>Add candidates to the electoral system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter candidate's full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party">Political Party *</Label>
                  <Select onValueChange={(value) => handleInputChange("party", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select political party" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apc">All Progressives Congress (APC)</SelectItem>
                      <SelectItem value="pdp">Peoples Democratic Party (PDP)</SelectItem>
                      <SelectItem value="lp">Labour Party (LP)</SelectItem>
                      <SelectItem value="nnpp">New Nigeria Peoples Party (NNPP)</SelectItem>
                      <SelectItem value="independent">Independent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="president">President</SelectItem>
                      <SelectItem value="governor">Governor</SelectItem>
                      <SelectItem value="senator">Senator</SelectItem>
                      <SelectItem value="house-rep">House of Representatives</SelectItem>
                      <SelectItem value="state-assembly">State Assembly</SelectItem>
                      <SelectItem value="local-chairman">Local Government Chairman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Profile Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/candidate-photo.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biography">Biography</Label>
                  <Textarea
                    id="biography"
                    value={formData.biography}
                    onChange={(e) => handleInputChange("biography", e.target.value)}
                    placeholder="Enter candidate's biography and qualifications"
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Registered Candidates List */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Candidates ({candidates.length})</CardTitle>
              <CardDescription>List of all registered candidates</CardDescription>
            </CardHeader>
            <CardContent>
              {candidates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No candidates registered yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                          <p className="text-sm text-blue-600">{candidate.position}</p>
                          {candidate.biography && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{candidate.biography}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCandidate(candidate.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
