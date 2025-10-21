import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Storage } from "@/features/storage";
import { CheckCircle, AlertCircle, User, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import type {
	Election,
	Position,
} from "@blockchain-voting-system/backend/types";
import { useState } from "react";
import Backend from "@/features/backend";
import { useMutation } from "@tanstack/react-query";

interface ElectionVotingBallotProps {
	election: Election.Selectable;
	positions: Position.Selectable[];
	voterCode: string;
	electionId: string;
	onVoteSubmitted: () => void;
}

export function ElectionVotingBallot({
	election,
	positions,
	voterCode,
	electionId,
	onVoteSubmitted,
}: ElectionVotingBallotProps) {
	const [selectedCandidates, setSelectedCandidates] = useState<
		Record<string, string>
	>({});
	const { mutateAsync, status } = useMutation({
		mutationFn: async ({
			electionId,
			voterCode,
			votes,
		}: { electionId: string; voterCode: string; votes: any }) => {
			const res = await Backend.Client.client.request(
				"post",
				"/elections/{electionId}/voters/submit",
				{
					params: { path: { electionId } },
					body: {
						election_id: electionId,
						voter_code: voterCode,
						votes,
					},
				},
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

	const isLoading = status === "pending";

	const handleCandidateSelect = (positionId: string, candidateId: string) => {
		setSelectedCandidates((prev) => ({
			...prev,
			[positionId]: candidateId,
		}));
	};

	const handleSubmitVote = async () => {
		const votes = Object.entries(selectedCandidates).map(
			([positionId, candidateId]) => ({
				position_id: positionId,
				candidate_id: candidateId,
			}),
		);

		await mutateAsync({
			electionId,
			voterCode,
			votes,
		});
	};

	const onSubmit = async () => {
		let status: "SUCCESS" | "ERROR";

		toast.promise(handleSubmitVote(), {
			success: () => {
				status = "SUCCESS";
				return "Vote submitted successfully";
			},
			error: () => {
				status = "ERROR";
				return "Failed to submit vote";
			},
			finally: () => {
				if (status === "SUCCESS") {
					onVoteSubmitted();
				}
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					Cast Your Vote
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Select one candidate for each position
				</p>
			</div>

			{positions.map((position) => (
				<Card key={position.id}>
					<CardHeader>
						<CardTitle>{position.title}</CardTitle>
						<CardDescription>{position.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap justify-center gap-4">
							{position.candidates.map((candidate) => (
								<div
									key={candidate.id}
									className={`relative p-4 border rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center text-center w-40 h-40 ${
										selectedCandidates[position.id] === candidate.id
											? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
											: "border-gray-200 hover:border-gray-300"
									}`}
									onClick={() =>
										handleCandidateSelect(position.id, candidate.id)
									}
								>
									<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
										{candidate.image ? (
											<img
												src={Storage.resolve(candidate.image.id)}
												alt={candidate.name}
												className="w-full h-full object-cover"
											/>
										) : (
											<User className="h-12 w-12 text-gray-600" />
										)}
									</div>
									<div className="w-full">
										<h4 className="font-medium text-base truncate">
											{candidate.name}
										</h4>
										<p className="text-sm text-gray-500 dark:text-gray-400 truncate">
											{candidate.bio}
										</p>
									</div>
									{selectedCandidates[position.id] === candidate.id && (
										<CheckCircle className="h-5 w-5 text-blue-600 absolute top-2 right-2" />
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			))}

			<div className="text-center">
				<Button
					onClick={onSubmit}
					size="lg"
					disabled={
						isLoading ||
						Object.keys(selectedCandidates).length !== positions.length
					}
				>
					{isLoading ? "Submitting Vote..." : "Submit Vote"}
				</Button>
			</div>
		</div>
	);
}
