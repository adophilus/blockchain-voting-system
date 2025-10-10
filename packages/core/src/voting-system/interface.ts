import type { Address } from "viem";
import type { Result } from "true-myth";

// Define the structure for contract addresses
export type ContractAddresses = {
	votingSystem: Address;
	voterRegistry: Address;
	candidateRegistry: Address;
	partyAddress: Address;
	// Add other contract addresses as needed
};

// Placeholder types for data structures
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
	address: Address;
};

export type ElectionStatus = "Pending" | "Active" | "Ended";

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

// --- Individual Error Types ---
export type InvalidAddressError = {
	type: "InvalidAddressError";
	message: string;
};
export type UnauthorizedError = { type: "UnauthorizedError"; message: string };
export type TransactionFailedError = {
	type: "TransactionFailedError";
	message: string;
};
export type ContractCallFailedError = {
	type: "ContractCallFailedError";
	message: string;
};
export type VoterNotVerifiedError = {
	type: "VoterNotVerifiedError";
	message: string;
};
export type ElectionNotFoundError = {
	type: "ElectionNotFoundError";
	message: string;
};
export type CandidateNotFoundError = {
	type: "CandidateNotFoundError";
	message: string;
};
export type PartyNotFoundError = {
	type: "PartyNotFoundError";
	message: string;
};
export type ElectionNotActiveError = {
	type: "ElectionNotActiveError";
	message: string;
};
export type ElectionAlreadyEndedError = {
	type: "ElectionAlreadyEndedError";
	message: string;
};
export type AlreadyVotedError = { type: "AlreadyVotedError"; message: string };
export type InvalidElectionStateError = {
	type: "InvalidElectionStateError";
	message: string;
};
export type UnknownError = { type: "UnknownError"; message: string };

// --- Method-Specific Error Types ---

// Voter Management
export type RegisterVoterError =
	| InvalidAddressError
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type IsVoterVerifiedError =
	| InvalidAddressError
	| ContractCallFailedError
	| UnknownError;

// Candidate Management
export type RegisterCandidateError =
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type UpdateCandidateError =
	| UnauthorizedError
	| CandidateNotFoundError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetCandidateError =
	| CandidateNotFoundError
	| ContractCallFailedError
	| UnknownError;

// Party Management
export type RegisterPartyError =
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type UpdatePartyError =
	| UnauthorizedError
	| PartyNotFoundError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetPartyError =
	| PartyNotFoundError
	| ContractCallFailedError
	| UnknownError;

// Election Management
export type CreateElectionError =
	| UnauthorizedError
	| InvalidAddressError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetElectionError =
	| ElectionNotFoundError
	| ContractCallFailedError
	| UnknownError;
export type StartElectionError =
	| UnauthorizedError
	| ElectionNotFoundError
	| InvalidElectionStateError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type EndElectionError =
	| UnauthorizedError
	| ElectionNotFoundError
	| InvalidElectionStateError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetElectionStatusError =
	| ElectionNotFoundError
	| ContractCallFailedError
	| UnknownError;

// Voting
export type CastVoteError =
	| ElectionNotFoundError
	| CandidateNotFoundError
	| VoterNotVerifiedError
	| ElectionNotActiveError
	| AlreadyVotedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnauthorizedError
	| UnknownError;
export type HasVotedError =
	| ElectionNotFoundError
	| InvalidAddressError
	| ContractCallFailedError
	| UnknownError;

// Results
export type GetElectionResultsError =
	| ElectionNotFoundError
	| ContractCallFailedError
	| UnknownError;

export interface VotingSystem {
	// Voter Management
	registerVoter(
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>>;
	isVoterVerified(
		voterAddress: Address,
	): Promise<Result<boolean, IsVoterVerifiedError>>;
	registerVoterForElection(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>>;

	// Candidate Management
	registerCandidate(
		name: string,
		position: string,
		cid: string,
	): Promise<Result<number, RegisterCandidateError>>;
	updateCandidate(
		candidateId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<Result<void, UpdateCandidateError>>;
	getCandidate(
		candidateId: number,
	): Promise<Result<CandidateDetails, GetCandidateError>>;

	// Party Management
	registerParty(
		name: string,
		slogan: string,
		logoCid: string,
	): Promise<Result<number, RegisterPartyError>>;
	updateParty(
		partyId: number,
		name: string,
		logoCid: string,
	): Promise<Result<void, UpdatePartyError>>;
	getParty(partyId: number): Promise<Result<PartyDetails, GetPartyError>>;

	// Election Management
	createElection(
		name: string,
		description: string,
		cid: string,
	): Promise<Result<number, CreateElectionError>>;
	getElection(
		electionId: number,
	): Promise<Result<ElectionDetails, GetElectionError>>;
	startElection(
		electionId: number,
		startTime: number,
		endTime: number,
	): Promise<Result<void, StartElectionError>>;
	endElection(electionId: number): Promise<Result<void, EndElectionError>>;
	getElectionStatus(
		electionId: number,
	): Promise<Result<ElectionStatus, GetElectionStatusError>>;

	// Voting
	castVote(
		electionId: number,
		partyAddress: Address,
		candidateId: number,
	): Promise<Result<void, CastVoteError>>;
	hasVoted(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<boolean, HasVotedError>>;

	// Results
	getElectionResults(
		electionId: number,
	): Promise<Result<ElectionResults, GetElectionResultsError>>;
}
