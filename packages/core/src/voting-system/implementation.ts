import type { Address, PublicClient, WalletClient, Hex, Abi } from "viem";
import { Result } from "true-myth";
import type { Wallet } from "../wallet";
import type {
	VotingSystem,
	ContractAddresses,
	CandidateDetails,
	PartyDetails,
	ElectionStatus,
	ElectionDetails,
	ElectionResults,
	InvalidAddressError,
	UnauthorizedError,
	TransactionFailedError,
	ContractCallFailedError,
	VoterNotVerifiedError,
	ElectionNotFoundError,
	CandidateNotFoundError,
	PartyNotFoundError,
	ElectionNotActiveError,
	ElectionAlreadyEndedError,
	AlreadyVotedError,
	InvalidElectionStateError,
	UnknownError,
	RegisterVoterError,
	IsVoterVerifiedError,
	RegisterCandidateError,
	UpdateCandidateError,
	GetCandidateError,
	RegisterPartyError,
	UpdatePartyError,
	GetPartyError,
	CreateElectionError,
	GetElectionError,
	StartElectionError,
	EndElectionError,
	GetElectionStatusError,
	CastVoteError,
	HasVotedError,
	GetElectionResultsError,
} from "./interface";

import {
	voterRegistryAbi,
	candidateRegistryAbi,
	partyAbi,
	votingSystemAbi,
} from "@blockchain-voting-system/contracts/types";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";

class BlockchainVotingSystem implements VotingSystem {
	constructor(
		private readonly wallet: Wallet,
		private readonly contractAddresses: ContractAddresses,
	) {}

	private getPublicClient(): PublicClient {
		return this.wallet.getPublicClient();
	}

	private getWalletClient(): WalletClient {
		return this.wallet.getWalletClient();
	}

	private getAccountAddress(): Address {
		const account = this.getWalletClient().account;
		if (!account) {
			throw new Error("WalletClient account is not defined.");
		}
		return account.address;
	}

	// Helper for read-only contract calls
	private async callReadContract<T>(
		address: Address,
		abi: Abi,
		functionName: string,
		args: any[] = [],
		errorMap: Record<string, { type: string }> = {},
	): Promise<Result<T, ContractCallFailedError | UnknownError>> {
		try {
			const data = await this.wallet.getPublicClient().readContract({
				address,
				abi,
				functionName,
				args,
			});
			return Result.ok(data as T);
		} catch (e: any) {
			console.error(`Read contract call failed for ${functionName}:`, e);
			// Attempt to map common viem errors to our custom error types
			if (e.message && e.message.includes("invalid address")) {
				// return Result.err({ type: "InvalidAddressError", });
				return Result.err({
					type: "ContractCallFailedError",
				});
			}
			// Check for specific error messages from contract reverts
			for (const key in errorMap) {
				if (e.message && e.message.includes(key)) {
					return Result.err(errorMap[key] as ContractCallFailedError);
				}
			}
			return Result.err({
				type: "ContractCallFailedError",
				message: e.message || "Contract call failed",
			});
		}
	}

	// Helper for state-changing contract calls
	private async callWriteContract<T>(
		address: Address,
		abi: Abi,
		functionName: string,
		args: any[] = [],
		errorMap: Record<string, { type: string }> = {},
	): Promise<
		Result<
			T,
			| TransactionFailedError
			| ContractCallFailedError
			| UnauthorizedError
			| UnknownError
		>
	> {
		try {
			const walletClient = this.getWalletClient();
			const publicClient = this.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address,
				abi,
				functionName,
				args,
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			if (receipt.status === "reverted") {
				// Attempt to decode revert reason or map to specific errors
				// This part is tricky as viem doesn't always give clear revert reasons directly
				for (const key in errorMap) {
					if (
						receipt.transactionHash &&
						receipt.transactionHash.includes(key)
					) {
						// Placeholder for actual revert reason check
						return Result.err(errorMap[key] as TransactionFailedError);
					}
				}
				return Result.err({
					type: "TransactionFailedError",
					message: `Transaction reverted: ${receipt.transactionHash}`,
				});
			}

			return Result.ok(undefined as T); // Assuming most write operations return void or a simple success
		} catch (e: any) {
			console.error(`Write contract call failed for ${functionName}:`, e);
			// Attempt to map common viem errors to our custom error types
			if (e.message && e.message.includes("invalid address")) {
				// return Result.err({ type: "InvalidAddressError" });
				return Result.err({ type: "UnauthorizedError" });
			}
			if (
				(e.message && e.message.includes("unauthorized")) ||
				e.message.includes("Not admin")
			) {
				return Result.err({ type: "UnauthorizedError" });
			}
			// Check for specific error messages from contract reverts (simulation errors)
			for (const key in errorMap) {
				if (e.message && e.message.includes(key)) {
					return Result.err(errorMap[key] as TransactionFailedError);
				}
			}
			return Result.err({
				type: "TransactionFailedError",
				message: e.message || "Transaction failed",
			});
		}
	}

