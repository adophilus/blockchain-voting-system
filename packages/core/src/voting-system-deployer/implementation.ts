import type { Address, Hex, Abi, ContractConstructorArgs } from "viem";
import { Result } from "true-myth";
import type {
	VotingSystemDeployer,
	DeployContractError,
	DeploySystemError,
} from "./interface";
import VotingSystemMetadata from "@blockchain-voting-system/contracts/VotingSystem.sol/VotingSystem.json";
import VoterRegistryMetadata from "@blockchain-voting-system/contracts/VoterRegistry.sol/VoterRegistry.json";
import CandidateRegistryMetadata from "@blockchain-voting-system/contracts/CandidateRegistry.sol/CandidateRegistry.json";
import type { Wallet } from "../wallet";

const VotingSystemABI = VotingSystemMetadata.abi as Abi;
const VotingSystemBytecode = VotingSystemMetadata.bytecode.object as Hex;

const VoterRegistryABI = VoterRegistryMetadata.abi as Abi;
const VoterRegistryBytecode = VoterRegistryMetadata.bytecode.object as Hex;

const CandidateRegistryABI = CandidateRegistryMetadata.abi as Abi;
const CandidateRegistryBytecode = CandidateRegistryMetadata.bytecode
	.object as Hex;

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

	private async deployVoterRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(VoterRegistryABI, VoterRegistryBytecode, [
			this.wallet.getAddress(),
		]);
	}

	private async deployCandidateRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(
			CandidateRegistryABI,
			CandidateRegistryBytecode,
			[this.wallet.getAddress()],
		);
	}

	private async deployVotingSystem(
		voterRegistryAddress: Address,
		candidateRegistryAddress: Address,
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(VotingSystemABI, VotingSystemBytecode, [
			voterRegistryAddress,
			candidateRegistryAddress,
			this.wallet.getAddress(),
		]);
	}

	public async deploySystem(): Promise<Result<Address, DeploySystemError>> {
		const voterRegistryResult = await this.deployVoterRegistry();
		if (voterRegistryResult.isErr) {
			return Result.err(voterRegistryResult.error);
		}
		const voterRegistryAddress = voterRegistryResult.value;

		const candidateRegistryResult = await this.deployCandidateRegistry();
		if (candidateRegistryResult.isErr) {
			return Result.err(candidateRegistryResult.error);
		}
		const candidateRegistryAddress = candidateRegistryResult.value;

		const votingSystemResult = await this.deployVotingSystem(
			voterRegistryAddress,
			candidateRegistryAddress,
		);
		if (votingSystemResult.isErr) {
			return Result.err(votingSystemResult.error);
		}
		const votingSystemAddress = votingSystemResult.value;

		return Result.ok(votingSystemAddress);
	}
}

export { BlockchainVotingSystemDeployer };
