import { Vote } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="container mx-auto max-w-6xl px-4 py-8">
				<div className="text-center">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<Vote className="h-6 w-6 text-blue-400" />
						<span className="text-lg font-bold text-white">BVS</span>
					</div>
					<p className="text-sm mb-4">
						Final Year Project - Electrical Electronics Engineering Department
					</p>
					<p className="text-sm text-gray-400">
						A research prototype exploring blockchain-based electoral systems
					</p>
				</div>
			</div>
		</footer>
	);
}
