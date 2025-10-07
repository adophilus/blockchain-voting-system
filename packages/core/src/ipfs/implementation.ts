import { Result } from "true-myth";
import type { IpfsClient, IpfsUploadFileError } from "./interface";
import type { Helia } from "helia";
import { dagCbor, type DAGCBOR } from "@helia/dag-cbor";

class HeliaIpfsClient implements IpfsClient {
	private declare dag: DAGCBOR;

	constructor(private readonly helia: Helia) {
		this.dag = dagCbor(helia);
	}

	public async uploadFile(
		file: File,
	): Promise<Result<string, IpfsUploadFileError>> {
		try {
			const arrayBuffer = await file.arrayBuffer();
			const content = new Uint8Array(arrayBuffer);

			const result = await this.dag.add(content);
			console.log("IPFS upload result:", result);
			return Result.ok(result.toString());
		} catch (e: any) {
			console.error("Error uploading file to IPFS:", e);
			return Result.err({
				type: "IpfsUploadError",
				message: e.message || "Failed to upload file to IPFS",
			});
		}
	}
}

export { HeliaIpfsClient };
