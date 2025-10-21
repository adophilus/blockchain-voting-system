import Backend from "@/features/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Storage } from "@/features/storage";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

interface ElectionDetailsPageProps {
	electionId: string;
}

export function ElectionDetailsPage({ electionId }: ElectionDetailsPageProps) {
	const { data: electionDetailsData } = useSuspenseQuery({
		queryKey: ["ELECTION", electionId, "GET"],
		queryFn: async () => {
			const res = await Backend.Client.client.request(
				"get",
				"/elections/{electionId}",
				{
					params: {
						path: { electionId },
					},
				},
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

	const { data: votersData } = useSuspenseQuery({
		queryKey: ["ELECTION", electionId, "VOTERS", "GET"],
		queryFn: async () => {
			const res = await Backend.Client.client.request(
				"get",
				"/elections/{electionId}/voters",
				{
					params: {
						path: { electionId },
					},
				},
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

	const election = electionDetailsData.data.election;
	const positions = electionDetailsData.data.positions;
	const voters = votersData.data;

	const endElectionMutation = useMutation({
		mutationFn: async () => {
			const res = await Backend.Client.client.request(
				"post",
				"/elections/{electionId}/end",
				{ params: { path: { electionId } } },
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

	const handleEndElection = async () => {
		let status: "SUCCESS" | "ERROR";
		toast.promise(endElectionMutation.mutateAsync(), {
			loading: "Ending election...",
			error: (err) => {
				status = "ERROR";
				return err.message || "Failed to end election. Please try again.";
			},
			success: () => {
				status = "SUCCESS";
				return "Election ended successfully!";
			},
			finally: () => {
				// Optional: any cleanup or further actions
			},
		});
	};

	const handleEditPosition = (positionId: string) => {
		toast.info(`Editing position ${positionId}`);
	};

	const handleEditCandidate = (candidateId: string) => {
		toast.info(`Editing candidate ${candidateId}`);
	};

	// Function to get badge variant based on status
	const getStatusVariant = (status: string) => {
		switch (status) {
			case "UPCOMING":
				return "secondary";
			case "ONGOING":
				return "default";
			case "COMPLETED":
				return "outline";
			default:
				return "default";
		}
	};

	console.log(positions);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle>Election Details</CardTitle>
					{election.status === "ONGOING" && (
						<Button
							variant="destructive"
							size="sm"
							onClick={handleEndElection}
							disabled={endElectionMutation.isPending}
						>
							{endElectionMutation.isPending ? "Ending..." : "End Election"}
						</Button>
					)}
				</CardHeader>
				<CardContent className="grid gap-4">
					<p>
						<strong>Title:</strong> {election.title}
					</p>
					<p>
						<strong>Description:</strong> {election.description}
					</p>
					<p>
						<strong>Start Date:</strong>{" "}
						{format(new Date(election.start_timestamp), "PPP")}
					</p>
					<p>
						<strong>End Date:</strong>{" "}
						{format(new Date(election.end_timestamp), "PPP")}
					</p>
					<p>
						<strong>Status:</strong>{" "}
						<Badge variant={getStatusVariant(election.status)}>
							{election.status}
						</Badge>
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Positions</CardTitle>
				</CardHeader>
				<CardContent>
					{positions.map((position) => (
						<div key={position.id} className="mb-4 border p-4 rounded-md">
							<h3 className="font-semibold flex items-center justify-between">
								{position.title}
								{/*<Button
									variant="ghost"
									size="icon"
									onClick={() => handleEditPosition(position.id)}
								>
									<EditIcon className="h-4 w-4" />
								</Button>*/}
							</h3>
							<p>{position.description}</p>
							<h4 className="mt-2 font-medium">Candidates:</h4>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Image</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>Bio</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{position.candidates.map((candidate) => (
										<TableRow key={candidate.id}>
											<TableCell>
												{candidate.image ? (
													<img
														src={Storage.resolve(candidate.image.id)}
														alt={candidate.name}
														className="h-16 w-16 object-cover rounded-md"
													/>
												) : (
													<div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
														<span className="text-xs text-gray-500">
															No Image
														</span>
													</div>
												)}
											</TableCell>
											<TableCell>{candidate.name}</TableCell>
											<TableCell>{candidate.bio}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					))}
				</CardContent>
			</Card>

			{/*<Card>
				<CardHeader>
					<CardTitle>Voter Codes</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>S/N</TableHead>
								<TableHead>Voter ID</TableHead>
								<TableHead>Code</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{voters.map((voter, index) => (
								<TableRow key={voter.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{voter.id}</TableCell>
									<TableCell>{voter.code}</TableCell>
									<TableCell>
										<Badge
											variant={
												voter.status === "VOTED" ? "default" : "secondary"
											}
										>
											{voter.status}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>*/}
		</div>
	);
}
