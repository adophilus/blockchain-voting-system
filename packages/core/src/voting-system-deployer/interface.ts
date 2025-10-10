import type { Result } from "true-myth";
import type { Address } from "viem";

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
	public abstract deploySystem(): Promise<Result<Address, DeploySystemError>>;
}

export { VotingSystemDeployer };
