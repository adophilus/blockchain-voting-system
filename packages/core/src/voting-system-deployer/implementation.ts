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
import {} from "@blockchain-voting-system/contracts/VotingSystem.sol";

// Placeholder for contract artifacts - these would typically be imported from compiled contract JSON files
// For example: import VoterRegistryArtifact from '../../../../apps/contracts/artifacts/VoterRegistry.json';
// const VoterRegistryABI = VoterRegistryArtifact.abi;
// const VoterRegistryBytecode = VoterRegistryArtifact.bytecode;

// Assuming these exist for now
const VoterRegistryABI: any[] = []; // Replace with actual ABI
const VoterRegistryBytecode: Hex = "0x"; // Replace with actual bytecode

const CandidateRegistryABI: any[] = []; // Replace with actual ABI
const CandidateRegistryBytecode: Hex = "0x"; // Replace with actual bytecode

const PartyRegistryABI: any[] = []; // Replace with actual ABI
const PartyRegistryBytecode: Hex = "0x"; // Replace with actual bytecode

const VotingSystemABI: any[] = []; // Replace with actual ABI
const VotingSystemBytecode: Hex = "0x"; // Replace with actual bytecode

class BlockchainVotingSystemDeployer implements VotingSystemDeployer {
	protected walletClient: WalletClient;
	protected publicClient: PublicClient;

	constructor(walletClient: WalletClient, publicClient: PublicClient) {
		this.walletClient = walletClient;
		this.publicClient = publicClient;
	}

	private async deployContract<A extends Abi>(
		abi: A,
		args: ContractConstructorArgs<A>,
		bytecode: Hex,
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
				args,
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
