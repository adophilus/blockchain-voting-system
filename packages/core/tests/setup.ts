import { createPublicClient, createWalletClient, http, type Hex } from "viem";
import { foundry } from "viem/chains";
import { env } from "./env";
import { Wallet } from "../src/wallet";
import { privateKeyToAccount } from "viem/accounts";
import { createNonceManager, jsonRpc } from "viem/nonce";

const chain = foundry;

let deployerWallet: Wallet;
let candidate1Wallet: Wallet;
let candidate2Wallet: Wallet;
let voter1Wallet: Wallet;
let voter2Wallet: Wallet;

{
	const privateKey = env.PRIVATE_KEY as Hex;
	const nonceManager = createNonceManager({ source: jsonRpc() });
	const account = privateKeyToAccount(privateKey, { nonceManager }) as any;
	const publicClient = createPublicClient({
		chain,
		transport: http(),
	});
	const walletClient = createWalletClient({
		chain,
		transport: http(),
		account,
	});
	deployerWallet = new Wallet(privateKey, publicClient, walletClient);
}

{
	const privateKey = env.CANDIDATE_1_PRIVATE_KEY as Hex;
	const nonceManager = createNonceManager({ source: jsonRpc() });
	const account = privateKeyToAccount(privateKey, { nonceManager }) as any;
	const publicClient = createPublicClient({
		chain,
		transport: http(),
	});
	const walletClient = createWalletClient({
		chain,
		transport: http(),
		account,
	});
	candidate1Wallet = new Wallet(privateKey, publicClient, walletClient);
}

{
	const privateKey = env.CANDIDATE_2_PRIVATE_KEY as Hex;
	const nonceManager = createNonceManager({ source: jsonRpc() });
	const account = privateKeyToAccount(privateKey, { nonceManager }) as any;
	const publicClient = createPublicClient({
		chain,
		transport: http(),
	});
	const walletClient = createWalletClient({
		chain,
		transport: http(),
		account,
	});
	candidate2Wallet = new Wallet(privateKey, publicClient, walletClient);
}

{
	const privateKey = env.VOTER_1_PRIVATE_KEY as Hex;
	const nonceManager = createNonceManager({ source: jsonRpc() });
	const account = privateKeyToAccount(privateKey, { nonceManager }) as any;
	const publicClient = createPublicClient({
		chain,
		transport: http(),
	});
	const walletClient = createWalletClient({
		chain,
		transport: http(),
		account,
	});
	voter1Wallet = new Wallet(privateKey, publicClient, walletClient);
}

{
	const privateKey = env.VOTER_2_PRIVATE_KEY as Hex;
	const nonceManager = createNonceManager({ source: jsonRpc() });
	const account = privateKeyToAccount(privateKey, { nonceManager }) as any;
	const publicClient = createPublicClient({
		chain,
		transport: http(),
	});
	const walletClient = createWalletClient({
		chain,
		transport: http(),
		account,
	});
	voter2Wallet = new Wallet(privateKey, publicClient, walletClient);
}

const sleep = (ms: number): Promise<void> =>
	new Promise((res) => setTimeout(res, ms));

export {
	chain,
	deployerWallet,
	candidate1Wallet,
	candidate2Wallet,
	voter1Wallet,
	voter2Wallet,
	sleep,
};
