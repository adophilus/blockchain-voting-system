import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import Backend from "@/features/backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Auth from "@/features/auth";
import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ElectionVoterVerification } from "@/features/election/voting/ElectionVoterVerification";
import { ElectionHeader } from "@/features/election/voting/ElectionHeader";

export const Route = createFileRoute("/election/$id/")({
	beforeLoad: ({ params }) => {
		const authState = Auth.Store.store.state;
		if (authState.status === "authenticated") {
			const user = authState.user as any; // FIXME: Add proper type for user
			if (user.role === "voter" && user.electionId === params.id) {
				throw redirect({
					to: "/election/$id/vote",
					params,
				});
			}
		}
	},
	component: Component,
});

function VoterAuthRouteComponent() {
	const { id: electionId } = Route.useParams();
	const navigate = useNavigate();

	const { data: electionData, error } = useSuspenseQuery({
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

	const handleVoterVerified = (voterCode: string) => {
		const handleVoterAuth = async (code: string) => {
			const response = await Backend.Client.client.request(
				"post",
				"/auth/sign-in/voter-code",
				{
					body: {
						voter_code: code,
						election_id: electionId,
					},
				},
			);

			if (response.error) {
				throw new Error(response.error.code);
			}

			Auth.Store.login({
				token: response.data.data.tokens.access_token,
				user: {
					role: "voter",
					id: response.data.data.voter.id,
					code: response.data.data.voter.code,
					election_id: response.data.data.voter.election_id,
				},
			});
		};

		let status: "SUCCESS" | "ERROR";
		toast.promise(handleVoterAuth(voterCode), {
			loading: "Authenticating...",
			error: (err) => {
				status = "ERROR";
				return err.message || "Authentication failed.";
			},
			success: () => {
				status = "SUCCESS";
				return "Successfully authenticated!";
			},
			finally: () => {
				if (status === "SUCCESS") {
					navigate({
						to: "/election/$id/vote",
						params: { id: electionId },
					});
				}
			},
		});
	};

	if (error || !electionData?.data) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
						<CardTitle>Election Not Found</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-600 dark:text-gray-400">
							The requested election could not be found.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
			<div className="container mx-auto max-w-4xl">
				<ElectionHeader election={electionData.data.election} />
				<ElectionVoterVerification
					electionId={electionId}
					onVoterVerified={handleVoterVerified}
					election={electionData.data.election}
				/>
			</div>
		</div>
	);
}

function Component() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					fallbackRender={({ error, resetErrorBoundary }) => (
						<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
							<Card className="w-full max-w-md text-center">
								<CardHeader>
									<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
									<CardTitle>Error Loading Election</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400">
										There was an error loading the election: {error.message}
									</p>
									<Button
										onClick={() => resetErrorBoundary()}
										className="mt-4 w-full"
									>
										Try again
									</Button>
								</CardContent>
							</Card>
						</div>
					)}
				>
					<VoterAuthRouteComponent />
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
