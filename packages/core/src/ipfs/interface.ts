import type { Result } from "true-myth";

export type IpfsUploadError = { type: "IpfsUploadError"; message: string };
export type UnknownIpfsError = { type: "UnknownIpfsError"; message: string };
export type IpfsUploadFileError = IpfsUploadError | UnknownIpfsError;

export abstract class IpfsClient {
	public abstract uploadFile(
		file: File,
	): Promise<Result<string, IpfsUploadError | UnknownIpfsError>>;
}
