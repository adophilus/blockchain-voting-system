"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowLeft,
	Calendar,
	Users,
	UserCheck,
	Copy,
	ExternalLink,
} from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";

interface Election {
	id: string;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	status: "Draft" | "Active" | "Ended";
	positions: string[];
	voterRegistrationLink: string;
	candidateRegistrationLink: string;
	voterCount: number;
	candidateCount: number;
}

export default function ElectionDetailsPage({
	params,
}: {
	params: { id: string };
}) {
	const [election, setElection] = useState<Election | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		// In a real app, fetch election by ID
		const mockElection: Election = {
			id: params.id,
			title: "2024 Presidential Election",
			description:
				"National presidential election to elect the next President of Nigeria",
			startDate: "2024-02-25T08:00",
			endDate: "2024-02-25T18:00",
			status: "Active",
			positions: ["President", "Vice President"],
			voterRegistrationLink: `https://blockvote.example/voter/register?election=${params.id}`,
			candidateRegistrationLink: `https://blockvote.example/candidate/register?election=${params.id}`,
			voterCount: 1245,
			candidateCount: 3,
		};
		setElection(mockElection);
	}, [params.id]);

	const copyToClipboard = (text: string, type: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: "Link Copied",
			description: `${type} link has been copied to clipboard.`,
		});
	};

	if (!election) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
				<div>Loading election details...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="mx-auto max-w-4xl">
				<div className="mb-6">
					<Link
						href="/admin/election-management"
						className="inline-flex items-center text-blue-600 hover:text-blue-800"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Election Management
					</Link>
				</div>

				<Card className="mb-6">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-2xl">{election.title}</CardTitle>
								<CardDescription className="text-lg mt-1">
									{election.description}
								</CardDescription>
							</div>
							<Badge
								variant={
									election.status === "Active"
										? "default"
										: election.status === "Ended"
											? "destructive"
											: "outline"
								}
								className="text-sm px-3 py-1"
							>
								{election.status}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-4 gap-4">
							<div className="bg-blue-50 p-4 rounded-lg text-center">
								<Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
								<div className="text-sm text-gray-500">Start Date</div>
								<div className="font-medium">
									{new Date(election.startDate).toLocaleDateString()}
								</div>
							</div>
							<div className="bg-orange-50 p-4 rounded-lg text-center">
								<Calendar className="h-6 w-6 mx-auto mb-2 text-orange-600" />
								<div className="text-sm text-gray-500">End Date</div>
								<div className="font-medium">
									{new Date(election.endDate).toLocaleDateString()}
								</div>
							</div>
							<div className="bg-green-50 p-4 rounded-lg text-center">
								<UserCheck className="h-6 w-6 mx-auto mb-2 text-green-600" />
								<div className="text-sm text-gray-500">Registered Voters</div>
								<div className="font-medium text-xl">{election.voterCount}</div>
							</div>
							<div className="bg-purple-50 p-4 rounded-lg text-center">
								<Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
								<div className="text-sm text-gray-500">Candidates</div>
								<div className="font-medium text-xl">
									{election.candidateCount}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid md:grid-cols-2 gap-6">
					{/* Candidate Registration */}
					<Card>
						<CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
							<CardTitle className="flex items-center space-x-2">
								<Users className="h-5 w-5 text-purple-600" />
								<span>Candidate Registration</span>
							</CardTitle>
							<CardDescription>
								Share this link with potential candidates for this election
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div className="bg-gray-50 p-3 rounded-lg">
									<div className="text-xs text-gray-500 mb-1">
										Registration Link
									</div>
									<div className="font-mono text-sm break-all">
										{election.candidateRegistrationLink}
									</div>
								</div>
								<div className="flex space-x-2">
									<Button
										onClick={() =>
											copyToClipboard(
												election.candidateRegistrationLink,
												"Candidate registration",
											)
										}
										className="flex-1"
										variant="outline"
									>
										<Copy className="h-4 w-4 mr-2" />
										Copy Link
									</Button>
									<Link
										href={`/candidate/register?election=${election.id}`}
										target="_blank"
									>
										<Button variant="outline">
											<ExternalLink className="h-4 w-4 mr-2" />
											Test Link
										</Button>
									</Link>
								</div>
								<div className="text-sm text-gray-600">
									<strong>Available Positions:</strong>{" "}
									{election.positions.join(", ")}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Voter Registration */}
					<Card>
						<CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
							<CardTitle className="flex items-center space-x-2">
								<UserCheck className="h-5 w-5 text-green-600" />
								<span>Voter Registration</span>
							</CardTitle>
							<CardDescription>
								Share this link with eligible voters for this election
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div className="bg-gray-50 p-3 rounded-lg">
									<div className="text-xs text-gray-500 mb-1">
										Registration Link
									</div>
									<div className="font-mono text-sm break-all">
										{election.voterRegistrationLink}
									</div>
								</div>
								<div className="flex space-x-2">
									<Button
										onClick={() =>
											copyToClipboard(
												election.voterRegistrationLink,
												"Voter registration",
											)
										}
										className="flex-1"
										variant="outline"
									>
										<Copy className="h-4 w-4 mr-2" />
										Copy Link
									</Button>
									<Link
										href={`/voter/register?election=${election.id}`}
										target="_blank"
									>
										<Button variant="outline">
											<ExternalLink className="h-4 w-4 mr-2" />
											Test Link
										</Button>
									</Link>
								</div>
								<div className="text-sm text-gray-600">
									Voters will register with their NIN and personal information
									for this specific election.
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card className="mt-6">
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Manage this election</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-3">
							<Link href={`/admin/results-dashboard?election=${election.id}`}>
								<Button variant="outline">View Results</Button>
							</Link>
							<Link href={`/voter/vote?election=${election.id}`}>
								<Button variant="outline">Test Voting Interface</Button>
							</Link>
							<Button variant="outline">Edit Election</Button>
							<Button variant="destructive">Delete Election</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
