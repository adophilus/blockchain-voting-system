import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { Logger } from '@/features/logger'
import type { ElectionRepository } from '@/features/election/repository'
import type { VoterRepository } from '@/features/election/voter/repository'
import type { VoteRepository } from '@/features/election/voting/repository'
import type { PositionRepository } from '@/features/election/position/repository'
import type { CandidateRepository } from '@/features/election/candidate/repository'

export class GetElectionResultsUseCase {
  constructor(
    private electionRepository: ElectionRepository,
    private voterRepository: VoterRepository,
    private voteRepository: VoteRepository,
    private positionRepository: PositionRepository,
    private candidateRepository: CandidateRepository,
    private logger: Logger
  ) {}

  async execute(
    payload: Request.Params
  ): Promise<Result<Response.Success, Response.Error>> {
    const { electionId } = payload

    const electionResult = await this.electionRepository.getById(electionId)
    if (electionResult.isErr) {
      this.logger.error('Failed to get election:', electionResult.error)
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    const election = electionResult.value
    if (!election) return Result.err({ code: 'ERR_ELECTION_NOT_FOUND' })

    const votersResult =
      await this.voterRepository.getByElectionId(electionId)
    if (votersResult.isErr) {
      this.logger.error('Failed to get voters:', votersResult.error)
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    const voters = votersResult.value

    const allVotesResult =
      await this.voteRepository.findByElectionId(electionId)
    if (allVotesResult.isErr) {
      this.logger.error('Failed to get votes:', allVotesResult.error)
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    const allVotes = allVotesResult.value

    const positionsResult =
      await this.positionRepository.getByElectionId(electionId)
    if (positionsResult.isErr) {
      this.logger.error('Failed to get positions:', positionsResult.error)
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    const positions = positionsResult.value

    const positionIds = positions.map((p) => p.id)
    const candidatesResult =
      await this.candidateRepository.getByPositionIds(positionIds)
    if (candidatesResult.isErr) {
      this.logger.error('Failed to get candidates:', candidatesResult.error)
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    const candidates = candidatesResult.value

    const positionResults = positions.map((position) => {
      const candidatesForPosition = candidates.filter(
        (c) => c.position_id === position.id
      )
      const votesForPosition = allVotes.filter(
        (v) => v.position_id === position.id
      )
      const total_votes_for_position = votesForPosition.length

      const candidateResults = candidatesForPosition.map((candidate) => {
        const votesForCandidate = votesForPosition.filter(
          (v) => v.candidate_id === candidate.id
        ).length
        const percentage =
          total_votes_for_position > 0
            ? (votesForCandidate / total_votes_for_position) * 100
            : 0
        return {
          ...candidate,
          votes: votesForCandidate,
          percentage
        }
      })

      return {
        ...position,
        total_votes: total_votes_for_position,
        candidates: candidateResults.sort((a, b) => b.votes - a.votes)
      }
    })

    return Result.ok({
      code: 'ELECTION_RESULTS',
      data: {
        election,
        total_voters: voters.length,
        total_votes: voters.filter((v) => v.status === 'VOTED').length,
        positions: positionResults
      }
    })
  }
}
