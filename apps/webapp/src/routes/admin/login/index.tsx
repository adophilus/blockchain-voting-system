import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft, AlertCircle } from "lucide-react";
import Backend from "@/features/backend";
import Auth from "@/features/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/admin/login/")({
	component: AdminLoginPage,
});

const loginSchema = z.object({
	email: z
		.string()
		.email("Invalid email address")
		.nonempty("Email is required"),
	password: z.string(),
});

function AdminLoginPage() {
	const navigate = Route.useNavigate();

	// const { status, mutate } = Backend.Client.$api.useMutation(
	const { status, mutate } = useMutation({
		mutationFn: async (payload: { email: string; password: string }) => {
			const res = await Backend.Client.client.request(
				"post",
				"/auth/sign-in/email",
				{
					body: payload,
				},
			);

			if (res.error) {
				throw new Error(res.error.code);
			}

			return res.data;
		},
		onSuccess: ({ data }) => {
			Auth.Store.login({
				token: data.tokens.access_token,
				user: {
					...data.user,
					role: "admin",
				},
			});

			navigate({
				to: "/admin/dashboard",
			});
		},
	});

	const form = useForm({
		defaultValues: import.meta.env.PROD
			? {}
			: {
					email: "admin@university.edu",
					password: "admin123",
				},
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (value: z.infer<typeof loginSchema>) => {
		mutate({
			body: value,
		});
	};

	const isSubmitting = status === "pending";

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="p-4 bg-slate-600 rounded-full">
							<Shield className="h-8 w-8 text-white" />
						</div>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
						Admin Login
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Access the election management dashboard
					</p>
				</div>

				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle>Administrator Access</CardTitle>
						<CardDescription>
							Enter your admin credentials to continue
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="space-y-4"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className="space-y-2">
													<FormLabel>Email</FormLabel>
													<Input
														{...field}
														type="email"
														placeholder="admin@university.edu"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<div className="space-y-2">
													<FormLabel>Password</FormLabel>
													<Input
														{...field}
														type="password"
														placeholder="admin123"
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Signing in..." : "Sign In"}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>

				<div className="text-center mt-6">
					<Button variant="ghost" onClick={() => navigate({ to: "/" })}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
}
