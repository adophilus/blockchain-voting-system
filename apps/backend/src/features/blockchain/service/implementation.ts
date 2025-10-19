import { BlockchainVotingSystem } from "@blockchain-voting-system/core";
import { jsonRpc } from "viem/nonce";
import { Wallet } from "@blockchain-voting-system/core";
import type { Logger } from "@/features/logger";
import {
	createNonceManager,
	createPublicClient,
	createWalletClient,
	http,
	type Address,
	type Hex,
} from "viem";
import { foundry, polygon } from "viem/chains";
import { config } from "@/features/config";
import { privateKeyToAccount } from "viem/accounts";
import { BlockchainService } from "./interface";

export type BlockchainServiceError = never;

export class BlockchainServiceImplementation implements BlockchainService {
	private votingSystem: BlockchainVotingSystem;

	constructor(
		private readonly privateKey: Hex,
		private votingSystemAddress: Address,
		private logger: Logger,
	) {
		const chain = config.environment.DEVELOPMENT ? foundry : polygon;
		const transport = http();
		const nonceManager = createNonceManager({ source: jsonRpc() });
		const account = privateKeyToAccount(privateKey, { nonceManager });

		const publicClient = createPublicClient({ chain, transport });
		const walletClient = createWalletClient({ chain, transport, account });
		const wallet = new Wallet(privateKey, publicClient, walletClient);

		this.votingSystem = new BlockchainVotingSystem(
			wallet,
			this.votingSystemAddress,
		);
	}

	getVotingSystem(): BlockchainVotingSystem {
		return this.votingSystem;
	}
}
