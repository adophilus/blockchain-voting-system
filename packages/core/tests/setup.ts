import { createPublicClient, createWalletClient, http } from "viem";
import { foundry } from "viem/chains";
import { env } from "../src/env";
import { Wallet } from "../src/wallet";

const chain = foundry;

const privateKey = env.PRIVATE_KEY;

const publicClient = createPublicClient({
	chain,
	transport: http(),
});

const walletClient = createWalletClient({
	chain,
	transport: http(),
});

const wallet = new Wallet(privateKey, walletClient, publicClient);

export { wallet };
