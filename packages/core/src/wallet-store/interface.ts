import type { Address, Hex } from "viem";
import { Result } from "true-myth";
import { Wallet } from "../wallet";

// Error types for WalletStore operations
export type WalletNotFoundError = {
	type: "WalletNotFoundError";
	address: Address;
};
export type InvalidPrivateKeyError = { type: "InvalidPrivateKeyError" };
export type WalletAlreadyExistsError = {
	type: "WalletAlreadyExistsError";
	address: Address;
};
export type UnknownWalletStoreError = { type: "UnknownWalletStoreError" };

export type CreateWalletError = UnknownWalletStoreError;
export type StoreWalletError =
	| WalletAlreadyExistsError
	| UnknownWalletStoreError;
export type RestoreWalletError =
	| InvalidPrivateKeyError
	| WalletAlreadyExistsError
	| UnknownWalletStoreError;
export type GetWalletError = WalletNotFoundError | UnknownWalletStoreError;
export type RemoveWalletError = WalletNotFoundError | UnknownWalletStoreError;

export abstract class WalletStore {
	public abstract createWallet(): Promise<Result<Wallet, CreateWalletError>>;
	public abstract storeWallet(
		wallet: Wallet,
	): Promise<Result<void, StoreWalletError>>;
	public abstract restoreWallet(): Promise<
		Result<Wallet | null, RestoreWalletError>
	>;
}
