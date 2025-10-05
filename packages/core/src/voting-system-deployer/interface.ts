import { PublicClient, WalletClient, Address } from "viem";
import { Result } from "true-myth";

// Define the structure for contract addresses that will be deployed
export type DeployedContractAddresses = {
	votingSystem: Address;
	voterRegistry: Address;
	candidateRegistry: Address;
	partyRegistry: Address;
	// Add other contract addresses as needed
};

// --- Individual Error Types for Deployer ---
export type DeploymentFailedError = { type: 'DeploymentFailedError' };
export type InvalidDeployerAccountError = { type: 'InvalidDeployerAccountError' };
export type UnknownDeployerError = { type: 'UnknownDeployerError' };

// --- Method-Specific Error Types for Deployer ---
export type DeployContractError = DeploymentFailedError | InvalidDeployerAccountError | UnknownDeployerError;
export type DeployAllContractsError = DeploymentFailedError | InvalidDeployerAccountError | UnknownDeployerError;


abstract class VotingSystemDeployer {
	protected walletClient: WalletClient;
	protected publicClient: PublicClient;

	constructor(
		walletClient: WalletClient,
		publicClient: PublicClient,
	) {
		this.walletClient = walletClient;
		this.publicClient = publicClient;
	}

	public abstract deployVoterRegistry(): Promise<Result<Address, DeployContractError>>;
	public abstract deployCandidateRegistry(): Promise<Result<Address, DeployContractError>>;
	public abstract deployPartyRegistry(): Promise<Result<Address, DeployContractError>>;
	public abstract deployVotingSystem(
		voterRegistryAddress: Address,
		candidateRegistryAddress: Address,
		partyRegistryAddress: Address,
	): Promise<Result<Address, DeployContractError>>;

	public abstract deployAll(): Promise<Result<DeployedContractAddresses, DeployAllContractsError>>;
}

export { VotingSystemDeployer };
