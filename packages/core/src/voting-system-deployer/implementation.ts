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
import ElectionRegistryMetadata from "@blockchain-voting-system/contracts/ElectionRegistry.sol/ElectionRegistry.json";
import PartyRegistryMetadata from "@blockchain-voting-system/contracts/PartyRegistry.sol/PartyRegistry.json";
import type { Wallet } from "../wallet";

const VotingSystemABI = VotingSystemMetadata.abi as Abi;
const VotingSystemBytecode = VotingSystemMetadata.bytecode.object as Hex;

const VoterRegistryABI = VoterRegistryMetadata.abi as Abi;
const VoterRegistryBytecode = VoterRegistryMetadata.bytecode.object as Hex;

const CandidateRegistryABI = CandidateRegistryMetadata.abi as Abi;
const CandidateRegistryBytecode = CandidateRegistryMetadata.bytecode
	.object as Hex;

const ElectionRegistryABI = ElectionRegistryMetadata.abi as Abi;
const ElectionRegistryBytecode = ElectionRegistryMetadata.bytecode.object as Hex;

const PartyRegistryABI = PartyRegistryMetadata.abi as Abi;
const PartyRegistryBytecode = PartyRegistryMetadata.bytecode.object as Hex;

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

	private async deployElectionRegistry(
		voterRegistryAddress: Address
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(ElectionRegistryABI, ElectionRegistryBytecode, [
			voterRegistryAddress,
			this.wallet.getAddress(),
			this.wallet.getAddress(), // primary admin and secondary admin (will be updated after VotingSystem deployment)
		]);
	}

	private async deployPartyRegistry(
		candidateRegistryAddress: Address
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(PartyRegistryABI, PartyRegistryBytecode, [
			candidateRegistryAddress,
			this.wallet.getAddress(),
			this.wallet.getAddress(), // primary admin and secondary admin (will be updated after VotingSystem deployment)
		]);
	}

	private async deployVotingSystem(
		voterRegistryAddress: Address,
		candidateRegistryAddress: Address,
		electionRegistryAddress: Address,
		partyRegistryAddress: Address,
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(VotingSystemABI, VotingSystemBytecode, [
			voterRegistryAddress,
			candidateRegistryAddress,
			electionRegistryAddress,
			partyRegistryAddress,
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

		const electionRegistryResult = await this.deployElectionRegistry(voterRegistryAddress);
		if (electionRegistryResult.isErr) {
			return Result.err(electionRegistryResult.error);
		}
		const electionRegistryAddress = electionRegistryResult.value;

		const partyRegistryResult = await this.deployPartyRegistry(candidateRegistryAddress);
		if (partyRegistryResult.isErr) {
			return Result.err(partyRegistryResult.error);
		}
		const partyRegistryAddress = partyRegistryResult.value;

		const votingSystemResult = await this.deployVotingSystem(
			voterRegistryAddress,
			candidateRegistryAddress,
			electionRegistryAddress,
			partyRegistryAddress,
		);
		if (votingSystemResult.isErr) {
			return Result.err(votingSystemResult.error);
		}
		const votingSystemAddress = votingSystemResult.value;

		return Result.ok(votingSystemAddress);
	}
}

export { BlockchainVotingSystemDeployer };
