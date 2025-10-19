import { BlockchainVotingSystem } from '@blockchain-voting-system/core'
import { Wallet } from '@blockchain-voting-system/core'
import type { Logger } from '@/features/logger'
import type { Address } from 'viem'

export class BlockchainService {
  private votingSystem: BlockchainVotingSystem | null = null

  constructor(
    private logger: Logger,
    private votingSystemAddress: Address
  ) {}

  async initialize(walletPrivateKey: `0x${string}`): Promise<void> {
    try {
      // Create wallet from private key
      const wallet = new Wallet(walletPrivateKey)
      
      // Create voting system instance
      this.votingSystem = new BlockchainVotingSystem(
        wallet,
        this.votingSystemAddress
      )
      
      this.logger.info('Blockchain service initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error)
      throw error
    }
  }

  getVotingSystem(): BlockchainVotingSystem | null {
    return this.votingSystem
  }

  isInitialized(): boolean {
    return this.votingSystem !== null
  }
}