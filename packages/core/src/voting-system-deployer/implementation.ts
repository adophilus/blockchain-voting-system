import type {
	PublicClient,
	WalletClient,
	Address,
	Hex,
	Abi,
	ContractConstructorArgs,
} from "viem";
import { Result } from "true-myth";
import type {
	VotingSystemDeployer,
	DeployedContractAddresses,
	DeployContractError,
	DeployAllContractsError,
} from "./interface";
import VoterRegistryMetadata from "@blockchain-voting-system/contracts/VoterRegistry.sol/VoterRegistry.json";
import VotingSystemMetadata from "@blockchain-voting-system/contracts/VotingSystem.sol/VotingSystem.json";
import CandidateRegistryMetadata from "@blockchain-voting-system/contracts/CandidateRegistry.sol/CandidateRegistry.json";
import PartyMetadata from "@blockchain-voting-system/contracts/Party.sol/Party.json";

const VoterRegistryABI = VoterRegistryMetadata.abi as Abi;
const VoterRegistryBytecode = VoterRegistryMetadata.bytecode.object as Hex;

const CandidateRegistryABI = CandidateRegistryMetadata.abi as Abi;
const CandidateRegistryBytecode = CandidateRegistryMetadata.bytecode
	.object as Hex;

const PartyABI = PartyMetadata.abi as Abi;
const PartyBytecode = PartyMetadata.bytecode.object as Hex;

const VotingSystemABI = VotingSystemMetadata.abi as Abi;
const VotingSystemBytecode = VotingSystemMetadata.bytecode.object as Hex;

class BlockchainVotingSystemDeployer implements VotingSystemDeployer {
	constructor(
		private readonly walletClient: WalletClient,
		private readonly publicClient: PublicClient,
	) {}

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

	public async deployParty(): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(PartyABI, PartyBytecode);
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

		const partyRegistryResult = await this.deployParty();
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
