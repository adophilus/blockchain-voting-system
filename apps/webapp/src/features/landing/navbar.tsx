import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Vote, Menu, X } from "lucide-react";

export function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="bg-white border-b border-gray-100 sticky top-0 z-40">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center space-x-2">
							<Vote className="h-8 w-8 text-blue-600" />
							<span className="text-xl font-bold text-gray-900">BVS</span>
						</Link>
					</div>

					{/* Desktop Navigation - Simplified for academic project */}
					<nav className="hidden md:flex items-center space-x-8">
						<a
							href="https://bvs.magicstudios.fun"
							className="text-gray-600 hover:text-blue-600 transition-colors"
						>
							Documentation
						</a>
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							type="button"
							className="text-gray-500 hover:text-gray-700"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden bg-white border-t border-gray-100 py-4">
					<div className="container mx-auto px-4 space-y-3">
						<a
							href="https://bvs.magicstudios.fun"
							className="block py-2 text-gray-600 hover:text-blue-600"
							onClick={() => setIsMenuOpen(false)}
						>
							Documentation
						</a>
					</div>
				</div>
			)}
		</header>
	);
}
