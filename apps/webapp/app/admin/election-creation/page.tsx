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
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Settings, Calendar, MapPin, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Election {
  id: string
  title: string
  description: string
  type: string
  startDate: string
  endDate: string
  positions: string[]
  eligibleStates: string[]
  status: string
}

export default function ElectionCreation() {
  const [elections, setElections] = useState<Election[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    positions: [] as string[],
    eligibleStates: [] as string[],
  })
  const { toast } = useToast()

  const availablePositions = [
    "President",
    "Governor",
    "Senator",
    "House of Representatives",
    "State Assembly",
    "Local Government Chairman",
  ]

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newElection: Election = {
      id: Date.now().toString(),
      ...formData,
      status: "Draft",
    }
    setElections([...elections, newElection])
    setFormData({
      title: "",
      description: "",
      type: "",
      startDate: "",
      endDate: "",
      positions: [],
      eligibleStates: [],
    })
    toast({
      title: "Election Created",
      description: `${formData.title} has been created successfully.`,
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePositionChange = (position: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      positions: checked ? [...prev.positions, position] : prev.positions.filter((p) => p !== position),
    }))
  }

  const handleStateChange = (state: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      eligibleStates: checked ? [...prev.eligibleStates, state] : prev.eligibleStates.filter((s) => s !== state),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-orange-600 hover:text-orange-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Election Creation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Settings className="h-6 w-6 text-orange-600" />
                  <CardTitle>Create New Election</CardTitle>
                </div>
                <CardDescription>Configure a new election with all necessary parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>Basic Information</span>
                    </div>

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

                    <div className="space-y-2">
                      <Label htmlFor="type">Election Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select election type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="federal">Federal Election</SelectItem>
                          <SelectItem value="state">State Election</SelectItem>
                          <SelectItem value="local">Local Government Election</SelectItem>
                          <SelectItem value="special">Special Election</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Election Schedule</h3>

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

                  {/* Positions */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <Users className="h-4 w-4" />
                      <span>Positions to Contest</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {availablePositions.map((position) => (
                        <div key={position} className="flex items-center space-x-2">
                          <Checkbox
                            id={position}
                            checked={formData.positions.includes(position)}
                            onCheckedChange={(checked) => handlePositionChange(position, checked as boolean)}
                          />
                          <Label htmlFor={position} className="text-sm">
                            {position}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Eligible States */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <MapPin className="h-4 w-4" />
                      <span>Eligible States/Regions</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                      {nigerianStates.map((state) => (
                        <div key={state} className="flex items-center space-x-2">
                          <Checkbox
                            id={state}
                            checked={formData.eligibleStates.includes(state)}
                            onCheckedChange={(checked) => handleStateChange(state, checked as boolean)}
                          />
                          <Label htmlFor={state} className="text-xs">
                            {state}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Election
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Created Elections List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Created Elections ({elections.length})</CardTitle>
                <CardDescription>List of all created elections</CardDescription>
              </CardHeader>
              <CardContent>
                {elections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No elections created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {elections.map((election) => (
                      <div key={election.id} className="border rounded-lg p-3">
                        <h3 className="font-semibold text-sm">{election.title}</h3>
                        <p className="text-xs text-gray-600">{election.type}</p>
                        <p className="text-xs text-blue-600">{election.positions.length} positions</p>
                        <p className="text-xs text-green-600">{election.eligibleStates.length} states</p>
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            {election.status}
                          </span>
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
    </div>
  )
}
