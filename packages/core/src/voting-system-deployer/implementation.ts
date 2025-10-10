import type { Address, Hex, Abi, ContractConstructorArgs } from "viem";
import { Result } from "true-myth";
import type {
	VotingSystemDeployer,
	DeployContractError,
	DeploySystemError,
} from "./interface";
import VotingSystemMetadata from "@blockchain-voting-system/contracts/VotingSystem.sol/VotingSystem.json";
import type { Wallet } from "../wallet";

const VotingSystemABI = VotingSystemMetadata.abi as Abi;
const VotingSystemBytecode = VotingSystemMetadata.bytecode.object as Hex;

class BlockchainVotingSystemDeployer implements VotingSystemDeployer {
	constructor(private readonly wallet: Wallet) {}

	private async deployContract<A extends Abi>(
		abi: A,
		bytecode: Hex,
		args?: ContractConstructorArgs<A>,
	): Promise<Result<Address, DeployContractError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();

			const account = walletClient.account;
			const chain = walletClient.chain;

			if (!account) {
				return Result.err({ type: "InvalidDeployerAccountError" });
			}

			const hash = await walletClient.deployContract({
				abi,
				account,
				bytecode,
				args: args ?? [],
				chain,
			} as any);

			const receipt = await publicClient.waitForTransactionReceipt({
				hash,
			});

			if (!receipt.contractAddress) {
				return Result.err({ type: "DeploymentFailedError" });
			}

			return Result.ok(receipt.contractAddress);
		} catch (e: any) {
			console.error("Contract deployment failed:", e);
			return Result.err({ type: "UnknownDeployerError" });
		}
	}

	private async deployVotingSystem(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(VotingSystemABI, VotingSystemBytecode);
	}

	public async deploySystem(): Promise<Result<Address, DeploySystemError>> {
		const votingSystemResult = await this.deployVotingSystem();
		if (votingSystemResult.isErr) {
			return Result.err(votingSystemResult.error);
		}
		const votingSystemAddress = votingSystemResult.value;

		return Result.ok(votingSystemAddress);
	}
}

export { BlockchainVotingSystemDeployer };
