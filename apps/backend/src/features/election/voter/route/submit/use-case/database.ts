import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { VoterRepository } from "@/features/election/voter/repository";
import type { VoteRepository } from "@/features/election/voting/repository";
import { ulid } from "ulidx";
import type { Vote } from "@/types";
import { SubmitVoteUseCase } from "./interface";

export class DatabaseSubmitVoteUseCase implements SubmitVoteUseCase {
	constructor(
		private voterRepository: VoterRepository,
		private voteRepository: VoteRepository,
	) {}

	async execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const voterResult = await this.voterRepository.getByCode(
			payload.election_id,
			payload.voter_code,
		);

		if (voterResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const voter = voterResult.value;

		if (!voter) {
			return Result.err({
				code: "ERR_VOTER_NOT_FOUND",
			});
		}

		// Check if voter has already voted
		if (voter.status === "VOTED") {
			return Result.err({
				code: "ERR_VOTER_ALREADY_VOTED",
			});
		}

		// Create vote records
		const votesToInsert: Vote.Insertable[] = payload.votes.map((vote) => ({
			...vote,
			election_id: payload.election_id,
			voter_id: voter.id,
			id: ulid(),
		}));

		// Insert votes
		const insertResult = await this.voteRepository.createMany(votesToInsert);

		if (insertResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		// Mark voter as voted
		const markResult = await this.voterRepository.markAsVoted(voter.id);

		if (markResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		return Result.ok({
			code: "VOTE_SUBMITTED",
			data: {
				success: true,
				message: "Votes submitted successfully",
			},
		});
	}
}
