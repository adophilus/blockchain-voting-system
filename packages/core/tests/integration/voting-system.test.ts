import { assert, describe, it, expect, beforeAll, beforeEach } from "vitest";
import { BlockchainVotingSystemDeployer } from "../../src/voting-system-deployer/implementation";
import { BlockchainVotingSystem } from "../../src/voting-system/implementation";
import type {
	DeployedContractAddresses,
	ElectionStatus,
} from "../../src/voting-system-deployer/interface";
import { deployerWallet, voter1Wallet } from "../setup"; // Import the deployer wallet from setup

describe("BlockchainVotingSystem Integration Tests", () => {
	let deployer: BlockchainVotingSystemDeployer;
	let votingSystem: BlockchainVotingSystem;
	let contractAddresses: DeployedContractAddresses;

	beforeAll(async () => {
		// Deploy all contracts
		deployer = new BlockchainVotingSystemDeployer(deployerWallet);
		const deployResult = await deployer.deploySystem();
		if (deployResult.isErr) {
			throw new Error(`Failed to deploy contracts: ${deployResult.error.type}`);
		}
		contractAddresses = deployResult.value;

		// Initialize VotingSystem with deployer wallet
		votingSystem = new BlockchainVotingSystem(
			deployerWallet,
			contractAddresses,
		);
	}, 120000); // Increased timeout for deployment and setup

	it("should register a voter successfully", async () => {
		const result = await votingSystem.registerVoter(voter1Wallet.getAddress());
		expect(result.isOk).toBe(true);

		const isVerifiedResult = await votingSystem.isVoterVerified(
			voter1Wallet.getAddress(),
		);
		assert(isVerifiedResult.isOk);
		assert(isVerifiedResult.value);
	});

	it("should register a candidate successfully", async () => {
		const result = await votingSystem.registerCandidate(
			"John Doe",
			"President",
			"QmJohnDoeCid",
		);
		expect(result.isOk).toBe(true);
		expect(result.value).toBe(0); // Assuming first candidate gets ID 0

		const candidate = await votingSystem.getCandidate(0);
		expect(candidate.isOk).toBe(true);
		expect(candidate.value.name).toBe("John Doe");
	});

	it("should update a candidate successfully", async () => {
		const registerResult = await votingSystem.registerCandidate(
			"Jane Doe",
			"Vice President",
			"QmJaneDoeCid",
		);
		expect(registerResult.isOk).toBe(true);
		const candidateId = registerResult.value;

		const updateResult = await votingSystem.updateCandidate(
			candidateId,
			"Jane Smith",
			"Vice President",
			"QmJaneSmithCid",
		);
		expect(updateResult.isOk).toBe(true);

		const candidate = await votingSystem.getCandidate(candidateId);
		expect(candidate.isOk).toBe(true);
		expect(candidate.value.name).toBe("Jane Smith");
	});

	it("should register a party successfully", async () => {
		const result = await votingSystem.registerParty(
			"Green Party",
			"QmGreenPartyLogoCid",
		);
		expect(result.isOk).toBe(true);
		expect(result.value).toBe(0); // Assuming first party gets ID 0

		const party = await votingSystem.getParty(0);
		expect(party.isOk).toBe(true);
		expect(party.value.name).toBe("Green Party");
	});

	it("should update a party successfully", async () => {
		const registerResult = await votingSystem.registerParty(
			"Blue Party",
			"QmBluePartyLogoCid",
		);
		expect(registerResult.isOk).toBe(true);
		const partyId = registerResult.value;

		const updateResult = await votingSystem.updateParty(
			partyId,
			"Red Party",
			"QmRedPartyLogoCid",
		);
		expect(updateResult.isOk).toBe(true);

		const party = await votingSystem.getParty(partyId);
		expect(party.isOk).toBe(true);
		expect(party.value.name).toBe("Red Party");
	});

	it("should create an election successfully", async () => {
		const candidate1Result = await votingSystem.registerCandidate(
			"Candidate 1",
			"Position 1",
			"QmCid1",
		);
		const candidate2Result = await votingSystem.registerCandidate(
			"Candidate 2",
			"Position 2",
			"QmCid2",
		);
		expect(candidate1Result.isOk).toBe(true);
		expect(candidate2Result.isOk).toBe(true);

		const candidateIds = [candidate1Result.value, candidate2Result.value];
		const startTime = Math.floor(Date.now() / 1000) + 100; // 100 seconds from now
		const endTime = startTime + 3600; // 1 hour later

		const result = await votingSystem.createElection(
			"General Election",
			"Elect your leaders",
			startTime,
			endTime,
			candidateIds,
		);
		expect(result.isOk).toBe(true);
		expect(result.value).toBe(0); // Assuming first election gets ID 0

		const election = await votingSystem.getElection(0);
		expect(election.isOk).toBe(true);
		expect(election.value.name).toBe("General Election");
		expect(election.value.status).toBe(ElectionStatus.Pending);
	});

	it("should start an election successfully", async () => {
		const candidate1Result = await votingSystem.registerCandidate(
			"Candidate A",
			"Position A",
			"QmCidA",
		);
		const candidateIds = [candidate1Result.value];
		const startTime = Math.floor(Date.now() / 1000) + 100; // 100 seconds from now
		const endTime = startTime + 3600; // 1 hour later

		const createResult = await votingSystem.createElection(
			"Test Election Start",
			"Description",
			startTime,
			endTime,
			candidateIds,
		);
		expect(createResult.isOk).toBe(true);
		const electionId = createResult.value;

		const startResult = await votingSystem.startElection(electionId);
		expect(startResult.isOk).toBe(true);

		const statusResult = await votingSystem.getElectionStatus(electionId);
		expect(statusResult.isOk).toBe(true);
		expect(statusResult.value).toBe(ElectionStatus.Active);
	});

	it("should end an election successfully", async () => {
		const candidate1Result = await votingSystem.registerCandidate(
			"Candidate B",
			"Position B",
			"QmCidB",
		);
		const candidateIds = [candidate1Result.value];
		const startTime = Math.floor(Date.now() / 1000) + 10; // 10 seconds from now
		const endTime = startTime + 20; // 20 seconds later

		const createResult = await votingSystem.createElection(
			"Test Election End",
			"Description",
			startTime,
			endTime,
			candidateIds,
		);
		expect(createResult.isOk).toBe(true);
		const electionId = createResult.value;

		// Start the election
		await votingSystem.startElection(electionId);

		// Wait for election to end (endTime + a buffer)
		await new Promise((resolve) =>
			setTimeout(resolve, (endTime - Date.now() / 1000 + 5) * 1000),
		);

		const endResult = await votingSystem.endElection(electionId);
		expect(endResult.isOk).toBe(true);

		const statusResult = await votingSystem.getElectionStatus(electionId);
		expect(statusResult.isOk).toBe(true);
		expect(statusResult.value).toBe(ElectionStatus.Ended);
	});

	it("should cast a vote successfully", async () => {
		const candidate1Result = await votingSystem.registerCandidate(
			"Candidate C",
			"Position C",
			"QmCidC",
		);
		const candidateIds = [candidate1Result.value];
		const startTime = Math.floor(Date.now() / 1000) + 10; // 10 seconds from now
		const endTime = startTime + 3600; // 1 hour later

		const createResult = await votingSystem.createElection(
			"Test Election Vote",
			"Description",
			startTime,
			endTime,
			candidateIds,
		);
		expect(createResult.isOk).toBe(true);
		const electionId = createResult.value;
		const candidateId = candidateIds[0];

		// Start the election
		await votingSystem.startElection(electionId);

		// Register voter
		await votingSystem.registerVoter(voterWallet.address);

		const castVoteResult = await votingSystem.castVote(electionId, candidateId);
		expect(castVoteResult.isOk).toBe(true);

		const hasVotedResult = await votingSystem.hasVoted(
			electionId,
			voterWallet.address,
		);
		expect(hasVotedResult.isOk).toBe(true);
		expect(hasVotedResult.value).toBe(true);
	});

	it("should get election results successfully", async () => {
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
		const candidateIds = [candidate1Result.value, candidate2Result.value];
		const startTime = Math.floor(Date.now() / 1000) + 10; // 10 seconds from now
		const endTime = startTime + 20; // 20 seconds later

		const createResult = await votingSystem.createElection(
			"Test Election Results",
			"Description",
			startTime,
			endTime,
			candidateIds,
		);
		expect(createResult.isOk).toBe(true);
		const electionId = createResult.value;

		// Start the election
		await votingSystem.startElection(electionId);

		// Register voter
		await votingSystem.registerVoter(voterWallet.address);

		// Cast votes
		await votingSystem.castVote(electionId, candidateIds[0]);

		// Wait for election to end
		await new Promise((resolve) =>
			setTimeout(resolve, (endTime - Date.now() / 1000 + 5) * 1000),
		);

		// End the election
		await votingSystem.endElection(electionId);

		const resultsResult = await votingSystem.getElectionResults(electionId);
		expect(resultsResult.isOk).toBe(true);
		expect(resultsResult.value).toEqual([
			{ candidateId: candidateIds[0], voteCount: 1 },
			{ candidateId: candidateIds[1], voteCount: 0 },
		]);
	});
});
