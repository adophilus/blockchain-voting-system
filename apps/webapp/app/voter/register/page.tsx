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
import { ArrowLeft, UserCheck, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "Draft" | "Active" | "Ended"
  positions?: string[]
}

export default function VoterRegistration() {
  const [formData, setFormData] = useState({
    nin: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    state: "",
    lga: "",
    ward: "",
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
      positions: ["President", "Vice President"],
    }
    setElection(mockElection)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your blockchain/backend
    toast.success("Your voter registration has been submitted for verification.")
    setSimulateRegistered(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Registration Link</h2>
            <p className="text-gray-600 text-center mb-6">
              This voter registration link is invalid or has expired. Please contact the election administrator.
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Registration Closed</h2>
              <p className="text-gray-600 text-center mb-2">Voter registration for this election has ended.</p>
              <p className="text-gray-500 text-sm text-center mb-6">{election.title}</p>
              <Link href={`/voter/vote?election=${election.id}`}>
                <Button>Go to Voting Page</Button>
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Registration Complete</h2>
              <p className="text-gray-600 text-center mb-2">You have successfully registered as a voter for:</p>
              <p className="text-gray-800 font-medium text-center mb-6">{election.title}</p>
              <div className="bg-gray-50 p-4 rounded-lg w-full max-w-sm mb-6">
                <div className="text-sm text-gray-500 mb-1">Voter ID</div>
                <div className="font-mono text-sm">VOT-{Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
              </div>
              <Link href={`/voter/vote?election=${election.id}`}>
                <Button>Go to Voting Page</Button>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-6 w-6 text-green-600" />
              <CardTitle>Voter Registration</CardTitle>
            </div>
            <CardDescription className="space-y-1">
              <div>Register as a voter for:</div>
              <div className="font-semibold text-lg text-green-700">{election.title}</div>
              <div className="text-sm">{election.description}</div>
            </CardDescription>
          </CardHeader>

          <div className="bg-green-50 border-b p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Election Date:</span>
                <div className="font-medium">
                  {new Date(election.startDate).toLocaleDateString()} -{" "}
                  {new Date(election.endDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Voting Positions:</span>
                <div className="font-medium">{election.positions?.join(", ") || "President"}</div>
              </div>
            </div>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identity Verification Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Shield className="h-4 w-4" />
                  <span>Identity Verification</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nin">National Identity Number (NIN) *</Label>
                  <Input
                    id="nin"
                    value={formData.nin}
                    onChange={(e) => handleInputChange("nin", e.target.value)}
                    placeholder="Enter your 11-digit NIN"
                    maxLength={11}
                    required
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Personal Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Address Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Residential Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter your full residential address"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">FCT Abuja</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="ogun">Ogun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lga">Local Government Area *</Label>
                    <Input
                      id="lga"
                      value={formData.lga}
                      onChange={(e) => handleInputChange("lga", e.target.value)}
                      placeholder="Enter LGA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ward">Ward *</Label>
                    <Input
                      id="ward"
                      value={formData.ward}
                      onChange={(e) => handleInputChange("ward", e.target.value)}
                      placeholder="Enter ward"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Submit Registration
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
