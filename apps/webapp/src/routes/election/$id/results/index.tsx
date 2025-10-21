import { createFileRoute } from "@tanstack/react-router";
import Backend from "@/features/backend";
import { ElectionResultsPage } from "@/features/election/results/ElectionResultsPage";
import {
	QueryErrorResetBoundary,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/election/$id/results/")({
	component: Component,
});

function ElectionResultsRouteComponent() {
	const { id: electionId } = Route.useParams();

	const { data: resultsData } = useSuspenseQuery({
		queryKey: ["ELECTION", electionId, "RESULTS", "GET"],
		queryFn: async () => {
			const res = await Backend.Client.client.request(
				"get",
				"/elections/{electionId}/results",
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

	return <ElectionResultsPage results={resultsData.data} />;
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
									<CardTitle>Error Loading Results</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600 dark:text-gray-400">
										There was an error loading the election results:{" "}
										{error.message}
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
					<ElectionResultsRouteComponent />
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
