import { Identity } from '@semaphore-protocol/identity'
import { generateProof } from '@semaphore-protocol/proof'
import { packProof } from '@semaphore-protocol/proof'
import type { FullProof } from '@semaphore-protocol/proof'
import { Logger } from '@/features/logger'

export class ZKUtil {
  constructor(private logger: Logger) {}

  /**
   * Generates a Semaphore identity for a voter
   * @returns A new Semaphore identity
   */
  generateIdentity(): Identity {
    try {
      const identity = new Identity()
      this.logger.info('Generated new Semaphore identity')
      return identity
    } catch (error) {
      this.logger.error('Failed to generate Semaphore identity:', error)
      throw error
    }
  }

  /**
   * Recreates a Semaphore identity from a secret
   * @param secret The identity secret as a string
   * @returns A Semaphore identity
   */
  recreateIdentity(secret: string): Identity {
    try {
      const identity = new Identity(secret)
      this.logger.info('Recreated Semaphore identity from secret')
      return identity
    } catch (error) {
      this.logger.error('Failed to recreate Semaphore identity:', error)
      throw error
    }
  }

  /**
   * Generates a ZK proof for voting
   * @param identity The voter's Semaphore identity
   * @param groupId The Semaphore group ID
   * @param signal The voting signal (vote data)
   * @param externalNullifier The external nullifier (election context)
   * @returns A packed ZK proof ready for blockchain submission
   */
  async generateVotingProof(
    identity: Identity,
    groupId: bigint,
    signal: string,
    externalNullifier: string
  ): Promise<{ proof: Uint8Array; publicSignals: string[] }> {
    try {
      this.logger.info(`Generating ZK proof for signal: ${signal}`)

      // Generate the full ZK proof
      const fullProof: FullProof = await generateProof(
        identity,
        groupId,
        signal,
        externalNullifier
      )

      // Pack the proof for efficient transmission
      const packedProof = packProof(fullProof.proof)

      this.logger.info('Successfully generated and packed ZK proof')
      return {
        proof: packedProof,
        publicSignals: fullProof.publicSignals.map((s) => s.toString())
      }
    } catch (error) {
      this.logger.error('Failed to generate ZK voting proof:', error)
      throw error
    }
  }

  /**
   * Validates if an identity secret is valid
   * @param secret The identity secret to validate
   * @returns True if valid, false otherwise
   */
  isValidIdentitySecret(secret: string): boolean {
    try {
      new Identity(secret)
      return true
    } catch (error) {
      return false
    }
  }
}