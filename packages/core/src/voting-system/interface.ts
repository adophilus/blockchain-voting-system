import { PublicClient, WalletClient, Address } from "viem";

export type ContractAddresses = {
	votingSystem: Address;
	voterRegistry: Address;
	candidateRegistry: Address;
	partyRegistry: Address;
};

export type CandidateDetails = {
	id: number;
	name: string;
	position: string;
	cid: string;
};

export type PartyDetails = {
	id: number;
	name: string;
	logoCid: string;
};

export enum ElectionStatus {
	Pending,
	Active,
	Ended,
	Canceled,
}

export type ElectionDetails = {
	id: number;
	name: string;
	description: string;
	startTime: number;
	endTime: number;
	candidateIds: number[];
	status: ElectionStatus;
};

export type ElectionResults = {
	candidateId: number;
	voteCount: number;
}[];

abstract class VotingSystem {
	protected client: PublicClient;
	protected walletClient: WalletClient;
	protected contractAddresses: ContractAddresses;

	constructor(
		client: PublicClient,
		contractAddresses: ContractAddresses,
		walletClient: WalletClient,
	) {
		this.client = client;
		this.contractAddresses = contractAddresses;
		this.walletClient = walletClient;
	}

	// Voter Management
	public abstract registerVoter(voterAddress: Address): Promise<void>;
	public abstract isVoterVerified(voterAddress: Address): Promise<boolean>;

	// Candidate Management
	public abstract registerCandidate(
		name: string,
		position: string,
		cid: string,
	): Promise<number>;
	public abstract updateCandidate(
		candidateId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<void>;
	public abstract getCandidate(candidateId: number): Promise<CandidateDetails>;

	// Party Management
	public abstract registerParty(name: string, logoCid: string): Promise<number>;
	public abstract updateParty(
		partyId: number,
		name: string,
		logoCid: string,
	): Promise<void>;
	public abstract getParty(partyId: number): Promise<PartyDetails>;

	// Election Management
	public abstract createElection(
		name: string,
		description: string,
		startTime: number,
		endTime: number,
		candidateIds: number[],
	): Promise<number>;
	public abstract getElection(electionId: number): Promise<ElectionDetails>;
	public abstract startElection(electionId: number): Promise<void>;
	public abstract endElection(electionId: number): Promise<void>;
	public abstract getElectionStatus(
		electionId: number,
	): Promise<ElectionStatus>;

	// Voting
	public abstract castVote(
		electionId: number,
		candidateId: number,
	): Promise<void>;
	public abstract hasVoted(
		electionId: number,
		voterAddress: Address,
	): Promise<boolean>;

	// Results
	public abstract getElectionResults(
		electionId: number,
	): Promise<ElectionResults>;
}

export { VotingSystem };
