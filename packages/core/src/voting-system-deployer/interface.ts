import { PublicClient, WalletClient, Address } from "viem";
import { Result } from "true-myth";

// Define the structure for contract addresses that will be deployed
export type DeployedContractAddresses = {
	votingSystem: Address;
	voterRegistry: Address;
	candidateRegistry: Address;
	partyAddress: Address;
	// Add other contract addresses as needed
};

// --- Individual Error Types for Deployer ---
export type DeploymentFailedError = { type: "DeploymentFailedError" };
export type InvalidDeployerAccountError = {
	type: "InvalidDeployerAccountError";
};
export type UnknownDeployerError = { type: "UnknownDeployerError" };

// --- Method-Specific Error Types for Deployer ---
export type DeployContractError =
	| DeploymentFailedError
	| InvalidDeployerAccountError
	| UnknownDeployerError;
export type DeploySystemError =
	| DeploymentFailedError
	| InvalidDeployerAccountError
	| UnknownDeployerError;

abstract class VotingSystemDeployer {
	public abstract deployAll(): Promise<
		Result<DeployedContractAddresses, DeployAllContractsError>
	>;
}

export { VotingSystemDeployer };
