import { describe, it, expect, beforeAll } from "vitest";
import { BlockchainVotingSystemDeployer } from "../../src/voting-system-deployer/implementation";
import { BlockchainVotingSystem } from "../../src/voting-system/implementation";
import { deployerWallet, voter1Wallet } from "../setup";
import { assert } from "../../src/lib/assert";
import type { Address } from "viem";
import {
	votingSystemAbi,
	electionRegistryAbi,
	electionAbi,
} from "@blockchain-voting-system/contracts/types";

describe("BlockchainVotingSystem Integration Tests", () => {
	let deployer: BlockchainVotingSystemDeployer;
	let votingSystem: BlockchainVotingSystem;
	let votingSystemContractAddress: Address;

	beforeAll(async () => {
		// Deploy all contracts
		deployer = new BlockchainVotingSystemDeployer(deployerWallet);
		const deployResult = await deployer.deploySystem();
		assert(deployResult.isOk, "ERR_OPERATION_FAILED");
		votingSystemContractAddress = deployResult.value;

		// Initialize VotingSystem with deployer wallet
		votingSystem = new BlockchainVotingSystem(
			deployerWallet,
			votingSystemContractAddress,
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
		// First register a party, since candidates belong to parties
		const partyResult = await votingSystem.registerParty(
			"Test Party",
			"For testing",
			"QmTestPartyCID",
		);
		assert(partyResult.isOk, "ERR_OPERATION_FAILED");
		const partyId = partyResult.value;
		expect(partyId).toBe(1); // First party gets ID 1

		const result = await votingSystem.registerCandidate(
			"John Doe",
			"President",
			"QmJohnDoeCid",
			partyId,
		);
		assert(result.isOk, "ERR_OPERATION_FAILED");
		expect(result.value).toBe(1); // First candidate gets ID 1

		const candidate = await votingSystem.getCandidate(1);
		assert(candidate.isOk, "ERR_OPERATION_FAILED");
		expect(candidate.value.name).toBe("John Doe");
	});

	it("should update a candidate successfully", async () => {
		// First register a party, since candidates belong to parties
		const partyResult = await votingSystem.registerParty(
			"Test Party 2",
			"For testing updates",
			"QmTestParty2CID",
		);
		assert(partyResult.isOk, "ERR_OPERATION_FAILED");
		const partyId = partyResult.value;

		const registerResult = await votingSystem.registerCandidate(
			"Jane Doe",
			"Vice President",
			"QmJaneDoeCid",
			partyId,
		);
		assert(registerResult.isOk, "ERR_OPERATION_FAILED");
		const candidateId = registerResult.value;

		const updateResult = await votingSystem.updateCandidate(
			candidateId,
			"Jane Smith",
			"Vice President",
			"QmJaneSmithCid",
			partyId,
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
		const partyId = result.value; // Get the actual party ID
		expect(partyId).toBeGreaterThan(0); // Verify that a valid party ID was returned

		const party = await votingSystem.getParty(partyId);
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

	it("should register a voter for an election successfully", async () => {
		const createElectionResult = await votingSystem.createElection(
			"Election for Voter Reg",
			"Description",
			"QmElectionCID",
		);
		assert(createElectionResult.isOk, "ERR_OPERATION_FAILED");
		const electionId = createElectionResult.value;

		const registerVoterResult = await votingSystem.registerVoterForElection(
			electionId,
			voter1Wallet.getAddress(),
		);
		assert(registerVoterResult.isOk, "ERR_OPERATION_FAILED");
	});

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
			partyId,
		);
		assert(candidateResult.isOk, "ERR_OPERATION_FAILED");
		const candidateId = candidateResult.value;

		// Get current blockchain time and add 10 seconds
		const currentBlock = await deployerWallet.getPublicClient().getBlock();
		const currentBlockTime = Number(currentBlock.timestamp);
		const startTime = currentBlockTime + 10; // 10 seconds from now
		const endTime = startTime + 3600; // 1 hour later

		// Register voter globally (should already be registered from earlier test)
		// and for this specific election
		await votingSystem.registerVoterForElection(
			electionId,
			voter1Wallet.getAddress(),
		);

		// Start the election
		await votingSystem.startElection(electionId, startTime, endTime);

		// Add the party to the election AFTER starting the election
		const electionRegistryAddress = await deployerWallet
			.getPublicClient()
			.readContract({
				address: votingSystemContractAddress,
				abi: votingSystemAbi,
				functionName: "electionRegistryAddress",
			});

		const electionAddress = await deployerWallet
			.getPublicClient()
			.readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

		// Add party to election using direct contract call (after election is started)
		const { request: addPartyRequest } = await deployerWallet
			.getPublicClient()
			.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "addParty",
				args: [partyAddress],
				account: deployerWallet.getWalletClient().account,
			});

		const addPartyHash = await deployerWallet
			.getWalletClient()
			.writeContract(addPartyRequest);
		await deployerWallet
			.getPublicClient()
			.waitForTransactionReceipt({ hash: addPartyHash });

		// Fast-forward blockchain time to be within the election period
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_setNextBlockTimestamp",
			params: [startTime + 10], // 10 seconds after start time
		});
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_mine",
			params: [],
		});

		// Create a new voting system instance with the voter's wallet to cast the vote
		const voterVotingSystem = new BlockchainVotingSystem(
			voter1Wallet,
			votingSystemContractAddress,
		);

		const castVoteResult = await voterVotingSystem.castVote(
			electionId,
			partyAddress,
			candidateId,
		);
		assert(castVoteResult.isOk, "ERR_OPERATION_FAILED");

		const hasVotedResult = await voterVotingSystem.hasVoted(
			electionId,
			voter1Wallet.getAddress(),
		);
		assert(hasVotedResult.isOk, "ERR_OPERATION_FAILED");
		expect(hasVotedResult.value).toBe(true);
	}, 60000);

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
			partyId,
		);
		const candidate2Result = await votingSystem.registerCandidate(
			"Candidate E",
			"Position E",
			"QmCidE",
			partyId,
		);
		assert(candidate1Result.isOk, "ERR_OPERATION_FAILED");
		assert(candidate2Result.isOk, "ERR_OPERATION_FAILED");
		const candidateIds = [candidate1Result.value, candidate2Result.value];

		// Get current blockchain time and add 10 seconds
		const currentBlock = await deployerWallet.getPublicClient().getBlock();
		const currentBlockTime = Number(currentBlock.timestamp);
		const startTime = currentBlockTime + 10; // 10 seconds from now
		const endTime = startTime + 20; // 20 seconds later

		// Register voter for this specific election
		await votingSystem.registerVoterForElection(
			electionId,
			voter1Wallet.getAddress(),
		);

		// Start the election
		await votingSystem.startElection(electionId, startTime, endTime);

		// Add the party to the election AFTER starting the election
		const electionRegistryAddress = await deployerWallet
			.getPublicClient()
			.readContract({
				address: votingSystemContractAddress,
				abi: votingSystemAbi,
				functionName: "electionRegistryAddress",
			});

		const electionAddress = await deployerWallet
			.getPublicClient()
			.readContract({
				address: electionRegistryAddress,
				abi: electionRegistryAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

		// Add party to election using direct contract call (after election is started)
		const { request: addPartyRequest } = await deployerWallet
			.getPublicClient()
			.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "addParty",
				args: [partyAddress],
				account: deployerWallet.getWalletClient().account,
			});

		const addPartyHash = await deployerWallet
			.getWalletClient()
			.writeContract(addPartyRequest);
		await deployerWallet
			.getPublicClient()
			.waitForTransactionReceipt({ hash: addPartyHash });

		// Fast-forward blockchain time to be within the election period
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_setNextBlockTimestamp",
			params: [startTime + 5], // 5 seconds after start time
		});
		await deployerWallet.getPublicClient().transport.request({
			method: "evm_mine",
			params: [],
		});

		// Create a new voting system instance with the voter's wallet to cast the vote
		const voterVotingSystem = new BlockchainVotingSystem(
			voter1Wallet,
			votingSystemContractAddress,
		);

		// Cast votes using voter's wallet
		await voterVotingSystem.castVote(
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
