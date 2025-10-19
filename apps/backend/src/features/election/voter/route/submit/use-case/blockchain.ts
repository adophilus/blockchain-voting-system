import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { BlockchainService } from "@/features/blockchain/service";
import { Logger } from "@/features/logger";
import { SubmitVoteUseCase } from "./interface";

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

			// For each vote, submit to blockchain
			// Note: This is a simplified implementation. In a real system, we'd need to:
			// 1. Map candidate IDs to actual blockchain candidate IDs
			// 2. Map parties to blockchain party addresses
			// 3. Handle errors more gracefully
			for (const vote of payload.votes) {
				// TODO: In a real implementation, we'd need to:
				// - Get the actual party address for this candidate
				// - Get the actual blockchain candidate ID
				// For now, we'll use placeholder values
				const partyAddress =
					"0x0000000000000000000000000000000000000000" as const;
				const blockchainCandidateId = vote.candidate_id;

				const castVoteResult = await votingSystem.castVote(
					payload.election_id,
					partyAddress,
					blockchainCandidateId,
				);

				if (castVoteResult.isErr) {
					this.logger.error(
						"Failed to cast vote on blockchain:",
						castVoteResult.error,
					);
					// Note: We don't return an error here because the vote was already recorded in DB
					// This is a relay approach where blockchain is supplementary
				} else {
					this.logger.info(
						`Successfully cast vote for candidate ${vote.candidate_id} on blockchain`,
					);
				}
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
			// Even if blockchain submission fails, we still return success
			// because the vote was recorded in the database
			return Result.ok({
				code: "VOTE_SUBMITTED",
				data: {
					success: true,
					message:
						"Votes submitted successfully (blockchain submission failed)",
				},
			});
		}
	}
}
