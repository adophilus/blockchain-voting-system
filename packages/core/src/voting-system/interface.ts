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

// --- Individual Error Types ---
export type InvalidAddressError = { type: "InvalidAddressError" };
export type UnauthorizedError = { type: "UnauthorizedError" };
export type TransactionFailedError = { type: "TransactionFailedError" };
export type ContractCallFailedError = { type: "ContractCallFailedError" };
export type VoterNotVerifiedError = { type: "VoterNotVerifiedError" };
export type ElectionNotFoundError = { type: "ElectionNotFoundError" };
export type CandidateNotFoundError = { type: "CandidateNotFoundError" };
export type PartyNotFoundError = { type: "PartyNotFoundError" };
export type ElectionNotActiveError = { type: "ElectionNotActiveError" };
export type ElectionAlreadyEndedError = { type: "ElectionAlreadyEndedError" };
export type AlreadyVotedError = { type: "AlreadyVotedError" };
export type InvalidElectionStateError = { type: "InvalidElectionStateError" };
export type UnknownError = { type: "UnknownError" };

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

abstract class VotingSystem {
	// Voter Management
	public abstract registerVoter(
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>>;
	public abstract isVoterVerified(
		voterAddress: Address,
	): Promise<Result<boolean, IsVoterVerifiedError>>;

	// Candidate Management
	public abstract registerCandidate(
		name: string,
		position: string,
		cid: string,
	): Promise<Result<number, RegisterCandidateError>>;
	public abstract updateCandidate(
		candidateId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<Result<void, UpdateCandidateError>>;
	public abstract getCandidate(
		candidateId: number,
	): Promise<Result<CandidateDetails, GetCandidateError>>;

	// Party Management
	public abstract registerParty(
		name: string,
		logoCid: string,
	): Promise<Result<number, RegisterPartyError>>;
	public abstract updateParty(
		partyId: number,
		name: string,
		logoCid: string,
	): Promise<Result<void, UpdatePartyError>>;
	public abstract getParty(
		partyId: number,
	): Promise<Result<PartyDetails, GetPartyError>>;

	// Election Management
	public abstract createElection(
		name: string,
		description: string,
		startTime: number,
		endTime: number,
		candidateIds: number[],
	): Promise<Result<number, CreateElectionError>>;
	public abstract getElection(
		electionId: number,
	): Promise<Result<ElectionDetails, GetElectionError>>;
	public abstract startElection(
		electionId: number,
	): Promise<Result<void, StartElectionError>>;
	public abstract endElection(
		electionId: number,
	): Promise<Result<void, EndElectionError>>;
	public abstract getElectionStatus(
		electionId: number,
	): Promise<Result<ElectionStatus, GetElectionStatusError>>;

	// Voting
	public abstract castVote(
		electionId: number,
		candidateId: number,
	): Promise<Result<void, CastVoteError>>;
	public abstract hasVoted(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<boolean, HasVotedError>>;

	// Results
	public abstract getElectionResults(
		electionId: number,
	): Promise<Result<ElectionResults, GetElectionResultsError>>;
}

export { VotingSystem };
