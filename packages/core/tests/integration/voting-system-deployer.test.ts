import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainVotingSystemDeployer } from "../../src/voting-system-deployer/implementation";
import type { DeployedContractAddresses, DeploySystemError } from "../../src/voting-system-deployer/interface";
import { deployerWallet } from "../setup";

describe("BlockchainVotingSystemDeployer Integration Tests", () => {
	let deployer: BlockchainVotingSystemDeployer;
	let deployedAddresses: DeployedContractAddresses;

	beforeAll(() => {
		deployer = new BlockchainVotingSystemDeployer(deployerWallet);
	});

	it("should deploy all voting system contracts successfully", async () => {
		const result = await deployer.deploySystem();

		expect(result.isOk).toBe(true);

		if (result.isOk) {
			deployedAddresses = result.value;
			expect(deployedAddresses.votingSystem).toBeDefined();
			expect(deployedAddresses.voterRegistry).toBeDefined();
			expect(deployedAddresses.candidateRegistry).toBeDefined();
			expect(deployedAddresses.partyAddress).toBeDefined();

			// Basic address format check
			expect(deployedAddresses.votingSystem).toMatch(/^0x[0-9a-fA-F]{40}$/);
			expect(deployedAddresses.voterRegistry).toMatch(/^0x[0-9a-fA-F]{40}$/);
			expect(deployedAddresses.candidateRegistry).toMatch(
				/^0x[0-9a-fA-F]{40}$/,
			);
			expect(deployedAddresses.partyAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
		}
	}, 60000);
});