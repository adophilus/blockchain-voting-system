import { createPublicClient, createWalletClient, http } from "viem";
import { foundry } from "viem/chains";
import { env } from "../src/env";
import { Wallet } from "../src/wallet";
import { privateKeyToAccount } from "viem/accounts";

const chain = foundry;

const privateKey = env.PRIVATE_KEY;

const account = privateKeyToAccount(privateKey) as any;

const publicClient = createPublicClient({
	chain,
	transport: http(),
});

const walletClient = createWalletClient({
	chain,
	transport: http(),
	account,
});

const wallet = new Wallet(privateKey, publicClient, walletClient);

export { wallet };
