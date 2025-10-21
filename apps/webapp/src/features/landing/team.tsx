export const Team = () => (
	<section id="team" className="py-20 px-4 bg-white">
		<div className="container mx-auto max-w-6xl">
			<div className="text-center mb-16">
				<h2 className="text-3xl md:text-4xl font-bold mb-4">Project Team</h2>
				<p className="text-lg text-gray-600 max-w-3xl mx-auto">
					Electrical Electronics Engineering students collaborating on this
					blockchain electoral system research project.
				</p>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
				{/* Team Member 1 */}
				<div className="text-center">
					<div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
						<img
							src="/placeholder.svg?height=200&width=200"
							alt="Sarah Johnson"
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="text-xl font-bold">Sarah Johnson</h3>
				</div>

				{/* Team Member 2 */}
				<div className="text-center">
					<div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
						<img
							src="/placeholder.svg?height=200&width=200"
							alt="Michael Okonkwo"
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="text-xl font-bold">Michael Okonkwo</h3>
				</div>

				{/* Team Member 3 */}
				<div className="text-center">
					<div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
						<img
							src="/placeholder.svg?height=200&width=200"
							alt="Amina Patel"
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="text-xl font-bold">Amina Patel</h3>
				</div>

				{/* Team Member 4 */}
				<div className="text-center">
					<div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
						<img
							src="/placeholder.svg?height=200&width=200"
							alt="David Chen"
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="text-xl font-bold">David Chen</h3>
				</div>
			</div>
		</div>
	</section>
);
