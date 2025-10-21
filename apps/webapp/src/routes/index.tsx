import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/features/landing/navbar";
import { Footer } from "@/features/landing/footer";
import {
	Vote,
	Shield,
	Clock,
	LineChart,
	Users,
	CheckCircle,
	Lock,
	Layers,
	Globe,
} from "lucide-react";
import { Team } from "@/features/landing/team";
import { docsUrl } from "@/features/landing/data";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />

			{/* Hero Section */}
			<section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-20 px-4">
				<div className="container mx-auto max-w-6xl">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
								Final Year Project - Electrical Electronics Engineering
							</div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
								Blockchain-Based <br />
								<span className="text-blue-600">Electoral System</span>
							</h1>
							<p className="text-lg text-gray-600 md:pr-10">
								A research prototype exploring the implementation of secure,
								transparent electoral processes using blockchain technology and
								smart contracts.
							</p>
						</div>
						<div className="relative">
							<div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>
							<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
								<div className="flex justify-between items-center mb-8">
									<div className="flex items-center space-x-3">
										<Vote className="h-8 w-8 text-blue-600" />
										<span className="text-xl font-bold">BlockVote</span>
									</div>
									<div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
										Active
									</div>
								</div>
								<div className="space-y-6">
									<div className="bg-gray-50 rounded-lg p-4">
										<div className="text-sm text-gray-500 mb-1">
											2025 Organizational Election
										</div>
										<div className="h-2 w-3/4 bg-blue-100 rounded-full">
											<div className="h-2 bg-blue-600 rounded-full w-[65%]"></div>
										</div>
										<div className="flex justify-between mt-1 text-xs text-gray-500">
											<span>65% Participation</span>
											<span>8 hours remaining</span>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-blue-50 p-4 rounded-lg text-center">
											<Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
											<div className="text-sm text-gray-500">Voters</div>
											<div className="font-bold text-xl">12,458</div>
										</div>
										<div className="bg-indigo-50 p-4 rounded-lg text-center">
											<CheckCircle className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
											<div className="text-sm text-gray-500">Votes Cast</div>
											<div className="font-bold text-xl">8,102</div>
										</div>
									</div>
									<div className="flex justify-center">
										<Link to="/admin/dashboard" className="w-full">
											<Button className="w-full">View Dashboard</Button>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section id="benefits" className="py-20 px-4 bg-white">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Research Findings: Blockchain Electoral Systems
						</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							Our research demonstrates how blockchain technology can address
							key challenges in traditional electoral systems through smart
							contract implementation.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Benefit 1 */}
						<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="pt-6">
								<div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									<Shield className="h-6 w-6 text-blue-600" />
								</div>
								<h3 className="text-xl font-bold mb-2">Tamper-Proof Records</h3>
								<p className="text-gray-600">
									Once a vote is recorded on the blockchain, it cannot be
									altered or deleted, ensuring the integrity of the electoral
									process.
								</p>
							</CardContent>
						</Card>

						{/* Benefit 2 */}
						<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="pt-6">
								<div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									<Globe className="h-6 w-6 text-green-600" />
								</div>
								<h3 className="text-xl font-bold mb-2">
									Transparent & Verifiable
								</h3>
								<p className="text-gray-600">
									All transactions are publicly verifiable while maintaining
									voter privacy, allowing anyone to audit the election results.
								</p>
							</CardContent>
						</Card>

						{/* Benefit 3 */}
						<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="pt-6">
								<div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									<Lock className="h-6 w-6 text-purple-600" />
								</div>
								<h3 className="text-xl font-bold mb-2">Enhanced Security</h3>
								<p className="text-gray-600">
									Cryptographic techniques ensure that votes cannot be tampered
									with, preventing fraud and manipulation.
								</p>
							</CardContent>
						</Card>

						{/* Benefit 4 */}
						<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="pt-6">
								<div className="bg-orange-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									<Clock className="h-6 w-6 text-orange-600" />
								</div>
								<h3 className="text-xl font-bold mb-2">Real-Time Results</h3>
								<p className="text-gray-600">
									Instant vote counting and result tabulation, eliminating
									delays and reducing the cost of traditional counting methods.
								</p>
							</CardContent>
						</Card>

						{/* Benefit 5 */}
						<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="pt-6">
								<div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									<Users className="h-6 w-6 text-red-600" />
								</div>
								<h3 className="text-xl font-bold mb-2">
									Increased Participation
								</h3>
								<p className="text-gray-600">
									Remote voting capabilities make participation easier,
									potentially increasing voter turnout and engagement.
								</p>
							</CardContent>
						</Card>

						{/* Benefit 6 */}
						<Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
							<CardContent className="pt-6">
								<div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
									<Layers className="h-6 w-6 text-indigo-600" />
								</div>
								<h3 className="text-xl font-bold mb-2">Cost Efficiency</h3>
								<p className="text-gray-600">
									Reduces the need for physical infrastructure, paper ballots,
									and manual counting, lowering the overall cost of elections.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="container mx-auto max-w-6xl">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							Key Features
						</h2>
						<p className="text-lg text-gray-600 max-w-3xl mx-auto">
							BlockVote provides a comprehensive suite of tools for managing
							secure, transparent elections.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-white p-8 rounded-xl shadow-lg">
							<h3 className="text-xl font-bold mb-4 flex items-center">
								<Vote className="h-5 w-5 text-blue-600 mr-2" />
								Election Management
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Create and configure elections with customizable parameters
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Generate unique registration links for candidates and voters
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Set election timelines with automatic start and end dates
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Monitor registration and voting statistics in real-time
									</span>
								</li>
							</ul>
						</div>

						<div className="bg-white p-8 rounded-xl shadow-lg">
							<h3 className="text-xl font-bold mb-4 flex items-center">
								<Users className="h-5 w-5 text-purple-600 mr-2" />
								Candidate & Voter Registration
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Secure identity verification using National Identity Numbers
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Election-specific registration links for candidates and
										voters
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Automated eligibility verification based on predefined
										criteria
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>Digital ID generation for registered participants</span>
								</li>
							</ul>
						</div>

						<div className="bg-white p-8 rounded-xl shadow-lg">
							<h3 className="text-xl font-bold mb-4 flex items-center">
								<Shield className="h-5 w-5 text-green-600 mr-2" />
								Secure Voting
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Blockchain-backed vote recording with immutable audit trail
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										One-vote-per-position enforcement to prevent double voting
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										End-to-end encryption for voter privacy protection
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Vote confirmation receipts with blockchain transaction IDs
									</span>
								</li>
							</ul>
						</div>

						<div className="bg-white p-8 rounded-xl shadow-lg">
							<h3 className="text-xl font-bold mb-4 flex items-center">
								<LineChart className="h-5 w-5 text-orange-600 mr-2" />
								Results & Analytics
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>Real-time vote counting and results tabulation</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Detailed analytics on voter demographics and participation
									</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>Exportable reports for official documentation</span>
								</li>
								<li className="flex items-start">
									<CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
									<span>
										Public results verification through blockchain explorer
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<Team />

			{/* CTA Section */}
			<section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
				<div className="container mx-auto max-w-4xl text-center">
					<h2 className="text-3xl md:text-4xl font-bold mb-6">
						Explore the Research Prototype
					</h2>
					<p className="text-xl mb-8 text-blue-100">
						Experience our blockchain-based electoral system implementation and
						explore the technical features.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a href={docsUrl} target="_blank" rel="noopener noreferrer">
							<Button size="lg" variant="secondary" className="h-12 px-6">
								View Documentation
							</Button>
						</a>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
