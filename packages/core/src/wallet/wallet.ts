import { PublicClient, WalletClient, Address } from "viem";

class Wallet {
	constructor(
		private readonly privateKey: string,
		private readonly publicClient: PublicClient,
		private readonly walletClient: WalletClient,
	) {
		if (!walletClient.account) {
			throw new Error("WalletClient must have an account attached.");
		}
	}

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
