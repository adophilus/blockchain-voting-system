import { type Chain, createPublicClient, createWalletClient, http } from "viem";
import {
	privateKeyToAccount,
	generatePrivateKey,
	nonceManager,
} from "viem/accounts";
import { foundry } from "viem/chains";
import { Result } from "true-myth";
import { Wallet } from "../../wallet";
import type {
	WalletStore,
	CreateWalletError,
	StoreWalletError,
	RestoreWalletError,
} from "../interface";

const WALLET_STORE_KEY = "blockchain-voting-system:wallets";

class LocalStorageWalletStore implements WalletStore {
	constructor(private readonly chain: Chain) {}

	public async createWallet(): Promise<Result<Wallet, CreateWalletError>> {
		try {
			const privateKey = generatePrivateKey();
			const account = privateKeyToAccount(privateKey, { nonceManager }) as any;

			const publicClient = createPublicClient({
				chain: foundry,
				transport: http(),
			});
			const walletClient = createWalletClient({
				account,
				chain: this.chain,
				transport: http(),
			});
			return Result.ok(new Wallet(privateKey, publicClient, walletClient));
		} catch (e: any) {
			console.error("Error generating private key:", e);
			return Result.err({
				type: "UnknownWalletStoreError",
				message: e.message || "An unknown error occurred",
			});
		}
	}

	public async storeWallet(
		wallet: Wallet,
	): Promise<Result<void, StoreWalletError>> {
		try {
			const privateKey = wallet.getPrivateKey();

			window.localStorage.set(WALLET_STORE_KEY, privateKey);
			return Result.ok(undefined);
		} catch (e: any) {
			console.error("Error storing wallet:", e);
			return Result.err({
				type: "UnknownWalletStoreError",
				message: e.message || "An unknown error occurred",
			});
		}
	}

	public async restoreWallet(): Promise<
		Result<Wallet | null, RestoreWalletError>
	> {
		try {
			const privateKey = window.localStorage.get(WALLET_STORE_KEY);
			if (!privateKey) {
				return Result.ok(null);
			}

			const account = privateKeyToAccount(privateKey) as any;
			const publicClient = createPublicClient({
				chain: foundry,
				transport: http(),
			});
			const walletClient = createWalletClient({
				account,
				chain: this.chain,
				transport: http(),
			});

			return Result.ok(new Wallet(privateKey, publicClient, walletClient));
		} catch (e: any) {
			console.error("Error restoring wallet:", e);
			return Result.err({
				type: "UnknownWalletStoreError",
				message: e.message || "An unknown error occurred",
			});
		}
	}
}

export { LocalStorageWalletStore };
