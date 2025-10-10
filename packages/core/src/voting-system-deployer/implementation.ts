import type { Address, Hex, Abi, ContractConstructorArgs } from "viem";
import { Result } from "true-myth";
import type {
	VotingSystemDeployer,
	DeployedContractAddresses,
	DeployContractError,
	DeploySystemError,
} from "./interface";
import VoterRegistryMetadata from "@blockchain-voting-system/contracts/VoterRegistry.sol/VoterRegistry.json";
import VotingSystemMetadata from "@blockchain-voting-system/contracts/VotingSystem.sol/VotingSystem.json";
import CandidateRegistryMetadata from "@blockchain-voting-system/contracts/CandidateRegistry.sol/CandidateRegistry.json";
import PartyMetadata from "@blockchain-voting-system/contracts/Party.sol/Party.json";
import { Wallet } from "../wallet";

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
			// const nonce = await publicClient.getTransactionCount({
			// 	address: this.wallet.getAddress(),
			// });

			if (!account) {
				return Result.err({ type: "InvalidDeployerAccountError" });
			}

			const hash = await walletClient.deployContract({
				abi,
				account,
				bytecode,
				args: args ?? [],
				// nonce,
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
		return this.deployContract(VoterRegistryABI, VoterRegistryBytecode);
	}

	private async deployCandidateRegistry(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(CandidateRegistryABI, CandidateRegistryBytecode);
	}

	private async deployPartyAddress(
		_name: string,
		_slogan: string,
		_cid: string,
		_candidateRegistryAddress: Address,
	): Promise<Result<Address, DeployContractError>> {
		return this.deployContract(PartyABI, PartyBytecode, [
			_name,
			_slogan,
			_cid,
			_candidateRegistryAddress,
		]);
	}

	private async deployVotingSystem(): Promise<
		Result<Address, DeployContractError>
	> {
		return this.deployContract(VotingSystemABI, VotingSystemBytecode);
	}

	public async deploySystem(): Promise<
		Result<DeployedContractAddresses, DeploySystemError>
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

		// Placeholder values for Party constructor
		const partyName = "Default Party";
		const partySlogan = "Vote for the best!";
		const partyCid = "QmPlaceholderCidForPartyLogo"; // Replace with actual CID

		const partyAddressResult = await this.deployPartyAddress(
			partyName,
			partySlogan,
			partyCid,
			candidateRegistryAddress,
		);
		if (partyAddressResult.isErr) {
			return Result.err(partyAddressResult.error);
		}
		const partyAddress = partyAddressResult.value;

		console.log("about to deploy voting system");
		const votingSystemResult = await this.deployVotingSystem();
		if (votingSystemResult.isErr) {
			return Result.err(votingSystemResult.error);
		}
		const votingSystemAddress = votingSystemResult.value;

		return Result.ok({
			votingSystem: votingSystemAddress,
			voterRegistry: voterRegistryAddress,
			candidateRegistry: candidateRegistryAddress,
			partyAddress: partyAddress,
		});
	}
}

export { BlockchainVotingSystemDeployer };
