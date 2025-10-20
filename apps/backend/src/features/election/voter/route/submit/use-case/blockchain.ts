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
				Number.parseInt(payload.election_id),
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
				Number.parseInt(payload.election_id),
			);
			if (electionStatusResult.isErr) {
				this.logger.error(
					"Failed to get election status:",
					electionStatusResult.error,
				);
				return Result.err({
					code: "ERR_UNEXPECTED",
				});
			}

			const electionStatus = electionStatusResult.value;
			if (electionStatus === "Pending") {
				this.logger.warn("Attempt to vote in pending election:");
				return Result.err({
					code: "ERR_ELECTION_NOT_STARTED",
				});
			} else if (electionStatus === "Ended") {
				this.logger.warn("Attempt to vote in ended election:");
				return Result.err({
					code: "ERR_ELECTION_ALREADY_ENDED",
				});
			}

			// For each vote, submit to blockchain
			for (const vote of payload.votes) {
				// Get candidate details from blockchain to validate existence
				const candidateResult = await votingSystem.getCandidate(
					Number.parseInt(vote.candidate_id),
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
				const getPartyAddressResult =
					await votingSystem.getPartyAddressByCandidateId(
						Number.parseInt(vote.candidate_id),
					);

				if (getPartyAddressResult.isErr) {
					this.logger.error(
						`Party not found for candidate ${vote.candidate_id}`,
						getPartyAddressResult.error,
					);

					switch (getPartyAddressResult.error.type) {
						case "PartyNotFoundError": {
							return Result.err({
								code: "ERR_PARTY_NOT_FOUND",
							});
						}
						case "CandidateNotFoundError": {
							return Result.err({
								code: "ERR_CANDIDATE_NOT_FOUND",
							});
						}
						default: {
							return Result.err({
								code: "ERR_UNEXPECTED",
							});
						}
					}
				}

				const partyAddress = getPartyAddressResult.value;

				// Cast the vote on the blockchain
				const castVoteResult = await votingSystem.castVote(
					Number.parseInt(payload.election_id),
					partyAddress,
					Number.parseInt(vote.candidate_id),
				);

				if (castVoteResult.isErr) {
					this.logger.error(
						`Failed to cast vote for candidate ${vote.candidate_id} on blockchain:`,
						castVoteResult.error,
					);

					switch (castVoteResult.error.type) {
						case "ElectionNotFoundError": {
							return Result.err({
								code: "ERR_ELECTION_NOT_FOUND",
							});
						}
						case "AlreadyVotedError": {
							return Result.err({
								code: "ERR_VOTER_ALREADY_VOTED",
							});
						}
						case "CandidateNotFoundError": {
							return Result.err({
								code: "ERR_CANDIDATE_NOT_FOUND",
							});
						}
						case "ElectionNotActiveError": {
							return Result.err({
								code: "ERR_ELECTION_NOT_STARTED",
							});
						}
						default: {
							return Result.err({
								code: "ERR_UNEXPECTED",
							});
						}
					}
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
