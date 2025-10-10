import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainVotingSystemDeployer } from "../../src/voting-system-deployer/implementation";
import { BlockchainVotingSystem } from "../../src/voting-system/implementation";
import type { DeployedContractAddresses } from "../../src/voting-system-deployer/interface";
import type { ElectionStatus } from "../../src/voting-system/interface";
import { deployerWallet, voter1Wallet, sleep } from "../setup";
import { assert } from "../../src/lib/assert";
import { getUnixTime } from "date-fns";

describe("BlockchainVotingSystem Integration Tests", () => {
	let deployer: BlockchainVotingSystemDeployer;
	let votingSystem: BlockchainVotingSystem;
	let contractAddresses: DeployedContractAddresses;

	beforeAll(async () => {
		// Deploy all contracts
		deployer = new BlockchainVotingSystemDeployer(deployerWallet);
		const deployResult = await deployer.deploySystem();
		assert(deployResult.isOk, "ERR_OPERATION_FAILED");
		contractAddresses = deployResult.value;

		// Initialize VotingSystem with deployer wallet
		votingSystem = new BlockchainVotingSystem(
			deployerWallet,
			contractAddresses,
		);
	});

	it("should register a voter successfully", async () => {
		const result = await votingSystem.registerVoter(voter1Wallet.getAddress());
		assert(result.isOk, "ERR_OPERATION_FAILED");

		const isVerifiedResult = await votingSystem.isVoterVerified(
			voter1Wallet.getAddress(),
		);
		assert(isVerifiedResult.isOk, "ERR_ASSERT_TRUE");
		assert(isVerifiedResult.value, "ERR_ASSERT_TRUE");
	});

	it("should register a candidate successfully", async () => {
		const result = await votingSystem.registerCandidate(
			"John Doe",
			"President",
			"QmJohnDoeCid",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(1); // First candidate gets ID 1

		const candidate = await votingSystem.getCandidate(1);
		assert(candidate.isOk, "ERR_OPERATION_FAILED");
		expect(candidate.value.name).toBe("John Doe");
	});

	it("should update a candidate successfully", async () => {
		const registerResult = await votingSystem.registerCandidate(
			"Jane Doe",
			"Vice President",
			"QmJaneDoeCid",
		);
		assert(registerResult.isOk, "ERR_OPERATION_FAILED");
		const candidateId = registerResult.value;

		const updateResult = await votingSystem.updateCandidate(
			candidateId,
			"Jane Smith",
			"Vice President",
			"QmJaneSmithCid",
		);
		assert(updateResult.isOk, "ERR_OPERATION_FAILED");

		const candidate = await votingSystem.getCandidate(candidateId);
		assert(candidate.isOk, "ERR_OPERATION_FAILED");
		expect(candidate.value.name).toBe("Jane Smith");
	});

	it("should register a party successfully", async () => {
		const result = await votingSystem.registerParty(
			"Green Party",
			"For a greener tomorrow",
			"QmGreenPartyLogoCid",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(1); // First party gets ID 1

		const party = await votingSystem.getParty(1);
		assert(party.isOk, "ERR_OPERATION_FAILED");
		expect(party.value.name).toBe("Green Party");
	});

	it("should create an election successfully", async () => {
		const result = await votingSystem.createElection(
			"General Election",
			"Elect your leaders",
			"QmElectionCID",
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(1); // First election gets ID 1

		const election = await votingSystem.getElection(1);
		assert(election.isOk, "ERR_OPERATION_FAILED");
		expect(election.value.name).toBe("General Election");
		expect(election.value.status).toBe("Pending");
	});

	it("should start an election successfully", async () => {
		const createResult = await votingSystem.createElection(
			"Test Election Start",
			"Description",
			"QmElectionCID",
		);
		assert(createResult.isOk, "ERR_OPERATION_FAILED");
		const electionId = createResult.value;

		// Get current blockchain time and add 100 seconds
		const currentBlock = await deployerWallet.getPublicClient().getBlock();
		const currentBlockTime = Number(currentBlock.timestamp);
		const startTime = currentBlockTime + 100; // 100 seconds from now
		const endTime = startTime + 3600; // 1 hour later

		const startResult = await votingSystem.startElection(
			electionId,
			startTime,
			endTime,
		);
		assert(startResult.isOk, "ERR_OPERATION_FAILED");

		const statusResult = await votingSystem.getElectionStatus(electionId);
		assert(statusResult.isOk, "ERR_OPERATION_FAILED");
		expect(statusResult.value).toBe("Active");
	});

	it("should end an election successfully", async () => {
		const createResult = await votingSystem.createElection(
			"Test Election End",
			"Description",
			"QmElectionCID",
		);
		assert(createResult.isOk, "ERR_OPERATION_FAILED");
		const electionId = createResult.value;

		// Get current blockchain time and add 10 seconds
		const currentBlock = await deployerWallet.getPublicClient().getBlock();
		const currentBlockTime = Number(currentBlock.timestamp);
		const startTime = currentBlockTime + 10; // 10 seconds from now
		const endTime = startTime + 20; // 20 seconds later

		// Start the election
		await votingSystem.startElection(electionId, startTime, endTime);

		// Fast-forward blockchain time to after the election ends using RPC calls
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_setNextBlockTimestamp",
			params: [endTime + 10], // Ensure we're well past the end time
		});
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_mine",
			params: [],
		});

		const endResult = await votingSystem.endElection(electionId);
		assert(endResult.isOk, "ERR_OPERATION_FAILED");

		const statusResult = await votingSystem.getElectionStatus(electionId);
		assert(statusResult.isOk, "ERR_OPERATION_FAILED");
		expect(statusResult.value).toBe("Ended");
	}, 60000);

	it("should cast a vote successfully", async () => {
		const createResult = await votingSystem.createElection(
			"Test Election Vote",
			"Description",
			"QmElectionCID",
		);
		assert(createResult.isOk, "ERR_OPERATION_FAILED");
		const electionId = createResult.value;

		const partyResult = await votingSystem.registerParty(
			"Test Party",
			"Test Slogan",
			"QmPartyCID",
		);
		assert(partyResult.isOk, "ERR_OPERATION_FAILED");
		const partyId = partyResult.value;
		const partyAddress = (await votingSystem.getParty(partyId)).unwrapOr(
			null,
		)?.address;
		assert(partyAddress, "ERR_OPERATION_FAILED");

		const candidateResult = await votingSystem.registerCandidate(
			"Test Candidate",
			"President",
			"QmCandidateCID",
		);
		assert(candidateResult.isOk, "ERR_OPERATION_FAILED");
		const candidateId = candidateResult.value;

		// Get current blockchain time and add 10 seconds
		const currentBlock = await deployerWallet.getPublicClient().getBlock();
		const currentBlockTime = Number(currentBlock.timestamp);
		const startTime = currentBlockTime + 10; // 10 seconds from now
		const endTime = startTime + 3600; // 1 hour later

		// Start the election
		await votingSystem.startElection(electionId, startTime, endTime);

		// Register voter
		await votingSystem.registerVoter(voter1Wallet.getAddress());

		const castVoteResult = await votingSystem.castVote(
			electionId,
			partyAddress,
			candidateId,
		);
		assert(castVoteResult.isOk, "ERR_OPERATION_FAILED");

		const hasVotedResult = await votingSystem.hasVoted(
			electionId,
			voter1Wallet.getAddress(),
		);
		assert(hasVotedResult.isOk, "ERR_OPERATION_FAILED");
		expect(hasVotedResult.value).toBe(true);
	});

	it("should get election results successfully", async () => {
		const createResult = await votingSystem.createElection(
			"Test Election Results",
			"Description",
			"QmElectionCID",
		);
		assert(createResult.isOk, "ERR_OPERATION_FAILED");
		const electionId = createResult.value;

		const partyResult = await votingSystem.registerParty(
			"Test Party",
			"Test Slogan",
			"QmPartyCID",
		);
		assert(partyResult.isOk, "ERR_OPERATION_FAILED");
		const partyId = partyResult.value;
		const partyAddress = (await votingSystem.getParty(partyId)).unwrapOr(
			null,
		)?.address;
		assert(partyAddress, "ERR_OPERATION_FAILED");

		const candidate1Result = await votingSystem.registerCandidate(
			"Candidate D",
			"Position D",
			"QmCidD",
		);
		const candidate2Result = await votingSystem.registerCandidate(
			"Candidate E",
			"Position E",
			"QmCidE",
		);
		assert(candidate1Result.isOk, "ERR_OPERATION_FAILED");
		assert(candidate2Result.isOk, "ERR_OPERATION_FAILED");
		const candidateIds = [candidate1Result.value, candidate2Result.value];

		// Get current blockchain time and add 10 seconds
		const currentBlock = await deployerWallet.getPublicClient().getBlock();
		const currentBlockTime = Number(currentBlock.timestamp);
		const startTime = currentBlockTime + 10; // 10 seconds from now
		const endTime = startTime + 20; // 20 seconds later

		// Start the election
		await votingSystem.startElection(electionId, startTime, endTime);

		// Register voter
		await votingSystem.registerVoter(voter1Wallet.getAddress());

		// Cast votes
		await votingSystem.castVote(
			electionId,
			partyAddress,
			candidateIds[0] as number,
		);

		// Fast-forward blockchain time to after the election ends using RPC calls
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_setNextBlockTimestamp",
			params: [endTime + 10], // Ensure we're well past the end time
		});
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_mine",
			params: [],
		});

		// End the election
		await votingSystem.endElection(electionId);

		const resultsResult = await votingSystem.getElectionResults(electionId);
		assert(resultsResult.isOk, "ERR_OPERATION_FAILED");
		expect(resultsResult.value).toEqual([
			{ candidateId: candidateIds[0], voteCount: 1 },
			{ candidateId: candidateIds[1], voteCount: 0 },
		]);
	});
});
