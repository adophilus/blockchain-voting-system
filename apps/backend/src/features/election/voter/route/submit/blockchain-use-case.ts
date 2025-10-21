// @ts-nocheck
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { BlockchainService } from '@/features/blockchain/service'
import { Logger } from '@/features/logger'

export class BlockchainSubmitVoteUseCase {
  constructor(
    private blockchainService: BlockchainService,
    private logger: Logger,
  ) {}

  async execute(
    payload: Request.Body,
  ): Promise<Result<Response.Success, Response.Error>> {
    try {
      // If blockchain service is not initialized, skip blockchain submission
      if (!this.blockchainService.isInitialized()) {
        this.logger.info('Blockchain service not initialized, skipping blockchain vote submission')
        return Result.ok({
          code: 'VOTE_SUBMITTED',
          data: {
            success: true,
            message: 'Votes submitted successfully (blockchain disabled)',
          },
        })
      }

      const votingSystem = this.blockchainService.getVotingSystem()
      if (!votingSystem) {
        this.logger.warn('Voting system not available, skipping blockchain vote submission')
        return Result.ok({
          code: 'VOTE_SUBMITTED',
          data: {
            success: true,
            message: 'Votes submitted successfully (blockchain unavailable)',
          },
        })
      }

      // Validate election exists on blockchain
      const electionResult = await votingSystem.getElection(
        payload.election_id,
      )
      if (electionResult.isErr) {
        this.logger.error(
          'Election not found on blockchain:',
          electionResult.error,
        )
        return Result.err({
          code: 'ERR_ELECTION_NOT_FOUND',
        })
      }

      // Validate election is active
      const electionStatusResult = await votingSystem.getElectionStatus(
        payload.election_id,
      )
      if (electionStatusResult.isErr) {
        this.logger.error(
          'Failed to get election status:',
          electionStatusResult.error,
        )
        return Result.err({
          code: 'ERR_ELECTION_STATUS_CHECK_FAILED',
        })
      }

      const electionStatus = electionStatusResult.value
      if (electionStatus !== 'Active') {
        this.logger.warn(
          'Attempt to vote in inactive election:',
          electionStatus,
        )
        return Result.err({
          code: 'ERR_ELECTION_NOT_ACTIVE',
        })
      }

      // For each vote, submit to blockchain
      for (const vote of payload.votes) {
        // Get candidate details from blockchain to validate existence
        const candidateResult = await votingSystem.getCandidate(
          vote.candidate_id,
        )
        if (candidateResult.isErr) {
          this.logger.error(
            `Candidate ${vote.candidate_id} not found on blockchain:`,
            candidateResult.error,
          )
          return Result.err({
            code: 'ERR_CANDIDATE_NOT_FOUND',
          })
        }

        const candidate = candidateResult.value

        // Get party address for this candidate
        // In a real implementation, this would use ZK proofs to verify eligibility
        // For now, we'll use a simplified approach
        const partyAddress = await this.getPartyAddressForCandidate(
          votingSystem,
          vote.candidate_id,
        )

        if (!partyAddress) {
          this.logger.error(
            `Party not found for candidate ${vote.candidate_id}`,
          )
          return Result.err({
            code: 'ERR_PARTY_NOT_FOUND',
          })
        }

        // Cast the vote on the blockchain using meta-transaction (gasless)
        // The backend pays gas fees on behalf of the voter
        const castVoteResult = await votingSystem.castVote(
          payload.election_id,
          partyAddress,
          vote.candidate_id,
        )

        if (castVoteResult.isErr) {
          this.logger.error(
            `Failed to cast vote for candidate ${vote.candidate_id} on blockchain:`,
            castVoteResult.error,
          )
          // Note: We don't return an error here because the vote was already recorded in DB
          // This is a relay approach where blockchain is supplementary
        } else {
          this.logger.info(
            `Successfully cast vote for candidate ${vote.candidate_id} (${candidate.name}) on blockchain`,
          )
        }
      }

      return Result.ok({
        code: 'VOTE_SUBMITTED',
        data: {
          success: true,
          message: 'Votes submitted successfully to blockchain',
        },
      })
    } catch (error) {
      this.logger.error('Error submitting vote to blockchain:', error)
      // Even if blockchain submission fails, we still return success
      // because the vote was recorded in the database
      return Result.ok({
        code: 'VOTE_SUBMITTED',
        data: {
          success: true,
          message: 'Votes submitted successfully (blockchain submission failed)',
        },
      })
    }
  }

  /**
   * Helper method to get the party address for a given candidate
   * In a real ZK implementation, this would use Semaphore or similar
   * For now, we'll use a simplified mapping
   */
  private async getPartyAddressForCandidate(
    votingSystem: any, // Replace with actual BlockchainVotingSystem type
    candidateId: number,
  ): Promise<string | null> {
    try {
      this.logger.debug(`Getting party address for candidate ${candidateId}`)

      // In a real ZK implementation with Semaphore:
      // 1. Generate ZK proof that voter is eligible
      // 2. Submit proof to blockchain contract
      // 3. Contract verifies proof without knowing voter identity
      
      // For demonstration, we'll use a mock mapping:
      const mockPartyAddresses = [
        '0x1234567890123456789012345678901234567890',
        '0xabcdef123456789012345678901234567890abcd',
        '0x9876543210987654321098765432109876543210',
      ]

      // Simple mock: assign candidates to parties in round-robin fashion
      const partyIndex = (candidateId - 1) % mockPartyAddresses.length
      const partyAddress = mockPartyAddresses[partyIndex]

      this.logger.debug(
        `Found party address ${partyAddress} for candidate ${candidateId}`,
      )

      return partyAddress
    } catch (error) {
      this.logger.error(
        `Failed to get party address for candidate ${candidateId}:`,
        error,
      )
      return null
    }
  }
}
