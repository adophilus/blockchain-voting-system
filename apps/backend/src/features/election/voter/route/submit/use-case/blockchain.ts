import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { BlockchainService } from "@/features/blockchain/service";
import { Logger } from "@/features/logger";
import { SubmitVoteUseCase } from "./interface";

export class BlockchainSubmitVoteUseCase implements SubmitVoteUseCase {
	constructor(
		private blockchainService: BlockchainService,
		private logger: Logger,
	) {}

	async execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		try {
			const votingSystem = this.blockchainService.getVotingSystem();

			// Validate election exists on blockchain
			const findExistingElectionResult = await votingSystem.getElection(
				payload.election_id,
			);
			if (findExistingElectionResult.isErr) {
				this.logger.error(
					"Election not found on blockchain:",
					findExistingElectionResult.error,
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
				const partyAddress = await votingSystem.getPartyAddressByCandidateId(
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
			});
		} catch (error) {
			this.logger.error("Error submitting vote to blockchain:", error);
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}
	}
}
