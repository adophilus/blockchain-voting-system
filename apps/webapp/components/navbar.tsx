"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Vote, Menu, X, User, LogOut, BarChart3 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, userRole, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BlockVote</span>
            </Link>
          </div>

          {/* Desktop Navigation - Simplified for academic project */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/documentation" className="text-gray-600 hover:text-blue-600 transition-colors">
              Documentation
            </Link>
            <Link href="/results" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Results
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href={userRole === "admin" ? "/admin/dashboard" : "/voter/dashboard"}>
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link
              href="/documentation"
              className="block py-2 text-gray-600 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/results"
              className="block py-2 text-gray-600 hover:text-blue-600 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Results
            </Link>
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    href={userRole === "admin" ? "/admin/dashboard" : "/voter/dashboard"} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
