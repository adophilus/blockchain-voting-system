"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, userRole } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === "admin") {
        router.push("/admin/dashboard")
      } else if (userRole === "voter") {
        router.push("/voter/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, userRole, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
