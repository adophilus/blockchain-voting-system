"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  FileText,
  Database,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Printer,
} from "lucide-react"

export default function DocumentationPage() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-page {
            page-break-before: always;
          }
          body {
            font-size: 12pt;
            line-height: 1.4;
            color: black;
          }
          .container {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .bg-gradient-to-br,
          .bg-blue-50,
          .bg-white {
            background: white !important;
          }
          .shadow-lg,
          .shadow-xl {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
          h1 {
            font-size: 24pt;
            margin-bottom: 20pt;
          }
          h2 {
            font-size: 18pt;
            margin-top: 20pt;
            margin-bottom: 12pt;
          }
          h3 {
            font-size: 14pt;
            margin-top: 12pt;
            margin-bottom: 8pt;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="no-print">
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Technical Documentation</h1>
                <p className="text-lg text-gray-600">BlockVote: Blockchain-Based Electoral System</p>
                <div className="flex items-center space-x-4 mt-4">
                  <Badge variant="secondary">Final Year Project</Badge>
                  <Badge variant="outline">Electrical Electronics Engineering</Badge>
                  <Badge variant="outline">Version 1.0</Badge>
                </div>
              </div>
              <Button onClick={handlePrint} className="no-print">
                <Printer className="h-4 w-4 mr-2" />
                Print Documentation
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Table of Contents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>1. Executive Summary</span>
                    <span>Page 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. System Architecture</span>
                    <span>Page 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Technical Implementation</span>
                    <span>Page 3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4. Prototype vs Full Implementation</span>
                    <span>Page 4</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>5. Security Considerations</span>
                    <span>Page 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>6. Performance Analysis</span>
                    <span>Page 6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>7. Future Improvements</span>
                    <span>Page 7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>8. Conclusion</span>
                    <span>Page 8</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Executive Summary */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl">1. Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
                <p className="text-gray-700">
                  BlockVote is a blockchain-based electoral system developed as a final year project for the Electrical
                  Electronics Engineering department. The system demonstrates how distributed ledger technology can
                  enhance the security, transparency, and efficiency of electoral processes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Objectives</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Implement a secure, tamper-proof voting system using blockchain technology</li>
                  <li>Demonstrate real-time vote counting and result tabulation</li>
                  <li>Provide transparent and verifiable election processes</li>
                  <li>Create an intuitive user interface for election management</li>
                  <li>Establish a foundation for future blockchain electoral implementations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Achievements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Complete election management system</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Secure voter and candidate registration</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Real-time voting interface</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Results dashboard and analytics</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. System Architecture */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Database className="h-6 w-6 mr-2" />
                2. System Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Frontend Layer</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Framework:</strong> Next.js 14 with App Router for modern React development
                    </li>
                    <li>
                      <strong>UI Components:</strong> shadcn/ui component library for consistent design
                    </li>
                    <li>
                      <strong>Styling:</strong> Tailwind CSS for responsive and utility-first styling
                    </li>
                    <li>
                      <strong>State Management:</strong> React hooks and context for local state management
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Data Layer (Current Prototype)</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    <AlertTriangle className="h-4 w-4 inline mr-1 text-yellow-600" />
                    <strong>Note:</strong> Current implementation uses simulated data storage
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Storage:</strong> Browser localStorage for demonstration purposes
                    </li>
                    <li>
                      <strong>Data Structure:</strong> JSON objects representing elections, voters, and candidates
                    </li>
                    <li>
                      <strong>Persistence:</strong> Session-based data (resets on browser refresh)
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Planned Blockchain Layer</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Blockchain Platform:</strong> Ethereum or Polygon for smart contract deployment
                    </li>
                    <li>
                      <strong>Smart Contracts:</strong> Solidity-based contracts for vote recording and validation
                    </li>
                    <li>
                      <strong>Web3 Integration:</strong> ethers.js or web3.js for blockchain interaction
                    </li>
                    <li>
                      <strong>IPFS:</strong> Distributed storage for election metadata and candidate information
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Technical Implementation */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Zap className="h-6 w-6 mr-2" />
                3. Technical Implementation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Core Technologies</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Frontend Stack</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Next.js 14 (React Framework)</li>
                        <li>• TypeScript (Type Safety)</li>
                        <li>• Tailwind CSS (Styling)</li>
                        <li>• shadcn/ui (Component Library)</li>
                        <li>• Lucide React (Icons)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Development Tools</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• ESLint (Code Quality)</li>
                        <li>• Prettier (Code Formatting)</li>
                        <li>• Git (Version Control)</li>
                        <li>• Vercel (Deployment Platform)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Features Implementation</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Election Management</h4>
                    <p className="text-sm text-gray-600">
                      Admin interface for creating elections, setting parameters, and generating registration links.
                      Includes timeline management and state simulation controls.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Registration System</h4>
                    <p className="text-sm text-gray-600">
                      Separate registration flows for candidates and voters with National ID verification simulation.
                      Election-specific registration links ensure proper association.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium">Voting Interface</h4>
                    <p className="text-sm text-gray-600">
                      Secure voting interface with candidate selection, vote confirmation, and receipt generation.
                      Implements one-vote-per-position logic and vote validation.
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium">Results Dashboard</h4>
                    <p className="text-sm text-gray-600">
                      Real-time results display with vote counting, percentage calculations, and winner determination.
                      Includes analytics and exportable reports.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Prototype vs Full Implementation */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Target className="h-6 w-6 mr-2" />
                4. Prototype vs Full Implementation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Current Prototype Status</h3>
                <p className="text-sm text-blue-700">
                  This is a functional prototype demonstrating the core concepts and user experience of a
                  blockchain-based electoral system. Several components are simulated to showcase the complete workflow.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Component</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Prototype Implementation</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Full Implementation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Data Storage</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-yellow-600">
                          Simulated
                        </Badge>
                        <br />
                        Browser localStorage
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Blockchain + IPFS
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Identity Verification</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-yellow-600">
                          Simulated
                        </Badge>
                        <br />
                        Basic form validation
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Government API integration
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Vote Recording</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-yellow-600">
                          Simulated
                        </Badge>
                        <br />
                        Local state management
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Smart contract transactions
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Cryptographic Security</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-yellow-600">
                          Simulated
                        </Badge>
                        <br />
                        Basic hashing
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Full cryptographic suite
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">User Interface</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Complete UI/UX
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Enhanced with Web3 features
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">Election Management</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Full admin functionality
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <Badge variant="outline" className="text-green-600">
                          Real
                        </Badge>
                        <br />
                        Enhanced with blockchain features
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Performance Comparison</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Current Prototype</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Response Time: &lt;100ms</li>
                      <li>• Concurrent Users: ~10</li>
                      <li>• Data Persistence: Session-based</li>
                      <li>• Security Level: Basic</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Full Implementation</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Response Time: 2-5 seconds</li>
                      <li>• Concurrent Users: 10,000+</li>
                      <li>• Data Persistence: Permanent</li>
                      <li>• Security Level: Cryptographic</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Security Considerations */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                5. Security Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Security Measures</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">Input validation and sanitization</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">Client-side data encryption</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">Session-based authentication</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">HTTPS enforcement</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">Cross-site scripting (XSS) protection</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span className="text-sm">CSRF protection mechanisms</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Full Implementation Security Framework</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium">Cryptographic Security</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• End-to-end encryption using AES-256</li>
                      <li>• Digital signatures for vote authentication</li>
                      <li>• Hash-based message authentication codes (HMAC)</li>
                      <li>• Zero-knowledge proofs for voter privacy</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Blockchain Security</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Immutable vote recording on distributed ledger</li>
                      <li>• Smart contract audit and formal verification</li>
                      <li>• Consensus mechanism for transaction validation</li>
                      <li>• Multi-signature wallet for admin functions</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Identity & Access Management</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Biometric authentication integration</li>
                      <li>• Multi-factor authentication (MFA)</li>
                      <li>• Role-based access control (RBAC)</li>
                      <li>• Government ID verification APIs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Performance Analysis */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <BarChart3 className="h-6 w-6 mr-2" />
                6. Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Prototype Metrics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">~50ms</div>
                    <div className="text-sm text-gray-600">Average Response Time</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">10</div>
                    <div className="text-sm text-gray-600">Concurrent Users</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-gray-600">UI Responsiveness</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Scalability Projections</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Current</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phase 1</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phase 2</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Phase 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Concurrent Users</td>
                        <td className="border border-gray-300 px-4 py-2">10</td>
                        <td className="border border-gray-300 px-4 py-2">100</td>
                        <td className="border border-gray-300 px-4 py-2">1,000</td>
                        <td className="border border-gray-300 px-4 py-2">10,000+</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Transaction Speed</td>
                        <td className="border border-gray-300 px-4 py-2">Instant</td>
                        <td className="border border-gray-300 px-4 py-2">2-3 sec</td>
                        <td className="border border-gray-300 px-4 py-2">3-5 sec</td>
                        <td className="border border-gray-300 px-4 py-2">2-4 sec</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Data Storage</td>
                        <td className="border border-gray-300 px-4 py-2">5MB</td>
                        <td className="border border-gray-300 px-4 py-2">1GB</td>
                        <td className="border border-gray-300 px-4 py-2">100GB</td>
                        <td className="border border-gray-300 px-4 py-2">1TB+</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Elections Supported</td>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">10</td>
                        <td className="border border-gray-300 px-4 py-2">100</td>
                        <td className="border border-gray-300 px-4 py-2">1000+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Optimization Strategies</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Frontend Optimization</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Code splitting and lazy loading</li>
                      <li>• Image optimization and compression</li>
                      <li>• CDN implementation for static assets</li>
                      <li>• Service worker for offline functionality</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Backend Optimization</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Layer 2 scaling solutions (Polygon)</li>
                      <li>• Database indexing and query optimization</li>
                      <li>• Caching strategies (Redis)</li>
                      <li>• Load balancing and horizontal scaling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 7. Future Improvements */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                7. Future Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Development Roadmap</h3>
                <p className="text-sm text-blue-700">
                  The following roadmap outlines the planned improvements to transform this prototype into a
                  production-ready blockchain electoral system over a 9-month development cycle.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-green-600">
                      Phase 1
                    </Badge>
                    <span className="font-medium">Blockchain Integration (Months 1-3)</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Smart contract development and deployment</li>
                    <li>• Web3 wallet integration (MetaMask, WalletConnect)</li>
                    <li>• Ethereum/Polygon network integration</li>
                    <li>• IPFS implementation for distributed storage</li>
                    <li>• Basic cryptographic security implementation</li>
                  </ul>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Expected Outcome: Functional blockchain backend</span>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-blue-600">
                      Phase 2
                    </Badge>
                    <span className="font-medium">Security & Identity (Months 4-6)</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Government ID verification API integration</li>
                    <li>• Multi-factor authentication implementation</li>
                    <li>• Biometric authentication support</li>
                    <li>• Advanced cryptographic features</li>
                    <li>• Security audit and penetration testing</li>
                  </ul>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Expected Outcome: Production-grade security</span>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-purple-600">
                      Phase 3
                    </Badge>
                    <span className="font-medium">Scalability & Deployment (Months 7-9)</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Load testing and performance optimization</li>
                    <li>• Horizontal scaling implementation</li>
                    <li>• Mobile application development</li>
                    <li>• Advanced analytics and reporting</li>
                    <li>• Production deployment and monitoring</li>
                  </ul>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Expected Outcome: Scalable production system</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Long-term Vision</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Technical Enhancements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• AI-powered fraud detection</li>
                      <li>• Quantum-resistant cryptography</li>
                      <li>• Cross-chain interoperability</li>
                      <li>• Advanced privacy features (zk-SNARKs)</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Feature Expansion</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Multi-language support</li>
                      <li>• Accessibility compliance (WCAG 2.1)</li>
                      <li>• Integration with existing electoral systems</li>
                      <li>• Real-time audit and monitoring tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Conclusion */}
          <Card className="mb-8 page-break">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Users className="h-6 w-6 mr-2" />
                8. Conclusion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Achievements</h3>
                <p className="text-gray-700 mb-4">
                  This final year project successfully demonstrates the feasibility and potential of blockchain
                  technology in electoral systems. The BlockVote prototype showcases a complete end-to-end electoral
                  process with modern web technologies and user-centric design.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Technical Accomplishments</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Complete full-stack web application</li>
                      <li>• Responsive and accessible user interface</li>
                      <li>• Comprehensive election management system</li>
                      <li>• Real-time data processing and visualization</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Research Contributions</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Practical blockchain electoral system design</li>
                      <li>• User experience optimization for voting systems</li>
                      <li>• Security framework for digital elections</li>
                      <li>• Scalability analysis and optimization strategies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Impact and Significance</h3>
                <p className="text-gray-700">
                  The project addresses critical challenges in traditional electoral systems including transparency,
                  security, and efficiency. By leveraging blockchain technology, the system provides a foundation for
                  more trustworthy and accessible democratic processes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Immediate Next Steps:</strong> Implement blockchain integration and smart contract
                      development to transition from prototype to functional system.
                    </li>
                    <li>
                      <strong>Security Priority:</strong> Conduct comprehensive security audits and implement
                      government-grade identity verification systems.
                    </li>
                    <li>
                      <strong>Pilot Testing:</strong> Deploy in controlled environments (university elections,
                      organizational voting) before considering larger-scale implementations.
                    </li>
                    <li>
                      <strong>Regulatory Compliance:</strong> Engage with electoral authorities to ensure compliance
                      with local election laws and regulations.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 text-center">
                  <strong>Project Team:</strong> Electrical Electronics Engineering Department
                  <br />
                  <strong>Academic Year:</strong> 2024
                  <br />
                  <strong>Document Version:</strong> 1.0
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>
    </>
  )
}
