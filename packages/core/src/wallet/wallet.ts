import type { PublicClient, WalletClient, Address } from "viem";
import { assert } from "../lib/assert";

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
		const account = this.walletClient.account;
		assert(account, "ERR_ACCOUNT_UNDEFINED");
		assert(account.address, "ERR_ACCOUNT_ADDRESS_UNDEFINED");
		return account.address;
	}
}

export { Wallet };
