import { defineConfig } from "vitest/config";
import {
	BaseSequencer,
	type TestSpecification,
	type Vitest as VitestFromVitestNode,
} from "vitest/node";

export default defineConfig({
	test: {
		bail: 1,
		cache: false,
		maxConcurrency: 1,
		sequence: {
			sequencer: class Seqencer extends BaseSequencer {
				protected override ctx: VitestFromVitestNode;

				constructor(ctx: VitestFromVitestNode) {
					super(ctx);
					this.ctx = ctx;
				}

				override async shard(files: TestSpecification[]) {
					return files;
				}

				override async sort(files: TestSpecification[]) {
					return files;
				}
			},
		},
		// maxWorkers: 1,
		// Force alphabetical file order
		fileParallelism: false,
		// Disable test isolation to ensure strict order
		isolate: false,
	},
});
