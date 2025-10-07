import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
	server: {
		PRIVATE_KEY: z.string().startsWith("0x"),
		CANDIDATE_1_PRIVATE_KEY: z.string().startsWith("0x"),
		CANDIDATE_2_PRIVATE_KEY: z.string().startsWith("0x"),
		VOTER_1_PRIVATE_KEY: z.string().startsWith("0x"),
		VOTER_2_PRIVATE_KEY: z.string().startsWith("0x"),
	},
	runtimeEnv: process.env,
});

export { env };
