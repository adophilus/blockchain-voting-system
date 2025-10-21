import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import Backend from "@/features/backend";
import { useState } from "react";
import { ElectionListTable } from "../ElectionListTable";
import { useSuspenseQuery } from "@tanstack/react-query";

export function DashboardElectionsPage() {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(100);

	const { data: electionsData } = useSuspenseQuery({
		queryKey: ["ELECTION", "LIST"],
		queryFn: async () => {
			const res = await Backend.Client.client.request("get", "/elections", {
				params: {
					query: {
						page,
						per_page: perPage,
					},
				},
			});

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

	const { data: metricsData } = useSuspenseQuery({
		queryKey: ["ELECTION_METRICS", "GET"],
		queryFn: async () => {
			const res = await Backend.Client.client.request(
				"get",
				"/elections/metrics",
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
	});

	const elections = electionsData.data.data;
	const meta = electionsData.data.meta;

	const totalPages = meta ? Math.ceil(meta.total / meta.per_page) : 1;

	return (
		<div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Elections
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{metricsData.data.total_elections}
						</div>
						<p className="text-xs text-muted-foreground">
							Total elections found
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Elections
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{metricsData.data.active_elections}
						</div>
						<p className="text-xs text-muted-foreground">Currently ongoing</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Completed Elections
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{metricsData.data.completed_elections}
						</div>
						<p className="text-xs text-muted-foreground">Finished elections</p>
					</CardContent>
				</Card>
			</div>
			<div className="mt-8">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Elections</h2>
					<Link to="/admin/dashboard/create-election">
						<Button>Create Election</Button>
					</Link>
				</div>
				<ElectionListTable
					elections={elections}
					meta={meta}
					page={page}
					setPage={setPage}
					perPage={perPage}
					setPerPage={setPerPage}
					totalPages={totalPages}
				/>
			</div>
		</div>
	);
}
