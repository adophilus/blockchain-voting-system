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
import { ArrowLeft, UserCheck, Shield } from "lucide-react"
import { toast } from "sonner"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your blockchain/backend
    toast.success("Your voter registration has been submitted for verification.")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserCheck className="h-6 w-6 text-green-600" />
              <CardTitle>Voter Registration</CardTitle>
            </div>
            <CardDescription>
              Complete your voter registration using your National Identity Number (NIN) and personal information
            </CardDescription>
          </CardHeader>
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
                        {/* Add more states as needed */}
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
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
