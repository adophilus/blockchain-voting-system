"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    const role = localStorage.getItem("userRole")
    
    if (authStatus === "true" && role) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication logic
    // In a real application, this would be replaced with actual authentication
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true)
      setUserRole("admin")
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", "admin")
      return true
    } else if (username === "voter" && password === "1234") {
      setIsAuthenticated(true)
      setUserRole("voter")
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", "voter")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}