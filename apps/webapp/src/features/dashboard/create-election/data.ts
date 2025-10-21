export const defaultValues = import.meta.env.PROD
	? {}
	: {
			title: "Organizational Election 2025",
			description: "Annual election for leadership positions",
			startDate: new Date(),
			endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
			positions: [
				{
					title: "President",
					description: "Lead the organization",
					maxCandidates: 1,
					candidates: [
						{ name: "Chinecherem Micheal", bio: "Respire to aspire" },
						{ name: "Marcus Oraekwu", bio: "Bold steps must be taken" },
					],
				},
				{
					title: "Vice President",
					description: "Support the president",
					maxCandidates: 1,
					candidates: [
						{ name: "Janet Nwankwo", bio: "Be the best you can possibly be" },
						{ name: "Maria Ndikom", bio: "Creative problem solver" },
					],
				},
			],
			numberOfVoters: 100,
		};
