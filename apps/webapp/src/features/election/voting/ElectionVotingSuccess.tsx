import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Election } from "@blockchain-voting-system/backend/types";

interface ElectionVotingSuccessProps {
	election: Election.Selectable;
	electionId: string;
}

export function ElectionVotingSuccess({
	election,
	electionId,
}: ElectionVotingSuccessProps) {
	return (
		<Card className="max-w-md mx-auto text-center">
			<CardHeader>
				<CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
				<CardTitle className="text-2xl">Vote Submitted Successfully!</CardTitle>
				<CardDescription>
					Thank you for participating in the election. Your vote has been
					recorded.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
					Your vote is secure and anonymous. You can view the realtime results
					using the link below
				</p>
				<Button asChild>
					<a href={`/election/${electionId}/results`}>View Results</a>
				</Button>
			</CardContent>
		</Card>
	);
}
