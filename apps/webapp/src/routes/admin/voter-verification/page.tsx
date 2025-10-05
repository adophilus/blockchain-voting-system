"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, UserCheck, Search, CheckCircle, XCircle, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import ProtectedRoute from "@/components/protected-route"

interface Voter {
  id: string
  nin: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  address: string
  state: string
  lga: string
  ward: string
  profileImage: string
  status: "pending" | "approved" | "rejected"
  registrationDate: string
}

export default function VoterVerification() {
  const [voters, setVoters] = useState<Voter[]>([
    {
      id: "1",
      nin: "12345678901",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+2348012345678",
      dateOfBirth: "1990-01-15",
      gender: "male",
      address: "123 Main St, Lagos Island",
      state: "lagos",
      lga: "Lagos Island",
      ward: "Ward 1",
      profileImage: "",
      status: "pending",
      registrationDate: "2024-02-20T10:30:00",
    },
    {
      id: "2",
      nin: "23456789012",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "+2348098765432",
      dateOfBirth: "1985-05-22",
      gender: "female",
      address: "456 Oak Ave, Ikoyi",
      state: "lagos",
      lga: "Ikoyi",
      ward: "Ward 3",
      profileImage: "",
      status: "approved",
      registrationDate: "2024-02-18T14:15:00",
    },
    {
      id: "3",
      nin: "34567890123",
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.j@example.com",
      phone: "+2348055566677",
      dateOfBirth: "1992-11-08",
      gender: "male",
      address: "789 Pine Rd, Victoria Island",
      state: "lagos",
      lga: "Victoria Island",
      ward: "Ward 2",
      profileImage: "",
      status: "pending",
      registrationDate: "2024-02-22T09:45:00",
    },
  ])
  
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  const filteredVoters = voters.filter(voter => {
    const matchesStatus = filterStatus === "all" || voter.status === filterStatus
    const matchesSearch = 
      voter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.nin.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const handleVerifyVoter = (voterId: string, status: "approved" | "rejected") => {
    setVoters(voters.map(voter => 
      voter.id === voterId ? { ...voter, status } : voter
    ))
    toast.success(`Voter ${status === "approved" ? "approved" : "rejected"} successfully`)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Dashboard
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Voter Verification</h1>
              <p className="text-gray-600">Review and verify voter registrations</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Voters</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name or NIN"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Filter by Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <div className="text-sm text-gray-500">
                    Showing {filteredVoters.length} of {voters.length} voters
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredVoters.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <UserCheck className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No voters found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredVoters.map((voter) => (
                <Card key={voter.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {voter.profileImage ? (
                          <img 
                            src={voter.profileImage} 
                            alt={`${voter.firstName} ${voter.lastName}`} 
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold">
                                {voter.firstName} {voter.lastName}
                              </h3>
                              <Badge 
                                variant={
                                  voter.status === "approved" ? "default" : 
                                  voter.status === "rejected" ? "destructive" : 
                                  "outline"
                                }
                              >
                                {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-600">NIN: {voter.nin}</p>
                          </div>
                          
                          <div className="mt-2 md:mt-0 text-sm text-gray-500">
                            Registered: {new Date(voter.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Contact Information</div>
                            <div className="font-medium">{voter.email}</div>
                            <div className="font-medium">{voter.phone}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Address</div>
                            <div className="font-medium">{voter.address}</div>
                            <div className="font-medium">{voter.lga}, {voter.state}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {voter.status === "pending" ? (
                            <>
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handleVerifyVoter(voter.id, "approved")}
                                className="flex items-center space-x-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Approve</span>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => handleVerifyVoter(voter.id, "rejected")}
                                className="flex items-center space-x-1"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>Reject</span>
                              </Button>
                            </>
                          ) : voter.status === "approved" ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleVerifyVoter(voter.id, "rejected")}
                              className="flex items-center space-x-1"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Revoke Approval</span>
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleVerifyVoter(voter.id, "approved")}
                              className="flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}