import "../../src/env";
import { defineConfig } from "vitepress";
import d2 from "vitepress-plugin-d2";
import { Layout, Theme, FileType } from "vitepress-plugin-d2/dist/config";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
// export default defineConfig({
export default withMermaid({
	title: "Blockchain Voting System",
	description: "Documentation for the Blockchain Voting System",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Smart Contracts", link: "/contracts/overview" },
			{ text: "Web Application", link: "/webapp/overview" },
			{ text: "API Reference", link: "/api" },
		],

		sidebar: [
			{
				text: "General Guide",
				items: [{ text: "Introduction", link: "/guide/introduction" }],
			},
			{
				text: "System Architecture",
				items: [
					{ text: "Overview", link: "/system-architecture" },
					{ text: "Detailed Diagram", link: "/architecture/system-diagram" },
					{
						text: "Component Explanations",
						link: "/architecture/system-architecture",
					},
					{
						text: "Workflow Diagrams",
						link: "/architecture/workflow-diagrams",
					},
				],
			},
			{
				text: "Smart Contracts",
				items: [
					{ text: "Overview", link: "/contracts/overview" },
					{ text: "Technical Details", link: "/contracts/technical-details" },
					{ text: "Flow of Operations", link: "/contracts/tasks" },
					{ text: "Deployment", link: "/contracts/deployment" },
					{ text: "Testing", link: "/contracts/testing" },
				],
			},
			{
				text: "Frontend Interface Design",
				items: [
					{ text: "Interface Design", link: "/frontend/interface-design" },
				],
			},
			{
				text: "IPFS Integration",
				items: [
					{ text: "Overview", link: "/ipfs/overview" },
					{ text: "Usage", link: "/ipfs/usage" },
				],
			},
			{
				text: "Zero-Knowledge (ZK) Integration",
				items: [
					{ text: "Overview", link: "/zk/overview" },
					{ text: "Usage", link: "/zk/usage" },
					{ text: "Semaphore Integration", link: "/zk/semaphore-integration" },
					{ text: "Gasless Transactions", link: "/zk/gasless-transactions" },
					{ text: "Integration Plan", link: "/zk/integration-plan" },
					{ text: "ZK Integration Details", link: "/zk/integration" },
					{ text: "Developer Guide", link: "/zk/developer-guide" },
				],
			},
			{
				text: "Technical Information",
				items: [{ text: "Technical Overview", link: "/technical-overview" }],
			},
			{
				text: "Project Report Materials",
				items: [
					{
						text: "Materials and Methods",
						link: "/project-report/materials-and-methods",
					},
				],
			},
			{
				text: "Further Improvements",
				items: [{ text: "Token-Based Identity", link: "/further-improvement" }],
			},
		],
	},
	markdown: {
		config: (md) => {
			// Use D2 diagram plugin with optional configuration
			md.use(d2, {
				forceAppendix: false,
				layout: Layout.ELK,
				theme: Theme.VANILLA_NITRO_COLA,
				darkTheme: Theme.DARK_MUAVE,
				padding: 100,
				animatedInterval: 0,
				timeout: 120,
				sketch: true,
				center: false,
				scale: -1,
				target: "*",
				fontItalic: null,
				fontBold: null,
				fontSemiBold: null,
				fileType: FileType.SVG,
				directory: "d2-diagrams",
			});
		},
	},
});
