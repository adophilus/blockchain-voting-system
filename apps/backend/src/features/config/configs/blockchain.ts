import { env } from "../env";

const BlockchainConfig = {
	votingSystemAddress: env.BLOCKCHAIN_VOTING_SYSTEM_ADDRESS,
	walletPrivateKey: env.BLOCKCHAIN_WALLET_PRIVATE_KEY,
};

export default BlockchainConfig;
