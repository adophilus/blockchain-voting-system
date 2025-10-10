import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainVotingSystemDeployer } from "../../src/voting-system-deployer/implementation";
import { deployerWallet } from "../setup";
import { assert } from "../../src/lib/assert";
import { isAddress } from "viem";

describe("BlockchainVotingSystemDeployer Integration Tests", () => {
	let deployer: BlockchainVotingSystemDeployer;
	let deployedAddress: string;

	beforeAll(() => {
		deployer = new BlockchainVotingSystemDeployer(deployerWallet);
	});

	it("should deploy all voting system contracts successfully", async () => {
		const result = await deployer.deploySystem();

		expect(result.isOk).toBe(true);

		if (result.isOk) {
			deployedAddress = result.value;
			expect(deployedAddress).toBeDefined();

			assert(isAddress(deployedAddress), "ERR_OPERATION_FAILED");
		}
	});
});
