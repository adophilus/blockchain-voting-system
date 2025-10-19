import { env } from '../env'

const BlockchainConfig = {
  votingSystemAddress: env.BLOCKCHAIN_VOTING_SYSTEM_ADDRESS,
  walletPrivateKey: env.BLOCKCHAIN_WALLET_PRIVATE_KEY,
  rpcUrl: env.BLOCKCHAIN_RPC_URL,
}

export default BlockchainConfig