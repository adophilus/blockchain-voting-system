import type { PublicClient, WalletClient, Address } from "viem";

class Wallet {
	constructor(
		private readonly privateKey: string,
		private readonly publicClient: PublicClient,
		private readonly walletClient: WalletClient,
	) {}

	public getPrivateKey(): string {
		return this.privateKey;
	}

	public getPublicClient(): PublicClient {
		return this.publicClient;
	}

	public getWalletClient(): WalletClient {
		return this.walletClient;
	}
}

export { Wallet };
