import {
	PublicClient,
	WalletClient,
	Address,
	getContractAddress,
	TransactionReceipt,
	Hex,
	type Abi,
	type ContractConstructorArgs,
	type Chain,
	type Account,
} from "viem";
import { Result } from "true-myth";
import type {
	VotingSystemDeployer,
	DeployedContractAddresses,
	DeployContractError,
	DeployAllContractsError,
	DeploymentFailedError,
	InvalidDeployerAccountError,
	UnknownDeployerError,
} from "./interface";
import VoterRegistryMetadata from "@blockchain-voting-system/contracts/VoterRegistry.sol/VoterRegistry.json";
import VotingSystemMetadata from "@blockchain-voting-system/contracts/VotingSystem.sol/VotingSystem.json";
import CandidateRegistryMetadata from "@blockchain-voting-system/contracts/CandidateRegistry.sol/CandidateRegistry.json";
import PartyRegistryMetadata from "@blockchain-voting-system/contracts/PartyRegistry.sol/PartyRegistry.json";

const VoterRegistryABI = VoterRegistryMetadata.abi;
const VoterRegistryBytecode = VoterRegistryMetadata.bytecode.object as Hex;

const CandidateRegistryABI = CandidateRegistryMetadata.abi;
const CandidateRegistryBytecode = CandidateRegistryMetadata.bytecode
	.object as Hex;

const PartyRegistryABI = PartyRegistryMetadata.abi;
const PartyRegistryBytecode = PartyRegistryMetadata.bytecode.object as Hex;

const VotingSystemABI = VotingSystemMetadata.abi;
const VotingSystemBytecode = VotingSystemMetadata.bytecode.object as Hex;

class BlockchainVotingSystemDeployer implements VotingSystemDeployer {
	protected walletClient: WalletClient;
	protected publicClient: PublicClient;

	constructor(walletClient: WalletClient, publicClient: PublicClient) {
		this.walletClient = walletClient;
		this.publicClient = publicClient;
	}

	private async deployContract<A extends Abi>(
		abi: A,
		bytecode: Hex,
		args?: ContractConstructorArgs<A>,
	): Promise<Result<Address, DeployContractError>> {
		try {
			const account = this.walletClient.account;
			const chain = this.walletClient.chain;

			if (!account) {
				return Result.err({ type: "InvalidDeployerAccountError" });
			}

			const hash = await this.walletClient.deployContract({
				abi,
				account,
				bytecode,
				args: args ?? [],
				chain,
			} as any);

			const receipt = await this.publicClient.waitForTransactionReceipt({
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

	public async deployVoterRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(VoterRegistryABI, VoterRegistryBytecode);
	}

	public async deployCandidateRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(CandidateRegistryABI, CandidateRegistryBytecode);
	}

	public async deployPartyRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(PartyRegistryABI, PartyRegistryBytecode);
	}

	public async deployVotingSystem(
		voterRegistryAddress: Address,
		candidateRegistryAddress: Address,
		partyRegistryAddress: Address,
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(VotingSystemABI, VotingSystemBytecode, [
			voterRegistryAddress,
			candidateRegistryAddress,
			partyRegistryAddress,
		]);
	}

	public async deployAll(): Promise<
		Result<DeployedContractAddresses, DeployAllContractsError>
	> {
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

		const partyRegistryResult = await this.deployPartyRegistry();
		if (partyRegistryResult.isErr) {
			return Result.err(partyRegistryResult.error);
		}
		const partyRegistryAddress = partyRegistryResult.value;

		const votingSystemResult = await this.deployVotingSystem(
			voterRegistryAddress,
			candidateRegistryAddress,
			partyRegistryAddress,
		);
		if (votingSystemResult.isErr) {
			return Result.err(votingSystemResult.error);
		}
		const votingSystemAddress = votingSystemResult.value;

		return Result.ok({
			votingSystem: votingSystemAddress,
			voterRegistry: voterRegistryAddress,
			candidateRegistry: candidateRegistryAddress,
			partyRegistry: partyRegistryAddress,
		});
	}
}

export { BlockchainVotingSystemDeployer };
