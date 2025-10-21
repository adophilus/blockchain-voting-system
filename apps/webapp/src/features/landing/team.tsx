type TeamMember = {
	name: string;
	image: string;
};

const teamMembers: TeamMember[] = [
	{
		name: "Adolphus Patrick Micheal",
		image: "https://via.placeholder.com/200",
	},
	{
		name: "Uba Ebube Anthony",
		image: "https://via.placeholder.com/200",
	},
	{
		name: "Ufot Nissi Edwin",
		image: "https://via.placeholder.com/200",
	},
];

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
				{teamMembers.map((member, index) => (
					<div key={index} className="text-center">
						<div className="relative mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
							<img
								src={member.image}
								alt={member.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<h3 className="text-xl font-bold">{member.name}</h3>
					</div>
				))}
			</div>
		</div>
	</section>
);
