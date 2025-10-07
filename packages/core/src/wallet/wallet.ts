import type { PublicClient, WalletClient, Address } from "viem";
import { assert } from "assertate";

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

	public getAddress(): Address {
		assert(this.walletClient.account);
		return this.walletClient.account?.getAddress() as Address;
	}
}

export { Wallet };
