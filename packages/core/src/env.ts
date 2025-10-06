import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
	server: {
		PRIVATE_KEY: z.string().min(1),
	},
	runtimeEnv: process.env,
});

export { env };
