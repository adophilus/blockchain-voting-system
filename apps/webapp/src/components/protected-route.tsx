"use client";

import { useAuth } from "@/src/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
	children,
	requiredRole,
}: {
	children: React.ReactNode;
	requiredRole?: string;
}) {
	const { isAuthenticated, userRole } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Redirect if not authenticated
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		// Redirect if user doesn't have required role
		if (requiredRole && userRole !== requiredRole) {
			router.push("/unauthorized");
		}
	}, [isAuthenticated, userRole, requiredRole, router]);

	// Show loading state while checking auth
	if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return <>{children}</>;
}
