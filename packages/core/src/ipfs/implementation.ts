import { Result } from "true-myth";
import type { IpfsClient, IpfsUploadFileError } from "./interface";
import type { Helia } from "helia";
import { dagCbor, DAGCBOR } from "@helia/dag-cbor";

class HeliaIpfsClient implements IpfsClient {
	private declare dagCbor: DAGCBOR;

	constructor(private readonly helia: Helia) {
		this.dagCbor = dagCbor(helia);
	}

	public async uploadFile(
		file: File,
	): Promise<Result<string, IpfsUploadFileError>> {
		try {
			const arrayBuffer = await file.arrayBuffer();
			const content = new Uint8Array(arrayBuffer);

			const result = await this.dagCbor.add(content);
			console.log("IPFS upload result:", result);
			return Result.ok(""); //' CID is returned as a string
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
