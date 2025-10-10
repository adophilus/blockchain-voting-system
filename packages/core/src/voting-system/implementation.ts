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
	electionAbi,
} from "@blockchain-voting-system/contracts/types";

class BlockchainVotingSystem implements VotingSystem {
	constructor(
		private readonly wallet: Wallet,
		private readonly contractAddresses: ContractAddresses,
	) {}

	private getAccountAddress(): Address {
		const account = this.wallet.getWalletClient().account;
		if (!account) {
			throw new Error("WalletClient account is not defined.");
		}
		return account.address;
	}

	// Voter Management
	public async registerVoter(
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: this.contractAddresses.voterRegistry,
				abi: voterRegistryAbi,
				functionName: "registerVoter",
				args: [voterAddress],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for registerVoter:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async isVoterVerified(
		voterAddress: Address,
	): Promise<Result<boolean, IsVoterVerifiedError>> {
		try {
			const data = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.voterRegistry,
				abi: voterRegistryAbi,
				functionName: "isVoterRegistered",
				args: [voterAddress],
			});
			return Result.ok(data);
		} catch (e: any) {
			console.error(`Read contract call failed for isVoterVerified:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async registerVoterForElection(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<void, RegisterVoterError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			// Get the election address from the voting system
			const electionAddress = await publicClient.readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "registerVoterForElection",
				args: [voterAddress],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for registerVoterForElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Candidate Management
	public async registerCandidate(
		name: string,
		position: string,
		cid: string,
	): Promise<Result<number, RegisterCandidateError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request, result } = await publicClient.simulateContract({
				address: this.contractAddresses.candidateRegistry,
				abi: candidateRegistryAbi,
				functionName: "registerCandidate",
				args: [name, position, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(Number(result));
		} catch (e: any) {
			console.error(`Write contract call failed for registerCandidate:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async updateCandidate(
		candidateId: number,
		name: string,
		position: string,
		cid: string,
	): Promise<Result<void, UpdateCandidateError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: this.contractAddresses.candidateRegistry,
				abi: candidateRegistryAbi,
				functionName: "updateCandidate",
				args: [BigInt(candidateId), name, position, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for updateCandidate:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getCandidate(
		candidateId: number,
	): Promise<Result<CandidateDetails, GetCandidateError>> {
		try {
			const data = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.candidateRegistry,
				abi: candidateRegistryAbi,
				functionName: "getCandidate",
				args: [BigInt(candidateId)],
			});
			const [id, name, position, cid] = data;
			return Result.ok({ id: Number(id), name, position, cid });
		} catch (e: any) {
			console.error(`Read contract call failed for getCandidate:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Party Management
	public async registerParty(
		name: string,
		slogan: string,
		logoCid: string,
	): Promise<Result<number, RegisterPartyError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request, result } = await publicClient.simulateContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "createParty",
				args: [name, slogan, logoCid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(Number(result));
		} catch (e: any) {
			console.error(`Write contract call failed for registerParty:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getParty(
		partyId: number,
	): Promise<Result<PartyDetails, GetPartyError>> {
		try {
			const partyAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getParty",
				args: [BigInt(partyId)],
			});

			const name = await this.wallet.getPublicClient().readContract({
				address: partyAddress,
				abi: partyAbi,
				functionName: "name",
			});

			const logoCid = await this.wallet.getPublicClient().readContract({
				address: partyAddress,
				abi: partyAbi,
				functionName: "cid",
			});

			return Result.ok({ id: partyId, name, logoCid, address: partyAddress });
		} catch (e: any) {
			console.error(`Read contract call failed for getParty:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Election Management
	public async createElection(
		name: string,
		description: string,
		cid: string,
	): Promise<Result<number, CreateElectionError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request, result } = await publicClient.simulateContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "createElection",
				args: [name, description, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(Number(result));
		} catch (e: any) {
			console.error(`Write contract call failed for createElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getElection(
		electionId: number,
	): Promise<Result<ElectionDetails, GetElectionError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const name = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "name",
			});

			const description = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "description",
			});

			const startTime = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "startTime",
			});

			const endTime = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "endTime",
			});

			const electionStarted = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionStarted",
			});

			const electionEnded = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionEnded",
			});

			let status: ElectionStatus = "Pending";
			if (electionStarted && !electionEnded) {
				status = "Active";
			} else if (electionEnded) {
				status = "Ended";
			}

			return Result.ok({
				id: electionId,
				name,
				description,
				startTime: Number(startTime),
				endTime: Number(endTime),
				candidateIds: [], // This needs to be fetched from the party contracts associated with the election
				status,
			});
		} catch (e: any) {
			console.error(`Read contract call failed for getElection:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async startElection(
		electionId: number,
		startTime: number,
		endTime: number,
	): Promise<Result<void, StartElectionError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "startElection",
				args: [BigInt(startTime), BigInt(endTime)],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for startElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async endElection(
		electionId: number,
	): Promise<Result<void, EndElectionError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "endElection",
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for endElection:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getElectionStatus(
		electionId: number,
	): Promise<Result<ElectionStatus, GetElectionStatusError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const electionStarted = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionStarted",
			});

			const electionEnded = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "electionEnded",
			});

			if (electionStarted && !electionEnded) {
				return Result.ok("Active");
			} else if (electionEnded) {
				return Result.ok("Ended");
			}
			return Result.ok("Pending");
		} catch (e: any) {
			console.error(`Read contract call failed for getElectionStatus:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Voting
	public async castVote(
		electionId: number,
		partyAddress: Address,
		candidateId: number,
	): Promise<Result<void, CastVoteError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const { request } = await publicClient.simulateContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "vote",
				args: [partyAddress, BigInt(candidateId)],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for castVote:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async hasVoted(
		electionId: number,
		voterAddress: Address,
	): Promise<Result<boolean, HasVotedError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const hasVotedResult = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "hasVoted",
				args: [voterAddress],
			});

			return Result.ok(hasVotedResult);
		} catch (e: any) {
			console.error(`Read contract call failed for hasVoted:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Results
	public async getElectionResults(
		electionId: number,
	): Promise<Result<ElectionResults, GetElectionResultsError>> {
		try {
			const electionAddress = await this.wallet.getPublicClient().readContract({
				address: this.contractAddresses.votingSystem,
				abi: votingSystemAbi,
				functionName: "getElection",
				args: [BigInt(electionId)],
			});

			const data = await this.wallet.getPublicClient().readContract({
				address: electionAddress,
				abi: electionAbi,
				functionName: "getElectionResults",
			}) as readonly [readonly `0x${string}`[], readonly bigint[][], readonly bigint[][]];

			if (!data) {
				return Result.err({
					type: "ContractCallFailedError",
					message: "Contract call/execution failed",
				});
			}

			const [, candidateIds, voteCounts] = data;

			const electionResults: ElectionResults = [];
			if (candidateIds && voteCounts) {
				for (let i = 0; i < candidateIds.length; i++) {
					const candidateIdRow = candidateIds[i];
					const voteCountRow = voteCounts[i];
					if (candidateIdRow && voteCountRow) {
						for (let j = 0; j < candidateIdRow.length; j++) {
							const candidateId = candidateIdRow[j];
							const voteCount = voteCountRow[j];
							if (candidateId !== undefined && voteCount !== undefined) {
								electionResults.push({
									candidateId: Number(candidateId),
									voteCount: Number(voteCount),
								});
							}
						}
					}
				}
			}

			return Result.ok(electionResults);
		} catch (e: any) {
			console.error(`Read contract call failed for getElectionResults:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async updateParty(
		partyId: number,
		name: string,
		logoCid: string,
	): Promise<Result<void, UpdatePartyError>> {
		return Result.err({ type: "UnknownError", message: "Not implemented" });
	}
}

export { BlockchainVotingSystem };
