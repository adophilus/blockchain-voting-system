import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { BlockchainService } from "@/features/blockchain/service";
import { Logger } from "@/features/logger";
import { SubmitVoteUseCase } from "./interface";
import type { BlockchainVotingSystem } from "@blockchain-voting-system/core";

export class BlockchainSubmitVoteUseCase implements SubmitVoteUseCase {
	constructor(
		private blockchainService: BlockchainService,
		private logger: Logger,
	) { }

	async execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			const votingSystem = this.blockchainService.getVotingSystem();

			// Validate election exists on blockchain
			const electionResult = await votingSystem.getElection(
				payload.election_id,
			);
			if (electionResult.isErr) {
				this.logger.error(
					"Election not found on blockchain:",
					electionResult.error,
				);
				return Result.err({
					code: "ERR_ELECTION_NOT_FOUND",
				});
			}

			// Validate election is active
			const electionStatusResult = await votingSystem.getElectionStatus(
				payload.election_id,
			);
			if (electionStatusResult.isErr) {
				this.logger.error(
					"Failed to get election status:",
					electionStatusResult.error,
				);
				return Result.err({
					code: "ERR_ELECTION_STATUS_CHECK_FAILED",
				});
			}

			const electionStatus = electionStatusResult.value;
			if (electionStatus !== "Active") {
				this.logger.warn(
					"Attempt to vote in inactive election:",
					electionStatus,
				);
				return Result.err({
					code: "ERR_ELECTION_NOT_ACTIVE",
				});
			}

			// For each vote, submit to blockchain
			for (const vote of payload.votes) {
				// Get candidate details from blockchain to validate existence
				const candidateResult = await votingSystem.getCandidate(
					vote.candidate_id,
				);
				if (candidateResult.isErr) {
					this.logger.error(
						`Candidate ${vote.candidate_id} not found on blockchain:`,
						candidateResult.error,
					);
					return Result.err({
						code: "ERR_CANDIDATE_NOT_FOUND",
					});
				}

				const candidate = candidateResult.value;

				// Get party details for this candidate
				const partyAddress = await this.getPartyAddressForCandidate(
					votingSystem,
					vote.candidate_id,
				);

				if (!partyAddress) {
					this.logger.error(
						`Party not found for candidate ${vote.candidate_id}`,
					);
					return Result.err({
						code: "ERR_PARTY_NOT_FOUND",
					});
				}

				// Cast the vote on the blockchain
				const castVoteResult = await votingSystem.castVote(
					payload.election_id,
					partyAddress,
					vote.candidate_id,
				);

				if (castVoteResult.isErr) {
					this.logger.error(
						`Failed to cast vote for candidate ${vote.candidate_id} on blockchain:`,
						castVoteResult.error,
					);
					// Return error since blockchain submission failed
					return Result.err({
						code: "ERR_BLOCKCHAIN_VOTE_SUBMISSION_FAILED",
					});
				}

				this.logger.info(
					`Successfully cast vote for candidate ${vote.candidate_id} (${candidate.name}) on blockchain`,
				);
			}

			return Result.ok({
				code: "VOTE_SUBMITTED",
				data: {
					success: true,
					message: "Votes submitted successfully to blockchain",
				},
			});
		} catch (error) {
			this.logger.error("Error submitting vote to blockchain:", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}

	/**
	 * Helper method to get the party address for a given candidate
	 * This queries the blockchain to find which party registered the candidate
	 */
	private async getPartyAddressForCandidate(
		votingSystem: BlockchainVotingSystem,
		candidateId: number,
	): Promise<string | null> {
		try {
			this.logger.debug(`Getting party address for candidate ${candidateId}`);

			// Get candidate details to get the partyId
			const candidateResult = await votingSystem.getCandidate(candidateId);

			if (candidateResult.isErr) {
				this.logger.error(
					`Failed to get candidate ${candidateId} from registry:`,
					candidateResult.error,
				);
				return null;
			}

			const candidate = candidateResult.value;

			// Extract partyId from candidate details
			// In the enhanced contracts, the candidate would include a partyId field
			const partyId = candidate.partyId; // This assumes the candidate struct has a partyId field

			if (!partyId) {
				this.logger.warn(`Candidate ${candidateId} has no associated party`);
				return null;
			}

			// Get party registry address from voting system
			const partyRegistryAddress = await votingSystem.getPartyRegistryAddress();

			if (!partyRegistryAddress) {
				this.logger.error("Failed to get party registry address");
				return null;
			}

			// Get party address from party registry using partyId
			const partyAddress = await votingSystem.getParty(partyId);

			if (!partyAddress) {
				this.logger.warn(`No party found with ID ${partyId}`);
				return null;
			}

			this.logger.debug(
				`Found party ${partyId} with address ${partyAddress} for candidate ${candidateId}`,
			);
			
			return partyAddress;
		} catch (error) {
			this.logger.error(
				`Failed to get party address for candidate ${candidateId}:`,
				error,
			);
			return null;
		}
	}
}