	// Voter Management
	public async registerVoter(
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>> {
		return this.callWriteContract(
			this.contractAddresses.voterRegistry,
			voterRegistryAbi,
			"registerVoter",
			[voterAddress],
			{
				"Not admin": { type: "UnauthorizedError" },
			},
		);
	}

	public async isVoterVerified(
		voterAddress: Address,
	): Promise<Result<boolean, IsVoterVerifiedError>> {
		return this.callReadContract<boolean>(
			this.contractAddresses.voterRegistry,
			voterRegistryAbi,
			"isVoterVerified",
			[voterAddress],
			{
				"invalid address": { type: "InvalidAddressError" },
			},
		);
	}

	// Candidate Management
	public async registerCandidate(
		name: string,
		position: string,
		cid: string,
	): Promise<Result<number, RegisterCandidateError>> {
		const result = await this.callWriteContract<bigint>(
			this.contractAddresses.candidateRegistry,
			candidateRegistryAbi,
			"registerCandidate",
			[name, position, cid],
			{
				"Not admin": { type: "UnauthorizedError" },
			},
		);
		if (result.isOk) {
			return Result.ok(Number(result.value)); // Convert bigint to number
		}
		return Result.err(result.error);
	}

	public async updateCandidate(
		candidateId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<Result<void, UpdateCandidateError>> {
		return this.callWriteContract(
			this.contractAddresses.candidateRegistry,
			candidateRegistryAbi,
			"updateCandidate",
			[BigInt(candidateId), name, position, cid],
			{
				"Not admin": { type: "UnauthorizedError" },
				"Candidate not found": { type: "CandidateNotFoundError" },
			},
		);
	}

	public async getCandidate(
		candidateId: number,
	): Promise<Result<CandidateDetails, GetCandidateError>> {
		const result = await this.callReadContract<
			[bigint, string, string, string]
		>(
			this.contractAddresses.candidateRegistry,
			candidateRegistryAbi,
			"getCandidate",
			[BigInt(candidateId)],
			{
				"Candidate not found": { type: "CandidateNotFoundError" },
			},
		);
		if (result.isOk) {
			const [id, name, position, cid] = result.value;
			return Result.ok({ id: Number(id), name, position, cid });
		}
		return Result.err(result.error);
	}

	// Party Management
	public async registerParty(
		name: string,
		logoCid: string,
	): Promise<Result<number, RegisterPartyError>> {
		const result = await this.callWriteContract<bigint>(
			this.contractAddresses.partyAddress, // Use partyAddress
			partyAbi,
			"registerParty",
			[name, logoCid],
			{
				"Not admin": { type: "UnauthorizedError" },
			},
		);
		if (result.isOk) {
			return Result.ok(Number(result.value)); // Convert bigint to number
		}
		return Result.err(result.error);
	}

	public async updateParty(
		partyId: number,
		name: string,
		logoCid: string,
	): Promise<Result<void, UpdatePartyError>> {
		return this.callWriteContract(
			this.contractAddresses.partyAddress, // Use partyAddress
			partyAbi,
			"updateParty",
			[BigInt(partyId), name, logoCid],
			{
				"Not admin": { type: "UnauthorizedError" },
				"Party not found": { type: "PartyNotFoundError" },
			},
		);
	}

	public async getParty(
		partyId: number,
	): Promise<Result<PartyDetails, GetPartyError>> {
		const result = await this.callReadContract<[bigint, string, string]>(
			this.contractAddresses.partyAddress, // Use partyAddress
			partyAbi,
			"getParty",
			[BigInt(partyId)],
			{
				"Party not found": { type: "PartyNotFoundError" },
			},
		);
		if (result.isOk) {
			const [id, name, logoCid] = result.value;
			return Result.ok({ id: Number(id), name, logoCid });
		}
		return Result.err(result.error);
	}

	// Election Management
	public async createElection(
		name: string,
		description: string,
		startTime: number,
		endTime: number,
		candidateIds: number[],
	): Promise<Result<number, CreateElectionError>> {
		const result = await this.callWriteContract<bigint>(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"createElection",
			[
				name,
				description,
				BigInt(startTime),
				BigInt(endTime),
				candidateIds.map((id) => BigInt(id)),
			],
			{
				"Not admin": { type: "UnauthorizedError" },
			},
		);
		if (result.isOk) {
			return Result.ok(Number(result.value));
		}
		return Result.err(result.error);
	}

	public async getElection(
		electionId: number,
	): Promise<Result<ElectionDetails, GetElectionError>> {
		const result = await this.callReadContract<
			[bigint, string, string, bigint, bigint, bigint[], number]
		>(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"getElection",
			[BigInt(electionId)],
			{
				"Election not found": { type: "ElectionNotFoundError" },
			},
		);
		if (result.isOk) {
			const [id, name, description, startTime, endTime, candidateIds, status] =
				result.value;
			return Result.ok({
				id: Number(id),
				name,
				description,
				startTime: Number(startTime),
				endTime: Number(endTime),
				candidateIds: candidateIds.map((id) => Number(id)),
				status: status as ElectionStatus,
			});
		}
		return Result.err(result.error);
	}

	public async startElection(
		electionId: number,
	): Promise<Result<void, StartElectionError>> {
		return this.callWriteContract(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"startElection",
			[BigInt(electionId)],
			{
				"Not admin": { type: "UnauthorizedError" },
				"Election not found": { type: "ElectionNotFoundError" },
				"Invalid election state": { type: "InvalidElectionStateError" },
			},
		);
	}

	public async endElection(
		electionId: number,
	): Promise<Result<void, EndElectionError>> {
		return this.callWriteContract(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"endElection",
			[BigInt(electionId)],
			{
				"Not admin": { type: "UnauthorizedError" },
				"Election not found": { type: "ElectionNotFoundError" },
				"Invalid election state": { type: "InvalidElectionStateError" },
			},
		);
	}

	public async getElectionStatus(
		electionId: number,
	): Promise<Result<ElectionStatus, GetElectionStatusError>> {
		const result = await this.callReadContract<number>(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"getElectionStatus",
			[BigInt(electionId)],
			{
				"Election not found": { type: "ElectionNotFoundError" },
			},
		);
		if (result.isOk) {
			return Result.ok(result.value as ElectionStatus);
		}
		return Result.err(result.error);
	}

	// Voting
	public async castVote(
		electionId: number,
		candidateId: number,
	): Promise<Result<void, CastVoteError>> {
		return this.callWriteContract(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"castVote",
			[BigInt(electionId), BigInt(candidateId)],
			{
				"Election not found": { type: "ElectionNotFoundError" },
				"Candidate not found": { type: "CandidateNotFoundError" },
				"Voter not verified": { type: "VoterNotVerifiedError" },
				"Election not active": { type: "ElectionNotActiveError" },
				"Already voted": { type: "AlreadyVotedError" },
			},
		);
	}

	public async hasVoted(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<boolean, HasVotedError>> {
		return this.callReadContract<boolean>(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"hasVoted",
			[BigInt(electionId), voterAddress],
			{
				"Election not found": { type: "ElectionNotFoundError" },
				"invalid address": { type: "InvalidAddressError" },
			},
		);
	}

	// Results
	public async getElectionResults(
		electionId: number,
	): Promise<Result<ElectionResults, GetElectionResultsError>> {
		const result = await this.callReadContract<[bigint[], bigint[]]>(
			this.contractAddresses.votingSystem,
			votingSystemAbi,
			"getElectionResults",
			[BigInt(electionId)],
			{
				"Election not found": { type: "ElectionNotFoundError" },
			},
		);
		if (result.isOk) {
			const [candidateIds, voteCounts] = result.value;
			const electionResults: ElectionResults = candidateIds.map(
				(id, index) => ({
					candidateId: Number(id),
					voteCount: Number(voteCounts[index]),
				}),
			);
			return Result.ok(electionResults);
		}
		return Result.err(result.error);
	}
}

export { BlockchainVotingSystem };
