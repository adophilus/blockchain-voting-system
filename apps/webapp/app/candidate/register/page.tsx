"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Users, CheckCircle, AlertCircle, Upload } from "lucide-react"
import { toast } from "sonner"

interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "Draft" | "Active" | "Ended"
  positions: string[]
}

export default function CandidateRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    position: "",
    biography: "",
    email: "",
    phone: "",
    manifesto: "",
    imageUrl: "",
  })
  const [election, setElection] = useState<Election | null>(null)
  const [simulateEnded, setSimulateEnded] = useState(false)
  const [simulateRegistered, setSimulateRegistered] = useState(false)

  // Load mock election data based on URL parameter
  useEffect(() => {
    // In a real app, you would fetch the election data from the API
    // For now, we'll simulate getting the election ID from the URL
    const mockElection: Election = {
      id: "1",
      title: "2024 Presidential Election",
      description: "National presidential election to elect the next President",
      startDate: "2024-02-25T08:00",
      endDate: "2024-02-25T18:00",
      status: "Active",
      positions: ["President", "Vice President", "Senate", "House of Representatives"],
    }
    setElection(mockElection)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your blockchain/backend
    toast.success("Your candidate registration has been submitted for verification.")
    setSimulateRegistered(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Registration Link</h2>
            <p className="text-gray-600 text-center mb-6">
              This candidate registration link is invalid or has expired. Please contact the election administrator.
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Registration Closed</h2>
              <p className="text-gray-600 text-center mb-2">Candidate registration for this election has ended.</p>
              <p className="text-gray-500 text-sm text-center mb-6">{election.title}</p>
              <Link href="/dashboard">
                <Button>Return to Home</Button>
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

  if (simulateRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Registration Complete</h2>
              <p className="text-gray-600 text-center mb-2">You have successfully registered as a candidate for:</p>
              <p className="text-gray-800 font-medium text-center mb-2">{election.title}</p>
              <p className="text-purple-600 font-medium text-center mb-6">
                Position: {formData.position || "President"}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg w-full max-w-sm mb-6">
                <div className="text-sm text-gray-500 mb-1">Candidate ID</div>
                <div className="font-mono text-sm">CAN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Your candidacy is pending verification by the election administrators. You will be notified once your
                candidacy is approved.
              </p>
              <Link href="/dashboard">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-sm">Simulation Controls</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm">Simulate Election Ended:</div>
                <Switch checked={simulateEnded} onCheckedChange={setSimulateEnded} />
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm">Simulate Already Registered:</div>
                <Switch checked={simulateRegistered} onCheckedChange={setSimulateRegistered} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-purple-600 hover:text-purple-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <CardTitle>Candidate Registration</CardTitle>
            </div>
            <CardDescription className="space-y-1">
              <div>Register as a candidate for:</div>
              <div className="font-semibold text-lg text-purple-700">{election.title}</div>
              <div className="text-sm">{election.description}</div>
            </CardDescription>
          </CardHeader>

          <div className="bg-purple-50 border-b p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Election Period:</span>
                <div className="font-medium">
                  {new Date(election.startDate).toLocaleDateString()} -{" "}
                  {new Date(election.endDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Available Positions:</span>
                <div className="font-medium">{election.positions.join(", ")}</div>
              </div>
            </div>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+234..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Candidacy Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Candidacy Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select onValueChange={(value) => handleInputChange("position", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {election.positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="biography">Biography *</Label>
                  <Textarea
                    id="biography"
                    value={formData.biography}
                    onChange={(e) => handleInputChange("biography", e.target.value)}
                    placeholder="Enter your professional background and qualifications"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Manifesto / Campaign Promises</Label>
                  <Textarea
                    id="manifesto"
                    value={formData.manifesto}
                    onChange={(e) => handleInputChange("manifesto", e.target.value)}
                    placeholder="Describe your vision and promises if elected"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Profile Image</h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Upload a professional photo</p>
                  <p className="text-xs text-gray-400 mb-4">PNG, JPG or WEBP (max. 2MB)</p>
                  <Button type="button" variant="outline" size="sm">
                    Select Image
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Submit Candidacy
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-sm">Simulation Controls</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="text-sm">Simulate Election Ended:</div>
              <Switch checked={simulateEnded} onCheckedChange={setSimulateEnded} />
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm">Simulate Already Registered:</div>
              <Switch checked={simulateRegistered} onCheckedChange={setSimulateRegistered} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
